import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const artwork = JSON.parse(fs.readFileSync(new URL('../src/illustrations.json', import.meta.url)));

test('published illustration variants are complete WebP files with the recorded sizes', () => {
  assert.equal(artwork.length, 12);
  for (const art of artwork) {
    assert.equal(art.variants.length, 3);
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
    assert.ok(art.variants.find(variant => variant.width === 800).bytes <= 250_000);
  }
});

test('each subject has one editorial placement, Korean caption and descriptive Korean alt text', () => {
  for (const field of ['id', 'placement', 'caption', 'original']) {
    assert.equal(new Set(artwork.map(art => art[field])).size, artwork.length, field);
  }
  for (const art of artwork) {
    assert.match(art.caption, /[가-힣]/);
    assert.match(art.alt, /[가-힣]/);
    assert.ok(art.alt.length > 15);
    assert.ok(['watercolor', 'colored-pencil'].includes(art.style));
  }
  assert.ok(!artwork.some(art => art.original === 'IMG_8981(1).jpeg'), 'Exclude the identical duplicate');
});
