# CONTEXT.md — ClawdBot Research Project

**Last Updated:** 2026-02-11
**Staleness Threshold:** 5 days (flag if older)

## Current Status

- **Phase:** 2 COMPLETE — ready for Phase 3 (Deployment Plan) pending Sean's review
- **OpenClaw deployment:** NOT YET — research complete, deployment planning next. CRITICAL: Must deploy version >= 2026.1.29.
- **Skill chain position:** brainstorming COMPLETED → writing-plans COMPLETED → subagent-driven-development IN PROGRESS (Phases 0-2 done, Phase 3 pending)

## Phase 1 Summary (100+ sources)

- Context7 foundation + Bright Data sweeps across community, Mac Mini, landscape, security
- 5 synthesis reports produced, 28 strategic insights
- **Verdicts:** Mac Mini GO, OpenClaw GO with hardening, right category choice, stack = OpenClaw + n8n + Langfuse

## Phase 2 Summary (Architecture Deep-Dive)

**Architecture deep-dive (Task 13) — 903 lines, 16 sources:**
- 7 of 7 open architecture questions resolved
- Model routing is failover-based, NOT intelligent task-based routing
- Local embeddings (GGUF) keep memory search on-device via M4 Neural Engine
- Config "duplication" was legacy artifact — openclaw.json is single source of truth
- Sub-agents have limited context (AGENTS.md + TOOLS.md only), max 8 concurrent
- Webhook API provides clean n8n integration path
- Elevated mode should be replaced by per-agent routing architecture

**Skills & integrations (Task 14) — 1,346 lines across 2 files:**
- Skills are Markdown instructions, not code — tool policy IS the security boundary
- Lobster runtime provides deterministic workflows with approval gates
- Heartbeat + Cron are complementary scheduling mechanisms
- n8n integration confirmed via webhook API (no custom code needed)
- Phased starter roadmap: 7 Day-1 items → 4 Week 1-2 → 4 Week 3-4 → 5 do-not-enable
- 5 custom skills to build (zero supply chain risk)

## What Exists

### Knowledge Base (7 buckets)
- `01-landscape/` — Competitive landscape (16 sources)
- `02-architecture/` — Official docs + adjacent tech + **deep-dive findings** (903 lines)
- `03-security/` — Security posture analysis (48+ sources, 798 lines)
- `04-deployment/` — macOS official docs + Mac Mini community findings (42 sources)
- `05-skills-and-integrations/` — **Skill system reference** (832 lines) + **Starter skills roadmap** (514 lines)
- `06-community-intelligence/` — Community findings (41 sources)
- `07-operations/` — Empty (Phase 3 target)

### Research Reports (Phase 1)
- `01-landscape-report.md` — AI agent landscape
- `02-architecture-reference.md` — Architecture reference
- `03-mac-mini-feasibility.md` — Mac Mini feasibility (GO)
- `04-security-evaluation.md` — Security evaluation (GO with hardening)
- `05-open-questions.md` — 30 unresolved questions, 6 deployment blockers

## What's Next

1. **Phase 2 checkpoint with Sean** — present architecture and skills findings
2. **Phase 3: Deployment Plan** (Tasks 16-18)
   - Task 16: Create Mac Mini deployment plan (synthesize all research)
   - Task 17: Execute deployment (when approved — last gate before touching Mac Mini)
   - Task 18: Establish living system (operational runbook, research cadence)

## Open Questions (Deployment Blockers — Updated)

1. CVE-2026-25253 patch verification — MUST confirm version >= 2026.1.29
2. macOS Keychain access behavior — investigate during onboarding
3. Docker sandbox on Apple Silicon — test if VM-based containers work cleanly on M4
4. launchd + dedicated non-admin user interaction — verify this works
5. exec-approvals pattern matching — test denylist against command variations
6. Backup encryption posture — confirm Time Machine encryption
7. (NEW) Resource consumption with Docker sandbox on 16GB M4 — main RAM consumer
8. (NEW) Tailscale Serve + OpenClaw auth header integration on macOS

## Key Decisions

- OpenClaw as primary tool (landscape confirms right category)
- M4 Mac Mini deployment (community-validated, Tailscale configured)
- Zero ClawHub skills — custom skills only (Markdown, zero supply chain risk)
- Elevated mode DISABLED — use per-agent routing instead
- Model routing via per-agent assignment + routing bindings (not automatic)
- n8n integration via webhook API (POST /hooks/<path>)
- Local embeddings via GGUF for on-device memory search

## Infrastructure

- **Target hardware:** Apple M4 Mac Mini, 16GB RAM
- **Networking:** Tailscale VPN between Mac Minis + laptop, SSH configured
- **Current state:** Minimal software, ready to clean/configure
- **Pre-deployment:** macOS gotcha checklist, security hardening, UPS recommended ($30-50)
