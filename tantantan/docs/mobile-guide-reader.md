# Mobile guide navigation and reading

The guide opens with three categories: the five core essays, city and landmark guides, and three Kazakhstan deep dives. Only the selected article appears in the reading view. The core essays retain their order, and the Kazakhstan essays remain a separate category. The shopping and preparation screens retain the changes merged in PR #20.

## Section grouping and content preservation

`src/guide-sections.js` defines explicit chapter ranges for one to four numbered sections per article. Bukhara's 15 chapters form four sections. Samarkand, Tashkent, Bishkek, Cholpon-Ata, and Almaty each have three sections. Subheadings, paragraphs, and images within a section expand together. Sections can remain open independently. Expand all and collapse all affect only the main numbered sections; sources and calculation notes remain separate disclosures.

The source manuscripts are unchanged. Illustrations still use the original chapter indexes, preserving editorial placements, captions, and lineage records. When adding chapters, update the grouping ranges as needed. Automated checks verify that grouping preserves every chapter, its order, and its original index.

## Addresses, reading state, and accessibility

- Fragment addresses such as `#guide/core/history` and `#guide/cities/history-almaty/almaty-section-3` link directly to articles and numbered sections. They work without GitHub Pages path rewrites and support offline navigation.
- Legacy addresses, including `#history-almaty`, `#silk-road-introduction`, `#city-guides`, and `#kazakhstan-deep-dives`, open the corresponding article or category.
- The `central-asia-reader-v1` local storage key records the category, list position, and each article's expanded sections and reading position. Navigation remains usable when storage is unavailable. Existing checklist storage keys are unchanged.
- The contents sheet uses a native modal dialog and its keyboard focus behavior. Selecting an entry opens the target section, scrolls to it, and focuses its summary. Escape closes the sheet.
- The contents button displays the current section number. Reading controls remain visible while scrolling, and section links leave clearance beneath the sticky controls. Readers can jump to later sections without scrolling through earlier text.
- Reading position is restored after fonts finish loading, so delayed font loading does not invalidate the initial scroll restoration.

## Validation

Run `npm test` and `npm run build`. For optional browser checks, install Playwright and Chromium, then run:

```sh
NODE_PATH=/path/to/node_modules QA_CHROMIUM=/path/to/chromium node scripts/verify-browser.cjs
```

The browser checks cover 375, 390, and 430px viewports; the ten-day itinerary; all 16 guide articles; grouped disclosures and contents navigation; reading-state restoration after browser history navigation, tab changes, and reloads; existing images, captions, tables, an exchange-rate fixture, and the checklist; offline access to visited guide images; and service-worker cache transitions. Results and screenshots are written outside the repository to `qa-guide-reader/`. The test environment can optionally load Noto Sans KR from an adjacent `qa-runtime/` directory without adding it to the production site.

These checks do not replace testing on an actual iPhone in Safari and an installed home-screen web app. The cache-upgrade fixture combines the current app with an older cache name; it does not run historical deployed assets. Offline access to unvisited images is not guaranteed. Search, estimated reading times, and a separate continue-reading list remain future work.
