import test from 'node:test';
import assert from 'node:assert/strict';
import {groupChapters, renderNumberedSections} from '../src/guide-sections.js';
import {parseGuideRoute} from '../src/guide-reader.js';
const modules = [
 ['central-asia-geography-climate','geography'], ['central-asia-history','history'], ['central-asia-power-datacenters','resources'],
 ['central-asia-economy','economy'], ['central-asia-education','education'], ['bukhara-history','bukhara'],
 ...['samarkand','tashkent','bishkek','cholponata','almaty'].map(id=>['history-'+id,id]),
 ...['history','political-economy','society'].map(id=>['kazakhstan-'+id,'kazakhstan-'+id]),
 ['islamic-architecture-comparative','comparative'],
];
for (const [module,key] of modules) test(`${key}: groups preserve all original chapters, order, and illustration indexes`, async()=>{
 const {default:data} = await import(`../src/${module}.js`);
 const groups = groupChapters(data.chapters, key);
 assert.ok(groups.length <= 4);
 assert.ok(groups.every(g=>g.items.length > 0));
 const items = groups.flatMap(g=>g.items);
 assert.deepEqual(items.map(i=>i.chapter), data.chapters);
 assert.deepEqual(items.map(i=>i.index), data.chapters.map((_,i)=>i));
 const html = renderNumberedSections(data.chapters, key, ([,p])=>`<p>${p}</p>`);
 assert.equal((html.match(/<details /g)||[]).length, groups.length);
 assert.equal((html.match(/<h4>/g)||[]).length, data.chapters.length);
 assert.equal((html.match(/ open>/g)||[]).length,1);
});
test('fragment routes resolve articles and legacy bookmarks without trusting unknown ids',()=>{
 const entries = [{id:'history',category:'core'}, {id:'history-almaty',category:'cities'}];
 assert.deepEqual(parseGuideRoute('#guide/cities/history-almaty/almaty-section-3',entries),{tab:'guide',category:'cities',article:'history-almaty',section:'almaty-section-3'});
 assert.deepEqual(parseGuideRoute('#silk-road-introduction',entries),{tab:'guide',category:'core',article:'history',section:''});
 assert.equal(parseGuideRoute('#history-almaty',entries).article,'history-almaty');
 assert.equal(parseGuideRoute('#guide/fake/missing',entries).article,'');
 assert.equal(parseGuideRoute('#guide/fake/missing',entries).category,'core');
 assert.equal(parseGuideRoute('#city-guides',entries).category,'cities');
 assert.equal(parseGuideRoute('#kazakhstan-deep-dives',entries).category,'kazakhstan');
 assert.deepEqual(parseGuideRoute('#tab/list',entries),{tab:'list'});
 assert.equal(parseGuideRoute('#unknown',entries),null);
});
