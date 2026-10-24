# Travel Companions

Mobile-first travel journals for [Central Asia Tantantan](https://jinhapark.github.io/codex/tantantan/) (October 12–21, 2026) and [Caucasus](https://jinhapark.github.io/codex/caucasus/) (April 29–May 11, 2026). The [home page](https://jinhapark.github.io/codex/) is a two-journey index.

## Repository layout

- `tantantan/`: existing Central Asia guide, itinerary, essays, research notes and tests
- `caucasus/`: Caucasus itinerary and journal, visit descriptions, guide and tests
- `shared/public/illustrations/`: canonical public illustrations for both journeys, never original photos
- `shared/images/`: unified illustration manifest and immutable image revision history
- `shared/style.css` and `shared/travel-utils.js`: shared visual styles and web helpers
- `shared/public/`: PWA assets, manifests, and isolated service workers

## Development

```sh
npm install
npm test
npm run build
```

Vite builds three HTML entrypoints under `/codex/`. Tenant-specific checklists and service workers do not share storage keys or offline document fallbacks. The public guide does not expose guide phone numbers or other personally identifying details from printed itinerary pages.

## Image policy

The original photographs remain private. Publish only optimized derivative images, keyed by tracked source digests, with centralized manifest and revision metadata. Active publication is referenced by journey-specific placement data; both journeys may reuse an approved asset without copying bytes. Preserve historical version references in the existing lineage record. Image processing remains governed by the `travel-photo-to-illustration` skill.

Caucasus content is initially transcribed from the user's printed itinerary; subsequent photographs and firsthand field notes can be integrated without changing the site's shared structure.

## Publishing and verification

The repository root contains only the two-journey landing page. The root-level WebP uploads were moved to `shared/public/illustrations/` using their Git blob SHAs; no originals were added. `shared/images/caucasus-asset-registry.json` records each file's prior root name, new standardized filename, byte count and content-identifying Git blob SHA. `shared/images/caucasus-photo-catalog.json` links the shared files to the appropriate travel day and captions. Existing files exceeding the 250 KB optimization target are tracked explicitly in `shared/images/caucasus-oversize-exceptions.json`; they require a separate lossless-to-content-compliant re-encoding review. `caucasus/tests/photos.test.js` verifies uploaded WebP files and their hashes.

```sh
npm test
npm run build
node scripts/verify-travel-build.mjs
```

The current PR is not a deployed site until the user requests a merge to `main`.
