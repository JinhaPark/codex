import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const artwork = read('../src/illustrations.json');
const itinerary = read('../src/itinerary.json');
const references = read('../src/itinerary-illustrations.json');
const source = fs.readFileSync(new URL('../src/illustrations.js', import.meta.url), 'utf8')
  .replace("import illustrations from './illustrations.json';", `const illustrations = ${JSON.stringify(artwork)};`)
  .replace("import itineraryIllustrations from './itinerary-illustrations.json';", `const itineraryIllustrations = ${JSON.stringify(references)};`);
const renderer = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const idsIn = html => [...html.matchAll(/data-illustration="([^"]+)"/g)].map(m=>m[1]);
const referencedIds = day => [...Object.values(day.places).flat(), ...day.extras.flatMap(group=>group.ids)];
function renderDate(date) {
  const index = itinerary.days.findIndex(day=>day.date === date);
  const day = itinerary.days[index];
  return [...day.placesKo.map(place=>renderer.renderItineraryIllustrations(date, place)),
    ...['hotel','places','dinner','tip'].map(slot=>renderer.renderIllustration(`day:${index}:${slot}`)),
    renderer.renderItineraryIllustrationExtras(date)].join('');
}

test('every guide illustration also has one explicit itinerary reference', () => {
  assert.equal(new Set(references.map(day=>day.date)).size, references.length);
  const ids = references.flatMap(referencedIds);
  assert.equal(new Set(ids).size, ids.length, 'One itinerary appearance per shared illustration');
  for (const day of references) {
    const actual = itinerary.days.find(item=>item.date === day.date);
    assert.ok(actual, day.date);
    for (const place of Object.keys(day.places)) assert.ok(actual.placesKo.includes(place), place);
    assert.ok(referencedIds(day).every(id=>artwork.some(art=>art.id === id)));
  }
  for (const art of artwork.filter(art=>!art.placement.startsWith('day:'))) {
    assert.ok(ids.includes(art.id), art.id);
    assert.ok(renderer.renderIllustration(art.placement).includes(`data-illustration="${art.id}"`), 'Canonical guide appearance remains available');
  }
});

test('Lyabi-Hauz evening moves from October 14 to October 13 without replacing the market image', () => {
  const id = 'lyabi-hauz-evening-watercolor';
  assert.ok(idsIn(renderDate('2026-10-13')).includes(id));
  assert.ok(!idsIn(renderDate('2026-10-14')).includes(id));
  assert.ok(idsIn(renderDate('2026-10-13')).includes('bukhara-market-sunset-watercolor'));
  assert.equal(artwork.find(art=>art.id === id).placement, 'day:1:lyabi-hauz');
});

test('each date renders each illustration once with the original responsive asset and caption', () => {
  for (const day of itinerary.days) {
    const html = renderDate(day.date), ids = idsIn(html);
    assert.equal(new Set(ids).size, ids.length, day.date);
    for (const id of ids) {
      const art = artwork.find(item=>item.id === id);
      assert.ok(html.includes(art.variants[0].file), id);
      assert.ok(html.includes(art.caption), id);
    }
  }
});

test('unconfirmed subjects stay in labeled reference groups instead of destination cards', () => {
  const unconfirmed = ['mountain-orchards-watercolor','uzbek-tilework-pencil','arabic-manuscript-pencil','zoroastrian-ossuary-pencil','aral-sea-exhibit-photo'];
  for (const id of unconfirmed) {
    const day = references.find(day=>day.extras.some(group=>group.ids.includes(id)));
    assert.ok(day, id);
    assert.ok(!Object.values(day.places).flat().includes(id), id);
    assert.match(day.extras.find(group=>group.ids.includes(id)).note, /확인되지/);
  }
});

test('petroglyph area captions and alt text do not describe a museum', () => {
  for (const id of ['cholponata-petroglyph-field-watercolor','cholponata-balbal-pencil']) {
    const art = artwork.find(item=>item.id === id);
    assert.doesNotMatch(art.caption + art.alt, /박물관|museum/i);
    assert.match(art.caption, /암각화 구역/);
  }
  assert.equal(artwork.find(art=>art.id === 'cholponata-balbal-pencil').caption, '촐폰아타 암각화 구역 — 발발 석상');
});
