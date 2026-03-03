# Findings Pattern Library

**Created:** 2026-03-03
**Purpose:** A concept-to-structure mapping table for research output. When the engine synthesizes findings, it selects from validated structures rather than inventing format each time.

---

## Why Patterns

LLMs default to prose paragraphs for everything. A discovery, a contradiction, and a risk assessment all come out as "we found that..." paragraphs. The result is a wall of text where every finding looks the same regardless of what it actually IS. Patterns impose the right SHAPE on the content — making it scannable, comparable, and maintainable across the knowledge base.

This is directly adapted from Cole Medin's concept-to-pattern mapping in his Excalidraw diagram skill: "If the concept spawns multiple outputs, use fan-out. If it combines inputs, use convergence." Same principle, applied to research findings instead of visual diagrams. The concept type determines the structure — not the engine's mood or the default paragraph shape of whichever LLM is running.

Patterns are advisory, not mandatory. The escape hatch exists for a reason. But if a finding fits a pattern and you write it as prose anyway, you are making it harder to scan, harder to compare across the knowledge base, and harder to maintain.

---

## The Pattern Table

When synthesizing a finding, identify what TYPE of finding it is and select the matching structure:

| If the finding is... | Use this pattern | Example from Output #1 |
|---------------------|------------------|----------------------|
| A contradiction between sources | **Contradiction Insight** | Docs described plugin ecosystem as "reviewed" while Koi Security found 12% malicious rate |
| A validated hypothesis | **Validation Entry** | Mac Mini 24/7 reliability confirmed by 42 independent sources |
| A new discovery | **Discovery Entry** | macOS Keychain access dialogs reported — ClawdBot may request Keychain access |
| A risk assessment | **Risk Entry** | ClawHub supply chain — 20% of skills confirmed malicious |
| A tool/option comparison | **Comparison Matrix** | OpenClaw vs CrewAI vs LangGraph — fundamentally different categories |
| A resolved question | **Resolution Entry** | Model routing is failover-based, not intelligent task-based routing |
| A recommendation | **Recommendation Entry** | Zero ClawHub policy — build custom Markdown skills only |

---

## Pattern Structures

Each pattern below has required fields (must always be filled) and optional fields (fill at deep-dive depth, skip at scan depth). Every filled field must include a source and credibility tier per `editorial-standards.md`.

---

### Contradiction Insight

**When to use:** Sources disagree on a factual claim relevant to a decision. This is the engine's highest-value finding type — contradictions between official docs and community reality are where the most actionable intelligence lives.

**Template:**

```
**CONTRADICTION:** [Brief title]

- **Claim A:** [What Source A says] (Tier X, [source], [date])
- **Claim B:** [What Source B says] (Tier Y, [source], [date])
- **Nature of contradiction:** [outdated docs? undisclosed issue? community misunderstanding? vendor understatement?]
- **Current assessment:** [Which claim appears more reliable and why]
- **Intelligence value:** [What this contradiction tells us beyond the specific claims]
- **Action required:** [What to do about it — verify, monitor, mitigate, or accept] (optional)
```

**Required fields:** Claim A, Claim B, Nature of contradiction, Current assessment
**Optional fields:** Intelligence value, Action required

**Output #1 example:** Official docs described the ClawHub plugin ecosystem as "reviewed" while the Koi Security audit found 341 of 2,857 skills (12%) were malicious, later escalated to 824+ (~20%). Nature: vendor understatement of supply chain risk. Current assessment: Koi Security's methodology (systematic scanning with reproducible results) overrides vendor marketing language. Intelligence value: community security audits provide ground truth that vendor documentation does not — this pattern transfers to any marketplace/plugin ecosystem evaluation.

---

### Validation Entry

**When to use:** A hypothesis — whether from the operator, from initial research, or from a community claim — has been tested against evidence and confirmed.

**Template:**

```
**VALIDATED:** [Brief title]

- **Original hypothesis:** [What was proposed or assumed]
- **Evidence chain:** [Source 1 + tier], [Source 2 + tier], ... [Source N + tier]
- **Confidence level:** [High/Medium/Low — based on source count, tier quality, and agreement]
- **Caveats:** [What could invalidate this — conditions where the validation breaks] (optional)
- **Transferable principle:** [Does this validate something that applies beyond this specific tool?] (optional)
```

**Required fields:** Original hypothesis, Evidence chain, Confidence level
**Optional fields:** Caveats, Transferable principle

