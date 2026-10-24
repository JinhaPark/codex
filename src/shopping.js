// 사용자가 제공한 2026-10-20 알마티 영수증을 판독한 구매 기록입니다.
// 원본 사진·결제 식별정보는 게시하지 않습니다.
const receipts = [
  {
    store: '장가르 바후스(Зангар Бахус)', time: '2026-10-20 15:16', total: 12570,
    items: [
      ['아라라트 5년산 브랜디', 'Коньяк Арарат 5лет', '50mL', 8, 1570],
      ['검정 봉투', 'Пакет черный', '1장', 1, 10],
    ],
  },
  {
    store: '롯데 라하트(ЛОТТЕ РАХАТ)', time: '2026-10-20 15:39', total: 10705,
    items: [
      ['라하트 쇼핑봉투', 'Пакет рекламный Рахат', '1장', 1, 55],
      ['라하트 70% 초콜릿', 'Рахат 70% шок.', '275g', 1, 3814],
      ['초콜릿 코팅 제피르', 'Глазированный зеф.', '200g', 1, 910],
      ['땅콩 알맹이', 'Арахисовое яр.', '150g', 5, 392],
      ['벨로스네시카 웨하스', 'Белоснежка ваф.', '110g', 1, 327],
      ['땅콩 웨하스', 'Арахисовые ваф.', '110g', 1, 327],
      ['카자흐스탄 초콜릿', 'Казахстанский шок.', '100g', 3, 1104],
    ],
  },
];
const number = n => new Intl.NumberFormat('ko-KR').format(n);
const table = (caption, headings, rows, footer = '') => `<div class="shopping-table-scroll" tabindex="0" role="region" aria-label="${caption}"><table class="shopping-table"><caption>${caption}</caption><thead><tr>${headings.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody>${footer}</table></div>`;
export function renderReceiptShopping() {
  return `<details open><summary>알마티 · 영수증으로 남긴 구매가격</summary><p>2026년 10월 20일 실제 구매 기록입니다. 금액은 모두 카자흐스탄 텡게(KZT)이며, 가격은 한 개 기준이며, 표 아래의 영수증 총액은 실제 구매 수량을 합산한 금액입니다. 러시아어 품목명은 영수증의 약어를 살려 함께 적었습니다. 제피르는 마시멜로와 비슷한 부드러운 과자입니다. 긴 표는 좌우로 밀어 볼 수 있습니다.</p>${receipts.map(r => table(`${r.store} · ${r.time}`, ['품목 · 영수증 표기', '개당 용량·중량', '개당 가격(KZT)'], r.items.map(([ko, original, size, count, unit]) => [`${ko}<small lang="ru">${original}</small>`, size, number(unit)]), `<tfoot><tr><th scope="row" colspan="2">영수증 총액(KZT)</th><td>${number(r.total)}</td></tr></tfoot>`)).join('')}<p>두 매장 합계는 23,275텡게입니다. 주류 영수증의 «0,05л»는 50mL, «5лет»는 5년 숙성을 뜻합니다. 라하트 매장 주소는 알마티 지베크 졸리 47번지입니다. 꿀은 아래의 별도 현장 구매 메모를 기준으로 정리했습니다.</p></details>`;
}
export function renderHoneyShopping() {
  return table('키르기스스탄 꿀 · 현장 구매 메모(영수증 없음)', ['제품', '용량·중량', '개당 가격(KGS)', '비고'], [
    ['수우사미르 산악 야생화꿀', '180g', '약 400', '노란 뚜껑 · 직접 구매'],
    ['흰색 통 백꿀', '약 150~200mL 추정', '약 500', '직접 구매 · 중량·밀원 미확인'],
    ['큰 통 백꿀', '500mL', '약 900', '일행 구매 메모'],
  ]) + '<p>꿀 가격의 통화는 키르기스스탄 솜(KGS)입니다. 직접 산 야생화꿀과 작은 백꿀 두 통은 합계 약 900솜이며, 일행의 큰 백꿀은 이 합계에 포함하지 않았습니다.</p>';
}
