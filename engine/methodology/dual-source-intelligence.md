# Dual-Source Intelligence Methodology

**Created:** 2026-03-03
**Purpose:** Reusable research methodology that combines official documentation with community intelligence to produce higher-fidelity findings than either source alone.

---

## Why Dual-Source

Documentation tells you how something is supposed to work. Community intelligence tells you how it actually works. The gap between those two is where the most valuable findings live — undocumented gotchas, real-world performance data, security concerns the vendor hasn't acknowledged, and deployment patterns that only emerge from aggregate experience.

Neither source is sufficient alone:
- **Documentation alone** can be outdated, incomplete, or aspirational (describing planned features as current).
- **Community alone** can be anecdotal, biased by sample size, or colored by operator error mistaken for platform bugs.

The discipline is simple: every research question gets both sources. Contradictions between them are not failures — they are intelligence insights.

---

## The Two Sources

### Source 1: Official Documentation (Context7 MCP)

Official truth. The baseline for every investigation.

**What it provides:**
- API references, configuration schemas, changelogs
- Architectural documentation and design decisions
- Version-specific behavior and migration guides
- Security advisories and known issues (when disclosed)

**How to use Context7:**
1. `resolve-library-id` — Identify the documentation library for the tool under investigation
2. `query-docs` — Pull specific sections relevant to your research question
3. Always note the documentation version/date — official docs can lag behind releases

**Strengths:** Authoritative, structured, verifiable against source code
**Weaknesses:** Can be outdated, may omit known issues, sometimes aspirational rather than descriptive

### Source 2: Community Intelligence (Bright Data MCP)

Community truth + expert amplification.

**What it provides:**
- Real-world deployment experiences (Reddit, Hacker News, developer blogs)
- Security research and vulnerability analysis (independent researchers, security firms)
- Expert knowledge from established creators with proven deployments
- Cautionary signals — bad experiences, abandoned approaches, migration stories
- Undocumented tricks, configurations, and workarounds

**How to use Bright Data:**
1. `search_engine` — Targeted queries with site filters and date ranges for focused sweeps
2. `search_engine_batch` — Multiple queries in parallel for landscape scans
3. `scrape_as_markdown` — Full extraction when search results identify high-value sources (Tier 2-3)

**Key community sources (adapt per topic):**
- Reddit: r/selfhosted, r/homelab, r/LocalLLaMA, r/sysadmin, topic-specific subreddits
- Hacker News: Technical discussion, security analysis, expert commentary
- GitHub: Issues, PRs, discussions — especially with reproducible details
- YouTube: Established creators with deployment track records
- Developer blogs: Long-form analysis from practitioners

**Strengths:** Real-world validation, surfaces issues docs don't cover, captures ecosystem sentiment
**Weaknesses:** Signal-to-noise ratio varies, anecdotal evidence can mislead, recency bias

---

## Three Operating Modes

### Mode 1: Documentation Pull (Context7-led)

**When to use:** You need to understand how something officially works — a configuration option, an API endpoint, an architectural decision.

**Process:**
1. Query Context7 for the relevant documentation section
2. Note any gaps, ambiguities, or version-specific caveats
3. Use Bright Data to supplement: "What do the docs not say? What gotchas do real users report?"

**Example:** Researching how a tool handles authentication tokens.
- Context7: Pull the auth configuration reference. Note supported token types, rotation policies, default settings.
- Bright Data: Search for "[tool] authentication problems site:reddit.com" and "[tool] auth token security site:github.com/[org]/[repo]/issues" to surface real-world issues.

### Mode 2: Landscape Scan (Bright Data-led)

**When to use:** You need to map a competitive field, gauge community sentiment, or understand market positioning.

**Process:**
1. Bright Data batch search across community sources — Reddit discussions, blog comparisons, Hacker News threads
2. Identify claims that need technical validation
3. Use Context7 to verify specific technical claims from community sources against official documentation

