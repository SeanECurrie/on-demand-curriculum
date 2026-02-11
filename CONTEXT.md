# CONTEXT.md — ClawdBot Research Project

**Last Updated:** 2026-02-11
**Staleness Threshold:** 5 days (flag if older)

## Current Status

- **Phase:** 1 COMPLETE — ready for Phase 2 (Architecture Deep-Dive) pending Sean's review
- **OpenClaw deployment:** NOT YET — research first. CRITICAL: Must deploy version >= 2026.1.29 (CVE patches).
- **Skill chain position:** brainstorming COMPLETED → writing-plans COMPLETED → subagent-driven-development IN PROGRESS (Phase 1 tasks done, Phase 2 pending)

## Phase 1 Summary

**Research completed across 100+ sources (Context7 + Bright Data):**
- Context7 foundation: OpenClaw official docs, Tailscale, Telegram Bot API, Node.js
- Bright Data sweeps: community intelligence (41 sources), Mac Mini deployment (42 sources), competitive landscape (16 sources), security deep-dive (48+ sources)
- 5 synthesis reports produced
- 28 strategic insights logged

**Key verdicts:**
- **Mac Mini:** GO — M4 16GB is overpowered for this use case, community-validated
- **OpenClaw:** GO with mandatory hardening — 2 critical CVEs, 12% malicious skills ecosystem
- **Landscape:** OpenClaw is right category choice — no true competitor for self-hosted agent product
- **Recommended stack:** OpenClaw + n8n (deterministic workflows) + Langfuse (observability)

## What Exists

### Foundation
- CLAUDE.md constitution
- Operator context files (profile, genesis, Tim transcript)
- Design document: `docs/plans/2026-02-10-clawdbot-research-project-design.md`
- Implementation plan: `docs/plans/2026-02-10-implementation-plan.md`

### Knowledge Base (7 buckets)
- `01-landscape/` — Competitive landscape (16 sources)
- `02-architecture/` — OpenClaw official docs + adjacent tech docs (Context7)
- `03-security/` — Security posture analysis (48+ sources, 798 lines)
- `04-deployment/` — macOS official docs + Mac Mini community findings (42 sources)
- `05-skills-and-integrations/` — Empty (Phase 2 target)
- `06-community-intelligence/` — Community findings (41 sources)
- `07-operations/` — Empty (Phase 3 target)

### Research Reports
- `01-landscape-report.md` — AI agent landscape analysis
- `02-architecture-reference.md` — OpenClaw architecture reference
- `03-mac-mini-feasibility.md` — Mac Mini M4 feasibility (VERDICT: GO)
- `04-security-evaluation.md` — Security evaluation (VERDICT: GO with hardening)
- `05-open-questions.md` — 30 unresolved questions, 6 deployment blockers

## What's Next

1. **Phase 1 checkpoint with Sean** — present findings, discuss open questions, confirm Phase 2 direction
2. **Phase 2: Architecture Deep-Dive** (Tasks 13-15)
   - Deep architecture investigation (orchestration, data flow, internals)
   - Skills & integrations research (skill system, security per skill, starter recommendations)
   - Phase 2 completion review
3. **Phase 3: Deployment Plan** (Tasks 16-18)
   - Mac Mini deployment plan
   - Execute deployment (when approved)
   - Establish living system

## Open Questions (Top 6 — Deployment Blockers)

1. CVE-2026-25253 patch verification — MUST confirm version >= 2026.1.29
2. macOS Keychain access behavior — investigate during onboarding
3. Docker sandbox on Apple Silicon — test if it works cleanly on M4
4. launchd + dedicated user interaction — verify non-admin user works
5. exec-approvals pattern matching — test if denylist blocks command variations
6. Backup encryption posture — confirm Time Machine encryption

Full list: `research/reports/05-open-questions.md` (30 questions across critical/important/nice-to-know)

## Key Decisions

See `docs/plans/2026-02-10-clawdbot-research-project-design.md` Section 10 for full decisions log.

Summary:
- OpenClaw as primary tool (landscape research confirms right category choice)
- M4 Mac Mini deployment (community-validated, Tailscale already configured)
- Dual-source intelligence (Context7 + Bright Data, always paired)
- Security as lens throughout, not separate phase
- Zero ClawHub skills policy until ecosystem matures
- Version >= 2026.1.29 mandatory (CVE patches)

## Infrastructure

- **Target hardware:** Apple M4 Mac Mini, 16GB RAM
- **Networking:** Tailscale VPN between Mac Minis + laptop, SSH configured
- **Current state of target Mac Mini:** Minimal software, ready to clean/configure
- **Required pre-deployment:** macOS gotcha checklist, security hardening, UPS recommended ($30-50)
