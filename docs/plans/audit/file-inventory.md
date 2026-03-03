# File Inventory — On-Demand Curriculum Engine Restructure

**Date:** 2026-03-03
**Task:** Task 1 of 17 (Phase 1: Systematic Audit)
**Total Files:** 63 (52 content files + 11 infrastructure files)
**Purpose:** Complete inventory of every file in the repo with classification and disposition for the three-layer restructure (DNA / Engine / Outputs).

---

## Classification Key

| Classification | Meaning |
|----------------|---------|
| **DNA** | Editorial principles, non-negotiable rules, project identity — lives at root level |
| **ENGINE** | Reusable methodology, templates, patterns, skills — moves to `engine/` |
| **OUTPUT** | OpenClaw-specific content for Sean — moves to `outputs/openclaw-sean/` |
| **HYBRID** | Contains both engine methodology and output-specific content — requires split |

## Disposition Key

| Disposition | Meaning |
|-------------|---------|
| **move-as-is** | File moves to new location unchanged |
| **split-and-move** | File contains mixed content; split into engine + output portions |
| **extract-template** | Extract reusable structure as engine template; original becomes output instance |
| **leave-in-place** | File stays at current location (engine-level plans, root config) |
| **create-new** | New file to be created during restructure (not in this inventory) |

---

## Root-Level Files (4 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 1 | `CLAUDE.md` | 230 | Project constitution — identity, rules, methodology, session protocol, deployment posture | **HYBRID** | **split-and-move** — DNA principles + engine methodology stay at root (rewritten as engine CLAUDE.md); OpenClaw-specific references (deployment posture, Mac Mini lens, walkthrough sync rules) move to output |
| 2 | `CONTEXT.md` | 188 | Current project state — status, decisions, open questions, staleness sweep results | **HYBRID** | **split-and-move** — Engine-level state tracking pattern stays at root (rewritten as engine CONTEXT.md); OpenClaw-specific status, CVEs, version targets, ecosystem findings move to output |
| 3 | `CONTEXT-HISTORY.md` | 134 | Archived milestones — phase completions, key findings history | **HYBRID** | **split-and-move** — Engine milestone tracking pattern stays at root; OpenClaw-specific phase history (research findings, CVEs, architecture decisions) moves to output |
| 4 | `activity-log.md` | 72 | Session breadcrumbs — actions taken, tools used, dates | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/activity-log.md` |

---

## Intelligence & Logging (1 file)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 5 | `intelligence-log.md` | 68 | Strategic insights — hypotheses validated, contradictions found, key discoveries | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/intelligence-log.md` |

---

## Operator Files (5 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 6 | `operator/project-genesis.md` | 133 | Why this project exists — refined purpose, four reasons, key decisions, professional context | **HYBRID** | **split-and-move** — DNA motivations (learning lab posture, transferable skills philosophy) extract to engine DNA; OpenClaw-specific goals, Tim transcript references, hardware decisions move to output |
| 7 | `operator/purpose-refinement-2026-02-22.md` | 106 | Raw conversation capture of purpose alignment — unfiltered intent behind the project | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/operator/purpose-refinement-2026-02-22.md` |
| 8 | `operator/sean-currie-profile.md` | 88 | Operator profile — background, capabilities, infrastructure, working style, collaboration rules | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/operator/sean-currie-profile.md` |
| 9 | `operator/session-state.md` | 72 | Single source of truth for walkthrough progress and task state | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/operator/session-state.md` |
| 10 | `operator/source-transcript-techwith-tim.md` | 147 | Structured extraction of founding video source (Tech With Tim) | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/operator/source-transcript-techwith-tim.md` |

---

