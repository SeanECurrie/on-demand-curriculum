# Diagram Color Reference — Single Source of Truth

**Created:** 2026-03-03
**Purpose:** This is the one file to read before generating any diagram. All diagram colors are defined here. Do not look elsewhere; do not invent new values.

**Origin:** Extracted from Section 6.5 of the walkthrough style guide. Pattern inspired by Cole Medin's `color-palette.md` approach — a standalone color file that diagram generators read directly, rather than hunting through a 1,000-line style guide.

---

## Semantic Color Mapping

Every diagram element belongs to exactly one semantic category. The category determines its fill and stroke colors.

| Category | Fill (Light) | Fill (Dark) | Stroke (Light) | Stroke (Dark) | Use For |
|----------|-------------|-------------|----------------|---------------|---------|
| Infrastructure | `#dbeafe` (blue-100) | `#1e3a5f` (blue-900) | `#3b82f6` (blue-500) | `#60a5fa` (blue-400) | Core platform components, service managers, firewalls |
| Security | `#fee2e2` (red-100) | `#450a0a` (red-900) | `#ef4444` (red-500) | `#f87171` (red-400) | Sandboxes, access controls, security boundaries, attack nodes |
| External Service | `#e0e7ff` (indigo-100) | `#312e81` (indigo-900) | `#6366f1` (indigo-500) | `#818cf8` (indigo-400) | Third-party APIs, external platforms |
| Agent/LLM | `#f3e8ff` (purple-100) | `#3b0764` (purple-900) | `#a855f7` (purple-500) | `#c084fc` (purple-400) | AI agents, LLM layers, model routing |
| Data/Config | `#dcfce7` (green-100) | `#052e16` (green-900) | `#22c55e` (green-500) | `#4ade80` (green-400) | Config files, credentials, session data |
| User/Operator | `#fef3c7` (amber-100) | `#451a03` (amber-900) | `#f59e0b` (amber-500) | `#fbbf24` (amber-400) | User devices, user actions, attacker in vulnerability diagrams |
| Neutral | `#f5f5f4` (stone-100) | `#262626` (dark-surface) | `#a8a29e` (stone-400) | `#737373` (dark-muted) | OS, hardware, generic containers |

---

## Connector and Line Colors

| Element | Color (Light) | Color (Dark) | Notes |
|---------|--------------|-------------|-------|
| Standard arrows | `#78716c` (stone-500) | `#737373` (dark-muted) | Solid stroke, 2px, roughness 1.5 |
| Security boundary crossings | `#ef4444` (red-500) | `#f87171` (red-400) | Heavier 3px stroke weight |
| Optional/future connections | `#78716c` (stone-500) | `#737373` (dark-muted) | Dashed `[6, 4]` |
| Return path arrows | `#78716c` (stone-500) | `#737373` (dark-muted) | Dashed, positioned below main flow |
| Security boundary dashes | `#ef4444` (red-500) | `#f87171` (red-400) | strokeLineDash `[8, 4]`, no fill |

---

## Label Colors

| Context | Color (Light) | Color (Dark) |
|---------|--------------|-------------|
| Node labels | `#292524` (stone-800) | `#e5e5e5` (dark-heading) |
| Connector labels | `#44403c` (stone-700) | `#d4d4d4` (dark-body) |
| Annotations | `#44403c` (stone-700), italic | `#d4d4d4` (dark-body), italic |
| Label backgrounds | `rgba(255,255,255,0.85)` | `rgba(26,26,26,0.85)` |

---

## How to Use This File

1. **Read this file before generating any diagram.** Do not rely on memory of color values.
2. **Classify each element by semantic category.** Ask: is this infrastructure, security, external, agent/LLM, data/config, user/operator, or neutral?
3. **Use the fill/stroke pair for that category — do not mix.** An infrastructure node gets infrastructure fill AND infrastructure stroke.
4. **Dark mode:** use the dark column values from each table. Do not adjust or approximate.
5. **New categories:** if nothing fits, use Neutral. Only propose adding a new category here if the same unclassifiable element appears across multiple outputs.

---

## Related Documents

- **Walkthrough style guide Section 6:** `engine/templates/walkthrough-style-guide.md` — full diagram design specifications (node shapes, sizing, connector styles, dark mode adjustments)
- **Section construction methodology:** `engine/methodology/section-construction.md` — how diagrams fit into the broader section-building process
- **Render-validate skill:** `engine/skills/render-validate/SKILL.md` — visual QA loop for verifying rendered diagrams match specifications *(planned — Task 4)*
