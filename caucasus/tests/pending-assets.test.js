import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const pending=JSON.parse(fs.readFileSync(new URL('../../shared/images/pending/caucasus-undated-assets.json',import.meta.url)));
test('unconfirmed-date Caucasus photo derivatives remain unpublished',()=>{
 assert.equal(pending.images.length,7);
 for(const item of pending.images){
  assert.equal(item.date,null);
  assert.equal(item.publicationStatus,'unpublished');
  assert.equal(fs.existsSync(new URL('../../shared/public/illustrations/'+item.sourceRootFile,import.meta.url)),false,'Undated artwork must remain outside the public directory');
  const bytes=fs.readFileSync(new URL('../../'+item.path,import.meta.url));
  assert.equal(bytes.length,item.bytes);
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),item.gitBlobSha);
 }
});
