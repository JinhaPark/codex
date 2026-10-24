# Caucasus photo integration queue

The May 1, 2026 group retains the roadside president portrait board and the Sheki caravanserai courtyard photographs. Original source bytes are not committed.

- Roadside portrait board: documentary photo with unmodified flag and portrait. Avoid asserting the depicted person's identity from the image.
- Sheki caravanserai courtyard: watercolor, incidental visitors removed, preserve arcade and garden.

Responsive WebP variants are registered in `shared/public/illustrations/` and displayed through the Caucasus photo catalog. The removed garden illustration no longer has a published asset, manifest record or itinerary section. 

## May 2, 2026 — Kakheti vineyard and winery

Two user-supplied photographs were converted to transparent watercolor/colored-pencil travel views and prepared as responsive WebP variants. The wine tanks and vineyard are **two separately indexed source photos**, although the visual-generation output combined them into a two-panel composition; the prepared variants use separately cropped panels. The resulting panoramic aspect ratios differ from the originals and are recorded in the batch manifest. Do not present the illustration as a measured architectural or agricultural reconstruction.

- Vineyard rows with a foreground tree and distant mountains: `kakheti-vineyard-watercolor`.
- Stainless-steel wine fermentation/storage tanks: `kakheti-winery-tanks-pencil`.

Both records are `prepared-in-pr`. Source images and generated PNG were committed; prepared WebP files have been hash-checked and remain in the user's downloadable batch package. Do not publish broken links or mark them active until the six exact WebP bytes are uploaded to `shared/public/illustrations/` and verified.

## Uploaded WebP migration (2026-10-24)

The root-level WebP uploads in GitHub main (26 files) are copied to the shared public illustration store using unchanged Git blob IDs. Non-standard filenames are normalized to `caucasus-YYYYMMDD-place-subject-style-WIDTH.webp`. The root copies are omitted from the migration branch and will be removed from the active tree only when the PR merges. The image catalog records the former root file, Git blob SHA and byte count. A filename-based width does not replace a full decoded-image test. Additional user-uploaded images for Baku, Gobustan, Sheki street, Georgian mountain road and Sighnaghi have been registered; editorial placement is separate from asset migration.

## Oversize import audit

Five manually uploaded, already-published WebP blobs exceed the 250,000-byte target for optimized variants. This migration preserves their exact content and Git identities instead of silently replacing artwork. The dedicated image test records the five filenames and will fail on untracked oversize additions. Re-encoding should be completed in a dedicated image-optimization pass, with updated source-to-output hashes and revised Git blobs; do not report the five as fully budget-compliant until that happens.
