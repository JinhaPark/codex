import fs from 'node:fs';
import assert from 'node:assert/strict';
import {join} from 'node:path';

const dist='dist';
for (const route of ['index.html','tantantan/index.html','caucasus/index.html']) {
  const file=join(dist,route);
  assert.ok(fs.existsSync(file), 'Missing published route '+route);
  const html=fs.readFileSync(file,'utf8');
  assert.match(html, /\/codex\/assets\/[^"']+\.js/, 'Missing built entry for '+route);
}
const root=fs.readFileSync(join(dist,'index.html'),'utf8');
assert.match(root, /\.\/tantantan\//);
assert.match(root, /\.\/caucasus\//);
for (const file of ['sw-tantantan.js','sw-caucasus.js','sw.js','manifest-tantantan.webmanifest','manifest-caucasus.webmanifest']) {
  assert.ok(fs.existsSync(join(dist,file)), 'Missing PWA resource '+file);
}
const registry=JSON.parse(fs.readFileSync('shared/images/caucasus-asset-registry.json','utf8'));
for(const asset of registry.assets){
  const path=join(dist,'illustrations',asset.file);
  assert.ok(fs.existsSync(path),'Missing published Caucasus asset '+asset.file);
  assert.equal(fs.statSync(path).size,asset.bytes,'WebP bytes changed: '+asset.file);
}
console.log('PASS: three Pages routes and '+registry.assets.length+' shared Caucasus WebP artifacts');
