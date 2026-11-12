# 카자흐스탄 심층 해설: 선행 감사와 공통 기준

기준: 2026-10-19, main 4825b886d1a3ae9a18a245fb1e39f6e1c9131a31. 기본 브랜치 main. Pages Actions run 39185383933 성공(2026-10-19 01:27 UTC), 동일 SHA. 공개 사이트 검색 도구 읽기는 실패했으나 curl로 HTTP 200과 HTML을 확인했다. Last-Modified 2026-10-19 01:27:12 GMT, 배포 자산 index-BD0hGBG4.js / index-DhzJzpNS.css. 브라우저 직접 접속은 ERR_EMPTY_RESPONSE여서 배포 UI 육안 검증은 미완료다.

## 기존 내용과 배치
- render-guide.js가 5개 core 섹션(지리, 역사, 자원, 경제, 교육) 뒤 city-guides와 도시별 원고를 렌더링. renderNarrative의 details/summary 패턴 재사용. main.js는 여행 해설 탭에서 renderGuide 호출. 기존 목차 번호 유지.
- 역사: 소그드, 아프라시압, 튀르크화·이슬람화, 몽골·티무르 중심. 카자흐 칸국/러시아 편입/집단화는 각 한두 문단으로 요약되어 있어 구체적 인과관계 확장 가능.
- 알마티: 산록·사과, 베르니(1854), 지진, 1929 수도, 1997 이전, 판필로프·성당·바자르·아르바트·차른 답사. 신규 원고는 유적 소개를 반복하지 않고 국가·사회와 도시생활 연결.
- 지리: 물·산맥, 계절 목축·유르트, 알마티 산록·사과·기온역전. 신규 역사에서는 목축의 제도·생계, 신규 사회에서는 난방·주거·오염으로 관점 분리.
- 자원: CPC·석탄·송전·원전 일반론. 신규 경제는 개발자본·지분·수익 분배 중심.
- 경제: 2024 동일연도 WDI 3국 비교표, Kaspi/Halyk/Air Astana/Kazakhtelecom 소개. 표·기업 설명 반복 금지. 신규 경제는 장기 변화와 비교 해석 추가.
- 교육: 진학/학습/학비·생활비 중심. 신규 사회는 청년 이동·취업과 주거 연결.
- main.js, itinerary.json, 이미지·회화·환율·PWA는 수정하지 않음. 공통 렌더러·CSS 수정은 메인만 수행.

## 공통 집필 규칙
- A 역사 src/kazakhstan-history.js, B 정치경제 src/kazakhstan-political-economy.js, C 사회 src/kazakhstan-society.js. 각 default export {id,title,intro,chapters:[[소제목,[문단]]],sources:[[출처명,URL]]}. IDs kazakhstan-history / kazakhstan-political-economy / kazakhstan-society.
- 각 담당자는 docs/kazakhstan/{history,political-economy,society}-research.md에 주장별 근거·기준연도·단위·추정/잠정 여부·불확실성과 중복 처리 기록. D fact-check.md, E implementation-review.md. 서로 파일 수정 금지, git commit은 메인만.
- 원고 공백 포함 intro+소제목+본문 기준 역사/정치경제 2500~3500자, 사회 2000~3000자 권장. 한국어 자연스러운 평서체, 짧은 문단. 원자료 긴 인용 금지.
- 표기: 케레이·자니베크, 아불하이르, 누르술탄 나자르바예프, 카심조마르트 토카예프, 아스타나·알마티, 주즈(Jüz)·루(Ru), 텡기즈·카샤간·카라차가나크, 톈산.
- 2026-10-19까지 실제 발표된 자료만. 2026 연간 확정치 주장 금지. 가능하면 최신 공식 통계, 3국 비교는 같은 연도·정의. 명목/실질/PPP, 총유입/순유입/잔액 구분. 기존 경제표의 2024 WDI와 충돌 시 별도 보고.
- 출처는 원문 직접 확인, 현지 공식/학술/국제기구/기업 공시 우선. 논쟁 수치 범위와 정의 표시. 확인 못한 주장은 삭제/유보. 금액의 원화 표시는 기존 research-data.js의 명시된 환율을 쓰거나 금액 자체를 본문에서 생략.
- 1731≠전지역 동시 병합; 기근 정책 인과; 456=핵실험 횟수와 장치 수 구별; 선거 통계≠경쟁성; 자본 등록국≠UBO; 원소 홍보문구≠118개 확인; 부동산가≠소득; 남북/언어 일반화 금지.
- 사용자 5장의 분산 지시보다 7.3/11 최종 구조 우선: 사회를 신규 세 번째 소규모 심층 해설로 구현, 5개 core를 8개로 만들지 않음.
