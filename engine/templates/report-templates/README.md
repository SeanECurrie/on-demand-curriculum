# 5-Report Evaluation Framework

**Purpose:** Every engine output produces these five reports during the synthesis stage. Together they form a comprehensive evaluation that turns raw research into deployment decisions. The reports build on each other — landscape informs architecture, architecture informs feasibility, all three inform security, and open questions capture everything the first four couldn't resolve.

**Created by:** Engine Task 7 (2026-03-03)
**Reference implementation:** `outputs/openclaw-sean/research/reports/`

---

## Report Sequence

The reports are numbered in production order. Each report can reference findings from earlier reports. The sequence is not arbitrary — it reflects how understanding builds:

1. **Landscape** — What are the options? Is this the right tool?
2. **Architecture** — How does the chosen tool actually work?
3. **Feasibility** — Can it run on the operator's hardware/platform?
4. **Security** — What are the risks and how do we mitigate them?
5. **Open Questions** — What couldn't we resolve through research alone?

---

## Report 1: Landscape Report

**Filename:** `01-landscape-report.md`

**When to produce:** First. Before committing to any tool, map the competitive field. This report answers: "Is this the right category and the right tool within that category?"

**Questions it answers:**
- What category does the tool belong to? (Not always obvious — e.g., OpenClaw is a product, not a framework)
- What are the real competitors? (Same category, not just "also AI")
- What are the tool's differentiators?
- What's the community momentum? (Stars, adoption, trend direction)
- What complementary tools should be paired with it?
- Are there red flags in the competitive landscape? (Abandoned projects, licensing concerns, vendor lock-in)

**Required sections:**
1. Key Takeaway — 1-2 paragraph verdict
2. Tool's Position — Category placement, what makes it different
3. Comparison Matrix — Feature table comparing real competitors
4. Deployment/Platform Compatibility — Filtered for operator's hardware
5. Complementary Stack — What pairs well with the tool
6. Risks and Concerns — Community-surfaced issues
7. Verdict — GO / NO-GO / CONDITIONAL with rationale

**Minimum source count:** 10+ across Context7 and Bright Data

**Header format:**
```markdown
# Landscape Report: [TOOL_NAME]

**Date:** [DATE]
**Sources:** [count] sources across Context7 + Bright Data ([source list])
**Report Type:** Landscape analysis
**Credibility:** Tier [range] sources
```

---

## Report 2: Architecture Report

**Filename:** `02-architecture-reference.md`

**When to produce:** After landscape confirms tool selection. This report answers: "How does this thing actually work under the hood?"

**Questions it answers:**
- What is the runtime architecture? (Components, data flow, process model)
- What is the configuration model? (Files, precedence, defaults)
- What is the data residency model? (What stays local, what goes to cloud)
- How does extensibility work? (Plugins, skills, integrations)
- Where does community experience contradict official documentation?
- What are the known rough edges? (Config duplication, undocumented behavior, "vibe-coded" areas)

**Required sections:**
1. Key Takeaway — 1-2 paragraph summary
2. Architecture Overview — Diagrams or structured descriptions of components
3. Configuration Model — Files, precedence, key settings
4. Data Flow — What data goes where (local vs. cloud, at rest vs. in transit)
5. Extensibility — How the tool is extended (plugins, skills, APIs)
6. Community Findings — What real users discovered that docs don't cover
7. Remaining Unknowns — What requires hands-on testing

**Minimum source count:** 15+ (official docs are critical here — Context7 is primary)

---

## Report 3: Feasibility Report

**Filename:** `03-feasibility-report.md`

**When to produce:** After architecture is understood. This report answers: "Can this tool run well on the operator's specific hardware and platform?"

**Questions it answers:**
- Does the tool support the operator's OS/architecture? (macOS/ARM, Linux/x86, Windows, etc.)
- Are there platform-specific gotchas? (Sleep behavior, headless operation, service management)
- Is the hardware sufficient? (RAM, CPU, storage, network)
- What does the community say about this platform? (Real deployment reports)
- What's the cost model? (Power, API costs, infrastructure)
- What are the alternatives the operator considered and why this is better/worse?

