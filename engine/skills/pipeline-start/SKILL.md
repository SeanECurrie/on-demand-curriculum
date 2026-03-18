---
name: pipeline-start
description: >
  The run controller for all substantive engine work. Classifies the operation, builds a
  run plan from the engine's methodology and skills, forces skill invocation at every
  transition, writes everything to disk for compaction resilience, and gates on operator
  approval before execution begins. This skill is the forcing function that prevents drift.
  Use whenever starting new engine pipeline work — new outputs, extending existing outputs,
  revising content, conducting research, or updating engine methodology. Trigger on any of:
  "let's start on...", "new output for...", "Jeff needs...", "we should update...",
  "I got feedback on...", "research whether...", "let's revise...", "add a section about...",
  or any variation of beginning substantive work on the engine or its outputs. If you're
  about to open a methodology doc, read an output's CONTEXT.md, or start writing content —
  and you haven't run pipeline-start yet in this session — stop and run it first. The only
  exceptions are trivial mechanical changes (fixing a typo, updating a date, renaming a file)
  where classification adds no signal.
---

# Pipeline Start — Run Controller

This skill exists because the engine's methodology is comprehensive but not self-enforcing.
The Jeff feedback session proved it: 8 skills existed, 10 methodology docs existed, and Sean
had to course-correct 3 times because nothing forced them to fire in the right order. Claude
defaulted to "just do the thing" every time.

The root cause is not missing methodology — it's missing orchestration. This skill is the
orchestrator. It classifies, plans, forces skill invocation, persists to disk, and gates on
operator approval. Everything else in the engine already works. This makes it fire.

## What Changed from v1

v1 produced a static brief that compressed 14 process steps into 1-2 pages, then handed off
to `writing-plans`. The next skill only got the compressed brief — losing reasoning, file-read
findings, classification logic, and DNA check results.

v2 produces a **run plan on disk** — a growing artifact where each phase appends its output.
Classification becomes the header. Research findings get appended as a layer. The design
section gets appended. The execution log gets appended. Nothing is compressed. Nothing is lost.

## Relationship to session-restart

`session-restart` loads project context (CONTEXT.md, session state, calibration).
`pipeline-start` classifies the work and produces a run plan.

The ordering is: session-restart first (know where things stand), then pipeline-start
(decide what to do about it). If session-restart hasn't been run yet this session, run
it first. Pipeline-start assumes you already know the current state of the output or
engine you're about to work on.

**Resuming a run plan:** If a run plan already exists on disk from a previous session
(check the run plan path in Step 2), read it. Pick up where it left off — don't
reclassify or re-plan work that's already been approved. The run plan IS the session
state for this piece of work.

## When NOT to Use This Skill

Skip this skill entirely if:
- Fixing a typo, broken link, or formatting issue
- Updating dates or metadata in session-state.md or CONTEXT.md
- Renaming or moving files
- Adding a cross-reference between existing docs
- Updating the activity log or intelligence log with a single entry
- Any mechanical change where asking "what type of operation is this?" adds no signal

If the work would not benefit from having a plan — even a one-paragraph plan — skip this.

## Skill Availability Note

The run plans reference both **engine skills** (in `engine/skills/`) and **superpowers
skills** (external, available in Claude Code as `superpowers:*`). If a superpowers skill
is unavailable in your environment, follow its methodology manually — the skill chain
describes the *process*, not just the tool invocation. Engine skills are always available —
they're in this repo and you read them directly.

---

# THE FOUR STEPS

## Step 1: Classify (60 seconds, no more)

Read the intake context (whatever Sean has provided) and classify into one of six types.
Do not brainstorm. Do not research. Just classify.

| Type | Name | When | Planning Weight |
|------|------|------|-----------------|
| **A** | New output from scratch | New person, new topic, full pipeline | Heavy |
| **B** | Extend existing output | Add section, new research area, new content to existing output | Medium |
| **C** | Revise existing output | Post-delivery feedback, corrections, updates | Medium |
| **D** | Research-only | Investigate a question, landscape scan, feasibility — no output yet | Light |
| **E** | Engine update | Modify methodology, add/revise skill, update templates | Light |
| **F** | Review artifact | Sean brings a completed document for interactive review | Light |

**Classification rules:**
- Multiple types → classify by the **heaviest** type. A revision needing new research is
  Type C, not D — the revision is the deliverable, research serves it.
