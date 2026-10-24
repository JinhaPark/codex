import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const artwork = JSON.parse(fs.readFileSync(new URL('../src/illustrations.json', import.meta.url)));
const source = fs.readFileSync(new URL('../src/render-banner.js', import.meta.url), 'utf8')
  .replace("import illustrations from './illustrations.json';", `const illustrations = ${JSON.stringify(artwork)};`);
const {renderBanner} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('banner keeps the title and trip metadata as accessible HTML instead of baked-in image text', () => {
  const html = renderBanner();
  assert.equal((html.match(/<h1>/g)||[]).length, 1);
  for (const text of ['중앙아시아','탄탄탄','실크로드 여행기','2026.10.12','우즈베키스탄','키르기스스탄','카자흐스탄']) assert.ok(html.includes(text));
  assert.match(html, /class="site-title-line" tabindex="0" role="region"/);
  assert.match(html, /alt="" aria-hidden="true"/);
  assert.match(html, /fetchpriority="high"/);
  assert.doesNotMatch(html, /loading="lazy"|figcaption/);
});

test('banner uses audited responsive artwork and preserves its reference proportions', () => {
  const banners = artwork.filter(art=>art.purpose === 'site-banner');
  assert.equal(banners.length,1);
  const banner = banners[0];
  assert.equal(banner.id,'silk-road-banner-watercolor');
  assert.equal(banner.placement,'site:banner');
  assert.ok(Math.abs((banner.width / banner.height) / (banner.sourceWidth / banner.sourceHeight) - 1) < .003);
  assert.equal(banner.framingEdit,undefined);
  for (const variant of banner.variants) {
    assert.ok(renderBanner().includes(variant.file));
    assert.ok(variant.width<=banner.sourceWidth && variant.height<=banner.sourceHeight);
    assert.ok(variant.bytes<=250000);
  }
});
