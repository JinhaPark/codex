import illustrations from './illustrations.json';

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

// Keep every illustration at one editorial location, rather than duplicating galleries.
export function renderIllustration(placement) {
  const art = illustrations.find(item => item.placement === placement);
  if (!art) return '';
  const base = `${(import.meta.env?.BASE_URL || '/codex/')}illustrations/`;
  const standard = art.variants.find(variant => variant.width === 800) || art.variants.at(-1);
  const srcset = art.variants.map(variant => `${base}${variant.file} ${variant.width}w`).join(', ');
  const portrait = art.height > art.width;
  const sizes = portrait ? '(max-width: 430px) calc(100vw - 90px), 360px' : '(max-width: 760px) calc(100vw - 90px), 668px';
  return `<figure class="journal-illustration${portrait ? ' journal-illustration--portrait' : ''}" data-illustration="${escape(art.id)}">
    <img src="${escape(base + standard.file)}" srcset="${escape(srcset)}" sizes="${sizes}" width="${art.width}" height="${art.height}" alt="${escape(art.alt)}" loading="lazy" decoding="async">
    <figcaption>${escape(art.caption)}</figcaption>
  </figure>`;
}

export function renderIllustratedParagraphs(paragraphs, section, chapter) {
  return paragraphs.map((paragraph, index) => `<p>${escape(paragraph)}</p>${renderIllustration(`${section}:${chapter}:${index}`)}`).join('');
}
