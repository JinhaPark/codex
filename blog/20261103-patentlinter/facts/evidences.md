# Document review article: facts and evidence

Editorial review date: 2026-11-13. These notes support [the manuscript](../article.md). The article is a design discussion; its published date is not a certification of the project's current readiness. These notes summarize existing evidence without rewriting the article or authorizing new processing.

## Source handling

Use public primary sources for technical background. The developer's retained architecture notes, current project overview, and scoped retrieval-evaluation summary were read for the distinctions below. Their content is summarized without private source passages, client identities, case identifiers, prompts, credentials, full code listings, private paths, or raw execution receipts. Underlying owner-held evaluations cannot be reproduced from this public repository alone.

## Technical background and design claims

| Article topic | Evidence category and basis | Safe interpretation and limit |
| --- | --- | --- |
| Graph-based retrieval supplies related context for a review question. | Public technical background: [Microsoft GraphRAG documentation](https://microsoft.github.io/graphrag/). Owner-held architecture notes describe a custom retrieval pipeline. | The public reference explains graph-based retrieval concepts. It does not establish that the project is identical to Microsoft's implementation or prove its retrieval quality. |
| Planning, reranking, extraction, and review can be composed as modules. | Public technical background: [DSPy documentation](https://dspy.ai/current/). Project architecture notes describe the selected module responsibilities. | DSPy provides programmatic composition primitives. The named stages and their contracts are project design choices, not an automatic guarantee supplied by the framework. |
| Source relations and provenance constrain which evidence a model can use. | Owner-held architecture and development-evaluation summaries. | Treat the retained graph and evidence references as inputs to validation. Source membership and citation validity are distinct from semantic support; one does not prove the other. |
| Model suggestions and human acceptance have separate authority. | Article design and owner-maintained development boundaries. | A proposed correction or a model review is not specialist sign-off. The architecture figure describes the intended handoff and does not prove operational authorization. |
| Targeted revisions can be limited to affected content. | Versioned review/revision design and scoped offline implementation records. | An implemented dependency or impact mechanism is not proof that a complete live revision cycle improved quality or that every impacted item was reviewed. |

## Observed development evidence

**Status: bounded historical development evidence.** A retained single-document retrieval and grounded-answer evaluation records an authored path combining semantic retrieval, graph-based expansion, modular selection/planning, and source-linked answers. Selected cases received actual model reviews; one answer required a separately versioned correction. Earlier failures and uncertain usage were retained.

This supports an exercised development path, not a held-out accuracy benchmark, complete document processing, specialist approval, a production user interface, or lower reviewer fatigue. The source summary explicitly distinguishes feedback-informed development checks from unseen-case quality estimates. No private source passages, outputs, model prompts, or client-specific counts are reproduced here.

The owner-maintained overview identifies the interface as a prototype and documents scoped retrieval and document-review checks. These records support the particular paths exercised, rather than complete product acceptance or a measured pilot improvement.

## Retained retrieval comparison and model judgments

**Status: historical development evaluation documented in the owner-maintained results report and cross-checked against the project overview.** Seven retrieval configurations were compared on the same 20 development questions with a final candidate budget of 20 before reranking. Semantic retrieval alone recovered each question's complete required evidence set in 15 of 20 questions. The selected combination of semantic, structural, lexical, document-structure-aware, and explicit-reference retrieval recovered the complete required set in all 20 questions. The denominator counts questions, not returned candidates. This is evidence coverage on that development set, not an answer-accuracy score or an unseen-case estimate.

The selected answers received 60 recorded judgments from three model judges using the same item-specific criteria. The final report records 53 PASS and seven FAIL, with no unevaluated slots. Two judges accepted all 20 answers; the third accepted 13 and rejected seven. Those seven disagreements were retained. The result establishes completion of a bounded model-evaluation set, without turning majority agreement into semantic correctness or expert acceptance. The other retrieval configurations were not each subjected to the same three-model answer evaluation, so their retrieval coverage cannot be read as comparative answer-quality scores.

The retained accounting also distinguishes provider attempts, acknowledged results, and reused cached generation results. Successful judgments were preserved while only missing results were recovered. This is documented result reuse; the report does not supply a matched measurement of reduced reviewer effort or whole-development monetary savings. The Architect subsequently confirmed that project-local caching and execution profiles supplied this reuse; the inspected evidence does not attribute it to a Temporal or integration-kit adapter.

## Author-reported observations

- Earlier difficulty with regex, lexical similarity, embeddings, and locally hosted models is an author-reported development assessment. The inspected materials do not establish that those techniques fail generally or that closed models are universally better or cheaper.

## Article-owned figure

The [article figures](../figures/) describe segmentation, source/context retrieval, modular reasoning, and human review. They are design illustrations, not independent proof that each depicted stage is deployed or that its output is correct.
