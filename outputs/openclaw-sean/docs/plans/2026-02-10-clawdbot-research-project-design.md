# ClawdBot Research Project — Design Document

**Created:** 2026-02-10
**Status:** Approved (brainstorming session)
**Operator:** Sean Currie
**Source Files:** `operator/project-genesis.md`, `operator/sean-currie-profile.md`, `operator/source-transcript-techwith-tim.md`

---

## 1. Project Structure & Knowledge Base

```
clawdbot-research-project/
├── CLAUDE.md                          # Constitution for this project
├── CONTEXT.md                         # Session continuity (living)
├── CONTEXT-HISTORY.md                 # Archived context
├── activity-log.md                    # Lightweight breadcrumbs
├── intelligence-log.md                # Strategic insights only
├── docs/
│   └── plans/                         # Dated design/plan docs
├── knowledge-base/
│   ├── 01-landscape/                  # Competitive landscape (tools, comparisons)
│   ├── 02-architecture/               # OpenClaw internals, how it works
│   ├── 03-security/                   # Threat models, hardening, best practices
│   ├── 04-deployment/                 # Mac Mini setup, config, operations
│   ├── 05-skills-and-integrations/    # Bot skills, connected services, MCP
│   ├── 06-community-intelligence/     # Reddit, YouTube, creator insights
│   └── 07-operations/                 # Running it, monitoring, maintaining
├── research/
│   ├── scrapes/                       # Raw Bright Data outputs
│   ├── reports/                       # Processed research deliverables
│   └── sources.md                     # Source tracking and credibility notes
├── operator/                          # Operator context and founding documents
│   ├── sean-currie-profile.md
│   ├── project-genesis.md
│   └── source-transcript-techwith-tim.md
└── patterns/                          # Extracted patterns (solve once, reuse)
```

Mirrors Sean's proven 7-bucket approach from salesenablementengine, adapted from client engagement work to technology research & deployment. Each KB bucket accumulates independently. Research scrapes are raw inputs; knowledge base is the refined, persistent truth.

---

## 2. CLAUDE.md Constitution (Key Principles)

### Identity & Purpose
This project is a living intelligence system for autonomous AI agent technology — focused on ClawdBot/OpenClaw but aware of the broader landscape. It accumulates knowledge, informs decisions, and stays current. It is not a one-time setup guide.

### Research Methodology — Dual-Source Intelligence
- Every claim gets validated against both official documentation (Context7) AND community intelligence (Bright Data scraping of Reddit, YouTube, GitHub, developer blogs)
- Never treat documentation as ground truth alone — real-world deployment reports, expert configurations, and creator insights amplify and enhance beyond what docs cover
- Track source credibility (official docs > established creator with deployment experience > random Reddit post)
- Date-stamp everything — this space moves fast, a "best practice" from 3 weeks ago may already be outdated

### Operator Rules (Non-Negotiable)
- Research before agreeing with any hypothesis Sean proposes
- Push back when evidence contradicts assumptions
- Bring data and sources, not just agreement
- Knowledge accumulates, never resets — mark outdated, don't delete
- Security is a lens on every decision, not a separate phase

### Session Protocol
- Read CONTEXT.md at session start
- Check staleness (>5 days in this fast-moving space = flag for review)
- Update at significant findings, log pivots with timestamps

---

## 3. Research Methodology — How Context7 + Bright Data Work Together

### The Dual-Source Model

**Context7** = official truth (documentation, APIs, configuration reference)
**Bright Data** = community truth + expert amplification (Reddit, YouTube, GitHub, developer blogs)

Documentation tells you what a tool claims to do. Community intelligence tells you what actually works, what breaks in production, what experts have optimized beyond the docs, and what nonsense to avoid. Neither stands alone.

### Three Operating Modes

**Mode 1: Documentation Pull (Context7-led)**
When we need to understand how something officially works — OpenClaw's architecture, configuration options, API surface, skill system. Context7 pulls current docs fast. Bright Data supplements with GitHub issues, expert blog posts, and changelogs that reveal what the docs don't say.

