# Type F: Review Artifact — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new output classification (Type F — Review Artifact) to the engine that transforms dense markdown documents from other projects into interactive HTML walkthroughs for Sean's review. Also: add OUTPUT.md identity files to all outputs, and rewrite session-restart to be output-aware.

**Architecture:** Type F is a lightweight classification in `pipeline-start` that routes to a new `review-artifact` skill. The skill reads a source document, classifies its sections by content type, and builds a single-file interactive HTML using the engine's existing style system. OUTPUT.md files give every output an identity that session-restart can discover and route to.

**Tech Stack:** Markdown skill files, existing CSS/JS style system from walkthrough-style-guide.md, Rough.js (CDN) for diagrams.

**Design Doc:** Brainstormed in conversation — no separate design doc (this plan IS the design).

**Reference Implementation:** `outputs/job-search-engine-design/` — the Type F output we just built.

---

## Task Overview

| Task | What | Files |
|------|------|-------|
| 1 | Create the `review-artifact` skill | New: `engine/skills/review-artifact/SKILL.md` |
| 2 | Add Type F to `pipeline-start` | Edit: `engine/skills/pipeline-start/SKILL.md` |
| 3 | Add Type F to `CLAUDE.md` | Edit: `CLAUDE.md` (3 locations) |
| 4 | Rewrite `session-restart` to be output-aware | Edit: `engine/skills/session-restart/SKILL.md` |
| 5 | Create OUTPUT.md for job-search-engine-design | New: `outputs/job-search-engine-design/OUTPUT.md` |
| 6 | Create retroactive OUTPUT.md for openclaw-sean | New: `outputs/openclaw-sean/OUTPUT.md` |
| 7 | Create retroactive OUTPUT.md for openclaw-jeff | New: `outputs/openclaw-jeff/OUTPUT.md` |
| 8 | Update CONTEXT.md | Edit: `CONTEXT.md` |

---

### Task 1: Create the `review-artifact` Skill

**Files:**
- Create: `engine/skills/review-artifact/SKILL.md`

**Step 1: Write the skill file**

Create `engine/skills/review-artifact/SKILL.md`:

