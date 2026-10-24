import { escapeHtml as esc } from './render-economy.js';

export function renderPreparation(essentials, checklist, checked = {}) {
  return `<h2>준비</h2><p>체크 상태는 이 기기에 저장됩니다.</p><article><h3>준비물 체크리스트</h3>${checklist.map((item, index) => `<label class="check"><input type="checkbox" data-check="${index}" ${checked[index] ? 'checked' : ''}><span>${esc(item)}</span></label>`).join('')}</article>${essentials.map(item => `<article class="preparation-note"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}`;
}
