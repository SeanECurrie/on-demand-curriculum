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

## 2026-02-11 — Phase 3 Complete (Deployment Plan + Living System Framework)

### Deployment Plan (Task 16) — 1,454 lines
- Step-by-step Mac Mini deployment: 9 phases (A through I), 35+ discrete steps
- Every step has specific commands, expected outcomes, and source citations
- Exact JSON config snippets from security analysis embedded
- Security hardening before channel connection — non-negotiable
- 10 mandatory security conditions addressed
- 6 deployment blockers flagged inline for hands-on testing
- Tim's VPS approach compared at each divergence point

### Living System Framework
- Research cadence: weekly (security watch), biweekly (community sweep), monthly (deep sweep)
- Trigger-based research for CVEs, new versions, incidents
- Operational runbook template: service management, monitoring, backup, emergency procedures, troubleshooting

### Scope Correction
- Tasks 17 (execute deployment) and 18 (post-deployment) were correctly identified as beyond research project scope
- Deployment execution is a separate activity Sean will do when ready, following the plan
- Research project deliverables are COMPLETE

## 2026-02-11 — Verification & Code Review (Post-Completion)

### Verification (superpowers:verification-before-completion)
- Line-by-line check of design document requirements against actual deliverables
- 3 bookkeeping gaps identified (no critical or quality issues)

### Code Review (superpowers:requesting-code-review)
- Full project review across 14 commits, 22 files, 9,298 lines
- **Verdict:** Strong execution, zero critical issues
- **3 Important issues (all bookkeeping):**
  1. `research/sources.md` had only 1 entry vs 130+ sources → FIXED: consolidated from KB files
  2. `research/scrapes/` empty (raw Bright Data outputs not persisted) → DOCUMENTED: gap noted in CONTEXT.md
  3. `patterns/` empty → FIXED: 5 reusable patterns extracted from KB findings
- **2 Process deviations (noted):**
  - `competitive-research-brightdata` skill never formally invoked via Skill tool
  - `verification-before-completion` only invoked at project end, not at phase boundaries
- **Broken reference fixed:** community-findings.md line 123 referenced empty sources.md → inline source index added

### Fixes Applied
- `research/sources.md`: Consolidated 130+ sources from all KB files with dates, tiers, URLs
- `patterns/`: 5 patterns extracted (zero-ClawHub, per-agent routing, reader agent, webhook n8n, local GGUF)
- `community-findings.md`: Inline source index added to replace broken reference
- `CONTEXT.md`: Known gaps documented, patterns section added

## 2026-02-11 — Deployment Walkthrough Written

### Brainstorming (superpowers:brainstorming)
- 4 design questions answered:
  - Tutorial depth: "Explain the concept, then the command" with deeper dives on important topics
  - Project relationship: Part of the existing research project (not separate)
  - Content location: `docs/walkthrough/` with timestamped versions and state-of-research snapshots
  - Execution model: Read-ahead guide + check-in during deployment
- Design document: `docs/plans/2026-02-11-deployment-walkthrough-design.md`

### Implementation (superpowers:writing-plans + superpowers:executing-plans)
- 11 tasks across 4 batches, executed sequentially
- Phase D (security hardening, 454 lines) delegated to subagent for efficiency
- Total walkthrough: 1,970 lines at `docs/walkthrough/2026-02-11-v1-initial-deployment.md`

### Walkthrough Structure
- **State of Research snapshot** — frozen-in-time context at top
- **9 phases (A-I):** macOS hardening → runtime → install → security → models → channels → skills → validation → operations
- **5 Understanding sections:** macOS as server, gateway architecture, defense in depth, model routing, skill security model
- **Deployment Notes sections** in every phase for Sean to fill in during actual deployment
- **Post-deployment checklist** and report-back template
- **Appendix:** Key file locations, command reference, emergency procedures, Week 1-2 roadmap

### Key Characteristic
This walkthrough is the *culmination* of the research project — it synthesizes all 130+ sources, 7 KB buckets, 5 patterns, and 52 intelligence entries into a single read-ahead guide. It is educational (explains WHY, not just WHAT) and living (deployment notes feed back into the project).
