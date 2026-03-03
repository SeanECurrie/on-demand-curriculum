# Interactive Walkthrough Style Guide — Engine Template

**Version:** 1.0 (engine template)
**Derived from:** Output #1 (OpenClaw) style guide v2.0 (2026-02-22)
**Purpose:** Complete visual and curriculum design specification for interactive HTML walkthroughs produced by the On-Demand Curriculum Engine. Every aesthetic decision is made here so that downstream builders (Content Architect, Diagram Engineer) make zero visual judgment calls.

**Adapting this template for a new output:**
1. Use sections 1-5 and 6.1-6.7 as-is — they define the universal design system
2. Replace section 7 ("Example Diagram Specifications") with diagrams specific to your output's topic
3. Follow the diagram category mapping in 6.5 — extend with new categories only if the existing 7 do not cover your domain
4. The curriculum design principles in section 5 are topic-agnostic — apply them regardless of subject matter

---

## 1. Color Palette

### 1.1 Base Palette (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-blue-500` | `#3b82f6` | Infrastructure actions, links, active navigation, primary buttons |
| `--color-blue-600` | `#2563eb` | Link hover, active nav border |
| `--color-blue-700` | `#1d4ed8` | Focus outlines |
| `--color-blue-50` | `#eff6ff` | Info callout background |
| `--color-blue-100` | `#dbeafe` | Active nav item background, diagram infrastructure fill |
| `--color-blue-200` | `#bfdbfe` | Phase time-estimate badge background |
| `--color-red-500` | `#ef4444` | Security warnings, CRITICAL labels, FAIL indicators, security boundary strokes |
| `--color-red-600` | `#dc2626` | Warning callout label text (light mode), hover states |
| `--color-red-50` | `#fef2f2` | Warning/critical callout background |
| `--color-red-100` | `#fee2e2` | Diagram security node fill, warning callout border-left accent |
| `--color-green-500` | `#22c55e` | Success, PASS indicators, completed checkboxes, completed nav items |
| `--color-green-600` | `#16a34a` | Success hover, success callout label (light mode) |
| `--color-green-50` | `#f0fdf4` | Success callout background |
| `--color-green-100` | `#dcfce7` | Diagram data/config node fill |
| `--color-amber-500` | `#f59e0b` | Tips, educational notes, "Understanding" section accent borders |
| `--color-amber-800` | `#92400e` | Tip callout label text (light mode; AA compliant on amber-50) |
| `--color-amber-50` | `#fffbeb` | Tip callout background, "Understanding" section background |
| `--color-amber-100` | `#fef3c7` | Diagram user/operator node fill |
| `--color-indigo-100` | `#e0e7ff` | Diagram external service node fill |
| `--color-purple-100` | `#f3e8ff` | Diagram agent/LLM node fill |
| `--color-stone-50` | `#fafaf9` | Page background |
| `--color-stone-100` | `#f5f5f4` | Sidebar background, card backgrounds, table header background |
| `--color-stone-200` | `#e7e5e4` | Borders, dividers, code block backgrounds, inline code background |
| `--color-stone-300` | `#d6d3d1` | Subtle borders, disabled states, checkbox unchecked border, diagram neutral node stroke |
| `--color-stone-400` | `#a8a29e` | Muted text, placeholders, secondary labels, completed-checkbox strikethrough |
| `--color-stone-500` | `#78716c` | Secondary body text, diagram connector strokes |
| `--color-stone-700` | `#44403c` | Primary body text, code text, table cell text, diagram node strokes |
| `--color-stone-800` | `#292524` | Headings (h2, h3), diagram node labels |
| `--color-stone-900` | `#1c1917` | Phase titles (h1) |

### 1.2 Dark Mode Palette

Applied when `<html data-theme="dark">` is set.

| Token (Dark Override) | Hex | Replaces (Light) |
|----------------------|-----|-----------------|
| `--color-blue-400` | `#60a5fa` | `--color-blue-500` for text/links/nav active |
| `--color-blue-500` | `#3b82f6` | Unchanged for buttons, focus outlines |
| `--color-blue-900` | `#1e3a5f` | `--color-blue-50` for info callout bg |
| `--color-blue-800` | `#1e40af` | `--color-blue-100` active nav bg |
| `--color-red-400` | `#f87171` | `--color-red-500` for warning text/labels |
| `--color-red-900` | `#450a0a` | `--color-red-50` for warning/critical callout bg |
| `--color-green-400` | `#4ade80` | `--color-green-500` for success text |
| `--color-green-900` | `#052e16` | `--color-green-50` for success callout bg |
| `--color-amber-400` | `#fbbf24` | `--color-amber-500`/`--color-amber-800` for tip text/labels |
| `--color-amber-900` | `#451a03` | `--color-amber-50` for tip callout bg |
| `--color-indigo-900` | `#312e81` | `--color-indigo-100` diagram external service fill |
| `--color-purple-900` | `#3b0764` | `--color-purple-100` diagram agent/LLM fill |
| `--color-dark-bg` | `#1a1a1a` | `--color-stone-50` page background |
| `--color-dark-surface` | `#262626` | `--color-stone-100` sidebar/card/table-header bg |
| `--color-dark-code-bg` | `#2d2d2d` | `--color-stone-200` code block bg |
| `--color-dark-border` | `#404040` | `--color-stone-200` borders |
| `--color-dark-border-subtle` | `#333333` | `--color-stone-300` subtle borders |
| `--color-dark-muted` | `#737373` | `--color-stone-400` muted text |
| `--color-dark-secondary` | `#a3a3a3` | `--color-stone-500` secondary text |
| `--color-dark-body` | `#d4d4d4` | `--color-stone-700` body text |
| `--color-dark-heading` | `#e5e5e5` | `--color-stone-800` headings |
| `--color-dark-strongest` | `#f5f5f5` | `--color-stone-900` phase titles |

