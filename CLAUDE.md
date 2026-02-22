# CLAUDE.md — ClawdBot Research Project Constitution

**Project:** ClawdBot Research Project
**Operator:** Sean Currie
**Created:** 2026-02-10
**Refined:** 2026-02-22 (purpose alignment after research completion)
**Design Document:** `docs/plans/2026-02-10-clawdbot-research-project-design.md`

---

## Identity & Purpose

This project is a **hands-on learning lab** for autonomous AI agent technology. OpenClaw is Case Study #1 — the first tool to move the needle and garner massive attention — but this project is not married to OpenClaw. The transferable skills (evaluation methodology, security thinking, deployment patterns) matter more than any single tool.

**The deployment is a learning exercise, not a production commitment.** Sean is building judgment, credibility, and hands-on understanding — not infrastructure he depends on daily. Hardening is educational as much as operational: understanding what real security hardening looks like and WHY each step matters is the point.

**Why this matters professionally:** Sean is a Solutions Engineer. CEOs and CPOs are already asking "can you set up an AI agent" — these are active buying signals, not hypotheticals. This project makes Sean the person in the room who's actually deployed one, understood the security implications, and can separate hype from reality. Read `operator/project-genesis.md` for the full refined purpose.

**What this does:**
- Researches and maps the autonomous AI agent landscape (OpenClaw is the current focus, not the only focus)
- Builds transferable judgment for evaluating ANY agent platform — security, deployment, ecosystem trust, viability
- Guides a learning deployment on a dedicated M4 Mac Mini, with educational framing on every hardening step
- Captures operational patterns and lessons learned that transfer beyond OpenClaw
- Tests real use cases against the question: does an LLM agent add value here, or does a deterministic script do it better?
- Stays current as the ecosystem evolves — and builds readiness to assess whatever comes next

**What this is NOT:**
- A production deployment commitment — this is a learning lab
- A copy of someone else's tutorial
- A static repo that goes stale
- Limited to OpenClaw — it's aware of the full landscape and OpenClaw is Case Study #1
- Documentation-only — community intelligence is equally weighted
- OpenClaw-specific expertise building — the transferable skills are the real deliverable

---

## Operator Context

Full operator context lives in `operator/`:
- `operator/sean-currie-profile.md` — Background, capabilities, infrastructure, working style
- `operator/project-genesis.md` — Goals, decisions, refined purpose (updated 2026-02-22)
- `operator/purpose-refinement-2026-02-22.md` — **Raw conversation capture of purpose alignment.** This is the unfiltered version of WHY this project exists. Read this if you need to understand Sean's actual intent vs. the structured summaries.
- `operator/source-transcript-techwith-tim.md` — Structured extraction of founding video source

**Read `project-genesis.md` at session start — it has the refined purpose.** Read `purpose-refinement-2026-02-22.md` if you need to gut-check whether your approach matches Sean's actual intent. These are not suggestions — they're how you calibrate.

---

## Non-Negotiable Operator Rules

These are Sean's collaboration requirements. They are not suggestions.

1. **YOU MUST research before agreeing with any hypothesis Sean proposes.** Do not agree without evidence.
2. **YOU MUST push back when evidence contradicts Sean's assumptions.** Bring data, not diplomacy.
3. **YOU MUST bring data and sources, not just agreement.** If you can't cite it, don't claim it.
4. **YOU MUST ask clarifying questions about purpose and intent, not just technical details.** Sean values being challenged on the "why" as much as the "what." If you don't understand why a task matters to the project's goals, ask. If the direction seems misaligned with the learning lab purpose, say so.
5. **Knowledge accumulates, never resets.** Mark outdated content as outdated with date — never delete. The history has value.
6. **Security is a lens on every decision, not a separate phase.** Every configuration choice, skill enablement, and integration gets evaluated for security implications.
7. **Always distinguish transferable learning from tool-specific detail.** When explaining, configuring, or documenting anything, note what's universally applicable vs. what's OpenClaw-specific. The transferable knowledge is the primary deliverable.

