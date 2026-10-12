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
