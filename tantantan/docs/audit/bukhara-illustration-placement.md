# Bukhara illustration selection

Base: `9a3a92f32d6bf6e3d5d7fa49a762059a66f6cd1e`.

The user requested only the first illustration under Kalyan Minaret and Lyabi-Hauz in the October 13 itinerary. The second Lyabi-Hauz illustration is retained in the travel guide.

| Subject | Itinerary | Travel guide |
| --- | --- | --- |
| Kalyan | `bukhara-poi-kalyan-watercolor` | Existing complex view and `bukhara-kalyan-minaret-pencil` remain in Bukhara history |
| Lyabi-Hauz | `lyabi-hauz-portal-watercolor` | Portal view remains; `lyabi-hauz-evening-watercolor` follows the Lyabi-Hauz chapter at `bukhara:8:detail` |

Remove the two secondary itinerary references. Change only the evening illustration's canonical placement in the manifest and publication lineage; keep revision IDs, image files, hashes and dimensions unchanged. Both omitted itinerary views remain active because they are used in the guide. The Bukhara market image and other itinerary references are preserved. There are now 42 explicit itinerary references; the two guide-only exceptions are tested explicitly.

The travel-photo-to-illustration skill and its guide-integration and cache-and-parallel references were read from JinhaPark/skills at `1f2b98d3ad79d72b71a14a21e2627f036794d3e2`. This is a placement-only change with no generation or encoding. The document-refresh service-worker behavior and hashed assets require no cache-policy change.

Validation:

- All 82 tests and the production build passed.
- Full-pixel audit passed for 51 illustrations and 137 unchanged WebP variants; all hashes remain unique and metadata-free.
- Focused Chromium checks passed at 375, 390 and 430px for October 13, 14 and 17; the two removed views are absent from October 13 and the selected first views remain.
- The evening illustration appears once in Bukhara history and decodes successfully. Screenshots were inspected with a Korean font loaded. No horizontal overflow or JavaScript errors were observed.
- Actual iPhone Safari and offline revalidation were not performed for this placement-only update. Existing offline behavior remains limited to previously visited assets.

## Follow-up: separate the Lyabi-Hauz views by tab

At main `dcae338086fe5f1dd45375828e731e32937d0270`, the user requested that the Bukhara guide retain only the evening table-and-fountain view of Lyabi-Hauz, because the portal-and-fountain view is already in the itinerary. This supersedes the earlier table's statement that both views remain in the guide.

Keep `lyabi-hauz-evening-watercolor` at `bukhara:8:detail`. Move the portal view's canonical placement from `bukhara:8:0` to `day:1:lyabi-hauz`, updating the matching lineage placement. Its existing October 13 itinerary ID reference is unchanged. No image is retired, regenerated, re-encoded, or deleted; all revisions, hashes, sizes, and captions remain unchanged.

The image skill and its integration and cache references were read at skills commit `ca4b450c226118a1a318b8321cd6f403536c915c`. Focused browser validation checks that the Bukhara guide shows the evening view once and the October 13 itinerary shows the portal view once, without the opposite Lyabi-Hauz view in either location.
