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

## Engine Structure

- engine/methodology/ — Research methodology, credibility tiers, hardening framework
- engine/intake/ — Intake process, operator profile template
- engine/templates/ — Output scaffolding, report frameworks, walkthrough style guide
- engine/patterns/ — Cross-output reusable patterns
- engine/skills/ — Engine-level skills (session-restart)
- outputs/ — Per-person deliverables

## Engine Evolution Notes

- 2026-03-03: Engine created from restructure of ClawdBot Research Project
- Output #1 (OpenClaw/Sean) serves as reference implementation

## Key Decisions

- Engine talks to Sean, not end users (Sean is proxy)
- Outputs are self-contained (navigable without engine knowledge)
- Three-layer architecture: DNA (root) + Engine (process) + Outputs (content)
- Patterns are cross-output (engine level), findings are per-output

## What's Next

- Test engine by producing Output #2 (candidate: Jeff, OpenClaw, MacBook Air)
- Evaluate GitHub Pages for output delivery
