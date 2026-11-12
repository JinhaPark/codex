# Silk Road banner and single-line title

## Request and source

The user supplied `image(1).png` and requested a banner redraw without the photographed paper margins, borders, or legend, replacing the previous dark green header. The follow-up requested a single-line title treatment and enough margin to keep the title readable.

Source dimensions: 1024 × 765. Source SHA-256: `0156db27950a3e6ee9d6e5c6868bfdffdb11fb877b2a96f8e10fb2e4a0e94752`. Only this hash and minimal metadata are recorded; the original PNG is not committed or uploaded again.

Read the travel-photo-to-illustration skill and its editing, integration, cache, and optimization references at JinhaPark/skills commit `856e4c8666c89d3ff1836dce6678e2806fe678fd`, plus the built-in imagegen skill. The new work starts from codex main `fd1deea793c20cbafaba21673eef64f79ebbc226`. The separate itinerary illustration PR is not included in this banner change.

## Artwork

The built-in imagegen tool redrew the reference as a full-bleed 2172 × 724 decorative map. The edit removed the paper surround, rectangular frame, legend, folds, corner symbol, and all small lettering. Blue water, ochre terrain, route lines, and camel caravans remain recognizable motifs. This is unlabeled decorative banner art, not a precise geographic or navigation diagram. The actual prompt is preserved in the new revision's recipe in `docs/image-lineage.json`; unavailable model and seed metadata are not invented.

The skill's optimizer produced three responsive WebPs without visual filtering or upscaling:

| Width × height | Bytes | Quality |
| --- | ---: | ---: |
| 480 × 160 | 26,890 | 88 |
| 800 × 267 | 72,766 | 88 |
| 1024 × 341 | 112,718 | 88 |

All dimensions remain within the original source's two-axis limits, and every file stays below 250,000 bytes. The explicitly requested panoramic redraw has its own narrow framing exception, restricted to this image ID and source. Existing image checks are unchanged for other assets.

The public manifest and lineage share the primary `site:banner` placement and the `silk-road-banner-watercolor` ID. This decorative asset is accounted for separately from destination figures. It is displayed once per page header, not inserted into travel essays or destination lists. No existing illustration or revision was removed. The generated master remains outside the repository and has no verified private-cache receipt; lineage therefore records it as unpersisted instead of claiming durable master storage.

## Title and palette

The artwork is a responsive image behind the header. A translucent ivory band beneath the visible map creates a quiet area for real HTML text. The main title appears first, followed by the travel label, dates, and countries in a single unwrapped line. On wide screens, the complete line fits without scrolling. On narrow screens, the main title remains fully visible while the remaining metadata can be scrolled horizontally within the title band. This preserves readable text instead of shrinking the whole sentence to fit a phone. The region is keyboard-focusable and has an accessible Korean label. The decorative image has an empty alt attribute so screen readers read the HTML title rather than duplicating it.

The palette uses warm ivory (`#f7f2e8`), slate ink (`#263d49`), muted blue (`#385b70`), and terracotta emphasis (`#9b5037`). Related navigation, buttons, links, and reading surfaces were coordinated with those colors. Text, itineraries, shopping data, and guide content were not rewritten.

## Validation and limits

- All 75 automated tests passed; production build and diff checks passed.
- Full-pixel audit decoded 52 illustrations and 140 WebP variants, including the three new files, and verified metadata stripping and size limits.
- Browser checks passed at 375, 390, and 430px for all existing itinerary/guide flows, image decoding, reading-state restoration, existing tables and checklist, offline access to visited images, and the banner after an offline reload.
- Dedicated banner checks passed at 375, 390, 430, 768, 1280, and 1920px. They verify a single-line title, desktop fit, visible main title on phones, reachable mobile metadata, and no document-level horizontal overflow.
- Korean-font screenshots were visually reviewed at phone and desktop widths. `node scripts/verify-browser.cjs --banner-only` supports focused follow-up banner checks without rerunning unrelated flows.
- Cache version v33 avoids the separate itinerary PR's v32 name and preserves the existing service-worker behavior. The cache-upgrade fixture preserved unrelated caches.
- Actual iPhone Safari and installed home-screen web app testing remain outstanding. Offline access to images never requested is not guaranteed. The cache fixture uses current application assets with an older cache name, not historical deployed bytes.

Machine-readable results: `silk-road-banner-browser.json`.
