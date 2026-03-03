# Visual Output Methodology Implementation Plan

**Status:** Complete (executed 2026-03-03, verified in commit a8c8ec4)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adapt Cole Medin's visual output methodology (concept-to-pattern mapping, render-validate loop, isomorphism test) into the On-Demand Curriculum Engine — without changing rendering technologies or breaking existing architecture.

**Architecture:** Three additions layered onto existing docs: (1) visual pattern mapping added to the walkthrough style guide, (2) render-validate discipline added to section-construction methodology + a new operational skill, (3) visual output self-tests added to the binary self-tests framework. A new anti-pattern ("The Unverified Render") is added based on real Output #1 evidence. A retroactive audit of Output #1 validates that the new tests catch real problems.

**Tech Stack:** Markdown methodology docs, SKILL.md operational skills, Puppeteer MCP for browser-based verification. No new rendering libraries — Rough.js and Mermaid.js remain the diagram technologies.

**Evidence base for this plan:** Cole Medin's Excalidraw diagram skill (github.com/coleam00/excalidraw-diagram-skill) — specifically the instructional design patterns, not the Excalidraw tool itself. Output #1 post-mortem showing: hidden Phase Overview diagram, 14 broken expandable sections, missing syntax highlighting, diagram spec-to-implementation divergence, no visual verification during construction.

---

## Phase 1: Visual Pattern Mapping

### Task 1: Add Concept-to-Pattern Mapping and Diagram Design Process to Style Guide

**Context:** The walkthrough style guide (`engine/templates/walkthrough-style-guide.md`) currently specifies diagram rendering rules (Section 6) and curriculum design principles (Section 5), but has no guidance on *choosing* the right visual pattern for a concept. Output #1's Gateway Architecture diagram is a Mermaid LR flowchart — labeled boxes with arrows — when the concept (message transformation through a pipeline) calls for an Assembly Line pattern. Cole Medin's skill solves this with a concept-to-pattern mapping table and a mandatory design process before generating any diagram.

**Files:**
- Modify: `engine/templates/walkthrough-style-guide.md` (insert between current Section 5 and Section 6)

**Step 1: Read the current style guide to understand the insertion point**

```
Read: engine/templates/walkthrough-style-guide.md
```

The new sections go between Section 5 (Curriculum Design Principles, ends at line 743) and Section 6 (Diagram Style Rules, starts at line 746). The new content becomes Sections 5.5 and 5.6, preserving existing section numbering since they're subsections of Section 5.

**Step 2: Add Section 5.5 — Concept-to-Pattern Mapping**

