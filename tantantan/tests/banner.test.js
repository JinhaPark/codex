import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';


const artwork = JSON.parse(fs.readFileSync(new URL('../../shared/images/illustrations.json', import.meta.url)));
const lineage = JSON.parse(fs.readFileSync(new URL('../../shared/images/image-lineage.json', import.meta.url)));
const source = fs.readFileSync(new URL('../src/render-banner.js', import.meta.url), 'utf8').replace("import illustrations from '../../shared/images/illustrations.json';", `const illustrations = ${JSON.stringify(artwork)};`);
const {renderBanner} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('lake banner keeps readable HTML text and responsive priority artwork', () => {
  const html = renderBanner();
  assert.equal((html.match(/<h1>/g)||[]).length, 1);
  for (const text of ['중앙아시아','탄탄탄','실크로드 여행기','2026.10.12','우즈베키스탄','키르기스스탄','카자흐스탄']) assert.ok(html.includes(text));
  assert.match(html, /<header class="site-banner">/);
  assert.match(html, /class="banner-landscape"/);
  assert.match(html, /srcset=/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /alt="" aria-hidden="true"/);
  assert.doesNotMatch(html, /silk-road-banner|loading="lazy"/);
});

test('retired map is unpublished while its history and archived WebPs remain', () => {
  assert.ok(!artwork.some(art=>art.id === 'silk-road-banner-watercolor'));
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
