---
name: section-construction
description: >
  Incremental build for complex outputs. Use when generating walkthroughs, comprehensive reports,
  or any deep-dive output >500 lines. Trigger: "build the walkthrough", "generate the report",
  "create the interactive HTML", "produce the output", or any variation of generating a large
  structured deliverable. Do NOT invoke for simple outputs, single KB entries, intelligence log
  updates, or anything classified as scan-depth.
---

# Section Construction — On-Demand Curriculum Engine

Builds complex outputs one section at a time instead of generating them in a single pass. Single-pass
generation degrades predictably: the first third is strong, the middle is adequate, the final third
loses detail and drops conventions. This skill prevents that by formalizing the incremental build
process documented in `engine/methodology/section-construction.md`.

## Should You Use This Skill?

Run this 10-second gate before proceeding:

1. **Was this output classified as deep-dive?** (per depth assessment) — NO -> skip this skill. YES -> continue.
2. **Will the output exceed ~500 lines?** — NO -> skip this skill. YES -> use this skill.

If both answers are YES, this skill applies. If either is NO, generate the output normally.

**The honest-answer version:** "If I generate this entire output in one pass, will the last section
be as good as the first?" If no — use this skill.

## When NOT to Use This Skill

- Simple outputs under ~500 lines
- Single knowledge base entries
- Intelligence log updates
- Methodology documents
- Session state updates (CONTEXT.md, activity logs)
- Anything the depth assessment classified as scan-depth

The overhead of section planning, namespace assignment, and phased review is only justified when the
output is complex enough that single-pass generation would degrade quality. If you are debating
whether this skill applies, it probably does not.

## Step 1: Plan Sections (Phase A)

Before generating any content, produce the section architecture. Load the full methodology for
reference:

```
Read: engine/methodology/section-construction.md
```

Then build and present the section plan to Sean:

```
**Section Plan — [output name]**

| #  | Section         | Est. Lines | Cross-refs to   | Namespace     |
|----|-----------------|------------|-----------------|---------------|
| 1  | [section name]  | [estimate] | [section #s]    | [prefix]      |
| 2  | [section name]  | [estimate] | [section #s]    | [prefix]      |
| …  | …               | …          | …               | …             |

Total estimated: [N] lines across [N] sections.
Does this structure look right?
```

**Rules for the plan:**
- Every section gets a unique namespace prefix (see Namespace Convention in the methodology)
- Cross-references are mapped in both directions — if Section 3 references Section 1, that appears in both rows
- The largest section should not exceed ~3x the smallest (excluding intentionally minimal sections) — if it does, consider sub-dividing
- Ambiguous section boundaries are resolved here, not during generation

**Do not proceed to Step 2 until Sean approves the plan.**

## Step 2: Build Section by Section (Phase B)

For each section, in order:

1. **Generate the section content.** Focus on this section only. Do not try to hold the entire output in working memory.

2. **Use the section's namespace prefix** for all IDs, anchors, CSS class modifiers, and localStorage keys. Every ID follows: `{namespace}-{element-type}-{descriptive-name}`. Draw element-type tags from the standard set in the methodology.

3. **Update cross-references.** If this section references a previous section, verify the anchor exists. If a previous section will reference this one, note the forward reference for later fulfillment.

4. **Run per-section self-tests:**
   - "Do all IDs in this section start with its namespace prefix?" — If NO: fix before moving on.
   - "Does this section reference any section that does not yet exist?" — If YES: note the forward reference.
   - "Read the last paragraph of this section, then the first paragraph of the next planned section. Is there a logical bridge?" — If NO: fix the transition.
   - "Pick any claim in this section. Can you name the source?" — If NO: evidence discipline failure.

5. **Commit the section** if working in a file that supports incremental saves. Do not wait until all sections are done.

## Step 3: Whole-Output Review (Phase C)

After all sections exist, review the complete output as a unified document.

1. **Read the complete output as a whole** — as a reader would experience it, not section by section.

2. **Verify all cross-references resolve.** Every anchor referenced by another section must exist. Every forward reference noted in Step 2 must have been fulfilled. Search for each section's namespace prefix to find all references to it.

3. **Check flow.** Does information build logically? Are transitions smooth? Does any section assume knowledge not yet covered?

4. **Check balance.** Are sections proportional to their importance? The section driving the most important decision (often security) should be the deepest. If all sections are roughly equal length, depth was distributed by habit, not by value.

5. **Run the anti-pattern check.** Specifically watch for:
   - **Symmetric section lengths** — all sections roughly equal despite unequal importance
   - **Missing Source Trail** — sources cited in sections but not tracked centrally
   - **Understated Warning** — security findings that should be more prominent

6. **Fix anything found** (Phase D from the methodology). After fixes, do a targeted re-review of the specific issues — not a full Phase C repeat unless fixes were extensive.

## Step 4: Present to Sean

When the output passes review, present the completion summary:

```
**Output complete — [output name]**

[N] sections, [total lines] lines. Self-tests passed.

Issues found and resolved during review:
- [issue 1, if any]
- [issue 2, if any]

Residual concerns:
- [anything that could not be fully resolved, if any]
```

If no issues were found during review, say so — but be honest about whether the review was thorough
enough to have caught issues if they existed.
