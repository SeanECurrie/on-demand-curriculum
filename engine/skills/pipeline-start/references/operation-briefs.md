# Operation Briefs — Deprecated

**Deprecated as of 2026-03-04**

The separate brief templates have been replaced by the run plan artifact structure in
`pipeline-start/SKILL.md`. The run plan serves the function briefs used to serve — scoping
the work and defining the skill chain — but as a growing artifact on disk rather than a
static handoff document.

The brief templates that were here previously are preserved in git history.

## What Replaced Them

The run plan (Step 2 of pipeline-start) contains:
- Layer 0: Raw Intake (replaces the brief's "Context" section)
- Layer 1: Classification + Context (replaces "Scope" and "What Exists")
- Layer 2: Skill Chain + Depth (replaces "Skill Chain" and depth sections)
- Layer 4: Design + Plan (replaces the separate design doc / implementation plan)
- Not-Scope section (unchanged — still mandatory, still never empty)
- Deliverables section (unchanged)

The key difference: the run plan grows as work progresses. Layers 3-5 start empty and
get populated during execution. Nothing is compressed or summarized away between phases.
