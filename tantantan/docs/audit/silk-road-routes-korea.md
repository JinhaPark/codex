# Samarkand routes and Korean coastline

The user requested thicker connections from Samarkand toward the Russian region, India, Rome, and Korea, and a recognizable Korean peninsula for the guide's Korean audience. This follow-up starts from main `a508431b8858c13d7c9c1063dcc2a4b3e0a6299f`. It does not include the concurrent itinerary, guide layout, or hotel-link pull requests.

## Geographic reference and interpretation

The edit uses Natural Earth's public-domain [50m land dataset](https://naciscdn.org/naturalearth/50m/physical/ne_50m_land.zip), SHA-256 `0b8e670cf80dce9cbebe2a193bc44ba5602758c22e1fa603980553646d7ff162`. Its [terms](https://www.naturalearthdata.com/about/terms-of-use/) permit modification and redistribution. A continental reference and a Korean coastline close-up were rendered with equal horizontal and vertical projected scale in Mercator projection, without independently stretching either axis. Reference hashes, approximate route waypoints, the actual imagegen prompt, and the skills commit read (`856e4c8666c89d3ff1836dce6678e2806fe678fd`) are recorded in the r2 recipe in `docs/image-lineage.json`.

The imagegen edit replaces the distorted coastline with a north-up peninsula attached to the continent, an indented west coast, a smoother east coast, Jeju to the southwest, and water separating Korea from Japan. Four thick terracotta branches and an emphasized common junction make Samarkand prominent. Secondary trails remain lighter. The watercolor palette, camel caravans, full-bleed composition, and separate HTML title band remain consistent with the website.

These are schematic regional connections, including connections across water, not surveyed itineraries, four direct highways, or routes operating together in a single period. The illustration has no labels or modern borders. UNESCO describes [Samarkand as a crossroads of cultures](https://whc.unesco.org/en/list/603/) and the [Silk Roads as a network](https://www.unesco.org/en/silk-roads/about-silk-roads). The coastline reference improves recognizability; generated artwork is not a precise geographic or navigation map.

## Integration and preservation

The 2172 × 724 generated edit was optimized to 480 × 160, 800 × 267, and 1024 × 341 WebPs (27,590; 72,492; and 113,984 bytes). Every dimension stays within the original 1024 × 765 source cap, all variants are below 250,000 bytes, and metadata is stripped. Only the modified optimized artwork is published. The original remains hash-only; no original or master PNG is committed.

Revision r2 records r1 as its actual editing parent. The previous revision and all previous WebPs remain archived and available. There is no verified durable private master cache, so the new master is explicitly marked unpersisted. The mobile image position is aligned to the right to keep the entire peninsula above the title band while retaining the Samarkand junction. The title stays on one line, with horizontally reachable metadata on phones.

Cache v34 uses a distinct release name from main v33 and the concurrent itinerary PR's v32. Cache behavior is unchanged. The lineage replacement test now selects the active revision as its fixture parent, rather than assuming the first revision is still active; this preserves the test's intended publication and parent-retention checks after a real replacement.

## Validation

- All 75 automated tests and the production build passed.
- The image audit decoded 52 published illustrations and 140 active WebPs, verifying dimensions, byte limits, and metadata stripping. Archived variants remain retained and checked by lineage validation.
- Focused banner checks and screenshot review covered 375, 390, 430, 768, 1280, and 1920px. Phone and desktop views keep the peninsula visible, the title readable, and the document free of horizontal overflow.
- The full Chromium check passed at three phone widths, including existing guide flows, visited-image decoding, offline banner reload, cache upgrade, and preservation of unrelated caches. See `silk-road-routes-korea-browser.json`.
- Historical interpretation and geographic precision are not established by software tests. Actual iPhone Safari and installed home-screen testing remain outstanding; offline availability still depends on assets having been requested.
