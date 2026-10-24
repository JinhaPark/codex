import illustrations from './illustrations.json';

export function renderBanner() {
  const art = illustrations.find(item => item.id === 'issyk-kul-banner-watercolor');
  const base = `${import.meta.env?.BASE_URL || '/codex/'}illustrations/`;
  const standard = art.variants.find(variant => variant.width === 800) || art.variants.at(-1);
  const srcset = art.variants.map(variant => `${base}${variant.file} ${variant.width}w`).join(', ');
  return `<header class="site-banner"><img class="banner-landscape" src="${base}${standard.file}" srcset="${srcset}" sizes="(max-width: 700px) 900px, 100vw" width="${art.width}" height="${art.height}" alt="" aria-hidden="true" fetchpriority="high" decoding="async"><div class="banner-copy"><div class="eyebrow">실크로드 여행기 · <time datetime="2026-10-12">2026.10.12</time>—<time datetime="2026-10-21">21</time></div><h1>중앙아시아 <em>탄탄탄</em></h1><p>우즈베키스탄 · 키르기스스탄 · 카자흐스탄</p></div></header>`;
}
