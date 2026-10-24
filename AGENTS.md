# AGENTS.md — Central Asia Travel Guide

## Scope and priorities

- These instructions apply throughout this repository. The user's current request and higher-priority system instructions take precedence.
- Explain work to the user in polite Korean. Report outcomes and next steps clearly enough for a Git beginner to follow.
- Use polite Korean endings such as 합니다 and 입니다 for travel essays, destination descriptions, captions, and interface guidance, including drafts. Do not switch to 한다 or 이다 merely because a passage is explanatory. Preserve direct quotations, proper names, and original titles; follow any writing style explicitly requested by the user.
- Review sentence endings before delivering or committing Korean copy. Do not rewrite the style of unrelated existing content without a separate request.
- Repository: https://github.com/JinhaPark/codex
- Published site: https://jinhapark.github.io/codex/
- Preserve the existing Vite and JavaScript architecture. Do not change unrelated essays, images, itineraries, phrasebook features, or currency conversion.
- This file defines working conventions. It does not grant access or override platform security and approval controls.

## Language for GitHub and engineering work

- Use natural, standard English for new or edited code identifiers, code comments, commit messages, pull request titles and descriptions, issue text, and engineering documentation, including AGENTS.md.
- Use established English terms such as `word`, `paragraph`, `section`, and `reading position`. Do not invent English-looking terms by romanizing Korean words or translating Korean expressions literally.
- Preserve established proper names, official terms, currency names, external API contracts, and existing storage keys when compatibility requires them. Explain genuinely necessary local-language quotations in context.
- Keep the travel guide's content and interface in natural, polite Korean. Keep direct communication with the user in Korean unless the user requests another language.
- Do not insert unrelated languages or scripts into user-facing replies, titles, code, or documentation. If suggesting a session title, use clear Korean unless the user asks otherwise.
- Review language as part of the final diff review. Prefer precise, familiar wording to unnecessary jargon, abbreviations, or literal translations.

## Audience and editorial purpose

- Readers are highly educated Koreans educated in Korea, primarily ages 30–70. Respect their knowledge and curiosity without assuming expertise in Central Asian studies. Briefly explain unfamiliar concepts on first use.
- The site is a travel journal and guidebook. Begin with questions prompted by landscapes, buildings, food, everyday life, and the travel route, then connect them to history and society. Do not write it as an economic briefing, investment report, or academic review memo. Do not invent personal experiences or impressions the user has not supplied.
- Where useful, connect history to references Korean readers know: Goguryeo's foreign relations, the Mongol invasions of Goryeo, astronomy under King Sejong, and the forced relocation of ethnic Koreans. Use comparisons to aid understanding while keeping local experiences and historical agency central.
- Do not equate Korean and Central Asian events or institutions, or infer ancestry, origins, or direct exchange from superficial similarities. Discuss shared questions about colonial rule, displacement, industrialization, and independence while explaining differences in period and institutions. Do not force a Korean connection into every paragraph.

## Korean prose, numbers, and reading flow