## Plans & Design Documents (8 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 11 | `docs/plans/2026-02-10-clawdbot-research-project-design.md` | 274 | Original project design document — brainstorming output | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/plans/2026-02-10-clawdbot-research-project-design.md` |
| 12 | `docs/plans/2026-02-10-implementation-plan.md` | 839 | Original implementation plan — 18 tasks across 4 phases | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/plans/2026-02-10-implementation-plan.md` |
| 13 | `docs/plans/2026-02-11-deployment-walkthrough-design.md` | 212 | Walkthrough design — curriculum structure for deployment guide | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/plans/2026-02-11-deployment-walkthrough-design.md` |
| 14 | `docs/plans/2026-02-11-deployment-walkthrough-implementation.md` | 310 | Walkthrough implementation plan — build steps for interactive version | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/plans/2026-02-11-deployment-walkthrough-implementation.md` |
| 15 | `docs/plans/2026-02-14-phase0-implementation-plan.md` | 792 | Phase 0 (machine prep) implementation plan — Mac Mini specific | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/plans/2026-02-14-phase0-implementation-plan.md` |
| 16 | `docs/plans/2026-02-14-phase0-machine-prep-design.md` | 185 | Phase 0 design — existing Mac Mini prep without wipe | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/plans/2026-02-14-phase0-machine-prep-design.md` |
| 17 | `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md` | 251 | Engine restructure design document — three-layer architecture | **ENGINE** | **leave-in-place** (engine-level plan, governs the restructure itself) |
| 18 | `docs/plans/2026-03-03-on-demand-curriculum-engine-implementation.md` | 1080 | Engine restructure implementation plan — 17 tasks, 5 phases | **ENGINE** | **leave-in-place** (engine-level plan, governs the restructure itself) |

---

## Walkthrough — Markdown Source (2 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 19 | `docs/walkthrough/2026-02-11-v1-initial-deployment.md` | 2381 | Full deployment walkthrough — 10 phases (0-I), OpenClaw on Mac Mini | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/walkthrough/2026-02-11-v1-initial-deployment.md` |
| 20 | `docs/walkthrough/crib-sheet.md` | 242 | Quick-reference version of walkthrough — commands and checkpoints | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/walkthrough/crib-sheet.md` |

---

## Walkthrough — Interactive Version (6 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 21 | `docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` | 3030 | Built interactive HTML walkthrough — the primary deliverable | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` |
| 22 | `docs/walkthrough/interactive/src/convert.mjs` | 1304 | Build tool — converts markdown walkthrough to interactive HTML | **HYBRID** | **extract-template** — The converter logic is engine-reusable (markdown-to-interactive pipeline); OpenClaw-specific diagram hooks and content mappings are output-specific. Extract generic converter to `engine/tools/`; keep this version in output as reference. |
| 23 | `docs/walkthrough/interactive/src/diagrams.js` | 737 | Mermaid diagram definitions for the interactive walkthrough | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/walkthrough/interactive/src/diagrams.js` |
| 24 | `docs/walkthrough/interactive/src/index.html` | 2193 | HTML template/shell for the interactive walkthrough | **HYBRID** | **extract-template** — The interactive shell (navigation, progress tracking, dark mode, copy buttons, print CSS) is engine-reusable; OpenClaw-specific metadata, title, branding are output-specific. Extract generic template to `engine/templates/`; keep this version in output. |
| 25 | `docs/walkthrough/interactive/src/style-guide.md` | 1036 | Complete visual and curriculum design specification | **ENGINE** | **move-as-is** to `engine/templates/style-guide.md` — This is a reusable design system. Color palette, typography, component specs, callout patterns all transfer to any walkthrough output. |
| 26 | `docs/walkthrough/interactive/build-reports/fidelity-report.md` | 180 | Build verification — fidelity check of HTML vs. markdown source | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/walkthrough/interactive/build-reports/fidelity-report.md` |
| 27 | `docs/walkthrough/interactive/build-reports/ux-report.md` | 217 | Build verification — UX review of interactive walkthrough | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/docs/walkthrough/interactive/build-reports/ux-report.md` |

---

## Knowledge Base (11 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 28 | `knowledge-base/01-landscape/competitive-landscape.md` | 225 | Competitive landscape — tool comparisons, positioning | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/01-landscape/competitive-landscape.md` |
| 29 | `knowledge-base/02-architecture/adjacent-tech-docs.md` | 126 | Adjacent tech documentation — Tailscale, Telegram, Node.js | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/02-architecture/adjacent-tech-docs.md` |
| 30 | `knowledge-base/02-architecture/deep-dive-findings.md` | 903 | Architecture deep-dive — model routing, data residency, config, sub-agents, webhooks | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/02-architecture/deep-dive-findings.md` |
| 31 | `knowledge-base/02-architecture/openclaw-official-docs.md` | 229 | OpenClaw official documentation summary | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/02-architecture/openclaw-official-docs.md` |
| 32 | `knowledge-base/03-security/security-posture-analysis.md` | 843 | Security posture — threat models, hardening, attack surfaces | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/03-security/security-posture-analysis.md` |
| 33 | `knowledge-base/04-deployment/mac-mini-community-findings.md` | 406 | Mac Mini deployment — community experiences, ARM-specific issues | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/04-deployment/mac-mini-community-findings.md` |
| 34 | `knowledge-base/04-deployment/mac-mini-deployment-plan.md` | 1485 | Mac Mini deployment plan — full config, launchd, hardening steps | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/04-deployment/mac-mini-deployment-plan.md` |
| 35 | `knowledge-base/04-deployment/openclaw-macos-official.md` | 64 | OpenClaw macOS official documentation notes | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/04-deployment/openclaw-macos-official.md` |
| 36 | `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` | 514 | Recommended starter skills — curated list with security notes | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` |
| 37 | `knowledge-base/05-skills-and-integrations/skill-system-reference.md` | 832 | Skill system reference — how skills work, security model, configuration | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/05-skills-and-integrations/skill-system-reference.md` |
| 38 | `knowledge-base/06-community-intelligence/openclaw-community-findings.md` | 138 | Community findings — Reddit, YouTube, expert insights | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/06-community-intelligence/openclaw-community-findings.md` |

