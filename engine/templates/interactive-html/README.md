# Interactive HTML Walkthrough — Engine Template

**Purpose:** Documents the interactive HTML shell that the On-Demand Curriculum Engine uses to deliver walkthroughs. This README describes what the shell provides, how content gets inserted, and what is parameterizable vs. fixed.

**Reference implementation:** Output #1 (OpenClaw) at `outputs/01-openclaw/docs/walkthrough/interactive/`

---

## What the HTML Shell Provides

The interactive HTML walkthrough is a single-page application (no build tools, no framework dependencies) that delivers a guided, phase-by-phase learning experience. It provides:

### Navigation
- **Sidebar navigation** with collapsible phase groups, progress indicator dots, and scroll spy that highlights the active section as the reader scrolls
- **Progress bar** at the bottom of the sidebar showing overall completion (Phase X of N)
- **Mobile hamburger menu** that slides the sidebar in as an overlay on screens < 768px

### Interactive Elements
- **Expandable/collapsible sections** for "Understanding" content (expanded by default), troubleshooting (collapsed), expected output (collapsed), and deployment notes (collapsed with completion count)
- **Interactive checkboxes** with localStorage persistence for deployment checklists, verification gates, and mandatory condition lists
- **Text input fields** with localStorage persistence and 500ms debounce for deployment notes (versions, observations, custom notes)
- **Code block copy buttons** with clipboard API integration and visual feedback (checkmark for 2s)

### Visual Design
- **Dark/light mode toggle** that respects `prefers-color-scheme` on first visit and persists choice to localStorage
- **Rough.js hand-drawn diagrams** that re-render on theme toggle with appropriate color mapping
- **WCAG AA compliant** color palette with verified contrast ratios for all text/background combinations
- **Print stylesheet** that expands all collapsed sections, hides interactive chrome, and forces light mode

### Accessibility
- `focus-visible` outlines on all interactive elements
- Minimum 44x44px touch targets on mobile
- Semantic HTML structure (nav, main, section, article)
- `<noscript>` fallback text for diagrams
- Keyboard-navigable expandables and checkboxes

---

## How Content Gets Inserted

The walkthrough is organized as: **Phases > Sections > Steps**

### Phases
Each phase is a major unit of the walkthrough (e.g., "Machine Preparation", "Security Hardening", "Validation"). Phases map to top-level sections in the HTML with their own `<section id="phase-X">` container.

A phase contains:
- **Phase header** — number label, title, meta description, time estimate badge
- **One or more sections** — the instructional content
- **Deployment notes** — the interactive checklist at the end

### Sections
Within a phase, sections are the instructional blocks. Each section typically contains:
- An introductory paragraph (1-2 sentences of context)
- One or more **steps** with code blocks and configuration
- **Understanding** expandables with educational content
- **Troubleshooting** expandables for when things go wrong
- Callout boxes (critical, warning, tip, info) as needed

### Steps
Steps are the atomic units — a single command to run, a single file to edit, a single concept to understand. Steps follow a consistent pattern:
1. Step number and title (e.g., "3.1: Configure authentication")
2. Brief explanation of what and why
3. Code block with the command or configuration
4. Optional expandable with deeper explanation or expected output

### Nav Group Mapping
Phases are grouped in the sidebar navigation under descriptive group labels. For example, Output #1 uses groups like "PREPARATION", "DEPLOYMENT", "VALIDATION". Each output defines its own group labels based on the logical flow of its content.

---

## What Is Parameterizable

These elements change for each output:

| Parameter | Description | Example (Output #1) |
|-----------|-------------|---------------------|
| Phase count | Number of phases in the walkthrough | 10 (Phase 0 through Phase I) |
| Phase names | Title and number label for each phase | "Phase D: Security Hardening" |
| Phase content | All instructional text, code blocks, tables | OpenClaw-specific commands and configs |
| Nav group labels | Sidebar section groupings | "PREPARATION", "DEPLOYMENT", "VALIDATION" |
| Nav group assignments | Which phases belong to which group | Phases 0-B = Preparation, C-G = Deployment, H-I = Validation |
| Diagram definitions | Rough.js diagram specs (nodes, connections, layout) | Gateway architecture, defense-in-depth layers |
| Time estimates | Per-phase time badges | "~15 minutes", "~30 minutes" |
| Security-critical flags | Which phases get the red left-border accent | Phases D and H in Output #1 |
| Checkbox items | Deployment notes checklist content | "Auth token configured", "Sandbox mode verified" |
| Text input fields | Notes fields with custom labels | "Version installed: ___", "Observed behavior: ___" |
| localStorage key prefixes | Namespace for persistence | `walkthrough-check-phase-d-3` |

---

## What Stays Fixed

These elements are part of the engine framework and do not change between outputs:

| Fixed Element | Why It Is Fixed |
|--------------|----------------|
| CSS design system (color palette, typography, spacing) | Consistent brand and accessibility across all outputs |
| Component CSS (code blocks, expandables, checkboxes, callouts, tables) | Tested, accessible, WCAG-verified implementations |
| JavaScript interactions (expand/collapse, copy, localStorage, scroll spy, theme toggle) | Behavioral consistency; tested for edge cases |
| Responsive breakpoints (1024px, 768px) | Optimized for common device classes |
| Print stylesheet | Consistent print experience |
| Accessibility features (focus styles, touch targets, noscript fallback) | Non-negotiable for all outputs |
| Rough.js configuration defaults (roughness, bowing, fill style) | Visual consistency of the hand-drawn aesthetic |
| Diagram color category mapping (7 categories) | Consistent visual language across outputs |

---

## Reference Materials

- **Full style guide:** `engine/templates/walkthrough-style-guide.md` — every visual decision, pixel-level specifications
- **Reference implementation:** Output #1's interactive HTML (the OpenClaw walkthrough) — the living example of this template in action
- **Pattern library:** `engine/patterns/` — reusable security and architecture patterns that may inform content

---

## Future Work

Actual HTML template extraction (a parameterizable HTML file with placeholder slots) is planned but not yet implemented. Currently, Output #1's HTML serves as the reference implementation. New outputs should be built by:

1. Copying Output #1's HTML structure
2. Replacing all phase content, nav labels, and diagram definitions
3. Updating localStorage key prefixes to avoid namespace collisions
4. Following the style guide for any new component needs

The goal is to eventually produce a generator that takes structured content (phases, steps, diagrams) and produces the final HTML automatically. Until then, the style guide and this README are the authoritative references.
