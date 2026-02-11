# ClawdBot Research Project — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a living intelligence system for ClawdBot/OpenClaw research, deployment, and ongoing operation on an M4 Mac Mini.

**Architecture:** Adapted salesenablementengine pattern — CLAUDE.md constitution, 7-bucket knowledge base, CONTEXT.md session continuity, dual-source intelligence (Context7 + Bright Data), dual-layer logging. Research populates the engine; the engine persists across sessions and stays current.

**Tech Stack:** Context7 MCP (documentation), Bright Data MCP (community intelligence + competitive research), superpowers skill chain (brainstorm → write-plans → execute → verify), Git for version control.

**Design Document:** `docs/plans/2026-02-10-clawdbot-research-project-design.md`

**Superpowers Skill Chain:**
| Step | Skill | Status |
|------|-------|--------|
| 1 | `superpowers:brainstorming` | COMPLETED |
| 2 | `superpowers:writing-plans` | COMPLETED (this document) |
| 3 | `superpowers:executing-plans` | NEXT — use to execute tasks below |
| 4 | `competitive-research-brightdata` | Invoke during Tasks 8-12 |
| 5 | `superpowers:verification-before-completion` | Invoke at end of each phase |
| 6 | `superpowers:systematic-debugging` | Invoke if issues arise |
| 7 | `superpowers:requesting-code-review` | Invoke after major milestones |

---

## Phase 0: Project Foundation

### Task 1: Initialize Git Repository

**Files:**
- Create: `.gitignore`

**Step 1: Initialize git**

Run: `git init`

**Step 2: Create .gitignore**

```
# OS files
.DS_Store
Thumbs.db

# Sensitive data
*.env
credentials/
secrets/

# Raw scrape cache (large, regenerable)
research/scrapes/raw/

# Editor files
.vscode/
.idea/
*.swp
```

**Step 3: Initial commit**

Run:
```bash
git add .gitignore
git commit -m "init: project repository"
```

---

### Task 2: Write CLAUDE.md Constitution

**Files:**
- Create: `CLAUDE.md`

**Step 1: Write CLAUDE.md**

Full constitution based on design document Section 2. Must include:
- Project identity and purpose
- Dual-source intelligence methodology (Context7 + Bright Data rules)
- Operator rules (non-negotiable collaboration style)
- Session protocol (CONTEXT.md, staleness threshold)
- Security-as-a-lens principle
- Superpowers skill chain reference and discipline rules
- Reference to `operator/` files for founding context
- Reference to `docs/plans/2026-02-10-clawdbot-research-project-design.md` for full design
- Knowledge base bucket descriptions
- Source credibility tiers (1-5)
- Mac Mini as first-class research lens

**Step 2: Verify CLAUDE.md**

Read the file back. Confirm it covers all elements from design Section 2 and Section 4 (skill chain). Confirm operator rules match `operator/sean-currie-profile.md`.

**Step 3: Commit**

Run:
```bash
git add CLAUDE.md
git commit -m "foundation: CLAUDE.md constitution"
```

---

### Task 3: Write CONTEXT.md and Logging Files

**Files:**
- Create: `CONTEXT.md`
- Create: `CONTEXT-HISTORY.md`
- Create: `activity-log.md`
- Create: `intelligence-log.md`
- Create: `research/sources.md`

**Step 1: Write CONTEXT.md**

```markdown
# CONTEXT.md — ClawdBot Research Project

**Last Updated:** 2026-02-10
**Staleness Threshold:** 5 days (flag if older)

## Current Status
- Phase: 0 (Foundation) — project structure and constitution established
- Next: Phase 1 (Initial Research Execution)
- OpenClaw deployment: NOT YET — research first

## What Exists
- Project structure created (7-bucket KB, research/, operator/, patterns/)
- Operator context files written (profile, genesis, Tim transcript)
- Design document approved
- Implementation plan written
- CLAUDE.md constitution in place

## What's Next
- Execute initial research: Context7 foundation pull → Bright Data landscape sweep
- Populate knowledge base from dual-source intelligence
- Produce initial reports (landscape, architecture, Mac Mini feasibility, security)

## Open Questions
- (None yet — research phase will surface these)

## Key Decisions
- See `docs/plans/2026-02-10-clawdbot-research-project-design.md` Section 10
```

**Step 2: Write CONTEXT-HISTORY.md**