- Use polite Korean for complete sentences in body text, drafts, and captions. Natural noun phrases are acceptable for headings, table labels, and short captions. Preserve direct quotations and original phrasebook text.
- Avoid literal translations, strings of abstract nouns, and unnecessary passive voice. State who does what using ordinary Korean verbs. For example, prefer '가정과 기업에 전화·인터넷 서비스를 제공합니다' to '가정과 기업의 통신·데이터 연결을 판매합니다', and '일자리를 늘리고 제품을 수출합니다' to '고용과 수출을 만듭니다'.
- Develop one main idea per paragraph. Connect observations, background, causes, and points to notice without repeating a rigid template. Make sentences and paragraphs build on one another; do not rely on disconnected facts or mechanically inserted transitions.
- Do not repeatedly insert verification instructions such as '구분해야 합니다' or '단정하지 않습니다' into the narrative. Explain important limitations naturally where misunderstandings could arise. Put detailed definitions, counting rules, and formulas in sources or collapsed evidence sections. Do not remove uncertainty merely to make a statement sound definite.
- Show enough numerical detail to convey scale. Use approximations, ranges, and sensible rounding for population, money, and percentages. Avoid excessive decimal places or long numbers in prose. If a small percentage would round to zero, display a threshold such as '0.1% 미만'.
- Preserve precision in source data and calculation inputs; round only presentation values. Retain reference years, units, and distinctions between nominal, real, and PPP values, and between sales and value added. Do not arbitrarily round exact flight details, times, dates, currency calculations, or quoted exhibition figures.
- Check long sentences, paragraph spacing, font sizes, and line breaks on phones. Do not shrink body text to make it fit a narrow screen. Keep the writing informed and readable while traveling.
- Do not reduce editorial review to replacing sentence endings or searching for prohibited words. Read the whole passage to assess repetition, transitions, natural Korean, necessary context, and the connection between interpretation and observation.

## Starting work and choosing a branch

- Read this file and relevant code and records first. Check the latest default branch, local working tree, and related open pull requests.
- Do not treat commit IDs, deployment status, or file contents from conversation history as current facts.
- Do not create a branch or pull request automatically for every session. Organize them by independent change or deliverable.
- Reuse the existing branch and pull request for follow-up work on the same unfinished change.
- Start a new branch from the latest default branch for an independent change or follow-up to an already merged change.
- Use descriptive names such as `feature/<topic>`, `fix/<topic>`, `docs/<topic>`, or `images/<topic>`. If a name exists, inspect its status and choose an unused name when necessary.
- Do not discard the user's uncommitted changes or commit unrelated files. Stage explicit paths and review the diff.
- Use parallel agents only when the user or applicable instructions authorize them and the functionality is available. Divide files between agents and use separate worktrees when needed. Branches alone do not isolate directories or execution environments.
- Do not let agents edit shared renderers, styles, or the same manuscript simultaneously.

## GitHub connector and terminal responsibilities

- Prefer connected GitHub app or connector tools for remote reads, branch creation, publishing files, creating pull requests, checking status, and merging.
- The terminal may be used for local editing, clone/fetch, history and diff inspection, local commits, tests, and builds. Do not require the user to operate a terminal on their phone.
- If Git CLI lacks remote write authentication, do not repeatedly retry pushes or search for tokens as a workaround. Use the connected GitHub tools and briefly explain any limitation.
- When publishing commits through the API, construct the tree from the exact base SHA and file contents. Verify that the remote tree matches the locally validated tree.
- Check the expected head SHA before updating a remote branch. Do not overwrite another change or force-push without authorization.
- Do not claim to have used unavailable connector features, background execution, or agents.

## Workspace, caches, and reproducibility

- Do not assume temporary remote directories survive a new session or extended inactivity.
- When resuming, inspect the actual GitHub branches and files and fetch them again if needed. Conversation summaries do not replace source files.
- Commit important code, finished writing, research notes, and necessary source material to appropriate repository paths.
- Do not commit `node_modules/`, `dist/`, temporary logs, screenshots, downloads, QA-only fonts, or runtime installations. Explicitly stage optimized public images and research sources that need preservation.
- Install dependencies from `package.json` and regenerate deployment output with the build. Do not make unrelated large configuration changes.
- Read `public/sw.js` before describing the site's cache policy. Distinguish the Work directory, conversation context, Git repository, and visitor's browser cache.
- The current service worker uses cache-first handling for same-origin GET requests under `/codex/`. It initially caches the entry page, then stores requested assets. It does not guarantee offline access to images never visited.
- Preserve service-worker behavior. When a release needs a new cache version, inspect main and concurrent pull requests, choose a unique version, and update related tests and browser fixtures consistently.
- Delete only obsolete caches for this app, preserving unrelated site caches. Read the actual current cache name instead of treating a historical name as a permanent rule.

