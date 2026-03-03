# On-Demand Curriculum Engine — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the ClawdBot Research Project repo into a three-layer engine (DNA + Engine + Outputs) that can produce tailored interactive walkthroughs for different people on different topics, with OpenClaw as Output #1.

**Architecture:** Three layers — root-level DNA (CLAUDE.md constitution, editorial principles), `engine/` (reusable methodology, templates, intake process, patterns), `outputs/` (per-person deliverables starting with `openclaw-sean/`). The restructure preserves every file and all git history. Design document at `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md`.

**Tech Stack:** Markdown, HTML/CSS/JS (interactive walkthrough), Git, GitHub Pages (future delivery), Claude Code with subagent-driven development.

---

## Phase 1: Systematic Audit (Tasks 1-3)

> **CHECKPOINT:** Sean reviews the complete audit manifest before Phase 2 begins. No files move until the audit is approved.

### Task 1: Full File Inventory

**Goal:** Produce a complete inventory of every file in the repo with its line count, purpose, and current location.

**Files:**
- Create: `docs/plans/audit/file-inventory.md`

**Step 1: Generate file inventory**

Run:
```bash
find /Users/seancurrie/Desktop/clawdbot-research-project -type f \
  -not -path '*/.git/*' \
  -not -path '*/.DS_Store' \
  -not -name '.gitkeep' \
  -not -name '.gitignore' \
  | sort
```

**Step 2: For each file, record line count and one-line purpose**

Read every file. Record in `docs/plans/audit/file-inventory.md` using this format:

```markdown
# File Inventory — On-Demand Curriculum Engine Restructure

**Generated:** [date]
**Total files:** [count]

| # | Current Path | Lines | Purpose | Classification | Disposition |
|---|-------------|-------|---------|---------------|-------------|
| 1 | CLAUDE.md | 230 | Project constitution | HYBRID | Split: DNA to root, output-specific to outputs/ |
| 2 | CONTEXT.md | 188 | Project state map | HYBRID | Split: engine state to root, output state to outputs/ |
| ... | ... | ... | ... | ... | ... |
```

Classification values: `ENGINE`, `OUTPUT`, `DNA`, `HYBRID`
Disposition values: `move-as-is`, `split-and-move`, `extract-template`, `create-new`, `leave-in-place`

**Step 3: Verify completeness**

Run: Count files in inventory vs files on disk. They must match.

**Step 4: Commit**

```bash
git add docs/plans/audit/file-inventory.md
git commit -m "audit: complete file inventory with classification and disposition"
```

---

### Task 2: Section-Level Classification of Hybrid Files

**Goal:** For every file classified as HYBRID in Task 1, document exactly which sections are ENGINE, OUTPUT, or DNA — and what goes where.

**Files:**
- Create: `docs/plans/audit/hybrid-file-splits.md`

**Step 1: Identify all HYBRID files from Task 1 inventory**