**Output #1 example:** VALIDATED: Mac Mini 24/7 reliability is extensively proven. Original hypothesis: Mac Mini M4 can serve as a reliable always-on server for AI agent hosting. Evidence chain: Reddit long-term users (Tier 3-4), Medium deployment guides (Tier 3), Stack Exchange measurements (Tier 3), Apple hardware design documentation (Tier 1) — 42 sources total. Confidence level: High. Caveats: Apple does not officially market the Mac Mini as a server; warranty coverage for 24/7 operation is unverified. Transferable principle: consumer hardware reliability for light server workloads is a general pattern validated by the homelab community across multiple platforms.

---

### Discovery Entry

**When to use:** Research surfaced something that was not part of the original hypothesis or expected findings. Discoveries are the engine's way of capturing the unexpected — things you did not know to ask about.

**Template:**

```
**DISCOVERY:** [Brief title]

- **What was found:** [The finding, stated plainly]
- **Source:** [Source + tier, date]
- **Implications:** [What this means for the current output or the engine's knowledge]
- **Confidence:** [How confident are we? Based on source tier and corroboration]
- **Action required:** [Investigate further? Change approach? Monitor?] (optional)
- **Transferable?:** [Does this discovery apply beyond this specific tool?] (optional)
```

**Required fields:** What was found, Source, Implications, Confidence
**Optional fields:** Action required, Transferable?

**Output #1 example:** DISCOVERY: Skills are NOT code — they are Markdown instructions (SKILL.md with YAML frontmatter). The actual security boundary is the tool policy and exec-approvals, not the skill itself. Source: docs.openclaw.ai/tools/skills (Tier 1). Implications: A malicious skill can instruct the agent to do anything the enabled tools allow, but it cannot bypass tool restrictions. This means a tight tool policy IS the skill security boundary. Confidence: High (official documentation, verified against source code). Transferable?: Yes — the principle that "instructions are not execution boundaries" applies to any agent system where natural language drives tool use.

---

### Risk Entry

**When to use:** A finding describes a threat, vulnerability, or negative outcome that needs to be assessed for likelihood and impact. Risk entries are the engine's way of enforcing DNA principle #7 (honest assessment of residual risk).

**Template:**

```
**RISK:** [Brief title]

- **Threat:** [What could go wrong, stated specifically]
- **Likelihood:** [High/Medium/Low — with evidence for the rating]
- **Impact:** [What happens if this threat materializes]
- **Current mitigations:** [What reduces the risk — already in place or planned]
- **Residual risk:** [What risk remains AFTER mitigations — this field is never "none"]
- **Source chain:** [Sources + tiers that inform this assessment]
- **Transferable?:** [Does this risk category apply beyond this specific tool?] (optional)
```

**Required fields:** Threat, Likelihood, Impact, Current mitigations, Residual risk, Source chain
**Optional fields:** Transferable?

**Output #1 example:** RISK: ClawHub supply chain — actively compromised plugin ecosystem. Threat: Installing any ClawHub skill risks credential theft, reverse shells, or macOS-targeted malware (AMOS payloads). Likelihood: High — 824+ confirmed malicious skills (~20% of registry), "ClawHavoc" coordinated campaign identified. Impact: Full credential exfiltration from ~/.clawdbot/.env, browser credentials via Keychain, SSH keys, cryptocurrency wallets. Current mitigations: Zero ClawHub installation policy, custom Markdown-only skills, tight tool policy as execution boundary. Residual risk: An operator who forgets the policy and installs a single ClawHub skill bypasses all mitigations. No automated enforcement mechanism exists — this is a discipline control, not a technical control. Source chain: Koi Security audit (Tier 2), eSecurity Planet (Tier 2), CyberSecurityNews (Tier 3), GBHackers (Tier 3), 1Password blog (Tier 2).

---

### Comparison Matrix

**When to use:** The research evaluates multiple tools, options, or approaches against each other. Comparisons that live in prose paragraphs are nearly impossible to scan. A matrix forces structured evaluation.

**Template:**

```
**COMPARISON:** [What is being compared]

| Criteria | Option A | Option B | Option C | ... |
|----------|----------|----------|----------|-----|
| [Criterion 1] | [Evidence-backed assessment] | [Evidence-backed assessment] | ... | |
| [Criterion 2] | ... | ... | ... | |
| ... | | | | |

- **Key differentiator:** [The criterion that most affects the decision]
- **Verdict:** [Which option for which situation, with reasoning]
- **Source chain:** [Sources + tiers for the comparison data]
- **Transferable?:** [Does this comparison framework apply to similar evaluations?] (optional)
```

**Required fields:** Comparison table (criteria + options + evidence), Key differentiator, Verdict, Source chain
**Optional fields:** Transferable?

**Output #1 example:** COMPARISON: OpenClaw vs CrewAI vs LangGraph vs n8n.