- If you can't tell → ask Sean. Don't guess. Wrong classification wastes more time than
  a 15-second question.
- Ambiguous scope → default **lighter** and note it. Sean escalates if needed.
- **Type F signal:** If the source material is a completed document that Sean wants to
  review (not raw context to research), this is Type F regardless of whether the output
  is new. The distinguishing question: is the engine researching, or transforming? If
  Sean says "here's a design doc" or "turn this into an interactive walkthrough" or
  brings a file from another project for review — that's Type F.

**Present the classification:**

```
**Classification**

Type: [A/B/C/D/E/F] — [Name]
Basis: [1-2 sentences — what in the intake led to this]
Output: [which output this touches, or "engine" if Type E]
Scope signal: [light / medium / heavy]

Correct?
```

**GATE: Do not proceed until Sean confirms.**

---

## Step 2: Build the Run Plan (write to disk)

Once classification is confirmed, create the run plan artifact on disk.

**Path convention:**
- Output work: `outputs/[output-name]/run-plans/[YYYY-MM-DD]-[short-name].md`
- Engine work: `engine/run-plans/[YYYY-MM-DD]-[short-name].md`

Create the directory if it doesn't exist.

The run plan has a fixed structure. Fill in what you know now. The rest gets appended as
each phase completes.

```markdown
# Run Plan — [Short Name]

**Type:** [A/B/C/D/E] — [Name]
**Date:** [YYYY-MM-DD]
**Output:** [output path or "engine"]
**Status:** PLANNING (updated as phases complete)

## Layer 0: Raw Intake

[Paste or summarize what Sean provided. iMessage dumps, notes, links, verbal context.
Don't interpret — capture. This is the source material everything else builds on.]

## Layer 1: Classification + Context

**Type:** [confirmed type]
**Basis:** [classification reasoning]
**Current state:** [what does the output/engine look like right now — read from CONTEXT.md]
**Staleness check:** [days since last session on this topic — flag if >5]

## Layer 2: Skill Chain + Depth

[Built from the type-specific chains below. This is the execution plan.]

### Depth Assessment
[Run the 30-second classification from engine/methodology/depth-assessment.md]
[For each topic area in scope: scan or deep-dive, with the triggering question noted]

### Ordered Skill Chain
[The specific sequence of skills that will fire, with what each produces]
[See type-specific chains below — copy the right one and annotate with specifics]

### Gates
[Which transitions require operator approval before proceeding]

### Anti-Pattern Lint Points
[Which transitions get an automatic anti-pattern-check — typically every 2-3 steps]

## Layer 3: Research Findings
[APPENDED DURING EXECUTION — starts empty]
[Each research sweep appends its findings here using findings-pattern structures]

## Layer 4: Design + Plan
[APPENDED DURING EXECUTION — starts empty]
[Design decisions, architecture, approach — appended after research completes]

## Layer 5: Execution Log
[APPENDED DURING EXECUTION — starts empty]
[What was done, in order, with timestamps and skill invocations logged]

## Not-Scope
[What we are explicitly NOT doing. Never empty.]

## Deliverables
[Specific files with paths that will exist when this is done.]
```

### Type-Specific Skill Chains

These are the default chains. The run plan can adjust them based on context, but
deviations must be noted and justified.

**Type A — New Output from Scratch**

```
1. pipeline-start (this run plan) ✓
2. depth-assessment → classify scan/deep-dive per topic area
3. superpowers:brainstorming → explore intent, operator profile, scope
   ├── Read: engine/intake/intake-process.md
   ├── Read: engine/intake/operator-profile-template.md
   └── Output: operator profile + scoped questions → append to Layer 0
4. *** OPERATOR APPROVAL GATE — scope confirmed ***
5. Dual-source research (Context7 + Bright Data)
   ├── Read: engine/methodology/dual-source-intelligence.md
   ├── Read: engine/methodology/credibility-tiers.md
   ├── findings-pattern → structure each finding
   ├── anti-pattern-check → lint after research sweep
   └── Output: structured findings → append to Layer 3
6. *** SOFT GATE — findings review (Sean reviews if he wants, or says "proceed") ***
7. superpowers:writing-plans → DESIGN DOC (architecture, decisions, approach)
   ├── Read: engine/methodology/three-tier-hardening.md (if security-relevant)
   └── Output: design decisions → append to Layer 4
8. *** OPERATOR APPROVAL GATE — design approved ***
9. superpowers:writing-plans → IMPLEMENTATION PLAN (task-by-task execution spec)
   └── Output: task list → append to Layer 4
10. *** OPERATOR APPROVAL GATE — plan approved ***
11. superpowers:subagent-driven-development OR superpowers:executing-plans
    ├── section-construction Phase A → plan sections (if output >500 lines)
    ├── section-construction Phase C → build sections
    ├── anti-pattern-check → lint periodically during build
    ├── render-validate → after interactive HTML construction
    └── Output: execution log → append to Layer 5
12. self-test → before declaring complete
13. Git commit + push
14. Deploy check (if applicable)
```

