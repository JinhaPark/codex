import { renderNumberedSections } from './guide-sections.js';
import economy from './central-asia-economy.js';
import { fx, kumtor, revenueToGdpPct, toKrw } from './research-data.js';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
export function formatEconomyNumber(value, divisor = 1, digits = 0) {
  if (!Number.isFinite(value)) return '자료 없음';
  return new Intl.NumberFormat('ko-KR', {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(value / divisor);
}
export function renderSources(sources, verifiedAt = '2026-10-18') {
  return `<details class="source-notes"><summary>출처와 기준일</summary><div class="bukhara-references">${sources.map(source => {
    const [name, url] = Array.isArray(source) ? source : [source.name, source.url];
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)} ↗</a>`;
  }).join('')}</div><p>자료 확인: ${escapeHtml(verifiedAt)}. 발표연도와 통계 기준연도는 다를 수 있습니다.</p></details>`;
}
export function renderFxNote() {
  return `<p class="data-note">원화 환산: NBKR ${fx.effectiveDate} 공식 환율을 교차 적용했습니다. 같은 원자료에 같은 환율을 적용한 명목 비교이며 현지 구매력이나 실제 환전액을 뜻하지 않습니다. <a href="${fx.urls[0]}" target="_blank" rel="noopener noreferrer">환율 출처 ↗</a></p>`;
}
function formatRemittanceShare(value) {
  if (!Number.isFinite(value)) return '자료 없음';
  if (value > 0 && value < 0.1) return '0.1 미만';
  return formatEconomyNumber(value, 1, value > 0 && value < 1 ? 1 : 0);
}
function renderCountryRow(country) {
  const cell = (label, value) => `<td data-label="${label}">${value}</td>`;
  return `<tr><th scope="row">${escapeHtml(country.name)}</th>${
    cell('인구 (만 명)', formatEconomyNumber(country.population, 10000, 0)) +
    cell('명목 GDP (조 원)', formatEconomyNumber(toKrw(country.gdpUsd, 'USD'), 1e12, 0)) +
    cell('1인당 GDP (만 원/명)', formatEconomyNumber(toKrw(country.gdpPerCapitaUsd, 'USD'), 10000, 0)) +
    cell('송금 수입/GDP (%)', formatRemittanceShare(country.remittancesPctGdp)) +
    cell('주요 산업·상품', escapeHtml(country.industries))}</tr>`;
}
export function renderKumtor(data = kumtor) {
  const money = (value, divisor, digits) => formatEconomyNumber(toKrw(value, 'USD'), divisor, digits);
  return `<details class="data-details"><summary>쿰토르 2025 실적과 GDP 비교 · 계산 근거</summary>
    <dl class="facts-grid">
    <dt>연간 금 생산량</dt><dd>약 ${formatEconomyNumber(data.productionKg / 1000, 1, 1)}톤</dd>
    <dt>연매출</dt><dd>약 ${money(data.revenueUsd, 1e12, 1)}조 원</dd>
    <dt>키르기스스탄 명목 GDP</dt><dd>약 ${money(data.kyrgyzGdpUsd, 1e12, 1)}조 원</dd>
    <dt>매출/GDP · 부가가치 기여율 아님</dt><dd>약 ${formatEconomyNumber(revenueToGdpPct(data), 1, 1)}%</dd>
    <dt>세금·의무납부금</dt><dd>약 ${money(data.taxesMandatoryPaymentsUsd, 1e8, 0)}억 원</dd>
    <dt>실적 발표에 포함된 배당액</dt><dd>약 ${money(data.reportedDividendUsd, 1e8, 0)}억 원</dd></dl>
    <p>${escapeHtml(data.dividendNote)} GDP는 ${escapeHtml(data.gdpStatus)}입니다. 회사 실적 발표는 2026-03-13, 감사·배당 발표는 2026-04-09입니다.</p>
    <p>매출은 중간투입 비용을 차감하기 전 판매수입이며 수출액과도 같지 않습니다. 2025년 금 산업의 비교 가능한 확정 부가가치 기여율은 확인하지 못했습니다.</p>
  </details>`;
}
export function renderEconomy(data = economy) {
  const { metadata, countries } = data;
  return `<section class="bukhara-history core-section" id="economy" data-core-section="economy">
    <span id="central-asia-economy"></span><h3>${escapeHtml(data.title)}</h3><p class="bukhara-intro">${escapeHtml(data.intro)}</p>
    <div class="bukhara-chapters">${renderNumberedSections(data.chapters, 'economy', ([, paragraphs]) => paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join(''))}</div>
    <details class="data-details"><summary>세 나라의 규모 한눈에 보기 · ${metadata.year}년</summary>
    <table class="economy-table"><caption>${metadata.year}년 3국 경제 비교 · 세계은행 WDI</caption>
      <thead><tr><th scope="col">국가</th><th scope="col">인구<br>(만 명)</th><th scope="col">명목 GDP<br>(조 원)</th><th scope="col">1인당 GDP<br>(만 원/명)</th><th scope="col">송금 수입/GDP<br>(%)</th><th scope="col">주요 산업·상품</th></tr></thead>
      <tbody>${countries.map(renderCountryRow).join('')}</tbody></table>
    <p class="data-note">1인당 GDP는 개인 평균임금이나 가계소득이 아닙니다. 송금 비율은 개인 송금 수입/GDP이며 모든 가구의 수급률이 아닙니다. 산업 목록은 규모 순위가 아닙니다.</p>
    <p class="data-note">통계 ${metadata.year}년 · WDI 갱신 ${metadata.sourceUpdatedAt} · 조회 ${metadata.retrievedAt}. 아래 쿰토르 실적은 2025년으로 비교표와 기준연도가 다릅니다.</p>
    <p class="data-note">표의 수치는 읽기 쉽게 반올림했습니다. 작은 송금 비율은 0으로 보이지 않도록 별도로 표시했습니다.</p>
    ${renderFxNote()}</details>${renderKumtor()}${renderSources(data.sources)}
  </section>`;
}
