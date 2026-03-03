# Session State — ClawdBot Research Project

**Last Updated:** 2026-03-03
**Last Session Summary:** Major pivot session. GitHub repo created (SeanECurrie/on-demand-curriculum, private). Brainstorming session designed the On-Demand Curriculum Engine — restructuring this repo into a three-layer architecture (DNA + Engine + Outputs) that can produce tailored interactive walkthroughs for different people on different topics. OpenClaw project becomes Output #1. Design doc and 17-task implementation plan written and committed. Plan ready for execution.

## Walkthrough Progress

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Machine Preparation | not_started | Overhauled 2026-02-22 — now includes connectivity check, macOS updates, revised iCloud approach. Ready when Sean is. |
| A | macOS Hardening | not_started | |
| B | Runtime Setup | not_started | |
| C | OpenClaw Installation | not_started | Deploy version >= 2026.2.19 |
| D | Security Hardening | not_started | Evaluate SecureClaw (adversa-ai/secureclaw) during this phase |
| E | Model Configuration | not_started | |
| F | Channel Setup | not_started | |
| G | Starter Skills & First Run | not_started | Zero ClawHub policy — custom Markdown skills only |
| H | Validation | not_started | |
| I | Post-Deployment | not_started | |

Status values: not_started | in_progress | completed | blocked | deferred

## Current Focus

**Active task:** Execute On-Demand Curriculum Engine restructure
**Phase step:** Implementation plan approved. Ready to execute Phase 1 (Systematic Audit).
**Blockers:** None — plan at `docs/plans/2026-03-03-on-demand-curriculum-engine-implementation.md`

## Next Up

1. **Execute engine restructure plan** — 17 tasks, 5 phases, 4 review checkpoints
   - Phase 1: Systematic audit (Tasks 1-3) — file inventory, classification, manifest
   - Phase 2: Engine extraction (Tasks 4-8) — methodology, intake, templates, patterns
   - Phase 3: Output relocation (Tasks 9-12) — move OpenClaw content, verify self-containment
   - Phase 4: Engine constitution (Tasks 13-14) — rewrite CLAUDE.md, engine CONTEXT.md
   - Phase 5: Verification (Tasks 15-17) — file accounting, reference integrity, report
2. After restructure: test engine by producing Output #2 (candidate: Jeff, OpenClaw, MacBook Air)
3. OpenClaw deployment on DevHub remains queued (walkthrough phases 0-I unchanged)

## Session History (Last 5)

| Date | What Happened | Outcome |
|------|--------------|---------|
| 2026-03-03 | On-Demand Curriculum Engine brainstorming + design + plan | GitHub repo created (SeanECurrie/on-demand-curriculum). 4 parallel audit agents classified every file as engine/output/DNA. Design doc written (three-layer architecture, 5-stage pipeline). 17-task implementation plan across 5 phases with 4 review checkpoints. Catalyst: Jeff (friend/business owner) asking about OpenClaw. |
| 2026-02-22 | Ecosystem snapshot + interactive walkthrough planning | OpenClaw ecosystem researched (external). Interactive walkthrough planned: 4-agent team, Rough.js+Mermaid.js, project-relative at docs/walkthrough/interactive/. Source→derivative sync encoded. |
| 2026-02-22 | Phase 0 overhaul + session restart skill creation | Walkthrough Phase 0 expanded with practical DevHub prep (connectivity, updates, revised iCloud). Deployment plan deduplicated. Crib sheet aligned. Skill created at skills/session-restart/. |
| 2026-02-22 | Staleness sweep + purpose refinement + doc updates | 8 ecosystem changes tracked. All 6 operational docs updated. Purpose refined: learning lab framing. CLAUDE.md rewritten. |
| 2026-02-14 | Phase 0 initial creation + Phase A/B adjustments | Phase 0 added to walkthrough for existing Mac Mini prep. |

## Decisions Made This Phase

- Deploy version >= 2026.2.19 (not 2026.1.29) — 4 additional CVEs discovered post-original research
- No full wipe of DevHub — targeted Phase 0 prep instead
- iCloud: disable sync services individually, don't sign out of Apple ID (prevents system lockout)
- Evaluate SecureClaw during Phase G security hardening
- Zero ClawHub skills policy even more critical — malicious skills grew from 12% to ~20%
- **NEW (2026-03-03):** Repo restructured into On-Demand Curriculum Engine — three-layer architecture (DNA + Engine + Outputs)
- **NEW (2026-03-03):** OpenClaw project becomes Output #1, not the whole repo
- **NEW (2026-03-03):** GitHub repo created under SeanECurrie/on-demand-curriculum (private)
- **NEW (2026-03-03):** Engine pipeline: intake → research → synthesis → output generation → delivery

## Notes for Next Session

- **PRIMARY TASK: Execute the implementation plan** at `docs/plans/2026-03-03-on-demand-curriculum-engine-implementation.md`
- Use `superpowers:executing-plans` skill to run the plan task-by-task
- Plan has 17 tasks across 5 phases with 4 review checkpoints (Sean approves between phases)
- Start with Phase 1 Task 1 (full file inventory) — this is the systematic audit
- The plan is designed for subagent-driven execution — Tasks 1-3 can run as parallel agents
- **Design doc** for reference: `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md`
- **Jeff context (for future Output #2):** Real estate business owner, AI-new but tech-capable, wants OpenClaw on a new MacBook Air (refreshed Wed), use cases: social media growth, client presentations, efficiency. Full iMessage dump captured during brainstorming session (in conversation context, not saved to file yet).
- DevHub deployment (walkthrough phases 0-I) is still queued but takes backseat to engine restructure
- Staleness: 9 days since last ecosystem check (2026-02-22). May want to do a quick staleness sweep after restructure is done, before producing Output #2.
