import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const modules = [
  ['kazakhstan-history', '초원의 유목사회에서 근대 국가로'],
  ['kazakhstan-political-economy', '독립 35년: 권력 집중과 경제발전'],
  ['kazakhstan-society', '현대 카자흐스탄의 사회와 알마티']
];

// Exercise the real renderer in Node without changing the browser's JSON imports.
// Only its existing illustration JSON import is inlined; all rendering stays intact.
async function loadGuide() {
  const illustrationUrl = new URL('../src/illustrations.js', import.meta.url);
  const artwork = JSON.parse(fs.readFileSync(new URL('../src/illustrations.json', import.meta.url)));
  const illustrationSource = fs.readFileSync(illustrationUrl, 'utf8')
    .replace("import illustrations from './illustrations.json';", `const illustrations = ${JSON.stringify(artwork)};`)
    .replace("import itineraryIllustrations from './itinerary-illustrations.json';", `const itineraryIllustrations = ${fs.readFileSync(new URL('../src/itinerary-illustrations.json', import.meta.url), 'utf8')};`);
  const illustrationModule = `data:text/javascript;base64,${Buffer.from(illustrationSource).toString('base64')}`;
  const guideUrl = new URL('../src/render-guide.js', import.meta.url);
  const source = fs.readFileSync(guideUrl, 'utf8').replace(/from\s+(['"])(\.\/[^'"]+)\1/g, (_, quote, path) => {
    const url = path === './illustrations.js' ? illustrationModule : new URL(path, guideUrl).href;
    return `from ${quote}${url}${quote}`;
  });
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

const entries = await Promise.all(modules.map(async ([id, title]) => {
  const { default: data } = await import(`../src/${id}.js`);
  return { id, title, data };
}));
const { renderGuide, renderKazakhstanDeepDives, guideEntries } = await loadGuide();

for (const { id, title, data } of entries) {
  test(`${id}: independently readable narrative has paragraphs and public sources`, () => {
    assert.equal(data.id, id);
    assert.equal(data.title, title);
    assert.equal(typeof data.intro, 'string');
    assert.ok(data.intro.trim().length > 0);
    assert.ok(Array.isArray(data.chapters) && data.chapters.length > 0);
    for (const [heading, paragraphs] of data.chapters) {
      assert.ok(typeof heading === 'string' && heading.trim().length > 0);
      assert.ok(Array.isArray(paragraphs) && paragraphs.length > 0);
      for (const paragraph of paragraphs) assert.ok(typeof paragraph === 'string' && paragraph.trim().length > 0);
    }
    assert.ok(Array.isArray(data.sources) && data.sources.length > 0);
    for (const [label, source] of data.sources) {
      assert.ok(typeof label === 'string' && label.trim().length > 0);
      assert.equal(new URL(source).protocol, 'https:');
    }
    assert.doesNotMatch(JSON.stringify(data), /Halyk\s*Arena|할릭\s*아레나|할리크\s*아레나/i);
  });
}

test('five core explanations keep their order; Kazakhstan remains a separate category', () => {
  assert.deepEqual(guideEntries.filter(e=>e.category === 'core').map(e=>e.id), ['geography','history','resources','economy','education']);
  assert.deepEqual(guideEntries.filter(e=>e.category === 'kazakhstan').map(e=>e.id), entries.map(e=>e.id));
  const html = guideEntries.filter(e=>e.category === 'core').map(e=>renderGuide({article:e.id})).join('');
  assert.deepEqual([...html.matchAll(/data-core-section="([^"]+)"/g)].map(m=>m[1]), ['geography','history','resources','economy','education']);
});

test('each inline guide also preserves a unique, independently readable article', () => {
  const ids = guideEntries.map(e=>e.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const category of ['core','cities','architecture','kazakhstan']) {
    const html = renderGuide({category});
    assert.doesNotMatch(html, /data-guide-article=/);
    for (const entry of guideEntries.filter(e=>e.category === category)) {
      assert.ok(html.includes(`data-guide-inline="${entry.id}"`));
      const article = renderGuide({article:entry.id});
      assert.ok(article.includes(`id="${entry.id}"`));
      const targets = [...article.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
      assert.equal(new Set(targets).size, targets.length, entry.id);
    }
  }
});

test('deep dives render every paragraph, while existing cities and illustrations remain reachable', async () => {
  const html = guideEntries.map(e=>renderGuide({article:e.id})).join('');
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  for (const { data } of entries) {
    assert.ok(html.includes(escape(data.intro)));
    for (const [heading, paragraphs] of data.chapters) {
      assert.ok(html.includes(`<h4>${escape(heading)}</h4>`));
      for (const paragraph of paragraphs) assert.ok(html.includes(`<p>${escape(paragraph)}</p>`), heading);
    }
  }
  for (const id of ['bukhara-history', 'history-samarkand', 'history-tashkent', 'history-bishkek', 'history-cholponata', 'history-almaty', 'architecture-comparative']) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
  const { default: almaty } = await import('../src/history-almaty.js');
  for (const [, body] of almaty.chapters) {
    const paragraphs = Array.isArray(body) ? body : body.split(/\n\s*\n/);
    for (const paragraph of paragraphs) assert.ok(html.includes(`<p>${escape(paragraph)}</p>`), 'Preserve Almaty text');
  }
  assert.match(html, /data-illustration="/);

});

test('deep-dive source notes use their actual verification date', () => {
  const html = renderKazakhstanDeepDives();
  assert.equal((html.match(/자료 확인: 2026-10-19/g) || []).length, 3);
  assert.doesNotMatch(html, /자료 확인: 2026-10-18/);
  for (const { data } of entries) for (const [, source] of data.sources) {
    assert.ok(html.includes(`href="${source.replaceAll('&', '&amp;')}"`), source);
  }
});


test('practical guidance moves to preparation with checkbox state preserved', async () => {
  const { renderPreparation } = await import('../src/render-preparation.js');
  const { essentials } = JSON.parse(fs.readFileSync(new URL('../src/itinerary.json', import.meta.url)));
  const html = renderPreparation(essentials, ['여권', '수영복'], { 1: true });
  const guide = renderGuide();
  for (const item of essentials) {
    assert.ok(html.includes(`<h3>${item.title}</h3><p>${item.body}</p>`));
    assert.ok(!guide.includes(`<summary>${item.title}</summary>`));
  }
  assert.match(html, /data-check="0" ><span>여권/);
  assert.match(html, /data-check="1" checked><span>수영복/);
  const charging = renderPreparation([], ['충전기와 보조배터리'], {0:true});
  assert.match(charging, /돼지코\(변환 어댑터\)를 따로 준비하지 않으셔도 됩니다/);
  assert.match(charging, /data-check="0" checked/);
  const cards = renderPreparation([], ['결제 카드와 현금']);
  assert.match(cards, /비자·마스터카드/);
  assert.match(cards, /AMEX\(아멕스\)는 결제할 수 없습니다/);
  assert.match(cards, /미국 달러\(USD\).*현지 환전소.*현지 통화로 환전/);
});

test('one continuous list reveals complete articles without nested chapter disclosures', async()=>{
 const html = renderGuide({category:'cities'});
 assert.equal((html.match(/data-guide-inline=/g)||[]).length, guideEntries.length);
 assert.ok(!html.includes('data-guide-category='));
 assert.ok(!html.includes('data-guide-open='));
 const bukhara = html.split('data-guide-inline="bukhara-history"')[1].split('data-guide-inline=')[0];
 for (const title of ['1. 오아시스와 이슬람 도시의 형성','2. 정복과 옛 시가지의 성장','3. 신앙·권력과 근현대의 변화','4. 현장에서 읽는 부하라','출처와 기준일']) assert.ok(bukhara.includes(title), title);
 assert.ok(!bukhara.includes('data-reader-section'));
 assert.ok(bukhara.includes('bukhara-samani-watercolor'));
 assert.ok(html.indexOf('guide-group-core') < html.indexOf('guide-group-cities'));
 assert.ok(html.indexOf('guide-group-cities') < html.indexOf('guide-group-kazakhstan'));
 assert.ok(renderGuide({article:'bukhara-history'}).includes('data-guide-article="bukhara-history"'));
});

test('Islamic architecture has one category and article without repeated destination listings',()=>{
 const html=renderGuide();
 assert.ok(html.includes('id="guide-group-architecture"'));
 assert.equal(guideEntries.filter(e=>e.category==='architecture').length,1);
 assert.equal(guideEntries.find(e=>e.id==='bukhara-history').title,'부하라');
 const article=renderGuide({article:'architecture-comparative'});
 assert.ok(article.includes('재료에서 공간으로'));
 assert.ok(article.includes('사마르칸트와 부하라의 건축 유산'));
 assert.ok(article.includes('architecture:Samarkand:intro') || article.includes('data-illustration='));
 assert.ok(!article.includes('class="architecture-site"'));
 assert.ok(!article.includes('Registan Square'));
 assert.ok(!article.includes('Po-i-Kalyan'));
 assert.equal(renderGuide({article:'architecture-guide'}),article);
});