| Criteria | OpenClaw | CrewAI | LangGraph | n8n |
|----------|----------|--------|-----------|-----|
| Category | Ready-to-deploy agent product | Developer framework | Developer framework | Workflow automation |
| Deployment complexity | Low (install + configure) | High (code required) | High (code required) | Medium (visual builder) |
| Integration breadth | Limited (growing skill ecosystem) | Via code | Via code | 1,200+ native connectors |
| Target user | End users, power users | Developers | Developers | Ops/automation teams |

Key differentiator: OpenClaw is a fundamentally different category — a packaged product, not a framework. Comparing it to CrewAI/LangGraph is like comparing a car to an engine block. Verdict: OpenClaw for agent capability, n8n for deterministic workflows, use both. Source chain: CNBC (Tier 2), Galileo.ai (Tier 2), Langfuse (Tier 2), community discussions (Tier 4) — 16 sources total. Transferable?: Yes — the "product vs. framework" distinction is a recurring pattern in tool evaluation that prevents false comparisons.

---

### Resolution Entry

**When to use:** A specific question from the intake, from the operator, or from research has been answered definitively. Resolutions close open questions and prevent revisiting settled issues.

**Template:**

```
**RESOLVED:** [The question, stated as a question]

- **Answer:** [The answer, stated plainly]
- **Evidence chain:** [Sources + tiers that support the answer]
- **Remaining uncertainty:** [What's still unclear, if anything — "none" is acceptable here] (optional)
- **Implications for output:** [How this resolution changes the approach] (optional)
```

**Required fields:** Answer, Evidence chain
**Optional fields:** Remaining uncertainty, Implications for output

**Output #1 example:** RESOLVED: Is model routing intelligent/automatic? Answer: No. Model routing uses a primary + fallback chain (failover on API errors), NOT task-based routing. The community's "mix expensive and cheap" pattern is implemented via per-agent model assignment with routing bindings, not automatic selection. Evidence chain: docs.openclaw.ai/gateway/configuration (Tier 1), eastondev.com deployment guide (Tier 2). Remaining uncertainty: None — this is architectural, not a feature in development. Implications for output: Deployment strategy changes from "configure a smart model selector" to "configure agent routing rules with explicit model assignments."

---

### Recommendation Entry

**When to use:** Research has produced enough evidence to recommend a specific course of action. Recommendations must be backed by evidence, not preference — per DNA principle #1 (research before agreeing).

**Template:**

```
**RECOMMENDATION:** [What to do, stated as an action]

- **Why:** [Evidence that supports this recommendation — sources + tiers]
- **What it prevents:** [The specific negative outcome this avoids]
- **Trade-offs:** [What you give up by following this recommendation]
- **Confidence level:** [High/Medium/Low — based on evidence quality]
- **Alternative considered:** [What else was evaluated and why it was rejected] (optional)
- **Transferable?:** [Does this recommendation apply beyond this specific tool?] (optional)
```

**Required fields:** Why, What it prevents, Trade-offs, Confidence level
**Optional fields:** Alternative considered, Transferable?

**Output #1 example:** RECOMMENDATION: Disable Elevated mode entirely. Use per-agent routing instead — create a "deep work" agent with sandbox off for Sean's direct messages, all other agents fully sandboxed. Why: Elevated mode is a dangerous escape hatch that grants unrestricted tool access. Per-agent routing achieves the same capability through architecture (routing bindings) rather than a global permission escalation. Source: docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated (Tier 1). What it prevents: Accidental or exploited elevation giving an untrusted agent full system access. Trade-offs: Slightly more complex routing configuration; requires maintaining per-agent model assignments. Confidence level: High — official docs describe the mechanism; the architectural alternative is well-documented. Transferable?: Yes — "achieve capability through architecture rather than escape hatches" is a universal security principle.

---

## The Escape Hatch

If a finding genuinely does not fit any of the seven patterns:

1. **Write it as structured prose** — not a wall of text. Use headers, bullets, and source tags. The finding still needs structure even without a formal pattern.
2. **Tag it:** `[No standard pattern — structured prose]` so it is visible during knowledge base maintenance.
3. **After writing, ask:** "Should this become a new pattern?" If the same shape appears in two or more future findings, add it to the pattern table.

The escape hatch exists because research does not always fit clean categories, and forcing findings into templates is worse than no template. But if you are using the escape hatch more than once per research cycle, either the patterns need updating or the research needs reframing.

---

## Depth Interaction

Depth assessment (see `depth-assessment.md`) determines how thoroughly each pattern is filled:

