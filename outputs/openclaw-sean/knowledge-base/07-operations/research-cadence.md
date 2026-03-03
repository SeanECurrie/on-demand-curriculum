# Research Cadence — Keeping the Intelligence Current

**Created:** 2026-02-11
**Purpose:** Operational framework for continuous intelligence gathering in a fast-moving ecosystem

---

## Why This Matters

OpenClaw is young, growing explosively, and security-critical.

**Evidence of pace:**
- 145,000 GitHub stars in ~8 weeks (CNBC, Tier 2)
- CVE-2026-25253 (CVSS 8.8 RCE) disclosed and patched within days (January 2026)
- ClawHub skills ecosystem compromised (12% malicious per Koi Security, Tier 2)
- Provider plugin system underwent major 2026 refactoring (docs.openclaw.ai, Tier 1)
- Community terminology shifts (Clawdbot → Moltbot → OpenClaw, Tier 4)

In this environment, 30-day-old knowledge is stale. 90-day-old knowledge is dangerous.

---

## Periodic Research Sweeps

### Weekly (15-30 min) — Security & Stability Watch
**What to check:**
- OpenClaw releases: `npm view openclaw versions --json | tail -n 5` or docs.openclaw.ai/changelog
- CVE/security advisories: NVD, SOCRadar, GitHub Security Lab, runZero
- Critical GitHub issues: openclaw/openclaw repo, filter by "bug", "security", "macOS"
- Community security pulse: r/selfhosted, r/LocalLLaMA "OpenClaw security" filtered by past week

**Tools:**
- Context7: `query-docs` for changelog updates at docs.openclaw.ai library
- Bright Data: `search_engine` with `query: "OpenClaw CVE OR vulnerability OR exploit site:nvd.nist.gov OR site:socradar.io OR site:thehackernews.com"` and date filter `after:7d`

**Output:**
- Update `intelligence-log.md` if: CVE disclosed, critical bug affecting macOS, security guidance changed, breaking change announced
- Update `CONTEXT.md` if deployment action required (e.g., patch available)

**Skip if:** No releases, no CVEs, community quiet. Absence of findings is a valid outcome.

---

### Biweekly (30-60 min) — Community Pulse & Skill Ecosystem
**What to check:**
- Reddit sentiment shifts: r/selfhosted, r/LocalLLaMA, r/ClaudeAI, r/AI_Agents
- New competitor movements: Manus AI, Lindy AI, n8n, emerging tools
- ClawHub/awesome-openclaw-skills updates: new categories, curated lists
- YouTube creator content: Tech With Tim, Wes Roth, established AI channels
- Official blog posts: docs.openclaw.ai/blog, Anthropic announcements (Claude model updates affect OpenClaw)

**Tools:**
- Bright Data batch search:
  - `"OpenClaw reddit after:14d site:reddit.com/r/selfhosted OR site:reddit.com/r/LocalLLaMA"`
  - `"AI agent Manus Lindy OpenClaw comparison 2026"`
  - `"ClawHub skills malicious supply chain"`
  - `"Claude Opus Sonnet update 2026 API"`
- Context7: Query OpenClaw blog library, Anthropic docs

**Output:**
- Update relevant KB buckets:
  - `01-landscape/` if new competitor data or positioning changes
  - `05-skills-and-integrations/` if new skill patterns emerge (inspiration only, not direct install)
  - `06-community-intelligence/` for significant sentiment shifts or new expert voices
- Update `intelligence-log.md` for strategic findings (e.g., "Community now recommends X over Y")

**Skip if:** No major shifts, same voices saying same things. Noise is not intelligence.

---

### Monthly (1-2 hours) — Deep Landscape & Architecture Refresh
**What to check:**
- Full competitive landscape refresh: Are we still in the right category? Did a credible new tool launch?
- OpenClaw architecture changes: Did the docs refactor sections? New API surfaces? Deprecated features?
- macOS/Apple Silicon ecosystem: Did Apple ship macOS update affecting launchd or TCC? New M-series chips changing deployment math?
- Model landscape: New Claude/GPT models? Pricing changes? Local model advancements (Llama, Qwen)?
- Security posture review: Rerun threat model against current version and known attack patterns