```markdown
# CONTEXT-HISTORY.md

## 2026-02-10 — Project Inception
- Brainstorming session completed
- Design document approved
- Implementation plan written
- Foundation phase (Phase 0) in progress
```

**Step 3: Write activity-log.md**

```markdown
# Activity Log

Lightweight breadcrumbs. What happened, when.

---

| Date | Entry |
|------|-------|
| 2026-02-10 | Project created. Brainstorming session completed. Design approved. |
| 2026-02-10 | Operator context files written (profile, genesis, Tim transcript). |
| 2026-02-10 | Implementation plan written. Foundation phase started. |
```

**Step 4: Write intelligence-log.md**

```markdown
# Intelligence Log

Strategic insights only. Hypotheses validated, contradictions found, key discoveries.

---

| Date | Insight | Source | Tier |
|------|---------|--------|------|
| 2026-02-10 | Tim warns most ClawdBot guides have "massive security vulnerabilities" — independent verification needed | Tech With Tim video | Tier 2 |
| 2026-02-10 | Tim argues VPS > Mac Mini but his arguments (cost, network exposure) are partially addressed by Sean's existing Tailscale + dedicated hardware setup | Tech With Tim video + operator context | Tier 2 + Tier 1 |
```

**Step 5: Write research/sources.md**

```markdown
# Source Tracking

All sources used in research, with credibility tier and date.

## Credibility Tiers
1. Official documentation + verified changelogs
2. Established creators with proven deployments
3. GitHub issues/PRs with reproducible details
4. Reddit/forum posts with technical specificity
5. General community sentiment

---

| Date | Source | Type | Tier | URL/Reference | Notes |
|------|--------|------|------|---------------|-------|
| 2026-02-10 | Tech With Tim — ClawdBot Setup Guide | YouTube video | 2 | See operator/source-transcript-techwith-tim.md | Trusted creator, professional developer, comprehensive security focus |
```

**Step 6: Commit**

Run:
```bash
git add CONTEXT.md CONTEXT-HISTORY.md activity-log.md intelligence-log.md research/sources.md
git commit -m "foundation: session continuity and logging infrastructure"
```

---

### Task 4: Commit Operator Files and Full Structure

**Files:**
- Stage: `operator/sean-currie-profile.md`
- Stage: `operator/project-genesis.md`
- Stage: `operator/source-transcript-techwith-tim.md`
- Stage: `docs/plans/2026-02-10-clawdbot-research-project-design.md`
- Stage: `docs/plans/2026-02-10-implementation-plan.md` (this file)
- Stage: All empty KB directories (use .gitkeep)

**Step 1: Add .gitkeep to empty directories**

Create `.gitkeep` in each empty KB directory so git tracks them:
- `knowledge-base/01-landscape/.gitkeep`
- `knowledge-base/02-architecture/.gitkeep`
- `knowledge-base/03-security/.gitkeep`
- `knowledge-base/04-deployment/.gitkeep`
- `knowledge-base/05-skills-and-integrations/.gitkeep`
- `knowledge-base/06-community-intelligence/.gitkeep`
- `knowledge-base/07-operations/.gitkeep`
- `research/scrapes/.gitkeep`
- `research/reports/.gitkeep`
- `patterns/.gitkeep`

**Step 2: Commit everything**

Run:
```bash
git add operator/ docs/ knowledge-base/ research/scrapes/.gitkeep research/reports/.gitkeep patterns/.gitkeep
git commit -m "foundation: operator context, design docs, KB structure"
```

**Step 3: Verify Phase 0 complete**

Run: `git log --oneline`

Expected: 3-4 commits showing foundation is in place.

> **CHECKPOINT:** Review with Sean. Phase 0 complete. Ready for Phase 1?

> **SKILL:** Invoke `superpowers:verification-before-completion` to confirm Phase 0 is solid before proceeding.

---

## Phase 1: Initial Research — Context7 Foundation

### Task 5: Context7 Pull — OpenClaw/ClawdBot Documentation

**Files:**
- Create: `knowledge-base/02-architecture/openclaw-official-docs.md`

**Step 1: Resolve OpenClaw library in Context7**

Use `context7:resolve-library-id` to find the OpenClaw/ClawdBot library.
Search terms: "openclaw", "clawdbot", "open-claw"

**Step 2: Pull full documentation**

