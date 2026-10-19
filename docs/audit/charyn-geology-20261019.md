# 차른 협곡 지질학 해설 검증

확인일: 2026-10-19. 기준: main bd69f8be6fb0540cc7fa92e1b5355650a9c3678e.

## 범위와 중복 정리

- 저장소 루트·src·docs 및 상위 작업 경로에 적용되는 AGENTS.md가 없음을 확인했다. 새로 만들지 않았다. 기존 editorial 브랜치·영문 동사형 커밋 관례와 package.json의 test/build를 따른다.
- 실제 표시 경로: src/itinerary.json → src/main.js의 일정 탭 → 8일차 방문지와 지도 → 차른 협곡. placeDetails[0].description만 교체했다. 렌더러는 이 문자열을 이스케이프하여 단일 p로 표시한다.
- 기존 강의 침식·풍화·붉은 성곽 형태·성들의 계곡 명칭·지층 관찰을 새 문단에 통합했다. 별도 유사 문단을 추가하지 않았다. 안전한 관람 지점 안내도 유지했다.
- 같은 날 guideKo와 src/history-almaty.js의 개괄은 기존 요약으로 유지하고, 상세 문단에는 퇴적 시기/침식 시기 구분, 퇴적물 구성, 지류 골짜기의 작용, 차별침식을 보완했다. 색채의 일반 원리와 지형 형성의 핵심 연결에 필요한 최소 반복은 남겼다.
- 다른 관광지·사진·캡션·일정·지도·도시 해설·서비스워커는 변경하지 않는다. 출처는 기존 docs/audit 연구·검증 기록 관례로 이 문서에 남긴다.

## 자료와 판단

1. Nigmatova 외(2021), *Canyons of the Charyn River (South-East Kazakhstan): Geological History and Geotourism*, GeoJournal of Tourism and Geosites 34(1), 102–111. DOI: [10.30892/gtg.34114-625](https://doi.org/10.30892/gtg.34114-625). [발행처 원문 PDF](https://gtg.webhost.uoradea.ro/PDF/GTG-1-2021/gtg.34114-625.pdf)를 직접 확인했다.
   - pp.104–108: 신제3기 호수·하천·산록 퇴적물은 점토·이회암·모래·자갈·각력 등으로 다양하다. 협곡 전체를 단일 사암층으로 표현하지 않았다. 지층 퇴적과 제4기의 하방침식을 구분했다.
   - p.108 Route 4: 성들의 계곡은 본류에 서쪽에서 합류하는 골짜기이며, 신제3기 각력성 퇴적층과 호수 기원 이회암 렌즈를 포함한다. 풍화·일시적 물길·강풍의 조형 작용을 설명한다. 본류가 탑 하나하나를 직접 깎았다고 쓰지 않았다.
   - 차별침식은 아래 NPS의 일반 원리와 현지의 다양한 층·침식 지형을 연결한 설명적 해석이다. 개별 탑의 덮개암·강도 측정을 확인한 것으로 제시하지 않는다.
2. Mücklisch 외(2025), Geo4Göttingen 학회 초록, [일리 분지 퇴적·구조로 본 톈산 융기](https://www.dggv.de/e-publikationen/sedimentological-and-structural-evidence-for-an-eocene-start-of-tian-shan-mountain-uplift-in-the-ili-basin-southeastern-kazakhstan/), DOI 10.48380/22dq-mn14. 원문 직접 확인. 인도–아시아 충돌의 원거리 변형과 지역·시기별로 다른 융기를 구분한다. 융기를 협곡 침식의 단일 원인이나 동일 시점 사건으로 단정하지 않았다. 학회 초록이라는 근거 수준도 유의했다.
3. USGS, [Find-A-Feature: Red Rocks](https://www.usgs.gov/educational-resources/find-feature-red-rocks). 원문 직접 확인. 철 산화물의 붉은 착색이라는 일반 지질학 원리만 적용했다. 차른 현지의 적철석 분석 결과를 확인한 것은 아니므로 ‘일반적으로 … 관련’ 및 색만으로 광물을 확정할 수 없다는 한계를 유지했다.
4. NPS, [Differential Erosion](https://www.nps.gov/places/differential-erosion.htm), 갱신 2025-09-08. 원문 직접 확인. 단단한 층과 무른 층의 서로 다른 침식 속도를 설명하는 일반 원리로 사용했으며 미국 지층 연대를 차른에 적용하지 않았다.

## 확인 한계

- 지층 전체나 협곡 전체의 형성을 ‘1,200만 년 전’ 한 시점으로 정하지 않았다. 관광 문구의 지층 나이를 침식 지속 기간으로 바꾸지 않았다.
- 위 2021 논문의 중기 플라이스토세 하방침식·특정 하류 구간 약 35만 년 서술은 모든 구간의 확정 연대로 일반화하지 않았다. 본문에는 신제3기 퇴적과 이후 제4기 협곡 발달이라는 구분만 사용했다.
- 특정 철 광물, 각 탑의 강도 차이, 개별 집중호우의 침식량·빈도는 현지 측정 자료를 확보하지 못했다. 이를 정량 사실로 추가하지 않았다.

## 검증 결과

- npm test: 21/21 통과. npm run build: 통과(Vite 6.4.4).
- 빌드 결과를 로컬 HTTP로 제공하고 Playwright/Chromium에서 일정 8일차를 직접 열었다. 320·375·390·430px에서 차른 협곡 카드의 p가 원고와 정확히 일치하고 문서·문단의 가로 넘침이 없음을 확인했다. JavaScript pageerror 없음.
- 첫 스크린샷에는 QA 환경의 한국어 글꼴이 없어 글리프가 네모로 표시되었다. QA에만 Noto Sans KR을 주입하여 재검증했다. 사이트 CSS·폰트 의존성은 변경하지 않았다. iPhone 실기기 검증은 실시하지 않았다.
- JSON 구조 비교로 해당 description 한 필드 외의 동일성을 확인한다. 배포하지 않으므로 공개 사이트는 기존 상태다.
