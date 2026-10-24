import economy from './central-asia-economy.js';
import education from './central-asia-education.js';
import { renderNumberedSections } from './guide-sections.js';
import geography from './central-asia-geography-climate.js';
import history from './central-asia-history.js';
import resources from './central-asia-power-datacenters.js';
import { renderEconomy, renderSources, escapeHtml as esc } from './render-economy.js';
import { renderEducation } from './render-education.js';
import bukhara from './bukhara-history.js';
import samarkand from './history-samarkand.js';
import tashkent from './history-tashkent.js';
import bishkek from './history-bishkek.js';
import cholponata from './history-cholponata.js';
import almaty from './history-almaty.js';
import architecture from './uzbekistan-architecture.js';
import comparative from './islamic-architecture-comparative.js';
import kazakhstanHistory from './kazakhstan-history.js';
import kazakhstanPoliticalEconomy from './kazakhstan-political-economy.js';
import kazakhstanSociety from './kazakhstan-society.js';
import { renderIllustration, renderIllustratedParagraphs } from './illustrations.js';

function renderNarrative(data, {id = data.id, placement = data.id, core = false, chapterIllustrations = {}} = {}) {
  return `<section class="bukhara-history${core ? ' core-section' : ''}" id="${esc(id)}" ${core ? `data-core-section="${esc(data.id)}"` : ''}>
    <h3>${esc(data.title)}</h3><p class="bukhara-intro">${esc(data.intro)}</p>
    <div class="bukhara-chapters">${renderNumberedSections(data.chapters, placement, ([, body], i) => {
      const paragraphs = Array.isArray(body) ? body : body.split(/\n\s*\n/);
      return `${renderIllustratedParagraphs(paragraphs, placement, i)}${renderIllustration(`${placement}:${i}:detail`)}${chapterIllustrations[i] ? renderIllustration(chapterIllustrations[i]) : ''}`;
    })}</div>${data.notes?.length ? `<details class="source-notes"><summary>수치와 해석의 근거 더 보기</summary>${data.notes.map(note => `<p>${esc(note)}</p>`).join('')}</details>` : ''}${renderSources(data.sources || [], data.verifiedAt)}</section>`;
}
const kazakhstanEssays = [kazakhstanHistory, kazakhstanPoliticalEconomy, kazakhstanSociety];
export function renderKazakhstanDeepDives() {
  return `<section class="kazakhstan-deep-dives" aria-labelledby="kazakhstan-deep-dives">
    <h2 id="kazakhstan-deep-dives">카자흐스탄 심층 해설</h2>
    <p>국가 형성의 역사에서 독립 이후 정치·경제를 거쳐 오늘날 알마티의 시민 생활로 이어집니다.</p>
    <nav class="guide-toc" aria-label="카자흐스탄 심층 해설 목차">${kazakhstanEssays.map(essay => `<a href="#${esc(essay.id)}">${esc(essay.title)}</a>`).join('')}</nav>
    ${kazakhstanEssays.map(essay => renderNarrative({...essay, verifiedAt:'2026-10-19'})).join('')}
    <p><a href="#history-almaty">알마티 도시·유적 해설 이어 읽기</a></p>
  </section>`;
}
function renderArchitecture() {
  const combined = {
    ...comparative,
    chapters:[...comparative.chapters, ['사마르칸트와 부하라의 건축 유산', architecture.map(city=>city.intro)]],
    sources:[...comparative.sources, ['UNESCO 부하라', 'https://whc.unesco.org/en/list/602/']],
  };
  return renderNarrative(combined, {
    id:'architecture-comparative', placement:'comparative',
    chapterIllustrations:{1:'architecture:Samarkand:intro'},
  });
}
export const guideCategories = [
  {id:'core', title:'종합 해설'}, {id:'cities', title:'도시·유적'}, {id:'architecture', title:'이슬람 건축'}, {id:'kazakhstan', title:'카자흐스탄 심층'},
];
const narrative = (data, id, placement, category, extra = {}) => ({
  id, category, title:data.title, intro:data.intro,
  render:()=>renderNarrative(data, {id, placement, ...extra}),
});
export const guideEntries = [
  narrative(geography, 'geography', 'geography', 'core', {core:true}),
  narrative(history, 'history', 'history', 'core', {core:true}),
  narrative(resources, 'resources', 'resources', 'core', {core:true}),
  {id:'economy', category:'core', title:economy.title, intro:economy.intro, render:()=>renderEconomy()},
  {id:'education', category:'core', title:education.title, intro:education.intro, render:()=>renderEducation()},
  narrative(bukhara, 'bukhara-history', 'bukhara', 'cities'),
  ...[samarkand,tashkent,bishkek,cholponata,almaty].map(city=>narrative(city, `history-${city.slug}`, city.slug, 'cities')),
  {id:'architecture-comparative', category:'architecture', title:comparative.title, intro:comparative.intro, render:renderArchitecture},
  ...kazakhstanEssays.map(essay=>narrative({...essay, verifiedAt:'2026-10-19'}, essay.id, essay.id, 'kazakhstan')),
];
export function renderGuide({category = 'core', article = ''} = {}) {
  const entry = guideEntries.find(e=>e.id === (article === 'architecture-guide' ? 'architecture-comparative' : article));
  if (entry) return `<div class="guide-reader" data-guide-article="${esc(entry.id)}">
    <div class="reader-toolbar"><button type="button" data-guide-list>← 해설 목록</button><button type="button" data-guide-toc>이 글의 목차</button></div>
    <div class="reader-actions"><button type="button" data-guide-expand>전체 펼치기</button><button type="button" data-guide-collapse>전체 접기</button></div>
    ${entry.render().replace('<h3>', '<h2>').replace('</h3>', '</h2>')}<button type="button" class="reader-return" data-guide-list>← 해설 목록으로</button>
    <dialog class="reader-toc" aria-labelledby="reader-toc-title"><div class="reader-toc-heading"><h2 id="reader-toc-title">이 글의 목차</h2><button type="button" data-guide-close aria-label="목차 닫기">닫기</button></div><div data-guide-toc-items></div></dialog>
  </div>`;
  return `<div class="guide-library"><h2>여행 해설</h2><p>제목을 누르면 이 페이지에서 해설 전체를 펼쳐 읽으실 수 있습니다.</p>
    ${guideCategories.map(group=>`<section class="guide-group" aria-labelledby="guide-group-${group.id}"><h3 id="guide-group-${group.id}" class="guide-group-title">${esc(group.title)}</h3>
      <div class="guide-book-list">${guideEntries.filter(item=>item.category === group.id).map(item=>`<details class="guide-book bukhara-chapter" data-guide-inline="${esc(item.id)}"><summary>${esc(item.title)}</summary><div class="guide-inline-body">${renderInlineArticle(item)}</div></details>`).join('')}</div>
    </section>`).join('')}</div>`;
}
function renderInlineArticle(entry) {
  // A single disclosure reveals every numbered section; preserve source disclosures.
  return entry.render().replace(/<h3>[^<]*<\/h3>/, '').replace(
    /<details ([^>]*\bdata-reader-section[^>]*)><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g,
    (_, attributes, title, body) => `<section ${attributes.replace(/\sopen\b/, '').replace('data-reader-section', 'data-inline-section')}><h3 class="guide-inline-heading">${title}</h3>${body}</section>`
  );
}
