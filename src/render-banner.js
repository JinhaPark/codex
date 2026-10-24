import illustrations from './illustrations.json';

export function renderBanner() {
  const art = illustrations.find(item=>item.placement === 'site:banner');
  const base = `${import.meta.env?.BASE_URL || '/codex/'}illustrations/`;
  const image = art ? `<img class="site-banner-art" data-banner="${art.id}" src="${base}${art.variants.at(-1).file}" srcset="${art.variants.map(v=>`${base}${v.file} ${v.width}w`).join(', ')}" sizes="100vw" width="${art.width}" height="${art.height}" alt="" aria-hidden="true" fetchpriority="high" decoding="async">` : '';
  return `<header class="site-banner">${image}<div class="site-title-band"><div class="site-title-line" tabindex="0" role="region" aria-label="여행 제목과 기간·방문 국가"><h1>중앙아시아 <em>탄탄탄</em></h1><p class="site-trip-label">실크로드 여행기 · <time datetime="2026-10-12">2026.10.12</time>—<time datetime="2026-10-21">21</time></p><p class="site-countries">우즈베키스탄 · 키르기스스탄 · 카자흐스탄</p></div></div></header>`;
}