**Tools:**
- Context7: Full docs pull at docs.openclaw.ai across all sections, compare against archived versions
- Bright Data comprehensive sweep:
  - Competitive landscape queries (rerun Phase 1 queries with date filters)
  - macOS + AI agent deployment (new reports, updated benchmarks)
  - Model comparison (frontier + local, cost + capability)
- Cross-validation: docs against community claims

**Output:**
- Updated reports in `research/reports/` if significant changes warrant it
- Mark outdated KB sections with `[OUTDATED as of YYYY-MM-DD]` tag
- Archive old `CONTEXT.md` to `CONTEXT-HISTORY.md` if entering new operational phase
- Synthesize findings in `intelligence-log.md`

**Deliverable quality bar:** Would this knowledge change a deployment decision? If no, it's maintenance. If yes, it's intelligence.

---

## Trigger-Based Research (Unscheduled)

Execute immediately when:

| Trigger | Action | Tools | Output |
|---------|--------|-------|--------|
| **New OpenClaw version released** | Read changelog, cross-check breaking changes against our config, scan for security fixes, check macOS-specific notes | Context7 (docs), Bright Data (GitHub release discussion) | Update `CONTEXT.md` with version and patch notes, schedule upgrade if critical security fix |
| **CVE disclosed** | Pull CVE details from NVD, assess impact on our deployment (localhost-only binding? Tailscale-protected?), check patch availability | Context7 (security advisories), Bright Data (exploit analysis) | Immediate entry in `intelligence-log.md`, add to security KB, assess urgency (patch now vs next maintenance window) |
| **New competitor launches** | Evaluate positioning (framework vs product?), assess if it changes our "OpenClaw is right category" decision, store for awareness | Bright Data (landscape scan), Context7 (their docs if available) | Add to `01-landscape/`, note in `intelligence-log.md` only if strategically relevant |
| **Something breaks in production** | Context7 for current docs (did config format change?), Bright Data for community solutions (GitHub issues, Reddit troubleshooting threads), check if known bug | Both | Troubleshooting entry in `07-operations/`, pattern extraction if novel, bug report to openclaw/openclaw if new |
| **Tim posts follow-up content** | Watch video, extract new findings, cross-validate against our research, flag contradictions | Manual (YouTube) + Bright Data (community reaction) | Update `operator/source-transcript-*` if major new guidance, note in `intelligence-log.md` |
| **macOS update ships** | Check if launchd behavior changed, TCC policies updated, Node.js ARM compatibility affected, test on Mac Mini before auto-updating | Apple release notes, Homebrew/npm compatibility reports, r/MacOS discussion | Update `04-deployment/mac-mini-*` if deployment steps change, test before applying to production Mac Mini |
| **Model pricing/capability changes** | Reassess model routing config (still using right model for each agent?), recalculate monthly cost projections, check if local models closed capability gap | Anthropic/OpenAI pricing pages, Context7 (OpenClaw model docs), Bright Data (local model benchmarks) | Update `02-architecture/model-routing-*` and cost projections in `CONTEXT.md` |

---

## How Findings Feed Back Into the System

### Four Logging Layers (Know Which to Use)

**1. intelligence-log.md — Strategic insights only**
- Hypotheses validated or refuted
- Contradictions between sources
- Key discoveries that change understanding
- Risk escalations (e.g., CVE disclosures)
- Examples: "VALIDATED: Mac Mini deployment is proven", "CRITICAL DISCOVERY: CVE-2026-25253 RCE", "RESOLVED: Model routing is failover not intelligent"

**2. CONTEXT.md — Current operational state**
- What version is deployed
- What's working, what's being investigated
- What needs attention
- Staleness check: last updated date
- Examples: "Deployed v2026.1.29 on 2026-02-15", "Investigating heartbeat token cost", "Action needed: test launchd on macOS 15.3"

**3. activity-log.md — Breadcrumbs**
- Research sweeps executed
- KB updates made
- Tools used
- Sources consulted
- Examples: "2026-02-11: Ran weekly security sweep, 0 CVEs found", "Updated 03-security/ with new findings", "Scraped 12 Reddit threads via Bright Data"

**4. Knowledge Base Entries — Refined truth**
- Accumulated findings with dates and tiers
- Outdated sections marked `[OUTDATED as of YYYY-MM-DD]` but never deleted
- Cross-references between buckets
- Sources cited inline

