import fs from 'node:fs';
import assert from 'node:assert/strict';
import {join} from 'node:path';

const dist='dist';
for (const route of ['index.html','travel/tantantan/index.html','travel/caucasus/index.html']) {
  const file=join(dist,route);
  assert.ok(fs.existsSync(file), 'Missing published route '+route);
  const html=fs.readFileSync(file,'utf8');
  if (route.startsWith('travel/')) assert.match(html, /\/codex\/assets\/[^"']+\.js/, 'Missing built entry for '+route);
}
for (const route of ['tantantan/index.html','caucasus/index.html']) {
  assert.ok(!fs.existsSync(join(dist,route)), 'Duplicate top-level travel route must not be published: '+route);
}
for (const route of ['blog/index.html','blog/20261109-temporal.html','blog/20261103-patentlinter.html']) {
  const file=join(dist,route);
  assert.ok(fs.existsSync(file), 'Missing published blog route '+route);
}
const blogIndex=fs.readFileSync(join(dist,'blog/index.html'),'utf8');
assert.match(blogIndex, /\.\/20261109-temporal\.html/, 'Blog index must link to its article');
assert.match(blogIndex, /\.\/20261103-patentlinter\.html/, 'Blog index must link to PatentLinter');
assert.ok(blogIndex.indexOf('20261109-temporal.html') < blogIndex.indexOf('20261103-patentlinter.html'), 'Newest article first');
const root=fs.readFileSync(join(dist,'index.html'),'utf8');
assert.match(root, /\.\/travel\/tantantan\//);
assert.match(root, /\.\/blog\/20261103-patentlinter\.html/, 'Home card must link to migrated PatentLinter');
assert.match(root, /\.\/travel\/caucasus\//);
for (const file of ['sw-tantantan.js','sw-caucasus.js','sw.js','manifest-tantantan.webmanifest','manifest-caucasus.webmanifest']) {
  assert.ok(fs.existsSync(join(dist,file)), 'Missing PWA resource '+file);
}
const registry=JSON.parse(fs.readFileSync('travel/shared/images/caucasus-asset-registry.json','utf8'));
for(const asset of registry.assets){
  const path=join(dist,'illustrations',asset.file);
  assert.ok(fs.existsSync(path),'Missing published Caucasus asset '+asset.file);
  assert.equal(fs.statSync(path).size,asset.bytes,'WebP bytes changed: '+asset.file);
}
console.log('PASS: portfolio, canonical travel, and blog Pages routes and '+registry.assets.length+' shared Caucasus WebP artifacts');