**Red flags:**
- If you catch yourself agreeing without evidence — STOP. Research first.
- If you catch yourself treating this like a production deployment — STOP. This is a learning lab. Reframe.
- If you catch yourself going deep on OpenClaw minutiae without noting whether the concept transfers — STOP. Call it out.

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

### Session Start (Use the `session-restart` skill)

The `session-restart` skill at `skills/session-restart/SKILL.md` handles session startup efficiently. It reads `operator/session-state.md` (the single source of truth for walkthrough progress and task state), loads only the context files needed for the current phase, checks staleness, and presents a focused brief — all without bloating the context window.

**If the skill isn't available** (e.g., different environment), follow this manual sequence:
1. Read `operator/session-state.md` — walkthrough progress, current task, blockers, what happened last
2. Read `CONTEXT.md` — project map, key decisions, open questions
3. Check staleness — if >5 days since last session, flag for review (this space moves fast)
4. Check `intelligence-log.md` tail for recent strategic insights
5. If context feels thin, read `operator/project-genesis.md` for refined purpose
6. Calibrate your posture: learning lab, not production. Challenge over agreement. Transferable over tool-specific.

### During Session
- Log significant actions in `activity-log.md`
- Log strategic insights in `intelligence-log.md` (not every action — only hypotheses validated, contradictions found, key discoveries)
- Update `CONTEXT.md` at significant state changes
- **Update `operator/session-state.md`** when walkthrough phases/steps complete, blockers change, or significant decisions are made

### Session End
- Update `operator/session-state.md` with current state, last session summary, and notes for next session
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

## Deployment Posture — Learning Lab

This deployment is an exercise in exposure, learning, and experimenting. Keep these principles in mind during any deployment or operational work:

**Three tiers of hardening (from the walkthrough):**
1. **Essential hardening** — Security fundamentals that prevent actual harm: auth, no ClawHub skills, sandbox mode, loopback binding. Do these regardless. They're universally important for any agent platform.
2. **Educational hardening** — Steps where the "Understanding" section is as valuable as the config change itself. The WHY matters: what attack does this prevent? What's the principle? Does this transfer to other platforms?
3. **Operational polish** — TMPDIR edge cases, screen saver settings, launchd optimization. These matter for a persistent service but can be deferred if the operator wants to get to experimentation faster. Flag them as deferrable.

**When helping with deployment:**
- If Sean wants to skip or defer an operational polish step to get to hands-on experimentation faster, that's fine. Essential hardening is non-negotiable; operational polish is not.
- Always frame security concepts in transferable terms: "This is how auth tokens work for any agent gateway, not just OpenClaw" is more valuable than "Here's the OpenClaw-specific auth config."
- When testing use cases post-deployment, always ask: could a deterministic script (n8n, cron, Make) do this better? The agent-vs-automation comparison is part of the learning.

**Experimental use cases Sean wants to explore (see CONTEXT.md for full list):**
Competitive analysis, lead building, knowledge base maintenance, workflow replication from existing systems, monitoring/alerting. Each one should be evaluated for whether the LLM agent adds genuine value over simpler automation.

---

## Versioning

- All KB entries are date-stamped
- Outdated content is marked `[OUTDATED as of YYYY-MM-DD]` — never deleted
- `CONTEXT.md` tracks current state; `CONTEXT-HISTORY.md` archives milestones
- Git commits at every meaningful checkpoint
- No "final/" or "current/" directories — use date-stamped versioning

### Source → Derivative Sync

Some project artifacts are derived from others. When the source changes, the derivative must be flagged for update:

| Source | Derivative | Sync Rule |
|--------|-----------|-----------|
| `docs/walkthrough/2026-02-11-v1-initial-deployment.md` | `docs/walkthrough/interactive/` | Content changes (new phases, updated commands, version bumps, security patches) require interactive version rebuild. Note in commit message: "Interactive walkthrough may need rebuild." |

**If you modify a source document listed above:** check if a derivative exists and flag it. This is not optional.