```markdown
---
name: review-artifact
description: >
  Transforms dense markdown documents (design docs, implementation plans, architecture specs)
  into interactive single-file HTML walkthroughs for Sean's review. This is the execution
  skill for Type F (Review Artifact) classifications. Use when Sean brings a completed
  document from another project and wants to engage with it visually — navigating sections,
  expanding details, understanding architecture through diagrams rather than scrolling
  through raw markdown. The source material IS the input — no research, no synthesis, no
  operator profile. The engine transforms and presents.
  Reference implementation: outputs/job-search-engine-design/
---

# Review Artifact — Document-to-Interactive-HTML Skill

## When This Fires

Sean brings a completed document from another project (typically from a
`superpowers:brainstorm` → `superpowers:write-plans` workflow) and wants an interactive
HTML version for review. The pipeline-start skill classifies this as Type F and invokes
this skill.

## What This Skill Does NOT Do

- Research. The source document is the source of truth.
- Synthesize. The engine is not evaluating the document's claims.
- Build operator profiles. Sean already knows what this is.
- Deliver to another person. This is for Sean's review.

## Prerequisites

Before building, read these files for the engine's visual design system:

```
Read: engine/templates/walkthrough-style-guide.md
Read: engine/templates/diagram-color-reference.md
```

These define the complete CSS custom property system, color palette, dark mode values,
callout types, typography scale, and diagram semantic categories. Do not improvise styles.
Use the existing design system.

## Reference Implementation

Read the actual output to understand what "good" looks like:

```
Read: outputs/job-search-engine-design/docs/walkthrough/interactive/job-search-engine-design.html
```

This is the first Type F output. It demonstrates every content type pattern, the navigation
structure, the diagram approach, and the update sync workflow.

## The Process

### Step 1: Read the ENTIRE Source Document

Read the full document before doing anything else. Do not start building after reading
the first few sections. Design documents have sections that inform each other — architecture
constrains build sequence, principles change behavior descriptions, decisions affect
multiple sections. You need the complete picture before planning the HTML structure.

### Step 2: Structural Analysis

Classify each section of the source document by content type. Use this mapping to determine
which interactive pattern to apply:

| Content Type | Signals | Interactive Pattern |
|---|---|---|
| Identity / overview | "What This Is", summary, purpose, key distinctions | Hero text + distinction card grid (2-3 cards) |
| Architecture / system boundaries | Directory trees, component diagrams, "what lives where" | Rough.js diagram + collapsible directory trees (`<details>`) |
| Multi-phase methodology | Numbered phases, pipeline stages, sequential process | Interactive stepper (clickable phase pills + Rough.js pipeline diagram + swappable detail panels) |
| Lifecycle / progression | Stages that expand over time, triggers, state transitions | Stage cards with trigger annotations and visual connectors |
| Capability / skill mappings | Skill tables, capability inventories, feature matrices | Tables with expandable detail rows via `<details>` |
| Behavioral rules | Principles, behaviors, operating rules, numbered guidelines | Card grid (2-column, each card has title + description) |
| Decision tracking | Deferred decisions, key decisions, tradeoff tables | Tables + expandable rationale. Callout for the governing design principle. |
| Task lists / execution plans | Implementation tasks, build steps, acceptance criteria | Phase-grouped expandable task blocks (`<details>`) with acceptance criteria |
| Design considerations | Tradeoffs, prerequisites, constraints, risks | Expandable detail blocks with appropriate callout type (warning, info, design) |

**Fallback:** If a section doesn't clearly map to any content type, present it as prose
with expandable detail blocks following the section's natural heading hierarchy. Never
skip content because it doesn't fit a pattern.

### Step 3: Section Planning

- Map source doc sections to HTML sections.
- Determine sidebar navigation groupings — these should be conceptual clusters, not
  necessarily matching the source document's heading order.
- Identify which sections need Rough.js diagrams. Typical candidates: architecture
  boundaries, multi-phase pipelines, system relationships, lifecycle progressions.
- Every section gets a visual anchor — a diagram, card grid, table, or callout. Never
  produce a section that is just reformatted prose.

### Step 4: Build the Interactive HTML

**Output constraint: Single self-contained HTML file.**
- All CSS inline in `<style>` using the engine's CSS custom property system
- All JS inline in `<script>` — vanilla JS only, no frameworks
- External dependencies only via CDN: Rough.js (`https://cdn.jsdelivr.net/npm/roughjs@4.5.2/bundled/rough.min.js`), optionally Mermaid for sequence/flow diagrams
- The file must work when opened directly from Finder — no build step, no server

**Required interactive features:**
- Fixed sidebar navigation with scroll-spy (IntersectionObserver)
- Dark mode toggle with full CSS custom property swap
- Keyboard navigation (arrow keys between sections)
- Mobile responsive (sidebar collapses to hamburger)
- Expandable `<details>` blocks for progressive disclosure
- Rough.js diagrams that re-render on theme change and window resize

**Build from the reference implementation's patterns**, not from scratch. The
job-search-engine-design output has proven implementations of every interactive
feature listed above.

### Step 5: Render-Validate

Open the HTML in a browser. Verify:
- All diagrams render in both light and dark mode
- Sidebar navigation highlights correctly on scroll
- All expandable sections open/close
- Mobile view works (resize browser)
- No console errors
- Content completeness — every section of the source doc is represented

If the engine's `render-validate` skill is available, invoke it for the full V1-V6
visual test suite.

## Handling Updates

When Sean returns with changes to the source document:

1. Re-read the source document
2. Sean will describe what changed (or bring a prompt from the source agent)
3. Apply the changes to the existing HTML — edit in place, don't rebuild from scratch
4. Re-verify affected diagrams and sections

When Sean brings an additional source document (e.g., implementation plan after design doc):

1. Read the new document fully
2. Add it as a new section in the existing HTML, following the same content type analysis
3. Add a nav item in the sidebar
4. Update the output's OUTPUT.md with the new source document

## Output Location

Type F outputs go in `outputs/[descriptive-name]/docs/walkthrough/interactive/[name].html`

The output directory also gets an `OUTPUT.md` identity file (see session-restart skill
for the format).
```

**Step 2: Verify the skill reads correctly**

Read back the file and confirm it's complete, no truncation.

**Step 3: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add engine/skills/review-artifact/SKILL.md
git commit -m "engine: add review-artifact skill for Type F outputs"
```

**Acceptance:** The skill file exists, covers the full process (prerequisites → structural analysis → planning → build → validate → updates), includes the content type mapping table, cites the reference implementation, and explicitly states the single-file constraint and style system prerequisites.