**Type B — Extend Existing Output**

```
1. pipeline-start (this run plan) ✓
2. depth-assessment → classify new content areas
3. Read existing output's CONTEXT.md, relevant sections, style conventions
4. superpowers:writing-plans → COMBINED BRIEF + IMPLEMENTATION PLAN
   └── Output: extension plan → append to Layer 4
5. *** OPERATOR APPROVAL GATE — plan approved ***
6. Dual-source research (if new research needed)
   ├── findings-pattern → structure findings
   └── Output: findings → append to Layer 3
7. superpowers:executing-plans
   ├── section-construction → if new section >500 lines
   ├── render-validate → if extending interactive HTML
   ├── anti-pattern-check → lint at natural pause points
   └── Output: execution log → append to Layer 5
8. self-test → before declaring complete
9. Git commit + push
```

**Type C — Revise Existing Output**

```
1. pipeline-start (this run plan) ✓
2. depth-assessment → classify revision areas
3. anti-pattern-check → run against existing content being revised FIRST
4. Read existing output's CONTEXT.md, affected sections, cross-references
5. superpowers:writing-plans → COMBINED BRIEF + IMPLEMENTATION PLAN
   └── Output: revision plan → append to Layer 4
6. *** OPERATOR APPROVAL GATE — plan approved ***
7. Dual-source research (if revision triggers new research)
   ├── findings-pattern → structure findings
   └── Output: findings → append to Layer 3
8. superpowers:executing-plans
   ├── render-validate → if revising interactive HTML
   ├── anti-pattern-check → lint after revision
   └── Output: execution log → append to Layer 5
9. self-test → before declaring complete
10. Git commit + push
11. Deploy check (if applicable — verify revision didn't break live output)
```

**Type D — Research-Only**

```
1. pipeline-start (this run plan) ✓
2. depth-assessment → scan or deep-dive per question
3. superpowers:writing-plans → RESEARCH PLAN (questions, sources, approach)
   ├── Read: engine/methodology/dual-source-intelligence.md
   └── Output: research plan → append to Layer 4
4. *** OPERATOR APPROVAL GATE — research plan approved ***
5. Dual-source research (Context7 + Bright Data)
   ├── findings-pattern → structure each finding
   ├── anti-pattern-check → lint after each sweep
   └── Output: findings → append to Layer 3
6. Synthesis
   ├── findings-pattern → structure synthesis
   └── Output: synthesis → append to Layer 4
7. self-test → before declaring complete
8. Git commit + push
```

**Type E — Engine Update**

```
1. pipeline-start (this run plan) ✓
2. depth-assessment → typically scan unless touching security or core methodology
3. CHANGE BRIEF (inline in the run plan — no separate planning doc)
   ├── What's changing and why
   ├── Files affected
   ├── Backward compatibility check
   └── Output: change brief → append to Layer 4
4. *** OPERATOR APPROVAL GATE — change approved ***
5. Direct execution
   ├── anti-pattern-check → if changing patterns or methodology
   └── Output: execution log → append to Layer 5
6. self-test → if updating methodology or skills
7. Git commit + push
```

**Type F — Review Artifact**

```
1. pipeline-start (this run plan) ✓
2. Read source document(s) fully — do not start building mid-read
3. review-artifact skill → structural analysis + section planning + build
   ├── Read: engine/templates/walkthrough-style-guide.md
   ├── Read: engine/templates/diagram-color-reference.md
   ├── Read: outputs/job-search-engine-design/ (reference implementation)
   └── Output: single-file interactive HTML
4. render-validate → visual QA (V1-V6 if applicable)
5. Create/update OUTPUT.md for the output
6. Git commit
```

