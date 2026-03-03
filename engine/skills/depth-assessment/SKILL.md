---
name: depth-assessment
description: >
  Mandatory 30-second depth classification before starting any pipeline stage. Use this at the
  start of research, synthesis, output generation, or any substantive engine work. Determines
  whether to scan (breadth) or deep-dive (depth) for each topic area. Invoke when Sean says
  "start research on X", "let's look into Y", "begin output for Z", "evaluate this tool",
  "let's build the walkthrough for...", or any variation of beginning substantive work. Do NOT
  invoke for trivial housekeeping — fixing a typo, adding a cross-reference, updating a date,
  renaming a file, or any task where depth classification adds no signal.
---

# Depth Assessment — On-Demand Curriculum Engine

Before doing any substantive work, classify the depth required. This takes 30 seconds and
prevents the default failure mode: medium-quality everything.

## When NOT to Use This Skill

Skip this skill entirely if the task is:
- Fixing a typo, broken link, or formatting issue
- Adding a cross-reference between existing docs
- Updating dates, metadata, or session state
- Renaming or moving files
- Any mechanical change where the question "how deep should we go?" has no meaningful answer

If the work does not involve research, synthesis, or output generation, depth classification
is overhead, not value.

## Step 1: Read the Classification Questions

Load the methodology doc that defines the classification framework:

```
Read: engine/methodology/depth-assessment.md
```

Focus on the "30-Second Classification" section — three yes/no questions that determine depth.

## Step 2: Run the Classification

For each topic or finding area in the upcoming work, run through the three questions:

1. "Will this finding drive a GO/NO-GO decision?"
2. "Is the operator new to this topic?"
3. "Has this topic had security implications in past research?"

The first YES determines depth. If all three are NO, scan is appropriate. Mixed-depth is
normal — a single pipeline stage often has both scan and deep-dive areas.

Present the result to Sean using this format:

```
**Depth Assessment — [date]**

| Topic/Area | Depth | Reason |
|-----------|-------|--------|
| [topic 1] | Scan / Deep-dive | [which question triggered it] |
| [topic 2] | Scan / Deep-dive | [which question triggered it] |

"Does this depth allocation look right, or should anything shift?"
```

Wait for Sean's confirmation or adjustment before proceeding. He may know things about the
operator or the topic that change the classification.

## Step 3: Proceed with Appropriate Depth

Once depth is confirmed, let it govern how you work:

- **Scan areas:** Use lightweight finding structures, 1-2 sources per claim, larger working
  chunks. Cover the territory — the goal is breadth, not exhaustiveness.
- **Deep-dive areas:** Use full evidence chains, dual-source every claim (per
  `dual-source-intelligence.md`), section-by-section construction for walkthrough output.
  The goal is confidence, not coverage.

Remember: even scan-depth research uses dual sources. The difference is how many claims get
dual-sourced — a scan dual-sources the pivotal claims, a deep-dive dual-sources everything.

## Step 4: Watch for Reclassification

During work, stay alert for signals that depth needs to change. Reclassify when:

- A scan surfaces a security concern that was not anticipated
- A scan reveals the operator's knowledge gap is bigger than assumed
- A deep-dive determines the topic is simpler than expected and further depth adds noise
- Community intelligence contradicts official docs on something assumed to be settled

When reclassifying, flag it immediately:

```
"Reclassifying [topic] from scan to deep-dive because [specific evidence/reason]."
```

Log the reclassification in the activity log. This is expected — scans exist partly to find
what needs depth. But if you are reclassifying frequently in the same direction, the initial
classification was probably too aggressive. Calibrate.
