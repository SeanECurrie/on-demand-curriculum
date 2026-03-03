# Section-by-Section Construction

**Created:** 2026-03-03
**Purpose:** A formalized incremental build process for complex engine outputs (interactive walkthroughs, comprehensive reports, multi-section knowledge base entries). Prevents quality degradation from generating large outputs in single passes and manages cross-references between sections.

---

## Why This Exists

Quality degrades when large outputs are generated in a single pass. LLMs hit context window limits, lose coherence between early and late sections, and miss cross-reference issues that only become visible when the full output exists. The failure mode is predictable: the first third is strong, the middle is adequate, and the final third loses detail, drops conventions established earlier, and introduces inconsistencies.

This is not a theoretical concern. Output #1's interactive walkthrough is 3,030 lines of HTML across 10 phases. Generating that in one pass would have meant approximately 90K tokens of output — well beyond the point where coherence degrades. The walkthrough was built iteratively during Output #1, but the process was ad hoc. This document formalizes the approach so it is repeatable and disciplined.

The pattern was reverse-engineered from Cole Medin's Excalidraw diagram skill, which constructs complex diagrams section by section using seed namespaces to prevent ID collisions. The same principle applies to any large structured output: plan the pieces, build them one at a time, manage the connections between them, then review the whole.

---

## When This Activates

**Only for deep-dive depth outputs** (as classified by the depth assessment — see `depth-assessment.md`). Scan-depth outputs can be generated in larger chunks without this overhead.

Specifically, this process activates when producing:

- **Interactive HTML walkthroughs** — any output that will exceed ~500 lines
- **Research reports with 5+ sections** — where sections reference each other's findings
- **Knowledge base entries synthesizing 20+ sources** — where the evidence chain is complex enough that cross-references between findings matter
- **Any output where the agent would exceed ~32K tokens generating it at once** — the practical ceiling for coherent single-pass generation

**Simple outputs do NOT use this.** Single knowledge base entries, intelligence log updates, short synthesis docs, methodology documents like this one — all skip section construction. The overhead is only justified when the output is complex enough that single-pass generation would degrade quality.

**The gating question:** "If I generate this entire output in one pass, will the last section be as good as the first?" If the honest answer is no — use section construction. If yes — generate normally.

---

## The Process — Four Phases

### Phase A: Plan the Sections

Before generating any content, produce a section plan. This is the architecture of the output.

1. **List all sections** the output needs. For an interactive walkthrough, this means every phase. For a report, every major section.

2. **Define section boundaries** — what content goes in which section. Ambiguous boundaries cause duplicate content or gaps. If two sections could reasonably contain the same content, resolve the ambiguity in the plan, not during generation.

3. **Identify cross-references** — which sections will reference which. Map these explicitly. A walkthrough phase that says "as we configured in Phase A" needs to know Phase A's anchor IDs before it is written.

4. **Assign namespaces** — every section gets a unique prefix for IDs, anchors, and internal links (see Namespace Convention below).

5. **Estimate section sizes** — rough line counts help identify sections that may need sub-division.

6. **Present the plan to Sean** for approval before generating any content:

```
Section plan for [output name]:

| #  | Section         | Est. Lines | Cross-refs to   | Namespace     |
|----|-----------------|------------|-----------------|---------------|
| 1  | [section name]  | [estimate] | [section #s]    | [prefix]      |
| 2  | [section name]  | [estimate] | [section #s]    | [prefix]      |
| …  | …               | …          | …               | …             |

Total estimated: [lines] lines across [N] sections.
Does this structure look right?
```

Do not proceed to Phase B until Sean approves the plan.

### Phase B: Build One Section at a Time

For each section, in order:

1. **Generate the section content.** Focus on this section only. Do not try to hold the entire output in working memory.

2. **Update cross-references** to and from previously generated sections. If this section references Phase A, verify the anchor exists. If Phase A will reference this section, note the forward reference for when Phase A is edited.

3. **Verify internal consistency** within the section. Do the IDs follow the namespace convention? Do code examples use the same variable names as the prose? Do callout types match the severity of the content?

4. **Run relevant binary self-tests** on the section (see `binary-self-tests.md`). At minimum:
   - "Pick any claim in this section. Can you name the source?" (evidence discipline)
   - "Does this section reference any section that does not exist yet? If so, is the forward reference noted?" (cross-reference integrity)
   - "Read this section without reading the previous one. Does the context make sense?" (standalone coherence)

5. **Commit the section** if working in a file that supports incremental saves. Do not wait until all sections are done to save.

### Phase C: Whole-Output Review

After all sections exist, review the complete output as a unified document.

1. **Read through the complete output as a whole.** Not section by section — as a reader would experience it. This catches flow issues that are invisible at the section level.

