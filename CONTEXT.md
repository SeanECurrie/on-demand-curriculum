# CONTEXT.md — ClawdBot Research Project

**Last Updated:** 2026-02-22 (post-staleness sweep + purpose refinement)
**Staleness Threshold:** 5 days (flag if older)

## Project Purpose

**This is a hands-on learning lab**, not a production deployment. OpenClaw is Case Study #1 for building transferable judgment about autonomous AI agent platforms. The deployment is the vehicle for learning, not the destination. See `operator/project-genesis.md` for the full refined purpose and `operator/purpose-refinement-2026-02-22.md` for the raw conversation capture.

**Key framing for any agent working in this project:**
- Hardening is educational as much as operational — understanding WHY matters more than operational perfection
- Transferable skills (security thinking, evaluation methodology, deployment patterns) matter more than OpenClaw-specific expertise
- Sean is a Solutions Engineer — CEOs/CPOs are asking about AI agents NOW. This builds credibility and judgment for those conversations.
- OpenClaw may or may not last, but the assessment capability built here transfers to whatever comes next

## Current Status

- **Phase:** DEPLOYMENT WALKTHROUGH READY (v1.1) — research complete, walkthrough updated with Phase 0 for existing Mac Mini prep. **Ready for Sean to begin learning deployment.**
- **Deployment posture:** Learning lab. Get it running, get it locally hardened, understand the attack surface, experiment with use cases. Not committing to daily professional use — building understanding and hands-on credibility.
- **OpenClaw deployment:** NOT YET — walkthrough at `docs/walkthrough/2026-02-11-v1-initial-deployment.md` (10 phases, 0-I).
- **Deployment plan (reference):** `knowledge-base/04-deployment/mac-mini-deployment-plan.md`
- **⚠️ VERSION TARGET UPDATED:** Must deploy version **>= 2026.2.15** (minimum) or **2026.2.19** (recommended, latest as of 2026-02-22). Previous target of >= 2026.1.29 is INSUFFICIENT — 4 additional CVEs discovered and patched between 2026.2.1 and 2026.2.15. Walkthrough and crib sheet need updating to reflect this.
- **Mac Mini (DevHub) current state:** v1 DevHub build (Homebrew, Docker Desktop, Ollama, Tailscale, FastAPI projects, monitoring containers). Phase 0 added to walkthrough for prep without wipe. **Universal Control restored as of 2026-02-21** (iCloud re-auth after aborted Recovery Mode — see Infrastructure section).
- **New session navigator onboarded:** 2026-02-22. Full project review + staleness sweep completed.

## Staleness Sweep Results (2026-02-22)

**Major ecosystem changes since last research (2026-02-14):**

### Governance
- **Peter Steinberger joined OpenAI** (announced 2026-02-15). OpenClaw transitioning to independent **OpenClaw Foundation** with OpenAI funding/resources. MIT license preserved. Community maintainers stepping up. Turned down Meta offers.
- **Implication:** Less bus-factor risk. Watch for roadmap clarity, governance structure, ChatGPT integration direction.

### Security (CRITICAL)
- **4 NEW CVEs** beyond the 2 we documented (CVE-2026-25253, CVE-2026-24763):
  1. Path traversal in BlueBubbles extension (patched 2026.2.14)
  2. Microsoft Teams token leak (patched 2026.2.1)
  3. Twitch plugin auth bypass (patched 2026.2.1)
  4. Telegram token leak in logs (patched 2026.2.15)
- **ClawHub supply chain WORSE:** Malicious skills grew from 341/2,857 (12%) to 824+/10,700+ (~20%). "ClawHavoc" campaign: typosquatting, reverse shells, credential exfiltration, Atomic macOS Stealer payloads. 1,184 malicious skills historically published. **Zero-ClawHub policy MORE critical than originally assessed.**
- **42,000+ publicly exposed instances.** 30,000+ internet-exposed without auth (Censys, Bitsight, Hunt.io). 6 GitHub Security Advisories in 3 weeks. Microsoft Defender: "use only in isolated environments."
- **SecureClaw** (Adversa AI, 2026-02-16): OWASP-aligned open-source security tool. 55 audit checks, 5 hardening modules. Worth evaluating during Phase G. GitHub: adversa-ai/secureclaw.
- **Cisco Talos:** "groundbreaking but an absolute nightmare" from security perspective.

### Version & Features
- **Latest version:** 2026.2.19 (released 2026-02-19). Post-release patch 2026.2.19-2 available.
- **macOS-critical fixes in 2026.2.19:** (1) LaunchAgent TMPDIR forwarding for SQLite — was a potential blocker we didn't know about, (2) Skills hardening against prompt injection via shell interpolation, (3) Security audit now detects no-auth gateway exposure, (4) ACP session rate limiting.
- **New features:** Apple Watch companion, `openclaw sandbox explain` debug command, device management CLI (`openclaw devices remove/clear`), exec-approvals CLI (`openclaw approvals set --file`, `allowlist add/remove`), approval forwarding to chat channels.
- **GitHub stars:** 145K → 209K+ in 12 days.

