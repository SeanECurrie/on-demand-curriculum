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
structure, the diagram approach, and the update sync workflow. If it doesn't exist yet,
rely on the process steps below and the style system from the prerequisites.

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
