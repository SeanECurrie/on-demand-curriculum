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

Verifies visual output by rendering it in a real browser, viewing the result, auditing against
the engine's style specifications, and fixing issues in a loop until the output matches intent.
Source code review alone is insufficient for visual outputs — this skill closes the gap between
what the code says and what the user sees.

## Why This Exists

Output #1 (OpenClaw) proved that source-level review misses an entire class of defects that
are invisible in code but obvious in a browser:

- **Hidden Phase Overview diagram** — a `display:none` rule hid the diagram entirely. The SVG
  markup was correct; the CSS made it invisible. Source review cannot catch this.
- **14 of 22 troubleshooting expandables broken** — click handlers were bound to the wrong
  selectors. The HTML structure looked fine. Only clicking reveals the failure.
- **No syntax highlighting across 75 code blocks** — the CDN library loaded but the
  initialization call was missing. Every `<code>` block rendered as plain monospace text.
  Indistinguishable from correct rendering in source.
- **Notes fields not persisting to localStorage** — the `<textarea>` elements existed and
  accepted input, but the save-on-blur handler referenced stale IDs. Only typing, leaving,
  and returning reveals the data loss.

All four were invisible in source code. All four were obvious within seconds in a browser.
This skill exists because "it looks right in the markup" is not evidence that it looks right
to the person using it.

## When NOT to Use This Skill

- Pure-text outputs (methodology docs, knowledge base entries, plans, intelligence logs)
- Outputs with no visual or interactive elements
- Trivial edits to existing verified HTML (fixing a typo in body text, updating a date)
- Any output where rendering is not relevant to quality

If the output will not be opened in a browser by anyone, this skill adds overhead without value.

## Step 1: Render the Output

Load the Puppeteer MCP tools and launch a browser instance:

```
ToolSearch: "puppeteer launch"
-> mcp__puppeteer-mcp-claude__puppeteer_launch
-> mcp__puppeteer-mcp-claude__puppeteer_navigate
-> mcp__puppeteer-mcp-claude__puppeteer_screenshot
```

1. Launch the browser with `puppeteer_launch`.
2. Navigate to the HTML file using a `file://` URL (absolute path) or a local development
   server if one is running.
3. Wait for full page load including any CDN-hosted libraries (Prism.js, highlight.js,
   Mermaid, etc.). Use `puppeteer_wait_for_selector` on a known late-loading element if
   needed.

**Fallback:** If Puppeteer MCP is unavailable or fails to connect, instruct Sean to open the
file manually in a browser and provide screenshots. Do not skip visual verification — degrade
to manual, never to skipped. State explicitly:

```
Puppeteer MCP unavailable. To complete visual verification, please:
1. Open [file path] in your browser
2. Take screenshots of: full page, each major section, sidebar, one diagram, mobile width
3. Share screenshots here so I can audit against the style guide
```

## Step 2: Screenshot Each Major Section

Capture systematic screenshots to cover the full visual surface:

- **Full page at desktop width** — viewport 1280px wide. Scroll from top to bottom, capturing
  each screenful.
- **Each phase/section** — scroll each section into view and screenshot. Ensure headers, body
  content, and any diagrams within the section are visible.
- **Sidebar navigation** — screenshot the sidebar in its default state. If it has active-state
  highlighting, navigate to a mid-document section and screenshot the sidebar showing the
  active indicator.
- **At least one diagram in detail** — pick the most complex diagram and screenshot it at a
  zoom level where all labels and arrows are readable.
- **Mobile width** — resize viewport to 375px and screenshot the full page. Verify the sidebar
  collapses to a hamburger menu. Check at least one table for horizontal scroll behavior.
- **Dark mode** — toggle dark mode (via the UI toggle or by injecting
  `document.documentElement.classList.add('dark-mode')`) and re-screenshot at least one
  phase and one diagram. Verify colors shift correctly.

**Do not proceed to Step 3 until all screenshots are captured.** The screenshots are the
evidence base for the audit. Auditing from memory of a quick scroll-through is exactly the
failure mode this skill prevents.

## Step 3: Audit Against Style Guide

Read the reference documents:

```
Read: engine/templates/diagram-color-reference.md
Read: engine/templates/walkthrough-style-guide.md (Sections 4, 5, 6)
```

