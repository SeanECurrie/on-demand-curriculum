# CONTEXT.md — OpenClaw for Jeff (Output #2)

**Last Updated:** 2026-03-03
**Staleness Threshold:** 5 days

## Output Purpose

Tailored interactive walkthrough for Jeff (Denver real estate agent, Hatch brand owner) to deploy OpenClaw on a dedicated machine. Primary use case: social media management (Instagram). Educational focus on understanding what OpenClaw is, why dedicated hardware matters, security basics, and prompting fundamentals.

**Post-delivery update (2026-03-03):** Jeff confirmed: (1) machine will be dedicated (not shared with personal use), (2) pivoting from MacBook Air to Mac Mini M4. Section 2b added to walkthrough presenting hardware choices and recommendation. Sections 3+ still reference MacBook Air — deferred update until Jeff confirms purchase.

## Current Status

- **Phase:** Complete + post-delivery iteration (Section 2b)
- **Pipeline stage:** All phases executed. Section 2b added via full pipeline: depth assessment → research → findings patterns → anti-pattern check → section construction (Phase A-D) → self-tests → render-validate
- **Depth assessment:** Deep-dive (multi-stage pipeline, interactive HTML output >500 lines, multiple research reports)
- **Deployment target:** Mac Mini M4 recommended (24GB/512GB, $999). MacBook Air remains viable alternative. Jeff confirmed dedicated-use only.
- **LLM:** Claude (subscription)
- **Container runtime:** OrbStack (recommended over Docker Desktop)

## What This Output Produces

### Research (Complete)
- 80+ sources across Tiers 1-5, tracked in `research/sources.md`
- 7 knowledge base buckets populated (landscape, architecture, security, deployment, skills, community, operations)
- 5 synthesis reports: landscape (abbreviated), architecture (abbreviated), feasibility (full), security (full), open questions
- 25+ strategic insights in intelligence log

### Walkthrough (Complete)
- ~3,010-line self-contained interactive HTML walkthrough
- 9 sections: Intro → Dedicated Machine → **Hardware Choices (2b, new)** → Setup → Installation → Security → Prompting → Social Media → What's Next
- 7 diagrams (6 Rough.js + 1 Mermaid): Four Pieces, Shared vs Dedicated, **Access Methods Hub-and-Spoke (new)**, Security Layers, Prompt Flow, Split Architecture, Local vs Internet
- 174+ interactive data-keys (checkboxes + notes), localStorage persistence
- Dark/light mode with diagram re-rendering, responsive (375px mobile), keyboard shortcuts
- Render-validated via Puppeteer: V1-V6 all PASS
- Deliverable: `docs/walkthrough/interactive/openclaw-deployment-walkthrough.html`

## Key Verdicts

### Feasibility: GO — with conditions
- 24GB RAM strongly recommended ($200 upgrade is highest-impact hardware decision)
- OrbStack over Docker Desktop (lower RAM, near-zero idle CPU, no memory leak)
- Sleep prevention mandatory (`pmset disablesleep 1`)
- Always plugged in, charge limit at 80%
- Mac Mini M4 recommended: $999 at 24GB/512GB, active cooling, designed for always-on (Section 2b presents this recommendation with full comparison)

### Security: PROCEED — with hardening
- 8+ new CVEs since Output #1 (v2026.2.25 minimum safe version)
- ClawJacked vulnerability proved localhost binding is insufficient alone
- Atomic Stealer distributed via ClawHub — community skills categorically unacceptable
- 10 Essential-tier controls, all explained in Jeff-accessible language
- ~~Biggest residual risk: shared machine (Jeff's banking, email on same device)~~ [OUTDATED as of 2026-03-03 — Jeff confirmed dedicated machine. Shared-machine risk eliminated.]

### Social Media: SPLIT ARCHITECTURE
- OpenClaw has NO native Instagram skill
- Recommended approach: Claude (via OpenClaw) for content creation + Zapier for publishing
- Instagram API requires Facebook Business Page prerequisite chain Jeff hasn't started
- Community skills for social media carry unacceptable security risk
- DNA Principle #10 applied: agent for creation (adds value), automation for posting (deterministic task)

### Estimated Monthly Cost: $23-50
- Claude Pro subscription: $20/mo
- Claude API (content generation): $3-10/mo
- Zapier (Instagram publishing): $0-20/mo (free tier may suffice)

## Key Decisions

- Config-agnostic (works for any MacBook Air config, 24GB strongly recommended)
- Split architecture: OpenClaw for content creation, Zapier for Instagram publishing
- OrbStack over Docker Desktop
- Educational layer included: dedicated machine reasoning, security vigilance, prompting basics
- No contract/transaction coordinator work (out of scope)
- Google Workspace integration deferred to Phase 2 (prompt injection risk)
- Community skills blocked — only locally-authored or audited skills

## Open Questions (Resolved)

- ~~MacBook Air M4 specs~~ → Config-agnostic output with 24GB recommendation
- ~~OpenClaw social media skill availability~~ → No native Instagram skill, split architecture
- ~~Instagram API integration maturity~~ → Requires Facebook Business Page chain, Zapier recommended

## Open Questions (Remaining — require hands-on testing)

- Long-term RAM behavior under sustained agent workloads (OrbStack memory management)
- Actual latency for batch content generation (3-8 seconds per draft estimated)