Use `context7:query-docs` to pull comprehensive documentation. Target areas:
- Architecture overview
- Installation guide (look specifically for macOS/ARM instructions)
- Configuration reference
- Skill system documentation
- Security guidance
- Gateway and API surface
- Model connection setup

**Step 3: Synthesize into KB file**

Write findings to `knowledge-base/02-architecture/openclaw-official-docs.md` with sections for each area. Date-stamp. Note any gaps where documentation is thin or missing.

**Step 4: Flag macOS-specific findings**

If macOS/ARM-specific docs exist, extract them to `knowledge-base/04-deployment/openclaw-macos-official.md`. If they DON'T exist, log this gap in `intelligence-log.md` — this is a significant finding.

**Step 5: Commit**

Run:
```bash
git add knowledge-base/ intelligence-log.md
git commit -m "research: Context7 OpenClaw documentation foundation"
```

---

### Task 6: Context7 Pull — Adjacent Technology Documentation

**Files:**
- Create: `knowledge-base/02-architecture/adjacent-tech-docs.md`

**Step 1: Identify dependencies from Task 5**

From the OpenClaw docs pulled in Task 5, identify key technology dependencies (likely: Node.js, npm, Tailscale, Telegram Bot API, possibly Docker, possibly specific LLM SDKs).

**Step 2: Pull relevant docs via Context7**

For each dependency, use `context7:resolve-library-id` then `context7:query-docs` to pull:
- Tailscale: SSH configuration, ACLs, macOS setup specifics
- Telegram Bot API: Bot creation, messaging, security
- Node.js: Version requirements, ARM/macOS compatibility
- Any other dependencies identified in Step 1

**Step 3: Synthesize into KB file**

Write to `knowledge-base/02-architecture/adjacent-tech-docs.md`. Focus on what's relevant to our deployment — not full docs, just what matters for running OpenClaw on a Mac Mini with Tailscale.

**Step 4: Commit**

Run:
```bash
git add knowledge-base/
git commit -m "research: Context7 adjacent technology documentation"
```

> **CHECKPOINT:** Context7 foundation complete. The research agent now has official documentation loaded before any community scraping begins.

---

## Phase 1 (continued): Initial Research — Bright Data Sweep

> **SKILL:** Invoke `competitive-research-brightdata` skill to structure the Bright Data research execution.

### Task 7: Bright Data — General OpenClaw Community Intelligence

**Files:**
- Create: `research/scrapes/openclaw-community-sweep-2026-02-10.md`
- Create: `knowledge-base/06-community-intelligence/openclaw-community-findings.md`

**Step 1: Execute Bright Data search engine batch**

Queries (run as batch):
- "OpenClaw setup guide 2026"
- "ClawdBot deployment experience"
- "OpenClaw security best practices"
- "ClawdBot review developer"
- "OpenClaw vs alternatives"
- "ClawdBot skills configuration"
- "OpenClaw troubleshooting common issues"

Targets: Reddit, YouTube, Hacker News, GitHub, developer blogs

**Step 2: Scrape top results**

Use Bright Data scrape for detailed content extraction on the most relevant results from Step 1. Save raw output to `research/scrapes/`.

**Step 3: Synthesize against Context7 docs**

Cross-reference community findings against the official documentation from Tasks 5-6:
- Where do docs and community agree?
- Where do they contradict?
- What expert knowledge goes beyond the docs?
- What bad advice or nonsense needs flagging?

Write synthesized findings to `knowledge-base/06-community-intelligence/openclaw-community-findings.md`.

**Step 4: Update sources.md**

Add every source used to `research/sources.md` with credibility tier and date.

**Step 5: Update intelligence-log.md**

Log any contradictions, surprises, or significant insights discovered.

**Step 6: Commit**

Run:
```bash
git add research/ knowledge-base/ intelligence-log.md
git commit -m "research: Bright Data OpenClaw community intelligence sweep"
```

---

### Task 8: Bright Data — Mac Mini Deployment Focus

**Files:**
- Create: `research/scrapes/mac-mini-deployment-sweep-2026-02-10.md`
- Create: `knowledge-base/04-deployment/mac-mini-community-findings.md`

**Step 1: Execute Bright Data search engine batch — Mac Mini specific**