### 1.3 WCAG AA Contrast Verification

All text-on-background combinations meet WCAG AA: 4.5:1 for normal text (< 18px), 3:1 for large text (>= 18px or >= 14px bold).

| Combination | Foreground | Background | Ratio | Passes |
|------------|-----------|-----------|-------|--------|
| Body text (light) | `#44403c` | `#fafaf9` | 8.5:1 | AA, AAA |
| Heading text (light) | `#292524` | `#fafaf9` | 12.4:1 | AA, AAA |
| Link text (light) | `#3b82f6` | `#fafaf9` | 4.6:1 | AA |
| Muted text (light) | `#78716c` | `#fafaf9` | 4.6:1 | AA |
| Critical label (light) | `#dc2626` | `#fef2f2` | 5.6:1 | AA |
| Success label (light) | `#16a34a` | `#f0fdf4` | 4.5:1 | AA |
| Tip label (light) | `#92400e` | `#fffbeb` | 7.1:1 | AA, AAA |
| Info label (light) | `#2563eb` | `#eff6ff` | 4.8:1 | AA |
| Code on code-bg (light) | `#44403c` | `#e7e5e4` | 6.1:1 | AA |
| Body text (dark) | `#d4d4d4` | `#1a1a1a` | 11.3:1 | AA, AAA |
| Heading text (dark) | `#e5e5e5` | `#1a1a1a` | 14.1:1 | AA, AAA |
| Link text (dark) | `#60a5fa` | `#1a1a1a` | 6.3:1 | AA |
| Muted text (dark) | `#a3a3a3` | `#1a1a1a` | 7.4:1 | AA |
| Critical label (dark) | `#f87171` | `#450a0a` | 5.8:1 | AA |
| Success label (dark) | `#4ade80` | `#052e16` | 7.2:1 | AA |
| Tip label (dark) | `#fbbf24` | `#451a03` | 6.9:1 | AA |
| Info label (dark) | `#60a5fa` | `#1e3a5f` | 4.6:1 | AA |
| Code on code-bg (dark) | `#d4d4d4` | `#2d2d2d` | 8.7:1 | AA, AAA |
| Secondary text (dark) | `#a3a3a3` | `#262626` | 5.8:1 | AA |
| Nav active (dark) | `#60a5fa` | `#1e40af` | 3.2:1 | AA (large) |

---

## 2. Typography

### 2.1 Font Stacks

```css
--font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
--font-mono: "SF Mono", SFMono-Regular, ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace;
```

### 2.2 Type Scale

| Level | Element | Size | Weight | Line Height | Letter Spacing | Color Token (Light) |
|-------|---------|------|--------|-------------|----------------|---------------------|
| Phase title | `h1` | 28px | 700 | 1.3 | -0.02em | `--color-stone-900` |
| Section heading | `h2` | 22px | 700 | 1.35 | -0.01em | `--color-stone-800` |
| Subsection heading | `h3` | 18px | 600 | 1.4 | 0 | `--color-stone-800` |
| Body text | `p`, `li` | 16px | 400 | 1.65 | 0 | `--color-stone-700` |
| Small / secondary | `small`, `.secondary` | 14px | 400 | 1.5 | 0.01em | `--color-stone-500` |
| Code inline | `code` | 14px | 400 | inherit | 0 | `--color-stone-700` |
| Code block | `pre code` | 14px | 400 | 1.55 | 0 | `--color-stone-700` |
| Table header | `th` | 14px | 600 | 1.4 | 0.02em | `--color-stone-700` |
| Table cell | `td` | 14px | 400 | 1.5 | 0 | `--color-stone-700` |
| Nav item | `.nav-item` | 14px | 500 | 1.4 | 0 | `--color-stone-700` |
| Nav group label | `.nav-group-label` | 11px | 700 | 1.3 | 0.08em | `--color-stone-400` (uppercase) |
| Callout label | `.callout-label` | 13px | 700 | 1.3 | 0.05em | varies per callout type (uppercase) |
| Checkbox label | `.checkbox-label` | 15px | 400 | 1.5 | 0 | `--color-stone-700` |
| Phase number label | `.phase-number` | 13px | 700 | 1.3 | 0.08em | `--color-blue-500` (uppercase) |
| Time estimate badge | `.time-badge` | 12px | 600 | 1 | 0 | `--color-blue-600` |

### 2.3 Text Rendering

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

---

## 3. Spacing System

**Base unit:** 4px. All spacing is a multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight inline gaps (icon-to-text) |
| `--space-2` | 8px | Compact padding (checkbox internal, code inline padding) |
| `--space-3` | 12px | Standard inline padding (nav items, table cells, expandable trigger padding) |
| `--space-4` | 16px | Standard block padding (card padding, list item gap, callout padding) |
| `--space-5` | 20px | Content section vertical gap, code block horizontal padding, sidebar padding |
| `--space-6` | 24px | Section vertical gap, sidebar vertical padding, deployment notes padding |
| `--space-8` | 32px | Phase section top padding |
| `--space-10` | 40px | Major section dividers, content area horizontal padding (desktop) |
| `--space-12` | 48px | Page top/bottom padding |