Expected HYBRID files (based on brainstorming audit, but verify — don't assume):
- `CLAUDE.md` — mix of engine methodology + OpenClaw-specific content + DNA rules
- `CONTEXT.md` — mix of engine state + OpenClaw-specific findings
- `CONTEXT-HISTORY.md` — contains engine-level milestones + output-specific history
- `operator/project-genesis.md` — mix of DNA (Sean's motivations) + output-specific goals
- `knowledge-base/07-operations/research-cadence.md` — mix of engine methodology + OpenClaw-specific queries
- Any other files Task 1 flags as HYBRID

**Step 2: For each HYBRID file, read it completely and document the split**

Format:
```markdown
## [filename]

### Sections that are ENGINE (move to engine/)
- Lines X-Y: [section name] — [why it's engine]

### Sections that are OUTPUT (move to outputs/openclaw-sean/)
- Lines X-Y: [section name] — [why it's output-specific]

### Sections that are DNA (stays at root or engine constitution)
- Lines X-Y: [section name] — [why it's DNA]

### Split Strategy
[How to split this file. Does it become two files? Three? Does a template get extracted?]
```

**Step 3: Verify every line of every HYBRID file is accounted for**

No orphaned sections. Every line has a destination.

**Step 4: Commit**

```bash
git add docs/plans/audit/hybrid-file-splits.md
git commit -m "audit: section-level classification of all hybrid files"
```

---

### Task 3: Audit Manifest — Final Review Document

**Goal:** Produce the single document that Sean reviews before any restructuring begins. Combines Tasks 1-2 into a clear action plan.

**Files:**
- Create: `docs/plans/audit/audit-manifest.md`

**Step 1: Compile the manifest**

Structure:
```markdown
# Audit Manifest — On-Demand Curriculum Engine Restructure

**Date:** [date]
**Total files audited:** [count]
**Classification breakdown:**
- ENGINE: [count] files (move to engine/)
- OUTPUT: [count] files (move to outputs/openclaw-sean/)
- DNA: [count] files (stay at root or engine constitution)
- HYBRID: [count] files (split per hybrid-file-splits.md)

## New Files to Create
| File | Purpose | Source Material |
|------|---------|----------------|
| engine/methodology/dual-source-intelligence.md | Extracted from CLAUDE.md + research-cadence.md | [line refs] |
| engine/intake/intake-process.md | NEW — describes intake pipeline | Design doc Section 5 |
| engine/intake/operator-profile-template.md | NEW — template for capturing operator context | Based on operator/sean-currie-profile.md |
| ... | ... | ... |

## Files Moving As-Is
| Current Path | New Path | Notes |
|-------------|----------|-------|
| patterns/001-*.md | engine/patterns/001-*.md | Cross-output pattern |
| operator/sean-currie-profile.md | outputs/openclaw-sean/operator/sean-currie-profile.md | Output-specific |
| ... | ... | ... |

## Files Being Split
| Current Path | Split Into | Details |
|-------------|-----------|---------|
| CLAUDE.md | Root CLAUDE.md (engine constitution) + outputs/openclaw-sean/CLAUDE.md (output-specific) | See hybrid-file-splits.md |
| ... | ... | ... |

## Templates to Extract
| Source File | Template Path | What Gets Parameterized |
|-------------|--------------|------------------------|
| docs/walkthrough/interactive/src/style-guide.md | engine/templates/walkthrough-style-guide.md | Tool-specific examples |
| knowledge-base/ structure | engine/templates/project-structure/ | Bucket contents |
| ... | ... | ... |

## Verification Checklist
- [ ] Every file in inventory has a disposition
- [ ] Every HYBRID file has section-level split documented
- [ ] No file is listed in two destinations (except templates extracted FROM source files)
- [ ] All new files have source material identified
- [ ] The manifest is internally consistent (no contradictions)
```

**Step 2: Self-verify the manifest**

Check: does every file from Task 1 appear exactly once in the manifest (in "Moving As-Is", "Being Split", or "Templates to Extract")? Are all new files listed?

**Step 3: Commit**

```bash
git add docs/plans/audit/audit-manifest.md
git commit -m "audit: complete manifest ready for review"
```

**Step 4: Present to Sean for review**

> **CHECKPOINT:** Sean reviews the audit manifest. Discussion and adjustments happen here. No files move until Sean approves.

---

## Phase 2: Engine Extraction (Tasks 4-8)

> **CHECKPOINT:** Sean reviews the engine layer before Phase 3 begins. Engine must be coherent and complete before outputs move.

### Task 4: Create Engine Directory Structure

**Goal:** Scaffold the `engine/` directory tree and populate with empty placeholders so subsequent tasks have destinations.

**Files:**
- Create: `engine/methodology/.gitkeep`
- Create: `engine/intake/.gitkeep`
- Create: `engine/templates/project-structure/.gitkeep`
- Create: `engine/templates/report-templates/.gitkeep`
- Create: `engine/templates/interactive-html/.gitkeep`
- Create: `engine/patterns/.gitkeep`
- Create: `engine/skills/.gitkeep`
- Create: `outputs/.gitkeep`

**Step 1: Create directories**

```bash
mkdir -p engine/methodology engine/intake engine/templates/project-structure \
  engine/templates/report-templates engine/templates/interactive-html \
  engine/patterns engine/skills outputs
```

**Step 2: Add .gitkeep files**

```bash
find engine/ outputs/ -type d -empty -exec touch {}/.gitkeep \;
```

**Step 3: Commit**

```bash
git add engine/ outputs/
git commit -m "scaffold: engine and outputs directory structure"
```

---

### Task 5: Extract Methodology Documents

**Goal:** Extract reusable research methodology from current files into standalone engine documents.

**Files:**
- Create: `engine/methodology/dual-source-intelligence.md`
- Create: `engine/methodology/credibility-tiers.md`
- Create: `engine/methodology/three-tier-hardening.md`
- Create: `engine/methodology/research-cadence-template.md`
- Create: `engine/methodology/editorial-standards.md`
- Read: `CLAUDE.md` (source for methodology sections)
- Read: `knowledge-base/07-operations/research-cadence.md` (source for cadence)
- Read: `docs/walkthrough/2026-02-11-v1-initial-deployment.md` (source for three-tier hardening)
- Read: `operator/purpose-refinement-2026-02-22.md` (source for editorial standards)

**Step 1: Extract dual-source-intelligence.md**

Read CLAUDE.md "Research Methodology — Dual-Source Intelligence" section (lines 68-109). Extract to standalone document. Add:
- Introductory context (what this methodology is, why it exists)
- The three operating modes with examples
- Tool-specific instructions (how to use Context7, how to use Bright Data)
- Cross-validation discipline (how contradictions become insights)
- Reference to credibility tiers (link to credibility-tiers.md)

Do NOT include OpenClaw-specific queries. Use generic examples or reference Output #1 as "see outputs/openclaw-sean/ for a worked example."

**Step 2: Extract credibility-tiers.md**

Read CLAUDE.md credibility tier table. Extract to standalone document. Add:
- Why tiers matter (evidence-based decision making)
- How to assign tiers to new sources
- Examples from Output #1 showing how tiers were applied in practice
- When to upgrade/downgrade a source's tier

**Step 3: Extract three-tier-hardening.md**

Read walkthrough intro and CLAUDE.md "Deployment Posture" section. Extract the three-tier framework as a standalone, tool-agnostic document:
- Essential hardening: what it is, why it's non-negotiable, generic examples
- Educational hardening: what it is, why the "Understanding" sections matter
- Operational polish: what it is, why it's deferrable
- How to classify steps into tiers for any new tool

**Step 4: Extract research-cadence-template.md**

Read `knowledge-base/07-operations/research-cadence.md`. Create a genericized version:
- Keep: weekly/biweekly/monthly/trigger-based structure
- Keep: staleness thresholds framework
- Keep: decision tree for where findings go
- Keep: anti-patterns section
- Remove: OpenClaw-specific queries, URLs, version numbers
- Add: placeholders for tool-specific queries

**Step 5: Create editorial-standards.md**

Read `operator/purpose-refinement-2026-02-22.md` and CLAUDE.md non-negotiable rules. Synthesize into a document that defines the quality bar for all outputs:
- Evidence requirement (every claim needs a source and tier)
- Honest assessment (never oversell, always note residual risk)
- Transferable framing (always distinguish what's universal vs tool-specific)
- Community validation (docs alone are insufficient)
- Security as a lens (not a separate phase)
- Living documentation (mark outdated, never delete)

**Step 6: Verify each document**

For each extracted document, check:
- Does it make sense standalone? (Someone unfamiliar with OpenClaw can understand it)
- Is it tool-agnostic? (No OpenClaw-specific content unless marked as "example from Output #1")
- Does it capture the full methodology? (Nothing lost from the source)

**Step 7: Commit**

```bash
git add engine/methodology/
git commit -m "engine: extract reusable methodology documents"
```

---

### Task 6: Create Intake Process and Operator Profile Template

**Goal:** Document how new outputs start — the intake pipeline and operator profile structure.

**Files:**
- Create: `engine/intake/intake-process.md`
- Create: `engine/intake/operator-profile-template.md`
- Read: `operator/sean-currie-profile.md` (reference for operator profile structure)
- Read: `operator/project-genesis.md` (reference for how goals were captured)
- Read: Design doc Section 5 (pipeline description)

**Step 1: Write intake-process.md**

Document the full intake pipeline:

```markdown
# Intake Process — On-Demand Curriculum Engine

## How a New Output Starts

### Input
Sean provides whatever he has about the person and their situation:
- Raw conversation (iMessage, email, verbal notes)
- His own observations and context about the person
- Links to what they're interested in
- His assessment of their skill level and misconceptions

### Brainstorming Phase
The engine brainstorms WITH SEAN (not the end user). Sean is the proxy.

Questions the engine asks Sean:
1. Who is this person? (name, background, tech level)
2. What do they want? (stated goal)
3. What do they actually need? (may differ from stated goal)
4. What hardware do they have or plan to get?
5. What's their current knowledge? (what they know, think they know, don't know)
6. What misconceptions need addressing?
7. What's their risk tolerance?
8. What's their professional context? (why this matters to them)
9. What does Sean know about them that they didn't say?

### Output
- Completed operator profile (saved to output directory)
- Scoped research brief (what topics to research, what reports to produce)
- Identified misconceptions to address in the walkthrough
- Hardware/platform decision (if not already made)

### Principles
- The engine talks to Sean, not the end user
- Push back on the person's assumptions via Sean
- Don't over-gather — work with what you have, flag gaps
- Start research as soon as enough context exists
```

**Step 2: Write operator-profile-template.md**

Base on `operator/sean-currie-profile.md` structure but genericize:

```markdown
# Operator Profile — [Name]

## Who They Are
- Name:
- Relationship to Sean:
- Professional role:
- Technical background:
  - Comfortable with: [command line / GUI only / specific tools]
  - Has used: [ChatGPT / Claude / other AI tools]
  - Can do: [follow terminal commands / write code / configure servers]

## What They Want
- Stated goal: [what they said they want]
- Underlying need: [what they actually need, may differ]
- Misconceptions identified: [what they think is true that isn't]

## Their Setup
- Hardware: [what they have or plan to buy]
- OS: [macOS / Linux / Windows]
- Network: [home network / VPN / cloud]
- Budget: [hardware budget, monthly service budget]
- Existing tools: [what they already use]

## Their Context
- Why this matters to them: [professional / personal / curiosity]
- Time availability: [how much time they can invest]
- Risk tolerance: [experimenting / needs it working / production use]
- Support model: [Sean helps them / self-service / somewhere between]

## What the Walkthrough Needs to Address
- Knowledge gaps: [concepts they need explained]
- Misconceptions to correct: [gently, with evidence]
- Hardware recommendations: [if their plan needs adjusting]
- Scope right-sizing: [is their goal realistic? too ambitious? too narrow?]

## Notes from Sean
[Sean's freeform observations about this person that don't fit above]
```

**Step 3: Verify against Output #1**

Check: does Sean's profile (`operator/sean-currie-profile.md`) fit this template? If the template can't capture what Sean's profile captures, it's missing something.

**Step 4: Commit**

```bash
git add engine/intake/
git commit -m "engine: create intake process and operator profile template"
```

---

### Task 7: Create Output Structure Templates

**Goal:** Create the scaffolding templates that new outputs are built from — KB bucket structure, log templates, report frameworks, session state.

**Files:**
- Create: `engine/templates/project-structure/README.md` (describes the scaffold)
- Create: `engine/templates/report-templates/README.md` (describes the 5-report framework)
- Create: `engine/templates/project-structure/CONTEXT-template.md`
- Create: `engine/templates/project-structure/session-state-template.md`
- Create: `engine/templates/project-structure/activity-log-template.md`
- Create: `engine/templates/project-structure/intelligence-log-template.md`
- Read: Current CONTEXT.md, session-state.md, activity-log.md, intelligence-log.md (as references)
- Read: Current research reports (as reference for report templates)

**Step 1: Create project structure README**

Document what the scaffold creates for each new output:
```
outputs/[name]/
├── operator/
│   └── [name]-profile.md          # From operator-profile-template
├── knowledge-base/
│   ├── 01-landscape/
│   ├── 02-architecture/
│   ├── 03-security/
│   ├── 04-deployment/
│   ├── 05-skills-and-integrations/ # Or adapted bucket name for topic
│   ├── 06-community-intelligence/
│   └── 07-operations/
├── research/
│   ├── sources.md
│   ├── reports/
│   └── scrapes/
├── docs/
│   └── walkthrough/
│       ├── interactive/
│       └── crib-sheet.md
├── CONTEXT.md
├── activity-log.md
├── intelligence-log.md
└── session-state.md
```

Note: bucket names may adapt per topic. Bucket 05 might be "plugins-and-extensions" or "integrations" depending on the tool. The 7-bucket structure is a framework, not a rigid requirement.

**Step 2: Create CONTEXT template**

Genericize current CONTEXT.md into a template with placeholders:
- `[TOOL_NAME]` for the tool being evaluated
- `[OPERATOR_NAME]` for the person
- `[HARDWARE]` for their setup
- Sections: Purpose, Current Status, Key Decisions, Open Questions, Known Gaps, How to Use

**Step 3: Create session-state template**

Use the template from `skills/session-restart/SKILL.md` (it already has a generic template at lines 118-167).

**Step 4: Create activity-log and intelligence-log templates**

Simple — header + format description + empty table. Reference the decision tree from research-cadence.md for "where does this finding go?"

**Step 5: Create report templates README**

Document the 5-report framework:
1. Landscape Report — competitive positioning, feature matrix, category clarity
2. Architecture Report — technical internals, data flow, configuration
3. Feasibility Report — platform/hardware evaluation, community validation
4. Security Report — threat model, CVEs, hardening path, residual risk
5. Open Questions — research gaps, deployment blockers, resolve-during-deployment items

For each, document: when to produce it, what sections it should have, what questions it answers, minimum source count.

**Step 6: Commit**

```bash
git add engine/templates/
git commit -m "engine: create output structure and report framework templates"
```

---

### Task 8: Move Patterns and Adapt Walkthrough Templates

**Goal:** Move cross-output patterns to engine level. Prepare walkthrough style guide and interactive HTML framework as engine templates.

**Files:**
- Move: `patterns/*.md` → `engine/patterns/*.md`
- Create: `engine/templates/walkthrough-style-guide.md` (genericized from current style guide)
- Create: `engine/templates/interactive-html/README.md` (describes the HTML framework)
- Read: `docs/walkthrough/interactive/src/style-guide.md` (source for template)
- Read: `docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (reference for HTML framework)

**Step 1: Move patterns**

```bash
git mv patterns/ engine/patterns/
```

Verify all 5 pattern files moved:
- 001-zero-clawhub-supply-chain-defense.md
- 002-per-agent-routing-over-elevated-mode.md
- 003-reader-agent-prompt-injection-defense.md
- 004-webhook-n8n-integration.md
- 005-local-gguf-embeddings.md

**Step 2: Create genericized walkthrough style guide**

Read the current style guide (1,037 lines). Create a template version in `engine/templates/`:
- Keep: color palette, typography, spacing, responsive breakpoints, accessibility
- Keep: component specifications (code blocks, expandables, checkboxes, nav, callouts, tables)
- Keep: curriculum design principles (3-4 concepts per section, visual-to-text ratio, section type differentiation)
- Keep: diagram style rules (Rough.js config, node styles, connector styles, color mapping)
- Genericize: phase-specific diagram specs become "example diagrams from Output #1"
- Genericize: OpenClaw-specific callout examples become generic examples
- Add: guidance on adapting the style guide for different topics

**Step 3: Create interactive HTML README**

Document the HTML framework structure:
- What the HTML shell provides (sidebar nav, expandable system, code blocks, checkboxes, theme toggle)
- How content gets inserted (phases → sections → steps)
- What's parameterizable (phase names, content, diagram definitions)
- What stays fixed (CSS framework, JS interactions, accessibility features)
- Reference to the full style guide for visual specifications
- Note: the actual HTML template extraction is a future task — for now, Output #1's HTML serves as the reference implementation

**Step 4: Commit**

```bash
git add engine/patterns/ engine/templates/
git commit -m "engine: move patterns to engine level, create walkthrough templates"
```

> **CHECKPOINT:** Sean reviews the engine layer. Is the methodology captured correctly? Does the intake process make sense? Are the templates useful? Adjust before Phase 3.

---

## Phase 3: Output Relocation (Tasks 9-12)

> **CHECKPOINT:** Sean reviews the relocated output before Phase 4 begins. Output must be self-contained and navigable.

### Task 9: Create Output #1 Directory and Move Operator Files

**Goal:** Begin relocating OpenClaw-specific content to `outputs/openclaw-sean/`.

**Files:**
- Create: `outputs/openclaw-sean/` directory structure
- Move: `operator/` → `outputs/openclaw-sean/operator/`
- Note: `operator/sean-currie-profile.md`, `operator/project-genesis.md`, `operator/purpose-refinement-2026-02-22.md`, `operator/source-transcript-techwith-tim.md`, `operator/session-state.md`

**Step 1: Create output directory structure**

```bash
mkdir -p outputs/openclaw-sean/operator
mkdir -p outputs/openclaw-sean/knowledge-base
mkdir -p outputs/openclaw-sean/research
mkdir -p outputs/openclaw-sean/docs
```

**Step 2: Move operator files**

```bash
git mv operator/sean-currie-profile.md outputs/openclaw-sean/operator/
git mv operator/project-genesis.md outputs/openclaw-sean/operator/
git mv operator/purpose-refinement-2026-02-22.md outputs/openclaw-sean/operator/
git mv operator/source-transcript-techwith-tim.md outputs/openclaw-sean/operator/
git mv operator/session-state.md outputs/openclaw-sean/operator/
```

**Step 3: Verify moves**

```bash
ls outputs/openclaw-sean/operator/
# Should show all 5 files
ls operator/
# Should be empty (or not exist)
```

**Step 4: Commit**

```bash
git add -A
git commit -m "relocate: operator files to outputs/openclaw-sean/"
```

---

### Task 10: Move Knowledge Base, Research, and Docs

**Goal:** Move all OpenClaw-specific research and documentation to the output directory.

**Files:**
- Move: `knowledge-base/` → `outputs/openclaw-sean/knowledge-base/`
- Move: `research/` → `outputs/openclaw-sean/research/`
- Move: `docs/walkthrough/` → `outputs/openclaw-sean/docs/walkthrough/`
- Move: `docs/plans/2026-02-10-clawdbot-research-project-design.md` → `outputs/openclaw-sean/docs/plans/`
- Move: `docs/plans/2026-02-10-implementation-plan.md` → `outputs/openclaw-sean/docs/plans/`
- Move: `docs/plans/2026-02-11-*` → `outputs/openclaw-sean/docs/plans/`
- Move: `docs/plans/2026-02-14-*` → `outputs/openclaw-sean/docs/plans/`
- Keep at root: `docs/plans/2026-03-03-*` (engine-level plans)

**Step 1: Move knowledge base**

```bash
git mv knowledge-base/ outputs/openclaw-sean/knowledge-base/
```

**Step 2: Move research**

```bash
git mv research/ outputs/openclaw-sean/research/
```

**Step 3: Move walkthrough docs**

```bash
mkdir -p outputs/openclaw-sean/docs
git mv docs/walkthrough/ outputs/openclaw-sean/docs/walkthrough/
```

**Step 4: Move output-specific plan docs**

```bash
mkdir -p outputs/openclaw-sean/docs/plans
git mv docs/plans/2026-02-10-clawdbot-research-project-design.md outputs/openclaw-sean/docs/plans/
git mv docs/plans/2026-02-10-implementation-plan.md outputs/openclaw-sean/docs/plans/
git mv docs/plans/2026-02-11-deployment-walkthrough-design.md outputs/openclaw-sean/docs/plans/
git mv docs/plans/2026-02-11-deployment-walkthrough-implementation.md outputs/openclaw-sean/docs/plans/
git mv docs/plans/2026-02-14-phase0-implementation-plan.md outputs/openclaw-sean/docs/plans/
git mv docs/plans/2026-02-14-phase0-machine-prep-design.md outputs/openclaw-sean/docs/plans/
```

**Step 5: Verify**

```bash
find outputs/openclaw-sean/ -type f | wc -l
# Should match count of moved files
ls docs/plans/
# Should only show 2026-03-03-* files and audit/
```

**Step 6: Commit**

```bash
git add -A
git commit -m "relocate: knowledge base, research, and docs to outputs/openclaw-sean/"
```

---

### Task 11: Move Logs and Context Files

**Goal:** Move output-specific logs and state files to the output directory.

**Files:**
- Move: `activity-log.md` → `outputs/openclaw-sean/activity-log.md`
- Move: `intelligence-log.md` → `outputs/openclaw-sean/intelligence-log.md`
- Move: `CONTEXT-HISTORY.md` → `outputs/openclaw-sean/CONTEXT-HISTORY.md`
- Handle: `CONTEXT.md` — HYBRID, needs splitting (see Task 2 audit)
- Handle: `CLAUDE.md` — HYBRID, handled in Phase 4
- Move: `skills/session-restart/` → `engine/skills/session-restart/`

**Step 1: Move straightforward files**

```bash
git mv activity-log.md outputs/openclaw-sean/
git mv intelligence-log.md outputs/openclaw-sean/
git mv CONTEXT-HISTORY.md outputs/openclaw-sean/
```

**Step 2: Split CONTEXT.md**

Read current CONTEXT.md. Create two files:

1. `outputs/openclaw-sean/CONTEXT.md` — contains all OpenClaw-specific content:
   - Current Status (deployment state, version targets)
   - Staleness Sweep Results (CVEs, governance, ecosystem changes)
   - What This Project Produced (KB contents, reports, walkthrough)
   - Key Verdicts, Key Decisions, Open Questions
   - Experimental Use Cases
   - Known Gaps
   - How to Use This Output
   - Infrastructure details

2. Root `CONTEXT.md` (engine-level) — contains:
   - Engine purpose and current state
   - List of outputs produced
   - Engine evolution notes
   - Link to design doc

**Step 3: Move session-restart skill to engine**

```bash
git mv skills/ engine/skills/
```

Update the skill's internal references if it points to `operator/session-state.md` — that path is now `outputs/openclaw-sean/operator/session-state.md`. Note: the skill itself may need adaptation for engine-level vs output-level usage. Flag this for Phase 5 verification.

**Step 4: Verify**

```bash
ls outputs/openclaw-sean/
# Should show: operator/ knowledge-base/ research/ docs/ activity-log.md intelligence-log.md CONTEXT.md CONTEXT-HISTORY.md
```

**Step 5: Commit**

```bash
git add -A
git commit -m "relocate: logs, context, and session-restart skill"
```

---

### Task 12: Verify Output Self-Containment

**Goal:** Verify that `outputs/openclaw-sean/` is self-contained and navigable.

**Files:**
- Read: Every file in `outputs/openclaw-sean/`

**Step 1: Check all internal references**

Read every markdown file in `outputs/openclaw-sean/`. Check every internal link and file reference:
- Do referenced files exist at the referenced path (relative to output root)?
- If a reference points outside the output directory (e.g., to `engine/`), is that appropriate?
- Flag any broken references.

**Step 2: Fix broken references**

Update any file paths that broke during the move. Common fixes:
- `knowledge-base/` references in CONTEXT.md (now relative within the output)
- `operator/` references in various files
- `research/` references in reports and CONTEXT.md
- `patterns/` references — these now point to `engine/patterns/`, which is correct (cross-output)
- `docs/walkthrough/` references

**Step 3: Verify the interactive HTML still works**

```bash
open outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html
```

Check: does it load? Do diagrams render? Do expandables work? (The HTML is self-contained so it should work regardless of its directory location.)

**Step 4: Create output-level README or verify CONTEXT.md serves this purpose**

Someone should be able to `cd outputs/openclaw-sean/` and understand:
- What this output is (OpenClaw deployment walkthrough for Sean)
- How to navigate it (start with CONTEXT.md)
- Where the walkthrough is (docs/walkthrough/)
- Where the interactive version is (docs/walkthrough/interactive/)

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "verify: output self-containment, fix broken references"
```

> **CHECKPOINT:** Sean reviews the relocated output. Is everything there? Can he navigate it? Does the walkthrough still work?

---

## Phase 4: Engine Constitution (Tasks 13-14)

### Task 13: Write Engine CLAUDE.md

**Goal:** Rewrite the root CLAUDE.md as the engine constitution — governing how outputs are produced, not describing a single output.

**Files:**
- Rewrite: `CLAUDE.md` (root level)
- Read: Current `CLAUDE.md` (for DNA extraction)
- Read: `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md` (design reference)
- Read: `engine/methodology/editorial-standards.md` (for DNA principles)

**Step 1: Draft the engine constitution**

The new CLAUDE.md should include:

1. **Identity & Purpose** — This is the On-Demand Curriculum Engine. It produces tailored, research-backed interactive walkthroughs for people learning to deploy technical tools. Sean is the operator. OpenClaw was Output #1.

2. **DNA — Non-Negotiable Principles** — Extracted from current CLAUDE.md rules + purpose refinement. These govern ALL outputs:
   - Research before agreeing
   - Push back with evidence
   - Security as a lens
   - Transferable over tool-specific
   - Living documentation
   - Honest assessment of residual risk
   - Community validation required

3. **The Pipeline** — Reference to design doc Section 5. Intake → Research → Synthesis → Output Generation → Delivery.

4. **Engine Structure** — Where things live: `engine/` for methodology and templates, `outputs/` for deliverables, root for constitution and engine state.

5. **Research Methodology** — Reference to `engine/methodology/` docs. Dual-source intelligence, credibility tiers, staleness management.

6. **Output Quality Bar** — Reference to `engine/methodology/editorial-standards.md`. What makes a good output.

7. **Session Protocol** — Adapted from current session protocol. Read engine CONTEXT.md first, then output-specific CONTEXT.md if working on a specific output.

8. **Skill Chain** — Same superpowers chain, adapted for engine context.

9. **Operator Context** — Reference to `engine/intake/` for how new operators are profiled.

**Step 2: Verify DNA completeness**

Compare new CLAUDE.md against current one. Every non-negotiable rule and DNA principle should be present. OpenClaw-specific content should NOT be present (it's in the output's files now).

**Step 3: Verify engine references**

Every path referenced in the new CLAUDE.md should exist in the repo.

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "constitution: rewrite CLAUDE.md as engine constitution"
```

---

### Task 14: Write Engine CONTEXT.md

**Goal:** Create the engine-level CONTEXT.md that tracks engine state and output inventory.

**Files:**
- Rewrite: `CONTEXT.md` (root level — already partially created in Task 11)

**Step 1: Write engine CONTEXT.md**

```markdown
# CONTEXT.md — On-Demand Curriculum Engine

**Last Updated:** [date]
**Staleness Threshold:** 5 days

## Engine Purpose

[1-2 paragraphs describing the engine, referencing design doc]

## Outputs Produced

| # | Output | Person | Topic | Status | Location |
|---|--------|--------|-------|--------|----------|
| 1 | OpenClaw Deployment | Sean Currie | OpenClaw agent platform | Complete (walkthrough ready, deployment pending) | outputs/openclaw-sean/ |

## Engine Structure

- `engine/methodology/` — Research methodology, credibility tiers, hardening framework
- `engine/intake/` — Intake process, operator profile template
- `engine/templates/` — Output scaffolding, report frameworks, walkthrough style guide
- `engine/patterns/` — Cross-output reusable patterns
- `engine/skills/` — Engine-level skills (session-restart)
- `outputs/` — Per-person deliverables

## Engine Evolution Notes

- [date]: Engine created from restructure of ClawdBot Research Project
- Output #1 (OpenClaw/Sean) serves as reference implementation

## Key Decisions

- Engine talks to Sean, not end users (Sean is proxy for all intake)
- Outputs are self-contained (navigable without engine knowledge)
- Three-layer architecture: DNA (root) + Engine (process) + Outputs (content)
- Patterns are cross-output (engine level), findings are per-output

## What's Next

- Test the engine by producing Output #2 (candidate: Jeff, OpenClaw, MacBook Air)
- Evaluate GitHub Pages hosting for output delivery
- Consider whether the intake process needs refinement after first test
```

**Step 2: Commit**

```bash
git add CONTEXT.md
git commit -m "context: engine-level state and output inventory"
```

---

## Phase 5: Verification (Tasks 15-17)

### Task 15: Full File Accounting

**Goal:** Verify every file from the original project is accounted for in the new structure.

**Files:**
- Read: `docs/plans/audit/file-inventory.md` (Task 1 output)
- Run: File comparison between inventory and current state

**Step 1: Generate current file list**

```bash
find . -type f -not -path '*/.git/*' -not -name '.DS_Store' -not -name '.gitkeep' | sort > /tmp/current-files.txt
```

**Step 2: Compare against inventory**

For every file in the Task 1 inventory, verify it exists somewhere in the new structure (either at its original path or at its new path per the audit manifest).

**Step 3: Check for orphaned files**

Are there any files in the current structure that AREN'T in the inventory? (Could be files created during the restructure — that's fine, but document them.)

**Step 4: Produce accounting report**

```markdown
# File Accounting Report

**Date:** [date]
**Original file count:** [from inventory]
**Current file count:** [from disk]
**New files created during restructure:** [count]
**Files moved:** [count]
**Files split:** [count]
**Files deleted:** 0 (must be zero)

## Discrepancies
[Any files not accounted for, with resolution]
```

**Step 5: Commit**

```bash
git add docs/plans/audit/
git commit -m "verify: complete file accounting — all files accounted for"
```

---

### Task 16: Reference Integrity Check

**Goal:** Verify all internal references (links, file paths, cross-references) resolve correctly across the entire repo.

**Step 1: Scan all markdown files for file references**

Search every `.md` file for patterns like:
- `](path/to/file)` (markdown links)
- backtick-quoted file paths
- `Read:` or `See:` references
- `knowledge-base/`, `research/`, `operator/`, `docs/` path references

**Step 2: Verify each reference resolves**

For each reference found, check if the target file exists at the referenced path (relative to the file containing the reference).

**Step 3: Fix any broken references**

Update paths that broke during restructure. Common issues:
- Output files referencing engine files (should use relative paths up to engine/)
- Engine files referencing output files (should reference as "see outputs/openclaw-sean/..." examples)
- CLAUDE.md referencing old paths

**Step 4: Commit fixes**

```bash
git add -A
git commit -m "verify: fix all broken cross-references"
```

---

### Task 17: Verification Report and Final Review

**Goal:** Produce the final verification report confirming the restructure is complete and correct.

**Files:**
- Create: `docs/plans/audit/verification-report.md`

**Step 1: Write verification report**

```markdown
# Verification Report — On-Demand Curriculum Engine Restructure

**Date:** [date]
**Design doc:** docs/plans/2026-03-03-on-demand-curriculum-engine-design.md
**Implementation plan:** docs/plans/2026-03-03-on-demand-curriculum-engine-implementation.md

## Success Criteria Assessment

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Every file accounted for | [PASS/FAIL] | File accounting report |
| outputs/openclaw-sean/ is self-contained | [PASS/FAIL] | [how verified] |
| engine/ contains all reusable methodology | [PASS/FAIL] | [files present] |
| Root CLAUDE.md is engine constitution | [PASS/FAIL] | [verified tool-agnostic] |
| New session can understand how to produce output | [PASS/FAIL] | [tested by reading engine docs] |
| Interactive walkthrough still works | [PASS/FAIL] | [opened and tested] |
| Git history shows moves, not deletions | [PASS/FAIL] | git log verification |
| All cross-references resolve | [PASS/FAIL] | Reference integrity check |

## Restructure Statistics

- Files moved: [count]
- Files created: [count]
- Files split: [count]
- Files deleted: 0
- Total commits in restructure: [count]

## Known Issues / Future Work

- [Any issues discovered during verification]
- [Adaptations needed for session-restart skill]
- [Anything flagged for future improvement]

## Recommendation

[READY / NOT READY] for producing Output #2.
```

**Step 2: Commit**

```bash
git add docs/plans/audit/verification-report.md
git commit -m "verify: restructure verification report — complete"
```

**Step 3: Push to GitHub**

```bash
git push
```

**Step 4: Present to Sean**

> **FINAL CHECKPOINT:** Sean reviews the verification report. Engine is ready for its first real test — producing a new output.

---

## Execution Notes

### Subagent Strategy

This plan is designed for subagent-driven development:

- **Tasks 1-3 (Audit)** can run as parallel agents — each reading different file sets
- **Tasks 4-8 (Engine Extraction)** are sequential — each builds on the previous
- **Tasks 9-12 (Output Relocation)** can be partially parallelized — but Task 12 (verification) depends on 9-11 completing
- **Tasks 13-14 (Constitution)** are sequential
- **Tasks 15-17 (Verification)** can run partially in parallel — 15 and 16 are independent, 17 depends on both

### Review Checkpoints

4 mandatory checkpoints where Sean reviews before proceeding:
1. After Task 3 (Audit Manifest) — before any files move
2. After Task 8 (Engine Extraction) — before output relocation
3. After Task 12 (Output Self-Containment) — before constitution rewrite
4. After Task 17 (Verification Report) — final approval

### Risk Mitigation

- Every task commits before the next begins — rollback is always possible
- `git mv` preserves history — no file is "deleted and recreated"
- The audit manifest (Task 3) is the single source of truth for what goes where
- If any verification fails in Phase 5, we fix it before declaring complete