### Documentation (Context7)
- Sandbox configuration reference now much more granular: workspaceAccess, sessionToolsVisibility, 8-level tool restriction filtering order, browser sandbox options, container pruning, custom bind mounts.
- exec-approvals system more mature: bulk config from file, CLI management, autoAllowSkills flag, remote approval via chat commands.

## What Was Updated (2026-02-22)

All staleness sweep changes were applied across 2 commits on 2026-02-22:

| Document | Change Applied | Status |
|----------|---------------|--------|
| `docs/walkthrough/...` | Version target → >= 2026.2.19, 4 new CVEs, TMPDIR note, 15 edits total | ✅ Done |
| `docs/walkthrough/crib-sheet.md` | Version target, 6 new CLI commands | ✅ Done |
| `knowledge-base/03-security/security-posture-analysis.md` | 4 new CVEs, ClawHub numbers, SecureClaw, Microsoft/Cisco | ✅ Done |
| `knowledge-base/04-deployment/mac-mini-deployment-plan.md` | Version target, TMPDIR note | ✅ Done |
| `knowledge-base/01-landscape/competitive-landscape.md` | Foundation governance, stars update, risk #6 | ✅ Done |
| `research/sources.md` | 15 new sources added (total 145+) | ✅ Done |
| `operator/project-genesis.md` | Purpose refinement — learning lab framing, professional context | ✅ Done (this session) |
| `CONTEXT.md` | Purpose section, deployment posture, use cases, framing updates | ✅ Done (this session) |

**Still in progress this session:** CLAUDE.md alignment, walkthrough framing updates, operator profile review.

## What This Project Produced

### Knowledge Base (all 7 buckets populated)
| Bucket | Content | Lines |
|--------|---------|-------|
| `01-landscape/` | Competitive landscape (16 sources) | 223 |
| `02-architecture/` | Official docs + adjacent tech + deep-dive findings | 1,261 |
| `03-security/` | Security posture analysis (48+ sources) | 799 |
| `04-deployment/` | macOS official + community findings + **deployment plan** | 2,014 |
| `05-skills-and-integrations/` | Skill system reference + starter roadmap | 1,348 |
| `06-community-intelligence/` | Community findings (41 sources) | 139 |
| `07-operations/` | Operational runbook template + research cadence | 1,277 |

### Research Reports (Phase 1)
- `01-landscape-report.md` — OpenClaw is right category choice
- `02-architecture-reference.md` — Architecture reference (docs + reality)
- `03-mac-mini-feasibility.md` — Mac Mini M4 GO
- `04-security-evaluation.md` — GO with mandatory hardening
- `05-open-questions.md` — 30 questions, 6 deployment blockers

### Key Verdicts (UNCHANGED — sweep reinforces, not contradicts)
- **Mac Mini:** GO — community-validated, overpowered for this use case
- **OpenClaw:** GO with mandatory hardening — now 6+ CVEs, ~20% malicious skills ecosystem (up from 12%). Remember: this is Case Study #1 for learning, not a permanent commitment.
- **Landscape:** Right category choice — Foundation transition strengthens long-term viability
- **Stack:** OpenClaw + n8n (deterministic workflows) + Langfuse (observability). n8n is interesting as a comparison point: where does an LLM agent add value vs. where does deterministic automation do it better?

## Key Decisions

- Zero ClawHub skills — custom Markdown skills only (**MORE critical post-sweep**)
- Elevated mode DISABLED — per-agent routing instead
- Model routing via per-agent assignment (failover-based, not intelligent)
- n8n integration via webhook API (POST /hooks/<path>)
- Local GGUF embeddings for on-device memory search
- Security hardening BEFORE channel connection
- No full wipe — Phase 0 targeted prep instead
- **NEW:** Evaluate SecureClaw (Adversa AI) during Phase G security hardening
- **NEW:** Deploy version >= 2026.2.19 (not 2026.1.29)

## Open Questions (Resolve During Deployment)

1. ~~CVE-2026-25253 patch verification — confirm version >= 2026.1.29~~ → Updated: confirm version >= 2026.2.19, verify ALL 6 CVEs patched
2. macOS Keychain access behavior — document during onboarding
3. Docker sandbox on Apple Silicon — test on M4
4. launchd + dedicated non-admin user — verify works (note: TMPDIR fix in 2026.2.19 resolves a potential LaunchAgent issue)
5. exec-approvals pattern matching — test denylist (now has CLI: `openclaw approvals set --file`)
6. Time Machine encryption — confirm enabled
7. Docker sandbox resource consumption on 16GB
8. Tailscale Serve + OpenClaw auth header integration
9. **NEW:** SecureClaw evaluation — install from adversa-ai/secureclaw, run audit, compare with `openclaw security audit --deep`
10. **NEW:** OpenClaw Foundation governance — monitor for public roadmap, maintainer list, ChatGPT integration plans