### 3.1 Layout Dimensions

| Dimension | Value |
|-----------|-------|
| Max content width | 780px |
| Sidebar width | 260px |
| Mobile breakpoint | 768px |
| Content padding (desktop) | 40px left/right |
| Content padding (mobile) | 20px left/right |
| Scroll padding top | 24px |

---

## 4. Component Specifications

### 4.1 Code Blocks

```css
.code-block {
  background: var(--color-stone-200);         /* dark: #2d2d2d */
  border: 1px solid var(--color-stone-300);   /* dark: #404040 */
  border-radius: 8px;
  padding: 16px 20px;
  margin: 12px 0 16px 0;
  overflow-x: auto;
  position: relative;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-stone-700);              /* dark: #d4d4d4 */
}
```

**Language label (optional, for multi-language blocks):**
- Position: absolute, top-left corner (top: 0, left: 16px)
- Background: `--color-stone-300` (dark: `#404040`)
- Padding: 2px 8px
- Border-radius: 0 0 4px 4px
- Font: 11px `--font-mono`, `--color-stone-500` (dark: `#a3a3a3`)
- Text: language identifier (e.g., "bash", "json5", "json", "css", "yaml", "python")

**Copy button:**
- Position: absolute, top: 8px, right: 8px
- Size: 32px x 32px
- Background: transparent; hover: `--color-stone-100` (dark: `#404040`)
- Border: none
- Border-radius: 6px
- Icon: clipboard SVG, 16px, `--color-stone-400` (dark: `#737373`)
- On click: icon changes to checkmark, color `--color-green-500`, reverts after 2000ms
- Cursor: pointer
- Transition: background 150ms ease

**Syntax highlighting colors (light mode):**

| Token Type | Color | Hex |
|-----------|-------|-----|
| Keyword | violet | `#8b5cf6` |
| String | emerald | `#059669` |
| Comment | stone-400 | `#a8a29e` |
| Number | amber-600 | `#d97706` |
| Property/key | blue-600 | `#2563eb` |
| Punctuation | stone-700 | `#44403c` |
| Command/executable | red-600 | `#dc2626` |
| Flag/argument | cyan-600 | `#0891b2` |

**Syntax highlighting colors (dark mode):**

| Token Type | Color | Hex |
|-----------|-------|-----|
| Keyword | violet-400 | `#a78bfa` |
| String | emerald-400 | `#34d399` |
| Comment | neutral-500 | `#737373` |
| Number | amber-400 | `#fbbf24` |
| Property/key | blue-400 | `#60a5fa` |
| Punctuation | neutral-300 | `#d4d4d4` |
| Command/executable | red-400 | `#f87171` |
| Flag/argument | cyan-400 | `#22d3ee` |

### 4.2 Expandable/Collapsible Sections

Used for: "Understanding" sections, troubleshooting, "Expected output" blocks, long explanatory tables, and Deployment Notes.

```css
.expandable {
  border: 1px solid var(--color-stone-200);   /* dark: #404040 */
  border-radius: 8px;
  margin: 12px 0;
  overflow: hidden;
}

.expandable-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: var(--color-stone-100);          /* dark: #262626 */
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-stone-700);               /* dark: #d4d4d4 */
  text-align: left;
  transition: background 150ms ease;
}

.expandable-trigger:hover {
  background: var(--color-stone-200);          /* dark: #333333 */
}
```

**Chevron icon:**
- SVG path: `M6 4l8 8-8 8` (right-pointing chevron)
- Size: 16px x 16px
- Color: `--color-stone-400` (dark: `#737373`)
- Flex-shrink: 0
- Transition: transform 200ms ease
- Collapsed: rotation 0deg (pointing right)
- Expanded: rotation 90deg (pointing down)

**Content panel:**
- Padding: 0 16px 16px 16px
- Display: none when collapsed, block when expanded
- No animation on content reveal (instant toggle to avoid layout shift)

**Trigger label color prefixes by section type:**
- Understanding sections: chevron and label prefix in `--color-amber-500` (dark: `--color-amber-400`)
- Troubleshooting: chevron and label prefix in `--color-red-500` (dark: `--color-red-400`)
- Expected output: chevron and label prefix in `--color-green-500` (dark: `--color-green-400`)
- Deployment Notes: chevron and label prefix in `--color-blue-500` (dark: `--color-blue-400`)

**Default states:**
- "Understanding" sections: expanded by default (these are the educational core)
- Troubleshooting: collapsed by default
- "Expected output": collapsed by default
- Long explanation tables: collapsed by default
- Deployment Notes: collapsed by default (with checkbox progress count in trigger label, e.g., "Deployment Notes (2/8 completed)")

### 4.3 Interactive Checkboxes

Used for: Deployment Notes checklists, pre-flight checklists, verification checklists, mandatory condition lists.

```css
.checkbox-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
}

.checkbox-input {
  appearance: none;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid var(--color-stone-300);    /* dark: #525252 */
  border-radius: 4px;
  background: white;                            /* dark: #262626 */
  cursor: pointer;
  margin-top: 2px;
  transition: all 150ms ease;
  position: relative;
}

.checkbox-input:checked {
  background: var(--color-green-500);
  border-color: var(--color-green-500);
}

.checkbox-input:checked::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 6px;
  height: 11px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:focus-visible {
  outline: 2px solid var(--color-blue-500);
  outline-offset: 2px;
}
```

