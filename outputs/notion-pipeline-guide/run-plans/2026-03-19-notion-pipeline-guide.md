# Run Plan — Notion Pipeline Guide

**Type:** F — Review Artifact
**Date:** 2026-03-19
**Output:** outputs/notion-pipeline-guide/
**Status:** EXECUTING

## Layer 0: Raw Intake

Sean provided: `/Users/seancurrie/Desktop/JobSearchEngine/integrations/notion/NOTION-GUIDE.md`
257-line operational guide documenting the Notion pipeline visualization layer for the Job Search Engine.
Three interconnected databases (Pipeline 23 props, Contacts 10 props, Outreach 8 props), 12 views, daily/weekly workflows, one-time setup tasks, engine operations, and technical reference.

Sean's request: "use your intelligent thoughtful ability to create a purposefully structured representation of the full content of the guide and utilize all your skills and design skills and patterns and templates."

## Layer 1: Classification + Context

**Type:** F (confirmed by operator)
**Basis:** Completed operational guide from JobSearchEngine project, Sean wants interactive HTML for review. Engine transforms, not researches.
**Current state:** New output — no prior work exists.
**Staleness check:** N/A — new work.

## Layer 2: Skill Chain + Depth

### Depth Assessment
Single document, 257 lines — scan depth. But Sean's explicit request for "purposefully structured" and "all your skills and design skills" signals he wants a thoughtful, high-quality output. Treating as deep-dive for output quality, scan for process overhead.

### Ordered Skill Chain
1. pipeline-start (this run plan) ✓
2. Read source document fully ✓
3. review-artifact skill → structural analysis + section planning + build
   ├── Read: engine/templates/walkthrough-style-guide.md ✓
   ├── Read: engine/templates/diagram-color-reference.md ✓
   ├── Read: reference implementation (job-search-engine-design.html) ✓
   └── Output: single-file interactive HTML
4. Content completeness check — verify all source sections represented
5. Create OUTPUT.md for the output
6. Update root CONTEXT.md
7. Git commit
8. Deploy to GitHub Pages (gh-pages branch)

### Gates
- Classification: APPROVED ✓
- Run plan: Presenting now

### Anti-Pattern Lint Points
- After HTML build: check AP-1 (horizontal scroll), AP-2 (compressed dirs), AP-3 (whitespace), AP-4 (CSS reset)

## Layer 3: Research Findings
[N/A — Type F skips research]

## Layer 4: Design + Plan

### Structural Analysis

| Source Section | Content Type | Interactive Pattern |
|---|---|---|
| What This Is | Identity/overview | Hero text + 2 distinction cards (Filing Cabinet vs Whiteboard) |
| Pipeline DB (23 props) | Capability mapping | 6 grouped expandable property tables |
| Contacts DB (10 props) | Capability mapping | Properties table |
| Outreach DB (8 props) | Capability mapping | Properties table |
| How Databases Connect | Architecture/boundaries | Rough.js regions diagram |
| Pipeline Views (7) | Capability reference | View cards grid with type badges |
| Contacts Views (3) | Capability reference | View cards |
| Outreach Views (2) | Capability reference | View cards |
| Morning Routine | Multi-phase workflow | Numbered step cards with time badge |
| During the Day | Behavioral rules | Event→Action card grid |
| Working with Engine | Behavioral rules | Operations card grid |
| Weekly Review | Multi-phase workflow | Numbered step cards with time badge |
| One-Time Setup (6 items) | Task list | Expandable task blocks |
| Engine Operations | Capability mapping | Operations table |
| Database IDs | Reference data | Table in expandable |
| Page IDs | Reference data | Table in expandable |
| Key Design Decisions | Decision tracking | Expandable rationale cards |

### Diagrams (3 Rough.js)
1. **Database Ecosystem** — Regions pattern, three DB boxes with DUAL relation arrows
2. **Pipeline Stage Lifecycle** — Assembly line, 10 stages in two rows (active flow + terminal)
3. **Usage Cadence** — Card layout, four boxes (Morning/Day/Engine/Weekly)

### Sidebar Navigation Groups
- OVERVIEW → What This Is
- DATABASES → Pipeline, Contacts, Outreach, How They Connect
- VIEWS → Pipeline Views, Contacts Views, Outreach Views
- WORKFLOWS → Morning Routine, During the Day, With the Engine, Weekly Review
- SETUP → One-Time Setup, Engine Operations
- REFERENCE → Technical Reference, Design Decisions

## Layer 5: Execution Log
[APPENDED DURING EXECUTION]

- 2026-03-19: Run plan created, structural analysis complete
- 2026-03-19: Building interactive HTML

## Not-Scope

- Research on Notion API capabilities (source document is authoritative)
- Evaluation or critique of the pipeline design (Type F transforms, doesn't evaluate)
- Operator profile (this is for Sean's own review)

## Deliverables

- `outputs/notion-pipeline-guide/docs/walkthrough/interactive/notion-pipeline-guide.html`
- `outputs/notion-pipeline-guide/OUTPUT.md`
- Root `CONTEXT.md` updated with Output #4
