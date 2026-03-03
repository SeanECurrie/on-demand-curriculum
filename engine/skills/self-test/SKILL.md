---
name: self-test
description: >
  Run binary self-tests against engine output before declaring it complete. Use after
  finishing any research synthesis, knowledge base entry, walkthrough section, or report.
  Invoke when about to say "done", "complete", "ready for review", "finished", or any
  variation of declaring work finished. This is the engine's equivalent of a test suite —
  concrete yes/no checks, not aspirational review. Do NOT invoke for trivial updates —
  fixing a typo, adding a cross-reference, updating a date, renaming a file, or any
  mechanical change where quality verification adds no signal.
---

# Self-Test — On-Demand Curriculum Engine

Before declaring any engine output complete, run the relevant binary self-tests. These are
yes/no questions — not judgment calls. If any answer is NO, fix it before proceeding.

## When NOT to Use This Skill

Skip this skill entirely if the task is:
- Fixing a typo, broken link, or formatting issue
- Adding a cross-reference between existing docs
- Updating dates, metadata, or session state
- Renaming or moving files
- Any mechanical change where the question "did this pass quality checks?" has no meaningful answer

If the work did not produce research, synthesis, or deliverable content, self-testing is
overhead, not value.

## Step 1: Determine Which Tests Apply

Read: `engine/methodology/binary-self-tests.md`

Select test sets based on what was produced:

| What you produced | Run these tests |
|-------------------|----------------|
| Research output (dual-source sweep, landscape scan, documentation pull) | Research Stage Tests |
| Assessment, verdict, knowledge base entry, synthesis document | Synthesis Stage Tests |
| Walkthrough section, interactive HTML, deliverable content | Output Generation Tests |
| Anything at all | Cross-Cutting Tests (always) |

Multiple sets can apply. If you researched AND synthesized AND generated output, run all
three stage-specific sets plus cross-cutting.

Also read the inline self-tests from the methodology doc for the area you worked in:
- Research → `engine/methodology/dual-source-intelligence.md` (inline self-tests section)
- Source evaluation → `engine/methodology/credibility-tiers.md` (inline self-tests section)
- Synthesis/editorial → `engine/methodology/editorial-standards.md` (inline self-tests section)

## Step 2: Run Each Test

For each applicable test, evaluate your output. Use quick or thorough versions based on
the depth classification for this work (see `engine/skills/depth-assessment/SKILL.md`).

Record results in a table:

| Test | Result | Fix needed? |
|------|--------|-------------|
| [test ID + short description] | YES / NO | [if NO: what specifically to fix] |

Be honest. The point is catching problems before Sean sees them, not generating a clean
report. A NO is useful. A false YES is waste.

## Step 3: Fix All Failures

Address every NO result. Then re-run ONLY the failed tests to confirm they now pass.

If a fix requires reworking a significant portion of the output, do the rework — do not
rationalize the failure away. If the test said NO, something is wrong. Fix it or explain
to Sean why the test does not apply to this specific case.

## Step 4: Present Results to Sean

```
**Self-test results — [what was tested]**
- X/Y tests passed
- [Any notable findings from the testing process]

Ready for your review.
```

Keep it tight. Sean does not need to see the full test table unless he asks. The summary
tells him the work was verified. If any tests required fixes, mention what was fixed — that
is signal, not noise.