**Checked label styling:** When checked, the label text shifts to `--color-stone-400` (dark: `--color-dark-muted`) and gets `text-decoration: line-through` with `text-decoration-color: var(--color-stone-300)`.

**localStorage binding:**
- Key format: `walkthrough-check-{phaseId}-{itemIndex}` (e.g., `walkthrough-check-phase-3-5`)
- On change: save `checked` state to localStorage immediately
- On page load: restore all checkbox states from localStorage
- Purely client-side; no server calls

### 4.4 Navigation Sidebar

```css
.sidebar {
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--color-stone-100);          /* dark: #1f1f1f */
  border-right: 1px solid var(--color-stone-200); /* dark: #333333 */
  padding: 24px 0;
  z-index: 100;
}
```

**Nav group labels** (e.g., phase group names like "PREPARATION", "CORE SETUP", "VALIDATION"):
```css
.nav-group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-stone-400);               /* dark: #737373 */
  padding: 8px 20px 4px;
  margin-top: 16px;
}
```

**Nav items:**
```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-stone-700);               /* dark: #a3a3a3 */
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 150ms ease;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--color-stone-200);          /* dark: #2a2a2a */
  color: var(--color-stone-800);               /* dark: #d4d4d4 */
}

.nav-item.active {
  background: var(--color-blue-100);           /* dark: #1e3a5f */
  color: var(--color-blue-600);                /* dark: #60a5fa */
  border-left-color: var(--color-blue-500);
  font-weight: 600;
}

.nav-item.completed {
  border-left-color: var(--color-green-500);
}
```

**Progress indicator dots** (prepended to each nav item):
- Circle: 8px diameter
- Not started: `--color-stone-300` fill (dark: `#525252`)
- In progress (active phase): `--color-blue-500` border (2px), transparent fill
- Completed: `--color-green-500` fill, white checkmark SVG (6px) centered inside

**Scroll spy:** Active nav item updates as user scrolls. Use `IntersectionObserver` with `rootMargin: "-20% 0px -70% 0px"`.

**Progress bar (bottom of sidebar):**
- Position: bottom of sidebar, above any padding
- Full width within sidebar padding (20px each side)
- Height: 4px
- Background: `--color-stone-300` (dark: `#404040`)
- Fill: `--color-blue-500`, proportional to completed phases
- Border-radius: 2px
- Label above: "Phase X of N complete" in `--color-stone-400`, 12px

**Mobile behavior (< 768px):**
- Sidebar hidden by default (off-screen left, transform: translateX(-100%))
- Hamburger button: 40px x 40px, position fixed top: 12px left: 12px, z-index: 200
- Icon: three horizontal lines, `--color-stone-700` (dark: `--color-dark-body`)
- Sidebar slides in: transform translateX(0), transition 200ms ease
- Backdrop: `rgba(0, 0, 0, 0.4)`, click to dismiss
- Close on nav item click
- Sidebar width on mobile: 280px

### 4.5 Phase Headers

```css
.phase-header {
  padding: 32px 0 24px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-stone-200); /* dark: #404040 */
}

.phase-number {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-blue-500);                /* dark: #60a5fa */
  margin-bottom: 4px;
}

.phase-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--color-stone-900);               /* dark: #f5f5f5 */
  margin-bottom: 8px;
}

.phase-meta {
  font-size: 14px;
  color: var(--color-stone-500);               /* dark: #a3a3a3 */
  line-height: 1.5;
}

.phase-meta strong {
  color: var(--color-stone-700);               /* dark: #d4d4d4 */
}
```

**Phase meta line format:** Shows "What we're doing" description, time estimate badge, and deeper context link.

**Time estimate badge:**
```css
.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--color-blue-200);           /* dark: #1e3a5f */
  color: var(--color-blue-600);                /* dark: #60a5fa */
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  margin-top: 8px;
}
```

**Security-critical phase accent:** Phases with security-critical content get an additional left border:
```css
.phase-header.security-critical {
  border-left: 4px solid var(--color-red-500); /* dark: #f87171 */
  padding-left: 16px;
}
```

### 4.6 Alert/Callout Boxes

Four variants: `critical`, `warning`, `tip`, `info`.

**Shared structure:**
```css
.callout {
  border-radius: 8px;
  padding: 16px 20px;
  margin: 16px 0;
  border-left: 4px solid;
  font-size: 15px;
  line-height: 1.6;
}

.callout-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
```

**Variant specifications:**

| Variant | BG (light) | BG (dark) | Border-left | Label Color (light) | Label Color (dark) | Label Text | Icon |
|---------|-----------|-----------|-------------|--------------------|--------------------|-----------|------|
| `critical` | `#fef2f2` | `#450a0a` | `#ef4444` (dark: `#f87171`) | `#dc2626` | `#f87171` | "CRITICAL" | Shield with exclamation (20px) |
| `warning` | `#fef2f2` | `#450a0a` | `#f59e0b` (dark: `#fbbf24`) | `#dc2626` | `#f87171` | "WARNING" | Triangle with exclamation (20px) |
| `tip` | `#fffbeb` | `#451a03` | `#f59e0b` (dark: `#fbbf24`) | `#92400e` | `#fbbf24` | "TIP" | Lightbulb (20px) |
| `info` | `#eff6ff` | `#1e3a5f` | `#3b82f6` (dark: `#60a5fa`) | `#2563eb` | `#60a5fa` | "INFO" | Circle with "i" (20px) |

