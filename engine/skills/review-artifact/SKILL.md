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

**1. Run plan must exist.** Before executing this skill, verify that `pipeline-start` has
been invoked and a run plan exists on disk at `outputs/[name]/run-plans/`. If no run plan
exists, STOP and invoke `pipeline-start` first. Pipeline-start classifies the work as
Type F, builds the run plan, and gets Sean's approval. This skill does not self-authorize.

**2. Read the engine's visual design system** before building:

```
Read: engine/templates/walkthrough-style-guide.md
Read: engine/templates/diagram-color-reference.md
```

These define the complete CSS custom property system, color palette, dark mode values,
callout types, typography scale, and diagram semantic categories. Do not improvise styles.
Use the existing design system.

Pay specific attention to:
- **CSS reset awareness:** The style guide specifies a global reset that strips `padding`
  from all elements. List elements (`ul`, `ol`) need `padding-left: 24px` restored.
- **Whitespace preservation:** Directory trees and preformatted content need explicit
  `white-space: pre`. Do not rely on browser defaults.
- **Inline code in tables:** Add `white-space: nowrap` to `td code` to prevent file
  paths from breaking mid-word.

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

### Step 4.5: Content Completeness Check

Before opening the browser, verify that every section from the source document is
represented in the HTML. This step catches the most common Type F failure: silently
skipping subsections because they didn't map cleanly to an interactive pattern.

**Process:**
1. List every H2 and H3 heading from each source document
2. For each heading, confirm it has a corresponding HTML section, expandable block,
   card, table row, or other representation
3. If a heading is missing, either:
   - Add it using the appropriate content type pattern from Step 2's mapping table
   - Use the fallback pattern (prose with expandable detail blocks)
   - **Never skip it silently.** If you deliberately omit something, note it in the
     execution log with the reason.

**Why this step exists:** The job-search-engine-design output skipped 3 subsections
from "Context for Implementation Planning" (source material inputs, research findings,
antipatterns) without explanation. The review-artifact skill says "Never skip content
because it doesn't fit a pattern" but had no enforcement mechanism. This step is the
enforcement.

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

The output directory also gets an `OUTPUT.md` identity file using this template:

```markdown
---
name: [Descriptive Name]
type: F (Review Artifact)
source_documents:
  - [absolute path to source doc 1]
  - [absolute path to source doc 2]
created: [YYYY-MM-DD]
last_synced: [YYYY-MM-DD]
status: Active
---

# [Name] — Review Artifact

**Type F output:** [1-sentence description of what's being reviewed]

## Source Documents

1. **[Doc 1 name]** ([date]) — [brief description]
2. **[Doc 2 name]** ([date]) — [brief description]

## Deliverable

- `docs/walkthrough/interactive/[name].html` — Single-file interactive HTML

## Sync History

| Date | What Changed | Source |
|------|-------------|--------|
| [YYYY-MM-DD] | Initial build | Both source documents |

## Resuming This Output

To resume work on this output in a new session:
1. Check if source documents have been modified since `last_synced`
2. If modified, re-read the changed sections and update the HTML in place
3. If unchanged, the HTML is current — no action needed
4. Sean will bring specific update instructions or a new source document
```

After creating OUTPUT.md, update the root `CONTEXT.md` Outputs Produced table to register
the new output. Then commit changes to git. Both of these are required — they were missed
in the first Type F run.

## Anti-Patterns (Learned from Output #3)

These failure modes were discovered during the first Type F execution. Check for them.

### AP-1: Horizontal Scroll for Card Sequences

**Wrong:** Using `display: flex` with `overflow-x: auto` for a sequence of 5+ cards.
The cards overflow the container and users see only the first 2-3 with no obvious scroll
indicator.

**Right:** Use `display: grid` with `grid-template-columns: repeat(3, 1fr)` (or
`repeat(2, 1fr)` on mobile). All cards visible. For sequences where order matters,
use numbered labels (00, 01, 02...) instead of relying on left-to-right position.

### AP-2: Compressed Directory Entries

**Wrong:** Putting multiple subdirectories on a single line to save vertical space:
`├── resumes/  ├── cover-letters/  ├── outreach/`

**Right:** One entry per line with proper tree characters. Directory trees are reference
material — they need to be scannable, not compact. Every entry gets its own line.

### AP-3: Missing Whitespace Preservation

**Wrong:** Using a `<div>` for preformatted content (directory trees, code templates)
without `white-space: pre`. The content renders as a single wrapped paragraph.

**Right:** Any content that depends on line breaks and indentation for meaning needs
`white-space: pre` (or use a `<pre>` tag). Always verify in the browser — this is
invisible in the source code and only shows up on render.

### AP-4: CSS Reset Without Restore

**Wrong:** Applying `* { margin: 0; padding: 0; }` without restoring `padding-left`
on `<ul>` and `<ol>`. List markers clip or disappear.

**Right:** Immediately after the reset, restore: `ul, ol { padding-left: 24px; }`
The style guide documents this, but it's easy to forget when writing the actual HTML.
