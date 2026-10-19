# 열린 PR 통합 검수 — 2026-10-19

사용자의 열린 PR 점검·병합 지시에 따라 PR #3(디반베기 그림)과 #4(카자흐스탄 심층 해설)를 검토했다. 두 PR의 기존 CI는 성공했다. PR #3은 main에 merge commit 0b938935da958fb00d159f6241af5a644b1d6b9c로 병합했다.

PR #4에 새 main을 통합하며 public/sw.js와 tests/service-worker.test.js의 서로 다른 v14 캐시명 충돌을 해결했다. 통합 캐시는 ca26-pages-v15-kazakhstan-divan-begi이며 이전 v13·두 v14 이름을 정리하고 타 사이트 캐시는 보존한다. scripts/verify-browser.cjs의 현재 캐시 fixture 이름도 일치시켰다. 기존 원고·이미지 manifest·출처 연구 노트는 각각 보존했다.

통합본 검증:
- npm test: 21/21 통과.
- npm run build: 성공, JS index-jsMfiaA_.js / CSS index-BlidpEYk.css.
- git diff --check: 통과.
- Chromium153,360×800/390×844/768×1024: core5·신규3·도시 유지,목차 hash·제목 위치·클릭/Enter 아코디언 정상. 가로 넘침0,JS오류·HTTP오류 없음.
- v15의 방문 후 오프라인 재로딩: core5·신규3과 디반베기 그림 decode 성공.

터미널 push 인증 수단이 없어 연결된 GitHub API로 동일 tree를 게시했다. 최종 main 병합 및 Pages 결과는 GitHub PR/Actions 기록이 기준이다. 실제 iPhone Safari와 실제 과거 배포 번들 전체 캐시 마이그레이션은 별도 수동 확인 대상이다.

## 작업 중 새로 열린 PR #5 추가 통합

목록 재확인에서 PR #5(비비하눔·CC0 모히 호사)를 발견하여 같은 사용자 병합 지시 범위에서 포함했다. PR #5 head 9f48f57에 main dbfc3e4를 병합해 디반베기와 신규 두 그림을 manifest에 모두 보존했고, 여행지 현황 요청3·4·11도 모두 확보로 유지했다. 병렬 분기의 browser.json은 합성하지 않고 실제 통합본 브라우저 검증으로 다시 생성했다. browser.md는 분기별 과거 검사 이력을 모두 보존한다. v15 두 분기의 캐시는 v16-combined-guide-images로 통합하고 회귀 테스트·브라우저 fixture를 갱신했다.

통합본 npm test21/21·Vite build 성공. Pillow46점122파일20,983,262bytes 전수 검사 통과. Chromium153,375·390·430px/10일/4탭:46점 각1회 배치,122변형 디코딩,캡션·alt·크기·가로넘침·중복·원화표·준비물·fixture환율·전체해설그림 방문 후 오프라인 재열람·v15→v16 통제 캐시 전환 모두 통과. 새 두 그림375px 한국어 캡처를 직접 확인했다. JS bundle index-CaGjygej.js. 카자흐스탄 원고·renderer·기존 core5는 변경하지 않았다.