**Icon placement:** Inline with the label text, 4px gap. Icon color matches label color.

**Usage mapping:**
- `critical`: Gate blocks, stop directives, non-negotiable conditions
- `warning`: Consequence descriptions when outcome is harmful, vulnerability descriptions, attack chain descriptions
- `tip`: Operational recommendations, community tips, deferrable items, lessons from experience
- `info`: Educational context, general explanations, transferable concept callouts

### 4.7 Tables

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

.data-table th {
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
  color: var(--color-stone-700);               /* dark: #d4d4d4 */
  background: var(--color-stone-100);          /* dark: #262626 */
  border-bottom: 2px solid var(--color-stone-300); /* dark: #404040 */
}

.data-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-stone-200); /* dark: #333333 */
  color: var(--color-stone-700);               /* dark: #d4d4d4 */
  vertical-align: top;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table code {
  font-size: 13px;
}
```

**Mobile (< 768px):** Tables wrapped in a div with `overflow-x: auto` and `-webkit-overflow-scrolling: touch`.

### 4.8 Inline Code

```css
code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 14px;
  background: var(--color-stone-200);          /* dark: #333333 */
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-stone-700);               /* dark: #d4d4d4 */
}
```

### 4.9 Deployment Notes Sections

Each phase ends with a Deployment Notes section. Visually distinct from instructional content.

```css
.deployment-notes {
  background: var(--color-stone-100);          /* dark: #222222 */
  border: 1px dashed var(--color-stone-300);   /* dark: #404040 */
  border-radius: 8px;
  padding: 20px 24px;
  margin: 24px 0 40px 0;
}

.deployment-notes-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-stone-800);               /* dark: #e5e5e5 */
  margin-bottom: 12px;
}
```

**Text input fields (for notes and version placeholders):**
```css
.notes-input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: 13px;
  border: 1px solid var(--color-stone-300);    /* dark: #404040 */
  border-radius: 6px;
  background: white;                            /* dark: #1a1a1a */
  color: var(--color-stone-700);               /* dark: #d4d4d4 */
  resize: vertical;
  min-height: 36px;
}

.notes-input:focus {
  outline: 2px solid var(--color-blue-500);
  outline-offset: 1px;
  border-color: var(--color-blue-500);
}
```

localStorage key: `walkthrough-note-{phaseId}-{fieldName}`. Save on input/change event with 500ms debounce.

### 4.10 "Understanding" Sections

These are the primary educational content. They deserve special visual treatment to signal "this is the learning, not just the commands."

```css
.understanding-section {
  border-left: 4px solid var(--color-amber-500);  /* dark: #fbbf24 */
  background: var(--color-amber-50);               /* dark: #451a03 at 30% opacity */
  border-radius: 0 8px 8px 0;
  padding: 20px 24px;
  margin: 16px 0;
}