Evaluate each screenshot against the following checklist. Mark each item YES or NO.

### Diagrams

- [ ] All diagrams render and are visible (no `display:none`, no zero-height containers)
- [ ] Diagram colors match `diagram-color-reference.md` palette
- [ ] All diagram labels are readable at normal zoom (no text overlap, no truncation)
- [ ] Arrow/connector directions are correct and endpoints are anchored properly
- [ ] Diagrams render correctly in dark mode (backgrounds shift, text remains readable)

### Interactive Elements

- [ ] All expandable/collapsible sections open and close on click
- [ ] Checkbox state persists across page reload (localStorage)
- [ ] Notes/textarea content persists across page reload (localStorage)
- [ ] Copy-to-clipboard buttons copy the correct content (test at least 2)

### Layout

- [ ] Sidebar displays all phases/sections with correct hierarchy
- [ ] Scroll spy highlights the correct sidebar item as user scrolls
- [ ] Mobile hamburger menu appears at 375px viewport and opens/closes correctly
- [ ] Tables with many columns scroll horizontally on mobile (no layout break)
- [ ] Touch targets are at least 44x44px on mobile (buttons, nav items, expandables)

### Typography and Color

- [ ] Code blocks use monospace font with syntax highlighting active
- [ ] Callout variants (info, warning, tip, critical) use correct background/border colors
- [ ] Dark mode meets WCAG AA contrast (4.5:1 for body text, 3:1 for large text)
- [ ] No light-mode colors leaking into dark mode (white backgrounds, dark-on-dark text)

**Any NO answer is a defect.** Record it with the specific screenshot and location.

## Step 4: Audit Diagrams Against Design Intent

For each diagram in the output, verify it communicates its concept — not just that it renders.

Read: `engine/templates/walkthrough-style-guide.md` (Section 5.5 — concept-to-pattern mapping)

Per-diagram checks:

1. **Pattern matches concept.** The diagram pattern (flow, layers, hub-spoke, timeline,
   comparison, containment, state) should match the concept-to-pattern mapping from the style
   guide. If a flow concept uses a layered diagram, or a containment concept uses a timeline,
   the pattern is wrong regardless of whether it renders correctly.

2. **Isomorphism test.** Mentally remove all labels from the diagram. Does the bare structure
   (shapes, connections, spatial arrangement) still communicate the concept? If removing labels
   makes the diagram meaningless — it is decoration, not communication. The structure itself
   should argue.

3. **The diagram ARGUES, not just DISPLAYS.** A diagram should make a point — show a
   relationship, reveal a dependency, expose a risk, clarify a sequence. If the diagram merely
   lists items in boxes, it is a styled bullet list, not a diagram. Ask: "What does this
   diagram make obvious that the text alone does not?"

Record any diagram that fails these checks as a defect with a specific explanation of what
is wrong and what pattern or approach would be correct.

## Step 5: Fix and Re-Render

For each defect found in Steps 3 and 4:

1. **Fix the issue** in the source file.
2. **Re-render** — reload the page in the browser (or re-navigate if needed).
3. **Re-screenshot** the specific area that was defective.
4. **Verify** the fix resolved the issue without introducing new problems in the same area.

Fix one issue at a time. Do not batch all fixes and then verify once — that approach masks
regressions where fixing issue A breaks something near issue B. The cycle is:
fix -> render -> screenshot -> verify, repeated per defect.

If a fix requires structural changes (reworking a diagram pattern, restructuring an interactive
element), that counts as a new section-construction pass for the affected area. Apply the same
namespace and cross-reference discipline from the section-construction skill.

## Step 6: Present Results to Sean

When all defects are resolved (or documented as known issues with justification):

```
**Render-validate complete — [output name]**

Iterations: [N] render-fix cycles
Issues found and fixed: [count]
- [issue 1: brief description]
- [issue 2: brief description]
- ...

Remaining known issues: [count, or "none"]
- [issue and justification for deferral, if any]

Screenshots available at: [location or "captured during session"]
```

If zero issues were found, state that — but also state how many screenshots were taken and
what was checked. "No issues found" after 2 screenshots is not the same confidence level as
"no issues found" after 15 screenshots covering all sections, both modes, and mobile. Be
precise about the evidence base.
