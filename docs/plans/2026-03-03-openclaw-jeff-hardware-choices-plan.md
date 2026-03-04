# OpenClaw-Jeff Hardware Choices Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new walkthrough section to Output #2 (openclaw-jeff) that presents Jeff with hardware and access method choices for his dedicated OpenClaw machine, teaches the reasoning behind each option, and delivers our recommendation — all using the engine's full methodology pipeline.

**Architecture:** This is an iteration on a complete, delivered output. The new section inserts into the existing interactive HTML walkthrough between the current Section 2 ("Why a Dedicated Machine") and Section 3 ("Your Setup"). It does NOT modify or delete any existing walkthrough content. The engine pipeline runs from depth assessment through render-validate, treating this as a focused addition with full quality standards.

**Tech Stack:** Same as Output #2 — HTML/CSS/JS (interactive walkthrough), Rough.js (diagrams), Context7 MCP + Bright Data MCP (research validation), Puppeteer MCP (render-validate).

**Design Document:** `docs/plans/2026-03-03-openclaw-jeff-design.md` (original Output #2 design)

---

## Background: What Happened

Output #2 was delivered on 2026-03-03. Jeff received the hosted walkthrough and started reading it. Sean and Jeff had a conversation (via iMessage) that surfaced new context requiring a walkthrough addition:

### Key Findings from Post-Delivery Conversation

1. **Jeff's machine will be DEDICATED, not shared.** The walkthrough assumed shared use (MacBook Air running OpenClaw + personal apps). Jeff clarified: "It thinks I'm going to use the MacBook Air as my personal computer. Which I'm not." His personal machine is a 16" MacBook Pro M1 Max (64GB RAM, macOS Sequoia 15.3.2). This eliminates the "shared machine risk" that was the walkthrough's biggest residual vulnerability.

2. **Jeff is pivoting from MacBook Air to Mac Mini.** After reading Section 2 about dedicated machines and thermal management, Jeff asked: "Should I just get a damn Mac mini and buy a cheap monitor?" He doesn't need portability. His concerns: desk space, kids messing with it, no desire for external peripherals.

3. **Jeff found a lapdock.** A portable monitor with built-in keyboard and touchpad that connects via USB-C. He wants something he can plug in and put away.

4. **Sean raised Apple ecosystem remote access.** Universal Control, Screen Sharing, Continuity — controlling the Mac Mini from Jeff's existing MacBook Pro. Sean has two Mac Minis himself and demonstrated his setup via video.

5. **CTM eContracts came up.** Jeff's contract software. He asked about integration. Sean did preliminary research. This remains Phase 2 but should inform setup decisions so we don't paint into a corner.

6. **The walkthrough contains a contradictory frame (Anti-pattern #12).** Section 2 intro says "setting up a separate MacBook" (dedicated framing) while the body says "it's a shared machine" (shared framing). This has been logged in `engine/methodology/anti-patterns.md` as Anti-pattern #12 and a new binary self-test X4 was added.

### Research Already Completed

Three research agents were dispatched and returned with findings. This raw research needs to be structured through the findings-pattern skill before it informs output generation.

**Mac Mini M4 Research (Agent 1):**
- All configs: M4 base ($599, 16GB/256GB) through M4 Pro ($1,399+, 24GB+/512GB+)
- Recommended config: M4 24GB/512GB at $999
- Idles at 3-4W (Jeff Geerling measured). ~$7/year electricity
- Active cooling — no thermal throttling ever
- Ships with NO peripherals. Needs display for ~10-min initial macOS setup
- 3x Thunderbolt 4 (rear, carry display), 1x HDMI, 2x USB-A, 2x USB-C (front, NO display output)
- Sources: Apple specs, Jeff Geerling efficiency blog, MacRumors, AppleInsider, Hostbor server review

**Lapdock/Portable Monitor Research (Agent 2):**
- NexDock 6 ($229): Best lapdock option. Single USB-C cable for display + keyboard + trackpad. Mac compatible. Touchscreen won't work on macOS (Apple limitation) but trackpad does
- Portable monitors ($200-500): Espresso 15 Pro, Lenovo M14t Gen2, ASUS ZenScreen all work via rear Thunderbolt ports
- Gotcha: front USB-C ports on Mac Mini do NOT carry display signal. Must use rear Thunderbolt
- Gotcha: M4 Pro Thunderbolt 5 has power delivery issues with some portable displays. Base M4 (Thunderbolt 4) works fine
- Headless operation: Mac Mini M4 runs headless with Screen Sharing. Optional HDMI dummy plug ($8-12) for cleaner resolution
- FileVault warning: If disk encryption enabled, reboots require physical keyboard access (can't unlock remotely)
- Sources: Macworld, Tom's Hardware, iMore, NotebookCheck, AppleInsider, MacRumors forums

**Apple Remote Access Research (Agent 3):**
- macOS Screen Sharing (free, built-in): High Performance mode on Apple Silicon = 60fps, near-native. Both machines qualify (M1 Max + M4). Mac Mini appears in Finder sidebar automatically
- SSH (free, built-in): Best for daily AI agent check-ins. Direct terminal access. `ssh jeff@mac-mini.local`
- Universal Control: NOT suitable for headless. Requires Mac Mini to have its own display. Wrong tool
- Apple Remote Desktop ($80): Overkill for one machine. Skip
- Continuity features (Universal Clipboard, AirDrop): Work automatically between both machines on same Apple ID
- Initial setup: MUST have a display for first-time macOS Setup Assistant. Screen Sharing can't be enabled until after setup completes. Can use any TV via HDMI for the 10-minute setup
- Sources: Apple Support docs, 9to5Mac, MacStadium, iMore, MPU Talk forums

### What Sean Wants Built

A new walkthrough section that:
1. Shows Jeff his hardware choices — Mac Mini vs MacBook Air for a dedicated AI machine. Comparison table. Teaches transferable principles (how to evaluate hardware for always-on services)
2. Shows access method options — headless via Screen Sharing, lapdock, portable monitor. Pros/cons
3. Presents our recommendation: Mac Mini M4 (24GB/512GB, $999) + headless with Screen Sharing from his existing MacBook Pro
4. Ends at the recommendation. Jeff reads it, goes to buy hardware, comes back. No bridge to downstream content
5. Does NOT modify or delete existing walkthrough content below the insertion point
6. Is built to the same visual and content quality standard as the rest of the walkthrough — diagrams, interactives, expandable understanding sections, checkboxes, dark/light mode

### What Sean Does NOT Want

- A rewrite of the existing walkthrough
- Pre-built walkthrough branches for each hardware option
- CTM eContracts deep dive (remains Phase 2)
- Overbuilding — but also not holding back on quality within this section
- A bridge paragraph telling Jeff "the commands below work regardless" — Jeff will stop at the recommendation, go buy hardware, and we'll adjust downstream content when he returns

---

## The Pipeline

This plan follows the engine's defined skill chain. Each phase invokes the correct methodology and skills in order. No skipping.

```
depth-assessment → findings-pattern → anti-pattern-check → section-construction → self-test → render-validate → update state
```

---

## Phase 1: Depth Assessment

### Task 1: Run Depth Assessment

**Context:** Mandatory 30-second gate before any pipeline work. Classify each topic area using the three binary questions from `engine/skills/depth-assessment/SKILL.md` and `engine/methodology/depth-assessment.md`.

**Files:**
- Read: `engine/methodology/depth-assessment.md`
- Read: `engine/skills/depth-assessment/SKILL.md`
- Modify: `outputs/openclaw-jeff/activity-log.md`

**Step 1: Classify each topic**

Apply the three questions per topic:
1. "Will this finding drive a GO/NO-GO decision?"
2. "Is the operator new to this topic?"
3. "Has this topic had security implications in past research?"

Expected classifications:

| Topic | Q1 (GO/NO-GO?) | Q2 (Operator new?) | Q3 (Security?) | Classification | Reason |
|-------|----------------|-------------------|----------------|----------------|--------|
| Mac Mini vs MacBook Air hardware choice | YES | — | — | **Deep-dive** | Jeff is spending ~$1,000 on non-returnable (soldered RAM) hardware. This is a GO/NO-GO purchase decision |
| Access methods (Screen Sharing, lapdock, headless) | NO | YES | — | **Deep-dive** | Jeff has zero experience with remote access, screen sharing, SSH, or headless operation |
| Dedicated vs shared machine correction | NO | NO | YES | **Deep-dive** | The shared-machine framing drove the security section's biggest residual risk assessment |

Overall depth: **Deep-dive** across all three topics.

**Step 2: Get Sean's confirmation on the classifications**

Present the table above. Wait for confirmation before proceeding.

**Step 3: Log in activity log**

```markdown
| 2026-03-03 | Depth assessment for hardware choices section: deep-dive across all 3 topics (hardware purchase decision, operator-new access methods, security-relevant shared/dedicated correction). Sean confirmed. |
```

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/activity-log.md
git commit -m "depth: hardware choices section classified as deep-dive"
```

---

## Phase 2: Structure Research Findings

### Task 2: Structure Mac Mini Research Using Findings Patterns

**Context:** The raw Mac Mini research from Agent 1 needs to be classified into the correct findings patterns from `engine/methodology/findings-pattern-library.md`. Every claim gets a source and credibility tier per `engine/methodology/editorial-standards.md`.

**Files:**
- Read: `engine/methodology/findings-pattern-library.md`
- Read: `engine/skills/findings-pattern/SKILL.md`
- Create: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/mac-mini-hardware-choices.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`

**Step 1: Invoke findings-pattern skill**

Read `engine/skills/findings-pattern/SKILL.md` and apply.

**Step 2: Classify each finding by type**

Expected pattern assignments:

| Finding | Pattern Type | Rationale |
|---------|-------------|-----------|
| Mac Mini M4 24GB/512GB is recommended config | **Recommendation Entry** | Evidence supports a specific action |
| Mac Mini vs MacBook Air for dedicated always-on use | **Comparison Matrix** | Two options evaluated against criteria |
| Mac Mini power consumption (3-4W idle) | **Validation Entry** | Confirms hypothesis that Mini is better for always-on |
| Mac Mini ships with no peripherals | **Discovery Entry** | Non-obvious fact Jeff needs to know |
| 24GB vs 16GB RAM tradeoff | **Risk Entry** | 16GB is workable but creates a ceiling with no upgrade path |
| M4 vs M4 Pro for this workload | **Resolution Entry** | Question answered definitively (M4 Pro is overkill) |

**Step 3: Write structured findings using pattern templates**

Write each finding using the exact template fields from the findings pattern library. Required fields always filled. Optional fields filled (deep-dive depth). Every field includes source and credibility tier.

Write to: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/mac-mini-hardware-choices.md`

**Step 4: Update sources.md**

Add all new sources from the Mac Mini research with dates, tiers, and URLs. Sources include:
- Apple Mac Mini Technical Specifications (Tier 1)
- Jeff Geerling: M4 Mac Mini Efficiency (Tier 2)
- MacRumors Mac Mini Roundup (Tier 2-3)
- AppleInsider Pricing Tracker (Tier 2)
- Hostbor Mac Mini M4 Home Server Review (Tier 3-4)
- Apple Support Power Consumption (Tier 1)

**Step 5: Commit**

```bash
git add outputs/openclaw-jeff/research/knowledge-base/04-deployment/mac-mini-hardware-choices.md outputs/openclaw-jeff/research/sources.md
git commit -m "research: structured Mac Mini hardware findings with pattern library"
```

---

### Task 3: Structure Access Methods Research Using Findings Patterns

**Context:** The raw remote access and lapdock research from Agents 2 and 3 needs the same findings-pattern treatment.

**Files:**
- Create: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/access-methods.md`
- Modify: `outputs/openclaw-jeff/research/sources.md`

**Step 1: Classify each finding by type**

Expected pattern assignments:

| Finding | Pattern Type | Rationale |
|---------|-------------|-----------|
| Screen Sharing vs SSH vs lapdock vs headless | **Comparison Matrix** | Multiple options evaluated |
| Screen Sharing High Performance mode (60fps on Apple Silicon) | **Discovery Entry** | Non-obvious capability that changes the recommendation |
| Universal Control NOT suitable for headless | **Resolution Entry** | Common assumption debunked |
| NexDock 6 as best lapdock option | **Recommendation Entry** | Evidence supports specific product |
| Initial setup requires physical display | **Risk Entry** | Hidden gotcha that could block Jeff on day one |
| FileVault + headless reboot conflict | **Risk Entry** | Security feature conflicts with operational model |
| Front USB-C ports don't carry display signal | **Discovery Entry** | Non-obvious hardware limitation |

**Step 2: Write structured findings using pattern templates**

Write each finding using exact template fields. Include all sources with credibility tiers.

Write to: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/access-methods.md`

**Step 3: Update sources.md**

Add all new sources:
- Apple Support: Screen Sharing docs (Tier 1)
- Apple Support: Universal Control (Tier 1)
- 9to5Mac: High Performance Screen Sharing (Tier 2)
- NexDock official site (Tier 2)
- NotebookCheck NexDock 6 Review (Tier 2)
- Macworld: Best Portable Monitors (Tier 2)
- Tom's Hardware: Best Portable Monitors (Tier 2)
- iMore: Mac Mini Headless Setup (Tier 3)
- MPU Talk: M4 Mac Mini Headless (Tier 3-4)
- MacStadium: Remote Access Guide (Tier 3)
- AppleInsider: M4 Mac Mini Headless Review (Tier 2)

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/research/knowledge-base/04-deployment/access-methods.md outputs/openclaw-jeff/research/sources.md
git commit -m "research: structured access methods findings with pattern library"
```

---

### Task 4: Update Intelligence Log with New Strategic Insights

**Context:** The intelligence log captures strategic insights — findings that change recommendations or reveal non-obvious patterns. Several new insights emerged from this research cycle. NOTE: Some intelligence log entries were already added earlier in this session. This task adds any remaining insights not yet captured.

**Files:**
- Read: `outputs/openclaw-jeff/intelligence-log.md` (check what's already been added)
- Modify: `outputs/openclaw-jeff/intelligence-log.md`

**Step 1: Review existing intelligence log entries**

Read the current intelligence log. Entries about dedicated machine correction, Mac Mini pivot, Apple ecosystem access, and CTM eContracts were already added. Check for gaps.

**Step 2: Add any missing strategic insights**

Potential missing entries:
- Mac Mini M4 idle power draw (3-4W) makes electricity cost negligible (~$7/year) — relevant for Jeff's cost concerns
- FileVault + headless conflict creates a security vs. convenience tradeoff specific to dedicated machines
- Front USB-C ports lacking display signal is a day-one gotcha for someone connecting a lapdock
- Screen Sharing High Performance mode changes the remote access calculus — 60fps near-native eliminates the "you need a monitor" assumption
- The $999 Mac Mini with 24GB is $200 LESS than the equivalent MacBook Air — dedicated + cheaper + better for the job

Each entry needs: date, insight summary, source, credibility tier.

**Step 3: Commit**

```bash
git add outputs/openclaw-jeff/intelligence-log.md
git commit -m "intelligence: strategic insights from hardware choices research"
```

---

## Phase 3: Anti-Pattern Check

### Task 5: Run Anti-Pattern Check on Structured Research

**Context:** Before moving from research/synthesis to output generation, spot-check the structured findings against the anti-pattern gallery. This is a lightweight pulse check, not a gate. Invoke `engine/skills/anti-pattern-check/SKILL.md`.

**Files:**
- Read: `engine/skills/anti-pattern-check/SKILL.md`
- Read: `engine/methodology/anti-patterns.md`
- Read: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/mac-mini-hardware-choices.md`
- Read: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/access-methods.md`

**Step 1: Invoke anti-pattern-check skill**

Read the skill file. Run the 12-pattern check (including the newly added #12, The Contradictory Frame) against the structured research.

**Specific patterns to watch for:**

| # | Anti-Pattern | What to Check |
|---|-------------|---------------|
| 1 | Understated Warning | Is the FileVault/headless conflict severity stated accurately? Is the "no display signal on front ports" risk clearly communicated? |
| 2 | Premature Confidence | Are we treating single-agent research as cross-validated? Count independent sources per major claim |
| 4 | One-Source Frame | Is Jeff Geerling's power measurement the only source for efficiency claims? Did we build the access methods comparison from Apple docs alone? |
| 5 | Missing Source Trail | Does sources.md include all sources cited in the new KB entries? |
| 8 | Staleness Blindness | The research agents searched the web today — but are we citing any findings that might be stale? Mac Mini M4 specs are stable, but macOS Screen Sharing features may have changed |
| 12 | Contradictory Frame | Does the new research maintain a consistent frame? (Dedicated machine, Mac Mini, headless-first) |

**Step 2: Address any flags**

- Clear match (fix in <5 min): fix immediately, log the fix
- Ambiguous match: flag for Sean, do not self-resolve
- No matches: note "anti-pattern check clean" and continue

**Step 3: Log result**

Add to activity log: the anti-pattern check result (clean or what was found/fixed).

**Step 4: Commit (if fixes were made)**

```bash
git add outputs/openclaw-jeff/
git commit -m "quality: anti-pattern check on hardware choices research"
```

---

## Phase 4: Section Construction

### Task 6: Section Plan (Phase A)

**Context:** The section-construction skill (`engine/skills/section-construction/SKILL.md`) mandates a planning phase before generating any deep-dive output >500 lines. This new section will be inserted into the existing walkthrough, so namespace prefixes must not collide with existing sections (s1 through s8).

**Files:**
- Read: `engine/skills/section-construction/SKILL.md`
- Read: `engine/methodology/section-construction.md`
- Read: `engine/templates/walkthrough-style-guide.md`
- Read: `engine/templates/diagram-color-reference.md`
- Read: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (existing structure, nav, namespaces)

**Step 1: Design the section architecture**

The new section inserts between existing Section 2 (id: `s2-machine`, phase: `s2`) and Section 3 (id: `s3-setup`, phase: `s3`). It needs its own nav entry, namespace prefix, and phase identifier.

Proposed namespace: `s2b` (inserted after s2, before s3, avoids renumbering everything)

**Proposed section plan:**

| Subsection | Title | Est. Lines | Purpose | Key Elements |
|-----------|-------|-----------|---------|-------------|
| 2b.1 | Your Machine: What Changed | ~80 | Acknowledge the dedicated machine correction. Jeff's situation is actually better than the walkthrough assumed — no shared machine risk. Brief, respectful, gets it right | Updated understanding expandable |
| 2b.2 | Hardware Comparison: Mac Mini vs MacBook Air | ~150 | Side-by-side comparison for dedicated always-on AI use. Teaches how to evaluate hardware for server workloads (transferable). Comparison table with key criteria | Comparison table, cost breakdown table, understanding expandable |
| 2b.3 | How You'll Access Your Machine | ~180 | Three access method options with pros/cons. Teaches the concept of headless operation (transferable) | Comparison table, Rough.js diagram (access methods visualization), understanding expandable |
| 2b.4 | Our Recommendation | ~120 | Present the specific recommendation: Mac Mini M4 24GB/512GB ($999) + Screen Sharing from MacBook Pro. What to buy, what it costs, what the setup looks like | Shopping list table, cost summary, checkbox self-test |

**Estimated total: ~530 lines** (qualifies for section construction)

**Diagram plan:**

One new Rough.js diagram in subsection 2b.3: **Access Methods visualization**
- Concept: How Jeff connects to his dedicated Mac Mini
- Pattern: Network/flow diagram showing Mac Mini (center) with three connection paths radiating out (Screen Sharing from MacBook Pro, SSH from Terminal, physical lapdock)
- Semantic colors from `diagram-color-reference.md`:
  - Mac Mini: Infrastructure (blue)
  - MacBook Pro: User/Operator (amber)
  - Connection paths: Neutral (stone) with labels
  - Lapdock/Physical: Data/Config (green)
- Isomorphism test: Without labels, the structure should show a central node with three distinct paths — communicating "multiple ways to reach one thing"
- Variety check: Existing walkthrough has side-by-side comparison (Diagram 2), layer stack (Diagram 3), flow (Diagram 4), split (Diagram 5), and boundary (Diagram 6). A hub-and-spoke/radial pattern is new and appropriate

**Cross-references:**

| New Section → Existing | Existing → New Section |
|----------------------|----------------------|
| 2b.1 references Section 2 ("Why a Dedicated Machine") — acknowledges the original reasoning still applies | None needed — existing sections don't need to point forward to this new section |
| 2b.2 references Section 2's power/thermal discussion | (Downstream adjustments deferred until Jeff confirms hardware choice) |
| 2b.4 references Section 3 ("Your Setup") — the next step after making the hardware decision | |

**Step 2: Present section plan to Sean for approval**

Show the table above, the diagram plan, the namespace scheme, and the cross-reference map. Wait for Sean's confirmation before generating any content.

**Step 3: Commit the plan**

```bash
git add docs/plans/2026-03-03-openclaw-jeff-hardware-choices-plan.md
git commit -m "plan: section construction plan for hardware choices section"
```

---

### Task 7: Build Section Content (Phase B)

**Context:** Generate the walkthrough content subsection by subsection. Each subsection gets per-section self-tests (4 checks from section-construction methodology) before moving to the next. Content follows `engine/methodology/editorial-standards.md` — every claim sourced, residual risk stated, transferable principles called out, commands copy-pasteable.

**Files:**
- Read: `engine/methodology/editorial-standards.md`
- Read: `engine/methodology/three-tier-hardening.md`
- Read: `engine/templates/walkthrough-style-guide.md`
- Read: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/mac-mini-hardware-choices.md`
- Read: `outputs/openclaw-jeff/research/knowledge-base/04-deployment/access-methods.md`
- Modify: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html`

**Important guidance for content generation:**
- Match the existing walkthrough's tone — direct, honest, never condescending, explains "why" before "what"
- Jeff can follow instructions. Don't make decisions without explaining them. But DO make the decisions — don't ask him to evaluate technical tradeoffs he can't assess
- Transferable principles called out explicitly: evaluating hardware for always-on services, understanding headless operation, remote access concepts
- All HTML must use the existing CSS classes and component patterns (callouts, expandables, checkboxes, tables, understanding sections, deployment notes)
- All interactive elements must use `data-key` attributes with the `s2b-` namespace prefix
- Diagram rendering must follow `diagram-color-reference.md` exactly

**Step 1: Build subsection 2b.1 — "Your Machine: What Changed"**

Content requirements:
- Acknowledge that the walkthrough assumed shared machine use. Jeff clarified: dedicated only
- Explain what this changes: the biggest residual risk (shared machine with banking/email) no longer applies
- Frame this positively — Jeff's setup is actually safer than what the walkthrough planned for
- Keep it brief — this is a correction, not a new lesson
- Understanding expandable: "Why dedicated is better than we expected" — explain that the original walkthrough was designed to compensate for shared-machine risks with extra security layers. On a dedicated machine, those layers still help but the baseline is already stronger. Transferable principle: isolation reduces blast radius (reinforces Section 2's lesson)

Per-section self-tests (run after writing):
1. Does every claim have a source or reference?
2. Does the subsection stand on its own without requiring Section 2 to be read first?
3. Is the security implication noted inline?
4. Would Jeff understand this without technical background?

**Step 2: Build subsection 2b.2 — "Hardware Comparison"**

Content requirements:
- Comparison table: Mac Mini M4 vs MacBook Air M4 for dedicated always-on AI use
- Criteria: price (at same specs), cooling, power consumption, always-on suitability, battery management, form factor, expandability (USB-A ports, external storage)
- Each criterion explained in Jeff-accessible language
- Cost breakdown table: Mac Mini full setup cost vs MacBook Air full setup cost
- Understanding expandable: "How to evaluate hardware for a server" — transferable principle about what matters for always-on services (cooling, power, form factor, reliability) vs. what matters for personal use (screen, portability, battery). This transfers to any deployment decision, not just OpenClaw
- Note: Mac Mini is $200 LESS at same specs (24GB/512GB) — this matters for Jeff's budget consciousness

Per-section self-tests after writing.

**Step 3: Build subsection 2b.3 — "How You'll Access Your Machine"**

Content requirements:
- Explain the concept of headless operation — a computer running without its own monitor, keyboard, or mouse. Transferable concept
- Three options presented as a comparison:

| Option | How It Works | Cost | Best For | Complexity |
|--------|-------------|------|----------|-----------|
| Screen Sharing from MacBook Pro | Built-in macOS feature. Mac Mini appears in Finder. Click to control it. 60fps High Performance mode. | Free | Daily use, full GUI access | Very low — flip one switch in settings |
| Lapdock (NexDock 6) | Portable monitor + keyboard + trackpad. Single USB-C cable to Mac Mini rear port. Fold and store | $229 | Physical access when needed, kid-proof (put it away) | Low — plug in one cable |
| Fully headless + SSH | No display ever. Terminal-only access. Optional HDMI dummy plug for cleaner Screen Sharing resolution | $0-12 | Command-line management of the AI agent | Medium — requires Terminal comfort |

- Explain Screen Sharing High Performance mode and what Apple Silicon enables
- Note the gotchas: front USB-C ports don't carry display, initial setup requires a display (any TV via HDMI works for 10 minutes), FileVault + headless reboot tradeoff
- Understanding expandable: "Headless operation is how most servers work" — transferable. Every cloud server, every data center machine, most professional infrastructure runs headless. Jeff is doing the same thing at home scale. The concept transfers to understanding how any remote service works
- Rough.js diagram: Hub-and-spoke showing Mac Mini with three access paths

Per-section self-tests after writing.

**Step 4: Build subsection 2b.4 — "Our Recommendation"**

Content requirements:
- Clear recommendation: **Mac Mini M4, 24GB RAM, 512GB storage — $999 from Apple**
- Access method recommendation: **Screen Sharing from your MacBook Pro (free, already have everything you need)**
- Why this combination: cheapest option that meets all requirements, Jeff already has a premium display (16" MacBook Pro), active cooling eliminates thermal worries, designed for always-on, kids can't mess with a headless box tucked away, no extra peripherals needed beyond initial setup
- Shopping list table:

| Item | Cost | Notes |
|------|------|-------|
| Mac Mini M4, 24GB/512GB | $999 | apple.com or Apple Store |
| USB keyboard (setup only) | $10-15 | Borrow or buy cheap — only need for 10-min setup |
| HDMI cable | $0-10 | For TV during initial setup. You probably have one |
| Ethernet cable (recommended) | $5-10 | Wired connection is more reliable for a server |
| HDMI dummy plug (optional) | $8-12 | Gives Screen Sharing a clean resolution. Optional |
| **Total** | **~$1,025-1,045** | |

- Monthly cost reminder: same as before ($23-50/month for Claude Pro + API + Zapier)
- Electricity: ~$7/year at the Mac Mini's 3-4W idle draw
- Residual consideration: "If you'd rather have physical access without using Screen Sharing, the NexDock 6 lapdock ($229) is the best option we found. It adds $229 to the total but gives you a fold-away screen + keyboard whenever you want hands-on access."
- Self-test checkboxes:
  - "I understand why the Mac Mini is recommended over the MacBook Air for this"
  - "I know how I'll access the Mac Mini (Screen Sharing / lapdock / other)"
  - "I know what to buy and the approximate total cost"
- Deployment notes textarea for Jeff to note questions for Sean

Per-section self-tests after writing.

**Step 5: Commit after each subsection**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html
git commit -m "output: subsection 2b.X — [title]"
```

---

### Task 8: Update Sidebar Navigation

**Context:** The existing sidebar has 8 nav entries (s1 through s8) with group labels. The new section needs a nav entry between Section 2 and Section 3. The progress tracking (section completion, progress bar) needs to account for the new section.

**Files:**
- Modify: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (sidebar nav and progress JS)

**Step 1: Add nav entry**

Insert after the Section 2 nav item and before the Section 3 nav item:
```html
<a class="nav-item" href="#s2b-choices" data-target="s2b-choices" data-phase="s2b"><span class="nav-dot"></span>Your Hardware Choices</a>
```

Note: this goes under the existing "FOUNDATIONS" group label, which already contains sections 1-3. The new section fits thematically here.

**Step 2: Update progress tracking**

The progress bar currently tracks "0 of 8 sections complete." It will need to say "0 of 9 sections complete" after insertion. The `updateProgress()` function counts `.phase-section` elements dynamically, so no JS change should be needed — verify this.

**Step 3: Commit**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html
git commit -m "output: sidebar navigation updated for hardware choices section"
```

---

### Task 9: Whole-Output Review (Phase C)

**Context:** After all subsections are built, read the new section as a unified document IN CONTEXT of the full walkthrough. Check flow, transitions, cross-references, and balance. Run anti-pattern check.

**Files:**
- Read: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (full file)
- Read: `engine/skills/anti-pattern-check/SKILL.md`

**Step 1: Read the complete new section (s2b) from start to finish**

Check:
- Does it flow naturally from Section 2 into the new section?
- Is the tone consistent with the rest of the walkthrough?
- Are cross-references accurate?
- Is the balance right? (No subsection more than ~3x the size of the smallest)
- Does it end cleanly at the recommendation without trying to bridge to Section 3?

**Step 2: Run anti-pattern check**

Focus on:
- #12 (Contradictory Frame): Does the new section maintain consistent framing with the rest of the walkthrough? Does it conflict with Section 2's shared-machine language?
- #1 (Understated Warning): Are the gotchas (front USB-C, FileVault, initial setup display requirement) stated with appropriate severity?
- #5 (Missing Source Trail): Are all new sources tracked in sources.md?

**Step 3: Run cross-cutting binary self-test X4**

"Pick any assumption about the user's setup. Does every section agree?" Specifically check: does the new section say "dedicated" consistently? Does it conflict with Section 2's current "shared machine" language? (It should acknowledge the correction without contradicting Section 2 — Section 2's content will be adjusted later when Jeff confirms his choice.)

**Step 4: Log review findings and fix issues**

Fix anything found. One issue at a time. Re-read after each fix.

**Step 5: Commit**

```bash
git add outputs/openclaw-jeff/
git commit -m "quality: whole-output review complete for hardware choices section"
```

---

## Phase 5: Self-Test

### Task 10: Run Binary Self-Tests

**Context:** Run the applicable self-tests from `engine/methodology/binary-self-tests.md` before render-validate. This is the quality gate.

**Files:**
- Read: `engine/skills/self-test/SKILL.md`
- Read: `engine/methodology/binary-self-tests.md`

**Step 1: Invoke self-test skill**

Read the skill file. Select test sets based on what was produced:
- **Research Stage Tests (R1-R4):** Applied to the structured findings in the new KB entries
- **Synthesis Stage Tests (S1-S4):** Applied to the recommendation and comparison content
- **Output Generation Tests (O1-O4):** Applied to the new walkthrough section
- **Visual Output Tests (V1-V6):** Deferred to render-validate (Task 11)
- **Cross-Cutting Tests (X1-X4):** Applied to everything

**Step 2: Run thorough versions (deep-dive depth)**

Run the thorough (right column) version of each test. Record pass/fail.

Key tests to pay attention to:
- R2 (thorough): "For every finding that will drive a decision, is there both an official and a community source?" — the Mac Mini recommendation drives a $999 purchase decision
- S2 (thorough): "Pick any tool-specific instruction. Is there an accompanying note about the transferable principle it implements?"
- O2 (thorough): "Pick any Understanding section. Cover the commands below it. Does the Understanding section alone teach a transferable principle?"
- O3 (thorough): "Pick any security-relevant step. Is the implication noted at the point of decision, or deferred?"
- X4: "Pick any assumption about the user's setup. Does every section agree?"

**Step 3: Fix all failures**

Every NO must be fixed. Then re-run the failed test. No rationalizing.

**Step 4: Present results to Sean**

Format: "X/Y tests passed" with specific fixes described for any initial failures.

**Step 5: Commit**

```bash
git add outputs/openclaw-jeff/
git commit -m "quality: binary self-tests passed for hardware choices section"
```

---

## Phase 6: Render-Validate

### Task 11: Render-Validate Loop

**Context:** Visual verification of the updated interactive HTML using Puppeteer MCP. This is mandatory for any visual/interactive output per `engine/skills/render-validate/SKILL.md`.

**Files:**
- Read: `engine/skills/render-validate/SKILL.md`
- Read: `engine/templates/diagram-color-reference.md`
- Read: `engine/templates/walkthrough-style-guide.md`
- Modify: `outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` (fixes)

**Step 1: Launch Puppeteer and take screenshots**

Required screenshot coverage:
1. Full new section (s2b) at 1280px desktop width — light mode
2. Full new section (s2b) at 1280px desktop width — dark mode
3. The new diagram (access methods) in detail — light mode
4. The new diagram (access methods) in detail — dark mode
5. Mobile view at 375px — verify responsive tables, hamburger menu works
6. Sidebar navigation — verify new entry appears, scroll spy highlights correctly
7. Transition from Section 2 into new section — verify visual flow

**Step 2: Run audit checklist**

All YES/NO checks from the render-validate skill:
- Diagram visible? Colors match diagram-color-reference.md? Labels readable? Dark mode correct?
- Expandables work? Checkbox persistence (check, reload, still checked)? Textarea persistence?
- Tables horizontally scrollable on mobile? Touch targets 44x44px?
- New nav entry visible and functional? Progress bar updated?
- Comparison tables readable and well-formatted?

**Step 3: Fix-render-verify loop**

One issue at a time. Fix, re-render, screenshot, verify. Typical: 2-4 iterations.

**Step 4: Fallback if Puppeteer unavailable**

If Puppeteer MCP is not available, degrade to manual: ask Sean to open the HTML file in a browser and provide screenshots. Never skip render-validate entirely.

**Step 5: Commit after all fixes**

```bash
git add outputs/openclaw-jeff/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html
git commit -m "visual: render-validate complete for hardware choices section"
```

---

## Phase 7: Update State and Deliver

### Task 12: Update CONTEXT.md and Logs

**Context:** Update all state documents to reflect the new section. This is the engine's memory — if it's not in CONTEXT.md, it didn't happen.

**Files:**
- Modify: `outputs/openclaw-jeff/CONTEXT.md`
- Modify: `outputs/openclaw-jeff/activity-log.md`
- Modify: Root `CONTEXT.md`

**Step 1: Update output CONTEXT.md**

Add to the walkthrough description:
- New section: "Your Hardware Choices" (Section 2b) — 4 subsections, ~530 lines, 1 Rough.js diagram
- Note: inserted between Section 2 and Section 3, no downstream modifications yet
- Note: downstream content (Section 2's shared-machine framing, Section 3's MacBook Air checklist) will be adjusted when Jeff confirms hardware choice

Update Key Decisions:
- Add: "Mac Mini M4 recommended over MacBook Air for dedicated use"
- Add: "Screen Sharing from MacBook Pro recommended as primary access method"
- Add: "Hardware choice section added as Section 2b, existing content preserved"

Update Open Questions:
- Add: "Awaiting Jeff's hardware decision — Mac Mini recommended but choice is his"
- Add: "Downstream walkthrough adjustments pending hardware confirmation"

**Step 2: Update activity log**

```markdown
| 2026-03-03 | Hardware choices section complete. Section 2b added to walkthrough: 4 subsections (~530 lines), 1 diagram, comparison tables, recommendation (Mac Mini M4 24GB/512GB + Screen Sharing). Full pipeline: depth assessment → findings pattern → anti-pattern check → section construction → self-test → render-validate. All quality gates passed. |
```

**Step 3: Update root CONTEXT.md**

Note that Output #2 has been iterated post-delivery with a new section.

**Step 4: Commit**

```bash
git add outputs/openclaw-jeff/CONTEXT.md outputs/openclaw-jeff/activity-log.md CONTEXT.md
git commit -m "state: CONTEXT.md updated for hardware choices section"
```

---

### Task 13: Deploy to GitHub Pages

**Context:** The walkthrough is hosted via GitHub Pages. Push the updated HTML so Jeff can access it at the same URL.

**Step 1: Verify the file is ready**

Ensure the HTML file is committed and all render-validate fixes are included.

**Step 2: Push to remote**

```bash
git push origin main
```

**Step 3: Verify deployment**

Check that GitHub Pages has picked up the change. The hosted URL should show the updated walkthrough with the new section.

**Step 4: Notify Sean**

Confirm the updated walkthrough is live and accessible.

---

## Deferred Work (Do NOT Execute Now)

These items are noted for future execution when Jeff confirms his hardware choice:

### Downstream Walkthrough Adjustments (After Jeff Confirms Mac Mini)

1. **Section 2 ("Why a Dedicated Machine"):** Replace the "Your Situation: The Honest Tradeoff" subsection. Remove the shared-machine framing (lines 720-728). Replace with dedicated Mac Mini framing. Update the Shared vs Dedicated diagram to show Jeff's actual setup (dedicated Mini + separate MacBook Pro)

2. **Section 2 ("What Makes the MacBook Air Work"):** Replace with "What Makes the Mac Mini Work" — simpler content since Mac Mini eliminates thermal, battery, and sleep concerns. The table of requirements still applies but the caveats are different

3. **Section 3 ("Your Setup — Hardware Checklist"):** Replace MacBook Air checklist items with Mac Mini equivalents. Remove battery/charger items. Add "power cable connected, ethernet connected" items

4. **Section 5 ("Security Hardening"):** Update the "Shared machine risk" residual risk statement. On a dedicated machine, this risk is dramatically reduced. The security layers still apply but the residual risk framing changes

5. **Section 2 self-test checkboxes:** Update to reflect dedicated Mac Mini instead of shared MacBook Air

### CTM eContracts Research (Phase 2)

- Research ctmecontracts.com and parent company ecosystem for API access
- Assess integration feasibility with OpenClaw
- This is a separate output phase, not part of the hardware choices work
- Should only begin after Jeff completes Phase 1 walkthrough and has a running OpenClaw instance

### Engine Methodology Updates

- The operator profile template now includes question #10 about dedicated vs. shared use (already updated)
- Anti-pattern #12 (The Contradictory Frame) has been added (already logged)
- Binary self-test X4 has been added (already logged)
- Consider adding a "post-delivery feedback" intake process to the engine methodology — this session demonstrated a pattern where delivery feedback drives iteration