**Mode 2: Landscape Scan (Bright Data-led)**
When we need to map the competitive field or gauge community sentiment. Bright Data scrapes Reddit (r/selfhosted, r/LocalLLaMA, r/ChatGPT, r/ClaudeAI), YouTube creator content, Hacker News threads, GitHub trending, and developer blogs. Context7 then validates any technical claims against official documentation of the tools mentioned.

**Mode 3: Reality Check & Amplification (Both, cross-validating)**
When we have a specific question like "Is running OpenClaw on a Mac Mini actually viable long-term?" — we pull the official system requirements via Context7 AND scrape real deployment reports from Reddit/YouTube/GitHub discussions via Bright Data. Contradictions between the two are flagged as intelligence insights. Expert knowledge that goes beyond the docs is captured as amplification.

### Source Credibility Tiers
1. Official documentation + verified changelogs
2. Established creators with proven deployments (e.g., Tech With Tim)
3. GitHub issues/PRs with reproducible details
4. Reddit/forum posts with technical specificity
5. General community sentiment (useful for direction, not for decisions)

### The Rule
Context7 is never optional. It runs in tandem with Bright Data research, and it runs independently whenever we touch configuration, troubleshoot, or evaluate changes. Documentation is the baseline; community intelligence is the reality check AND the knowledge amplifier. Neither stands alone.

---

## 4. Superpowers Skill Chain — How We Execute

This project follows a disciplined skill chain from the superpowers framework. Each skill serves a specific purpose in the workflow and is invoked at the right moment — not skipped, not improvised.

### Skill Execution Order

| Order | Skill | Purpose | When |
|-------|-------|---------|------|
| 1 | `superpowers:brainstorming` | Explore intent, requirements, design before implementation | Project inception (COMPLETED) |
| 2 | `superpowers:writing-plans` | Create detailed, step-by-step implementation plan from this design | After design approval (NEXT) |
| 3 | `competitive-research-brightdata` | Execute Phase 1 landscape research with Bright Data MCP | During initial research execution |
| 4 | `superpowers:executing-plans` | Carry out the implementation plan with review checkpoints | During Phases 1-3 execution |
| 5 | `superpowers:verification-before-completion` | Validate each phase is truly complete before moving on | End of each phase |
| 6 | `superpowers:systematic-debugging` | Diagnose issues encountered during deployment or operation | When things break |
| 7 | `superpowers:requesting-code-review` | Review completed work against requirements | After major milestones |

### Supporting Tools Used Throughout

| Tool | Role |
|------|------|
| Context7 (MCP) | Official documentation pulls — always paired with Bright Data, never skipped |
| Bright Data (MCP) | Community intelligence, competitive research, expert knowledge scraping |
| `competitive-research-brightdata` skill | Structured competitive analysis workflow for landscape research |

### Skill Discipline Rules
- Skills are invoked via the Skill tool, not improvised from memory
- If a skill applies (even 1% chance), it gets invoked — no rationalizing
- Process skills first (brainstorming, debugging), implementation skills second
- Rigid skills (TDD, debugging) are followed exactly; flexible skills adapt to context
- Each skill invocation is logged in activity-log.md

---

## 5. Initial Research Execution — Populating the Engine

This is the actual first research cycle. Sequence matters — each step builds on the previous.

### Step 1: Context7 Foundation Pull
Before anything else, Context7 pulls the full current OpenClaw/ClawdBot documentation. Everything — architecture docs, installation guides, configuration reference, skill authoring, security guidance, API surface, macOS-specific notes if they exist. Goes into `knowledge-base/02-architecture/` as the baseline truth. The research agent now understands what OpenClaw actually is, from the source, before reading a single Reddit post.

### Step 2: Context7 Expands to Adjacent Documentation
Still Context7 — pull docs for key technologies OpenClaw depends on or integrates with. Tailscale docs (already in use). Telegram Bot API (likely channel). Node.js/npm (runtime). Whatever the skill system builds on. Gives the research agent technical context beyond just OpenClaw itself.