Queries (run as batch):
- "OpenClaw Mac Mini deployment"
- "ClawdBot macOS setup"
- "AI agent Apple Silicon M4"
- "Mac Mini home server AI agent 2026"
- "M4 Mac Mini always on server"
- "Mac Mini vs VPS AI agent"
- "OpenClaw ARM compatibility"
- "self hosted AI agent Mac"

**Step 2: Scrape top results**

Detailed content extraction. Prioritize:
- Actual deployment reports (positive AND negative)
- Performance data on Apple Silicon
- macOS-specific gotchas vs Linux
- Power consumption / always-on reliability reports
- Network configuration differences on macOS

**Step 3: Synthesize into KB**

Write to `knowledge-base/04-deployment/mac-mini-community-findings.md`. Structure:
- What works well on Mac Mini
- Known issues / limitations
- macOS vs Linux differences for this use case
- Resource usage reports (M4 16GB context)
- Community consensus (if any)

**Step 4: Cross-reference with Tim's video**

Compare findings against Tim's arguments in `operator/source-transcript-techwith-tim.md`. Where does community experience validate or challenge Tim's VPS recommendation?

**Step 5: Update logs and sources**

Update `intelligence-log.md`, `research/sources.md`, and `activity-log.md`.

**Step 6: Commit**

Run:
```bash
git add research/ knowledge-base/ intelligence-log.md activity-log.md
git commit -m "research: Bright Data Mac Mini deployment intelligence"
```

---

### Task 9: Bright Data — Competitive Landscape Scan

**Files:**
- Create: `research/scrapes/landscape-sweep-2026-02-10.md`
- Create: `knowledge-base/01-landscape/competitive-landscape.md`
- Create: `research/reports/landscape-comparison-matrix.md`

> **SKILL:** Invoke `competitive-research-brightdata` for structured competitive analysis.

**Step 1: Execute Bright Data search engine batch — landscape**

Queries (run as batch):
- "best autonomous AI agent framework 2026"
- "OpenClaw vs n8n AI agent"
- "OpenClaw vs CrewAI"
- "OpenClaw vs LangGraph"
- "OpenClaw vs AutoGPT"
- "OpenClaw vs AgentGPT"
- "OpenClaw vs OpenDevin"
- "self hosted AI agent comparison 2026"
- "AI agent framework Mac compatible"

**Step 2: For each competitor, pull Context7 docs**

Use Context7 to pull official documentation for the top 3-4 contenders identified. This ensures we compare based on official capabilities, not just Reddit opinions.

**Step 3: Scrape detailed comparisons**

Bright Data scrape on comparison articles, Reddit threads, and YouTube videos that directly compare tools.

**Step 4: Build comparison matrix**

Write to `research/reports/landscape-comparison-matrix.md`:

| Feature | OpenClaw | n8n | CrewAI | LangGraph | [Others] |
|---------|----------|-----|--------|-----------|----------|
| What it is | | | | | |
| Hosting model | | | | | |
| LLM compatibility | | | | | |
| Skill/plugin ecosystem | | | | | |
| Security posture | | | | | |
| Community size | | | | | |
| Maturity level | | | | | |
| Mac Mini compatible | | | | | |
| Real deployment stories | | | | | |

**Step 5: Write landscape KB entry**

Synthesize into `knowledge-base/01-landscape/competitive-landscape.md` with:
- Overview of each tool
- Where OpenClaw wins
- Where alternatives are stronger
- What we might run alongside OpenClaw
- What to monitor for future evaluation

**Step 6: Update logs and sources**

**Step 7: Commit**

Run:
```bash
git add research/ knowledge-base/ intelligence-log.md activity-log.md
git commit -m "research: competitive landscape analysis complete"
```

---

### Task 10: Security Research — Cross-Source Deep Dive

**Files:**
- Create: `knowledge-base/03-security/security-posture-analysis.md`

**Step 1: Context7 pull — OpenClaw security documentation**

Pull any security-specific documentation, hardening guides, known vulnerabilities, security advisories.

**Step 2: Bright Data — security community intelligence**

Queries:
- "OpenClaw security vulnerability"
- "ClawdBot prompt injection"
- "AI agent security best practices 2026"
- "OpenClaw hardening guide"
- "autonomous AI agent attack surface"
- "ClawdBot hack exploit"

**Step 3: Synthesize security analysis**