## Travel image skill and revision cache

- Before organizing, illustrating, editing, optimizing, or placing travel photos, read and use [travel-photo-to-illustration](https://github.com/JinhaPark/skills/blob/main/travel-photo-to-illustration/SKILL.md). Do not duplicate its detailed editing rules here. If the skill is not installed, read it and its references through the connected GitHub tools.
- Follow [cache-and-parallel.md](https://github.com/JinhaPark/skills/blob/main/travel-photo-to-illustration/references/cache-and-parallel.md) for revision caching and asynchronous parallel processing. Record the skills commit SHA actually read. Reading a skill does not mean it has been installed.
- Use `docs/image-lineage.json` to track original SHA-256 hashes, edited revisions with parents, and each WebP's hashes and published placement. Do not upload original JPEG/HEIC files, Base64 copies, or other original copies to GitHub or another remote store. Compute only their hashes in the workspace. Preserve edited illustrations and necessary intermediate edits. Keep public references safe and leave unknown historical data and original hashes null rather than guessing.
- Separate visual-edit cache keys from resize/encoding keys. Check files, hashes, and validation state before reusing output, and rerun only changed stages. Caption or placement edits do not require regenerating artwork. The lineage mapping is neither the service-worker cache nor an original-photo backup.
- Follow [private master cache](docs/private-master-cache.md) and `scripts/image_master_cache.py` for generated-master storage, retrieval, and recovery. Do not enable a backend before verifying privacy, access, and retention policies. Normalized PNG copies of originals are also prohibited. The coordinating agent must inspect actual generated output and its visual review. A successful local directory round trip does not establish durable storage.
- Treat `private-verified` as a historical verification record. Recheck download, hash, and decoding on every reuse; retain the published WebP if recovery fails. Do not label WebP conversion or enlargement as master recovery. Only the coordinating agent updates public lineage, rereading shared state before resolving concurrent changes.
- When authorized and supported, assign independent unprocessed images to asynchronous agents. Process sequential edits of the same image in order. Give each image a separate output path; only the parent agent integrates lineage, manifests, audits, and service-worker changes. Prevent duplicate generation for the same key and concurrent writes to shared files. Record actual methods and limitations when functionality or concurrency is restricted.

## Image lifecycle and ownership

- The repository's coordinating agent alone registers, publishes, replaces, retires, and cleans up shared images. The skill supplies procedures; image agents return their own output and validation records.
- Keep lifecycle states (`active`, `archived`, `deletion-candidate`, `deleted`) separate from generation and validation status. Validate a replacement revision before switching the publication pointer, then archive its predecessor. Distinguish the editing parent from the image being replaced when the source changes.
- Retire an image by removing its placement and marking it archived. Do not immediately delete files or discard cache, editing history, or usage records without evidence.
- Before cleanup, inspect references in manifests, actual renderers, active revisions, editing parents, ongoing work, and open pull requests. Make cleanup a separate pull request. Updating policy does not authorize image deletion.
- Replaced public WebPs may be preserved in Git history with real commit, path, and hash recovery references. Keep tombstones and parent relationships after removal. Distinguish removal from the working tree from permanent history deletion; do not rewrite history without explicit authorization.

## Validation and content quality

- Read the actual commands in `package.json` and `.github/workflows/` before choosing checks.
- For small JavaScript, data, rendering, or service-worker PRs, run affected checks and record deferred checks. Run the complete `npm test` suite and `npm run build`, plus required integration checks, on the integrated result when the user requests merging. For documentation-only PRs, review content, links, and the diff before opening; do not add unnecessary tests.
- For image changes, use `tests/illustrations.test.js` and `scripts/verify-image-assets.py`. Check that Python, Pillow, and other required tools are available.
- For UI or cache changes, use a real browser where possible to check mobile wrapping, contents navigation, accordions, image decoding, offline use, and cache transitions. `scripts/verify-browser.cjs` is an optional check requiring Playwright and Chromium.
- Review obsolete cache names, asset counts, and runtime paths in scripts against the actual integrated state. Do not remove important checks merely to make tests pass.
- Preserve the order of the five core essays and the city and landmark explanations. Keep the three Kazakhstan deep dives separate from the five core numbers.
- Display reference years, units, definitions, and sources for statistics. Distinguish nominal, real, and PPP values; sales and value added; and gross FDI inflows, net inflows, and stocks.
- Distinguish historical interpretation from verified facts. Do not describe automated tests as verification of historical or statistical truth.
- Check image sources and usage conditions and retain required attribution. Do not add production-method captions such as '사진을 바탕으로 그린'.
- Preserve exhibition numbers and map panels as documentary photos rather than transforming their factual content.
- State which checks could not be run and what remains uncertain. Do not report browser checks, tests, or deployments as successful without actual verification.

## Pull requests, merging, and deployment

- The default workflow is a working branch, relevant validation, a commit and remote publication, then a pull request.
- Describe the final purpose, scope, validation, and limitations in each pull request. Do not create duplicate pull requests for follow-up work on the same change.
- Merge when the user requests merging that change. Do not extend approval for an earlier, unrelated change to every future change.
- If merging and deployment are explicitly authorized, proceed within that scope without asking again.
- Before merging, check the latest default branch, pull request head, checks, and conflicts. Resolve conflicts while preserving both changes' intent, then validate the integrated result.
- Preserve history with a merge commit by default unless the user specifies another method.
- Do not resolve cache-name, image-manifest, or audit conflicts by accepting an entire file and losing other changes. Validate the actual integrated files; never combine records to imply checks that did not run.
- Changes merged into main automatically trigger tests, build, and Pages deployment under the current GitHub Actions configuration. Account for that effect before merging.
- When completing a merge request, verify CI and deployment for the resulting main commit. Distinguish remote publication, pull request checks, merging, successful deployment, and checking the public site.
- Report the change, branch/commit/pull request links, validation results, merge and deployment status, and remaining checks.

## Starting work from a phone

- An example request is: 'Read the latest main and AGENTS.md in JinhaPark/codex, then carry out the following change.'
- Distinguish automatic instruction loading from explicitly reading AGENTS.md through the GitHub connector. Do not claim to apply instructions you have not read.
- Treat the phone app as the request and review interface. Do not assume the user must install a local development environment.

## Scoped work and deferred merge

- Batch related small changes into one focused PR; reuse that PR for follow-ups to the same unfinished change. Reuse existing artifacts and validation evidence only when their inputs, relevant dependencies, tool versions, and check scope remain applicable; record the revision checked.
- Before opening or updating a small-change PR, inspect the diff and run only checks needed for the affected files and behavior. Defer the complete test suite to an explicit user merge request. State checks run and deferred in the PR; never claim unperformed tests passed.
- Keep the PR open until the user explicitly requests its merge. Do not enable auto-merge. A request for a previous change does not authorize this merge.
- When merge is requested, refresh main and the PR head, resolve conflicts, run the complete repository test suite and required build/integration checks on the combined result, and merge only after they pass. Report unavailable checks or failures instead of merging an unverified result.
- Skip unrelated full audits, repeated status polling, and extra image generation. Use a bounded status check when needed; repeat only for new evidence or an explicit request. These instructions do not disable existing CI or bypass required checks.
- Interpret the following original user instruction subject to the deferred-merge rule above; “지정한 병합 단계” means stop at an open PR unless merge was explicitly requested:

> 이번 요청 범위만 처리하세요. 기존 결과와 검증 기록을 재사용하고 변경된 부분만 확인하세요. 관련 없는 전체 감사, 반복 상태 조회, 추가 이미지 생성은 생략하세요. 필요한 검증을 마치면 지정한 병합 단계까지 진행하고 결과를 간결하게 보고하세요.
