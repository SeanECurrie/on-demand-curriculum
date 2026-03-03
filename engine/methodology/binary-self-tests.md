# Binary Self-Tests

**Created:** 2026-03-03
**Purpose:** Concrete yes/no tests that the engine (Claude) can run against its own output to verify quality. Replaces aspirational quality language ("make it clear") with testable checkpoints ("cover paragraph 3, read it without paragraph 1 — does it still track?").

---

## Why Binary Tests

LLMs cannot reliably evaluate "is this good?" They CAN evaluate concrete yes/no questions. "Write clearly" is an aspiration. "Read the third paragraph without reading the first two — does it make sense?" is a verification step. The difference is the difference between hoping and checking.

This engine's DNA demands evidence over assertion. Binary self-tests apply that same principle to the engine's own output. We do not just demand evidence from research — we demand testable quality from ourselves.

**Origin:** Cole Medin's Excalidraw diagram skill uses two binary tests that work because they are concrete:
- **The Isomorphism Test:** "Remove all text from the diagram. Does the structure still communicate the concept?" — Forces structural integrity.
- **The Education Test:** "Could someone learn something concrete and new from this?" — Forces value delivery.

These tests work because a YES or NO answer takes seconds, not judgment calls. That is the standard every self-test in this document must meet.

---

## Test Design Rules

Every self-test in the engine — whether in this document, inline in methodology docs, or added in the future — must follow these rules:

1. **Answerable YES or NO in under 5 seconds.** If it takes deliberation, the test is too vague. Rewrite it.
2. **Concrete — references specific parts of the output.** "Is this section good?" is not a test. "Pick any claim in section 3. Can you name its source?" is a test.
3. **Actionable — a NO answer implies a specific fix.** If the test fails and you do not know what to change, the test is not useful.
4. **Paired — quick version for scans, thorough version for deep-dives.** Quick tests check for presence ("Is there a source?"). Thorough tests check for quality ("Is the source Tier 1-3, and is there a second source that corroborates?"). See `depth-assessment.md` for when to use which.

### What Makes a Bad Test

- "Is this clear?" — Vague. Clear to whom? Under what conditions?
- "Does this feel right?" — Subjective. No actionable failure mode.
- "Is the quality sufficient?" — Circular. Defines nothing.

### What Makes a Good Test

- "Pick any claim. Can you name the source and its credibility tier in under 5 seconds?" — Specific action, specific check, specific failure.
- "Read the residual risk section. Does it name at least one specific risk, or does it say 'some risk remains'?" — Points at a concrete section, checks for a concrete property.
- "Find the most negative finding. Is it stated as plainly as the most positive one?" — Forces a comparison that reveals bias.

---

## Self-Tests by Pipeline Stage

### Research Stage Tests

Run these after completing any research cycle (dual-source intelligence sweep, landscape scan, documentation pull).

| # | Quick (Scan Depth) | Thorough (Deep-Dive Depth) |
|---|---|---|
| R1 | Pick any claim. Is there a source attached? | Pick any claim. Can you name the source, its credibility tier, and its date in under 5 seconds? |
| R2 | Is there at least one community source AND one official source in this research? | For every finding that will drive a decision, is there both an official and a community source? |
| R3 | Does this research surface at least one finding that complicates or contradicts the starting hypothesis? | Find the most negative finding. Is it stated with the same directness and specificity as the most positive finding? |
| R4 | Are there any claims attributed to "general sentiment" without a specific source? If yes, are they flagged as Tier 5? | Pick any Tier 4-5 source. Is the finding it supports also corroborated by a Tier 1-3 source, or explicitly marked as unvalidated? |

### Synthesis Stage Tests

Run these after writing any assessment, verdict, knowledge base entry, or synthesis document.

| # | Quick (Scan Depth) | Thorough (Deep-Dive Depth) |
|---|---|---|
| S1 | Does the synthesis include a residual risk statement? | Read the residual risk section. Does it name specific risks with specific consequences, or does it say "some risk remains"? |
| S2 | Pick any tool-specific instruction. Is it marked as tool-specific? | Pick any tool-specific instruction. Is there an accompanying note about the transferable principle it implements? |
| S3 | Read the conclusion. Can you tell whether it is based on evidence or opinion without reading the rest of the document? | Read the conclusion without reading the evidence sections. Does it read like a finding ("evidence shows...") or like an opinion ("we believe...")? |
| S4 | Is there at least one source contradiction flagged as an intelligence insight? | Find every point where official docs and community sources disagree. Is each one flagged with both perspectives and an assessment of which is more current? |

### Output Generation Tests

Run these after generating any walkthrough section, interactive HTML, or deliverable content.

| # | Quick (Scan Depth) | Thorough (Deep-Dive Depth) |
|---|---|---|
| O1 | Pick any command in the walkthrough. Is the expected output documented? | Pick any command. Run it mentally against the documented environment. Does the expected output match what would actually happen? |
| O2 | Pick any "Understanding" section. Does it explain WHY, not just WHAT? | Pick any "Understanding" section. Cover the commands below it. Does the Understanding section alone teach a transferable principle? |
| O3 | Pick any security-relevant configuration step. Is the security implication noted inline? | Pick any security-relevant step. Is the implication noted at the point of decision, or is it deferred to a later section or appendix? |
| O4 | Does the output distinguish between essential, educational, and operational polish steps? (See `three-tier-hardening.md`) | For each essential (Tier 1) hardening step, could an operator explain WHY it is essential based solely on what the walkthrough says? |