Write to `knowledge-base/03-security/security-posture-analysis.md`:
- Tim's recommendations (from transcript) — validated or challenged
- Official security guidance (from Context7)
- Community-reported vulnerabilities or concerns
- Mac Mini-specific security considerations
- Prompt injection attack vectors and mitigations
- Recommended security configuration for our deployment
- What Tim missed (if anything)

**Step 4: Update intelligence-log.md with security findings**

**Step 5: Commit**

Run:
```bash
git add knowledge-base/ intelligence-log.md
git commit -m "research: security posture analysis complete"
```

---

### Task 11: Produce Initial Research Reports

**Files:**
- Create: `research/reports/01-landscape-report.md`
- Create: `research/reports/02-architecture-reference.md`
- Create: `research/reports/03-mac-mini-feasibility.md`
- Create: `research/reports/04-security-evaluation.md`
- Create: `research/reports/05-open-questions.md`

**Step 1: Write landscape report**

Synthesize Tasks 9 findings into a readable report. Include the comparison matrix, positioning analysis, and recommendations.

**Step 2: Write architecture reference**

Synthesize Tasks 5-6 + community findings from Task 7 into an architecture reference that explains how OpenClaw works — docs + reality.

**Step 3: Write Mac Mini feasibility assessment**

Synthesize Task 8 findings into a clear feasibility report. Include: recommended configuration, expected resource usage, known risks, mitigation strategies, comparison to VPS path.

**Step 4: Write security evaluation**

Synthesize Task 10 into a security evaluation. Include: Tim's recommendations with our validation, additional findings, recommended security config for Mac Mini deployment.

**Step 5: Write open questions list**

Document everything we couldn't resolve through research alone — things that need hands-on testing during deployment.

**Step 6: Commit**

Run:
```bash
git add research/reports/
git commit -m "research: initial reports complete"
```

---

### Task 12: Phase 1 Completion — Update Context and Review

**Files:**
- Modify: `CONTEXT.md`
- Modify: `activity-log.md`

**Step 1: Update CONTEXT.md**

Update to reflect Phase 1 completion:
- Current status: Phase 1 complete, ready for Phase 2
- Summary of key findings
- Open questions surfaced
- Next steps

**Step 2: Update activity-log.md with Phase 1 summary**

**Step 3: Commit**

Run:
```bash
git add CONTEXT.md activity-log.md
git commit -m "milestone: Phase 1 initial research complete"
```

> **CHECKPOINT:** Full review with Sean. Present key findings from all reports. Discuss open questions. Confirm readiness for Phase 2 (Architecture Deep-Dive) or adjust course based on findings.

> **SKILL:** Invoke `superpowers:verification-before-completion` to validate Phase 1 is truly complete.

---

## Phase 2: Architecture Deep-Dive

### Task 13: Deep Architecture Investigation

**Files:**
- Modify: `knowledge-base/02-architecture/openclaw-official-docs.md`
- Create: `knowledge-base/02-architecture/deep-dive-findings.md`

**Step 1: Identify architecture gaps from Phase 1**

Review the architecture reference report and open questions. What do we still not understand about:
- Orchestration model and message routing
- Gateway internals and security surface
- Skill execution model (sandboxed?)
- Data flow (what goes to LLM providers vs. stays local)
- Multi-model routing and fallback behavior

**Step 2: Targeted Context7 pulls**

Pull documentation specifically for each gap identified. Go deeper than the initial sweep.

**Step 3: Targeted Bright Data scrapes**

Search for developer deep-dives, GitHub source code analysis, architecture blog posts, and technical YouTube content that explains the internals.

**Step 4: Synthesize deep-dive findings**

Write to `knowledge-base/02-architecture/deep-dive-findings.md`. This is the "engineer's understanding" — how it actually works, not just what the marketing says.

**Step 5: Commit**

Run:
```bash
git add knowledge-base/
git commit -m "research: architecture deep-dive complete"
```

---

### Task 14: Skills & Integrations Research

**Files:**
- Create: `knowledge-base/05-skills-and-integrations/skill-system-reference.md`
- Create: `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md`

**Step 1: Context7 — skill system documentation**

Pull complete skill authoring docs, built-in skill list, integration APIs.

**Step 2: Bright Data — community skill recommendations**

Search for: "best OpenClaw skills", "ClawdBot skill configuration", "OpenClaw custom skill development", "ClawdBot recommended setup".

**Step 3: Write skill system reference**

Document how skills work, how to write custom ones, security implications of each skill type.

**Step 4: Write starter skills recommendation**

