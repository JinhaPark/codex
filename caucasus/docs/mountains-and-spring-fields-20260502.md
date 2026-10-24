# Caucasus Mountains and Spring Fields — Image Intake

Status: **single 1200px WebP integrated** via PR #51; remaining source and optimization evidence is retained here. This record is not a second publication manifest.

## Capture and interpretation
- Date supplied by traveler: 2026-05-02
- Scene: Caucasus mountains photographed through a coach window, plus a second photograph of yellow flowering fields.
- Artwork: a composite illustration in watercolor and colored-pencil style. Vehicle-window reflections and roadside guardrail are excluded. Yellow flowers are not botanically identified; do not assert rapeseed.
- Korean caption: **코카서스 설산과 봄 들판 — 2026년 5월 2일**
- Target collection: `/shared`, with use in `/caucasus`.

## Source hashes (originals must not be uploaded)
- Mountain photograph SHA-256: `f8823ed1347fec2bb477cd262769a8cd5be6968fdcc61f8b7304ccddd46d281e` (1914 × 1436).
- Field photograph SHA-256: `f2b5c4903f93b8104bbb7d899f99504af76187a9b45b04f11d1225e3135e98a3` (1914 × 1436).
- Ordered composite source roles: 1. mountain; 2. flowering field.

## Prepared illustration variants (historical and current)
| Size | Filename | SHA-256 |
|---|---|---|
| 480 × 360 | `caucasus-mountains-yellow-fields-2026-05-02-480.webp` | `fcf63887c5255b53f3cdd5b38eae6465de43f1a49ee4af9825dcb499aba99892` |
| 800 × 600 | `caucasus-mountains-yellow-fields-2026-05-02-800.webp` | `92df63a71f30b006e80f1023b12b166dd763c110d63e7797e2aaf0f4aeba18bd` |
| 1200 × 900 | `shared/public/illustrations/caucasus-20260502-route-mountains-yellow-fields-watercolor-1200.webp` | `caa19bbaeaacf115a03ac2e8d6e5df01f3652bae12f31d13961a13143eb2ed9b` |

## Integration checklist
- [x] Transfer the 1200px optimized WebP into `shared/public/illustrations/` (PR #51). The 480px and 800px variants are not in the public tree and remain optional optimization work.
- [x] Verify the 1200px file's Git blob identity and recorded byte count in the shared asset registry and repository tests. Historical SHA-256 listed above is retained from the preparation record.
- [ ] Add the recovered two-input source hashes and exact composite provenance to `shared/images/caucasus-image-lineage.json` after reconciling the original record. The PR #51 migration ledger currently marks the recipe as incomplete.
- [x] Register the 1200px image in the Caucasus guide's May 2 travel observations (PR #51).
- [x] Validate the published image reference and shared asset registry in PR #51.
- [x] Merge on explicit user request for PRs #52–53.

Original photos and the generated PNG master are excluded from GitHub. The 1200px WebP is already in the public shared-image collection; the other sizes were not uploaded as part of PR #51.