2. **Check that all cross-references resolve correctly.** Every anchor referenced by another section must exist. Every forward reference noted in Phase B must have been fulfilled.

3. **Check flow.** Does the eye move through sections in a logical order? Are transitions between sections smooth? Does information build on itself, or does a later section assume knowledge that was not covered earlier?

4. **Check balance.** Are sections proportional to their importance? A GO/NO-GO security evaluation should be substantially deeper than a routine configuration step. If all sections are roughly the same length, the balance is probably wrong (see the "Symmetric Knowledge Base" anti-pattern in `anti-patterns.md`).

5. **Run the anti-pattern check** on the whole output (see `anti-patterns.md`). In particular, watch for:
   - The Symmetric Knowledge Base — all sections roughly equal despite unequal importance
   - The Missing Source Trail — sources cited in sections but not tracked centrally
   - The Understated Warning — security findings that should be more prominent

### Phase D: Iterate

Fix anything found in Phase C. This may require editing multiple sections if a cross-reference or flow issue spans sections.

After fixes, do a targeted re-review of the specific issues found — not a full Phase C repeat unless the fixes were extensive. The goal is convergence, not infinite review loops.

---

## Cross-Reference Management

Cross-references between sections are the primary source of bugs in large outputs. Broken links, stale anchors, and circular references all emerge when sections are built independently.

### Anchor Naming Convention

All anchors follow the format: `{section-prefix}-{element-name}`

- **Section prefix:** The namespace assigned in Phase A (e.g., `phase-a`, `phase-d`, `sec-research`, `sec-synthesis`)
- **Element name:** A descriptive kebab-case name for the specific element (e.g., `firewall-config`, `sandbox-decision`, `model-routing-failover`)
- **Full anchor example:** `phase-d-sandbox-decision`, `sec-research-clawhub-supply-chain`

Rules:
- Anchors are lowercase, kebab-case only. No camelCase, no underscores, no spaces.
- Anchors must be unique across the entire output, not just within a section. The namespace prefix ensures this.
- Anchors should be descriptive enough that reading the anchor tells you what it points to.

### Link Formats

**Within the same output file (single-file HTML walkthroughs):**
```html
<a href="#phase-d-sandbox-decision">sandbox configuration in Phase D</a>
```

**Across files (multi-file reports):**
```markdown
[sandbox configuration](../security/sandbox-decision.md#sandbox-decision)
```

### When a Referenced Section Changes

If a section is edited after other sections already reference it:

1. **Check all incoming references.** Search the output for the section's namespace prefix to find every reference to it.
2. **Verify anchors still exist.** If an anchor was renamed or removed, update all references.
3. **Verify context still holds.** If Section A says "as configured in Phase D" but Phase D's content changed, the characterization in Section A may be stale. Re-read the reference in context and update if needed.

This is why the cross-reference map from Phase A matters — it tells you exactly which sections to check when one changes.

---

## Namespace Convention

Every section gets a unique namespace prefix assigned during Phase A. This prefix is used for all HTML IDs, anchor names, CSS class modifiers, and localStorage keys within that section.

### Format

For interactive walkthroughs with phases:
```
phase-{letter}     →  phase-0, phase-a, phase-b, …, phase-i
```

For research reports with numbered sections:
```
sec-{number}       →  sec-1, sec-2, sec-3
```

For knowledge base entries with thematic sections:
```
kb-{topic}         →  kb-security, kb-architecture, kb-deployment
```

### ID Construction

All IDs within a section use the namespace as a prefix:

```
{namespace}-{element-type}-{descriptive-name}

Examples:
  phase-d-step-enable-sandbox
  phase-d-understanding-sandbox-model
  phase-d-callout-critical-unsandboxed-risk
  phase-d-code-sandbox-config
  phase-d-deploy-note-3
  sec-2-finding-supply-chain
  sec-2-table-comparison-matrix
```

### Element Type Tags

Consistent element-type tags within namespaces make searching and bulk operations predictable:

| Element Type | Tag | Example |
|-------------|-----|---------|
| Phase/section header | `header` | `phase-a-header` |
| Numbered step | `step` | `phase-a-step-create-user` |
| Understanding block | `understanding` | `phase-a-understanding-permissions` |
| Callout box | `callout` | `phase-d-callout-critical-root` |
| Code block | `code` | `phase-b-code-install-homebrew` |
| Table | `table` | `phase-e-table-model-comparison` |
| Deployment note | `deploy-note` | `phase-c-deploy-note-2` |
| Diagram | `diagram` | `phase-d-diagram-defense-depth` |
| Finding | `finding` | `sec-2-finding-clawhub-risk` |

### Preventing Collisions

The namespace convention prevents collisions by construction — as long as:
1. No two sections share the same namespace prefix (enforced in Phase A)
2. All IDs within a section use that section's prefix (enforced in Phase B)
3. Element-type tags are drawn from the standard set above (new types can be added but must be documented)