.understanding-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-amber-500);               /* dark: #fbbf24 */
  margin-bottom: 8px;
}
```

When used inside an expandable section, the trigger label inherits the amber color and shows a lightbulb icon (16px) before "Understanding: [topic]".

---

## 5. Curriculum Design Principles

### 5.1 Content Density Rules

**Max 3-4 concepts per visible section before requiring user action.** A "concept" is one discrete piece of information: a configuration setting, a command and its purpose, a security rationale. User actions include: clicking to expand a section, scrolling past a visible phase-step divider, or interacting with a checkbox/input.

Concrete rules:
- Each numbered step shows its introductory explanation (1-2 paragraphs) and primary code block as immediately visible
- Explanatory tables go inside an expandable labeled with what they explain
- Troubleshooting goes inside an expandable
- "Expected output" goes inside an expandable if longer than 2 lines
- Configuration blocks with inline comments are immediately visible (they are the primary action); the explanation table for each setting is expandable

### 5.2 Visual-to-Text Ratio

Each phase should have at least one visual element (diagram, table, or callout box) per 400 words of prose. This prevents wall-of-text fatigue.

**When planning diagrams for a new output:** Ensure each phase has at least one visual element. Common diagram types include:
- Before/after state comparisons
- Architecture or system layer diagrams
- Data flow or sequence diagrams
- Security boundary or defense-in-depth diagrams
- Process or workflow diagrams
- Monitoring or operational cadence layouts

### 5.3 Section Type Visual Differentiation

Three distinct section types appear throughout the walkthrough. Each must be visually distinguishable at a glance without reading the text.

**"Understanding" sections:**
- Amber left border (4px), amber-tinted background
- Always inside an expandable trigger, expanded by default on first visit to the phase
- Lightbulb icon before the label
- Label: "Understanding: [topic]" in amber
- Tone: explanatory, conceptual, transferable -- the learning content

**"Command" sections (the numbered steps):**
- No special background -- standard content area
- Step number in `--color-blue-500` bold (e.g., "3.1:")
- Step title as h3
- Code blocks are the visual anchor
- Tone: direct, procedural, action-oriented

**"Deployment Notes" sections:**
- Dashed border, light surface background (see 4.9)
- Always at the end of each phase, inside an expandable
- Interactive checkboxes and text inputs
- Tone: the reader fills these in during deployment

### 5.4 When to Use Each Visual Element

| Element | Use When | Do Not Use When |
|---------|----------|----------------|
| Rough.js diagram | Showing system architecture, data flow, security layer relationships, or process sequences | Showing simple lists, command output, or tabular data |
| Callout (critical) | A misconfiguration could cause security harm or data loss | The consequence is inconvenience, not harm |
| Callout (warning) | Something could go wrong and needs user attention | Routine expected-output documentation |
| Callout (tip) | Practical advice, community wisdom, deferrable items, experience lessons | Core security instructions (use critical instead) |
| Callout (info) | General educational context, transferable concepts | Anything that requires action (use tip or warning) |
| Expandable section | Content exceeds 3-4 concepts, or content is supplementary/reference | Primary instructions the reader must see to proceed |
| Table | Comparing options, listing settings with explanations, structured checklists | Narrative explanation (use prose) |
| Code block | Any command or configuration the reader needs to copy | Conceptual descriptions of behavior |
| Inline code | File paths, command names, config keys, port numbers referenced in prose | General technical terms in conceptual context |

### 5.5 Concept-to-Pattern Mapping for Diagrams

Before drawing any diagram, classify the concept's **behavior** — what it *does*, not what it *is*. A "gateway" is a noun; "transforms input to output through stages" is the behavior that determines visual pattern. The mapping table below connects conceptual behaviors to the visual patterns that structurally communicate them.

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

**When no pattern fits:** If a concept does not map cleanly to any row above, it is likely too complex for a single diagram. Split it into two diagrams (each mapping to a row), or represent it as prose + table instead of forcing a visual. A diagram that requires a paragraph of explanation to interpret has failed.

**Rendering technology decision guide:**

- **Rough.js** — Default choice. Use when spatial layout communicates meaning: positions, relative sizes, containment, adjacency, and directional flow all carry information. Rough.js gives you full control over element placement.
- **Mermaid sequence diagram** — Use when the concept is ordered interactions between named actors (vertical lifelines with horizontal messages). Mermaid's sequence diagram syntax is purpose-built for this pattern and produces cleaner results than hand-positioning lifelines in Rough.js.
- **Mermaid flowchart** — Use only for simple directed flows with 5 or fewer nodes and no spatial semantics beyond "A leads to B." If you need containment, grouping, or positional meaning, use Rough.js instead.
- **HTML/CSS** — Use when the diagram needs interactivity (hover states, click-to-expand, dynamic content) or when the "diagram" is really a structured layout (card grids, comparison tables with visual styling).

### 5.6 Diagram Design Process

Every diagram in an output must pass through this 4-step process before any rendering code is written. Skipping steps produces diagrams that look technical but communicate nothing.

**Step 1 — Classify the concept.** Ask: "What does this concept DO?" Write a one-sentence behavior description. Do not use the concept's name in the description. "The gateway processes messages" is a name, not a behavior. "Transforms raw user input through authentication, routing, and sandboxing stages into a safe agent response" is a behavior.

**Step 2 — Select the pattern.** Match the behavior from Step 1 to the mapping table in 5.5. If the behavior matches multiple rows, the concept is compound — split it into separate diagrams, one per behavior. If it matches zero rows, use prose + table instead.

**Step 3 — Run the Isomorphism Test.** Mentally strip all text labels from the planned diagram. Ask: "Would the shape, structure, and spatial relationships alone communicate the concept to someone who knows the domain?" If the answer is no — if the diagram would be meaningless without labels — the pattern is wrong. An Assembly Line should *look like* sequential transformation. Nested Layers should *look like* containment. If your Cycle looks identical to your Timeline once labels are removed, one of them has the wrong pattern.

**Step 4 — Choose rendering tech and build.** Use the rendering technology decision guide from 5.5 to select the technology, then build per the specifications in Section 6 (Diagram Style Rules).

**The Variety Rule:** In any output with more than three major diagrams, each should use a different visual pattern from the 5.5 table. If three diagrams are all Mermaid LR flowcharts (or all Rough.js left-to-right box-and-arrow layouts), at least two are almost certainly using the wrong pattern. Go back to Step 1 for each and re-classify the behavior. Different concepts behave differently — their diagrams should look structurally different.

**Connection to depth assessment:** The depth of the output determines how much diagramming is needed:
- **Scan depth** (surface-level overview): Use simple patterns only — Assembly Line, Side-by-Side, Card Layout. One diagram per major concept. Labels carry most of the meaning.
- **Deep-dive depth** (full walkthrough): Patterns PLUS evidence artifacts. Diagrams should pass the Isomorphism Test rigorously. Include annotations linking to source evidence. Use the full range of patterns from 5.5. Each diagram earns its place by communicating something prose cannot.

---

## 6. Diagram Style Rules (Rough.js)

### 6.1 Rough.js Configuration

```javascript
const diagramDefaults = {
  roughness: 1.8,        // Hand-drawn feel. Range 1.5-2.0. 1.8 is standard.
  bowing: 1,             // Slight curve to straight lines
  strokeWidth: 2,        // All strokes 2px
  fillStyle: 'hachure',  // Default fill pattern for standard nodes
  fillWeight: 1.5,       // Weight of fill pattern strokes
  hachureGap: 6,         // Gap between fill pattern lines
  hachureAngle: -41,     // Fill line angle (consistent across all diagrams)
  curveFitting: 0.95,    // Smoothness of curves
  curveStepCount: 9      // Curve resolution
};
```

### 6.2 Node Styles

**Standard rectangle node** (e.g., system components, services):
- Width: 140px, Height: 50px (minimum; expand for longer text)
- Fill: `hachure` pattern
- Stroke: `--color-stone-700` (dark: `--color-dark-body`)
- Fill color: mapped by category (see 6.5)

**Small rectangle node** (e.g., sub-components, internal labels):
- Width: 100px, Height: 40px
- Same style as standard, scaled down

**Circle/ellipse node** (e.g., external services, user endpoints):
- Diameter: 60px (or ellipse: 80x50)
- Fill: `cross-hatch` pattern (to visually distinguish from rectangles)
- Stroke and fill color: mapped by category (see 6.5)

**Security boundary** (dashed rectangle enclosing protected components):
- Stroke: `--color-red-500` (dark: `--color-red-400`)
- strokeLineDash: `[8, 4]`
- Fill: none
- roughness: 1.2 (slightly less rough than nodes, for cleaner boundaries)
- Label: positioned top-center, outside the boundary rectangle

### 6.3 Connector/Arrow Styles

```javascript
const arrowDefaults = {
  stroke: '--color-stone-500',     // dark: '--color-dark-muted'
  strokeWidth: 2,
  roughness: 1.5
};
```

- Arrowheads: filled triangles, 8px wide, 10px long
- Data flow arrows: solid stroke
- Security boundary crossings: `--color-red-500` stroke with heavier weight (3px)
- Optional/future connections: dashed stroke (`strokeLineDash: [6, 4]`)
- Return path arrows: below the main flow, dashed

### 6.4 Labels

- Font: `--font-body` for node labels and annotations; `--font-mono` only for paths/commands
- Node label size: 13px, weight 600
- Connector label size: 11px, weight 400
- Annotation size: 11px, weight 400, italic
- Color: `--color-stone-800` (dark: `--color-dark-heading`)
- Position: centered inside nodes; above or below connectors (never overlapping strokes)
- Label background: semi-transparent `rgba(255,255,255,0.85)` (dark: `rgba(26,26,26,0.85)`) behind connector labels for readability

### 6.5 Color Mapping for Diagram Elements

| Category | Fill Color (light) | Fill Color (dark) | Stroke Color (light) | Stroke Color (dark) | Used For |
|---------|-------------------|-------------------|---------------------|---------------------|----------|
| Infrastructure | `#dbeafe` (blue-100) | `#1e3a5f` (blue-900) | `#3b82f6` (blue-500) | `#60a5fa` (blue-400) | Core platform components, service managers, firewalls |
| Security | `#fee2e2` (red-100) | `#450a0a` (red-900) | `#ef4444` (red-500) | `#f87171` (red-400) | Sandboxes, access controls, security boundaries, attack nodes |
| External Service | `#e0e7ff` (indigo-100) | `#312e81` (indigo-900) | `#6366f1` (indigo-500) | `#818cf8` (indigo-400) | Third-party APIs, external platforms |
| Agent/LLM | `#f3e8ff` (purple-100) | `#3b0764` (purple-900) | `#a855f7` (purple-500) | `#c084fc` (purple-400) | AI agents, LLM layers, model routing |
| Data/Config | `#dcfce7` (green-100) | `#052e16` (green-900) | `#22c55e` (green-500) | `#4ade80` (green-400) | Config files, credentials, session data |
| User/Operator | `#fef3c7` (amber-100) | `#451a03` (amber-900) | `#f59e0b` (amber-500) | `#fbbf24` (amber-400) | User devices, user actions, attacker in vulnerability diagrams |
| Neutral | `#f5f5f4` (stone-100) | `#262626` (dark-surface) | `#a8a29e` (stone-400) | `#737373` (dark-muted) | OS, hardware, generic containers |

