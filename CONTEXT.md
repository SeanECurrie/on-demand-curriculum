# CONTEXT.md — ClawdBot Research Project

**Last Updated:** 2026-02-11
**Staleness Threshold:** 5 days (flag if older)

## Current Status

- **Phase:** RESEARCH COMPLETE — all 3 phases done. Living system framework established.
- **OpenClaw deployment:** NOT YET — deployment plan ready at `knowledge-base/04-deployment/mac-mini-deployment-plan.md`. Deploy when ready.
- **CRITICAL:** Must deploy version >= 2026.1.29 (CVE patches).

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

## How to Use This Project

1. **Ready to deploy?** Follow `knowledge-base/04-deployment/mac-mini-deployment-plan.md`
2. **Need to check security?** Read `knowledge-base/03-security/security-posture-analysis.md`
3. **Choosing skills?** Read `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md`
4. **Staying current?** Follow `knowledge-base/07-operations/research-cadence.md`
5. **Something breaks?** Check `knowledge-base/07-operations/operational-runbook-template.md`

## Infrastructure

- **Target hardware:** Apple M4 Mac Mini, 16GB RAM
- **Networking:** Tailscale VPN between Mac Minis + laptop, SSH configured
- **Current state:** Minimal software, ready to deploy when Sean is ready