---

## Operations Knowledge Base (2 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 39 | `knowledge-base/07-operations/operational-runbook-template.md` | 1047 | Operational runbook — monitoring, maintenance, troubleshooting | **HYBRID** | **extract-template** — The runbook structure (sections, checklist format, escalation tiers) is engine-reusable; OpenClaw-specific commands, ports, paths, service names are output-specific. Extract generic runbook template to `engine/templates/`; keep this version in output. |
| 40 | `knowledge-base/07-operations/research-cadence.md` | 228 | Research cadence framework — sweep schedules, trigger-based research, logging layers | **HYBRID** | **split-and-move** — The cadence framework (weekly/biweekly/monthly sweep pattern, trigger-based research, four logging layers, staleness rules, anti-patterns) is engine methodology; OpenClaw-specific queries, URLs, tool names, version numbers are output-specific. Engine gets genericized research cadence; output keeps the OpenClaw-specific version. |

---

## Patterns (5 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 41 | `patterns/001-zero-clawhub-supply-chain-defense.md` | 39 | Pattern: Zero external skills policy for supply chain defense | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/patterns/001-zero-clawhub-supply-chain-defense.md` |
| 42 | `patterns/002-per-agent-routing-over-elevated-mode.md` | 52 | Pattern: Per-agent model routing instead of elevated mode | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/patterns/002-per-agent-routing-over-elevated-mode.md` |
| 43 | `patterns/003-reader-agent-prompt-injection-defense.md` | 53 | Pattern: Reader agent isolation for prompt injection defense | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/patterns/003-reader-agent-prompt-injection-defense.md` |
| 44 | `patterns/004-webhook-n8n-integration.md` | 59 | Pattern: Webhook-based n8n integration for deterministic workflows | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/patterns/004-webhook-n8n-integration.md` |
| 45 | `patterns/005-local-gguf-embeddings.md` | 52 | Pattern: Local GGUF embeddings for on-device memory search | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/patterns/005-local-gguf-embeddings.md` |

---

## Research Reports (5 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 46 | `research/reports/01-landscape-report.md` | 231 | Synthesis report: competitive landscape analysis | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/reports/01-landscape-report.md` |
| 47 | `research/reports/02-architecture-reference.md` | 372 | Synthesis report: architecture reference | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/reports/02-architecture-reference.md` |
| 48 | `research/reports/03-mac-mini-feasibility.md` | 367 | Synthesis report: Mac Mini feasibility assessment | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/reports/03-mac-mini-feasibility.md` |
| 49 | `research/reports/04-security-evaluation.md` | 485 | Synthesis report: security evaluation | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/reports/04-security-evaluation.md` |
| 50 | `research/reports/05-open-questions.md` | 704 | Synthesis report: open questions and deployment blockers | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/reports/05-open-questions.md` |

---

## Research Sources (1 file)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 51 | `research/sources.md` | 257 | Source registry — all sources with credibility tiers | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/sources.md` |

---

## Skills (1 file)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 52 | `skills/session-restart/SKILL.md` | 198 | Session restart skill — context reload protocol | **HYBRID** | **extract-template** — The session restart pattern (load state, check staleness, present brief, update state) is engine-reusable; OpenClaw-specific file paths, walkthrough phases, crib sheet references are output-specific. Extract generic session-restart skill to `engine/skills/`; keep OpenClaw version in output. |

---

## Infrastructure Files (11 files)

