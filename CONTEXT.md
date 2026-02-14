# CONTEXT.md — ClawdBot Research Project

**Last Updated:** 2026-02-14
**Staleness Threshold:** 5 days (flag if older)

## Current Status

- **Phase:** DEPLOYMENT WALKTHROUGH READY (v1.1) — research complete, walkthrough updated with Phase 0 for existing Mac Mini prep.
- **OpenClaw deployment:** NOT YET — walkthrough at `docs/walkthrough/2026-02-11-v1-initial-deployment.md` (10 phases, 0-I).
- **Deployment plan (reference):** `knowledge-base/04-deployment/mac-mini-deployment-plan.md`
- **CRITICAL:** Must deploy version >= 2026.1.29 (CVE patches).
- **Mac Mini current state:** v1 DevHub build (Homebrew, Docker Desktop, Ollama, Tailscale, FastAPI projects, monitoring containers). Phase 0 added to walkthrough for prep without wipe.

## What This Project Produced

### Knowledge Base (all 7 buckets populated)
| Bucket | Content | Lines |
|--------|---------|-------|
| `01-landscape/` | Competitive landscape (16 sources) | — |
| `02-architecture/` | Official docs + adjacent tech + deep-dive findings | 903 |
| `03-security/` | Security posture analysis (48+ sources) | 798 |
| `04-deployment/` | macOS official + community findings + **deployment plan** | 1,454 |
| `05-skills-and-integrations/` | Skill system reference + starter roadmap | 1,346 |
| `06-community-intelligence/` | Community findings (41 sources) | — |
| `07-operations/` | Operational runbook template + research cadence | 2,076 |

### Research Reports (Phase 1)
- `01-landscape-report.md` — OpenClaw is right category choice
- `02-architecture-reference.md` — Architecture reference (docs + reality)
- `03-mac-mini-feasibility.md` — Mac Mini M4 GO
- `04-security-evaluation.md` — GO with mandatory hardening
- `05-open-questions.md` — 30 questions, 6 deployment blockers

### Key Verdicts
- **Mac Mini:** GO — community-validated, overpowered for this use case
- **OpenClaw:** GO with mandatory hardening — 2 critical CVEs, 12% malicious skills ecosystem
- **Landscape:** Right category choice — no true competitor for self-hosted agent product
- **Stack:** OpenClaw + n8n (deterministic workflows) + Langfuse (observability)

## Key Decisions

- Zero ClawHub skills — custom Markdown skills only
- Elevated mode DISABLED — per-agent routing instead
- Model routing via per-agent assignment (failover-based, not intelligent)
- n8n integration via webhook API (POST /hooks/<path>)
- Local GGUF embeddings for on-device memory search
- Security hardening BEFORE channel connection

## Open Questions (Resolve During Deployment)

1. CVE-2026-25253 patch verification — confirm version >= 2026.1.29
2. macOS Keychain access behavior — document during onboarding
3. Docker sandbox on Apple Silicon — test on M4
4. launchd + dedicated non-admin user — verify works
5. exec-approvals pattern matching — test denylist
6. Time Machine encryption — confirm enabled
7. Docker sandbox resource consumption on 16GB
8. Tailscale Serve + OpenClaw auth header integration

## Reusable Patterns (extracted from research)

5 patterns in `patterns/`:
1. `001-zero-clawhub-supply-chain-defense.md` — Zero external skills policy
2. `002-per-agent-routing-over-elevated-mode.md` — Agent routing > elevated mode
3. `003-reader-agent-prompt-injection-defense.md` — Read-only agent for untrusted content
4. `004-webhook-n8n-integration.md` — n8n ↔ OpenClaw via webhook API
5. `005-local-gguf-embeddings.md` — On-device memory search via M4 Neural Engine

## Known Gaps

- **`research/scrapes/` is empty.** Raw Bright Data outputs were consumed in real-time during research sessions but not persisted to disk. Individual KB files include source URLs that can be re-scraped if needed. Future research cycles should save raw scrape outputs before synthesizing.
- **Community findings source references.** The 41 community intelligence sources are referenced inline throughout the document but lack full URL attribution for most entries. Key sources were added in the inline index on 2026-02-11.

## How to Use This Project

1. **Ready to deploy?** Follow `docs/walkthrough/2026-02-11-v1-initial-deployment.md` — start with Phase 0 (machine prep), then Phases A-I
2. **Need the raw reference?** `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (commands-only, no educational context)
3. **Need to check security?** Read `knowledge-base/03-security/security-posture-analysis.md`
4. **Choosing skills?** Read `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md`
5. **Staying current?** Follow `knowledge-base/07-operations/research-cadence.md`
6. **Something breaks?** Check `knowledge-base/07-operations/operational-runbook-template.md`

## Infrastructure

- **Target hardware:** Apple M4 Mac Mini, 16GB RAM
- **Networking:** Tailscale VPN between Mac Minis + laptop, SSH configured
- **Current state:** Minimal software, ready to deploy when Sean is ready
