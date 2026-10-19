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
    <div class="bukhara-chapters">${data.chapters.map(([title, body], i) => {
      const paragraphs = Array.isArray(body) ? body : body.split(/\n\s*\n/);
      return `<details class="bukhara-chapter"><summary>${esc(title)}</summary><div class="bukhara-chapter-body">${renderIllustratedParagraphs(paragraphs, placement, i)}${renderIllustration(`${placement}:${i}:detail`)}</div></details>`;
    }).join('')}</div>${renderSources(data.sources || [], data.verifiedAt)}</section>`;
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
export function renderGuide(essentials = []) {
  return `<h2>여행 해설</h2><p>자연환경에서 역사, 자원, 경제와 교육으로 이어지는 3국 여행 해설입니다. 주제를 누르면 본문이 펼쳐집니다.</p>
    <nav class="guide-toc" aria-label="해설 목차"><a href="#geography">1. 지리·기후·생활양식</a><a href="#history">2. 역사</a><a href="#resources">3. 자원·에너지</a><a href="#economy">4. 경제</a><a href="#education">5. 교육</a><a href="#kazakhstan-deep-dives">카자흐스탄 심층 해설</a><a href="#city-guides">도시·유적 찾아보기</a></nav>
    <span id="central-asia-geography-climate"></span>${renderNarrative(geography, {core:true})}
    <span id="silk-road-introduction"></span>${renderNarrative(history, {core:true})}
    <span id="central-asia-power-datacenters"></span>${renderNarrative(resources, {core:true})}
    ${renderEconomy()}${renderEducation()}
    ${renderKazakhstanDeepDives()}
    <h2 id="city-guides">도시·유적 찾아보기</h2>
    <nav class="guide-toc" aria-label="도시 목차"><a href="#bukhara-history">부하라</a>${[samarkand,tashkent,bishkek,cholponata,almaty].map(city=>`<a href="#history-${city.slug}">${esc(city.title)}</a>`).join('')}<a href="#architecture-guide">건축 유산</a></nav>
    ${renderNarrative(bukhara, {id:'bukhara-history',placement:'bukhara'})}
    ${[samarkand,tashkent,bishkek,cholponata,almaty].map(city=>renderNarrative(city,{id:`history-${city.slug}`,placement:city.slug})).join('')}
    ${renderNarrative(comparative,{id:'architecture-comparative',placement:'comparative'})}
    <section class="architecture-guide" id="architecture-guide"><h3>우즈베키스탄 이슬람 건축 유산</h3>${architecture.map(city=>`<details class="architecture-city"><summary><span class="city-name">${esc(city.city)} <small>${esc(city.en)}</small></span><span class="city-subtitle">${esc(city.subtitle)}</span></summary><div class="architecture-city-body"><p>${esc(city.intro)}</p>${renderIllustration(`architecture:${city.en}:intro`)}${city.sites.map(([name,en,description])=>`<div class="architecture-site"><h4>${esc(name)} <small>${esc(en)}</small></h4><p>${esc(description)}</p></div>`).join('')}</div></details>`).join('')}${renderSources([['UNESCO 사마르칸트','https://whc.unesco.org/en/list/603/'],['UNESCO 부하라','https://whc.unesco.org/en/list/602/']])}</section>
    ${essentials.filter(e=>e.title!=='현지 여행 회화').map(e=>`<details><summary>${esc(e.title)}</summary><p>${esc(e.body)}</p></details>`).join('')}`;
}