### 6.6 Consistent Node Sizing

- All nodes in a single diagram use the same height (either 40px or 50px)
- Width varies by text length but snaps to nearest 20px increment: 100, 120, 140, 160, 180, 200px
- Minimum spacing between nodes: 40px horizontal, 30px vertical
- Diagram canvas padding: 20px on all sides
- Maximum diagram width: 720px (fits within 780px content area with content padding)
- Maximum diagram height: 500px (avoids overwhelming the page)

### 6.7 Dark Mode Diagram Adjustments

- All stroke colors shift to their dark column (see 6.5 table)
- All fill colors shift to their dark column (see 6.5 table)
- Canvas background: transparent (inherits page background)
- Label background shifts to `rgba(26,26,26,0.85)`
- Security boundary dashes shift from `--color-red-500` to `--color-red-400`
- On theme toggle, re-render all visible diagrams with updated colors

---

## 7. Example Diagram Specifications (from Output #1 — OpenClaw)

> **Note for new outputs:** This section shows the 8 diagrams designed for the OpenClaw deployment walkthrough. Use these as examples of the level of specificity required when defining diagrams for your output. Each diagram definition should include: type, exact nodes with categories, connections with labels, annotations, and dimensions.

### 7.1 Machine State Before/After (Phase 0)

**Type:** Side-by-side comparison (two columns)
**Left column ("Before"):** Nodes showing previous state (security-red tint), each marked with X
**Right column ("After"):** Nodes showing target state (green tint), each marked with checkmark
**Arrow:** Single horizontal arrow between columns labeled with the phase name
**Size:** 720px x 300px

### 7.2 Security Layers Stack (Phase A)

