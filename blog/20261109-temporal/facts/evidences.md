# Temporal integration article: facts and evidence

Editorial review dates: 2026-11-13 (retained execution evidence) and 2026-11-16 (source contracts and article scope). These notes support [the manuscript](../article.md) and [the existing HTML entrypoint](../../20261109-temporal.html). They are editorial summaries, not an execution log or a new operational acceptance decision. Dates below identify the evidence reviewed, not a claim that every result remains current.

## Source handling

Public references are linked directly. Owner-held evidence was inspected or summarized during editing; the descriptions below deliberately omit private paths, operation identities, prompts, source code, and raw receipts. Readers cannot reproduce the private experiments from this repository alone. A contributor's experience report is identified as such rather than promoted to independently verified measurement. The execution findings come from retained records and interviews; the original task effects were not rerun for this editorial review. The article uses these observations to explain supported behavior through development scenarios; the findings below retain their historical scope and attribution.

## Public technical foundations

| Claim | Primary source | Supported interpretation and limit |
| --- | --- | --- |
| The server coordinates execution while SDK Worker processes poll queues and run application code. | [Temporal Worker documentation](https://docs.temporal.io/workers) | Supports the server/process distinction in section 02. CLI Worker and Codex Session Worker are article-level descriptions of how a development role works, not official Temporal Worker categories. |
| Temporal supports reading and changing Workflow state. | [Python Workflow message passing](https://docs.temporal.io/develop/python/workflows/message-passing) | Queries, Signals, and Updates are available primitives. Separate agent-facing read/write routes do not mean the SDK lacks write support. |
| Workflow recovery and external-operation recovery are different responsibilities. | [Temporal event history](https://docs.temporal.io/workflow-execution/event) and [Activity execution](https://docs.temporal.io/activity-execution) | Replay uses recorded history; retry policy can reattempt an Activity. Application-specific artifact reconciliation and safe handling of side effects require their own implementation. A generic mechanism is not proof that every kit adapter implements it. |
| Git commits preserve snapshots of work. | [Pro Git: What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F) | Supports the snapshot metaphor. A commit does not independently prove code quality or successful deployment. |
| Goal continuation can bring an agent back to a retained objective. | [Using Goals in Codex](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) | Continuation depends on the Goal and session state and available budget. This is not evidence of a Temporal completion callback, immediate wake, or conversation recovery after application restart. |

### Adapter contracts and execution evidence

**Status: source and contract review, confirmed by the framework owner.** Adapters check their supported execution and result requirements, while projects and provider owners retain policy and operating authority. Existing-result retrieval and resubmission under the same identity depend on the chosen adapter. Original-execution references include the namespace, Workflow ID, and Run ID. These are source/contract findings, not a new provider-run or release-acceptance result.

A separately inspected API-based runtime supplies a model–tool–result cycle through a selected provider adapter and authorized tools. These findings apply to that runtime; they do not establish that an agent CLI was invoked. Historical coding-agent CLI evidence is described separately below. Its execution and recovery findings retain their own source and scope rather than proving identical tools, context, or recovery behavior across execution environments.

## Development examples

### Approved document application

**Status: directly checked, historical bounded result.** An initial document proposal, a revised proposal, explicit approval, and application were retained as separate stages. The application changed a roadmap and a project overview in one commit. During editing, the approval record, application receipt, actual two-file Git commit, and acceptance checkpoint were compared. The recorded application outcome and Architect acceptance agreed.

The document execution receipt records zero provider calls. This describes that execution only: prior writing, coordination, review, subscription use, and total monetary cost are outside that counter. Completion of a separate independent review was not established. Proposal, revision, and application were different executions and do not demonstrate same-request duplicate-call prevention.

### Python candidate generation

**Status: directly checked historical candidate evidence; later adoption not established by this example.** One actual model API response produced an 803-byte Python candidate. Retained usage records show 5,398 input tokens and 752 output tokens, totaling 6,150. Three focused checks passed. The generation receipt identifies a syntax-checked candidate; a separate local verification covered normal end-of-input, size-limit enforcement, and an already-expired deadline. These were bounded behavior checks, not merely linting, and they were separate from independent review. The candidate size and usage record were checked during editing; the owner-held checkpoint distinguishes accepted generation from pending independent review and source application.

The recorded case contains no canonical application or source commit. The actual monetary charge is unknown. Focused checks do not replace independent semantic review, and a framework's separate application capability does not prove that this candidate was adopted.

## Recovery, observation, and scheduling

### Interrupted execution and reconciliation

**Status: historical isolated-test evidence; original source binding and process records directly checked.** The retained task's release digest matches its preserved historical manifest, and the controller, Worker, and recovery source files match that manifest. The controller stops its owned Temporal Worker after the original external child starts, waits for the Worker to exit, records its termination, and starts a replacement. The retained fault record reports a forced exit and matches the first Worker handle; the replacement has a different handle. The original child identity agrees across its start record, observed exit, and effect receipt. The same Workflow run completed, with one external job, one patch, one check, and zero provider calls. This strengthens the earlier evidence review, which had not connected the fault record to the historical source manifest.

The historical Worker source records the attempt number from the SDK's Activity information, and the retained records identify attempts one and two, with the second restricted to reconciliation. The saved server event-count summary contains one Activity start event. This is not evidence against retry: [Temporal documents](https://docs.temporal.io/evaluate/cloud/actions#activity) that intermediate retries do not create separate history events and that the started event's attempt attribute carries the total. The raw server event's attempt attribute was not independently retrieved during this editorial check; the source-bound SDK attempt records and the saved event counts remain distinguishable evidence.

The supported result is replacement of a Temporal Worker and reconciliation with the original external task, without launching that task again. It does not establish replacement of an autonomous Codex session, resumption of an interrupted model reasoning state, server restart, or machine reboot. Its historical retry policy does not change the separate one-attempt policy of current bounded orders.

### A finite one-shot Schedule

**Status: directly inspected operational proof summary; limited scope.** An isolated Schedule triggered one Workflow and one Activity, which completed without provider calls. The proof records deletion of the owned Schedule and a subsequent absence check. Two initial observation errors were retained and reconciled against the original execution without repeating the experiment. This is a finite scheduling result, not evidence of a continuously operated service or migrated production jobs.

### Original-result observation and reentry

**Status: bounded no-provider result with retained evidence checked.** The framework Architect supplied a validated evidence summary whose eleven reference digests matched their retained files during editing. The original execution command had exited; separate query, observation, and same-identity reentry then returned matching closed summaries. The report records unchanged watched child-artifact identity and modification time, matching original-run records, and a later original-result intake against the current caller contract. No new execution was performed to prepare this note.

This supports reuse of an original result in a controlled no-provider example, distinct from the document application's unverified later lookup. The selected example used an existing development environment and is not a clean-install test. It does not establish provider-backed same-request reentry with no new dispatch, aggregate avoided model calls, or monetary savings. A provider-zero operation also leaves authoring, coordination, review, Goal, tool, and subscription costs outside that counter.

### Historical model-backed coding result reentry

**Status: framework Architect-confirmed historical result; retained execution summary and independent local review inspected.** An earlier CLI-based coding route completed code generation and a separate review, then ran a bounded verification successor after the Architect accepted the exact result. In this recorded route, the CLI ran with tools disabled and the adapter materialized the candidate files. Its retained summary records a fresh controller adopting the completed original run without another model invocation. An independent local review compared saved summaries, response and candidate digests, decision bindings, successor records, and distinct usage-event identities. It corroborated the retained reentry record without issuing a fresh server query or checking a provider invoice.

This is historical model-backed original-result reuse in the precursor integration. It is separate from the current kit's controlled no-provider intake example and does not establish a new live result for the kit's current SDK model route. The earlier revised coding run was a separately authorized revision, not a duplicate request. Source application, service operation, aggregate avoided calls, and monetary savings are outside this finding.

### Retained model-request outcomes

**Status: current adapter source inspected and its scope confirmed by the framework Architect.** The bounded model adapter retains request intent, dispatch, response, usage, terminal status, and candidate or review references under the original request and binding. Its observation path validates the retained identity and artifact references before returning an existing terminal outcome. Incomplete original intent or unresolved transport outcomes preserve a reconciliation state rather than automatically dispatching again. A received response whose usage record could not be completed also remains held.

This is an implemented local recovery boundary, not an independent provider-side search or billing reconciliation service. Provider-response lookup, settled billing, and application-specific publication or delivery confirmation remain the owning adapter's responsibility. A completed local result can be reused; a missing delivery acknowledgement is not evidence that the original request was never sent.

### Client result acceptance after a caller failure

**Status: Architect-reported reconciliation, with the supplied report and artifact digests directly checked.** A client Architect described a local caller terminating abnormally after source changes had completed. The Architect located the original Temporal execution and compared file fingerprints to accept the existing result without repeating the change. The supplied application report, its referenced execution-control record, and the three recorded source-artifact digests matched the retained files during editing. The report records completed source replacements, reused prior checks, and zero provider calls for that application.

The original-run lookup is supported by the Architect's account; this editorial check did not issue a new server query. The report establishes source integration, not installation or operation of the resulting service. Zero calls in this application is an operation count, not a measured number of avoided model requests or a total-cost comparison.

### Application-owned partial recovery

**Status: retained evaluation report checked; responsibility confirmed by its Architect.** A multi-step model evaluation retained successful generation-stage results and completed judgments while recovering only missing responses. Earlier negative findings and explicit failures were preserved. The owner confirmed that the project's own cache and execution-profile logic supplied this behavior. The result demonstrates bounded application-level recovery and reuse; it is not attributed to Temporal or a kit adapter, and it is not a measured monetary saving.

## Communication and context

**Status: qualitative reports from the framework and client Architects; comparative measurements absent.** The framework Architect described ACKs and references as sufficient for exact-order acknowledgement and locating matching results. The client Architect reported reading the required result portions instead of repeatedly pasting whole logs into chat, and using original-run references and file fingerprints to accept an existing result after a caller failure. Scope changes, semantic findings, conflicting identities, and incomplete evidence still required substantive discussion. Both accounts describe easier retrieval alongside the added effort of maintaining orders, fingerprints, versions, and acceptance records.

Keeping large reports outside the conversation and retrieving only the needed material reduces the report body supplied to that particular model input, conditional on not reloading everything. Storage outside chat alone does not establish lower total context use. Message counts and lengths, context tokens, total tokens, latency, compaction counts, and overall monetary savings have not been compared under matched conditions. Supplementary recovery and no-provider reentry evidence was reviewed with the qualifications recorded above. A follow-up from the framework Architect confirmed the same interpretation and reported no additional experiments or evidence.

### Original-result intake and context entry

**Status: implemented read-only contract checked against the previously verified original-result intake evidence.** The intake tool selects one original execution, uses read-only query/observation summaries, and validates the pinned local result and output contract. Successful metadata output excludes raw private artifact bodies. The checked intake example retrieved the original result with the watched artifacts unchanged and no new provider call. The contract explicitly uses a pull on continuation rather than a direct push of a new conversation turn.

This establishes a concrete route for reading selected evidence without automatically relaying every Worker report into the Architect conversation. Unrequested report bodies stay outside that model input; the Architect experience reports describe using the same selective approach. This is evidence of bounded intake and selective context entry. Matched totals for context tokens, compaction, and overall cost remain distinct, unmeasured quantities. The exact semantic evidence an Architect subsequently reads depends on the acceptance decision.

## Conversation screenshot and reporting policy

**Status: owner-supplied screenshot directly inspected; selectively redacted derivative checked.** The capture shows cross-session coordination messages, including acknowledgement of an assignment, a dependency-validation discrepancy, source-state reporting, and execution-scope boundaries. It illustrates information accumulating in a conversation. It is not an established pre-Temporal baseline: the original view also contains integration-related work and execution tooling. The screenshot does not establish context overflow, compaction frequency, or a before/after reduction in messages or tokens.

The public derivative retains only the left application area, including the sidebar and chat. Identifying sidebar labels and selected internal identifiers, source fingerprints, and private paths are blurred. Generic interface controls, message shapes, ordinary coordination prose, the account badge permitted by the owner, and blue status indicators remain visible. ImageMagick performed the crop and selected blurs; checks confirmed unchanged pixels outside the masks and lossless encoding. The unredacted original is held outside this repository. No generated reconstruction is used as screenshot evidence.

The accompanying ACK/ref diagram describes the reporting policy used in the bounded examples: execution state and artifact references remain in Temporal, detailed reports and committed work remain in their artifact stores, and the session retrieves selected evidence. Receipt acknowledgements, scope decisions, exceptions, and semantic acceptance remain distinct. The diagram supplies no new measurement of communication or cost savings.

## Article-owned figures

- [Selective reporting](../figures/selective-reporting.svg): a routing policy for compact reports and selected evidence, not a measured performance comparison.
- [Conversation screenshot](../images/mcp-coordination-redacted.webp): selectively redacted visual example of accumulated coordination messages.
- [Execution and acceptance flow](../figures/temporal-execution-flow.svg): proposed architecture; arrows explain responsibilities rather than prove live integration.
- [Result acceptance after a caller failure](../figures/temporal-workflow-sequence.svg): the client Architect-reported source-change case, with its retained application report and artifact hashes checked as described above. The diagram shows completed source changes, abnormal caller exit, original-execution inspection, source-fingerprint comparison, and acceptance without repeating the change. It assigns no exact failure point to internal Workflow messages and makes no Git-commit claim. The candidate-generation diagram was removed from the article; its checked historical evidence remains above.
- [Workflows UI screenshot](../images/temporal-workflows-ui.png): editor-observed execution list, captured with the user's permission to retain visible operation names. It shows status and identity columns, not a retry/replay test or performance comparison. Inputs and result bodies are not shown.