**Example:** Evaluating whether Tool A or Tool B is better suited for a deployment scenario.
- Bright Data: "[Tool A] vs [Tool B] 2026", "[Tool A] problems site:reddit.com", "[Tool B] deployment experience"
- Context7: Validate specific claims about features, limitations, or architecture from community discussions

### Mode 3: Reality Check & Amplification (Both, cross-validating)

**When to use:** Specific questions where you need both official and community perspectives. The most common mode for deployment-critical decisions.

**Process:**
1. Query both sources in parallel on the same question
2. Compare findings — where do they agree? Where do they contradict?
3. Contradictions are flagged as intelligence insights, not discarded

**Example:** Assessing the security posture of a tool's plugin/extension ecosystem.
- Context7: What does the official documentation say about plugin vetting, sandboxing, permissions?
- Bright Data: What do security researchers, community audits, and real users report about plugin safety?
- Cross-validation: If docs say "all plugins are reviewed" but community reports finding malicious ones, that contradiction is a critical finding.

---

## Cross-Validation Discipline

The highest-value findings often emerge from contradictions between sources. When official documentation and community intelligence disagree, the response is NOT to pick one — it is to flag the contradiction as an intelligence insight.

**Contradiction handling:**
1. Document both claims with their sources and credibility tiers (see `credibility-tiers.md`)
2. Note the nature of the contradiction: outdated docs? Undisclosed issue? Community misunderstanding?
3. If possible, determine which is more current/accurate through additional research
4. Record the contradiction in the intelligence log — even if resolved, the fact that it existed is valuable

**Examples of productive contradictions:**
- Docs say "sandboxed by default" but community reports unsandboxed execution on certain OS versions
- Docs list a feature as available but GitHub issues show it's broken in the latest release
- Community recommends a configuration that docs explicitly warn against — who's right, and why?

---

## The Rule

Documentation is the skeleton. Community intelligence puts muscle, scars, and street smarts on it. **Neither stands alone.** Every research cycle uses both sources.

This is not a suggestion — it is a methodology discipline. Skipping community validation means missing real-world failures. Skipping documentation means building on rumor instead of specification.

---

## Worked Example

For a worked example of this methodology applied to a real tool evaluation, see `outputs/openclaw-sean/` — Output #1 of the curriculum engine, which used dual-source intelligence across 130+ sources to evaluate and plan a deployment.

---

## Self-Tests

Binary yes/no checks to run after any research cycle. Use quick tests at scan depth, thorough tests at deep-dive depth. See `binary-self-tests.md` for the full framework and test design rules.

**Source Discipline:**
- Pick any claim in this research. Can you name the source and its credibility tier in under 5 seconds? (If no: the claim needs a source tag.)
- Find the strongest claim — the one most likely to drive a decision. Is there a second, independent source that validates it? (If no: the claim is under-sourced for its weight.)

**Dual-Source Discipline:**
- Is there at least one finding backed by an official source AND at least one backed by a community source? (If no: you used one channel, not two.)
- Pick the finding most critical to the operator's decision. Did it get both a Context7 pull AND a Bright Data sweep? (If no: the most important finding got the least rigorous treatment.)

**Honest Assessment:**
- Find the most negative finding in this research. Is it stated as plainly and specifically as the most positive one? (If no: you softened the bad news.)
- Does this research surface at least one finding that complicates or contradicts the starting hypothesis? (If no: either the hypothesis was perfectly right — rare — or you stopped looking when you found confirmation.)

**Contradiction Handling:**
- Find a point where official docs and community sources disagree. Is the contradiction flagged explicitly with both perspectives? (If no contradiction exists: is the absence noted, or did you skip the cross-validation?)

---

## Related Documents

- `credibility-tiers.md` — How to weight sources from each channel
- `research-cadence-template.md` — How often to run each type of research sweep
- `editorial-standards.md` — Standards for how findings are documented and cited
- `depth-assessment.md` — How to classify work depth before starting any pipeline stage
- `binary-self-tests.md` — The full binary self-test framework and pipeline-stage tests
