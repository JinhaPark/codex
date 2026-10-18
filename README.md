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
