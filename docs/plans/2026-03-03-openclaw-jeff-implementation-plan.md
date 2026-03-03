# OpenClaw-Jeff Output #2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Produce a tailored, research-backed interactive HTML walkthrough for Jeff (Denver real estate agent) to deploy OpenClaw on a MacBook Air with a social media automation focus.

**Architecture:** Full engine pipeline execution — Intake → Research → Synthesis → Output Generation → Delivery. This is the first output produced using the complete engine methodology (including visual output methodology, binary self-tests, anti-pattern checks, and section construction). The output lives at `outputs/openclaw-jeff/` and is self-contained.

**Tech Stack:** Markdown (research, KB, reports), HTML/CSS/JS (interactive walkthrough), Rough.js + Mermaid.js (diagrams), Context7 MCP + Bright Data MCP (dual-source research), Puppeteer MCP (render-validate).

**Design Document:** `docs/plans/2026-03-03-openclaw-jeff-design.md`

---

## Phase 1: Intake

### Task 1: Scaffold Output Directory

**Context:** Every output follows the same directory structure. This creates the skeleton that all subsequent tasks populate. The structure mirrors Output #1 but with Jeff-specific naming.

**Files:**
- Create: `outputs/openclaw-jeff/CONTEXT.md`
- Create: `outputs/openclaw-jeff/activity-log.md`
- Create: `outputs/openclaw-jeff/intelligence-log.md`
- Create: `outputs/openclaw-jeff/operator/jeff-profile.md`
- Create: `outputs/openclaw-jeff/research/sources.md`
- Create: `outputs/openclaw-jeff/research/intelligence-log.md` (symlink or duplicate — use one canonical location)
- Create directories: `outputs/openclaw-jeff/research/reports/`, `outputs/openclaw-jeff/research/knowledge-base/`, `outputs/openclaw-jeff/docs/walkthrough/interactive/src/`, `outputs/openclaw-jeff/docs/plans/`

**Step 1: Create the directory structure**

```bash
mkdir -p outputs/openclaw-jeff/{operator,research/{reports,knowledge-base/{01-landscape,02-architecture,03-security,04-deployment,05-skills-and-integrations,06-community-intelligence,07-operations},scrapes},docs/{walkthrough/interactive/src,plans}}
```

**Step 2: Create CONTEXT.md**

Create `outputs/openclaw-jeff/CONTEXT.md` with initial state:

```markdown
# CONTEXT.md — OpenClaw for Jeff (Output #2)

**Last Updated:** 2026-03-03
**Staleness Threshold:** 5 days

## Output Purpose

Tailored interactive walkthrough for Jeff (Denver real estate agent, Hatch brand owner) to deploy OpenClaw on a MacBook Air. Primary use case: social media management (Instagram). Educational focus on understanding what OpenClaw is, why dedicated hardware matters, security basics, and prompting fundamentals.

## Current Status

- **Phase:** Intake
- **Pipeline stage:** Scaffolding complete, operator profile next
- **Deployment target:** MacBook Air (config TBD — output is config-agnostic)
- **LLM:** Claude (subscription)

## What This Output Produces

TBD — populated as research and output generation complete.

## Key Decisions

- Config-agnostic (works for any MacBook Air config, minimum requirements noted)
- Three depth tiers: Core setup + Social media use case + Foundational SEO/research mention
- Educational layer included: dedicated machine reasoning, security vigilance, prompting basics
- No contract/transaction coordinator work (out of scope)

## Open Questions

- MacBook Air M4 specs (not yet announced at time of writing)
- OpenClaw social media skill availability and quality
- Instagram API integration maturity via OpenClaw
```

**Step 3: Create activity-log.md**

```markdown
# Activity Log — OpenClaw for Jeff (Output #2)

| Date | Entry |
|------|-------|
| 2026-03-03 | Output #2 scaffolded. Directory structure created. Design doc at docs/plans/2026-03-03-openclaw-jeff-design.md. |
```

**Step 4: Create intelligence-log.md**

```markdown
# Intelligence Log — OpenClaw for Jeff (Output #2)

Strategic insights captured during research and synthesis. Each entry includes source and credibility tier.

| Date | Insight | Source | Tier |
|------|---------|--------|------|
```

**Step 5: Create sources.md**

```markdown
# Source Tracking — OpenClaw for Jeff (Output #2)

All sources used in research, with credibility tier and date.

## Credibility Tiers

1. Official documentation + verified changelogs
2. Established creators with proven deployments
3. GitHub issues/PRs with reproducible details
4. Reddit/forum posts with technical specificity
5. General community sentiment

## Inherited from Output #1

Sources reused from Output #1 (openclaw-sean) are marked with `[inherited]` and freshness-checked before use. Original source details in `outputs/openclaw-sean/research/sources.md`.

## Context7 — Official Documentation (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|

## Bright Data — Community Intelligence (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
```

