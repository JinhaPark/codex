# Shared Caucasus image intake — reconciled

The original #54 branch predated the two-guide migration and contained duplicates of photos already published in #51 and #57. This reconciled change keeps those existing images untouched and does not restore the removed Sheki lunch-garden image or the superseded Aliyev portrait.

The user-uploaded May 6 Garni basalt columns WebP is stored once in `shared/public/illustrations/` and referenced from the 2026-05-06 itinerary. The seven additional WebP derivatives with no verified date are retained outside the public directory under `shared/images/pending/illustrations/`. They are not displayed, and the original photos are not committed.

All eight blobs are reused by their exact Git blob SHA. Decoded WebP width and height were inspected; the image test checks byte counts, dimensions and Git blob identity. These large images exceed the optimization target of 250 KB. New publication and the pending files can be optimized separately once their original context has been verified. The migration must not rewrite active images or introduce guessed dates.