---

## Step 3: Present the Run Plan for Approval

After writing the run plan to disk, present a summary to Sean:

```
**Run Plan Written** → [path to file]

**Type:** [type]
**Scope:** [1 sentence]
**Skill chain:** [numbered list of major steps]
**Gates:** [which steps require your approval]
**Depth:** [scan/deep-dive per topic area]
**Not-scope:** [1-2 lines]
**Deliverables:** [what files will exist when done]

Approve to begin execution?
```

**GATE: Do not proceed until Sean approves.**

---

## Step 4: Execute with Forced Skill Invocation

Once approved, execute the run plan step by step. The rules:

### Forcing Function Rules

1. **Every skill in the chain gets invoked.** Not referenced, not "kept in mind" — actually
   loaded and executed. If the chain says `depth-assessment`, you read
   `engine/skills/depth-assessment/SKILL.md` and run it. If it says `findings-pattern`,
   you read `engine/skills/findings-pattern/SKILL.md` and structure findings accordingly.

2. **Anti-pattern-check runs automatically at every lint point.** Read
   `engine/skills/anti-pattern-check/SKILL.md` and run the spot-check. This is a lint
   pass — it takes 2 minutes. If it catches something, log it and fix it unless it's
   severe enough to halt and consult Sean.

3. **Self-test runs before any "done" declaration.** Read
   `engine/skills/self-test/SKILL.md` and run the relevant binary tests. NO answer
   means fix it before proceeding.

4. **Gates are non-negotiable.** Work does not proceed past a gate without Sean's explicit
   approval. Not silence. Not implied consent. Not "I think Sean would want..."

5. **Every skill invocation gets logged.** Append to Layer 5 of the run plan:
   ```
   [timestamp] Invoked: [skill-name] — [what it produced or found]
   ```

6. **The run plan is updated at every transition.** After each step completes, update the
   run plan on disk: mark the step done, append outputs to the appropriate layer. If
   context compacts, the run plan on disk is the recovery point.

7. **Skipping a chain step requires justification.** If a step doesn't apply (e.g.,
   render-validate for a non-HTML output), note why in the execution log. The chain is
   a minimum, not a maximum — you can always add skills. You cannot silently skip them.

### Disk Persistence for Compaction Resilience

The run plan lives on disk at a predictable path. This is the entire reason it works
across compaction boundaries. If context compacts mid-execution:

1. Session-restart reads CONTEXT.md (knows which output is active)
2. Check for run plan at the conventional path
3. Read the run plan — it shows what's been done (Layers 0-5 populated) and what's next
4. Pick up from the last completed step

**This means:** always update the run plan on disk BEFORE telling Sean something is done.
The disk artifact is the source of truth, not your context window.

### Context File Updates

- Update the output's `CONTEXT.md` at gate passages (major state changes)
- Update the activity log at each skill invocation
- Update the intelligence log when research surfaces insights
- **Do these inline, not batched at session end.** If context compacts between a finding
  and logging it, the finding is lost.

### Git Discipline

- Commit at every gate passage
- Commit after the run plan is fully populated (Layers 0-2)
- Commit at completion
- Push when Sean says to, or at session end
- Commit messages reference the run plan: `"[output-name] step N: description"`

---

## Reclassification

Sometimes work changes shape mid-execution. Research-only discovers something demanding
a revision. An extension grows into something needing its own design doc.

If the type changes:
1. Stop current execution
2. Log the reclassification in the run plan's execution log with the reason
3. Re-run Step 1 with the new context
4. Generate a new run plan (Step 2) — the old plan is archived, not amended
5. Get fresh operator approval (Step 3)

This prevents scope creep that nobody notices until the output is incoherent.

---

## DNA Calibration Reminder

Before presenting the run plan, gut-check:

- **DNA #1 — Research Before Agreeing:** Does the plan make claims that aren't evidence-backed?
  If the intake says "Jeff wants X" — have you verified X is achievable before planning it?
- **DNA #5 — Transferable Over Tool-Specific:** Does the plan distinguish what transfers
  from what's tool-specific?
- **DNA #10 — Agent vs. Automation:** Is an LLM agent the right tool for every step? Could
  any part be a script, template fill-in, or manual checklist instead?

These aren't boxes to check — they're the lens the run plan should be written through.
