import { fx } from './research-data.js';

// 사용자가 제공한 2026-10-20 알마티 영수증을 판독한 구매 기록입니다.
// 원본 사진·결제 식별정보는 게시하지 않습니다.
const receipts = [
  {
    store: '장가르 바후스(Зангар Бахус)', time: '2026-10-20 15:16', total: 12570,
    items: [
      ['아라라트 5년산 꼬냑', 'Коньяк Арарат 5лет', '50mL', 8, 1570],
    ],
  },
  {
    store: '롯데 라하트(ЛОТТЕ РАХАТ)', time: '2026-10-20 15:39', total: 10705,
    items: [
      ['라하트 70% 초콜릿', 'Рахат 70% шок.', '275g', 1, 3814],
      ['초콜릿 코팅 제피르', 'Глазированный зеф.', '200g', 1, 910],
      ['땅콩초콜릿', 'Арахисовое яр.', '150g', 5, 392],
      ['벨로스네시카 웨하스', 'Белоснежка ваф.', '110g', 1, 327],
      ['땅콩 웨하스', 'Арахисовые ваф.', '110g', 1, 327],
      ['카자흐스탄 초콜릿', 'Казахстанский шок.', '100g', 3, 1104],
    ],
  },
];
// NBK 2026-10-20: 100 KRW = 34.06 KZT (Fexant 공시환율 이력).
const kztKrw = 100 / 34.06;
const won = (amount, rate) => {
  const unit = amount * rate >= 1000 ? 100 : 10;
  return `약 ${number(Math.round(amount * rate / unit) * unit)}원`;
};
const price = (amount, rate, currency, approximate = false) => `<span class="shopping-local-price">${approximate ? '약 ' : ''}${number(amount)} ${currency}</span><span class="shopping-won">(${won(amount, rate)})</span>`;
const number = n => new Intl.NumberFormat('ko-KR').format(n);
const table = (caption, headings, rows, footer = '') => `<div class="shopping-table-scroll" tabindex="0" role="region" aria-label="${caption}"><table class="shopping-table" aria-label="${caption}"><thead><tr>${headings.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody>${footer}</table></div>`;
export function renderShopping() {
  const rows = receipts.flatMap(r => r.items.map(([ko, original, size, count, unit]) => [`${ko} <span class="shopping-size">(${size})</span>`, price(unit, kztKrw, 'KZT')]));
  rows.push(
    ['수우사미르 산악 야생화꿀 <span class="shopping-size">(180g)</span>', price(400, fx.kgsKrw, 'KGS', true)],
    ['흰색 통 백꿀 <span class="shopping-size">(약 150~200mL 추정)</span>', price(500, fx.kgsKrw, 'KGS', true)],
    ['큰 통 백꿀 <span class="shopping-size">(500mL)</span>', price(900, fx.kgsKrw, 'KGS', true)],
  );
  return table('개당 구매 가격', ['품목', '가격'], rows);
}
