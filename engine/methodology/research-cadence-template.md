# Research Cadence Template

**Created:** 2026-03-03
**Purpose:** Operational framework for continuous intelligence gathering in a fast-moving technology ecosystem. Adapt this template to any tool or platform under active evaluation.

---

## Why Cadence Matters

Technology ecosystems — especially young, fast-growing ones — evolve faster than static research can track. A finding from 30 days ago may be stale. A finding from 90 days ago may be dangerous to act on. Scheduled research sweeps prevent knowledge decay without requiring constant vigilance.

The cadence below is a starting template. After 60 days of operation, evaluate whether each frequency is producing signal or just noise, and tune accordingly.

---

## Periodic Research Sweeps

### Weekly (15-30 min) — Security and Stability Watch

**What to check:**
- New releases of the tool under evaluation (changelogs, version bumps)
- CVE/security advisories (NVD, vendor security page, SOCRadar, GitHub Security Lab)
- Critical GitHub issues (filter by "bug", "security", platform-specific labels)
- Community security pulse (relevant subreddits, filtered by past week)

**Tools:**
- Context7: `query-docs` for changelog updates at the tool's documentation library
- Bright Data: `search_engine` with query patterns like `"[tool name] CVE OR vulnerability OR exploit site:nvd.nist.gov OR site:socradar.io"` with date filter `after:7d`

**Output:**
- Update intelligence log if: CVE disclosed, critical bug affecting your platform, security guidance changed, breaking change announced
- Update context document if deployment action required (e.g., patch available)

**Skip if:** No releases, no CVEs, community quiet. Absence of findings is a valid outcome — do not fabricate signal.

---

### Biweekly (30-60 min) — Community Pulse and Ecosystem Watch

**What to check:**
- Community sentiment shifts on relevant subreddits and forums
- New competitor movements or alternative tools emerging
- Plugin/extension ecosystem updates (new categories, security concerns, curated lists)
- Content from established creators (Tier 2 sources)
- Official blog posts and announcements from the tool vendor and upstream providers

**Tools:**
- Bright Data batch search:
  - `"[tool name] reddit after:14d site:reddit.com/r/[relevant-subreddit]"`
  - `"[tool name] vs [alternative] comparison [year]"`
  - `"[tool name] plugin OR extension malicious OR supply chain"`
  - `"[upstream provider] update [year] API"` (e.g., model provider updates that affect the tool)
- Context7: Query the tool's blog/announcement library and upstream provider docs

**Output:**
- Update relevant knowledge base buckets:
  - Landscape bucket if new competitor data or positioning changes
  - Skills/integrations bucket if new extension patterns emerge
  - Community intelligence bucket for significant sentiment shifts or new expert voices
- Update intelligence log for strategic findings

**Skip if:** No major shifts. Noise is not intelligence.

---

### Monthly (1-2 hours) — Deep Landscape and Architecture Refresh

**What to check:**
- Full competitive landscape refresh — are you still evaluating the right tool in the right category?
- Architecture changes in the tool (docs refactors, new API surfaces, deprecated features)
- Platform ecosystem changes (OS updates affecting deployment, runtime updates, hardware considerations)
- Upstream provider landscape (model changes, pricing shifts, capability updates, local alternatives)
- Security posture review (rerun threat model against current version and known attack patterns)

**Tools:**
- Context7: Full docs pull across all sections, compare against archived versions
- Bright Data comprehensive sweep:
  - Competitive landscape queries (rerun initial queries with date filters)
  - Platform-specific deployment reports and benchmarks
  - Upstream provider comparisons (cost, capability, availability)
- Cross-validation: docs against community claims

**Output:**
- Updated reports if significant changes warrant it
- Mark outdated knowledge base sections with `[OUTDATED as of YYYY-MM-DD]` tag
- Archive context document if entering new operational phase
- Synthesize findings in intelligence log

**Quality bar:** Would this knowledge change a deployment decision? If no, it's maintenance. If yes, it's intelligence.

---

## Trigger-Based Research (Unscheduled)

Execute immediately when any of these occur:

| Trigger | Action | Tools | Output |
|---------|--------|-------|--------|
| **New version released** | Read changelog, cross-check breaking changes against your config, scan for security fixes, check platform-specific notes | Context7 (docs), Bright Data (GitHub release discussion) | Update context document with version and patch notes, schedule upgrade if critical security fix |
| **CVE disclosed** | Pull CVE details from NVD, assess impact on your deployment (network exposure? access controls?), check patch availability | Context7 (security advisories), Bright Data (exploit analysis) | Immediate intelligence log entry, update security KB, assess urgency |
| **New competitor launches** | Evaluate positioning (framework vs product?), assess if it changes your tool selection, store for awareness | Bright Data (landscape scan), Context7 (their docs if available) | Add to landscape KB, note in intelligence log only if strategically relevant |
| **Something breaks** | Check current docs (did config format change?), search community for solutions (GitHub issues, Reddit troubleshooting), determine if known bug | Both | Troubleshooting entry in operations KB, pattern extraction if novel |
| **Established creator posts follow-up** | Review content, extract new findings, cross-validate against your research, flag contradictions | Manual + Bright Data (community reaction) | Update source transcripts if major new guidance |
| **Platform/OS update ships** | Check if service management, security policies, or runtime compatibility affected | Release notes, community compatibility reports | Update deployment KB if steps change, test before applying |
| **Upstream provider changes** | Reassess configuration (still using right settings?), recalculate cost projections, check if alternatives closed capability gap | Provider pages, Context7 (tool's provider docs), Bright Data (benchmarks) | Update architecture KB and cost projections |

---

## Where Findings Go — Decision Tree

```
New finding acquired
  |
  |-- Is it a strategic insight? (changes decisions, validates hypotheses, reveals contradictions)
  |     YES --> intelligence log
  |     NO  --> Continue
  |
  |-- Does it change current operational state? (version, status, action items)
  |     YES --> context document
  |     NO  --> Continue
  |
  |-- Is it a routine action breadcrumb? (research sweep completed, update applied)
  |     YES --> activity log
  |     NO  --> Continue
  |
  |-- Is it knowledge to accumulate? (technical details, community findings, architecture facts)
        YES --> Relevant knowledge base bucket
```

### Four Logging Layers

1. **Intelligence log** — Strategic insights only: hypotheses validated/refuted, contradictions between sources, key discoveries, risk escalations
2. **Context document** — Current operational state: deployed version, what's working, what needs attention, staleness check
3. **Activity log** — Breadcrumbs: research sweeps executed, KB updates made, tools used, sources consulted
4. **Knowledge base entries** — Accumulated findings with dates and credibility tiers, outdated sections marked but never deleted

---

## Staleness Rules

| Artifact | Staleness Threshold | Action When Stale |
|----------|---------------------|-------------------|
| Context document | 5 days | Flag for review at session start, update current state |
| Knowledge base entries | No fixed threshold | Mark `[OUTDATED as of YYYY-MM-DD]` when superseded, never delete |
| Research reports | 30 days | Evaluate if underlying KB changed significantly; if yes, refresh |
| Security findings | 0 days | Always current or explicitly outdated. CVEs are timestamped. |
| Landscape comparisons | 60 days | Competitive field usually moves slower; refresh quarterly unless major disruption |
| Community sentiment | 14 days | Fast-moving; relies on biweekly sweeps to stay current |

**The 5-day context document rule is firm.** Fast-moving ecosystems do not tolerate week-long gaps in situational awareness.

---

## Meta-Research: Evaluating the Cadence Itself

After 60 days of operation, evaluate:
- Are weekly sweeps finding signal or just noise?
- Are monthly deep-dives catching things the shorter sweeps miss, or are they redundant?
- What percentage of trigger-based research actually yielded action?
- Has the 5-day context staleness threshold been appropriate?
- Is the overall time investment (roughly 4-6 hours/month) justified by the intelligence produced?

**Tune the cadence based on observed signal-to-noise ratio.** The goal is current intelligence, not research theater.

---

## Anti-Patterns (What NOT to Do)

1. **Research without synthesis** — Scraping 50 sources and dumping them in a directory is not intelligence. Every sweep must produce synthesized findings in the appropriate log or KB bucket.
2. **Logging everything** — Activity logs are for breadcrumbs, not play-by-play. "Read file X" is noise. "Ran landscape sweep, updated knowledge base" is signal.
3. **Chasing every thread** — Community intelligence is valuable when it validates/contradicts docs or reveals expert knowledge. Random opinions are noise. Use credibility tiers to filter.
4. **Ignoring staleness** — A research project that goes stale is just an abandoned tutorial with extra steps.
5. **Deleting outdated knowledge** — Mark it outdated, never delete. Knowing what used to be true and changed is intelligence. The evolution has value.
6. **Researching without deployment context** — If a finding doesn't inform a deployment decision or operational understanding, it's academic, not actionable.

---

## Tools Reference

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Context7 `query-docs` | Official documentation pulls | Weekly (changelog), Monthly (full refresh), Trigger-based |
| Context7 `resolve-library-id` | Identify available doc libraries | When adding new tools to research scope |
| Bright Data `search_engine` | Targeted community/security sweeps | Weekly (CVE search), Biweekly (pulse), Monthly (landscape) |
| Bright Data `scrape_as_markdown` | Full article/post extraction | When search results identify high-value Tier 2-3 sources |
| GitHub CLI (`gh`) | Issue/PR tracking, release monitoring | Trigger-based (new version, reported bugs) |

---

## Related Documents

- `dual-source-intelligence.md` — The methodology these sweeps execute
- `credibility-tiers.md` — How to weight sources discovered during sweeps
- `editorial-standards.md` — How findings are documented