- **Scan depth:** Use the pattern structure but skip optional fields. A scan-depth Discovery Entry might omit "Action required?" and "Transferable?" when the answers are not yet clear. The goal is to capture the finding in the right shape, not to exhaustively document it.
- **Deep-dive depth:** Fill every field. No optional fields at deep-dive depth. Every claim gets a source and tier tag. Residual risk is named specifically. Transferable principles are called out explicitly.

**The pattern itself does not change between depths.** What changes is the completeness of the fill. A scan-depth Risk Entry and a deep-dive Risk Entry use the same template — the scan version just has fewer fields populated.

---

## Verification Against Output #1

To confirm these patterns work against real findings, five entries from the Output #1 intelligence log were tested:

**1. "Tim warns most ClawdBot guides have massive security vulnerabilities" (2026-02-10)**
- **Pattern:** Validation Entry — this was an initial hypothesis (external expert's warning) that was subsequently validated and escalated by 48+ sources during the security deep-dive.
- **Fit:** Clean. The evidence chain, confidence level, and caveats fields capture this naturally. The escalation ("Tim's warnings UNDERSTATED the risk") would go in the caveats field or spawn a follow-up Discovery Entry.

**2. "CVE-2026-25253 — 1-click RCE via auth token exfiltration" (2026-02-11)**
- **Pattern:** Risk Entry — a specific vulnerability with likelihood, impact, and mitigation requirements.
- **Fit:** Clean. All required Risk Entry fields apply directly. The CVE data maps to Threat + Likelihood + Impact, the "patch to v2026.2.19+" maps to Current mitigations, and the residual risk (unpatched instances remain vulnerable) is captured.

**3. "RESOLVED: Model routing is NOT intelligent/automatic" (2026-02-11)**
- **Pattern:** Resolution Entry — a specific question was answered definitively.
- **Fit:** Clean. Already used as the example above. The intelligence log entry maps directly to the Resolution Entry template with no forcing.

**4. "PATTERN: Source-to-derivative sync is a general problem" (2026-02-22)**
- **Pattern:** Discovery Entry — this was an unexpected finding about a general problem surfaced during project work.
- **Fit:** Adequate. The "Transferable?" field captures the cross-project nature of this finding. However, this entry is more of a process observation than a research finding. It fits the Discovery pattern but could also work as structured prose via the escape hatch. Verdict: Discovery Entry is the better fit because the finding has clear implications and a source.

**5. "CRITICAL GOVERNANCE SHIFT: Creator joined OpenAI" (2026-02-22)**
- **Pattern:** Discovery Entry — an unexpected development with implications for the deployment decision.
- **Fit:** Clean. What was found, source, implications (less bus-factor risk but watch for roadmap changes), and confidence all map directly. The "Action required" optional field captures the monitoring need. This is NOT a Risk Entry despite having risk implications — the finding itself is a factual discovery, not a threat assessment. A follow-up Risk Entry could assess the governance change's impact.

**Verification result:** All five entries fit existing patterns. No escape hatch needed. The patterns cover the range of finding types observed in Output #1's intelligence log.

---

## Self-Tests

Binary yes/no checks to run after structuring findings using patterns. See `binary-self-tests.md` for the full framework and test design rules.

**Pattern Selection:**
- Pick any finding you just wrote. Can you name which of the 7 patterns it uses (or confirm it uses the escape hatch) in under 5 seconds? (If no: the finding's structure is ambiguous. Reclassify it.)
- Read the finding without its pattern label. Is the structure visually distinct from a prose paragraph? (If no: the pattern was not applied — it was just labeled. Restructure using the template fields.)

**Field Discipline:**
- Pick any required field in the finding. Is it filled with a sourced claim (not a placeholder or vague statement)? (If no: fill it or explain why the data is unavailable.)
- If this is deep-dive depth, are ALL fields (required and optional) populated? (If no: deep-dive means every field. Fill the missing ones.)

**Value Check:**
- Read the finding in isolation. Does it inform a decision? (If no: consider whether this finding should exist at all — DNA principle: write for value, not completeness.)
- Does the finding duplicate information already captured in another finding? (If yes: merge or cross-reference. Two findings saying the same thing is noise.)

---

## Related Documents

- `editorial-standards.md` — Standards governing how findings are written and cited; patterns enforce these standards structurally
- `dual-source-intelligence.md` — The research methodology that produces findings; patterns structure the output of dual-source research
- `credibility-tiers.md` — Every pattern field that contains a claim must include a tier tag; the tier system is the evidence backbone
- `depth-assessment.md` — Determines whether optional fields are skipped (scan) or required (deep-dive)
- `binary-self-tests.md` — The full binary self-test framework; pattern-specific tests are in this document's Self-Tests section
