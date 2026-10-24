# Rukh Ordo garden illustration removal

The user explicitly requested complete removal of `rukh-ordo-garden-pencil`. The separate lakeside watercolor remains published.

The removal preserves the required lifecycle: archive and unpublish, review as a deletion candidate, then remove the three public WebPs. Real intermediate commit references in `docs/image-lineage.json` let validation verify the ordered ancestor snapshots even when CI compares the entire PR to main. Missing, reordered, unavailable or altered evidence still fails. Existing byte, recovery, parent-retention and tombstone checks remain in place.

Reference review covered the publication manifest, itinerary references, renderer placement lookup, editing parents, destination coverage and related open PRs. No other active revision or editing parent uses these files. Current inventory documentation is updated. Historical browser audit records are retained as past observations.

The tombstone records recovery from main commit `741257837cd36f3225b5820f2f25ed0ed11b2326`, with the actual variant paths and SHA-256 hashes. This removes the files from the current tree; it does not rewrite repository history.

Validation: focused lineage and illustration tests passed (36 tests), including actual Git recovery and negative retirement-proof cases. Full regression tests and deployment verification are deferred until merging is requested.
