# CONTEXT-HISTORY.md

## 2026-02-10 — Project Inception

- Brainstorming session completed (superpowers:brainstorming)
- Design document approved: `docs/plans/2026-02-10-clawdbot-research-project-design.md`
- Implementation plan written (superpowers:writing-plans): `docs/plans/2026-02-10-implementation-plan.md`
- Foundation phase (Phase 0) in progress via subagent-driven-development
- Key decisions: OpenClaw primary tool, M4 Mac Mini deployment, dual-source intelligence, security as lens

## 2026-02-10/11 — Phase 0 Complete + Phase 1 Complete

### Phase 0 (Foundation)
- Git repository initialized (10 commits)
- CLAUDE.md constitution, CONTEXT.md continuity, logging infrastructure
- Operator context files (profile, genesis, Tim transcript)
- 7-bucket knowledge base structure created
- All committed and verified

### Phase 1 (Initial Research) — 100+ sources
- **Context7 pulls:** OpenClaw official docs (architecture, security, macOS deployment), adjacent tech docs (Tailscale, Telegram, Node.js)
- **Bright Data sweeps:** community intelligence (41 sources), Mac Mini deployment (42 sources), competitive landscape (16 sources), security deep-dive (48+ sources)
- **5 synthesis reports produced:** landscape, architecture reference, Mac Mini feasibility, security evaluation, open questions
- **28 intelligence log entries** with strategic insights

### Key Findings
- Mac Mini M4: GO — community-validated, overpowered for this use case
- OpenClaw: GO with mandatory hardening — default config dangerously permissive
- CVE-2026-25253 (CVSS 8.8): 1-click RCE, patched in v2026.1.29
- CVE-2026-24763: Docker sandbox command injection, patched in v2026.1.29
- ClawHub skills: 12% malicious (341/2857) — zero ClawHub skills policy
- OpenClaw is fundamentally different category from frameworks (CrewAI, LangGraph)
- Recommended stack: OpenClaw + n8n + Langfuse
- Tim's security recommendations validated but understated
- 30 open questions identified, 6 are deployment blockers

## 2026-02-11 — Phase 2 Complete (Architecture Deep-Dive)

### Architecture Deep-Dive (Task 13) — 903 lines
- 7 of 7 open architecture questions from Phase 1 resolved
- Model routing is failover-based (primary + fallback chain), NOT intelligent task routing
- Data residency answered: conversation context goes to LLM, sessions/memory/config stay local
- Local embeddings via GGUF keep memory search entirely on M4 (Neural Engine)
- Config "duplication" was legacy artifact — openclaw.json is single source of truth
- Sub-agents limited: only AGENTS.md + TOOLS.md context, max 8 concurrent, 60min auto-archive
- Webhook API (POST /hooks/<path>) provides clean n8n integration, no custom code
- Elevated mode should be DISABLED — replaced by per-agent routing architecture

### Skills & Integrations (Task 14) — 1,346 lines
- Skills are Markdown instructions (SKILL.md), not code — tool policy IS the security boundary
- Lobster runtime provides deterministic workflows with approval gates
- Heartbeat + Cron are complementary (batch monitoring + precise scheduling)
- 53 bundled skills cost ~1,300 tokens/turn — use allowBundled whitelist to control
- Phased starter roadmap: 7 Day-1 → 4 Week 1-2 → 4 Week 3-4 → 5 do-not-enable
- 5 custom skills to build (personal briefing, research assistant, project status, learning journal, n8n bridge)
- awesome-openclaw-skills (700+ skills) useful for inspiration, NOT installation

### New Key Decisions
- Zero ClawHub skills — custom Markdown skills only (zero supply chain risk)
- Elevated mode DISABLED — per-agent routing instead
- Local GGUF embeddings for on-device memory search
- n8n integration via webhook API
- Model routing via per-agent assignment with routing bindings
