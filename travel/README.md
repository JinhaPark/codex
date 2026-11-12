# Travel Companions

Mobile-first travel journals for [Central Asia Tantantan](https://jinhapark.github.io/codex/tantantan/) (October 12–21, 2026) and [Caucasus](https://jinhapark.github.io/codex/caucasus/) (April 29–May 11, 2026). The [portfolio home page](https://jinhapark.github.io/codex/) links to both guides and the other projects in this repository.

## Repository Layout

The travel application directories currently live at the repository root. Paths below are relative to the repository root, one level above this README.

- `../tantantan/`: Central Asia guide, itinerary, essays, research notes, tests, and project scripts
- `../caucasus/`: Caucasus itinerary, journal, visit descriptions, guide content, and tests
- `../shared/public/illustrations/`: canonical published illustrations shared by both journeys; original photographs are not stored here
- `../shared/images/`: Tantantan illustration manifest and lineage, plus Caucasus asset registry, photo catalog, and lineage records
- `../shared/style.css` and `../shared/travel-utils.js`: shared travel-site styles and browser utilities
- `../shared/public/`: PWA assets, manifests, and separate service workers for each journey
- `../scripts/verify-build.mjs`: checks the built home, travel, and blog routes, navigation links, PWA files, and published Caucasus image sizes against the registry
- `../vite.config.js` and `../.github/workflows/pages.yml`: site entrypoints, build, and Pages deployment configuration

## Travel Companion Image Policy and Verification

Keep original travel photographs private. Publish only approved, optimized derivative images under `shared/public/illustrations/`; do not add raw photographs or redundant copies. Keep each asset's manifest, lineage, registry, catalog placement, and caption records consistent. Preserve historical paths and hashes as evidence, and do not guess unknown dates, locations, image dimensions, or source hashes.

Name new Caucasus WebP assets with the verified capture date, place, subject, actual rendering style, and decoded image width: `caucasus-YYYYMMDD-place-subject-style-WIDTH.webp`. When renaming a current asset, update its manifest and lineage consistently while keeping historical revision paths unchanged. Keep private phone numbers and personal names from printed documents out of public pages, assets, and data files.

Use the `travel-photo-to-illustration` skill and the applicable image catalog and lineage procedures when editing or placing travel images. Recheck the actual file, hash, and decoding status when reusing an image; a historical verification record alone does not prove that the current file is available and valid. Retain the published WebP if recovery of its source fails.

Run image checks from the repository root and choose the checks that match the changed files:

```sh
node --test tantantan/tests/illustrations.test.js
node --test caucasus/tests/photos.test.js
python tantantan/scripts/verify-image-assets.py
```

For a site-affecting change, also run the configured Vite build and its output verifier:

```sh
npm run build
node scripts/verify-build.mjs
```

The GitHub Pages workflow runs the applicable travel checks, site build, and output verification for changes pushed to `main`.
