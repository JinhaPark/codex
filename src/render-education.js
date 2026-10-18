import education from './central-asia-education.js';
import { educationData as d, educationSources as sources, formatEducationWon as won, annualStudentBudget, tuitionWageMonths } from './education-data.js';
import { fx } from './research-data.js';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const range = values => values.map(won).join('~');
const row = (name,value,note) => `<tr><th scope="row">${esc(name)}</th><td data-label="금액">${esc(value)}</td><td data-label="조건">${esc(note)}</td></tr>`;
export function renderEducation() {
 return `<section class="bukhara-history guide-section" id="education" data-core-section="education"><h3>${education.title}</h3><p class="bukhara-intro">${education.intro}</p>
 <div class="bukhara-chapters">${education.chapters.map(([title,paragraphs])=>`<details class="bukhara-chapter"><summary>${title}</summary><div class="bukhara-chapter-body">${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details>`).join('')}</div>
 <details class="bukhara-chapter"><summary>등록금·생활비 계산과 자료의 조건</summary><div class="bukhara-chapter-body">
 <p>환산 기준일 ${esc(fx.effectiveDate)} · 키르기스 중앙은행 고시 교차환율. 원화 환산은 현지 구매력 비교가 아닙니다. 등록금과 임금은 학년도·모집단이 다릅니다.</p>
 <div class="table-scroll"><table class="education-table"><caption>대학별 연간 등록금과 전국 평균 월급 대비 규모</caption><thead><tr><th>대학·전공</th><th>만 원/년</th><th>평균 월급 개월분·조건</th></tr></thead><tbody>${d.tuition.map(t=>row(`${t.school} ${t.major}`,`${won(t.annualKgs)}만 원/년`,`${tuitionWageMonths(t.annualKgs).toFixed(1)}개월 · ${t.year} ${t.scope}`)).join('')}</tbody></table></div>
 <div class="table-scroll"><table class="education-table"><caption>월 비용과 학생 1인 연간 시나리오(원화)</caption><thead><tr><th>항목</th><th>금액</th><th>기준·한계</th></tr></thead><tbody>
 ${row('전국 평균 월급',`${won(d.wage.monthlyKgs)}만 원/월`,'2025, 세전·소기업 제외')}
 ${row('비슈케크 원룸',`${range(d.monthly.rent)}만 원/월`,'2026-06-26 언론 추정, 전국 평균임금의 56~79%')}
 ${row('KSMA 기숙사',`${range(d.monthly.dorm)}만 원/월`,'공식 게시, 기준연도 미표시·입사 보장 아님')}
 ${row('식료품',`${range(d.monthly.food)}만 원/월`,'절약·자가조리 가정, 학생 조사 아님')}
 ${row('대중교통·통신',`${range([1500,3000])}만 원/월`,'버스 및 통신·인터넷의 합')}
 ${row('원룸 공공요금',`${range(d.monthly.utilities)}만 원/월`,'계절·주택별 차이')}
 ${row('기숙사 시나리오',`${range(annualStudentBudget('dorm'))}만 원/년`,'약학 학비 + 12개월 기숙사·식료품·교통·통신')}
 ${row('원룸 시나리오',`${range(annualStudentBudget('rent'))}만 원/년`,'같은 학비·생활 가정 + 원룸·공공요금')}
 ${row('거주 방식에 따른 차이',`${range([0,1].map(i=>annualStudentBudget('rent')[i]-annualStudentBudget('dorm')[i]))}만 원/년`,'각 하한끼리·상한끼리 비교, 통계적 신뢰구간 아님')}
 </tbody></table></div><p>12개월 거주를 가정합니다. 기숙사 요금은 기준연도가 없으며 별도 공공요금이 포함되는지는 확인하지 못했습니다. ${esc(d.scenario.excluded)}는 합계에서 제외합니다. 실제 학생 평균 소비나 가구별 부담률을 뜻하지 않습니다.</p>
 </div></details>
 <details class="bukhara-chapter"><summary>교육 출처·기준연도·확인 한계</summary><div class="bukhara-chapter-body"><p>조회일 ${d.retrievedAt}. 발표일이 표시되지 않은 페이지는 조회일로 대체하지 않습니다.</p>${Object.values(sources).map(s=>`<p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a><br>기준 ${esc(s.year??'미표시')} · 발표 ${esc(s.published??'미표시')} · ${esc(s.population)}</p>`).join('')}${d.limitations.map(p=>`<p>${esc(p)}</p>`).join('')}</div></details></section>`;
}
