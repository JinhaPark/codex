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
      assert.ok(variant.height <= art.sourceHeight, 'Do not enlarge either source dimension');
      assert.ok(variant.width <= (art.editInputWidth || art.sourceWidth) && variant.height <= (art.editInputHeight || art.sourceHeight), 'Do not enlarge an existing edit target');
      const actualRatio = (art.generatedWidth || art.width) / (art.generatedHeight || art.height);
      assert.ok(Math.abs(variant.height - Math.round(variant.width / actualRatio)) <= (art.generatedWidth ? 0 : 1), 'Preserve decoded artwork ratio with pixel rounding');
      if (art.framingEdit === 'outpaint-top-and-clean-foreground') {
        assert.equal(art.original, 'IMG_9082.jpeg');
        assert.equal(art.id, 'samarkand-bibi-khanym-watercolor');
        assert.ok(actualRatio < art.sourceWidth / art.sourceHeight, 'Requested sky extension adds vertical space');
      } else {
        assert.ok(Math.abs((actualRatio / (art.sourceWidth / art.sourceHeight)) - 1) < 0.003, 'Keep the original framing within generator canvas rounding');
      }
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
    assert.ok(['watercolor', 'colored-pencil', 'documentary-photo'].includes(art.style));
  }
  assert.ok(!artwork.some(art => art.original === 'IMG_8981(1).jpeg'), 'Exclude the identical duplicate');
  assert.ok(!artwork.some(art => art.id === 'garden-eaves-watercolor'), 'Remove the requested garden photograph');
  assert.ok(!fs.readdirSync(new URL('../public/illustrations/', import.meta.url)).some(name => name.startsWith('garden-eaves-watercolor-')), 'Remove its published assets');
});

test('shared renderer emits only the manifest caption', async () => {
  const source = fs.readFileSync(new URL('../src/illustrations.js', import.meta.url), 'utf8')
    .replace("import illustrations from './illustrations.json';", `const illustrations = ${JSON.stringify(artwork)};`);
  const { renderIllustration } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  for (const art of artwork) {
    const html = renderIllustration(art.placement);
    assert.match(html, /<figcaption>[^<]+<\/figcaption>/);
    assert.doesNotMatch(html.match(/<figcaption>(.*?)<\/figcaption>/s)[1], /사진을?\s*바탕|사용자\s*제공|AI로?\s*생성|재해석|변환한/);
  }
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
  const gurEmir = artwork.find(art => art.original === 'IMG_8908.jpeg');
  assert.equal(gurEmir.id, 'samarkand-gur-emir-watercolor', 'Correct the previously mistaken Bibi-Khanym identification');
  assert.ok(coverage.find(row => row.place === '구르에미르 영묘').imageIds.includes(gurEmir.id));
  assert.equal(coverage.find(row => row.place === '비비하눔 모스크').classification, '확보');
  const bibi = artwork.find(a => a.original === 'IMG_9082.jpeg');
  assert.equal(bibi.placement, 'samarkand:6:detail');
  const mohi = artwork.find(a => a.id === 'bukhara-sitorai-pool-watercolor');
  assert.equal(mohi.license, 'CC0-1.0');
  assert.equal(mohi.creator, 'Bernard Gagnon');
  assert.equal(mohi.placement, 'bukhara:10:detail');
  assert.match(mohi.sourceUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  assert.ok(!artwork.some(a => a.original === 'IMG_9073.jpeg'), 'Unverified screenshot stays unpublished');
  const minorExterior = artwork.find(art => art.original === 'IMG_9014.jpeg');
  assert.equal(minorExterior.id, 'tashkent-minor-portrait-watercolor', 'Do not misidentify the white Minor facade as Bibi-Khanym');
  assert.ok(coverage.find(row => row.place === '타슈켄트 미노르 모스크').imageIds.includes(minorExterior.id));
  const arrivalDinner = artwork.find(art => art.id === 'travel-steak-table-pencil');
  assert.equal(arrivalDinner.placement, 'day:4:dinner');
  assert.equal(itinerary.days[4].date, '2026-10-16');
  assert.match(itinerary.days[4].dinnerKo.title, /SB bar/);
  for (const id of ids) assert.ok(coverage.some(row => row.imageIds.includes(id)), 'Account for ' + id);
});


test('summary-only tourist visits and unresolved places remain explicit', () => {
  const rows = JSON.parse(fs.readFileSync(new URL('../docs/audit/destination-images.json', import.meta.url)));
  for (const place of ['부하라 돔형 바자르', '브로드웨이 거리', '베르메트 야외 온천']) {
    assert.equal(rows.filter(r => r.place === place).length, 1, place);
  }
  for (const id of ['mountain-orchards-watercolor','uzbek-tilework-pencil','arabic-manuscript-pencil']) {
    assert.ok(!rows.some(r => r.classification === '확보' && r.imageIds.includes(id)));
  }
});


test('museum numeric and map panels stay documentary photographs', () => {
  const ids = ['aral-sea-exhibit-photo','ulughbeg-year-exhibit-photo'];
  assert.deepEqual(artwork.filter(a => a.style === 'documentary-photo').map(a => a.id).sort(), ids.sort());
  for (const id of ids) {
    const art = artwork.find(a => a.id === id);
    assert.equal(art.sourceKind, 'museum-panel-photo');
    assert.equal(art.generatedWidth, undefined, 'Do not synthesize numeric exhibits');
  }
});
