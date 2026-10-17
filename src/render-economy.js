import economy from './central-asia-economy.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export function formatEconomyNumber(value, divisor = 1, digits = 0) {
  if (!Number.isFinite(value)) return '자료 없음';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value / divisor);
}

function renderCountryRow(country) {
  return `<tr>
    <th scope="row">${escapeHtml(country.name)}</th>
    <td>${formatEconomyNumber(country.population, 10_000)}</td>
    <td>${formatEconomyNumber(country.gdpUsd, 100_000_000)}</td>
    <td>${formatEconomyNumber(country.gdpPerCapitaUsd)}</td>
  </tr>`;
}

function chapterBody(chapter, data) {
  const { metadata, countries } = data;
  const find = iso3 => countries.find(country => country.iso3 === iso3);
  if (chapter.kind === 'market') {
    const kazakhstan = find('KAZ');
    const uzbekistan = find('UZB');
    const ratio = Number.isFinite(kazakhstan.gdpUsd) && uzbekistan.gdpUsd > 0
      ? formatEconomyNumber(kazakhstan.gdpUsd / uzbekistan.gdpUsd, 1, 1)
      : '자료 없음';
    return `우즈베키스탄 인구 약 ${formatEconomyNumber(uzbekistan.population, 10_000)}만 명은 5개국 중 최대입니다. 카자흐스탄은 인구 약 ${formatEconomyNumber(kazakhstan.population, 10_000)}만 명이지만 GDP가 우즈베키스탄의 약 ${ratio}배입니다. 인구 규모는 노동공급과 내수시장 잠재력, 1인당 GDP는 생산액을 인구로 나눈 값이지 실제 개인 임금은 아닙니다.`;
  }
  if (chapter.kind === 'remittances') {
    const values = ['TJK', 'KGZ', 'UZB', 'KAZ', 'TKM'].map(iso3 => {
      const country = find(iso3);
      return `${country.name} ${Number.isFinite(country.remittancesPctGdp)
        ? formatEconomyNumber(country.remittancesPctGdp, 1, 1) + '%'
        : '자료 없음'}`;
    }).join(', ');
    return `${metadata.year}년 세계은행 개인 송금 수입/GDP: ${values}. 자료 없음은 0%를 뜻하지 않습니다. 송금은 소비와 외화 유입을 지탱하지만 해외 고용·환율 변동에 취약합니다.`;
  }
  if (chapter.kind === 'statistics') {
    return `자료는 추후 개정될 수 있으며, 기준연도(${metadata.year}년)와 조회일(${metadata.retrievedAt})은 다릅니다. 투르크메니스탄의 출처 간 차이는 표 아래에 별도로 표시했습니다. 반올림된 표의 GDP와 인구로 계산한 1인당 GDP는 원자료의 1인당 GDP를 반올림한 값과 다를 수 있습니다.`;
  }
  return chapter.body;
}

function renderDetails(title, body) {
  return `<details class="bukhara-chapter">
    <summary>${escapeHtml(title)}</summary>
    <div class="bukhara-chapter-body"><p>${escapeHtml(body)}</p></div>
  </details>`;
}

export function renderEconomy(data = economy) {
  const { metadata, countries, alternateTurkmenistan: alternate } = data;
  const turkmenistan = countries.find(country => country.iso3 === 'TKM');
  const statisticalNote = `투르크메니스탄: ${metadata.year}년 WDI는 GDP 약 ${formatEconomyNumber(turkmenistan.gdpUsd, 100_000_000)}억 미 달러·1인당 ${formatEconomyNumber(turkmenistan.gdpPerCapitaUsd)}미 달러, 세계은행 국가 개요는 ${alternate.year}년 GDP ${formatEconomyNumber(alternate.gdpUsd, 100_000_000)}억 미 달러·1인당 ${formatEconomyNumber(alternate.gdpPerCapitaUsd)}미 달러를 제시합니다(${alternate.retrievedAt} 확인). 표에는 WDI 값을 일관되게 사용했습니다. 출처 간 차이의 원인은 확인되지 않았습니다.`;

  return `<section class="bukhara-history" id="central-asia-economy">
    <h3>중앙아시아 5개국 경제·산업 비교 (${metadata.year})</h3>
    <p class="bukhara-intro">${escapeHtml(data.intro)}</p>
    <p>통계 기준연도: ${metadata.year}년 · ${escapeHtml(metadata.source)} 조회일: ${escapeHtml(metadata.retrievedAt)} · 자료 갱신일: ${escapeHtml(metadata.sourceUpdatedAt)}</p>
    <div style="overflow-x:auto">
      <table style="width:100%;min-width:520px">
        <caption>${metadata.year}년 중앙아시아 5개국 인구·명목 GDP 비교</caption>
        <thead><tr>
          <th scope="col">국가</th>
          <th scope="col">인구(만 명)</th>
          <th scope="col">명목 GDP(억 미 달러)</th>
          <th scope="col">1인당 명목 GDP(미 달러/명)</th>
        </tr></thead>
        <tbody>${countries.map(renderCountryRow).join('')}</tbody>
      </table>
    </div>
    <p class="bukhara-intro">${escapeHtml(statisticalNote)}</p>
    <p>산업 특징 요약 · 산업별 비중 순위가 아닙니다.</p>
    <div class="bukhara-chapters">
      ${countries.map(country => renderDetails(`${country.name} — ${country.industries}`, country.description)).join('')}
      ${data.chapters.map(chapter => renderDetails(chapter.title, chapterBody(chapter, data))).join('')}
    </div>
    <div class="bukhara-references">
      <h4>출처</h4>
      ${data.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)} ↗</a>`).join('')}
    </div>
  </section>`;
}