### Step 3: Bright Data Landscape Sweep (Informed)
NOW Bright Data goes out — but the agent already has the official documentation loaded. Instead of blind scraping, it asks smarter questions:
- "OpenClaw docs say X about security — what are people actually experiencing?"
- "The docs recommend Y for Mac deployment — are real users confirming that works?"
- "The skill system uses Z architecture — are developers finding that limiting?"

Targets: Reddit (r/selfhosted, r/LocalLLaMA, r/ClaudeAI, r/homelab), YouTube (deployment walkthroughs, creator reviews), GitHub (issues, discussions, stars/forks trends), Hacker News, developer blogs.

### Step 4: Bright Data Focused Scrape — Mac Mini Specifically
Dedicated search queries targeting Mac Mini + AI agent deployment. Positive AND negative. "OpenClaw Mac Mini", "ClawdBot macOS", "AI agent Apple Silicon", "Mac Mini home server AI", "M4 Mac Mini always on". Populates `knowledge-base/04-deployment/` with real-world Mac-specific intelligence.

### Step 5: Bright Data Competitive Landscape
Landscape scan informed by Steps 1-2. We already know what OpenClaw does, so we can meaningfully compare: "What does n8n offer that OpenClaw doesn't?", "CrewAI vs OpenClaw for autonomous tasks", "LangGraph architecture comparison". Results populate `knowledge-base/01-landscape/`.

### Step 6: Cross-Validation & Synthesis
Take everything from Steps 1-5 and cross-reference:
- Where do docs and community agree?
- Where do they contradict?
- Where are there gaps the docs don't address but the community has figured out?
- What expert knowledge amplifies beyond the documentation?
- What nonsense or bad advice needs to be flagged and avoided?

Contradictions and gaps go into `intelligence-log.md`. Synthesized findings go into the relevant KB buckets.

