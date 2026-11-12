# Travel guide editorial and image updates

## Changes

- Replace unfamiliar Cyrillic surname endings with Korean pronunciation and explanations.
- Explain Mirzo as a royal title derived from amirzada, and its distinction from the Chinggisid associations of khan in this setting. No claim of Ulugh Beg's personal preference is made: the reviewed sources did not establish it.
- Explain that famine deaths and permanent departures together approached half the pre-famine ethnic Kazakh population. This is neither the death rate nor the decline of the republic's entire multiethnic population.
- Replace the rare Korean term for lake bottom in the Aral Sea caption and alt text; retain the Ban Ki-moon identification.
- Remove the religion and culture reference group from the itinerary; retain its manuscript illustration in the guide.
- Place the Balbal stone statue after the two petroglyph illustrations in the October 17 itinerary and the guide subsection about petroglyph time layers.
- Place the Karven Four Seasons birch walk under Cholpon-Ata on October 17 instead of the following day's tip.
- Restore the full visible exterior of the Hazrati Imam entrance illustration and remove the four large foreground people from the Chashma Ayub illustration.

## Image provenance and limitations

The travel-photo-to-illustration skill and references were read at skills commit `ca4b450c226118a1a318b8321cd6f403536c915c`. The two accepted edits were independently generated and visually inspected by the coordinator, then resized and encoded with the existing optimization helper. Their exact prompts, input hashes, new output hashes, dimensions, optimization recipes and WebP hashes are in `docs/image-lineage.json`.

Original photo files and prior full-resolution masters were not available. Each edit therefore starts from the actual published WebP as a new known source; the old revision is replaced, not falsely labeled as the editing parent. Unknown original-photo hashes stay null. New masters are marked unpersisted. Only optimized WebPs are added to the repository. Prior WebPs remain archived.

The gate edit reconstructs a decorative illustration and reframes its exterior; tile strokes and small architectural details differ. It is not a measured architectural restoration. The Chashma edit removes only the four large foreground figures and retains the smaller entrance crowd and left-edge figure. Exact-asset Git history and local cache review found no reusable earlier cleaned Chashma version.

The attempted removal of reflections from the Ulugh Beg documentary exhibit was rejected: the generator changed the upper title and manuscript writing. The published exhibit photo remains unchanged. Rejected output SHA-256: `750daa45c1051e431dbed0bffd6d9f86ae40618d2c27d1d1079ec45929ce470f`. No additional generation was attempted after that finding.

The separate Rukh Ordo garden removal is handled in its own cleanup PR as required by AGENTS.md.

## Historical sources

- [Encyclopaedia Iranica: royal princes called Mirza at Timur's court](https://www.iranicaonline.org/articles/bar-audience/bar-i-from-the-achaemenid-through-the-safavid-period/).
- [Encyclopaedia Iranica: Khan](https://www.iranicaonline.org/articles/khan/).
- [Isabelle Ohayon: The Kazakh Famine, sections on context and victims](https://www.sciencespo.fr/mass-violence-war-massacre-resistance/en/news/the-kazakh-famine-the-beginnings-of-sedentarization/): roughly four million Kazakhs before the famine; 1.15–1.42 million deaths and 600,000 permanent emigrants. The combined 1.75–2.02 million represents approximately 44–51% of that rounded baseline. Sources do not justify saying half of all Kazakhstan residents died.

## Focused validation

- Relevant illustration, lineage, itinerary and Kazakhstan tests passed; the old itinerary test was adjusted because the manuscript is now intentionally guide-only.
- Image verification decoded all 137 published variants and found no metadata or duplicate hashes.
- Production build passed.
- Local Chromium verified 375, 390 and 430 px views: three petroglyph figures within the requested subsection, the birch walk under the correct itinerary destination, and decoding of both edited illustrations. No horizontal overflow or JavaScript errors was observed in those flows.
- Screenshots used a local Korean font for review. This is local Chromium verification, not an actual iPhone Safari test.

The service worker is unchanged: current code uses network-first navigation and cache-first hashed assets. New edited files have new URLs, and the build changes the JavaScript hash. No full cache audit, full regression run or deployment check was repeated. Those broader checks are deferred until a merge request.
