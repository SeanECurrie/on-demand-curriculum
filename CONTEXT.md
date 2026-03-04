# CONTEXT.md — On-Demand Curriculum Engine

**Last Updated:** 2026-03-03
**Staleness Threshold:** 5 days

## Engine Purpose

This engine produces tailored, research-backed interactive walkthroughs for specific people on specific topics. It combines dual-source intelligence (official documentation via Context7 + community truth via Bright Data), a structured evaluation framework (5 reports, 7 knowledge base buckets), and a three-tier hardening model into self-contained, navigable output packages.

Sean Currie is the operator and proxy for all intake — the engine talks to Sean, not end users. See `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md` for the full design document.

## Outputs Produced

| # | Output | Person | Topic | Status | Location |
|---|--------|--------|-------|--------|----------|
| 1 | OpenClaw Deployment | Sean Currie | OpenClaw agent platform | Complete (research + walkthrough ready) | outputs/openclaw-sean/ |
| 2 | OpenClaw Deployment | Jeff (Denver RE) | OpenClaw on MacBook Air + Instagram | Complete + Section 2b iteration (hardware choices) | outputs/openclaw-jeff/ |

## Engine Structure

- engine/methodology/ — Research methodology, credibility tiers, hardening framework
- engine/intake/ — Intake process, operator profile template
- engine/templates/ — Output scaffolding, report frameworks, walkthrough style guide
- engine/patterns/ — Cross-output reusable patterns
- engine/skills/ — Engine-level skills (session-restart, depth-assessment, self-test, findings-pattern, anti-pattern-check, section-construction, render-validate)
- outputs/ — Per-person deliverables

## Engine Evolution Notes

- 2026-03-03: Engine created from restructure of ClawdBot Research Project
- Output #1 (OpenClaw/Sean) serves as reference implementation
- 2026-03-03: Instructional design patterns integrated — 5 methodology docs + 5 operational skills
  Source: Reverse-engineered from Cole Medin's excalidraw-diagram-skill (meta-patterns, not tool-specific)
  Patterns: depth assessment, binary self-tests, findings pattern library, anti-pattern gallery, section construction
- 2026-03-03: Visual output methodology integrated — concept-to-pattern mapping, render-validate loop, diagram color reference, visual self-tests
  Source: Adapted from Cole Medin's Excalidraw diagram skill (methodology patterns, not tool-specific)
  Additions: style guide sections 5.5-5.6, diagram-color-reference.md, render-validate skill, visual self-tests (V1-V6), anti-pattern #11 (The Unverified Render)
  Validation: Retroactive audit of Output #1 confirms new tests catch documented failures

## Key Decisions

- Engine talks to Sean, not end users (Sean is proxy)
- Outputs are self-contained (navigable without engine knowledge)
- Three-layer architecture: DNA (root) + Engine (process) + Outputs (content)
- Patterns are cross-output (engine level), findings are per-output

## What's Next

- ~~Test engine by producing Output #2 (candidate: Jeff, OpenClaw, MacBook Air)~~ DONE
- Output #2 validated full pipeline: intake → research (80+ sources) → synthesis (5 reports) → output generation (2,810-line interactive HTML, 6 diagrams) → render-validate (V1-V6 PASS)
- Engine methodology proven: concept-to-pattern mapping, render-validate, split architecture discovery via DNA Principle #10
- 2026-03-03: Output #2 post-delivery iteration — Section 2b (Hardware Choices) added after Jeff confirmed dedicated machine + Mac Mini pivot
  - Engine learning: Anti-pattern #12 (The Contradictory Frame) + self-test X4 + intake Q10 update
  - New section: 4 subsections + hub-and-spoke diagram, render-validated, 14/16 self-tests passed (2 known deferred)
  - Deferred: Sections 3-5 still reference MacBook Air — will update after Jeff confirms purchase
- Evaluate GitHub Pages for output delivery
- Consider Output #3 candidate
