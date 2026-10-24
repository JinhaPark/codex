// Groups refer to original chapter indexes, so illustration placements remain stable.
const layouts = {
  geography: [['산맥과 물길', 1], ['오아시스와 산록의 생활', 3]],
  history: [['교역과 문화의 교차로', 3], ['정복과 왕조의 시대', 5], ['제국에서 독립국가로', 6]],
  resources: [['우즈베키스탄의 물과 가스', 1], ['키르기스스탄의 수력', 2], ['카자흐스탄의 자원과 도시', 3]],
  economy: [['세 나라의 산업과 생활', 3], ['키르기스스탄과 쿰토르 금광', 4]],
  education: [['대학과 교육의 변화', 1], ['학비·주거비와 가족의 지원', 3]],
  bukhara: [['오아시스와 이슬람 도시의 형성', 5], ['정복과 옛 시가지의 성장', 9], ['신앙·권력과 근현대의 변화', 14], ['현장에서 읽는 부하라', 15]],
  samarkand: [['오아시스와 교류의 도시', 5], ['티무르 왕조와 건축·천문학', 11], ['근현대와 현장 답사', 13]],
  tashkent: [['오아시스에서 제국의 도시로', 4], ['소비에트 수도와 재건', 7], ['독립 이후의 도시와 현장 답사', 12]],
  bishkek: [['계곡의 교역로와 제국의 확장', 5], ['소비에트 수도에서 독립국가로', 8], ['오늘의 생활과 도시·산악 답사', 12]],
  cholponata: [['호수의 자연과 고대의 흔적', 4], ['교역·문화와 근현대의 변화', 8], ['오늘의 호수와 현장 답사', 12]],
  almaty: [['산록의 터전에서 독립국가의 수도로', 6], ['공원·성당·시장과 거리', 10], ['협곡·환경과 현장 답사', 13]],
  'kazakhstan-history': [['유목사회와 칸국', 3], ['제국 지배와 소비에트 시대', 6], ['독립국가의 출발', 7]],
  'kazakhstan-political-economy': [['권력과 수도의 변화', 3], ['자원·외자와 경제발전', 5], ['세 나라의 격차와 전쟁의 영향', 7]],
  'kazakhstan-society': [['인구·언어와 문화', 3], ['알마티의 주거와 생활', 5]],
};
export function groupChapters(chapters, key) {
  const layout = layouts[key] || [['건축의 재료와 공간', chapters.length]];
  let start = 0;
  return layout.map(([title, end], index) => {
    const items = chapters.slice(start, end).map((chapter, offset) => ({chapter, index: start + offset}));
    start = end;
    return {title, index, items};
  });
}
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderNumberedSections(chapters, key, renderChapter) {
  return groupChapters(chapters, key).map(({title, index, items}) =>
    `<details class="bukhara-chapter reader-section" data-reader-section id="${escape(key)}-section-${index + 1}"${index === 0 ? ' open' : ''}><summary>${index + 1}. ${escape(title)}</summary><div class="bukhara-chapter-body">${items.map(({chapter, index: chapterIndex}) => `<div class="reader-subsection"><h4>${escape(chapter[0].replace(/^\d+\.\s*/, ''))}</h4>${renderChapter(chapter, chapterIndex)}</div>`).join('')}</div></details>`
  ).join('');
}
