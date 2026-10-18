# Central Asia Travel Companion

Mobile-first Vite website for the October 12–21, 2026 Uzbekistan–Kyrgyzstan–Kazakhstan itinerary.

## Local development

```sh
npm install
npm run dev
npm run build
```

## GitHub Pages

The Vite base is `/codex/`. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Pushes to `main` deploy via `.github/workflows/pages.yml` to https://jinhapark.github.io/codex/.

The app includes local checklist storage, offline caching after the first successful visit, and external Google Maps search links. The itinerary is a travel guide, not a real-time transport feed. No personal booking identifiers or guide contact numbers are published.

## 사진 출처 및 운영 정책

사용자가 제공한 여행 사진을 바탕으로 수채화·색연필 일러스트 23점을 제작했습니다. 원본 사진은 저장소에 포함하지 않으며, 게시용 WebP에는 EXIF·GPS 등 사진 메타데이터가 없습니다. 외부 사진 검색이나 새 API 키 없이 장별 본문·일정·쇼핑 화면에서 반응형으로 표시합니다.

이미지는 여행의 시각적 기록이며, 필사본 문자나 제품 라벨의 정확한 판독 자료는 아닙니다. [사진별 배치·크기·용량 및 검증 결과](docs/illustrated-journal.md)를 참고하세요.

[부하라·레기스탄·촐폰아타 추가 12점의 배치와 파일 정보](docs/bukhara-registan-illustrations.md)도 확인할 수 있습니다.

## 3국 통합 해설과 검증

여행 해설은 지리·기후·생활양식 → 역사 → 자원·에너지 → 경제 → 교육 순서입니다. 도시·유적 상세와 일정 기능은 별도로 유지합니다. 경제표는 2024년 WDI 3국 자료이며, 원화 표시는 NBKR 2026-10-17 교차환율을 사용합니다. 교육 비용은 공식 요율과 추정 생활비를 구분한 조건부 시나리오입니다.

- [최종 통합 감사 및 남은 한계](docs/final-integration-audit.md)
- [본문 측정과 감축률](docs/audit/measurement.md) · [편집 정책](docs/audit/editorial-policy.md)
- [교육 원자료·조건](docs/audit/education.md) · [이미지 23점 전수 감사](docs/audit/images.md)

```sh
npm test
npm run build
node scripts/measure-guide.mjs
```

선택적인 브라우저 회귀 검사는 Playwright와 Chromium이 준비된 환경에서 `QA_CHROMIUM=/path/to/chromium node scripts/verify-browser.cjs`로 실행합니다. 프로덕션 의존성을 추가하지 않았습니다. 실제 수행 범위와 로컬 환경 조건은 [브라우저 검증](docs/audit/browser.md)에 기록합니다. PR의 테스트·빌드는 GitHub Actions에서도 실행하며 배포는 승인 후 main 병합 시 기존 Pages workflow가 수행합니다.
