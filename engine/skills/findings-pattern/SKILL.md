---
name: findings-pattern
description: >
  Select and apply the right structure for research findings during synthesis. Use when
  writing knowledge base entries, intelligence log entries, research reports, or any
  structured findings. Invoke when synthesizing research into written output — especially
  when you catch yourself writing "we found that..." prose paragraphs for everything.
  Trigger phrases: "we found that...", "research shows...", "the evidence suggests...",
  writing a knowledge base entry, writing an intelligence log entry, writing a research
  report, structuring findings from a dual-source sweep. Do NOT invoke for session state
  updates, activity log entries, CONTEXT.md updates, or any mechanical/operational writing
  that is not research synthesis.
---

# Findings Pattern — On-Demand Curriculum Engine

When synthesizing research into written findings, select the right structure rather than
defaulting to prose paragraphs. Every finding has a TYPE. The type determines the structure.

## When NOT to Use This Skill

Skip this skill entirely if the task is:
- Updating session state, activity logs, or CONTEXT.md
- Writing operational notes (what happened, what's next)
- Mechanical edits — fixing formatting, adding cross-references, updating dates
- Any writing that is not the product of research synthesis

If you are not converting research into a finding, this skill adds overhead, not value.

## Step 1: Read the Pattern Library

```
Read: engine/methodology/findings-pattern-library.md
```

Focus on the **Pattern Table** — the mapping from finding type to structure. Seven patterns
plus an escape hatch:

| If the finding is... | Use this pattern |
|---------------------|------------------|
| A contradiction between sources | Contradiction Insight |
| A validated hypothesis | Validation Entry |
| A new discovery | Discovery Entry |
| A risk assessment | Risk Entry |
| A tool/option comparison | Comparison Matrix |
| A resolved question | Resolution Entry |
| A recommendation | Recommendation Entry |

## Step 2: Classify Each Finding

For each finding you are about to write, answer one question:

**"What TYPE of finding is this?"**

- Contradiction — sources disagree on a factual claim
- Validation — a hypothesis was tested and confirmed
- Discovery — something unexpected surfaced
- Risk — a threat needs likelihood/impact assessment
- Comparison — multiple options evaluated against criteria
- Resolution — a specific question has been answered
- Recommendation — evidence supports a specific course of action

Select the matching pattern. If no pattern fits, use the escape hatch: structured prose
with the tag `[No standard pattern — structured prose]`. If you use the escape hatch more
than once per research cycle, either the patterns need updating or the research needs
reframing.

## Step 3: Check Depth

Retrieve the depth assessment for this work (from the `depth-assessment` skill). Depth
determines how thoroughly the pattern is filled:

- **Scan depth:** Use the pattern structure but skip optional fields. Capture the finding
  in the right shape without exhaustive documentation. Required fields still need sources
  and tier tags.
- **Deep-dive depth:** Fill every field — required AND optional. No shortcuts. Every claim
  gets a source and tier tag. Residual risk is named specifically. Transferable principles
  are called out explicitly.

The pattern itself does not change between depths. What changes is the completeness of the
fill.

## Step 4: Write Using the Pattern Structure

Follow the template for the selected pattern from `findings-pattern-library.md`. Rules:

1. Every filled field must include a source and credibility tier per `editorial-standards.md`
2. Use the exact field names from the template — do not rename or reorder
3. Required fields are never skipped regardless of depth
4. If data for a required field is unavailable, state that explicitly — do not leave it blank
   or fill it with vague language

## Step 5: Self-Test

After writing, run two checks:

1. **Source traceability:** Pick any claim in the finding. Can you name the source and tier
   in 5 seconds? If no — the claim is unsourced. Fix it or remove it.

2. **Decision value:** Does this finding inform a decision, or is it just information? If it
   does not inform a decision, consider cutting it. DNA principle: write for value, not
   completeness. Not every research result deserves a structured finding.

If both checks pass, the finding is ready. If either fails, fix before proceeding.