**Required sections:**
1. Verdict — GO / NO-GO / CONDITIONAL (lead with the answer)
2. Hardware Sufficiency — Is the operator's hardware enough?
3. Platform Compatibility — OS/architecture-specific findings
4. Platform-Specific Gotchas — Known issues for this platform
5. Community Validation — Real deployment reports from similar setups
6. Cost Analysis — Ongoing operational costs
7. Comparison to Alternatives — Why this setup vs. the obvious alternative (e.g., VPS)
8. Conditions and Prerequisites — What must be true for GO

**Minimum source count:** 15+ (community sources are critical here — Bright Data is primary)

---

## Report 4: Security Report

**Filename:** `04-security-evaluation.md`

**When to produce:** After feasibility confirms the platform. This report answers: "What are the risks and what must we harden before deployment?"

**Questions it answers:**
- What CVEs exist? (Patched and unpatched, with CVSS scores)
- What is the threat model? (Attack surfaces, likely threat actors, blast radius)
- What is the default security posture? (Permissive vs. restrictive out of the box)
- What does the supply chain look like? (Plugin ecosystem, dependency trust)
- What hardening is mandatory vs. optional?
- What do security researchers and vendors say? (Not just the project maintainers)
- What external security tools exist? (Auditing, scanning, hardening)

**Required sections:**
1. Security Verdict — GO / NO-GO / CONDITIONAL with mandatory hardening list
2. Critical Findings — CVEs and vulnerabilities that must be addressed before deployment
3. Threat Model — Attack surfaces, threat actors, blast radius
4. Default Security Posture — What's open/closed out of the box
5. Supply Chain Assessment — Plugin/extension ecosystem trust
6. Hardening Path — Three tiers: essential (non-negotiable), educational (learning value), operational polish (deferrable)
7. External Tools — Security scanners, audit tools, hardening utilities
8. Expert Opinions — What security researchers and vendors say
9. Open Security Questions — What requires hands-on testing

**Minimum source count:** 20+ (security requires the broadest source base — both Context7 and Bright Data heavily used)

---

## Report 5: Open Questions Report

**Filename:** `05-open-questions.md`

**When to produce:** Last. After all four reports are complete, this report collects every unresolved question, research gap, and deployment blocker. It answers: "What do we still not know, and what must be resolved before or during deployment?"

**Questions it answers:**
- What questions couldn't be resolved through documentation or community research?
- What requires hands-on testing to verify?
- What are the deployment blockers? (Must resolve before deploying)
- What needs ongoing monitoring? (Ecosystem changes, governance, security advisories)
- What gaps exist in the knowledge base?

**Required sections:**
1. Purpose — What this document is and where the questions come from
2. Critical (Must Resolve Before Deployment) — Blockers with resolution steps
3. Important (Resolve During Deployment) — Questions that hands-on testing will answer
4. Monitor (Ongoing) — Things to watch over time
5. Nice to Know — Low-priority questions for completeness

**For each question:**
- The question itself
- Why it matters
- What we know so far
- How to resolve it
- When to resolve it (before deployment / during deployment / ongoing)
- Source

**Minimum source count:** N/A (this report synthesizes from the other four — its sources are the other reports and the KB)

---

## Cross-Report Rules

1. **Every finding gets a source and credibility tier.** No unsourced claims in any report.
2. **Contradictions between docs and community are intelligence, not errors.** Flag them explicitly — they're often the most valuable findings.
3. **Reports accumulate.** If new information surfaces after a report is written, update the report and date-stamp the update. Never delete findings.
4. **The 5 reports are not the only research output.** They synthesize what's in the knowledge base. The KB has deeper detail; the reports have the verdicts.
5. **Verdicts are honest.** If the answer is NO-GO, say so. The engine's credibility depends on not sugar-coating findings.