### Step 7: Initial Reports
Produce first deliverables into `research/reports/`:
- Landscape comparison matrix
- OpenClaw architecture reference (docs + community reality)
- Mac Mini deployment feasibility assessment
- Security posture evaluation (Tim's recommendations + our findings)
- Open questions list (things we couldn't resolve that need hands-on testing)

---

## 6. Phase 1 — Landscape Research

**Primary goal:** Understand the field so our OpenClaw deployment is informed and we have escape routes if needed.

**Framing:** We ARE going with OpenClaw. The landscape research exists to:
- Make us smarter about what OpenClaw does well vs. where alternatives shine
- Give us stored knowledge to pivot from if we ever want to
- Inform our OpenClaw build by understanding what problems other tools solve differently
- Keep us from being surprised when someone says "why didn't you just use X?"

**What we're mapping:**
- Autonomous agent frameworks: OpenClaw/ClawdBot, n8n, AutoGPT, CrewAI, LangGraph, AgentGPT, OpenDevin, and whatever else is gaining traction
- For each tool: What it actually is, hosting model, LLM compatibility, skill/plugin ecosystem, security posture, community size, maturity level, Mac Mini compatibility
- The "who's actually using this" question: Real deployment stories vs. demo-ware

**Mac Mini as a first-class research lens:**
Every tool evaluated for Mac Mini viability. Every community scrape includes Mac Mini-specific queries. Positive and negative experiences captured equally.

**Deliverable:** Landscape report with comparison matrix and clear positioning of OpenClaw within the field.

---

## 7. Phase 2 — OpenClaw Architecture Deep-Dive

**Primary goal:** Understand OpenClaw like an engineer, not a tutorial follower.

**What we're investigating:**
- **Orchestration model:** How it routes messages to LLMs, decides when to act, manages task queues
- **Gateway & UI:** What the gateway exposes, its security surface, port behavior
- **Skill system:** How skills are structured, custom skill development, execution model (sandboxed or not)
- **Model management:** Multi-model setups (cheaper model for bulk, frontier for complex), routing, fallbacks
- **Data residency:** What lives on disk, what hits LLM providers, what's in memory — critical for security
- **macOS/M4 specifics:** ARM compatibility, resource profile on 16GB, differences from the Linux path most guides assume
- **Landscape-informed gaps:** If Phase 1 revealed another tool handles something better, note whether OpenClaw can integrate or if it's a known gap

**Deliverable:** Architecture reference in `knowledge-base/02-architecture/` — understanding you can reason from, not commands to copy-paste.

---

## 8. Phase 3 — Deployment Plan (Mac Mini Build)

**Primary goal:** Turn research into action. Deploy OpenClaw on the M4 Mac Mini.

**What the plan covers:**
- **Pre-deployment checklist:** What to clean/wipe on the Mac Mini, what to leave (Tailscale stays)
- **Security hardening:** SSH config, firewall rules, user permissions — evaluated against Tim's recommendations PLUS everything our research uncovered
- **OpenClaw installation:** Step-by-step for macOS/ARM, adapted from Linux-focused guides
- **Model connections:** Configure with existing Claude subscription and/or OpenAI, with spending safeguards
- **Channel setup:** Telegram or whatever our research suggests is most secure
- **Skills configuration:** Which skills to enable first, which to avoid until input/output surface is understood
- **Gateway access:** Port tunneling via Tailscale (infrastructure already exists)
- **Validation:** Verify everything is working AND secure before feeding it real tasks

**Key difference from Tim's guide:** His is VPS/Debian/Linux. Ours is Mac Mini/macOS/ARM. Different enough that each step must be validated against the macOS path.

---

## 9. The Living System — How This Stays Current

### Continuous Intelligence Cycles
- **Periodic research sweeps:** Bright Data batch scrapes on cadence (weekly/biweekly) targeting Reddit, GitHub releases, YouTube for new content, security advisories, community sentiment shifts
- **Context7 documentation monitoring:** When OpenClaw updates, Context7 pulls full documentation diff — not just changelog, but updated config docs, new API surfaces, changed skill formats, deprecated features
- **Troubleshooting:** When something breaks, Context7 pulls relevant official docs FIRST. Bright Data supplements with community solutions
- **Skill development:** When adding or building skills, Context7 pulls current skill authoring docs so we build against latest spec
- **Security validation:** Configuration decisions cross-referenced against both official security docs AND community experiences
- **Pattern extraction:** As the ClawdBot operates, things will break, surprises will happen, optimizations will emerge. Each one gets captured in `patterns/`

### The CONTEXT.md Role
Every session starts by reading CONTEXT.md. What's deployed, what version, what's working, what's being investigated. Staleness threshold: 5 days (this space moves fast).

### intelligence-log.md (Strategic Moments)
- "OpenClaw v2.x released — breaking change in skill format"
- "Reddit reports Mac Mini memory issues above 15 concurrent skills"
- "New competitor tool launched — stored in landscape KB for evaluation"
- "Tim posted follow-up video with updated security recommendations"

### activity-log.md (Breadcrumbs)
- "Ran landscape research sweep — 47 sources scraped"
- "Updated architecture KB with v2.x changes"
- "Deployed skill X, tested for 3 days, added to patterns"

### The Goal
Walk away for two weeks, come back, read CONTEXT.md, know exactly where things stand and what needs attention.

---

## 10. Key Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| OpenClaw as primary tool | Going in informed, landscape research for awareness not decision-making | 2026-02-10 |
| M4 Mac Mini over VPS | Already own hardware, Tailscale already configured, full local control | 2026-02-10 |
| Adapted salesenablementengine pattern | Proven over 150+ days of production use, directly transferable | 2026-02-10 |
| Dual-source intelligence (Context7 + Bright Data) | Docs alone insufficient; community intelligence amplifies and reality-checks | 2026-02-10 |
| Mac Mini as first-class research lens | Every phase prioritizes Mac Mini-specific findings, positive and negative | 2026-02-10 |
| Security as lens, not phase | Considered throughout, not isolated into a single research step | 2026-02-10 |
| Superpowers skill chain | Disciplined workflow: brainstorm → write-plans → execute → verify | 2026-02-10 |