---

### Task 2: Add Type F to `pipeline-start`

**Files:**
- Modify: `engine/skills/pipeline-start/SKILL.md:81-97` (classification table and rules)
- Modify: `engine/skills/pipeline-start/SKILL.md` (add Type F skill chain after existing Type E chain)

**Step 1: Add Type F to the classification table**

In `engine/skills/pipeline-start/SKILL.md`, find the classification table (line ~84-90) and add Type F:

Change the line before the table:
```
Read the intake context (whatever Sean has provided) and classify into one of five types.
```
To:
```
Read the intake context (whatever Sean has provided) and classify into one of six types.
```

Add row to table:
```
| **F** | Review artifact | Sean brings a completed document for interactive review | Light |
```

**Step 2: Add classification rule for Type F**

After the existing classification rules (line ~92-97), add:

```markdown
- **Type F signal:** If the source material is a completed document that Sean wants to
  review (not raw context to research), this is Type F regardless of whether the output
  is new. The distinguishing question: is the engine researching, or transforming? If
  Sean says "here's a design doc" or "turn this into an interactive walkthrough" or
  brings a file from another project for review — that's Type F.
```

**Step 3: Update the classification presentation template**

Change:
```
Type: [A/B/C/D/E] — [Name]
```
To:
```
Type: [A/B/C/D/E/F] — [Name]
```

**Step 4: Add Type F skill chain**

After the Type E skill chain block (around line 305), add:

```markdown
**Type F — Review Artifact**

` ` `
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
` ` `
```

(Note: backticks above are escaped for plan readability — use actual triple backticks in the file.)

**Step 5: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add engine/skills/pipeline-start/SKILL.md
git commit -m "engine: add Type F (Review Artifact) classification to pipeline-start"
```

**Acceptance:** `pipeline-start` now has 6 classification types. Type F has its own skill chain. Classification rules include the Type F signal. A new session encountering a design doc for review would classify it as Type F.

---

### Task 3: Add Type F to `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md:83` (pipeline description text)
- Modify: `CLAUDE.md:85-91` (pipeline stage table)
- Modify: `CLAUDE.md:95-134` (engine structure tree)
- Modify: `CLAUDE.md:237-244` (engine pipeline skills table)

**Step 1: Update the pipeline description**

Change line 83:
```
The engine runs five stages to produce each output.
```
To:
```
The engine runs five stages to produce each output. Type F (Review Artifact) outputs skip Research and Synthesis — the source document IS the input.
```

**Step 2: Add Type F row to pipeline stage table**

After the Delivery row (line 91), add:
```
| **Transform (Type F only)** | Turn a completed document into interactive HTML | Read source doc, classify sections, build single-file HTML with engine style system |
```

**Step 3: Add `review-artifact` to engine structure tree**

In the skills list (line 125-132), add `review-artifact/` to the skills directory:

```
│   └── skills/                 # Engine-level skills
│       ├── session-restart/
│       ├── depth-assessment/
│       ├── self-test/
│       ├── findings-pattern/
│       ├── anti-pattern-check/
│       ├── section-construction/
│       ├── render-validate/
│       └── review-artifact/
```

**Step 4: Update the outputs line in the structure tree**

Change line 133-134:
```
└── outputs/                    # Each person's tailored deliverable
    └── openclaw-sean/          # Output #1 — reference implementation
```
To:
```
└── outputs/                    # Each person's tailored deliverable
    ├── openclaw-sean/          # Output #1 — reference implementation (Type A)
    ├── openclaw-jeff/          # Output #2 — Type A
    └── job-search-engine-design/  # Output #3 — reference implementation (Type F)
```

**Step 5: Add `review-artifact` to engine pipeline skills table**

In the Engine Pipeline Skills table (line 237-244), add:
```
| `review-artifact` | Transforming a completed document into interactive HTML for review (Type F) | Output Generation |
```

**Step 6: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add CLAUDE.md
git commit -m "engine: add Type F (Review Artifact) to CLAUDE.md constitution"
```

**Acceptance:** CLAUDE.md references Type F in the pipeline, engine structure, and skill tables. A new Claude session reading CLAUDE.md understands that Type F exists and when to use it.

---

### Task 4: Rewrite `session-restart` to Be Output-Aware

**Files:**
- Modify: `engine/skills/session-restart/SKILL.md` (full rewrite)

