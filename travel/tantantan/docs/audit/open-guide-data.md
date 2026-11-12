# Open selected guide data by default

Base: `dcae338086fe5f1dd45375828e731e32937d0270`.

The user requested immediate access to the 2024 three-country comparison when opening the fourth core guide, and the tuition/living-cost calculation when opening the fifth. Both disclosures now have native open defaults and a narrow marker. Opening their parent inline guide also reopens these marked disclosures, while readers can still close either one manually. The dedicated reader restores these two defaults instead of an older saved closed state. Kumtor calculations and source disclosures retain their existing behavior.

The same follow-up separates the two Lyabi-Hauz views: Bukhara history uses the evening table-and-fountain illustration, while the October 13 itinerary retains the portal-and-fountain illustration. The portal view's canonical placement and matching lineage placement move to the itinerary. No artwork, caption, revision, hash, or image file changes. See `bukhara-illustration-placement.md` for the placement history and skill version.

Validation: all 82 automated tests, production build, image audit (51 illustrations, 137 active WebPs), and diff checks passed. Focused Chromium checks at 375, 390, and 430px verify initial opening, reopening the parent after manually closing a data disclosure, manual closing, saved-state reloads in the dedicated reader, unchanged source disclosures, and correct decoded Lyabi-Hauz views in each tab. The visited views also decode after offline reload; a v41-to-v42 cache-name fixture preserves an unrelated cache. Results are recorded in `open-guide-data-browser.json`. Actual iPhone Safari is untested, and unvisited images are not guaranteed offline.
