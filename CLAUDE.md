# CLAUDE.md — ClawdBot Research Project Constitution

**Project:** ClawdBot Research Project
**Operator:** Sean Currie
**Created:** 2026-02-10
**Design Document:** `docs/plans/2026-02-10-clawdbot-research-project-design.md`

---

## Identity & Purpose

This project is a **living intelligence system** for autonomous AI agent technology — focused on ClawdBot/OpenClaw but aware of the broader landscape.

It accumulates knowledge, informs decisions, and stays current. It is NOT a one-time setup guide.

**What this does:**
- Researches and maps the autonomous AI agent landscape
- Deeply understands OpenClaw architecture, security, and deployment
- Guides deployment on a dedicated M4 Mac Mini
- Captures operational patterns and lessons learned
- Stays current as the ecosystem evolves

**What this is NOT:**
- A copy of someone else's tutorial
- A static repo that goes stale
- Limited to ClawdBot — it's aware of the full landscape
- Documentation-only — community intelligence is equally weighted

---

## Operator Context

Full operator context lives in `operator/`:
- `operator/sean-currie-profile.md` — Background, capabilities, infrastructure, working style
- `operator/project-genesis.md` — Goals, decisions, what this project is/isn't
- `operator/source-transcript-techwith-tim.md` — Structured extraction of founding video source

**Read these files at session start if context feels thin.** They are the founding documents.

---

## Non-Negotiable Operator Rules

These are Sean's collaboration requirements. They are not suggestions.

1. **YOU MUST research before agreeing with any hypothesis Sean proposes.** Do not agree without evidence.
2. **YOU MUST push back when evidence contradicts Sean's assumptions.** Bring data, not diplomacy.
3. **YOU MUST bring data and sources, not just agreement.** If you can't cite it, don't claim it.
4. **Knowledge accumulates, never resets.** Mark outdated content as outdated with date — never delete. The history has value.
5. **Security is a lens on every decision, not a separate phase.** Every configuration choice, skill enablement, and integration gets evaluated for security implications.

**Red flag:** If you catch yourself agreeing without evidence — STOP. Research first.

---

## Research Methodology — Dual-Source Intelligence

### The Two Sources

**Context7 (MCP)** = Official truth
- Documentation, APIs, configuration reference, changelogs
- The baseline for every investigation
- NEVER optional — runs in tandem with Bright Data AND independently

**Bright Data (MCP)** = Community truth + expert amplification
- Reddit (r/selfhosted, r/LocalLLaMA, r/ClaudeAI, r/homelab), YouTube, GitHub, Hacker News, developer blogs
- Tests documentation claims against real-world experience
- Amplifies and enhances beyond documentation with expert knowledge, undocumented tricks, real configurations
- Surfaces cautionary signals — bad experiences, security concerns, abandoned approaches
- Filters signal from noise using credibility tiers

### The Rule

Documentation is the skeleton. Community intelligence puts muscle, scars, and street smarts on it. **Neither stands alone.** Every research cycle uses both sources.

### Three Operating Modes

**Mode 1: Documentation Pull (Context7-led)**
Understand how something officially works. Bright Data supplements with what the docs don't say.

**Mode 2: Landscape Scan (Bright Data-led)**
Map the competitive field or gauge community sentiment. Context7 validates technical claims.

**Mode 3: Reality Check & Amplification (Both, cross-validating)**
Specific questions where we need both official and community perspectives. Contradictions are flagged as intelligence insights.

### Source Credibility Tiers

| Tier | Source Type | Weight |
|------|-----------|--------|
| 1 | Official documentation + verified changelogs | Highest — but can be outdated or incomplete |
| 2 | Established creators with proven deployments (e.g., Tech With Tim) | High — verified by track record |
| 3 | GitHub issues/PRs with reproducible details | Medium-high — specific and verifiable |
| 4 | Reddit/forum posts with technical specificity | Medium — useful but verify |
| 5 | General community sentiment | Low — direction indicator, not decision-maker |

