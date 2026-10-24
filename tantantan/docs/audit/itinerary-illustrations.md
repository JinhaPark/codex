# Itinerary illustration reuse and caption corrections

Latest placement update: [Bukhara illustration selection](bukhara-illustration-placement.md). The record below describes the earlier integration; the Kalyan detail and Lyabi-Hauz evening views now appear only in the guide.

## Scope

Base: `fd1deea793c20cbafaba21673eef64f79ebbc226` in JinhaPark/codex.

The user requested that the Lyabi-Hauz evening illustration move from October 14 to October 13, and that illustrations in the travel guide also appear in the itinerary. A follow-up corrected the Cholpon-Ata location from a museum to a petroglyph area and shortened the Balbal caption to refer to the stone statue.

The travel-photo-to-illustration skill and its guide integration and cache references were read from JinhaPark/skills at `856e4c8666c89d3ff1836dce6678e2806fe678fd`. This is a placement and caption change; no images were generated, edited, resized, or re-encoded. All 137 published image files, hashes, revision records, and image dimensions remain unchanged.

## Primary placement and secondary references

Each illustration still has one canonical `placement` in `src/illustrations.json`. The Lyabi-Hauz evening illustration now has `day:1:lyabi-hauz`, matching October 13; its top-level publication placement in `docs/image-lineage.json` matches. Its revision and the existing Bukhara market illustration remain intact.

`src/itinerary-illustrations.json` records secondary appearances by date and destination name. These references resolve existing illustration IDs through the shared responsive image renderer. They do not create new assets, revision IDs, or source records. This explicit user request authorizes cross-tab appearances; the prior rule against duplicate images still applies within each rendered day or guide article.

| Date | Images reused from the guide | Total explicit itinerary references |
| --- | ---: | ---: |
| October 13 | 7 | 8, including the moved Lyabi-Hauz evening image |
| October 14 | 3 | 3 |
| October 15 | 11 | 11 |
| October 16 | 7 | 7 |
| October 17 | 5 | 5 |
| October 18 | 3 | 3 |
| October 19 | 3 | 3 |
| October 20 | 4 | 4 |
| Total | 43 | 44 |

The existing hotel, dinner, and other day illustrations remain in their original slots. Every published illustration is now reachable in the itinerary; the 43 guide illustrations also remain in their original guide articles. No itinerary date or travel narrative was rewritten.

The five subjects with unconfirmed locations—the vineyard, blue tile arch, manuscript, ossuary, and Aral Sea exhibit—appear in explicitly labeled reference groups. They are not assigned to destination cards or reclassified as confirmed site photographs. Existing uncertainty and destination coverage records remain intact.

## Caption changes

- Petroglyph field: '촐폰아타 암각화 구역 — 바위 들판과 답사로'.
- Balbal: '촐폰아타 암각화 구역 — 발발 석상'.
- Their alt text also uses the petroglyph-area wording. No new date, attribution, or age is asserted for the statue.
- Current caption inventories were updated. Historical source references and past QA snapshots were retained.

## Validation

- All 78 automated tests passed; new checks cover complete guide-to-itinerary mapping, valid dates and destinations, no per-day duplicates, the October 13/14 correction, reference-only subjects, and both revised captions.
- Production build, `git diff --check`, and the full-pixel audit passed: 51 illustrations and 137 responsive WebP files.
- Chromium checks passed at 375, 390, and 430px across ten itinerary dates and 16 guide articles. Each guide image appears once in its guide and once on its mapped itinerary date; no unintended duplicate figures appear in a single view.
- Existing contents navigation, reading state, tables, checklist, currency fixture, and offline guide checks passed. The moved Lyabi-Hauz image was also decoded after an offline reload.
- Service-worker cache version v32 preserves the existing network-first document handling and cached hashed assets. The upgrade fixture preserves unrelated caches.
- The focused browser command `node scripts/verify-browser.cjs --itinerary-only` checks the affected October 13, 14, and 17 views at all three widths, decodes images before capturing screenshots, and avoids rerunning unrelated flows for subsequent date or caption edits. The full browser suite remains available without that flag.
- Actual iPhone Safari and installed home-screen app testing remain outstanding. Offline access to previously unvisited images is not guaranteed. Browser results are in `itinerary-illustrations-browser.json`.