**Type:** Vertical stack diagram (bottom to top, widest at bottom)
**Layers:** OS foundation at bottom (neutral, widest) through application-level isolation at top (narrowest)
**Each layer labeled on the right with its step number**
**Size:** 400px x 350px, centered

### 7.3 Platform Architecture (Phase C)

**Type:** Three-layer horizontal flow
**Pattern:** Input channel (circle, external) -> Adapter (small rect) -> Core platform (large rect with internal components) -> Agent (rect) -> API (circle, external)
**Arrows:** Left-to-right labeled with data types
**Size:** 720px x 250px

### 7.4 Defense in Depth (Phase D)

**Type:** Concentric rectangles (onion/nested layers)
**Pattern:** Outermost auth boundary -> sandbox -> approval controls -> policy -> agent at center
**Annotation:** "Each layer holds independently if another fails"
**Size:** 500px x 400px, centered

### 7.5 Vulnerability Attack Chain (Phase D)

**Type:** Horizontal flow showing attack steps with mitigation annotations
**Pattern:** Attacker -> exploit vector -> target -> escalation -> impact (each step annotated with the defense that blocks it)
**Size:** 720px x 200px

### 7.6 Model Routing Failover (Phase E)

**Type:** Vertical fallback chain
**Pattern:** Input -> primary model (solid border) -> fallback model (dashed border)
**Size:** 300px x 300px, centered

### 7.7 Message Flow (Phase F)

**Type:** Horizontal sequence showing full round-trip
**Pattern:** User -> external API -> platform (with internal flow) -> agent -> LLM API, with return path below (dashed)
**Size:** 720px x 280px

### 7.8 Monitoring Cadence (Phase I)

**Type:** Three-column card layout (Daily / Weekly / Monthly)
**Each column:** Tinted header with list of operational tasks
**Size:** 720px x 250px

---

## 8. Global Behavior

### 8.1 Dark Mode Toggle

- Position: top-right of sidebar header area, before the first nav group
- Size: 36px x 36px button
- Background: transparent; hover: `--color-stone-200` (dark: `#333333`)
- Border: 1px solid `--color-stone-300` (dark: `#404040`)
- Border-radius: 8px
- Icon: sun SVG (20px) when in dark mode (click to switch to light), moon SVG (20px) when in light mode
- Persistence: `localStorage` key `walkthrough-theme`
- Default: follows `prefers-color-scheme` media query on first visit
- On toggle: set `data-theme` attribute on `<html>`, re-render all visible diagrams
- Transition: `background-color 200ms ease, color 200ms ease, border-color 200ms ease` on `*`

### 8.2 Scroll Behavior

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 24px;
}
```

### 8.3 Focus Styles

```css
:focus-visible {
  outline: 2px solid var(--color-blue-500);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

### 8.4 Print Styles

```css
@media print {
  .sidebar { display: none; }
  .expandable-content { display: block !important; }
  .code-block .copy-btn { display: none; }
  .code-block { break-inside: avoid; }
  .phase-header { break-before: page; }
  .callout { break-inside: avoid; }
  .data-table { break-inside: avoid; }
  [data-theme] { color-scheme: light; } /* Force light mode */
  body { font-size: 12px; max-width: none; }
}
```

### 8.5 Phase Completion Tracking

When all `.checkbox-input` elements within a phase's `.deployment-notes` section are checked:
- The nav sidebar progress dot for that phase changes to green fill + white checkmark
- The nav item gets `border-left-color: var(--color-green-500)`
- The progress bar at the bottom of the sidebar updates its fill proportionally
- No confetti, no modals -- just the quiet state change

### 8.6 No-JavaScript Fallback

- All expandable sections render as visible (display: block)
- Checkboxes function as standard HTML checkboxes (without localStorage persistence)
- Dark mode toggle hidden; page renders in light mode (or respects `prefers-color-scheme` via CSS-only media query)
- Diagrams show `<noscript>` text descriptions of the architecture
- Copy buttons hidden

---

## 9. Responsive Breakpoints

| Breakpoint | Sidebar | Content Max Width | Content Padding | Phase Title Size |
|------------|---------|-------------------|-----------------|-----------------|
| >= 1024px | 260px, fixed left | 780px | 40px | 28px |
| 768-1023px | 240px, fixed left | fills remaining | 24px | 24px |
| < 768px | Hidden (hamburger) | 100% | 20px | 22px |

**Mobile-specific (< 768px):**
- Code block font: 13px (unchanged; horizontal scroll handles overflow)
- Tables: horizontal scroll wrapper with `-webkit-overflow-scrolling: touch`
- Diagrams: re-render at narrower width; simplify layout if necessary (remove annotations, stack vertically)
- All interactive touch targets: minimum 44px x 44px
- Sidebar overlay: `rgba(0,0,0,0.4)` backdrop

---

---

## 10. Construction Process

This style guide defines **WHAT** interactive walkthrough outputs look like — every color, spacing value, component spec, and curriculum design rule needed to build without guessing.

For **HOW** complex walkthroughs get built (the incremental construction process, cross-reference management, namespace conventions, and section-by-section build discipline), see `engine/methodology/section-construction.md`. That document activates for deep-dive depth outputs that exceed ~500 lines and provides the build process that ensures a 3,000-line walkthrough maintains the quality standards defined here from first section to last.

---

*End of engine style guide template. Every visual decision is defined. Build without guessing. Adapt section 7 for each new output.*
