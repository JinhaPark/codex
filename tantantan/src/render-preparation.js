import { escapeHtml as esc } from './render-economy.js';

const checklistNotes = {
  '충전기와 보조배터리': '현지 콘센트는 한국과 같은 원형 2핀 규격이므로 돼지코(변환 어댑터)를 따로 준비하지 않으셔도 됩니다.',
  '결제 카드와 현금': '비자·마스터카드를 준비하세요. AMEX(아멕스)는 결제할 수 없습니다. 현금은 미국 달러(USD)로 준비한 뒤 현지 환전소에서 현지 통화로 환전하세요.',
};

export function renderPreparation(essentials, checklist, checked = {}) {
  return `<h2>준비</h2><p>체크 상태는 이 기기에 저장됩니다.</p><article><h3>준비물 체크리스트</h3>${checklist.map((item, index) => `<label class="check"><input type="checkbox" data-check="${index}" ${checked[index] ? 'checked' : ''}><span>${esc(item)}${checklistNotes[item] ? `<span class="check-note">${esc(checklistNotes[item])}</span>` : ''}</span></label>`).join('')}</article>${essentials.map(item => `<article class="preparation-note"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}`;
}