## Reusable Patterns (extracted from research)

5 patterns in `patterns/`:
1. `001-zero-clawhub-supply-chain-defense.md` — Zero external skills policy
2. `002-per-agent-routing-over-elevated-mode.md` — Agent routing > elevated mode
3. `003-reader-agent-prompt-injection-defense.md` — Read-only agent for untrusted content
4. `004-webhook-n8n-integration.md` — n8n ↔ OpenClaw via webhook API
5. `005-local-gguf-embeddings.md` — On-device memory search via M4 Neural Engine

## Experimental Use Cases (Post-Deployment)

Once the learning deployment is running, Sean wants to experiment with these — roughly in order of complexity. The key question for each: does an LLM agent add value here vs. deterministic automation?

1. **Update notifications / monitoring alerts** — Low complexity, good first test
2. **Competitive analysis automation** — Sean has baselines from existing work to evaluate against
3. **Lead list building** — Structured enough that the agent-vs-script comparison is clear
4. **Follow-up monitoring and alerting** — Tests scheduling, persistence, judgment
5. **Context file / knowledge base maintenance** — Meta: can the agent help maintain this project?
6. **Sandboxed workflow replication** — Mirror SaleEnablementEngine or WondaKB workflows to test real value
7. **"Product Manager" agent** — Status aggregation, stakeholder updates, backlog grooming. Interesting because the parts an agent can do are the parts PMs hate, and the parts it can't do are the parts that make PMs valuable.

**Future artifact:** An assessment framework document — "How to evaluate an autonomous agent platform." Build after deployment experience informs it, not before.

## Known Gaps

- **`research/scrapes/` is empty.** Raw Bright Data outputs were consumed in real-time during research sessions but not persisted to disk. Individual KB files include source URLs that can be re-scraped if needed. Future research cycles should save raw scrape outputs before synthesizing.
- **Community findings source references.** The 41 community intelligence sources are referenced inline throughout the document but lack full URL attribution for most entries. Key sources were added in the inline index on 2026-02-11.
- **Walkthrough/crib sheet/deployment plan version targets are STALE.** They reference >= 2026.1.29. Must be updated to >= 2026.2.19 before deployment begins. See "What Needs Updating" table above.
- **Security posture analysis doesn't include 4 new CVEs or updated ClawHub numbers.** Should be updated before deployment.

## How to Use This Project

1. **New session or new agent?** Read this file first, then `operator/project-genesis.md` for purpose context. Remember: this is a learning lab, not a production deployment.
2. **Ready to deploy?** Follow `docs/walkthrough/2026-02-11-v1-initial-deployment.md` — start with Phase 0 (machine prep), then Phases A-I. The walkthrough is the primary operating document. It's educational by design — the "Understanding" sections are the point, not overhead.
3. **Need the raw reference?** `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (commands-only, no educational context)
4. **Need to check security?** Read `knowledge-base/03-security/security-posture-analysis.md` + this CONTEXT.md "Staleness Sweep Results" section
5. **Choosing skills?** Read `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md`
6. **Staying current?** Follow `knowledge-base/07-operations/research-cadence.md`
7. **Something breaks?** Check `knowledge-base/07-operations/operational-runbook-template.md`
8. **Evaluating a different agent platform?** The research methodology (dual-source, credibility tiers), security posture analysis framework, and deployment patterns are designed to be transferable. OpenClaw is Case Study #1.

## Infrastructure

- **Target hardware:** Apple M4 Mac Mini (DevHub), 16GB RAM
- **Primary machine:** Mac Mini (WorkHub) — Sean's daily driver, 2 monitors
- **Laptop:** MacBook Pro (MobileHub)
- **Networking:** Tailscale VPN between all devices, SSH configured. Universal Control active between WorkHub ↔ DevHub (restored 2026-02-21).
- **Physical setup:** DevHub has 1 monitor, hardwired keyboard available for restarts. Ethernet connections to both Mac Minis. All on same LAN (10.0.0.x/24 subnet).
- **DevHub network details (from 2026-02-21 debug):** en0 at 10.0.0.244, en1 at 10.0.0.102. WorkHub: en0 at 10.0.0.180, en1 at 10.0.0.78.
- **Current DevHub state:** v1 DevHub build intact, Universal Control working, iCloud re-authenticated. Ready for Phase 0 prep when Sean decides to proceed.
