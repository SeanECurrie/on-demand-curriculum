# Editorial Standards

**Created:** 2026-03-03
**Purpose:** Standards governing how research findings, deployment guidance, and knowledge base entries are written, cited, and maintained. These standards ensure consistency, honesty, and lasting value across all engine outputs.

---

## Core Principles

These six principles govern all written output. They are not suggestions — they are the editorial DNA of the engine.

### 1. Evidence Requirement

Every claim needs a source and a credibility tier.

- If you can't cite it, don't claim it. Assertions without sources are opinions, not findings.
- Every finding gets tagged: `(Tier X, [source description], [date])` — see `credibility-tiers.md` for the tier system.
- "I believe" or "it seems like" are red flags. Replace with "Source X reports..." or "No evidence found for..."
- When evidence is ambiguous, say so explicitly. "Conflicting reports: Tier 1 docs say X, Tier 3 GitHub issues report Y" is more honest and more useful than picking one.

### 2. Honest Assessment

Never oversell. Never downplay. Note residual risk.

- If a tool has problems, say so plainly. Do not soften findings to avoid seeming negative.
- If a tool is impressive, say so — but note the caveats. "Impressive adoption rate AND significant unresolved security concerns" is honest. Picking one framing is not.
- **Residual risk is always noted.** After hardening, after configuration, after best practices — what risk remains? Every deployment has residual risk. Pretending otherwise is malpractice.
- When a finding is uncertain, quantify the uncertainty: "3 of 5 sources report this issue" is more useful than "some users report issues."

### 3. Transferable Framing

Always distinguish universal principles from tool-specific details.

- When explaining any configuration, note what's universally applicable vs. what's specific to the tool under evaluation.
- The transferable principle is the primary deliverable. The tool-specific command is the implementation detail.
- Frame security concepts in universal terms first: "This is how authentication tokens work for any agent gateway" is more valuable than "Here's the [Tool X] auth config."
- When a concept transfers, say so explicitly: "This principle (least-privilege service accounts) applies to any service on any platform, not just [Tool X]."
- When something is tool-specific, mark it: "This configuration syntax is specific to [Tool X] — other tools achieve the same goal differently."

### 4. Community Validation

Documentation alone is insufficient.

- Every research question gets both official documentation AND community intelligence (see `dual-source-intelligence.md`).
- When docs and community agree, confidence is high. When they disagree, the contradiction is an intelligence insight — document both perspectives.
- Community validation is especially critical for: security claims, performance benchmarks, "it just works" assertions, and anything involving edge cases (specific OS versions, hardware configurations, network setups).
- Do not dismiss community reports because they contradict official documentation. Investigate the contradiction.

### 5. Security as a Lens

Security is evaluated on every decision, not treated as a separate phase.

- Every configuration choice, plugin/extension enablement, and integration gets evaluated for security implications.
- "Is this secure?" is not a phase you reach — it's a question asked at every step.
- Security implications are noted inline, where the decision is made, not deferred to a security appendix that may never be read.
- When a configuration has security implications that aren't obvious, call them out explicitly: "This setting also affects [security consideration] — see Understanding section."

### 6. Living Documentation

Mark outdated content as outdated. Never delete.

- All knowledge base entries are date-stamped.
- When content is superseded, mark it: `[OUTDATED as of YYYY-MM-DD — superseded by [reference]]`
- Never delete outdated content. The history has value. Knowing what used to be true and changed is intelligence.
- No "final/" or "current/" directories — use date-stamped versioning.
- Git commits at every meaningful checkpoint.

---

## Writing Standards

### Tone and Voice

- Write like a knowledgeable colleague, not a manual or a marketing page.
- Explain the "why" behind each step, not just the "what."
- Avoid jargon without definition. If a term might be unfamiliar to the target operator, explain it on first use.
- Be direct. "This is insecure" is better than "This could potentially present security considerations."
- Respect the operator's intelligence. Do not over-explain obvious steps. Do over-explain non-obvious implications.

### Structure

- **Understanding sections** come before command sections when the concept is educational. The understanding IS the deliverable — the running configuration is the side effect.
- **Commands are copy-pasteable.** Every command includes expected output so the operator knows if it worked.
- **Decision rationale is inline.** Do not make the operator search for why a decision was made. Put the reasoning next to the decision.
- **Cross-references are explicit.** "See [document name]" with enough context that the operator knows whether they need to read it now or can defer.

### Formatting Conventions

- Dates in `YYYY-MM-DD` format, always
- Credibility tier tags on all sourced claims: `(Tier X, [source], [date])`
- Outdated markers: `[OUTDATED as of YYYY-MM-DD]`
- Tool-specific content marked: `[Tool-specific: [Tool X]]` or "This is specific to [Tool X]"
- Transferable content marked: `[Transferable]` or "This principle applies to any..."

---

## Red Flags

Watch for these patterns in your own writing. If you catch yourself doing any of these, stop and correct:

1. **Agreeing without evidence.** If you're affirming a hypothesis without citing a source, you're guessing, not researching.
2. **Treating a learning deployment as production.** Frame accordingly. Hardening is educational as much as operational.
3. **Going deep on tool-specific minutiae without noting transferability.** If a concept transfers, say so. If it doesn't, note that it's tool-specific.
4. **Softening bad findings.** If the evidence says something is insecure, unreliable, or problematic, say so plainly.
5. **Claiming certainty without sufficient evidence.** "Based on 2 Reddit posts" is not "the community consensus is." Be precise about your evidence base.
6. **Writing for completeness instead of value.** Not every finding deserves a full write-up. If it doesn't inform a decision, it's noise.

---

## Operator Collaboration Standards

These standards govern how the engine collaborates with operators (the humans commissioning outputs):

1. **Research before agreeing** with any hypothesis the operator proposes. Do not agree without evidence.
2. **Push back when evidence contradicts** the operator's assumptions. Bring data, not diplomacy.
3. **Ask clarifying questions about purpose and intent**, not just technical details. If a direction seems misaligned with the stated goals, say so.
4. **Challenge the "why"** as much as the "what." Understanding the operator's actual intent prevents wasted work.
5. **Distinguish what the operator asked for** from what the operator needs. They may not be the same thing. Surface the gap respectfully.

---

## Quality Checklist

Before publishing any engine output, verify:

- [ ] Every claim has a source and credibility tier
- [ ] Residual risk is noted (not just "what we hardened" but "what risk remains")
- [ ] Tool-specific content is marked as such
- [ ] Transferable principles are called out explicitly
- [ ] Understanding sections explain "why," not just "what"
- [ ] Outdated content (if any inherited) is marked, not deleted
- [ ] Commands are copy-pasteable with expected output documented
- [ ] Security implications are noted inline at the point of decision
- [ ] The document makes sense to someone unfamiliar with the specific tool

---

## Related Documents

- `credibility-tiers.md` — The tier system referenced in the evidence requirement
- `dual-source-intelligence.md` — The research methodology that produces findings
- `three-tier-hardening.md` — How deployment steps are classified
- `research-cadence-template.md` — How research freshness is maintained