| # | File | Lines | Purpose | Classification | Disposition |
|---|------|-------|---------|----------------|-------------|
| 53 | `.gitignore` | — | Git ignore rules | **ENGINE** | **leave-in-place** — root-level config, will be updated as structure changes |
| 54 | `knowledge-base/01-landscape/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/01-landscape/.gitkeep` (or remove if directory has content) |
| 55 | `knowledge-base/02-architecture/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/02-architecture/.gitkeep` (or remove if directory has content) |
| 56 | `knowledge-base/03-security/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/03-security/.gitkeep` (or remove if directory has content) |
| 57 | `knowledge-base/04-deployment/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/04-deployment/.gitkeep` (or remove if directory has content) |
| 58 | `knowledge-base/05-skills-and-integrations/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/05-skills-and-integrations/.gitkeep` (or remove if directory has content) |
| 59 | `knowledge-base/06-community-intelligence/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/06-community-intelligence/.gitkeep` (or remove if directory has content) |
| 60 | `knowledge-base/07-operations/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/knowledge-base/07-operations/.gitkeep` (or remove if directory has content) |
| 61 | `patterns/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/patterns/.gitkeep` (or remove if directory has content) |
| 62 | `research/reports/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/reports/.gitkeep` (or remove if directory has content) |
| 63 | `research/scrapes/.gitkeep` | 0 | Directory placeholder | **OUTPUT** | **move-as-is** to `outputs/openclaw-sean/research/scrapes/.gitkeep` — empty directory, preserved for structure |

---

## Summary Statistics

| Classification | File Count | Total Lines |
|----------------|-----------|-------------|
| **OUTPUT** | 47 | 16,379 (10 .gitkeep files are 0 lines) |
| **HYBRID** | 9 | 5,186 |
| **ENGINE** | 5 | 2,618 + .gitignore |
| **DNA** | 0 | 0 (DNA principles are currently embedded in HYBRID files, primarily CLAUDE.md and project-genesis.md) |
| **Total** | **63** | **24,183+** |

Note: .gitkeep files (10) and .gitignore (1) account for the 11 infrastructure files beyond the 52 content files.

| Disposition | File Count |
|-------------|-----------|
| **move-as-is** | 49 (39 content + 10 .gitkeep placeholders) |
| **split-and-move** | 5 (CLAUDE.md, CONTEXT.md, CONTEXT-HISTORY.md, project-genesis.md, research-cadence.md) |
| **extract-template** | 4 (convert.mjs, index.html, operational-runbook-template.md, session-restart SKILL.md) |
| **leave-in-place** | 3 (engine design doc, engine implementation plan, .gitignore) |
| **move-as-is to engine** | 1 (style-guide.md to engine/templates/) |

---

## Classification Decisions and Notes

### Patterns: OUTPUT, not ENGINE

The five pattern files use a reusable problem/solution/evidence/trade-offs structure, but their content is entirely OpenClaw-specific (ClawHub supply chain, OpenClaw model routing, OpenClaw webhook API, etc.). The **pattern template format** will be captured as an engine template during Task 5 (methodology extraction). The pattern instances themselves are output artifacts.

### Style Guide: ENGINE

The style guide (`interactive/src/style-guide.md`) defines a complete visual design system (color palette, typography, component specs, callout patterns, diagram conventions) that is not OpenClaw-specific. It transfers directly to any interactive walkthrough the engine produces. Classification: ENGINE, disposition: move-as-is to `engine/templates/`.

### Operational Runbook: HYBRID (extract-template)

The runbook at `knowledge-base/07-operations/operational-runbook-template.md` has a reusable structure (health checks, maintenance schedules, escalation tiers, troubleshooting decision trees) but is populated with OpenClaw-specific content (ports, commands, service names). The structure extracts to an engine template; the populated version stays in output.

### Session-Restart Skill: HYBRID (extract-template)

The session-restart skill encodes a reusable protocol (load state, selective context loading, staleness check, present brief, update state) but references OpenClaw-specific artifacts (walkthrough phases, crib sheet, deployment-specific files). Generic version goes to engine; OpenClaw-specific version stays in output.

### Convert.mjs and index.html: HYBRID (extract-template)

Both files contain reusable interactive walkthrough infrastructure (markdown-to-HTML conversion pipeline, navigation system, progress tracking, dark mode, copy buttons, print CSS) alongside OpenClaw-specific hooks (diagram mappings, metadata, branding). The generic conversion pipeline and HTML template extract to `engine/tools/` and `engine/templates/` respectively.

### DNA Layer

No files are purely DNA. DNA principles (learning lab posture, evidence-over-agreement, transferable-over-specific, challenge-over-diplomacy) are currently embedded in CLAUDE.md and project-genesis.md. During the split-and-move of these hybrid files, DNA content will be extracted into the root-level engine CLAUDE.md. This is expected per the design doc — DNA is the thinnest layer.

---

## Completeness Verification

**Files on disk:** 63
**Files in inventory:** 63 (52 content + 11 infrastructure)
**Verification:** COMPLETE — every file accounted for. Verified via `find . -type f -not -path '*/.git/*' -not -path '*/.DS_Store'`.
