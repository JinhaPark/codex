import { fx } from './research-data.js';

export const educationSources = {
 students: {name:'키르기스 통계청 · 2024/25 대학 재학생과 계약제 비율',url:'https://www.stat.gov.kg/media/publicationarchive/79a0d0de-2105-40a2-8ff2-ca18d27d89e0.pdf',year:'2024/25',published:'2025-03',population:'학년도 초 고등직업교육 재학생 전체'},
 grants: {name:'키르기스 교육부 · 국가 지원 입학정원',url:'https://edu.gov.kg/posts/3232/',year:'2024/25',published:'2024-07-16',population:'계획 정원, 실제 충원 인원 아님'},
 knu: {name:'키르기스국립대(KNU) · 2026/27 등록금 공시',url:'https://www.knu.kg/ky/ru/archives/27192',year:'2026/27',published:'2026-06-23',population:'주간 학부 1학년 일반 요율; 외국인 요율 별도'},
 ksma: {name:'키르기스국립의대(KSMA) · 약학 등록금',url:'https://ksma.edu.kg/ru/faculties/pharmacy',year:'2025/26',published:null,population:'키르기스 국적, 5년제 주간 약학'},
 krsu: {name:'키르기스러시아슬라브대(KRSU) · 등록금',url:'https://www.krsu.kg/obuchayushhimsya/platnye-obrazovatelnye-uslugi/',year:'2026/27',published:null,population:'학사 일반 공시; 적용 입학연도는 표에 미기재'},
 wage: {name:'키르기스 통계청 · 2025 임금',url:'https://stat.gov.kg/media/publicationarchive/0a378f38-836c-4859-892a-6bef0f14133b.pdf',year:2025,published:'2026',population:'전국 기업·기관의 세전 명목 발생임금, 소기업 제외'},
 living: {name:'Kaktus · 비슈케크 1인 생활비 추정',url:'https://kaktus.media/doc/548694_skolko_nyjno_zarabatyvat_chtoby_jit_odnomy_v_bishkeke_v_2026_gody.html',year:2026,published:'2026-06-26',population:'일반 성인 1인 추정예산; 학생 표본조사 아님'},
 dorm: {name:'KSMA · 기숙사 게시 요금(기준연도 미표시)',url:'https://pop.kgma.kg/ru/divisions/offices-sectors/student-campus',year:null,published:null,population:'키르기스 국적 입사생, 방당 1~4인에 따라 차등'},
 aid: {name:'AUCA · 장학·등록금 지원',url:'https://www.auca.kg/en/financial_aid/',year:null,published:null,population:'해당 대학 학부생; 전국 이용률 아님'},
 payment: {name:'AUCA · 학기별 납부 규정',url:'https://www.auca.kg/en/tuition_payment/',year:null,published:null,population:'AUCA 재학생, 학기 등록 전 납부'},
 loan: {name:'DemirBank · 제휴 교육기관 대출 안내',url:'https://www.demirbank.kg/ru/news/educationloan',year:null,published:null,population:'제휴 교육기관 대상; 일반 대학생 적용 여부 미확인'},
 kaz: {name:'카자흐 과학고등교육부 · 2024/25 재학생',url:'https://www.gov.kz/org/sci/press/news/details/999766?lang=ru',year:'2024/25',published:'2025',population:'학부생 624,500명; 대학원 등 별도'},
 uzb: {name:'우즈베크 통계위원회 · 고등교육',url:'https://stat.uz/img/news/olij-talim-lotin_p44563.pdf',year:'2024/25',published:'2026',population:'고등교육 재학생 1,432,800명'},
 pisaKaz: {name:'OECD · 카자흐스탄 PISA 2022',url:'https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/kazakhstan_8c403c04-en.html',year:2022,published:'2023-12-05',population:'15세 재학생'},
 pisaUzb: {name:'OECD · 우즈베키스탄 PISA 2022',url:'https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/uzbekistan_2bb94bf1-en.html',year:2022,published:'2023-12-05',population:'15세 재학생'},
 literacy: {name:'세계은행/UNESCO UIS · 성인 문자해득률',url:'https://api.worldbank.org/v2/country/KAZ;UZB;KGZ/indicator/SE.ADT.LITR.ZS?format=json&per_page=1000',year:'국가별 상이',published:null,population:'15세 이상 성인'},
 skills: {name:'IMF · 키르기스 노동시장과 기술 불일치(2025)',url:'https://meetings.imf.org/-/media/Files/Publications/Selected-Issues-Papers/2025/English/SIPEA2025082.ashx',year:2025,published:'2025-05-07',population:'노동시장 구조 분석'}
};
export const educationData = {
 retrievedAt:'2026-10-18', rawCurrency:'KGS',
 enrolled:{KGZ:{year:'2024/25',countLowerBound:231000,contractPercentApprox:88,institutions:57},KAZ:{year:'2024/25',count:624500,scope:'학부'},UZB:{year:'2024/25',count:1432800,scope:'고등교육'}},
 literacy:[{iso3:'KAZ',year:2009,percent:99.7300033569336},{iso3:'UZB',year:2022,percent:100},{iso3:'KGZ',year:2009,percent:99.2399978637695}],
 wage:{monthlyKgs:44419,source:'wage'},
 tuition:[
  {school:'키르기스국립대(KNU)',major:'역사·지역학',year:'2026/27',annualKgs:54000,scope:'주간 학부 1학년',source:'knu'},
  {school:'키르기스국립대(KNU)',major:'언론학',year:'2026/27',annualKgs:58500,scope:'주간 학부 1학년',source:'knu'},
  {school:'키르기스국립의대(KSMA)',major:'약학',year:'2025/26',annualKgs:75000,scope:'키르기스 국적·5년제 주간 과정',source:'ksma'},
  {school:'키르기스러시아슬라브대(KRSU)',major:'경제학',year:'2026/27',annualKgs:120000,scope:'학사 일반 공시; 적용 입학연도 미기재',source:'krsu'}
 ],
 monthly:{rent:[25000,35000],dorm:[950,2000],food:[10000,13000],transport:[1000,1500],communication:[500,1500],utilities:[2000,5000]},
 scenario:{tuitionKgs:75000,months:12,excluded:'보증금·교재·의료·의복·여가·예비비; 기숙사 별도 공공요금 여부 미확인'},
 limitations:['같은 해 입학한 학생들을 추적한 전국 대학 졸업률·중도탈락 사유·학비 미납 제적률·재학 중 취업률·졸업 후 취업률은 비교 가능한 자료를 확인하지 못했습니다.','전국 중위임금·가구 가처분소득과 학생별 지출을 연결한 자료가 없어 평균임금으로 실제 가계 부담률을 추정하지 않습니다.','기숙사 요금은 공식 게시값이나 기준연도가 없어 현재 계약 요금으로 보장할 수 없습니다.']
};
export const formatEducationWon = kgs => {
 const amount = kgs * fx.kgsKrw / 10000;
 return new Intl.NumberFormat('ko-KR', {maximumFractionDigits: Math.abs(amount) < 10 ? 1 : 0}).format(amount);
};
export function annualStudentBudget(housing) {
 if (!['dorm','rent'].includes(housing)) throw new RangeError('Unknown housing');
 const d=educationData, m=d.monthly;
 return [0,1].map(i => d.scenario.tuitionKgs + d.scenario.months*(m[housing][i]+m.food[i]+m.transport[i]+m.communication[i]+(housing==='rent'?m.utilities[i]:0)));
}
export const tuitionWageMonths = annualKgs => annualKgs / educationData.wage.monthlyKgs;