**Step 6: Commit**

```bash
git add outputs/openclaw-jeff/
git commit -m "intake: scaffold Output #2 (openclaw-jeff) directory structure"
```

---

### Task 2: Create Operator Profile

**Context:** The operator profile translates Sean's raw context (the iMessage conversation dump) into a structured document that informs every downstream decision — research scope, walkthrough tone, hardening tier, content depth. Use the template at `engine/intake/operator-profile-template.md`.

**Files:**
- Modify: `outputs/openclaw-jeff/operator/jeff-profile.md`

**Step 1: Read the template**

```
Read: engine/intake/operator-profile-template.md
```

**Step 2: Fill in Jeff's profile from the conversation dump**

The iMessage conversation between Sean and Jeff (provided during brainstorming) contains all the raw material. Extract and structure into the template. Key data points:

**Who They Are:**
- Name: Jeff
- Relationship to Sean: Friend/associate
- Professional role: Real estate agent, top-ranked in Denver AI search (#1-2 out of 20k agents)
- Industry: Real estate
- Brand: Hatch (@jeffanswers on Instagram)
- Has a business partner

**Technical Capabilities:**
- Command line: Has used it minimally — can follow commands but doesn't understand what's happening
- Code: None
- System administration: Basic (install apps, light WordPress editing)
- AI tooling experience: Minimal — has Google Gemini via Google Suite, curious but not experienced
- Infrastructure: None (no VPN, SSH, Docker, networking knowledge)
- Existing tools: Google Workspace, WordPress (business website), Instagram, iCal, contract software (unnamed)

**What They Want:**
- Stated goal: AI-powered social media management, transaction coordination, competitive edge
- Underlying need: Catch up on Instagram presence (has neglected personal page, partner could be tagged but he couldn't), automate the parts of social media he hates
- Expectations: May overestimate what OpenClaw can do out of the box for real estate

**Misconceptions to Address:**
1. OpenClaw is a complete solution — Reality: It's a platform that needs configuration, skills, and ongoing attention
2. AI replaces social media work — Reality: It augments and accelerates but you still need to review, approve, and maintain brand voice
3. Setup is simple — Reality: Requires terminal commands, Claude subscription, Docker, configuration
4. Security doesn't apply to a social media tool — Reality: Agent platforms with API access need hardening

**Setup:**
- Hardware: MacBook Air (new, buying this week, specs TBD — config-agnostic output)
- OS: macOS (latest, fresh machine)
- Network: Home network (assumed)
- Budget: Willing to pay $20/mo for Claude subscription, buying new MacBook Air

**Context:**
- Why this matters: Slowest year start, wants competitive edge, 20k agents in Denver and he's currently #1-2 in AI search, wants to stay ahead before others figure it out
- Professional urgency: Business growth, franchise aspirations
- Anxiety: Hates social media, being on it makes him anxious — automation directly addresses this pain point
- Social media gap: Hasn't had a personal Instagram page, partner could be tagged but he couldn't, needs to "catch up quickly"

**Working Style:**
- Learning style: Needs instructions to follow, can engage if guided well
- Pace: Variable — "depends on the day," can be anxious
- Frustration tolerance: Moderate — willing to try but needs encouragement
- Communication: Direct, honest about what he doesn't know
- Self-description: "I need to be spoon fed at this point. I can follow instructions at least."

**Hardening Tier Assessment:**
- Essential: Authentication, sandbox mode, localhost binding (always)
- Educational: Why dedicated machine matters, what agent security means in practical terms, prompting safety
- Operational polish: Monitoring, log rotation, update cadence — lighter touch for Jeff, mention but don't deep-dive

**Notes from Sean:**
- Jeff is smart but new to this domain — never condescending
- He's motivated by competitive pressure and a slow year, not by tech enthusiasm
- The anxiety about social media is real — the automation genuinely helps him, it's not a gimmick
- He said "I don't think a lot of real estate agents have really figured out how to use this for their business. And I want to be ahead."
- Franchise aspirations mean he's thinking about systematizing himself — OpenClaw fits this vision
- Website SEO is a secondary concern (WordPress, built by someone who did "a shit job with the SEO") — out of scope for this output but noted for future

**Step 3: Commit**

```bash
git add outputs/openclaw-jeff/operator/jeff-profile.md
git commit -m "intake: create Jeff operator profile from conversation analysis"
```

---

### Task 3: Run Depth Assessment and Update CONTEXT.md

**Context:** Before starting research, run the depth assessment skill to classify the work. This determines which skills apply and how deep to go. Update CONTEXT.md with the assessment result and advance the status to "Research."

**Files:**
- Read: `engine/skills/depth-assessment/SKILL.md`
- Modify: `outputs/openclaw-jeff/CONTEXT.md`
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Run depth assessment**

Invoke the `depth-assessment` skill. The output is a full engine pipeline execution producing an interactive HTML walkthrough with research. Expected classification: **deep-dive** (multi-stage pipeline, >500 lines of output, multiple research reports, interactive HTML generation).

**Step 2: Update CONTEXT.md**

Change Current Status phase from "Intake" to "Research" and add depth assessment result.

**Step 3: Log in activity log**

```markdown
| 2026-03-03 | Intake complete. Operator profile created. Depth assessment: deep-dive. Moving to Research phase. |
```

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/CONTEXT.md outputs/openclaw-jeff/activity-log.md
git commit -m "intake: depth assessment complete, advancing to research phase"
```

---

## Phase 2: Research

**Important:** Research tasks use the dual-source intelligence methodology (`engine/methodology/dual-source-intelligence.md`). Every finding gets:
- A credibility tier tag (1-5)
- Logged in sources.md
- Strategic insights logged in intelligence-log.md
- Written up using findings patterns from `engine/skills/findings-pattern/SKILL.md`

Output #1's research is a starting point but NOT reusable without freshness checking. Anything inherited gets a `[inherited, freshness-checked 2026-03-03]` tag.

### Task 4: Feasibility Research — MacBook Air + OpenClaw

**Context:** Output #1 validated OpenClaw on a Mac Mini. Jeff has a MacBook Air — different thermal profile, potentially different RAM, battery vs. plugged-in operation. This is NEW research, not inherited.

**Files:**
- Create: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/macbook-air-feasibility.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`
- Modify: `outputs/openclaw-jeff/intelligence-log.md`

**Step 1: Context7 — Official OpenClaw requirements**

Query Context7 for:
- OpenClaw minimum system requirements (RAM, CPU, storage)
- Docker Desktop for Mac requirements on Apple Silicon
- Any MacBook Air-specific guidance or limitations in official docs

**Step 2: Bright Data — Community experience**

Search for:
- "OpenClaw MacBook Air" OR "openclaw laptop" — community reports on running OpenClaw on laptops vs. desktops
- "Docker MacBook Air M4 performance" OR "Docker Apple Silicon laptop" — Docker on Air specifically
- "OpenClaw RAM usage" OR "openclaw memory" — real-world memory consumption data
- "MacBook Air thermal throttling Docker" — thermal concerns for always-on workloads on Air

**Step 3: Cross-validate and write up**

Create `macbook-air-feasibility.md` with:
- Minimum requirements vs. MacBook Air specs (config-agnostic — state minimums, note where more helps)
- Thermal considerations for always-on agent workloads on a laptop
- Battery vs. plugged-in operation implications
- RAM pressure analysis (Docker + OpenClaw + Claude API calls)
- Community-reported performance data
- **Verdict:** Is MacBook Air viable? With what caveats?

**Step 4: Log sources and insights**

Add all sources to `sources.md` with tier tags. Any strategic insights go to `intelligence-log.md`.

**Step 5: Commit**

```bash
git add outputs/openclaw-jeff/research/ outputs/openclaw-jeff/intelligence-log.md
git commit -m "research: MacBook Air feasibility for OpenClaw — dual-source"
```

---

### Task 5: Security Research — Refreshed for Jeff's Context

**Context:** Output #1 did extensive security research. Jeff's security context is different: real estate data (client info, contract details), social media API tokens, less technical sophistication means simpler threat model but also less awareness. Refresh the security findings and calibrate to Jeff.

**Files:**
- Create: `outputs/openclaw-jeff/research/knowledge-base/03-security/security-posture-jeff.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`
- Modify: `outputs/openclaw-jeff/intelligence-log.md`

**Step 1: Inherit and freshness-check from Output #1**

Read `outputs/openclaw-sean/knowledge-base/03-security/security-posture-analysis.md`. Identify:
- Which findings are still current (check for new CVEs, version updates)
- Which findings apply to Jeff's situation (client data, social media tokens)
- Which findings are specific to Mac Mini / Sean's setup and don't transfer

**Step 2: Context7 — Security updates since Output #1**

Query for:
- OpenClaw security advisories, CVEs, patches since Feb 2026
- Current recommended security configuration
- Any changes to sandbox mode, authentication, or plugin security

**Step 3: Bright Data — Community security intelligence**

Search for:
- "OpenClaw security" — any new incidents, vulnerabilities, or community warnings
- "OpenClaw API key security" OR "openclaw token management" — how to handle API keys safely
- "AI agent real estate data" OR "AI agent client data security" — real estate-specific concerns

**Step 4: Write up security posture for Jeff**

Focus on:
- Three-tier hardening applied to Jeff's situation (read `engine/methodology/three-tier-hardening.md`)
- Essential: What Jeff MUST do (auth, sandbox, localhost binding)
- Educational: Why dedicated machine matters, what "API key exposure" means in plain terms
- Operational: Lighter touch — monitoring basics, update cadence
- Real estate-specific risks: client data in agent context, social media token exposure, contract information
- Residual risk assessment: After hardening, what risks remain?

**Step 5: Commit**

```bash
git add outputs/openclaw-jeff/research/ outputs/openclaw-jeff/intelligence-log.md
git commit -m "research: security posture for Jeff — refreshed and calibrated"
```

---

### Task 6: Social Media Skills Research — Instagram + OpenClaw

**Context:** This is Jeff's primary use case and requires NEW research. Output #1 didn't focus on social media automation. We need to understand what OpenClaw skills exist for social media, how Instagram API integration works, and what's actually viable vs. theoretical.

**Files:**
- Create: `outputs/openclaw-jeff/research/knowledge-base/05-skills-and-integrations/social-media-skills.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`
- Modify: `outputs/openclaw-jeff/intelligence-log.md`

**Step 1: Context7 — OpenClaw skill system for social media**

Query for:
- OpenClaw skill marketplace — social media related skills
- Instagram API integration documentation
- Social media posting/scheduling skill documentation
- Content generation skill documentation

**Step 2: Bright Data — Community experience with social media automation**

Search for:
- "OpenClaw Instagram" OR "openclaw social media" — anyone using OpenClaw for social media?
- "AI agent Instagram posting" — broader landscape of AI-powered Instagram automation
- "Instagram API automation 2026" — current state of Instagram's API for posting
- "OpenClaw skill review" OR "openclaw community skills" — quality and security of community-built skills
- "real estate agent AI social media" — what real estate agents are actually doing with AI for social

**Step 3: Write up social media skills analysis**

Cover:
- Available OpenClaw skills for social media (official vs. community)
- Instagram API capabilities and limitations (what can be automated vs. what requires manual)
- Security audit status of social media skills (community skills are a known risk per Output #1 security research)
- Content generation workflow: how prompting + skill + API + posting actually chains together
- What Jeff can realistically achieve vs. what requires custom development
- Comparison: OpenClaw skill vs. simpler automation (Zapier/n8n + LLM API) — agent vs. automation honesty per DNA principle #10

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/research/ outputs/openclaw-jeff/intelligence-log.md
git commit -m "research: social media skills and Instagram integration — dual-source"
```

---

### Task 7: Abbreviated Landscape + Architecture Refresh

**Context:** Sean already chose OpenClaw for Jeff, so a full landscape report is unnecessary. But we should validate nothing has changed since Output #1 and pull the minimal architecture understanding Jeff needs. This is a light-touch task.

**Files:**
- Create: `outputs/openclaw-jeff/research/knowledge-base/01-landscape/landscape-brief.md`
- Create: `outputs/openclaw-jeff/research/knowledge-base/02-architecture/architecture-mental-model.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`

**Step 1: Freshness-check Output #1 landscape**

Read `outputs/openclaw-sean/knowledge-base/01-landscape/competitive-landscape.md`. Check:
- Any new competitors or major shifts since Feb 2026?
- Has OpenClaw's positioning changed?
- Quick Bright Data search: "OpenClaw alternatives 2026" or "AI agent platform comparison 2026"

**Step 2: Write abbreviated landscape brief**

2-3 paragraphs max. Why OpenClaw, what else exists, why Sean picked it for Jeff. Not a full competitive analysis.

**Step 3: Write architecture mental model for Jeff**

Read `outputs/openclaw-sean/knowledge-base/02-architecture/`. Extract the conceptual model Jeff needs:
- What are the pieces? (Gateway, LLM, Skills, Dashboard)
- How do they talk to each other? (simplified — not protocol-level)
- Where does Jeff's data flow? (his prompt → agent → API → Instagram)
- What can go wrong? (simplified threat model)

This is NOT a deep architecture reference. It's the mental model a non-technical user needs to not be lost.

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/research/ outputs/openclaw-jeff/intelligence-log.md
git commit -m "research: abbreviated landscape and architecture mental model"
```

---

### Task 8: Open Questions Research

**Context:** Every output produces an open questions report. Jeff's questions are different from Sean's. Some come from the conversation dump, some emerge during research.

**Files:**
- Create: `outputs/openclaw-jeff/research/knowledge-base/06-community-intelligence/community-findings.md`
- Create: `outputs/openclaw-jeff/research/reports/05-open-questions.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`

**Step 1: Compile Jeff-specific open questions**

From intake and research:
1. How much RAM does OpenClaw + Docker actually use on MacBook Air under sustained agent workloads?
2. Can OpenClaw post directly to Instagram, or does it need an intermediary (Meta Business Suite API)?
3. What's the latency on social media content generation through OpenClaw? (relevant for "daily posting" workflow)
4. Is there a way to have OpenClaw learn Jeff's brand voice without fine-tuning? (prompt engineering + examples)
5. How does OpenClaw handle Instagram's rate limiting and API restrictions?
6. What happens when the MacBook Air sleeps / lid is closed? Does the agent stay running?
7. Can OpenClaw integrate with Google Workspace (Calendar, email) for Jeff's broader workflow?
8. What's the real monthly API cost for a social media automation use case?

**Step 2: Research community intelligence**

Bright Data search for answers to the above. Log findings in community-findings.md. Track sources.

**Step 3: Write open questions report**

Format: Question → What we found → Confidence level → What remains unknown

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/research/ outputs/openclaw-jeff/intelligence-log.md
git commit -m "research: open questions and community intelligence"
```

---

## Phase 3: Synthesis

### Task 9: Write Research Reports

**Context:** Synthesis transforms raw research into assessable documents. Jeff's output needs 3 full reports (feasibility, security, open questions) and 2 abbreviated (landscape, architecture). These reports inform the walkthrough content.

**Files:**
- Create: `outputs/openclaw-jeff/research/reports/01-landscape-report.md`
- Create: `outputs/openclaw-jeff/research/reports/02-architecture-reference.md`
- Create: `outputs/openclaw-jeff/research/reports/03-macbook-air-feasibility.md`
- Create: `outputs/openclaw-jeff/research/reports/04-security-evaluation.md`
- Already created in Task 8: `outputs/openclaw-jeff/research/reports/05-open-questions.md`

**Step 1: Invoke the findings-pattern skill**

```
Read: engine/skills/findings-pattern/SKILL.md
```

Use the findings pattern library to structure each report consistently.

**Step 2: Write each report**

Each report synthesizes the relevant KB bucket(s) into a standalone assessment:

**01-landscape-report.md** (abbreviated):
- 200-300 lines max
- Why OpenClaw, what else exists, Sean's reasoning
- Any changes since Output #1

**02-architecture-reference.md** (abbreviated):
- Jeff-level mental model, not Sean-level deep dive
- The pieces, how they connect, where data flows
- Diagrams planned (will be built in output generation)

**03-macbook-air-feasibility.md** (full):
- Hardware requirements analysis
- Thermal and performance assessment
- **GO/NO-GO verdict** with conditions
- Residual risk from hardware choice

**04-security-evaluation.md** (full):
- Three-tier hardening breakdown for Jeff's situation
- Real estate-specific risk assessment
- Residual risk after hardening
- What Jeff needs to understand (educational layer)

**Step 3: Run anti-pattern check**

Invoke the `anti-pattern-check` skill against the completed reports. Watch specifically for:
- #1 (Understated Warning) — are security findings presented with appropriate severity?
- #2 (Premature Confidence) — are we claiming consensus with too few sources?
- #4 (One-Source Frame) — is one source dominating the analysis?
- #5 (Missing Source Trail) — are all sources tracked?

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/research/reports/
git commit -m "synthesis: research reports complete — landscape, architecture, feasibility, security, open questions"
```

---

### Task 10: Synthesis Assessment — Update CONTEXT.md

**Context:** After reports are written, update the output's CONTEXT.md with key verdicts, what the output will produce, and advance to Output Generation phase.

**Files:**
- Modify: `outputs/openclaw-jeff/CONTEXT.md`
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Summarize key verdicts**

Add to CONTEXT.md:
- Feasibility verdict (GO/NO-GO for MacBook Air)
- Security posture summary
- Social media skill availability assessment
- Scope confirmation or adjustment based on research findings

**Step 2: Document what the output will produce**

Fill in the "What This Output Produces" section with the walkthrough structure from the design doc (8 sections).

**Step 3: Log transition**

Activity log: Research and synthesis complete. Moving to Output Generation.

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/CONTEXT.md outputs/openclaw-jeff/activity-log.md
git commit -m "synthesis: assessment complete, advancing to output generation"
```

---

## Phase 4: Output Generation

**Important:** This phase uses the section-construction skill (`engine/skills/section-construction/SKILL.md`). The output is a deep-dive (>500 lines), so section construction is mandatory. Each section is built incrementally with self-tests.

All visual output uses the new methodology:
- Concept-to-pattern mapping (style guide 5.5) before choosing diagram rendering tech
- Colors from `engine/templates/diagram-color-reference.md`
- Isomorphism test per diagram
- Render-validate loop (Phase C.5) after all sections built

### Task 11: Section Plan (Phase A)

**Context:** Before writing any walkthrough content, produce the section architecture. This is Phase A of section construction. Present to Sean for approval before proceeding.

**Files:**
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Invoke section-construction skill**

```
Read: engine/skills/section-construction/SKILL.md
Read: engine/methodology/section-construction.md
```

**Step 2: Build section plan**

Based on the design doc's 8-section structure:

```
**Section Plan — OpenClaw Deployment Walkthrough for Jeff**

| #  | Section                              | Est. Lines | Cross-refs to | Namespace    |
|----|--------------------------------------|------------|---------------|--------------|
| 1  | What is OpenClaw (and what isn't it)  | 150-200    | 4, 5, 6       | s1-intro     |
| 2  | Why a dedicated machine              | 100-150    | 3, 5          | s2-machine   |
| 3  | Your setup                           | 150-200    | 4             | s3-setup     |
| 4  | Installation & deployment            | 300-400    | 3, 5          | s4-install   |
| 5  | Security hardening                   | 200-250    | 1, 2, 4       | s5-security  |
| 6  | Prompting & working with your agent  | 150-200    | 7             | s6-prompting |
| 7  | Social media workflow                | 200-300    | 4, 5, 6       | s7-social    |
| 8  | What's next                          | 80-120     | all           | s8-next      |

Total estimated: 1,330-1,820 lines across 8 sections.
```

**Step 3: Present to Sean for approval**

Do not proceed until Sean approves the section plan.

**Step 4: Commit plan**

```bash
git add outputs/openclaw-jeff/activity-log.md
git commit -m "output: section plan approved — 8 sections, 1300-1800 lines"
```

---

### Task 12: Diagram Design (Pre-Construction)

**Context:** Before building sections, design all diagrams using the concept-to-pattern mapping (style guide 5.5-5.6). This prevents Output #1's mistake of choosing rendering tech before understanding what concept each diagram communicates.

**Files:**
- Create: `outputs/openclaw-jeff/docs/walkthrough/interactive/src/diagram-specs.md` (working document)

**Step 1: Read the diagram design process**

```
Read: engine/templates/walkthrough-style-guide.md (Sections 5.5 and 5.6)
Read: engine/templates/diagram-color-reference.md
```

**Step 2: Identify concepts that need diagrams**

Based on the 8 sections, identify what concepts need visual communication:

1. **How OpenClaw works** (Section 1) — the pieces and how they connect
2. **Dedicated machine reasoning** (Section 2) — isolation concept, before/after comparison
3. **Installation flow** (Section 4) — steps/phases in order
4. **Security layers** (Section 5) — defense in depth, what protects what
5. **Prompting flow** (Section 6) — how a prompt becomes an action
6. **Social media workflow** (Section 7) — end-to-end content creation → posting pipeline

**Step 3: Apply concept-to-pattern mapping**

For each concept:
1. Classify the concept's behavior (what it DOES)
2. Map to visual pattern from Section 5.5
3. Run isomorphism test: "If I remove all labels, does the structure communicate the concept?"
4. Choose rendering technology (Rough.js or Mermaid) based on pattern needs
5. Assign semantic colors from diagram-color-reference.md

**Step 4: Apply variety rule**

Verify no two diagrams use the same pattern unless the concepts genuinely have the same structural behavior. Different concepts → different visual patterns.

**Step 5: Document diagram specs**

Write `diagram-specs.md` with:
- Each diagram's concept, pattern, rendering tech, color mapping
- Isomorphism test result (must pass before proceeding)
- Node list with semantic categories

**Step 6: Commit**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/src/diagram-specs.md
git commit -m "output: diagram design specs — concept-to-pattern mapping complete"
```

---

### Task 13: Build Walkthrough Source (Markdown)

**Context:** Write the source walkthrough in markdown — all 8 sections, following the section-construction methodology (Phase B). Each section follows the namespace convention and gets per-section self-tests. This is the content source that will be transformed into interactive HTML.

**Files:**
- Create: `outputs/openclaw-jeff/docs/walkthrough/openclaw-jeff-walkthrough.md`
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Build each section in order**

For each of the 8 sections:

1. **Write the section content.** Draw from research reports and KB. Every claim has a source. Every command is copy-pasteable with expected output.

2. **Use the section's namespace prefix** for all IDs, anchors, and references.

3. **Include "Understanding" sections** where educational content is warranted. These are the expandable deep-dives that explain WHY, not just WHAT. Jeff can skip them or read them — his choice.

4. **Include security inline** at every decision point where security applies. Not a separate appendix.

5. **Run per-section self-tests:**
   - "Do all IDs start with the namespace prefix?"
   - "Does this section reference anything that doesn't exist yet?" (note forward refs)
   - "Is there a logical bridge to the next section?"
   - "Pick any claim — can I name the source?"

6. **Apply the anti-pattern check** at natural pause points (after sections 4, 5, and 7 at minimum).

**Key content notes per section:**

- **Section 1 (Intro):** Address misconceptions from operator profile. "OpenClaw is not magic." "AI doesn't replace your judgment." "This is a tool, not a solution." Honest about what's hard.
- **Section 2 (Dedicated machine):** WHY not just run it on your main laptop. Isolation, always-on, security boundary. This is a transferable principle.
- **Section 3 (Setup):** Pre-flight checklist. Config-agnostic — state minimums, let Jeff match. Claude subscription instructions.
- **Section 4 (Installation):** Every command explained. Expected output shown. Troubleshooting expandables for common errors.
- **Section 5 (Security):** Three-tier hardening. Essential stuff is mandatory steps. Educational stuff is expandable "Understanding" sections. Operational stuff is "when you're ready" notes.
- **Section 6 (Prompting):** How to talk to the LLM. Good vs. bad examples using his real estate context. How the agent interprets instructions. Common mistakes.
- **Section 7 (Social media):** The payoff section. Configure Instagram workflow. Build a posting pipeline. Real examples for his business. This should feel worth the setup effort.
- **Section 8 (What's next):** SEO possibilities. Research agents. Franchise scaling. Light touch — "here's where you go from here."

**Step 2: Run anti-pattern check on complete source**

Invoke `anti-pattern-check` skill on the full walkthrough source.

**Step 3: Commit**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/openclaw-jeff-walkthrough.md outputs/openclaw-jeff/activity-log.md
git commit -m "output: walkthrough source complete — 8 sections"
```

---

### Task 14: Build Interactive HTML

**Context:** Transform the markdown walkthrough source into a self-contained interactive HTML file. This is the deliverable Jeff will actually use. Use Output #1's interactive HTML as the structural template (CSS framework, JS interactions, sidebar nav, theme toggle) but with all new content.

**Files:**
- Create: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html`
- Create: `outputs/openclaw-jeff/docs/walkthrough/interactive/src/diagrams.js`
- Create: `outputs/openclaw-jeff/docs/walkthrough/interactive/src/styles.css` (if extracting from HTML)

**Step 1: Read Output #1's HTML structure for reference**

```
Read: outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html (first 200 lines — CSS structure)
Read: outputs/openclaw-sean/docs/walkthrough/interactive/src/diagrams.js (first 100 lines — diagram pattern)
```

Use the same structural patterns (sidebar, theme toggle, expandables, checkboxes, progress tracking, localStorage persistence) but with Jeff's content.

**Step 2: Build the HTML**

Using the section-construction methodology (Phase B for HTML construction):

1. **HTML shell** — doctype, head, CSS custom properties, sidebar navigation for 8 sections
2. **CSS** — reuse Output #1's design system (it's engine-level), verify against style guide
3. **Content sections** — transform markdown source into HTML, applying all namespaced IDs
4. **Interactive elements:**
   - Checkboxes with unique `data-key` values, localStorage persistence
   - Expandable sections: `.expandable` > `button.expandable-trigger[aria-expanded]` > `.expandable-content`
   - Notes fields: ACTUAL input elements (not just text) with localStorage persistence (fix Output #1's gap)
   - Progress tracking in sidebar
   - Dark/light theme toggle
5. **Diagrams** — implement in `diagrams.js` per the specs from Task 12
   - All colors from `diagram-color-reference.md`
   - Isomorphism test passes by construction (designed in Task 12)
   - Rough.js for hand-drawn style diagrams, Mermaid for sequences/flows
6. **Responsive** — hamburger menu for mobile, readable at 375px

**Step 3: Commit incrementally**

Commit after major sections are built, not just at the end:

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/
git commit -m "output: interactive HTML — shell + sections 1-4"
```

```bash
git commit -m "output: interactive HTML — sections 5-8 + diagrams"
```

---

### Task 15: Whole-Output Review (Phase C)

**Context:** All sections exist. Now review the complete output as a unified document per section-construction Phase C.

**Files:**
- Modify: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (fixes)
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Read the complete output as a whole**

Not section-by-section — as a reader (Jeff) would experience it.

**Step 2: Verify all cross-references resolve**

Every anchor referenced by another section must exist. Search for each namespace prefix to find all references.

**Step 3: Check flow**

Does information build logically? Are transitions smooth? Does any section assume knowledge not yet covered?

**Step 4: Check balance**

Are sections proportional to their importance? Section 7 (social media workflow) should be the deepest — it's why Jeff is here. Section 5 (security) should be substantial — it's essential. Section 8 (what's next) should be the lightest.

**Step 5: Run anti-pattern check**

Specifically watch for:
- Symmetric section lengths (all equal despite unequal importance)
- Missing Source Trail
- Understated Warning on security findings

**Step 6: Run binary self-tests**

Invoke the `self-test` skill. Run:
- Output Generation tests (O1-O4)
- Visual Output tests (V1-V6) — V1 deferred to render-validate (next task)
- Cross-Cutting tests (X1-X3)

**Step 7: Fix issues found, commit**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/
git commit -m "output: whole-output review complete — fixes applied"
```

---

### Task 16: Render-Validate (Phase C.5)

**Context:** This is the first time the render-validate skill is used in production. Output #1 shipped without visual verification — this is where Output #2 proves the methodology works.

**Files:**
- Modify: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (fixes)
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Invoke render-validate skill**

```
Read: engine/skills/render-validate/SKILL.md
```

Follow the skill's 6 steps exactly:

1. **Render the output** — use Puppeteer MCP to open the HTML file in a browser
2. **Screenshot each major section** — desktop (1280px), mobile (375px), dark mode
3. **Audit against style guide** — read `diagram-color-reference.md` and style guide sections 4-6
4. **Audit against diagram design intent** — read `diagram-specs.md` from Task 12
5. **Fix issues** — render → fix → re-render → verify
6. **Present results to Sean**

**Step 2: Run visual self-tests V1-V6 (thorough)**

Since this is a deep-dive output:
- V1: Has it been rendered? (YES — just did it)
- V2: Isomorphism test on each diagram
- V3: Diagram count matches specs
- V4: Click every expandable section
- V5: Check checkbox + notes field + reload
- V6: Colors match diagram-color-reference.md

**Step 3: Document results**

Log render-validate results in activity log. Note iterations, issues found, issues fixed.

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/ outputs/openclaw-jeff/activity-log.md
git commit -m "output: render-validate complete — visual verification passed"
```

---

## Phase 5: Integration and Delivery

### Task 17: Update Output CONTEXT.md and Engine CONTEXT.md

**Context:** Output is complete. Update both the output-level and engine-level state documents.

**Files:**
- Modify: `outputs/openclaw-jeff/CONTEXT.md`
- Modify: `outputs/openclaw-jeff/activity-log.md`
- Modify: `CONTEXT.md` (root — engine level)

**Step 1: Update output CONTEXT.md**

- Status: Complete
- Fill in "What This Output Produced" with actual metrics (line count, source count, diagram count, etc.)
- Document key verdicts from research
- Document residual risks
- Add "How to Use This Output" navigation guide

**Step 2: Update engine CONTEXT.md**

- Add Output #2 to the Outputs Produced table
- Update "What's Next" section

**Step 3: Final activity log entry**

```markdown
| 2026-03-03 | Output #2 (openclaw-jeff) complete. [N] sections, [N] lines. Visual verification passed. |
```

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/CONTEXT.md outputs/openclaw-jeff/activity-log.md CONTEXT.md
git commit -m "delivery: Output #2 complete — CONTEXT updated"
```

---

### Task 18: Final Verification

**Context:** Run the engine's verification process on the complete output. This is the last quality gate before declaring Output #2 done.

**Files:**
- Read all output files (do not modify unless issues found)

**Step 1: Invoke verification-before-completion skill**

Verify:
1. All sources in walkthrough are tracked in sources.md
2. All sources have credibility tier tags
3. All commands in walkthrough are copy-pasteable
4. Security implications are noted inline (not in an appendix)
5. Transferable concepts are called out explicitly
6. Residual risk is documented
7. All cross-references resolve
8. All expandable sections work
9. All checkboxes persist state
10. Notes fields work and persist
11. Diagrams render correctly in both themes
12. The output makes sense to someone unfamiliar with OpenClaw

**Step 2: Run the visual audit**

Run the same V1-V6 audit we ran retroactively on Output #1. Compare scores. Document the comparison.

**Step 3: Present results to Sean**

```
**Output #2 (openclaw-jeff) — Final Verification**

Verification passed: [X/12]
Visual audit score: [X/6] (Output #1 was 1.5/6)
Isomorphism score: [X/N diagrams] (Output #1 was 5/8)

Issues found: [list or "none"]
Residual concerns: [list or "none"]

Engine methodology test: [assessment of whether the new methodology produced measurably better results]
```

**Step 4: Commit if any fixes applied**

```bash
git add outputs/openclaw-jeff/
git commit -m "verify: final verification complete — Output #2 ready"
```
