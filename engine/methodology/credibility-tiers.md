# Source Credibility Tiers

**Created:** 2026-03-03
**Purpose:** A 5-tier system for weighting research sources, ensuring evidence-based decision making and consistent evaluation across all research outputs.

---

## Why Tiers Matter

Not all sources carry equal weight. A vendor's official changelog and a random Reddit comment both contain information, but treating them equally leads to bad decisions. Tiers enforce discipline: every finding gets tagged with its source credibility, making it explicit how much confidence a claim deserves.

This matters most when sources contradict each other. If Tier 1 (official docs) and Tier 4 (Reddit post) disagree, the contradiction is worth investigating — but the starting assumption favors Tier 1 unless the Tier 4 source provides reproducible evidence that overrides it.

Tiers also make knowledge base maintenance practical. When reviewing old findings for staleness, knowing the tier tells you how much effort to invest in re-verification.

---

## The Five Tiers

| Tier | Source Type | Weight | Notes |
|------|-----------|--------|-------|
| **1** | Official documentation + verified changelogs | Highest | Authoritative but can be outdated or incomplete. The baseline. |
| **2** | Established creators with proven deployments | High | Track record matters. Someone who has publicly deployed and documented their experience carries more weight than someone summarizing docs. |
| **3** | GitHub issues/PRs with reproducible details | Medium-high | Specific, verifiable, tied to code. The reproducibility is what elevates this above general community posts. |
| **4** | Reddit/forum posts with technical specificity | Medium | Useful for surfacing real-world issues but requires verification. Technical detail (config snippets, error messages, version numbers) elevates a post within this tier. |
| **5** | General community sentiment | Low | Direction indicator, not decision-maker. "Lots of people are saying X" tells you what to investigate, not what to conclude. |

---

## How to Assign Tiers

When evaluating a new source, ask these questions in order:

### 1. Is it official?
- Published by the tool's maintainers, on their official domain, in their official docs or changelog?
- **Yes** -> Tier 1
- **No** -> Continue

### 2. Does the author have a proven track record?
- Have they publicly deployed the tool and documented the process?
- Are they a recognized expert in the relevant domain (security researcher, established tech creator, core contributor)?
- Is their content consistently accurate when cross-checked against other sources?
- **Yes** -> Tier 2
- **No** -> Continue

### 3. Is it reproducible and tied to code?
- GitHub issue with steps to reproduce, version numbers, and error output?
- Pull request with code changes and test results?
- Bug report with specific configuration that triggers the behavior?
- **Yes** -> Tier 3
- **No** -> Continue

### 4. Does it contain technical specificity?
- Forum/Reddit post that includes config snippets, exact error messages, version numbers, OS details?
- Blog post with specific deployment details rather than high-level impressions?
- **Yes** -> Tier 4
- **No** -> Tier 5

---

## Tier Application Examples (from Output #1)

These examples are drawn from the OpenClaw research (Output #1 of the curriculum engine) to illustrate how tiers work in practice:

| Finding | Source | Tier | Reasoning |
|---------|--------|------|-----------|
| Gateway default port is 18789 | docs.openclaw.ai configuration reference | 1 | Official documentation, verifiable |
| ~20% of community plugin marketplace skills are malicious | Koi Security audit report, cross-validated by community scanning | 2 | Established security research firm with methodology |
| LaunchAgent fails to load for non-admin users on macOS 15.x | GitHub issue #4521 with reproduction steps | 3 | Reproducible, version-specific, tied to code |
| "Docker sandbox uses 2-3GB RAM on Apple Silicon in my experience" | Reddit r/selfhosted post with Activity Monitor screenshots | 4 | Technically specific with evidence, but single data point |
| "Everyone seems to be moving away from [tool X] lately" | Multiple Reddit threads, no specific technical reasoning | 5 | Sentiment only, not actionable without investigation |

---

## When to Upgrade or Downgrade a Source's Tier

Tiers are not permanent. A source's effective tier can shift based on context:

### Upgrades (source earns more weight)

- **Tier 5 -> Tier 4:** General sentiment gets backed by a specific technical post from someone in the same thread
- **Tier 4 -> Tier 3:** A forum post's claim gets reproduced in a GitHub issue with steps to verify
- **Tier 3 -> Tier 2:** A GitHub contributor's findings are consistently validated across multiple issues and their methodology is sound
- **Tier 2 -> Tier 1:** An expert's finding gets incorporated into official documentation or changelog
- **Any tier -> +1:** Multiple independent sources at the same tier converge on the same finding (corroboration)

### Downgrades (source loses weight)

- **Tier 1 -> effectively Tier 3:** Official documentation is demonstrably outdated (describes behavior that no longer matches current version)
- **Tier 2 -> Tier 4:** An established creator's claim is contradicted by reproducible evidence from multiple Tier 3 sources
- **Tier 4 -> Tier 5:** A technically specific post turns out to be based on an old version or misconfigured setup
- **Any tier -> -1:** Source has a clear conflict of interest (vendor reviewing their own product, competitor disparaging a rival)

---

## Tagging Convention

Every finding recorded in the knowledge base or research sources should include a tier tag:

```
(Tier X, [source description], [date])
```

Examples:
- `(Tier 1, official docs v2.3 changelog, 2026-02-15)`
- `(Tier 2, [Creator Name] deployment video, 2026-01-28)`
- `(Tier 3, GitHub issue #1234, 2026-02-10)`
- `(Tier 4, r/selfhosted u/[username], 2026-02-08)`
- `(Tier 5, general Reddit sentiment across 5+ threads, 2026-02)`

---

## Self-Tests

Binary yes/no checks to run after assigning credibility tiers to research sources. See `binary-self-tests.md` for the full framework and test design rules.

**Tier Assignment Discipline:**
- Pick any source in this research. Can you answer the four classification questions (official? track record? reproducible? technically specific?) and arrive at the assigned tier in under 10 seconds? (If no: the tier assignment is not well-reasoned or the questions were not applied.)
- Find any source assigned Tier 1. Is it actually published by the tool's maintainers on their official domain? (If no: it is not Tier 1. Reassign.)

**Corroboration Discipline:**
- Pick any finding supported solely by a Tier 4 or Tier 5 source. Is it also validated by a Tier 1-3 source, or explicitly marked as unvalidated? (If neither: the finding is under-sourced. Either find corroboration or flag the confidence gap.)
- Find the highest-confidence claim in the research. Is it backed by at least one Tier 1-2 source? (If no: the most confident claim has the weakest sourcing. Fix the mismatch.)

**Contradiction Discipline:**
- Find a point where a higher-tier source and a lower-tier source disagree. Is the contradiction flagged as an intelligence insight with both perspectives documented? (If no: flag it. Contradictions between tiers are signals, not errors.)
- Has any source been upgraded or downgraded from its initial tier assignment? If yes, is the reason documented? (If no reason: add one. Tier shifts without rationale are arbitrary.)

**Staleness Check:**
- Pick any Tier 1 source. Is the documentation version or date noted in the tag? (If no: Tier 1 sources without dates cannot be checked for staleness. Add the date.)

---

## Related Documents

- `dual-source-intelligence.md` — The research methodology that produces tiered findings
- `editorial-standards.md` — How tiered findings are documented and cited
- `research-cadence-template.md` — How often to refresh findings at each tier
- `binary-self-tests.md` — The full binary self-test framework and pipeline-stage tests