### Visual Output Tests

Run these after generating any output with visual or interactive elements (HTML walkthroughs, styled diagrams, interactive components). These tests are only relevant when the output renders in a browser — skip for pure-text outputs.

| # | Quick (Scan Depth) | Thorough (Deep-Dive Depth) |
|---|---|---|
| V1 | Has the output been opened in a browser since the last edit? | Has the output been rendered via Puppeteer (or manually) with screenshots taken of every major section, in both light and dark mode? |
| V2 | Pick any diagram. Does its visual structure match the pattern prescribed by the concept-to-pattern mapping (style guide 5.5)? | **Isomorphism Test:** Pick any diagram. Mentally remove all text labels. Does the visual structure alone communicate the concept? If it looks like generic boxes without labels, the pattern is wrong. |
| V3 | Count the diagrams in the output. Does the count match the diagram spec in the style guide Section 7? | For each diagram specified in the style guide, verify: (a) it renders, (b) it is visible (not hidden), (c) its type matches the spec, (d) its nodes match the spec. |
| V4 | Click any expandable section. Does it expand and collapse? | Click every expandable section. Do they all work? Does content stay inside containers (not leaked outside)? |
| V5 | Check any checkbox, reload the page. Is the state preserved? | Check a checkbox, enter text in a notes field, reload the page. Are both checkbox state and text content preserved? |
| V6 | Pick any diagram. Are the colors consistent with the diagram color reference? | Open `diagram-color-reference.md`. For each diagram element, verify its fill and stroke match the semantic category from the reference. |

### Cross-Cutting Tests (Apply to Everything)

Run these on any engine output, regardless of pipeline stage.

| # | Quick (Scan Depth) | Thorough (Deep-Dive Depth) |
|---|---|---|
| X1 | Could someone unfamiliar with this specific tool read this document and understand the main points? | Pick a section from the middle of the document. Read it without reading anything before it. Does it provide enough context to stand on its own, or does it assume you read everything above? |
| X2 | Does this output add value — does it inform a decision or teach a principle? Or is it information for the sake of completeness? | For each section, ask: "If I deleted this section, would the document lose decision-making value?" If no, the section is noise. |
| X3 | Is outdated content marked `[OUTDATED]` rather than deleted? | If any content references a version number, date, or feature status — is there a date tag that makes staleness detectable? |

---

## Adding New Tests

When a quality failure is discovered — in review, in delivery, in retrospective, or when Sean flags a problem — ask:

1. **"What binary test would have caught this?"** If you can write a concrete yes/no test, add it to the relevant stage section above.
2. **"Which pipeline stage produced the failure?"** Put the test in that stage's section.
3. **"Can I answer this test in under 5 seconds?"** If not, make it more concrete until you can.
4. **"Does a NO answer tell me what to fix?"** If not, the test is detecting a symptom, not a cause. Dig deeper.

If you cannot write a concrete test for a failure mode, the failure is too vague to prevent mechanically. Investigate further — the root cause may be upstream (bad research feeding bad synthesis, rather than bad synthesis in isolation).

### Test Retirement

Tests can become obsolete. If a test has never failed across 5+ outputs, consider whether:
- The engine has internalized the discipline (test served its purpose, keep it as a safety net)
- The test is too easy (never catches anything because it tests a baseline, not a quality bar)
- The failure mode it tests for no longer applies (tool or process changed)

Mark retired tests as `[RETIRED as of YYYY-MM-DD — reason]` rather than deleting them. The test history has value, consistent with the engine's living documentation principle.

---

## The Existing Exemplar

`three-tier-hardening.md` already contains binary self-tests — the tier classification questions:

- "If I skip this step and an attacker finds this service, can they cause harm?" → Essential
- "Would understanding WHY this step exists help me secure a completely different tool?" → Educational
- "If I skip this step, will the deployment work correctly for the first few weeks while I'm actively learning?" → Operational Polish

These were the first binary tests in the engine, written before this pattern was formalized. They work because they follow the same rules: yes/no in 5 seconds, concrete, actionable. This document generalizes that approach to the entire pipeline.

---

## Related Documents

- `three-tier-hardening.md` — The existing exemplar of binary self-tests (tier classification questions)
- `depth-assessment.md` — Determines whether to use quick or thorough test versions
- `editorial-standards.md` — The quality standards that self-tests verify (inline self-tests added)
- `dual-source-intelligence.md` — Research methodology with inline self-tests for source discipline
- `credibility-tiers.md` — Source weighting system with inline self-tests for tier assignment
- `../templates/walkthrough-style-guide.md` — Contains the diagram design process (Sections 5.5-5.6) that visual self-tests V2-V3 verify against
- `../templates/diagram-color-reference.md` — The color lookup that visual self-test V6 verifies against