Every finding gets tagged with its tier in `research/sources.md`.

---

## Session Protocol

### Session Start
1. Read `CONTEXT.md` — understand current state
2. Check staleness — if >5 days old, flag for review (this space moves fast)
3. Check `intelligence-log.md` for recent strategic insights
4. If context feels thin, read `operator/` files for founding context

### During Session
- Log significant actions in `activity-log.md`
- Log strategic insights in `intelligence-log.md` (not every action — only hypotheses validated, contradictions found, key discoveries)
- Update `CONTEXT.md` at significant state changes

### Session End
- Update `CONTEXT.md` with current state
- Archive to `CONTEXT-HISTORY.md` if major phase completed
- Commit changes

---

## Knowledge Base Structure

Seven buckets, each accumulates independently:

| Bucket | Path | Purpose |
|--------|------|---------|
| Landscape | `knowledge-base/01-landscape/` | Competitive landscape — tools, comparisons, positioning |
| Architecture | `knowledge-base/02-architecture/` | OpenClaw internals — how it works, from docs AND reality |
| Security | `knowledge-base/03-security/` | Threat models, hardening, best practices, attack surfaces |
| Deployment | `knowledge-base/04-deployment/` | Mac Mini setup, config, operations — macOS/ARM specific |
| Skills & Integrations | `knowledge-base/05-skills-and-integrations/` | Bot skills, connected services, custom development |
| Community Intelligence | `knowledge-base/06-community-intelligence/` | Reddit, YouTube, creator insights, expert knowledge |
| Operations | `knowledge-base/07-operations/` | Running it, monitoring, maintaining, troubleshooting |

**Raw research** goes to `research/scrapes/`. **Refined knowledge** goes to `knowledge-base/`. **Synthesized reports** go to `research/reports/`. **Reusable patterns** go to `patterns/`.

---

## Mac Mini as First-Class Research Lens

Sean is deploying on an **Apple M4 Mac Mini (16GB RAM)** with Tailscale VPN already configured.

**Every phase of research prioritizes Mac Mini-specific findings:**
- Every tool evaluated for Mac Mini/macOS/ARM viability
- Every community scrape includes Mac Mini-specific queries
- Positive AND negative experiences captured equally
- macOS deviations from Linux-focused guides explicitly documented
- Tim's VPS arguments evaluated against Sean's specific setup (dedicated hardware + existing Tailscale)

---

## Superpowers Skill Chain

This project follows a disciplined skill chain. Skills are invoked via the Skill tool — never improvised from memory.

| Order | Skill | Purpose |
|-------|-------|---------|
| 1 | `superpowers:brainstorming` | Explore intent, requirements, design before implementation |
| 2 | `superpowers:writing-plans` | Create detailed implementation plan from design |
| 3 | `superpowers:subagent-driven-development` | Execute plan with fresh subagent per task + review |
| 4 | `competitive-research-brightdata` | Structured competitive analysis during landscape research |
| 5 | `superpowers:executing-plans` | Carry out plan with review checkpoints (alternative to subagent) |
| 6 | `superpowers:verification-before-completion` | Validate each phase before moving on |
| 7 | `superpowers:systematic-debugging` | Diagnose issues during deployment or operation |
| 8 | `superpowers:requesting-code-review` | Review completed work against requirements |

### Skill Discipline Rules
- If a skill applies (even 1% chance), invoke it — no rationalizing
- Process skills first (brainstorming, debugging), implementation skills second
- Rigid skills (TDD, debugging) followed exactly; flexible skills adapt to context
- Each skill invocation logged in `activity-log.md`

---

## Versioning

- All KB entries are date-stamped
- Outdated content is marked `[OUTDATED as of YYYY-MM-DD]` — never deleted
- `CONTEXT.md` tracks current state; `CONTEXT-HISTORY.md` archives milestones
- Git commits at every meaningful checkpoint
- No "final/" or "current/" directories — use date-stamped versioning
