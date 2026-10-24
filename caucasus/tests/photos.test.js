import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const registry=JSON.parse(fs.readFileSync(new URL('../../shared/images/caucasus-asset-registry.json',import.meta.url)));
const catalog=JSON.parse(fs.readFileSync(new URL('../../shared/images/caucasus-photo-catalog.json',import.meta.url)));
const itinerary=JSON.parse(fs.readFileSync(new URL('../itinerary.json',import.meta.url)));
function decodeDimensions(bytes){
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(bytes.readUInt32LE(4)+8,bytes.length);
  const chunk=bytes.toString('ascii',12,16);
  if(chunk==='VP8 ')return [bytes.readUInt16LE(26)&0x3fff,bytes.readUInt16LE(28)&0x3fff];
  if(chunk==='VP8L')return [1+bytes[21]+((bytes[22]&0x3f)<<8),1+(bytes[22]>>6)+(bytes[23]<<2)+((bytes[24]&0x0f)<<10)];
  if(chunk==='VP8X')return [1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16),1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16)];
  throw Error('Unsupported WebP chunk '+chunk);
}
test('all uploaded WebP files are migrated intact and follow the naming rule',()=>{
 const files=fs.readdirSync(new URL('../../shared/public/illustrations/',import.meta.url));
 assert.equal(registry.assets.length,21);
 const ids=new Set();
 for(const asset of registry.assets){
   assert.match(asset.file,/^caucasus-\d{8}-[a-z0-9-]+-(?:watercolor|colored-pencil|documentary-photo)-\d+\.webp$/);
   assert.ok(!ids.has(asset.file), 'duplicate asset '+asset.file);ids.add(asset.file);
   const bytes=fs.readFileSync(new URL('../../shared/public/illustrations/'+asset.file,import.meta.url));
   assert.equal(bytes.length,asset.bytes);
   assert.equal(decodeDimensions(bytes)[0],asset.width);
   assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),asset.gitBlobSha);
   if(asset.sha256)assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
   assert.ok(files.includes(asset.file));
 }
 const oversized=registry.assets.filter(asset=>asset.bytes>250000).map(a=>a.file).sort();
 assert.deepEqual(oversized,[
  'caucasus-20260430-baku-maiden-tower-watercolor-1086.webp',
  'caucasus-20260430-gobustan-entrance-sign-watercolor-1448.webp',
  'caucasus-20260430-gobustan-rock-landscape-watercolor-1536.webp',
  'caucasus-20260504-jvari-monastery-watercolor-1086.webp',
  'caucasus-20260507-vardzia-watercolor-1448.webp',
  'caucasus-20260501-sheki-street-watercolor-1200.webp'
 ].sort(),'Track uploaded images still awaiting re-encoding to the skill\'s 250 KB budget');
});
test('all photo placements resolve and optional activities are scoped',()=>{
 const known=new Set(catalog.photos.map(p=>p.id));
 for(const day of itinerary.days){
   for(const place of day.places)for(const id of place.photoIds||[])assert.ok(known.has(id),day.date+' '+id);
   for(const photo of day.photoObservations||[])assert.ok(known.has(photo.imageId),day.date+' '+photo.imageId);
 }
 assert.deepEqual(itinerary.optionalTours.map(x=>x.id).sort(),[1,3,4]);
 assert.ok(catalog.photos.every(p=>p.variants.length>0));
 assert.ok(catalog.photos.every(p=>p.variants.every(v=>registry.assets.some(a=>a.file===v.file))));
});


test('Caucasus migration ledger keeps immutable source references and valid publication pointers',()=>{
 const ledger=JSON.parse(fs.readFileSync(new URL('../../shared/images/caucasus-image-lineage.json',import.meta.url)));
 const active=ledger.images.filter(i=>i.lifecycle==='active');
 assert.equal(active.length,catalog.photos.filter(photo=>photo.status!=='candidate').length);
 const archived=ledger.images.filter(i=>i.lifecycle==='archived');
 assert.ok(archived.some(i=>i.illustrationId==='caucasus-20260501-azerbaijan-aliyev-portrait-documentary-photo' && i.revisions[0].historyArtifactRef?.commitSha),'Prior publication is recoverable in Git history');
 assert.ok(archived.every(i=>i.activeRevisionId===null),'Archived images are not published');
 const byId=new Map(ledger.images.map(i=>[i.illustrationId,i]));
 assert.equal(catalog.photos.find(p=>p.id==='caucasus-20260501-azerbaijan-aliyev-portrait-watercolor')?.variants.length,1);
 assert.ok(!registry.assets.some(a=>a.file.includes('aliyev-portrait-documentary-photo')),'Superseded Aliyev assets unpublished');
 assert.equal(itinerary.days.find(d=>d.date==='2026-05-03').places.some(p=>p.name==='즈바리 수도원'),false);
 const may4=itinerary.days.find(d=>d.date==='2026-05-04');
 assert.ok(may4.places.some(p=>p.name==='즈바리 수도원' && p.photoIds.includes('caucasus-20260504-jvari-monastery-watercolor')));
 for(const photo of catalog.photos){
  const image=byId.get(photo.id);assert.ok(image);
  assert.equal(image.sourceArtifactRef,null);
  assert.ok(image.sourceSha256===null||/^[a-f0-9]{64}$/.test(image.sourceSha256));
  assert.equal(image.revisions.length,1);
  assert.equal(image.revisions[0].recipeKey,null,'Never fabricate a visual cache hit');
  assert.equal(image.revisions[0].variants.length,photo.variants.length);
  if(photo.status==='candidate')assert.equal(image.activeRevisionId,null);
  else assert.equal(image.activeRevisionId,image.revisions[0].revisionId);
  for(const variant of image.revisions[0].variants){
   const asset=registry.assets.find(a=>'shared/public/illustrations/'+a.file===variant.file);
   assert.ok(asset);assert.equal(variant.gitBlobSha,asset.gitBlobSha);
  }
 }
});