Insert after line 743 (the end of Section 5.4's table) and before line 744 (the `---` divider before Section 6). The new section maps conceptual behaviors to visual patterns and rendering technologies.

Write this content:

```markdown
### 5.5 Concept-to-Pattern Mapping for Diagrams

Before designing any diagram, classify the concept's **behavior** — what it does, not what it is. The behavior determines the visual pattern. The pattern determines the rendering technology.

**The mapping table:**

| If the concept... | Visual Pattern | Rendering Tech | Example |
|-------------------|---------------|----------------|---------|
| Transforms input to output through stages | **Assembly Line** (before → process → after) | Rough.js (shows transformation states) | Gateway message flow: raw input → auth → agent → sandbox → response |
| Spawns multiple outputs from one source | **Fan-Out** (radial arrows from center) | Rough.js (needs spatial layout) | Agent dispatching tool calls to multiple services |
| Combines multiple inputs into one result | **Convergence** (arrows merging into single target) | Rough.js (needs spatial layout) | Multiple security layers protecting a single asset |
| Has a strict sequence of ordered steps | **Timeline** (dots on a line with labels) | Mermaid sequence diagram OR Rough.js timeline | Model routing failover chain: primary → fallback 1 → fallback 2 |
| Has hierarchy or nesting | **Tree / Nested Layers** (concentric shapes or branching lines) | Rough.js (concentric rectangles/ellipses for layers, lines for trees) | Defense in depth: network → auth → sandbox → policy → agent |
| Loops or iterates continuously | **Cycle** (arrow returning to start) | Rough.js (needs curved return arrows) | Monitoring cadence: check → alert → fix → verify → check |
| Compares two alternatives | **Side-by-Side** (parallel columns with visual contrast) | Rough.js (needs spatial layout for columns) | Before/after machine state, safe vs. dangerous skill sources |
| Shows ordered interactions between actors | **Sequence** (vertical lifelines with horizontal messages) | Mermaid sequence diagram (purpose-built for this) | User → Gateway → Router → LLM API round-trip |
| Groups related components into logical zones | **Regions** (labeled boundaries enclosing elements) | Rough.js (dashed rectangles as boundaries) | Network topology with Tailscale mesh grouping devices |
| Categorizes items into buckets | **Card Layout** (columns or grid with headers) | Rough.js OR HTML/CSS (depending on interactivity needs) | Monitoring tasks by cadence: daily / weekly / monthly |

**When no pattern fits:** If a concept doesn't map cleanly to a pattern, that's a signal the diagram may be trying to show too much. Split into two diagrams, or reconsider whether prose + a table would serve better than a diagram.

**Rendering technology decision:**
- **Rough.js** when: spatial layout matters, the diagram needs custom positioning, you need concentric/nested shapes, the hand-drawn aesthetic adds warmth to a technical topic
- **Mermaid.js** when: the concept is a strict sequence between actors (sequence diagram), a simple directed flow (flowchart), or the diagram is simple enough that auto-layout is sufficient
- **HTML/CSS** when: the element needs interactivity (toggles, inputs, state tracking) — this is a component, not a diagram

### 5.6 Diagram Design Process

Before writing any diagram code (Rough.js calls, Mermaid definitions, or HTML), complete this 4-step process. Do not skip steps.

**Step 1 — Classify the concept.** Ask: "What does this concept DO?" Not what it IS. A gateway doesn't just exist — it transforms messages. A security model doesn't just exist — it nests protective layers. The verb determines the pattern.

**Step 2 — Select the pattern.** Use the mapping table in 5.5. If the concept maps to multiple patterns, choose the one that best serves the diagram's argument — what is this diagram trying to SHOW that text alone cannot?

**Step 3 — Run the Isomorphism Test.** Before writing any code, sketch the layout mentally. Ask: "If I removed all text labels, would the visual structure alone communicate the concept?" If a gateway message flow looks identical to a security layer stack without labels, the structure is not encoding meaning — it's just boxes. Redesign until the shape IS the argument.

**Step 4 — Choose rendering tech and build.** Based on the pattern, select Rough.js, Mermaid, or HTML/CSS per the rendering technology decision guide in 5.5. Then build following the Diagram Style Rules in Section 6.

**The variety rule:** In a multi-diagram output (like a walkthrough with 8 diagrams), each major diagram should use a different visual pattern. If three diagrams are all Mermaid LR flowcharts, at least two of them are probably the wrong pattern for their concept. Check the mapping table.

**Connecting to depth assessment:** The depth classification (see `engine/methodology/depth-assessment.md`) determines diagram complexity:
- **Scan depth:** Simple diagrams — labeled shapes with connections. Patterns from the table applied straightforwardly.
- **Deep-dive depth:** Comprehensive diagrams — patterns from the table PLUS evidence artifacts (real config snippets, actual command output, specific error messages) embedded in the diagram as annotated regions. The diagram teaches, not just displays.
```

**Step 3: Verify the insertion doesn't break the document structure**

Read the file after editing. Confirm:
- Section 5.5 and 5.6 appear between the Section 5.4 table and the Section 6 `---` divider
- The `---` divider before Section 6 is preserved
- No existing content was displaced

**Step 4: Commit**

```bash
git add engine/templates/walkthrough-style-guide.md
git commit -m "style-guide: add concept-to-pattern mapping and diagram design process"
```

---

### Task 2: Extract Diagram Color Reference to Standalone File

**Context:** Cole Medin's skill uses a standalone `color-palette.md` as the single source of truth for all color decisions — read before generating any diagram. Our engine has the same information buried in Section 6.5 of a 1,003-line style guide. Extracting it into a standalone file makes it a direct lookup during diagram work, matching the pattern that works.

**Files:**
- Create: `engine/templates/diagram-color-reference.md`
- Modify: `engine/templates/walkthrough-style-guide.md` (Section 6.5, around line 814)
- Modify: `engine/templates/interactive-html/README.md` (add reference, around line 110)

**Step 1: Read the current Section 6.5 content**

```
Read: engine/templates/walkthrough-style-guide.md (lines 814-843)
```

This is the "Color Mapping for Diagram Elements" table with 7 categories, each with light/dark fill and stroke colors.

**Step 2: Create the standalone diagram color reference**

Create `engine/templates/diagram-color-reference.md` with this content:

```markdown
# Diagram Color Reference — Single Source of Truth

**Created:** 2026-03-03
**Purpose:** The one file to read before generating any diagram. All diagram color decisions are lookups against this table — no inventing colors, no judgment calls.

**Origin:** Extracted from Section 6.5 of the walkthrough style guide. This file is authoritative; the style guide references it. Pattern inspired by Cole Medin's `color-palette.md` approach — a dedicated reference file that skills read before generating visual output.

---

## Semantic Color Mapping

Colors encode **meaning**, not decoration. Each diagram element gets its color from its semantic category, not from aesthetic preference.

| Category | Fill (Light) | Fill (Dark) | Stroke (Light) | Stroke (Dark) | Use For |
|----------|-------------|-------------|----------------|---------------|---------|
| **Infrastructure** | `#dbeafe` | `#1e3a5f` | `#3b82f6` | `#60a5fa` | Core platform components, service managers, firewalls, runtime environments |
| **Security** | `#fee2e2` | `#450a0a` | `#ef4444` | `#f87171` | Sandboxes, access controls, security boundaries, attack nodes, vulnerability indicators |
| **External Service** | `#e0e7ff` | `#312e81` | `#6366f1` | `#818cf8` | Third-party APIs, external platforms, services outside the operator's control |
| **Agent/LLM** | `#f3e8ff` | `#3b0764` | `#a855f7` | `#c084fc` | AI agents, LLM layers, model routing, inference endpoints |
| **Data/Config** | `#dcfce7` | `#052e16` | `#22c55e` | `#4ade80` | Config files, credentials, session data, environment variables, data stores |
| **User/Operator** | `#fef3c7` | `#451a03` | `#f59e0b` | `#fbbf24` | User devices, user actions, operator decisions, attacker nodes in vulnerability diagrams |
| **Neutral** | `#f5f5f4` | `#262626` | `#a8a29e` | `#737373` | OS, hardware, generic containers, unclassified components |

---

## Connector and Line Colors

| Element | Color (Light) | Color (Dark) | Notes |
|---------|--------------|-------------|-------|
| Standard arrows/connectors | `#78716c` (stone-500) | `#737373` (dark-muted) | Default for data flow |
| Security boundary crossings | `#ef4444` (red-500) | `#f87171` (red-400) | Heavier weight (3px) |
| Optional/future connections | Same as standard | Same as standard | Dashed stroke (`[6, 4]`) |
| Return path arrows | Same as standard | Same as standard | Dashed, routed below main flow |
| Structural lines (trees, timelines) | `#1e3a5f` or `#78716c` | Same dark variants | Non-arrow structural elements |

---

## Label Colors

| Context | Color (Light) | Color (Dark) |
|---------|--------------|-------------|
| Node labels | `#292524` (stone-800) | `#e5e5e5` (dark-heading) |
| Connector labels | `#44403c` (stone-700) | `#d4d4d4` (dark-body) |
| Annotations | `#44403c` (stone-700) italic | `#d4d4d4` (dark-body) italic |
| Label backgrounds (for readability) | `rgba(255,255,255,0.85)` | `rgba(26,26,26,0.85)` |

---

## How to Use This File

1. **Before generating any diagram:** Read this file. Every color decision is a lookup, not a choice.
2. **Classify each element** by its semantic category from the table above.
3. **Use the fill/stroke pair** for that category. Do not mix (e.g., Infrastructure fill with Security stroke).
4. **Dark mode:** Use the dark column values. On theme toggle, re-render with dark values.
5. **New categories:** If a concept genuinely doesn't fit any of the 7 categories, use Neutral. If you find yourself needing a new category across multiple outputs, propose adding it here. Do not invent one-off colors.

---

## Related Documents

- `walkthrough-style-guide.md` (Section 6) — Full diagram style rules (sizing, spacing, Rough.js config, label fonts)
- `engine/methodology/section-construction.md` — The build process that uses these colors during Phase B
- `engine/skills/render-validate/SKILL.md` — The verification loop that catches color misapplication in rendered output
```

**Step 3: Update Section 6.5 in the style guide to reference the standalone file**

In `engine/templates/walkthrough-style-guide.md`, replace the Section 6.5 content (the full color mapping table, approximately lines 814-824) with a reference to the new standalone file while keeping a summary:

```markdown
### 6.5 Color Mapping for Diagram Elements

**Full reference:** `engine/templates/diagram-color-reference.md` — the single source of truth for all diagram colors. Read that file before generating any diagram.

**Summary** (7 categories): Infrastructure (blue), Security (red), External Service (indigo), Agent/LLM (purple), Data/Config (green), User/Operator (amber), Neutral (stone). Each category has light/dark fill and stroke pairs. See the reference file for exact hex values.

**Rule:** Colors encode meaning. Each element's color comes from its semantic category, not from aesthetic preference. Do not invent one-off colors.
```

**Step 4: Add reference to interactive-html/README.md**

In `engine/templates/interactive-html/README.md`, add `diagram-color-reference.md` to the Reference Materials section (around line 108-113):

Add this line after the existing reference materials:
```markdown
- **Diagram color reference:** `engine/templates/diagram-color-reference.md` — single source of truth for all diagram colors (read before generating any diagram)
```

**Step 5: Commit**

```bash
git add engine/templates/diagram-color-reference.md engine/templates/walkthrough-style-guide.md engine/templates/interactive-html/README.md
git commit -m "templates: extract diagram color reference to standalone file"
```

---

## Phase 2: Render-Validate Discipline

### Task 3: Add Render-Validate Section to Section Construction Methodology

**Context:** The section-construction methodology (`engine/methodology/section-construction.md`) currently has Phase C (Whole-Output Review) that checks cross-references, flow, and balance. But it has no visual verification step — nobody is required to actually LOOK at the rendered output. Output #1 had a hidden Phase Overview diagram (`display:none`), 14 broken expandables, missing syntax highlighting, and notes fields that don't persist — all of which are instantly visible when you open the walkthrough in a browser. Cole Medin's skill makes render-validate mandatory and loops until the output passes visual inspection.

**Files:**
- Modify: `engine/methodology/section-construction.md` (insert between Phase C and Phase D, around line 101)

**Step 1: Read the current Phase C and Phase D sections**

```
Read: engine/methodology/section-construction.md (lines 85-108)
```

Phase C ends at line 100 (the Understated Warning bullet). Phase D (Iterate) starts at line 102. The new section goes between them as Phase C.5 — a mandatory visual verification sub-phase for any output that has visual or interactive elements.

**Step 2: Insert the render-validate section**

Insert after line 101 (the end of Phase C's bullet list) and before line 102 (`### Phase D: Iterate`). Write this content:

```markdown

### Phase C.5: Render-Validate Loop (Visual/Interactive Outputs Only)

**This phase is mandatory for any output that contains visual elements** — diagrams, interactive components, styled HTML, or anything where the rendered appearance matters. Skip this phase only if the output is pure text (markdown documents, knowledge base entries, methodology docs).

The core principle: **you cannot judge visual output from source code alone.** A hidden `display:none` diagram, a broken expandable section, a color that fails contrast, overlapping labels — all of these are invisible in the source and obvious in the browser. This phase forces visual verification.

**Origin:** Cole Medin's Excalidraw skill makes render-validate mandatory with 2-4 iterations typical. The same principle applies to HTML walkthroughs: generate → render in browser → view → audit against style guide → fix → re-render.

**The loop:**

1. **Render the output.** Open the HTML file in a browser (via Puppeteer MCP or manually). This is not optional — "I'll check it later" is how Output #1 shipped with a hidden diagram and 14 broken expandables.

2. **Screenshot and view.** Take screenshots of each major section/phase. View them as a reader would — not as the person who wrote the code. Look at what's actually on screen, not what you expect to see.

3. **Audit against the style guide.** For each screenshot, check:
   - Do all diagrams render and display? (Not hidden, not blank, not errored)
   - Do expandable sections expand and collapse correctly? (Click each one)
   - Do interactive elements work? (Checkboxes persist, notes fields save, copy buttons copy)
   - Does dark mode toggle correctly? (Diagrams re-render, colors shift, contrast holds)
   - Do code blocks have the correct styling? (Language labels, copy buttons, monospace font)
   - On mobile viewport: does the layout adapt? (Sidebar becomes hamburger, tables scroll, touch targets are 44px+)

4. **Audit against your diagram design intent.** For each diagram:
   - Does the visual pattern match what you selected in the concept-to-pattern mapping (style guide Section 5.5)?
   - Does the diagram pass the Isomorphism Test — would the structure communicate the concept without text labels?
   - Are colors correct per `diagram-color-reference.md`?
   - Are labels readable and not clipped by their containers?
   - Do arrows connect to the intended elements?

5. **Fix everything found.** Edit the source to address every defect. Do not defer visual fixes — they compound.

6. **Re-render and re-view.** After fixes, render again. Check that fixes worked and didn't introduce new issues. Repeat until the output passes both the style guide audit and the diagram design audit.

**When to stop:** The loop is done when every diagram renders correctly, every interactive element works, the layout responds to viewport changes, and you could show the output to Sean without caveats about "known issues."

**Typical iteration count:** 2-4 passes for a full walkthrough. The first pass catches the obvious (broken elements, missing renders). The second catches the subtle (clipped labels, uneven spacing, color inconsistencies). The third is confirmation. If you need more than 4, the construction process has a systematic issue — investigate rather than iterating endlessly.
```

**Step 3: Add a render-validate self-test to the Self-Tests section**

In the same file, add a test to the "Whole-Output Quality (Phase C)" self-test section (around line 265-270). Add after test #10:

```markdown
11. "Has the output been rendered in a browser and visually inspected since the last edit?" YES/NO — If NO: you are shipping unverified visual output. Run the render-validate loop (Phase C.5).
12. "Open the output in a browser. Click every expandable section. Do they all expand and collapse correctly?" YES/NO — If NO: broken interactive elements. Fix before delivery.
```

**Step 4: Commit**

```bash
git add engine/methodology/section-construction.md
git commit -m "methodology: add render-validate loop to section construction"
```

---

### Task 4: Create Render-Validate Skill

**Context:** The render-validate loop in section-construction.md defines the methodology. This skill is the operational version — the step-by-step process an agent follows when it's time to visually verify output. It uses the Puppeteer MCP tools to open HTML files in a browser, take screenshots, and view the rendered result.

**Files:**
- Create: `engine/skills/render-validate/SKILL.md`

**Step 1: Create the skill file**

Create `engine/skills/render-validate/SKILL.md`:

```markdown
---
name: render-validate
description: >
  Mandatory visual verification for interactive HTML outputs. Use after completing section
  construction Phase C (whole-output review) and before declaring any visual output complete.
  Invoke when producing walkthrough HTML, styled reports, or any output where the rendered
  appearance matters. Trigger phrases: "the walkthrough is ready", "output is complete",
  "ready to deliver", "let me check the HTML", "does it look right?", or any variation of
  declaring a visual output finished. Do NOT invoke for pure-text outputs (methodology docs,
  knowledge base entries, plans) where rendering is not relevant.
---

# Render-Validate — On-Demand Curriculum Engine

Verify visual output by rendering it in a browser, viewing screenshots, and auditing against
the style guide. This is not a review — it is a verification loop. You render, you look, you
fix, you re-render. Repeat until it passes.

**This skill exists because Output #1 shipped with:**
- A hidden Phase Overview diagram (`display:none` — nobody looked at it in a browser)
- 14 of 22 troubleshooting expandables broken (content leaked outside containers)
- No syntax highlighting across 75 code blocks (spec said to include it)
- Notes fields that don't persist to localStorage (spec said they should)

All of these are invisible in source code and obvious in a browser. That's the gap this skill closes.

## When NOT to Use This Skill

- Pure-text outputs (markdown methodology docs, knowledge base entries, plans, intelligence logs)
- Outputs with no visual or interactive elements
- Trivial edits to existing HTML (fixing a typo in a label — just check it inline)

The overhead of launching a browser, taking screenshots, and running a full audit is only
justified when the output has visual/interactive elements that cannot be verified from source.

## Step 1: Render the Output

Load the Puppeteer MCP tools and open the HTML file in a browser:

```
Use Puppeteer MCP to:
1. Launch a browser
2. Navigate to the HTML file (file:// URL or local server)
3. Wait for the page to fully load (including any CDN-loaded libraries like Rough.js, Mermaid)
```

If Puppeteer MCP is not available, instruct Sean to open the file in a browser manually and
provide screenshots. Do not skip this step — "I'll check it from the source code" is exactly
the failure mode this skill prevents.

## Step 2: Screenshot Each Major Section

Take screenshots of:
1. The full page at desktop width (1280px viewport)
2. Each phase/section scrolled into view
3. The sidebar navigation
4. At least one diagram in detail
5. The page at mobile width (375px viewport)
6. Dark mode (toggle and re-screenshot at least one phase + one diagram)

Name screenshots descriptively so you can reference them during audit.

## Step 3: Audit Against Style Guide

Read the diagram color reference and style guide:

```
Read: engine/templates/diagram-color-reference.md
Read: engine/templates/walkthrough-style-guide.md (focus on Sections 4, 5, and 6)
```

For each screenshot, check this list:

**Diagrams:**
- [ ] Every diagram defined in the spec renders and is visible (not hidden, not blank)
- [ ] Diagram colors match `diagram-color-reference.md` semantic categories
- [ ] Labels are readable — not clipped, not overlapping shapes
- [ ] Arrows connect to intended elements — not floating in space
- [ ] Diagrams re-render correctly on dark mode toggle

**Interactive Elements:**
- [ ] Every expandable section expands and collapses when clicked
- [ ] Expandable content stays inside its container (not leaked outside)
- [ ] Checkboxes toggle and persist state on page reload
- [ ] Notes/text inputs persist content on page reload (500ms debounce)
- [ ] Copy buttons copy code to clipboard and show visual feedback

**Layout:**
- [ ] Sidebar navigation shows all phases with progress dots
- [ ] Scroll spy highlights the correct nav item as you scroll
- [ ] Mobile: hamburger menu appears, sidebar slides in, backdrop dismisses
- [ ] Mobile: tables have horizontal scroll
- [ ] Mobile: touch targets are at least 44x44px

**Typography & Color:**
- [ ] Code blocks use monospace font at correct size
- [ ] Callout boxes have correct variant styling (critical=red, warning=red-amber, tip=amber, info=blue)
- [ ] Dark mode: all text passes WCAG AA contrast (check body text, headings, muted text, links)

## Step 4: Audit Diagrams Against Design Intent

For each diagram, check:
- [ ] The visual pattern matches what the concept-to-pattern mapping prescribed (style guide 5.5)
- [ ] **Isomorphism Test:** Remove all text labels mentally. Does the visual structure alone communicate the concept? If it looks like generic boxes without labels, the pattern is wrong.
- [ ] The diagram ARGUES, not just DISPLAYS — it shows a relationship or transformation that text alone could not communicate as clearly

## Step 5: Fix and Re-Render

For every failed check:
1. Edit the source to fix the issue
2. Re-render in the browser
3. Re-screenshot the affected area
4. Verify the fix worked and didn't break adjacent elements

Do not batch fixes and verify once — verify after each fix or small batch. Fixes can interact.

## Step 6: Present Results to Sean

```
**Render-validate complete — [output name]**

Iterations: [N] render-fix cycles
Issues found and fixed: [count]
- [issue 1]
- [issue 2]
- ...

Remaining known issues: [count, or "none"]
- [issue, if any — with reason it wasn't fixed]

Screenshots available at: [location]
```

If zero issues were found on the first pass, say so — but also note whether the audit was
thorough enough to have caught issues if they existed. A zero-issue first pass on a 3,000-line
walkthrough is suspicious unless the construction process was very disciplined.
```

**Step 2: Commit**

```bash
git add engine/skills/render-validate/SKILL.md
git commit -m "skill: add render-validate for visual output verification"
```

---

## Phase 3: Visual Output Self-Tests and Anti-Pattern

### Task 5: Add Visual Output Self-Tests to Binary Self-Tests Framework

**Context:** The binary self-tests (`engine/methodology/binary-self-tests.md`) currently have tests for Research, Synthesis, Output Generation, and Cross-Cutting stages. None test visual output quality specifically — no isomorphism test, no render verification test, no diagram-spec compliance test. These are the tests that would have caught Output #1's visual defects.

**Files:**
- Modify: `engine/methodology/binary-self-tests.md` (insert after Output Generation Tests, before Cross-Cutting Tests)

**Step 1: Read the current file structure**

```
Read: engine/methodology/binary-self-tests.md
```

Output Generation Tests end around line 78. Cross-Cutting Tests start around line 80. Insert the new section between them.

**Step 2: Insert Visual Output Tests section**

Insert after the Output Generation Tests table (after line 78) and before the `### Cross-Cutting Tests` heading (line 80):

```markdown

### Visual Output Tests

Run these after generating any output with visual or interactive elements (HTML walkthroughs, styled diagrams, interactive components). These tests are only relevant when the output renders in a browser — skip for pure-text outputs.

| # | Quick (Scan Depth) | Thorough (Deep-Dive Depth) |
|---|---|---|
| V1 | Has the output been opened in a browser since the last edit? | Has the output been rendered via Puppeteer (or manually) with screenshots taken of every major section, in both light and dark mode? |
| V2 | Pick any diagram. Does its visual structure match the pattern prescribed by the concept-to-pattern mapping (style guide 5.5)? | **Isomorphism Test:** Pick any diagram. Mentally remove all text labels. Does the visual structure alone communicate the concept? If it looks like generic boxes without labels, the pattern is wrong. |
| V3 | Count the diagrams in the output. Does the count match the diagram spec in the style guide Section 7? | For each diagram specified in the style guide, verify: (a) it renders, (b) it is visible (not hidden), (c) its type matches the spec, (d) its nodes match the spec. |
| V4 | Click any expandable section. Does it expand and collapse? | Click every expandable section. Do they all work? Does content stay inside containers (not leaked outside)? |
| V5 | Check any checkbox, reload the page. Is the state preserved? | Check a checkbox, enter text in a notes field, reload the page. Are both checkbox state and text content preserved? |
| V6 | Pick any diagram. Are the colors consistent with the diagram color reference? | Open `diagram-color-reference.md`. For each diagram element, verify its fill and stroke match the semantic category from the reference. |
```

**Step 3: Commit**

```bash
git add engine/methodology/binary-self-tests.md
git commit -m "methodology: add visual output self-tests to binary test framework"
```

---

### Task 6: Add "The Unverified Render" Anti-Pattern to Gallery

**Context:** The anti-pattern gallery (`engine/methodology/anti-patterns.md`) has 10 entries, all citing real Output #1 evidence. The visual verification gap — generating visual output without rendering and viewing it — is a documented failure mode from Output #1 (hidden diagram, broken expandables) that deserves its own entry. This follows the gallery's rules: real examples only, honest about our own work, framed as failure mode not commandment.

**Files:**
- Modify: `engine/methodology/anti-patterns.md` (add entry #11 before Related Documents)

**Step 1: Read the end of the current gallery**

```
Read: engine/methodology/anti-patterns.md (lines 205-241)
```

Entry #10 (The Deferred Template Pile) ends around line 229. The Related Documents section starts around line 233. The new entry goes between them.

**Step 2: Add anti-pattern #11**

Insert after the `---` following entry #10 (around line 231) and before `## Related Documents` (around line 233):

```markdown

### 11. The Unverified Render

**What it looks like:** Visual or interactive output is generated, reviewed in source code, and declared complete — without anyone opening it in a browser to see what it actually looks like.

**Real example:** Output #1's interactive walkthrough (3,030 lines of HTML) had four visual defects that are invisible in source code and obvious in a browser:

1. **Hidden diagram:** The Phase Overview diagram (`diagram-phase-overview`) was rendered by Mermaid.js but had `style="display:none"` on its container. The most useful orientation diagram — showing the full walkthrough roadmap — was built and invisible. Nobody opened the HTML and noticed the diagram wasn't there.

2. **Broken expandables:** 14 of 22 troubleshooting expandable sections had content that leaked outside their containers. The toggle button worked (the chevron rotated) but the content was always visible below the container. This is a DOM structure issue that is trivial to spot visually and nearly impossible to catch by reading HTML source.

3. **Missing syntax highlighting:** The style guide specifies 8 token-type colors for code blocks (keywords, strings, comments, etc.) with exact hex values for light and dark mode. The actual HTML has monochrome code blocks across all 75 code blocks. The specification existed, the implementation didn't follow it, and nobody noticed because nobody compared the rendered output to the spec.

4. **Non-persisting notes:** The style guide specifies localStorage persistence with 500ms debounce for `.notes-input` textarea fields. The implementation persists checkbox state but not text inputs. A user who fills in version numbers and deployment notes loses them on page reload.

All four defects survived through the entire construction process and code review. They would have been caught in under 60 seconds by opening the file in a browser and clicking through one phase.

**Why it happens:** During construction, the source code IS the output — you write HTML, you see HTML. The mental model is "I wrote the right structure, so it renders correctly." But HTML rendering is not deterministic from reading source — CSS interactions, JavaScript timing, DOM nesting, CDN load order, and viewport behavior all affect the result. The only reliable verification is looking at the rendered page. But "open it in a browser" feels like a separate step, not part of the build process, so it gets deferred to "later" — and later never comes.

**What good looks like:** Visual verification is part of the build process, not a post-build step. The render-validate loop (see `section-construction.md` Phase C.5) makes this mandatory: render → screenshot → audit → fix → re-render. The loop runs until the output passes visual inspection. "It works in the source" is not sufficient.

**Binary test:** Has the output been opened in a browser and visually inspected since the last source code edit? If no: you are about to ship unverified visual output. Open it now.

*(First observed: 2026-02-22 (Output #1 construction), documented 2026-03-03 during engine methodology review)*

---
```

**Step 3: Update Related Documents to include the new render-validate references**

In the same file, add to the Related Documents section:

```markdown
- `section-construction.md` — Phase C.5 (render-validate loop) directly addresses this anti-pattern
```

**Step 4: Commit**

```bash
git add engine/methodology/anti-patterns.md
git commit -m "anti-pattern: add #11 The Unverified Render with Output #1 evidence"
```

---

## Phase 4: Retroactive Validation

### Task 7: Run New Visual Self-Tests Against Output #1 Diagrams

**Context:** The new visual self-tests (V1-V6) and the Isomorphism Test need validation against real output. Output #1's walkthrough is the only existing output. Running the tests retroactively serves two purposes: (1) confirms the tests catch real problems (they should — the tests were designed from known Output #1 failures), and (2) documents the specific failures as a baseline for Output #2 to improve upon.

**Files:**
- Read (do not modify): `outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html`
- Read (do not modify): `outputs/openclaw-sean/docs/walkthrough/interactive/src/diagrams.js`
- Create: `engine/methodology/validation/output1-visual-audit.md`

**Step 1: Read the walkthrough HTML and diagrams.js to assess each test**

```
Read: outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html
Read: outputs/openclaw-sean/docs/walkthrough/interactive/src/diagrams.js
```

Focus on: diagram rendering calls, expandable section DOM structure, localStorage binding code, syntax highlighting implementation (or lack thereof), and any `display:none` or hidden elements.

**Step 2: Run each visual self-test (V1-V6) against Output #1**

For each test, record the result honestly. Use the Thorough (Deep-Dive) version since Output #1 was a deep-dive output. If Puppeteer MCP is available, actually render the walkthrough and take screenshots. If not, analyze the source code and document what a visual inspection would find.

**Step 3: Run the Isomorphism Test against each of Output #1's 8 diagrams**

For each diagram in `diagrams.js`, answer: "If I removed all text labels, would the visual structure alone communicate the concept?"

- Phase Overview (Mermaid flowchart): ?
- Machine Transformation (Rough.js side-by-side): ?
- Network Topology (Rough.js network): ?
- Gateway Architecture (Mermaid LR): ?
- Defense in Depth (Rough.js concentric): ?
- Model Routing (Mermaid sequence): ?
- Skill Security (Rough.js side-by-side with wall): ?
- Validation Dashboard (DOM interactive): ?

**Step 4: Create the audit document**

Create `engine/methodology/validation/output1-visual-audit.md`:

```markdown
# Output #1 Retroactive Visual Audit

**Date:** 2026-03-03
**Purpose:** Validate new visual self-tests (V1-V6) and Isomorphism Test against Output #1's interactive walkthrough. Documents what the tests catch and establishes a baseline for Output #2.

**Audited output:** `outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html`

---

## Visual Self-Test Results (Thorough / Deep-Dive)

| Test | Result | Finding |
|------|--------|---------|
| V1 (Browser render) | [PASS/FAIL] | [what was found] |
| V2 (Isomorphism) | [PASS/FAIL] | [what was found] |
| V3 (Diagram spec compliance) | [PASS/FAIL] | [what was found] |
| V4 (Expandable sections) | [PASS/FAIL] | [what was found] |
| V5 (State persistence) | [PASS/FAIL] | [what was found] |
| V6 (Color reference compliance) | [PASS/FAIL] | [what was found] |

## Isomorphism Test Results (Per Diagram)

| Diagram | Pattern Used | Correct Pattern? | Isomorphism Pass? | Notes |
|---------|-------------|-------------------|-------------------|-------|
| Phase Overview | [pattern] | [Y/N] | [Y/N] | [notes] |
| Machine Transformation | [pattern] | [Y/N] | [Y/N] | [notes] |
| Network Topology | [pattern] | [Y/N] | [Y/N] | [notes] |
| Gateway Architecture | [pattern] | [Y/N] | [Y/N] | [notes] |
| Defense in Depth | [pattern] | [Y/N] | [Y/N] | [notes] |
| Model Routing | [pattern] | [Y/N] | [Y/N] | [notes] |
| Skill Security | [pattern] | [Y/N] | [Y/N] | [notes] |
| Validation Dashboard | [pattern] | [Y/N] | [Y/N] | [notes] |

## Summary

- Tests passed: X/6
- Diagrams passing isomorphism: X/8
- Key findings: [summary of what the new methodology would have caught]

## Baseline for Output #2

[What specifically should be different in Output #2's visual output based on these findings]
```

Fill in all results based on actual analysis of the source code and rendered output.

**Step 5: Commit**

```bash
git add engine/methodology/validation/output1-visual-audit.md
git commit -m "validation: retroactive visual audit of Output #1 against new tests"
```

---

## Phase 5: Integration

### Task 8: Update CLAUDE.md, CONTEXT.md, and Cross-References

**Context:** New files were created (diagram-color-reference.md, render-validate skill, output1-visual-audit.md). Existing files were modified (style guide, section-construction, binary-self-tests, anti-patterns). CLAUDE.md's engine structure tree and skill table need updating. CONTEXT.md needs an evolution note. Cross-references in Related Documents sections need updating.

**Files:**
- Modify: `CLAUDE.md` (engine structure tree around lines 107-131, Engine Pipeline Skills table around lines 229-239)
- Modify: `CONTEXT.md` (evolution notes section)
- Modify: `engine/methodology/section-construction.md` (Related Documents section, around line 274)
- Modify: `engine/methodology/binary-self-tests.md` (Related Documents section, around line 126)

**Step 1: Update CLAUDE.md engine structure tree**

In the engine structure tree (around line 107-131), add:
- Under `engine/templates/`: add `diagram-color-reference.md`
- Under `engine/skills/`: add `render-validate/`
- Under `engine/methodology/`: add `validation/` directory

The updated tree section should show:

```
│   ├── templates/              # Output scaffolding, report frameworks, walkthrough style guide
│   │   ├── project-structure/
│   │   ├── report-templates/
│   │   ├── walkthrough-style-guide.md
│   │   ├── diagram-color-reference.md
│   │   └── interactive-html/
```

And under skills:

```
│   ├── skills/                 # Engine-level skills
│   │   ├── session-restart/
│   │   ├── depth-assessment/
│   │   ├── self-test/
│   │   ├── findings-pattern/
│   │   ├── anti-pattern-check/
│   │   ├── section-construction/
│   │   └── render-validate/
```

**Step 2: Update CLAUDE.md Engine Pipeline Skills table**

Add render-validate to the table (around line 238):

```markdown
| `render-validate` | After constructing visual/interactive output (HTML walkthroughs) | Output Generation |
```

**Step 3: Update CONTEXT.md**

Add to the Engine Evolution Notes section:

```markdown
- 2026-03-03: Visual output methodology integrated — concept-to-pattern mapping, render-validate loop, diagram color reference, visual self-tests
  Source: Adapted from Cole Medin's Excalidraw diagram skill (methodology patterns, not tool-specific)
  Additions: style guide sections 5.5-5.6, diagram-color-reference.md, render-validate skill, visual self-tests (V1-V6), anti-pattern #11 (The Unverified Render)
  Validation: Retroactive audit of Output #1 confirms new tests catch documented failures
```

**Step 4: Update Related Documents in section-construction.md**

In `engine/methodology/section-construction.md`, add to the Related Documents section (around line 274-280):

```markdown
- `../templates/diagram-color-reference.md` — The single source of truth for diagram colors, used during Phase B diagram construction and verified during Phase C.5 render-validate.
```

**Step 5: Update Related Documents in binary-self-tests.md**

In `engine/methodology/binary-self-tests.md`, add to the Related Documents section (around line 126-133):

```markdown
- `../templates/walkthrough-style-guide.md` — Contains the diagram design process (Sections 5.5-5.6) that visual self-tests V2-V3 verify against
- `../templates/diagram-color-reference.md` — The color lookup that visual self-test V6 verifies against
```

**Step 6: Commit**

```bash
git add CLAUDE.md CONTEXT.md engine/methodology/section-construction.md engine/methodology/binary-self-tests.md
git commit -m "integrate: update constitution, context, and cross-references for visual methodology"
```

---

### Task 9: Final Verification

**Context:** All new content has been created. This task verifies everything is internally consistent: cross-references resolve, the anti-pattern gallery numbering is correct, self-test numbering is sequential, the CLAUDE.md structure tree matches actual files, and the style guide section numbering is coherent.

**Files:**
- Read all modified files (do not modify unless issues found)

**Verification checklist:**

1. **Style guide section numbering:** Sections 5.5 and 5.6 exist between 5.4 and 6. Section 6 still starts with "Diagram Style Rules."
2. **Section 6.5 in style guide:** Now references `diagram-color-reference.md` instead of containing the full table. The reference is correct.
3. **diagram-color-reference.md:** Contains all 7 categories with correct hex values (cross-check against the original Section 6.5 content).
4. **section-construction.md:** Phase C.5 exists between Phase C and Phase D. Self-tests #11-12 exist after #10. Related Documents includes diagram-color-reference.md.
5. **binary-self-tests.md:** V1-V6 tests exist between Output Generation and Cross-Cutting sections. Related Documents includes style guide and color reference.
6. **anti-patterns.md:** Entry #11 exists with correct numbering. Related Documents includes section-construction.md reference.
7. **render-validate/SKILL.md:** Exists with correct YAML header and references to diagram-color-reference.md and style guide sections.
8. **output1-visual-audit.md:** Exists in engine/methodology/validation/ with completed results (not template placeholders).
9. **CLAUDE.md:** Structure tree shows diagram-color-reference.md, render-validate/, and validation/. Pipeline Skills table includes render-validate.
10. **CONTEXT.md:** Evolution note for visual output methodology exists.
11. **interactive-html/README.md:** References diagram-color-reference.md in Reference Materials.

**If any verification item fails:** Fix it and re-verify the specific item.

**Final commit (only if fixes needed):**

```bash
git add [fixed files]
git commit -m "verify: fix [specific issue] in visual output methodology"
```