If a collision is detected during Phase C review, it means either a namespace was duplicated or an ID omitted its prefix. Fix the ID, not the convention.

---

## Output #1 Example

The interactive walkthrough for Output #1 (OpenClaw deployment, 3,030 lines) provides a retroactive case study. The walkthrough was built iteratively but without this formalized process. Here is how section construction would have applied:

### Phase A Would Have Produced This Plan

| # | Section | Est. Lines | Cross-refs to | Namespace |
|---|---------|------------|---------------|-----------|
| 1 | Machine Preparation | ~220 | A, B | `phase-0` |
| 2 | macOS Hardening | ~240 | 0, D | `phase-a` |
| 3 | Runtime Setup | ~45 | A, C | `phase-b` |
| 4 | OpenClaw Installation | ~75 | B, D, E | `phase-c` |
| 5 | Security Hardening | ~280 | A, C, E | `phase-d` |
| 6 | Model Configuration | ~65 | C, D | `phase-e` |
| 7 | Channel Setup | ~60 | C, E | `phase-f` |
| 8 | First Agent | ~70 | D, E, F | `phase-g` |
| 9 | Verification | ~85 | All previous | `phase-h` |
| 10 | Monitoring & Operations | ~90 | A, D, H | `phase-i` |

(Line estimates are for HTML content sections, excluding shared CSS/JS infrastructure at ~570 lines.)

### What Section Construction Would Have Caught

1. **Cross-reference integrity.** Phase H (Verification) references configurations from every previous phase. Building it last with an explicit cross-reference map would have ensured every anchor existed before linking to it.

2. **Balance issues.** Phase D (Security Hardening) at ~280 lines is the deepest section — appropriate, since it drives the GO/NO-GO decision. Phase B (Runtime Setup) at ~45 lines is the lightest — also appropriate, since the operator is familiar with Homebrew. A Phase C review would confirm this balance is intentional, not accidental.

3. **Namespace consistency.** The actual walkthrough uses `phase-0`, `phase-a` through `phase-i` as section IDs — which matches the namespace convention. The element IDs within sections (e.g., `phase-0-deployment-notes`, `phase-a-deployment-notes`) also follow the pattern. This consistency happened naturally in Output #1, but section construction would have enforced it from the plan stage.

4. **Forward references.** Phase 0 mentions "hardening in the next phase" — a forward reference to Phase A. Section construction Phase B would flag this as a forward reference to verify once Phase A exists.

---

## Self-Tests

Binary tests specific to section construction quality. Run these during Phase C (whole-output review) and after Phase D (iteration).

### Plan Quality (After Phase A)

1. "Does every section have a unique namespace prefix?" YES/NO — If NO: collision risk. Fix before proceeding.
2. "Are cross-references mapped in both directions?" YES/NO — If NO: you will miss reference breakage when sections change.
3. "Is the largest section less than 3x the smallest section (excluding intentionally minimal sections)?" YES/NO — If NO: check whether the balance reflects importance or is accidental.

### Section Quality (After Each Phase B Iteration)

4. "Do all IDs in this section start with its namespace prefix?" YES/NO — If NO: collision risk with other sections.
5. "Does this section reference any section that does not yet exist?" YES/NO — If YES: note the forward reference for later verification.
6. "Read the last paragraph of this section, then the first paragraph of the next planned section. Is there a logical bridge?" YES/NO — If NO: the transition needs work.

### Whole-Output Quality (Phase C)

7. "Search for every anchor referenced by another section. Do all of them resolve?" YES/NO — If NO: broken cross-references. Fix before delivery.
8. "Read the output from start to finish without stopping. Did any section feel repetitive of a previous section?" YES/NO — If YES: deduplicate or cross-reference instead of repeating.
9. "Is the deepest section the one that drives the most important decision?" YES/NO — If NO: the balance may be wrong (see "Symmetric Knowledge Base" anti-pattern).
10. "Run the anti-pattern check. Did any anti-pattern match?" YES/NO — If YES: fix before delivery.

---

## Related Documents

- `depth-assessment.md` — Section construction only activates for deep-dive depth outputs. The depth assessment gate determines whether this process applies.
- `anti-patterns.md` — Documents failure modes that section construction helps prevent, including coherence loss in large outputs and the Symmetric Knowledge Base pattern.
- `binary-self-tests.md` — The framework for the self-tests in this document. Test design rules (yes/no in 5 seconds, concrete, actionable) come from that methodology.
- `findings-pattern-library.md` — When sections contain research findings, each finding should use the appropriate pattern from the library.
- `../templates/walkthrough-style-guide.md` — Defines WHAT interactive walkthrough outputs look like (colors, typography, components). This document defines HOW they get built. The style guide is the specification; section construction is the build process.
