# CONTEXT.md — OpenClaw for Jeff (Output #2)

**Last Updated:** 2026-03-03
**Staleness Threshold:** 5 days

## Output Purpose

Tailored interactive walkthrough for Jeff (Denver real estate agent, Hatch brand owner) to deploy OpenClaw on a MacBook Air. Primary use case: social media management (Instagram). Educational focus on understanding what OpenClaw is, why dedicated hardware matters, security basics, and prompting fundamentals.

## Current Status

- **Phase:** Complete
- **Pipeline stage:** All phases executed: Intake → Research → Synthesis → Output Generation → Render-Validate → Delivery
- **Depth assessment:** Deep-dive (multi-stage pipeline, interactive HTML output >500 lines, multiple research reports)
- **Deployment target:** MacBook Air (config-agnostic, 24GB RAM strongly recommended)
- **LLM:** Claude (subscription)
- **Container runtime:** OrbStack (recommended over Docker Desktop)

## What This Output Produces

### Research (Complete)
- 80+ sources across Tiers 1-5, tracked in `research/sources.md`
- 7 knowledge base buckets populated (landscape, architecture, security, deployment, skills, community, operations)
- 5 synthesis reports: landscape (abbreviated), architecture (abbreviated), feasibility (full), security (full), open questions
- 25+ strategic insights in intelligence log

### Walkthrough (Complete)
- 2,810-line self-contained interactive HTML walkthrough
- 8 sections: Intro → Dedicated Machine → Setup → Installation → Security → Prompting → Social Media → What's Next
- 6 diagrams (5 Rough.js + 1 Mermaid): Four Pieces, Shared vs Dedicated, Security Layers, Prompt Flow, Split Architecture, Local vs Internet
- 171 interactive data-keys (checkboxes + notes), localStorage persistence
- Dark/light mode with diagram re-rendering, responsive (375px mobile), keyboard shortcuts
- Render-validated via Puppeteer: V1-V6 all PASS
- Deliverable: `docs/walkthrough/interactive/openclaw-deployment-walkthrough.html`

## Key Verdicts

### Feasibility: GO — with conditions
- 24GB RAM strongly recommended ($200 upgrade is highest-impact hardware decision)
- OrbStack over Docker Desktop (lower RAM, near-zero idle CPU, no memory leak)
- Sleep prevention mandatory (`pmset disablesleep 1`)
- Always plugged in, charge limit at 80%
- Mac Mini would be objectively better for always-on use — worth discussing with Jeff if portability isn't essential

### Security: PROCEED — with hardening
- 8+ new CVEs since Output #1 (v2026.2.25 minimum safe version)
- ClawJacked vulnerability proved localhost binding is insufficient alone
- Atomic Stealer distributed via ClawHub — community skills categorically unacceptable
- 10 Essential-tier controls, all explained in Jeff-accessible language
- Biggest residual risk: shared machine (Jeff's banking, email on same device)

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
