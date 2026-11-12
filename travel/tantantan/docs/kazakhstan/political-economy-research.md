# 정치경제·투자 검증 노트

조사 기준 2026-10-19. 담당 B. 아래 URL은 검색만 한 제목이 아니라 원문 열기/공식 검색 추출 또는 메인이 수집한 원본 JSON을 확인한 자료다. 원고는 `src/kazakhstan-political-economy.js`. 본문 금액 환산은 사용하지 않아 환율 기준 없음. PPP 국제달러는 원화 환산 대상이 아니다. 2026 연간 확정치를 사용하지 않았다.

## 1. 정치·선거와 최신 법제

| 주장 | 확인 자료·시점 | 판단 |
|---|---|---|
| 1990 공화국 대통령 취임, 독립 뒤 2019 퇴임 | 초대 대통령 공식 약력 및 ODIHR 2019 관찰보고(아래) | 소련 시기 시작과 독립 이후를 구분 |
| 2019 토카예프 승계, 전임자의 당·안보회의 영향력 잔존 | [ODIHR 2019 보고](https://odihr.osce.org/sites/default/files/f/documents/4/2/422510.pdf) | 단순 즉시 권력교체로 해석하지 않음 |
| 2022년 1월 이후 전임자 권력기반 축소 | [OSW 2022-01-21 분석](https://www.osw.waw.pl/en/publikacje/analyses/2022-01-21/kazakhstan-work-starts-dismantling-nazarbayev-system) | 안보회의 의장 이동 등 제도변화와 연구자 해석 구분. 폭력의 모든 행위자·원인은 확정하지 않음 |
| 2022 대선 투표율69.44%, 토카예프81.31% | [외무부 CEC 인용, 2022-11-21](https://www.gov.kz/org/mfa/press/news/details/464022?lang=en) | 8,300,046명 투표. 외무부 이 발표는 preliminary results라고 명시. D는 CEC 작성 A-WEB 보고로 같은 수치 교차확인. 정부의 ‘위반 없었다’는 전체적 평가는 채택하지 않음 |
| 실질적 경쟁성 부족·표현/집회 자유 제약·개표 투명성 문제 | [ODIHR 2022-11-21](https://odihr.osce.org/odihr/elections/531812), [최종 보고2023-07-14](https://odihr.osce.org/odihr/elections/kazakhstan/548593) | 투표 참여율과 경쟁성 별개. 2022 평가임을 본문에 명시 |
| 2026 신헌법 | [헌법재판소 시행 공고](https://www.gov.kz/org/ksrk/press/news/details/1250997?lang=en), [러시아어 헌법](https://www.akorda.kz/public/ru/konstituciya-respubliki-kazahstan-3053339), [대통령 의회 연설](https://www.akorda.kz/en/remarks-by-the-head-of-state-kassym-jomart-tokayev-at-a-joint-session-of-the-two-chambers-of-parliament-161836) | 3월15일 채택,7월1일 시행. 단원제 쿠룰타이·부통령직. 1995/2022 조문을 현행으로 표현하지 않음. 임기 초기화 가능성이라는 언론 추측은 본문 제외 |

정치체제와 경제성장은 동시 관찰 사실이다. 권력 집중의 성장 인과효과를 식별한 연구나 반사실 모형을 제시하지 않았으므로 단독 원인으로 주장하지 않는다. 정책 연속성이라는 효과 가능성과 감시·경쟁 제약을 구분했다.

## 2. 수도 이전: 사실과 해석

- [1994-07-06 의회 결의, 1997-12-10 실제 이전](https://www.gov.kz/org/abay-makanshy/press/events/details/37689?lang=en). 1997-10-20 대통령령 공포일과 실제 이전일을 구분. 1998 아스타나 개칭.
- [총리실 개발 회고](https://primeminister.kz/en/news/reviews/investment-attraction-large-scale-construction-and-international-recognition-how-the-main-city-of-kazakhstan-developed): 알마티 확장·지진·생태환경, 교통·개발 여건 등의 공식 논리.
- [Edward Schatz, When Capital Cities Move, Kellogg Working Paper](https://kellogg.nd.edu/documents/1596): 국가·민족 건설의 정치지리라는 학술 해석. 북부 통합·대외 지정학·지도자의 상징정치 해석을 정부의 유일한 공식 목적처럼 표현하지 않음.
- 총비용은 건설 투자·공공예산·특정 기간의 합계를 구분하기 어려워 정확 총액 미제시. 비용이 없었다고 주장하지 않으며 기반시설·관청·주택 조성 비용을 본문에 기록.

## 3. 장기 경제지표: 동일 출처·동일 연도

원자료 `data/wdi-kazakhstan-long-run-2026-10-19.json`. 메인 에이전트가 API 수집 후 B가 파일의 지표·단위·해당 값을 직접 확인했다. WDI 응답 업데이트일 2026-10-08, 취득 2026-10-19. 지표 값에 provisional 플래그가 별도 없어 WDI 관측값으로 표기하며 2026 추계와 혼합하지 않는다.

| 지표 | 카자흐스탄 | 우즈베키스탄 | 키르기스스탄 |
|---|---:|---:|---:|
| 1인당 실질 GDP,1991,2015불변USD | 4910.153241 | 1677.007052 | 1089.900055 |
| 같은 지표,2024 | 11872.784263 | 4477.907455 | 1423.586247 |
| 2024/1991 배수(산술계산) | 2.4180 | 2.6702 | 1.3062 |
| 1인당 PPP GDP,1991,2021불변 국제달러 | 14877.527354 | 4118.515858 | 5520.429799 |
| 같은 지표,2024 | 35973.963329 | 10997.170729 | 7210.576698 |

- [실질 GDP API NY.GDP.PCAP.KD](https://api.worldbank.org/v2/country/KAZ;UZB;KGZ/indicator/NY.GDP.PCAP.KD?date=1991:2024&format=json&per_page=200).
- [PPP API NY.GDP.PCAP.PP.KD](https://api.worldbank.org/v2/country/KAZ;UZB;KGZ/indicator/NY.GDP.PCAP.PP.KD?date=1991:2024&format=json&per_page=200).
- 배수는 1991 기준점 선택에 의존하고 독립 초기 불황과 이후 회복을 포함한다. 높은 배수가 높은 2024 수준을 뜻하지 않는다. PPP는 평균임금·가처분소득·모든 가계 생활수준과 다름.
- 기존 `central-asia-economy.js`의2024 명목 GDP/인구/송금표는 반복하지 않음. 우즈베키스탄은 내수·제조업, 키르기스스탄은 금·송금·물류라는 출발조건 차이와 연결.
- [WB 빈곤·형평성2024-12-12](https://www.worldbank.org/en/news/press-release/2024/12/12/kazakhstan-poverty-and-equity-assessment-2024): 생활수준 개선과 빈곤 감소 둔화·지역 격차. 국제빈곤선 PPP 기준 개정으로 시계열 혼동 우려가 있어 빈곤률 숫자는 본문 생략.
- 노동생산성·산업별 부가가치·도시화·평균임금·가계소득·공공서비스를 모두 같은 정의·연도로 묶은 3국표는 확보하지 못했다. 소득순위를 임금·빈곤·서비스 순위로 대체하지 않음. 기존 표의 명목달러를 장기 실질 성장률로 사용하지 않음.

## 4. 원소 수 홍보문구 판정

[정부 투자 소개](https://www.gov.kz/article/64601?lang=en)와 [Baiterek 공식 투자 페이지](https://baiterek.gov.kz/en/investment-opportunities/)를 직접 열었다. 두 페이지의 광물 설명은 **105개 중99개 발견,70개 탐사,60개(또는60개 이상) 생산**이라는 표현이다. Baiterek 페이지 상단은2025 투자·2026 인구로 갱신되어도 본문에는1800만 인구 등 오래된 표현이 남아 있다.

따라서 ‘최신 공식 과학조사에서118개 중99개 확인’으로 바꾸지 않는다. 원소별 목록·조사일·매장량 기준 미공개이고 105라는 과거 분모를 쓰므로 홍보자료의 반복 문구다. 원소 존재, 경제성 있는 광상, 확인 매장량, 생산량은 별개다. 본문은 자원이 다양하다는 사실을 자원명으로 제시하고 ‘99개’는 공식 투자홍보의 설명임을 한정했다. ‘모든 원소’와 과학적 의미가 모호한 ‘거의 모든 주요 원소’는 사용하지 않았다.

## 5. FDI: 국적·산업·통계 정의

[NBK 방향원칙 통계](https://nationalbank.kz/en/news/pryamye-investicii-po-napravleniyu-vlozheniya):10%이상 장기 지분관계, 지분·부채성 대출·재투자수익 포함. 순유입은 회수·상환 등을 반영하며 자산부채원칙과 방향원칙도 다르다. 이 통계의 총유입은 지분 증가·재투자수익(손실 포함)·상환을 차감하지 않은 부채성 유입으로 구성되어 일부 국가·업종 값이 음수일 수도 있다. 모든 음수를 제거한 단순 양의 현금유입 합계가 아니며 순증가나 기말 잔액도 아니다. 잔액은 환율·평가변동까지 반영하므로 연간 총유입을 단순 누적해 대체할 수 없다.

- 중앙은행 최신 총유입 첨부(2026-09-30), 순유입·소득·잔액 첨부(2026-10-09) 게시 사실 확인. 메인이 최신 XLSX를 내려받고 B가 openpyxl로 아래 국가·업종 원본을 직접 분석했다. 최신 총유입 순위·액수는 아래 보완표로 확인했다. 순유입·잔액 최신 첨부의 액수는 별도로 분석하지 않았다.
- [KAZAKH INVEST 2022 총유입 발표](https://invest.gov.kz/media-center/press-releases/pritok-pryamykh-inostrannykh-investitsiy-v-kazakhstan-dostig-rekordnogo-znacheniya-za-poslednie-10-l/):2022 총유입280억USD(발표치), 네덜란드83억·미국51억·스위스28억·러시아15억·중국14억. 국가 순위에서 이들만 남겨 연속1~5위로 만들지 않는다. 중간에 벨기에·한국 등이 있음. 이 과거 자료를 최신 순위로 제시하지 않음.
- [2025-06-23 공시 PDF](https://www.rns-pdf.londonstockexchange.com/rns/9827N_1-2025-6-23.pdf)는2024 총유입 상위 러시아40억·네덜란드38억·한국12억·벨기에12억·중국11억USD를 NBK 기반으로 제시. 발표 시점·개정 차이를 고려해 연구노트 참고만 하고 본문 숫자·순위에는 사용하지 않음.
- [OECD2012 투자정책](https://www.oecd.org/content/dam/oecd/en/publications/reports/2012/04/oecd-investment-policy-reviews-kazakhstan-2012_g1g1b012/9789264121812-en.pdf): 네덜란드 SPE 등록 투자는 UBO가 다른 나라여도 네덜란드로 기록함을 명시. 이 방법론 근거를 최신 액수로 오독하지 않음.
- 집중 산업은 대형 탄화수소 개발·광업이 핵심이며 제조·상업·금융·통신 투자도 존재. 전산 통계에서 전문·과학기술 서비스에 잡히는 지질탐사와 광업 분류를 함부로 합산하지 않음.

## 6. 주요 프로젝트의 지분 및 소유구조

2026-10-19 열람. 비율은 운영사/모회사 공시의 프로젝트 참여지분이며 국가 수익배분율이 아님.

| 사업 | 직접 참여/공시 기업 지분 | 검증 근거 |
|---|---|---|
| Tengizchevroil | Chevron50%,ExxonMobil25%,KazMunayGas20%,Lukoil5% | [Chevron2025-01-24](https://chevroncorp.gcs-web.com/news-releases/news-release-details/chevron-achieves-first-oil-future-growth-project-kazakhstan) 직접 읽기. 기업별 자회사 생략 호칭이라고 공시 스스로 명시 |
| 카샤간/North Caspian | KMG16.88%,Eni·Shell·ExxonMobil·TotalEnergies 각16.81%,CNPC8.33%,INPEX7.56% | [NCOC 경영·참여자](https://www.ncoc.kz/en/page/our-management) 공식검색추출; 직접 본문은빈응답. D가 [Kashagan B.V. 공식 참여사 자료](https://www.kbv.kz/en/home-page/)를 직접 확인하여 교차검증. KMG 일반 사업 페이지는 일부 혼합시점 정보가 있어 이 지분표의 근거로 사용하지 않음. 반올림으로합계100.01%; 임의보정 금지 |
| 카라차가나크/KPO | Eni29.25%,Shell29.25%,Chevron18%,Lukoil13.5%,KMG10% | [KPO parent companies](https://www.kpo.kz/en/about-kpo/parent-companies) 직접 읽기. Shell은100%계열 BG Karachaganak Limited 경유 명시 |
| 잉카이 우라늄 | Kazatomprom60%,Cameco40% | [Cameco 사업자료](https://www.cameco.com/businesses/uranium-operations/kazakhstan/inkai),[2025 연차 SEC](https://www.sec.gov/Archives/edgar/data/1009001/000119312526116229/d34605dex991.htm) |
| Kazzinc 아연·금속 | Glencore plc 간접69.7% | [2025 공급망실사 공식보고](https://www.glencore.com/.rest/api/v1/documents/static/6899f09b-5464-4c2e-a653-30ce3d6adfa2/2025%2BKazzinc%2BPublic%2BResponsible%2BSupply%2BChain%2BDue%2BDiligence%2BReport.pdf). 나머지 지분과 최종개인 전원은 이번노트에서 미확인 |

최종 지배와 개인 UBO의 차이:
- KMG·Kazatomprom은 카자흐스탄 국가가 지배하는 기업이며, CNPC는 중국 국유기업 그룹이다. 각 사업자 법인의 중간지주회사 등록국을 최종국적과 같게 취급하지 않는다.
- Chevron·ExxonMobil·Shell·TotalEnergies·Cameco·Glencore 등 상장 모회사에는 분산 주주가 있다. 모회사까지 추적했다는 것과 최종 개인 수익자 전원을 알아냈다는 것은 다르다. Eni·INPEX 등에는 국가 지분도 있어 모든 해외기업을 동일한 민간자본이라고 묶지 않는다. 개별 최신 정부 지분율은 별도 검증하지 않아 숫자 미제시.
- BlackRock·Vanguard의 개별 지분율을 이번에 공식 최신 공시로 재검증하지 않았으므로 숫자와 ‘최종 지배자’ 주장을 넣지 않는다. 자산운용사의 고객자산 관리·의결권행사·자기자본 소유를 구분해야 한다.
- 특정 민족·종교·경영자 배경을 자본 국적이나 통제증거로 삼지 않는다. 유전 계약 전체 및 조세·생산물분배 조항이 공개·검증되지 않은 범위는 국가 최종 take를 계산하지 않았다.

## 7. 금융·통신 분야의 자본: 과잉추론 방지

- Halyk: [공식2025 연차보고](https://halykbank.kz/storage/app/media/Investoram/2026/Halykbank_AR_2025.pdf),[2025-11-04 ALMEX 발표](https://halykbank.com/news/halyk-bank-provides-information-regarding-announcement-of-holding-group-almex). ALMEX가 지배주주이고 해외 유통 GDR이 존재한다는 구조 확인. 검색상69.7%는 연초/이전 보유량이며2025말 부분매각 공시가 있어 이를2026 현재 비율로 쓰지 않음. 최신 개인 UBO·잔여지분율을 여기서 재확정하지 않아 숫자 미제시.
- 통신: [Kazakhtelecom2024 연차의 지배구조](https://ar2024.telecom.kz/en/general-meeting-of-shareholders.html)는 삼룩을 통한 국가 지분 관리 설명. ‘해외투자자가 상장주식을 가진다’와 경영권 인수를 구분.
- Mobile Telecom-Service(Tele2/Altel)100% 인수는 [PIH2025-01 보도배포](https://www.prnewswire.com/in/news-releases/power-international-holding-pih-closes-a-landmark-transaction-to-finance-the-acquisition-of-100-of-mobile-telecom--service-llp-mts-from-kazakhtelecom-jsc-302355350.html) 공식 회사발표로 확인. PIH 회사홈 원문 경로는404. 직접 인수법인 이후 최종 개인 UBO·의결권 계약은 미확인; 카타르 국적과 정부소유를 동일시하지 않음.
- Kaspi 기존 기업소개는 반복하지 않음. 상장 및 기관투자가 존재가 단일 외국 지배의 증거는 아니다.

## 8. 전쟁·물가와 기존 콘텐츠 중복

[WB2023 봄 경제보고](https://www.worldbank.org/en/country/kazakhstan/publication/economic-update-spring-2023): 러시아 경제 인프라 연결과 전쟁충격·구매력 제약. [IMF2025 협의2026-01](https://www.elibrary.imf.org/view/journals/002/2026/017/article-A001-en.xml): 느슨한 재정·준재정 지출, 러시아 수입가격, 공공요금 조정이 물가에 작용. 특정 인플레이션율을 전쟁효과로 전부 귀속하지 않음. 기업·인력 이전과 주거비는 가능 경로로 쓰고 확정 기여율 미제시. CPC는 기존 자원해설에 상세하여 경로 설명 재작성 대신 수송위험과 수익의 관계만 연결.

중복 처리:
1. 기존 중앙아시아 역사와 알마티 도시사 보존. 수도 이전은 여행유적 설명 대신 국가통합·재정·정치적 동기의 관점으로 확장.
2. 기존 명목 비교표·기업서비스 소개는 복제하지 않고 새로운 실질·PPP 장기 비교만 추가.
3. 광물자원+해외자본은 본문287자 한 문단. 지분·기업구조·FDI 세부표는 이 노트에 보존.
4. 기존 PWA·이미지·회화·환율 파일 미수정. Halyk Arena 항목 없음.

남은 확인: 최신 NBK 순유입·잔액 첨부의 액수, 모든 참여회사 전체 법적체인·개인UBO, 국가 최종수익배분율, 3국 동년 임금·도시화·생산성 완전비교표. 이 미확인 항목을 본문에서 수치로 단정하지 않았다.


## 9. 최신 NBK 총유입 XLSX 직접 검증 보완

원본 [NBK download/136226](https://nationalbank.kz/file/download/136226), 2026-09-30 게시, 2026-10-19 다운로드. 메인 보존 원본에 대한 B 직접 분석. 워크시트 `Sheet2. country `의 3행 CX=2025, DC=2026, DD=1q2026, DE=2q2026; `Sheet1. industry`의 3행 CY=2025, DD=2026, DE=1q2026, DF=2q2026. 2행 단위 **over a period, mln. USD**. 2026 열은 Q1+Q2와 일치하므로 **2026 상반기 누계**이며 연간치·예측치가 아니다. 별도 확정/잠정 플래그는 없으며 게시 시점의 개정 가능 통계로 취급한다. 원화 환산 없음.

### 국가별 총유입 순위

단위 백만 USD, 2025는 연간, 2026은 상반기. 국적은 통계상 직접 투자자 등록 국가이며 UBO 국적 순위가 아니다. 기간별 각각 내림차순으로 정렬했다.

| 순위 | 2025 등록 국가 | 2025 총유입 | 2026 상반기 등록 국가 | 2026 상반기 총유입 |
|---|---|---:|---|---:|
|1|네덜란드|4595.454|네덜란드|1968.316|
|2|러시아|2899.794|러시아|1494.840|
|3|중국|2816.466|중국|1470.999|
|4|아랍에미리트|1626.251|카타르|1307.451|
|5|싱가포르|1448.260|아랍에미리트|711.628|
|6|카타르|1256.252|한국|516.535|
|7|스위스|1092.938|키프로스|493.559|
|8|벨기에|1044.477|벨기에|428.151|
|9|한국|1014.149|영국|397.438|
|10|프랑스|946.112|독일|356.280|
|전체 총유입|모든 국가·국제기구 포함|20418.755|모든 국가·국제기구 포함|9364.910|

미국은 2025 **-3205.978**, 2026 상반기 **-1634.282**백만 USD. 스위스는 2026 상반기 **-10.240**백만 USD로 상위권에 없다. 이 음수는 ‘미국계 기업이 자본을 전부 철수했다’는 뜻으로 해석할 수 없다. 워크시트 주석상 총유입에 **외국 직접투자자의 미배당 이익(손실) 지분**이 포함되기 때문이다. 재투자손실·지분·부채 요소를 분해하지 않은 상태에서 구체 음수 원인을 특정 기업에 귀속하지 않는다. 국가별 합계는 국제기구와 미분류 행을 포함하면 TOTAL과 일치한다.

### 업종별 총유입 순위

상위 업종은 하위 코드를 중복 합산하지 않고 A/B/C 등 최상위 단일문자 코드만 비교했다. 총유입은 신규 공장 건설액이나 고정자본형성액과 같지 않다. 기업 인수·재투자수익·관계사 자금도 포함한다.

| 순위 | 2025 업종 | 2025 백만USD | 2026 상반기 업종 | 2026 상반기 백만USD |
|---|---|---:|---|---:|
|1|도소매·자동차 수리(G)|4778.134|도소매·자동차 수리(G)|2201.320|
|2|제조업(C)|4351.084|금융·보험(K)|1932.129|
|3|금융·보험(K)|4264.007|제조업(C)|1812.793|
|4|광업·채석업(B)|3317.239|건설(F)|1104.290|
|5|정보·통신(J)|1388.096|광업·채석업(B)|816.009|
|6|운수·창고(H)|976.985|운수·창고(H)|539.003|
|7|전기·가스·증기·냉난방(D)|546.738|정보·통신(J)|278.813|
|8|전문·과학기술(M)|307.485|전기·가스·증기·냉난방(D)|277.442|

하위 석유·가스 채굴(BB)은 2025 **615.926**, 2026 상반기 **-348.964**백만 USD다. 따라서 장기 성장에서 탄화수소 개발이 중요했다는 역사적 설명을 ‘최신 연간 총유입도 석유가 항상1위’로 확대하면 틀린다. 본문의 소유구조 문단은 나라 목록을 예시로만 사용하며 최신 순위로 제시하지 않는다. 이 보완으로 최신 국가·업종 총유입 자료 미확보 제한은 해소되었고, 최신 순유입·잔액 액수 분석은 별도 남아 있다.
