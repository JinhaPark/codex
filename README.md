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

현재 관광지 사진은 **Wikimedia Commons**에서 장소명으로 검색해 불러옵니다. Google Places API는 사용하지 않습니다. 사진에는 Commons 원본 링크를 표시하며, 장소와 사진의 일치 여부는 자동 검색 특성상 추가 검증이 필요합니다. 네트워크 연결이 없거나 검색 결과가 없는 경우 한국어 설명을 대신 표시합니다. 향후 Google Places API 연동 시 서버 측 키 보호와 이용 약관 검토가 필요합니다.
