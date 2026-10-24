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
    .replace("import illustrations from './illustrations.json';", `const illustrations = ${JSON.stringify(artwork)};`);
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
const { renderGuide, renderKazakhstanDeepDives } = await loadGuide();

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

test('five core explanations keep their order; three deep dives sit before cities', () => {
  const html = renderGuide();
  assert.deepEqual([...html.matchAll(/data-core-section="([^"]+)"/g)].map(match => match[1]),
    ['geography', 'history', 'resources', 'economy', 'education']);
  const group = html.indexOf('id="kazakhstan-deep-dives"');
  const education = html.indexOf('id="education"');
  const cities = html.indexOf('id="city-guides"');
  assert.ok(education < group && group < cities, 'Kazakhstan is a separate group after core education');
  let previous = group;
  for (const { id } of entries) {
    const position = html.indexOf(`id="${id}"`);
    assert.ok(previous < position && position < cities, `${id} is in narrative order`);
    previous = position;
  }
});

test('all guide table-of-contents targets exist exactly once', () => {
  const html = renderGuide();
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'No duplicate anchor IDs');
  const targetIds = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  for (const target of targetIds) assert.equal(ids.filter(id => id === target).length, 1, target);
  for (const { id } of entries) assert.ok(targetIds.includes(id), `${id} is reachable from the contents`);
});

test('deep dives render every paragraph, while existing cities and illustrations remain reachable', async () => {
  const html = renderGuide();
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  for (const { data } of entries) {
    assert.ok(html.includes(escape(data.intro)));
    for (const [heading, paragraphs] of data.chapters) {
      assert.ok(html.includes(`<summary>${escape(heading)}</summary>`));
      for (const paragraph of paragraphs) assert.ok(html.includes(`<p>${escape(paragraph)}</p>`), heading);
    }
  }
  for (const id of ['bukhara-history', 'history-samarkand', 'history-tashkent', 'history-bishkek', 'history-cholponata', 'history-almaty', 'architecture-comparative', 'architecture-guide']) {
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
});
