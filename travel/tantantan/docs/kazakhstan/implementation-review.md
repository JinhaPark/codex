# 웹 구현 검토와 품질검증

기준: 2026-10-19. 담당 E. E는 공통 렌더러·CSS·main.js·서비스워커를 수정하지 않았다. 메인 에이전트가 공통 구현을 통합했다.

## 기존 구조와 구현 권고

- `render-guide.js`의 `renderNarrative`는 콘텐츠 `{id,title,intro,chapters,sources}`를 `<section><h3>…`와 네이티브 `<details><summary>`로 렌더링한다. 신규 3개 원고에도 그대로 적용할 수 있다.
- 기존 core 5개의 `data-core-section` 값과 순서(geography, history, resources, economy, education)를 보존한다. 신규 그룹은 `id="kazakhstan-deep-dives"`와 h2 `카자흐스탄 심층 해설`을 사용하고 교육 뒤·city-guides 앞에 배치한다. 신규 각 section의 id는 공통 집필 기준을 따른다.
- 신규 그룹은 core-section으로 표시하지 않는다. 주 목차의 신규 그룹 링크와 별도 하위 목차의 세 원고 링크로 이동 경로를 제공한다. h2→h3→summary 구조와 네이티브 키보드 조작을 유지한다.
- 기존 `.bukhara-*` CSS는 긴 한국어, 390px 이하 글자·패딩 조정, 최소 너비 0, 문단 줄바꿈, 출처 URL 분할을 지원한다. 새로운 레이아웃이나 의존성이 필요하지 않다. 긴 제목 줄바꿈과 anchor의 고정 메뉴 가림만 브라우저에서 확인한다.
- `renderSources`의 자료 확인일은 기존에 2026-10-18로 하드코딩되어 있다. 신규 원고의 10/19 확인일을 정확히 표시하도록 선택 인자를 추가하는 최소 변경을 권고한다. 기존 호출 기본값은 유지할 수 있다.
- `main.js`는 여행 해설 탭에서 한 번에 `renderGuide()`를 삽입한다. 신규 JS는 Vite 번들에 포함되므로 이미지/일정/회화/환율 코드나 static path 변경이 필요 없다.

## PWA 범위

- `public/sw.js`는 `/codex/` 경로의 동일 출처 GET 응답을 현재 캐시에 저장한다. 최초 설치에서 root만 precache하며, 방문해 받아 둔 hashed JS/CSS는 동적으로 캐시한다. 신규 콘텐츠가 JS 번들에 포함되면 기존 오프라인 방식에 편입된다.
- 메인 에이전트가 캐시 이름을 `ca26-pages-v14-kazakhstan-deep-dives`로 올렸다. 새 worker 활성화 시 이전 여행 가이드 캐시가 삭제되며 fetch 정책은 유지된다. 기존 캐시 방문자의 새 버전 수신은 배포 후에도 점검한다.
- 실제 Chromium에서 온라인 방문→SW 활성화→asset 캐시 완료→네트워크 끊기→페이지 reload를 수행했다. 오프라인에서 core 5개와 신규 3개 모두 렌더링됨을 확인했다. 한 번도 열어 받아 두지 않은 모든 사진의 오프라인 가용성을 뜻하지 않는다.

## 자동 테스트

`tests/kazakhstan.test.js`는 실제 콘텐츠와 실제 renderGuide를 읽어 다음을 확인한다.

- 세 콘텐츠의 고유 id·제목, 읽을 수 있는 intro/장/문단, HTTPS 출처, 제외 대상 부재.
- core 5개 순서와 개수, 신규 그룹과 세 원고의 교육→신규→도시 순서.
- 모든 내부 목차 target이 존재하며 ID가 중복되지 않음.
- 모든 신규 문단 출력, 기존 알마티 전체 문단과 도시·건축 anchor 보존, 기존 일러스트와 기타 안내 출력.
- 신규 세 원고의 자료 확인일 2026-10-19 및 원자료 href 출력.

Node에서 기존 JSON import를 지원하기 위해 기존 illustration 모듈의 JSON 데이터만 인라인해 data URL로 불러온다. 렌더러 동작을 stub하거나 변경하지 않는다. 내용 정확성과 모바일 레이아웃은 이 단위 테스트의 검증 대상이 아니다.

## 실제 브라우저 검증 환경과 절차

새 dependencies 없이 기존 런타임의 Playwright(`/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`)와 기존 Chromium(`/workspace/scratch/fad621c91a55/qa-runtime-new/chromium`)을 재사용할 수 있다. 실행에 필요한 공유 라이브러리는 같은 qa-runtime-new/lib에 있다. 프로젝트 package.json이나 lockfile 변경이 필요 없다.

권장 절차: Vite Pages base(`/codex/`)로 빌드·preview를 띄우고 360×800, 390×844, 768×1024에서 여행 해설 탭을 선택한다. 신규 목차 링크의 hash·이동 위치를 확인하고 각 details를 클릭 및 키보드로 연다. 모든 장을 연 상태에서 document와 각 본문의 scrollWidth/clientWidth 차이를 검사하고 이미지·JS·CSS 오류와 콘솔 오류를 수집한다. 검증 후 viewport 스크린샷으로 긴 제목과 본문 줄바꿈을 확인한다.

## 수행 결과

- 저장소 구조·CSS·PWA 코드·기존 테스트 검토 완료.
- 신규 테스트 7개를 포함한 전체 21개 테스트 통과 및 Vite build 성공은 메인 에이전트가 실행했다.
- Chromium 153에서 360×800, 390×844, 768×1024 viewport 실제 검증 완료. 신규 목차 3개의 hash 일치, 스크롤 후 제목의 화면 y 약 80px, 각 첫 아코디언의 클릭 및 Enter 열기/닫기를 확인했다.
- 신규 모든 장과 출처를 연 상태에서 문서 가로 overflow 0px, 신규 영역 개별 요소 overflow 없음. core 순서 일치, 신규 3개, 알마티 보존. JavaScript pageerror 및 요청 중 HTTP 400 이상 응답 없음.
- 온라인 방문 뒤 캐시된 코드로 오프라인 reload하여 신규 3개와 core 5개 표시를 확인했다.
- 최초 Chromium의 한글 폰트 부재는 QA 전용 Noto Sans CJK KR과 임시 fontconfig로 해결했다. 폰트를 저장소에 추가하지 않고 세 viewport에서 전체 검사를 다시 실행해 동일하게 통과했다. 360/390/768px 스크린샷을 직접 열어 실제 한글 제목·본문의 줄바꿈, 자간, 메뉴, 카드 패딩과 키보드 focus 표시가 읽기 적절하고 잘리지 않음을 확인했다. 실제 iPhone Safari 검증은 배포 후 수동 확인 대상이다.
- 공개 사이트 Playwright 접속은 `net::ERR_EMPTY_RESPONSE`로 실패하여 브라우저 배포 UI 검증 미완료. 메인 에이전트는 curl GET으로 배포 HTML 제목 `중앙아시아 탄탄탄 | 2026 여행기`, 기존 bundle `/codex/assets/index-BD0hGBG4.js` 및 CSS `/codex/assets/index-DhzJzpNS.css`를 확인했다. 이번 신규 작업은 PR 전용이므로 공개 사이트의 신규 원고 표시를 기대하지 않는다.
- 검증 스크립트·JSON·스크린샷은 작업용 scratch에 보관했고 저장소 커밋 대상에서 제외했다. 원고 문구가 이후 변경되는 경우 최종 build를 다시 실행해야 한다.
