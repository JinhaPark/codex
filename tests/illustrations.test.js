import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const artwork = JSON.parse(fs.readFileSync(new URL('../src/illustrations.json', import.meta.url)));

test('published illustration variants are complete WebP files with the recorded sizes', () => {
  assert.ok(artwork.length > 0);
  const expectedFiles = artwork.flatMap(art => art.variants.map(v => v.file)).sort();
  assert.equal(new Set(expectedFiles).size, expectedFiles.length);
  assert.deepEqual(fs.readdirSync(new URL('../public/illustrations/', import.meta.url)).sort(), expectedFiles);
  for (const art of artwork) {
    assert.ok(art.variants.length >= 1 && art.variants.length <= 3);
    assert.equal(new Set(art.variants.map(v => v.width)).size, art.variants.length);
    for (const variant of art.variants) {
      const bytes = fs.readFileSync(new URL(`../public/illustrations/${variant.file}`, import.meta.url));
      assert.equal(bytes.length, variant.bytes, variant.file);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, 'Complete RIFF payload');
      assert.ok(variant.width <= art.sourceWidth, 'Do not enlarge the source photograph');
      assert.ok(Math.abs(variant.width / variant.height - art.sourceWidth / art.sourceHeight) < 0.002);
      // Inspect actual WebP chunks rather than arbitrary compressed pixel bytes.
      for (let offset = 12; offset + 8 <= bytes.length;) {
        const chunk = bytes.toString('ascii', offset, offset + 4);
        assert.ok(!['EXIF', 'XMP ', 'ICCP'].includes(chunk), `Private metadata absent: ${chunk}`);
        const size = bytes.readUInt32LE(offset + 4);
        offset += 8 + size + size % 2;
      }
    }
    assert.ok((art.variants.find(variant => variant.width === 800) || art.variants.at(-1)).bytes <= (art.standardByteBudget || 250_000));
  }
});

test('each subject has one editorial placement, Korean caption and descriptive Korean alt text', () => {
  for (const field of ['id', 'placement', 'caption', 'original']) {
    assert.equal(new Set(artwork.map(art => art[field])).size, artwork.length, field);
  }
  for (const art of artwork) {
    assert.doesNotMatch(art.caption + art.alt, /사진을? 바탕|사용자 제공|AI로? 생성|재해석|그린 수채화|그린 색연필화/);
    assert.match(art.caption, /[가-힣]/);
    assert.match(art.alt, /[가-힣]/);
    assert.ok(art.alt.length > 15);
    assert.ok(['watercolor', 'colored-pencil'].includes(art.style));
  }
  assert.ok(!artwork.some(art => art.original === 'IMG_8981(1).jpeg'), 'Exclude the identical duplicate');
  assert.ok(!artwork.some(art => art.id === 'garden-eaves-watercolor'), 'Remove the requested garden photograph');
  assert.ok(!fs.readdirSync(new URL('../public/illustrations/', import.meta.url)).some(name => name.startsWith('garden-eaves-watercolor-')), 'Remove its published assets');
});

test('shared renderer emits only the manifest caption', () => {
  const renderer = fs.readFileSync(new URL('../src/illustrations.js', import.meta.url), 'utf8');
  assert.ok(renderer.includes('<figcaption>${escape(art.caption)}</figcaption>'));
  assert.doesNotMatch(renderer, /사진을 바탕|사용자 제공|AI로? 생성|재해석/);
});


test('destination audit covers the itinerary and only links published, identified subjects', () => {
  const coverage = JSON.parse(fs.readFileSync(new URL('../docs/audit/destination-images.json', import.meta.url)));
  const itinerary = JSON.parse(fs.readFileSync(new URL('../src/itinerary.json', import.meta.url)));
  const names = new Set(coverage.map(row => row.place));
  assert.equal(names.size, coverage.length);
  for (const day of itinerary.days) for (const place of day.placesKo) {
    assert.ok(names.has(place.startsWith('인천국제공항') ? '인천국제공항' : place), place);
  }
  const ids = new Set(artwork.map(art => art.id));
  for (const row of coverage) {
    assert.ok(['확보', '부분 확보', '장소 확인 필요', '누락', '선택 사항'].includes(row.classification));
    for (const id of row.imageIds) assert.ok(ids.has(id), row.place + ': ' + id);
    if (['확보', '부분 확보'].includes(row.classification)) assert.ok(row.imageIds.length > 0, row.place);
    if (row.classification === '누락') assert.deepEqual(row.imageIds, [], row.place);
  }
  for (const id of ids) assert.ok(coverage.some(row => row.imageIds.includes(id)), 'Account for ' + id);
});