Based on Sean's use cases (personal productivity, professional work, learning), recommend which skills to enable first and which to defer. Include security assessment for each.

**Step 5: Commit**

Run:
```bash
git add knowledge-base/
git commit -m "research: skills and integrations reference complete"
```

---

### Task 15: Phase 2 Completion — Update Context and Review

**Files:**
- Modify: `CONTEXT.md`
- Modify: `activity-log.md`
- Modify: `intelligence-log.md`

**Step 1: Update all tracking files**

**Step 2: Commit**

Run:
```bash
git add CONTEXT.md activity-log.md intelligence-log.md
git commit -m "milestone: Phase 2 architecture deep-dive complete"
```

> **CHECKPOINT:** Review with Sean. Present architecture understanding, skill recommendations, and updated security assessment. Confirm readiness for Phase 3 (Deployment) or identify areas needing more research.

> **SKILL:** Invoke `superpowers:verification-before-completion` to validate Phase 2.

---

## Phase 3: Deployment Plan

### Task 16: Create Mac Mini Deployment Plan

**Files:**
- Create: `knowledge-base/04-deployment/mac-mini-deployment-plan.md`

**Step 1: Synthesize all research into deployment steps**

Using everything from Phases 1-2, create a Mac Mini-specific deployment plan:
- Pre-deployment checklist (what to clean/wipe, what to keep)
- Security hardening steps (adapted from Tim's guide for macOS + our research findings)
- OpenClaw installation (macOS/ARM path, verified against docs + community)
- Model connection configuration (Claude subscription + spending limits)
- Channel setup (Telegram or researched alternative)
- Starter skills enablement (from Task 14)
- Gateway access via Tailscale port tunneling
- Validation steps (verify working + secure)

**Step 2: Cross-reference every step against both sources**

Each deployment step should note:
- What the official docs say
- What community experience says
- What Tim's guide recommends (where relevant)
- Any Mac Mini-specific deviations from standard guides

**Step 3: Commit**

Run:
```bash
git add knowledge-base/
git commit -m "deployment: Mac Mini deployment plan created"
```

> **CHECKPOINT:** Review deployment plan with Sean before execution. This is the last gate before touching the Mac Mini.

---

### Task 17: Execute Deployment (When Approved)

This task is intentionally high-level. The specific deployment commands will come from the deployment plan created in Task 16, informed by all research. Execution follows:

**Step 1: Pre-deployment validation**

Verify Mac Mini state, Tailscale connectivity, available resources.

**Step 2: Security hardening**

Execute hardening steps from deployment plan.

**Step 3: Install OpenClaw**

Follow macOS/ARM installation path.

**Step 4: Configure models and channels**

Connect LLM providers, set up Telegram, configure spending limits.

**Step 5: Enable starter skills**

Based on Task 14 recommendations.

**Step 6: Validate**

Run through validation checklist. Verify both functionality AND security.

**Step 7: Document**

Update `knowledge-base/07-operations/` with operational notes from the actual deployment experience.

> **SKILL:** Invoke `superpowers:verification-before-completion` before declaring deployment successful.
> **SKILL:** Invoke `superpowers:systematic-debugging` if any step fails.

**Step 8: Commit**

Run:
```bash
git add .
git commit -m "milestone: OpenClaw deployed on Mac Mini"
```

**Step 9: Update CONTEXT.md to reflect live deployment**

---

### Task 18: Post-Deployment — Establish Living System

**Files:**
- Modify: `CONTEXT.md`
- Create: `knowledge-base/07-operations/operational-runbook.md`

**Step 1: Write operational runbook**

Document:
- How to check if the bot is running
- How to access the gateway UI
- How to restart services
- How to update OpenClaw
- How to add/remove skills
- Monitoring and usage tracking
- Emergency procedures (stop the bot, revoke access)

**Step 2: Establish research cadence**

Document the periodic research sweep plan:
- What gets checked and how often
- Context7 documentation monitoring triggers
- Bright Data community sweep schedule
- How findings feed back into the KB

**Step 3: Update CONTEXT.md to operational mode**

Shift from "building" to "operating" — the living system is now live.

**Step 4: Final commit**

Run:
```bash
git add .
git commit -m "milestone: living system operational — research cadence established"
```

> **SKILL:** Invoke `superpowers:requesting-code-review` to review the complete project against the original design document.
