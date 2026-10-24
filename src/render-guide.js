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

function renderNarrative(data, {id = data.id, placement = data.id, core = false} = {}) {
  return `<section class="bukhara-history${core ? ' core-section' : ''}" id="${esc(id)}" ${core ? `data-core-section="${esc(data.id)}"` : ''}>
    <h3>${esc(data.title)}</h3><p class="bukhara-intro">${esc(data.intro)}</p>
    <div class="bukhara-chapters">${renderNumberedSections(data.chapters, placement, ([, body], i) => {
      const paragraphs = Array.isArray(body) ? body : body.split(/\n\s*\n/);
      return `${renderIllustratedParagraphs(paragraphs, placement, i)}${renderIllustration(`${placement}:${i}:detail`)}`;
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
  return `<section class="architecture-guide" id="architecture-guide"><h3>우즈베키스탄 이슬람 건축 유산</h3>${architecture.map((city, i)=>`<details class="architecture-city reader-section" data-reader-section id="architecture-section-${i + 1}"${i === 0 ? ' open' : ''}><summary><span class="city-name">${i + 1}. ${esc(city.city)} <small>${esc(city.en)}</small></span><span class="city-subtitle">${esc(city.subtitle)}</span></summary><div class="architecture-city-body"><p>${esc(city.intro)}</p>${renderIllustration(`architecture:${city.en}:intro`)}${city.sites.map(([name,en,description])=>`<div class="architecture-site"><h4>${esc(name)} <small>${esc(en)}</small></h4><p>${esc(description)}</p></div>`).join('')}</div></details>`).join('')}${renderSources([['UNESCO 사마르칸트','https://whc.unesco.org/en/list/603/'],['UNESCO 부하라','https://whc.unesco.org/en/list/602/']])}</section>`;
}
export const guideCategories = [
  {id:'core', title:'종합 해설'}, {id:'cities', title:'도시·유적'}, {id:'kazakhstan', title:'카자흐스탄 심층'},
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
  narrative(comparative, 'architecture-comparative', 'comparative', 'cities'),
  {id:'architecture-guide', category:'cities', title:'우즈베키스탄 이슬람 건축 유산', intro:'도시별 건축 유산과 유적의 특징을 살펴봅니다.', render:renderArchitecture},
  ...kazakhstanEssays.map(essay=>narrative({...essay, verifiedAt:'2026-10-19'}, essay.id, essay.id, 'kazakhstan')),
];
export function renderGuide({category = 'core', article = ''} = {}) {
  const entry = guideEntries.find(e=>e.id === article);
  if (entry) return `<div class="guide-reader" data-guide-article="${esc(entry.id)}">
    <div class="reader-toolbar"><button type="button" data-guide-list>← 해설 목록</button><button type="button" data-guide-toc>이 글의 목차</button></div>
    <div class="reader-actions"><button type="button" data-guide-expand>전체 펼치기</button><button type="button" data-guide-collapse>전체 접기</button></div>
    ${entry.render().replace('<h3>', '<h2>').replace('</h3>', '</h2>')}<button type="button" class="reader-return" data-guide-list>← 해설 목록으로</button>
    <dialog class="reader-toc" aria-labelledby="reader-toc-title"><div class="reader-toc-heading"><h2 id="reader-toc-title">이 글의 목차</h2><button type="button" data-guide-close aria-label="목차 닫기">닫기</button></div><div data-guide-toc-items></div></dialog>
  </div>`;
  if (!guideCategories.some(c=>c.id === category)) category = 'core';
  return `<div class="guide-library"><h2>여행 해설</h2><p>읽고 싶은 해설을 고르세요. 글 안에서는 큰 번호 섹션별로 펼쳐 읽으실 수 있습니다.</p>
    <div class="guide-categories" role="group" aria-label="해설 분류">${guideCategories.map(c=>`<button type="button" data-guide-category="${c.id}" aria-pressed="${category === c.id}">${c.title}</button>`).join('')}</div>
    <div class="guide-book-list">${guideEntries.filter(e=>e.category === category).map(e=>`<a class="guide-book" href="#guide/${e.category}/${e.id}" data-guide-open="${e.id}"><h3>${esc(e.title)}</h3><p>${esc(e.intro)}</p><span>해설 읽기 →</span></a>`).join('')}</div></div>`;
}
