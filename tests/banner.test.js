import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { renderBanner } from '../src/render-banner.js';

const artwork = JSON.parse(fs.readFileSync(new URL('../src/illustrations.json', import.meta.url)));
const lineage = JSON.parse(fs.readFileSync(new URL('../docs/image-lineage.json', import.meta.url)));

test('plain banner retains the title, dates, and countries as HTML without a map request', () => {
  const html = renderBanner();
  assert.equal((html.match(/<h1>/g)||[]).length, 1);
  for (const text of ['중앙아시아','탄탄탄','실크로드 여행기','2026.10.12','우즈베키스탄','키르기스스탄','카자흐스탄']) assert.ok(html.includes(text));
  assert.match(html, /<header class="site-banner">/);
  assert.doesNotMatch(html, /<img|srcset|data-banner|site-title-line/);
});

test('retired map is unpublished while its history and archived WebPs remain', () => {
  assert.ok(!artwork.some(art=>art.purpose === 'site-banner' || art.id === 'silk-road-banner-watercolor'));
  const image = lineage.images.find(item=>item.illustrationId === 'silk-road-banner-watercolor');
  assert.equal(image.lifecycle, 'archived');
  assert.equal(image.activeRevisionId, null);
  assert.equal(image.placement, null);
  assert.equal(image.lastPublishedRevisionId, 'silk-road-banner-watercolor-r5');
  for (const revision of image.revisions) {
    assert.equal(revision.lifecycle, 'archived');
    for (const variant of revision.variants) assert.ok(fs.existsSync(new URL('../'+variant.file, import.meta.url)));
  }
});