**Step 1: Rewrite the skill**

Replace the entire content of `engine/skills/session-restart/SKILL.md` with a new version that:

1. **Reads root CONTEXT.md first** (engine-level state — what outputs exist)
2. **Discovers outputs** by scanning `outputs/*/OUTPUT.md` files
3. **Routes based on Sean's message** — if he mentions a specific output, go there. If not, list available outputs and ask.
4. **Reads the OUTPUT.md** for the selected output — gets type, source docs, status, deliverables, last sync dates
5. **Routes by type:**
   - Type A/B/C: Load output's CONTEXT.md, activity log tail, check staleness. Present session brief with phase/status.
   - Type F: Check if source documents have been modified since last sync. Present brief with source doc status + deliverable status.
   - Type D: Load research state.
   - Type E: Load engine-level state.
6. **Presents a session brief** — type-appropriate, focused, not a book report
7. **Asks for direction**

The new skill should:
- Remove all hardcoded `outputs/openclaw-sean/` paths
- Remove the OpenClaw-specific walkthrough progress table from the template
- Keep the operator calibration reminders (they're universal)
- Keep the context window efficiency guidance
- Reference OUTPUT.md as the per-output identity file

**Key detail for Type F resumption:** When resuming a Type F output, the skill checks each source document's modification date against the last sync date in OUTPUT.md. If a source has been modified, flag it: "Source doc [name] has been modified since last sync on [date]. Want to review changes?"

**Step 2: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add engine/skills/session-restart/SKILL.md
git commit -m "engine: rewrite session-restart to be output-aware via OUTPUT.md"
```

**Acceptance:** The skill works for any output, not just openclaw-sean. It discovers outputs by scanning OUTPUT.md files. It routes differently for Type A vs Type F. It checks source doc freshness for Type F.

---

### Task 5: Create OUTPUT.md for job-search-engine-design

**Files:**
- Create: `outputs/job-search-engine-design/OUTPUT.md`

**Step 1: Write the file**

```markdown
# Output — Job Search Engine Design Review

**Type:** F — Review Artifact
**Created:** 2026-03-18
**Status:** Active
**For:** Sean Currie (self — design review before build)

## Source Documents

| Name | Path | Last Synced |
|------|------|-------------|
| Design Doc | /Users/seancurrie/Desktop/SalesEnablementEngine/projects/job-search-engine/plans/2026-03-17-job-search-engine-design.md | 2026-03-18 |
| Implementation Plan | /Users/seancurrie/Desktop/SalesEnablementEngine/projects/job-search-engine/plans/2026-03-18-job-search-engine-implementation.md | 2026-03-18 |

## Deliverables

- `docs/walkthrough/interactive/job-search-engine-design.html`

## Sync History

- 2026-03-18: Initial build from design doc (9 sections)
- 2026-03-18: Synced 3 design doc changes (runtime isolation, skills architecture rewrite, phase 1B/3 connected pipeline)
- 2026-03-18: 4 minor fixes (manifest entry format, early location table, patterns comment, priority tier labels)
- 2026-03-18: Integrated implementation plan (22 tasks across 5 phases)

## What to Read to Resume

1. This file (type, sources, sync state)
2. Check each source document — modified since last sync?
3. The HTML deliverable at docs/walkthrough/interactive/
```

**Step 2: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add outputs/job-search-engine-design/OUTPUT.md
git commit -m "output: add OUTPUT.md identity file for job-search-engine-design (Type F)"
```

**Acceptance:** OUTPUT.md exists with correct type, both source documents listed with sync dates, and resume instructions.

---

### Task 6: Create Retroactive OUTPUT.md for openclaw-sean

**Files:**
- Create: `outputs/openclaw-sean/OUTPUT.md`

**Step 1: Write the file**

```markdown
# Output — OpenClaw Deployment (Sean)

**Type:** A — New Output from Scratch
**Created:** 2026-02-10
**Status:** Complete
**For:** Sean Currie (own Mac Mini deployment)

## Source

Intake from Sean's own context — Tech With Tim video, professional goals, Mac Mini hardware.
Full research pipeline: 130+ sources, dual-source intelligence.

## Deliverables

- `docs/walkthrough/` — Interactive HTML walkthrough (3,030 lines)
- `research/` — Knowledge base (7 buckets) + 5 reports
- `operator/` — Operator profile, session state, project genesis

## What to Read to Resume

1. This file (type, status)
2. `operator/session-state.md` (current phase and progress)
3. `CONTEXT.md` (output-level state)
```

**Step 2: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add outputs/openclaw-sean/OUTPUT.md
git commit -m "output: add retroactive OUTPUT.md for openclaw-sean (Type A)"
```

**Acceptance:** OUTPUT.md exists with correct type and status.

---

### Task 7: Create Retroactive OUTPUT.md for openclaw-jeff

**Files:**
- Create: `outputs/openclaw-jeff/OUTPUT.md`

**Step 1: Write the file**

```markdown
# Output — OpenClaw Deployment (Jeff)

**Type:** A — New Output from Scratch
**Created:** 2026-03-03
**Status:** Complete (Section 2b iteration done, Sections 3-5 MacBook Air refs deferred)
**For:** Jeff (Denver real estate, via Sean as operator)

## Source

Intake from Sean about Jeff — iMessage context, Sean's observations.
Full research pipeline: 80+ sources, dual-source intelligence.

## Deliverables

- `docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` — Interactive HTML (2,810 lines, 6 diagrams)
- `research/` — Knowledge base + sources
- `operator/jeff-profile.md` — Operator profile

## What to Read to Resume

1. This file (type, status)
2. `CONTEXT.md` (output-level state — note Section 2b iteration and deferred MacBook Air refs)
3. `activity-log.md` (last 10 entries)
```

**Step 2: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add outputs/openclaw-jeff/OUTPUT.md
git commit -m "output: add retroactive OUTPUT.md for openclaw-jeff (Type A)"
```

**Acceptance:** OUTPUT.md exists with correct type, status reflects the Section 2b iteration and deferred work.

---

### Task 8: Update CONTEXT.md

**Files:**
- Modify: `CONTEXT.md`

**Step 1: Update Outputs Produced table**

Add Output #3:
```
| 3 | Job Search Engine Design Review | Sean Currie | JSE design doc + implementation plan | Active (Type F review artifact) | outputs/job-search-engine-design/ |
```

**Step 2: Update engine skills list**

Add `review-artifact` to the skills list in Engine Structure.

**Step 3: Add Engine Evolution entry**

Add to Engine Evolution Notes:
```
- 2026-03-18: Type F (Review Artifact) classification added — new output type for transforming completed documents into interactive HTML for Sean's review
  Origin: Job Search Engine design doc review proved the workflow: source doc → interactive HTML → review loop → feedback to source agent → sync updates
  Additions: Type F in pipeline-start, review-artifact skill, OUTPUT.md identity files for all outputs, session-restart rewritten to be output-aware
  Reference implementation: outputs/job-search-engine-design/ (design doc + implementation plan → interactive HTML)
```

**Step 4: Update What's Next**

Add:
```
- Type F workflow validated with Output #3 (Job Search Engine Design Review)
- OUTPUT.md pattern established — all outputs now have identity files
- session-restart rewritten to discover and route to any output by type
```

**Step 5: Update Last Updated date**

Change to `2026-03-18`.

**Step 6: Commit**

```bash
cd /Users/seancurrie/Desktop/on-demand-curriculum
git add CONTEXT.md
git commit -m "state: update CONTEXT.md for Type F addition and Output #3"
```

**Acceptance:** CONTEXT.md reflects the new output, new skill, and engine evolution. Last updated date is current.

---

## Execution Summary

| Task | What | Effort |
|------|------|--------|
| 1 | review-artifact skill | M (largest — the skill encoding) |
| 2 | pipeline-start Type F | S |
| 3 | CLAUDE.md updates | S |
| 4 | session-restart rewrite | M (full rewrite, but clear scope) |
| 5 | OUTPUT.md (job-search-engine-design) | S |
| 6 | OUTPUT.md (openclaw-sean) | S |
| 7 | OUTPUT.md (openclaw-jeff) | S |
| 8 | CONTEXT.md update | S |

**Total: 8 tasks.** Tasks 5-7 are parallelizable (independent OUTPUT.md files). Tasks 1-3 are the core engine changes. Task 4 is the session-restart rewrite. Task 8 is bookkeeping.

**Critical path:** Task 1 (skill) → Task 2 (pipeline-start) → Task 3 (CLAUDE.md) → Task 4 (session-restart). Everything else can run in parallel or after.
