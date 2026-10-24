# 외부 링크와 실제 배포 확인

확인일: 2026-10-18 UTC. src/main.js에서 재귀적으로 연결된 JS/JSON의 HTTPS 문자열을 추출했다. 동적 지도 URL, 삭제 예정인 미사용 해설 모듈은 제외했다. 각 고유 URL을 6개 병렬·12초 제한으로 한 차례 GET 요청했다. 삭제·교체 전 URL을 포함한 검사 고유 URL은 총83개이며, 최종 연결 URL은81개다. 200 응답은 문헌 내용 전체의 사실 검증을 의미하지 않는다.

최종 연결 URL 81개: HTTP 정상 77개, 접근차단403 1개, 시간초과 1개,502 2개. 현재 연결된 URL 중404는 없다. 최초 검사 뒤 추가된 출처7개, 이후 교체·신규2개만 별도 GET했고 중복 재요청하지 않았다.

## 조치 및 접근 제한

| URL | 상태 | 판단 |
|---|---|---|
| https://ar2025.kegoc.kz/en/electricity-balance.html | timeout / timeout-or-network-error | 직접 GET 시간초과지만 같은 날 웹 검색 도구에서 2025 보고서 실제 본문 열람 성공. 영구 단절 아님. |
| https://eabr.org/upload/iblock/2ea/EDB_2026_Power-sector-of-CA_Report_EN.pdf | 403 / access-blocked | 직접 GET403이나 같은 날 웹 검색 도구에서 117쪽 PDF 실제 본문 열람 성공. 접근경로 차이. |
| https://pop.kgma.kg/ru/divisions/offices-sectors/student-campus | 502 / http-error | 502; 해당 공식 미러 검색 색인에서 요금표 확인했으나 현재 직접 페이지 불안정. 최신 요금 적용연도 미표시. |
| https://www2.customs.go.kr/busan/cm/cntnts/cntntsView.do?cntntsId=829&mi=7139 | 502 / http-error | 502; 관세청 공식 도메인이지만 이 직접 검사에서 현재 본문 수신 실패. 영구404로 간주하지 않음. |

- 발견된 Britannica404와 UNESCO 일반 프로그램 리다이렉트는 모두 `src/history-cholponata.js`에 연결되어 있었다. 둘 다 통합 담당자가 교체했고 대체 UNESCO 페이지200을 확인했다.
- 최초 조사에서 확인한 옛 World Bank `water-in-central-asia`404는 본 검사 전에 이미 제거되어 위81개에 포함하지 않았다.
- IMF의 `.ashx`가 같은 보고서 `.pdf`로 바뀌는 리다이렉트는 정상이다.
- 자동 도구 접근 차단/502/시간초과는 삭제된 페이지와 구분한다. 검색 색인에 내용이 있다는 사실도 현재 사용자 기기에서 항상 열림을 보장하지 않는다.

## 배포 상태

- `https://jinhapark.github.io/codex/`: HTTP200.
- JavaScript: `/codex/assets/index-DdziztQz.js`
- CSS: `/codex/assets/index-D6h_GDLF.css`
- HTML SHA256: `2dee33480f66ee510090509bebed0eb17a009d09da2d4e97322419231acfe2d3`
- 이전에 확인한 main `e3423e7246c2118cc641b35220cba04359459ab8` 빌드의 자산 이름과 같다. HTML에 git SHA가 직접 포함된 것은 아니므로 자산 이름과 이전 확인 기록을 연결한 판단이다.
- 이번 작업 브랜치의 새 콘텐츠가 배포됐다고 주장하지 않는다. PR 병합·Pages 배포 후 별도 확인이 필요하다.

## 환율 원문 확인

기존 수집파일 `fx.html`의 NBKR `getservice.jsp?lang=ENG` 표는 `from17.10.2026` 헤더 아래 `1 USD/KGS`를 `87,4500`으로 표시한다. 소수쉼표 표기를 정규화하면 87.45KGS/USD이다. 동일일 KRW 주간고시 0.0656KGS와 결합하는 교차환산의 입력을 확인했다. 원문과 환산 메타데이터는 별도 데이터 파일에 보존한다.

샤시마콤 공식 유산 페이지 `https://ich.unesco.org/en/RL/shashmaqom-music-00089`도 마지막 추가 검사에서200을 확인했다.
