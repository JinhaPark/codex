import illustrations from './illustrations.json';
import itineraryIllustrations from './itinerary-illustrations.json';

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

// Keep one canonical editorial placement; itinerary references reuse the same asset.
export function renderIllustration(placement) {
  const art = illustrations.find(item => item.placement === placement);
  return renderArtwork(art);
}

export function renderIllustrationById(id) {
  return renderArtwork(illustrations.find(item => item.id === id));
}

function renderArtwork(art) {
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

// Secondary appearances are explicit, date-based references rather than copied assets.
export function renderItineraryIllustrations(date, place) {
  const day = itineraryIllustrations.find(item => item.date === date);
  return (day?.places[place] || []).map(renderIllustrationById).join('');
}

export function renderItineraryIllustrationExtras(date) {
  const day = itineraryIllustrations.find(item => item.date === date);
  return (day?.extras || []).map(group => `<article class="itinerary-illustration-context"><h3>${escape(group.title)}</h3>${group.note ? `<p>${escape(group.note)}</p>` : ''}${group.ids.map(renderIllustrationById).join('')}</article>`).join('');
}
