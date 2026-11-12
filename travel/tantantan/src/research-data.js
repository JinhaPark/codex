// Original currencies remain here for reproducible calculations, never as headline UI amounts.
export const fx = Object.freeze({
  effectiveDate: '2026-10-17', retrievedAt: '2026-10-18',
  usdKgs: 87.4500, krwKgs: 0.0656,
  usdKrw: 87.4500 / 0.0656, kgsKrw: 1 / 0.0656,
  source: '키르기스스탄 중앙은행(NBKR) 공식 환율의 교차환산',
  urls: ['https://www.nbkr.kg/getservice.jsp?lang=ENG', 'https://www.nbkr.kg/XML/weekly.xml'],
});
export const kumtor = Object.freeze({
  year: 2025, productionKg: 12081, revenueUsd: 1434600000,
  taxesMandatoryPaymentsUsd: 246507000, reportedDividendUsd: 300000000,
  kyrgyzGdpUsd: 22625000000,
  gdpStatus: 'IMF 2026 Article IV의 2025년 추계',
  revenuePublishedAt: '2026-03-13', dividendPublishedAt: '2026-04-09',
  dividendNote: '2025년 실적 발표에 포함된 배당액. 실제 지급 시점과 정부 현금수입 인식 시점은 별도 미확인.',
  goldValueAddedPct2025: null,
  goldStructuralReference: {percent: 6.5, publication: 'IMF 2025/082', referenceYear: null},
});
export function revenueToGdpPct(data = kumtor) {
  return data.kyrgyzGdpUsd > 0 && Number.isFinite(data.revenueUsd)
    ? data.revenueUsd / data.kyrgyzGdpUsd * 100 : null;
}
export const toKrw = (value, currency) => Number.isFinite(value)
  ? value * ({USD: fx.usdKrw, KGS: fx.kgsKrw, KRW: 1}[currency] ?? NaN) : null;