### Decision Tree: Where Does This Go?

```
New finding acquired
  |
  |-- Is it a strategic insight? (changes decisions, validates hypotheses, reveals contradictions)
  |     YES --> intelligence-log.md
  |     NO  --> Continue
  |
  |-- Does it change current operational state? (version, status, action items)
  |     YES --> CONTEXT.md
  |     NO  --> Continue
  |
  |-- Is it a routine action breadcrumb? (research sweep, update, task completed)
  |     YES --> activity-log.md
  |     NO  --> Continue
  |
  |-- Is it knowledge to accumulate? (technical details, community findings, architecture facts)
        YES --> Relevant KB bucket (01-07)
```

---

## Staleness Rules

| Artifact | Staleness Threshold | Action When Stale |
|----------|---------------------|-------------------|
| CONTEXT.md | 5 days | Flag for review at session start, update current state |
| KB entries | No fixed threshold | Mark `[OUTDATED as of YYYY-MM-DD]` when superseded, leave in place for historical context |
| Reports (research/reports/) | 30 days | Evaluate if underlying KB changed significantly; if yes, refresh report |
| Security findings | 0 days | Never stale — always current or explicitly outdated. CVEs are timestamped. |
| Landscape comparisons | 60 days | Competitive field moves slower than OpenClaw itself; refresh quarterly unless major new tool |
| Community sentiment | 14 days | Fast-moving; relies on biweekly sweeps |

**The 5-day CONTEXT.md rule is firm.** This space moves too fast to leave context unattended for a week.

---

## Meta-Research: Evaluating the Cadence Itself

After 60 days of operation, evaluate:
- Are weekly sweeps finding signal or just noise?
- Are monthly deep-dives catching things the shorter sweeps miss, or are they redundant?
- What percentage of trigger-based research actually yielded action?
- Has the 5-day CONTEXT.md threshold been appropriate, or does it need adjustment?

**Tune the cadence based on observed signal-to-noise ratio.** The goal is current intelligence, not research theater.

---

## Anti-Patterns (What NOT to Do)

1. **Research without synthesis** — Scraping 50 sources and dumping them in a directory is not intelligence. Synthesis into KB or reports is required.
2. **Logging everything** — `activity-log.md` is for breadcrumbs, not a play-by-play. "Read file X" is noise. "Ran landscape sweep, updated 01-landscape/" is signal.
3. **Chasing every Reddit thread** — Community intelligence is valuable when it validates/contradicts docs or reveals expert knowledge. Random opinions are noise.
4. **Ignoring staleness** — A research project that goes stale is just an abandoned tutorial with extra steps.
5. **Deleting outdated knowledge** — Mark it outdated, don't delete. The evolution has value. Knowing what used to be true and changed is intelligence.
6. **Researching without deployment context** — If it doesn't inform the Mac Mini deployment or operational decisions, it's academic, not actionable.

---

## Tools Reference

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Context7 `query-docs` | Official documentation pulls | Weekly (changelog), Monthly (full refresh), Trigger-based (troubleshooting) |
| Context7 `resolve-library-id` | Identify available doc libraries | When adding new tools to research scope |
| Bright Data `search_engine` | Targeted community/security sweeps | Weekly (CVE search), Biweekly (Reddit pulse), Monthly (landscape) |
| Bright Data `scrape_as_markdown` | Full article/post extraction | When search results identify high-value Tier 2-3 sources |
| GitHub CLI (`gh`) | Issue/PR tracking, release monitoring | Trigger-based (new version, reported bugs) |
| `npm view openclaw` | Version/changelog check | Weekly (version check) |

---

## Success Metrics

This research system is working if:
1. **CONTEXT.md is never >5 days stale** in active development/operation phases
2. **Security sweeps catch CVEs before they're exploited** (we patch proactively, not reactively)
3. **Intelligence log shows strategic insights**, not just activity breadcrumbs
4. **KB accumulates value**, marked outdated sections show evolution over time
5. **Trigger-based research fires appropriately** (not ignored, not over-used)
6. **You can walk away for 2 weeks, return, read CONTEXT.md, and know exactly what needs attention**

If those conditions hold, the living system is alive and healthy.
