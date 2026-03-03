# Audit Manifest — On-Demand Curriculum Engine Restructure

**Date:** 2026-03-03
**Total files audited:** 63 (52 content files + 11 infrastructure files)
**Source documents:**
- `docs/plans/audit/file-inventory.md` (Task 1)
- `docs/plans/audit/hybrid-file-splits.md` (Task 2)
- `docs/plans/2026-03-03-on-demand-curriculum-engine-implementation.md` (Tasks 4-14)
- `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md` (architecture reference)

**Classification breakdown:**
- ENGINE: 5 files (3 leave-in-place + 1 move to engine/templates/ + 1 .gitignore)
- OUTPUT: 47 files (39 content + 8 .gitkeep placeholders moved to output; 2 .gitkeep removed since directories have content)
- DNA: 0 standalone files (DNA principles embedded in HYBRID files, extracted during splits)
- HYBRID: 9 files (split per hybrid-file-splits.md)
- Infrastructure .gitkeep files: 10 (dispositioned individually below)

---

## 1. New Files to Create

These files are created during the restructure (Tasks 4-14). Sources are identified for each.

### Engine Directory Scaffolding (Task 4)

| File | Purpose |
|------|---------|
| `engine/methodology/.gitkeep` | Directory placeholder |
| `engine/intake/.gitkeep` | Directory placeholder |
| `engine/templates/project-structure/.gitkeep` | Directory placeholder |
| `engine/templates/report-templates/.gitkeep` | Directory placeholder |
| `engine/templates/interactive-html/.gitkeep` | Directory placeholder |
| `engine/patterns/.gitkeep` | Directory placeholder |
| `engine/skills/.gitkeep` | Directory placeholder |
| `outputs/.gitkeep` | Directory placeholder |

### Engine Methodology Documents (Task 5)

| File | Purpose | Source Material |
|------|---------|----------------|
| `engine/methodology/dual-source-intelligence.md` | Dual-source research methodology (Context7 + Bright Data) | CLAUDE.md lines 68-109 (research methodology section) |
| `engine/methodology/credibility-tiers.md` | 5-tier source weighting system | CLAUDE.md credibility tiers table (lines ~95-109) |
| `engine/methodology/three-tier-hardening.md` | Essential / Educational / Operational framework | CLAUDE.md lines 195-211 (deployment posture) + walkthrough intro |
| `engine/methodology/research-cadence-template.md` | Genericized staleness management and sweep framework | `knowledge-base/07-operations/research-cadence.md` lines 23-228 (engine sections) |
| `engine/methodology/editorial-standards.md` | Quality bar for all outputs | CLAUDE.md lines 49-64 (non-negotiable rules) + `operator/purpose-refinement-2026-02-22.md` |

### Engine Intake Documents (Task 6)

| File | Purpose | Source Material |
|------|---------|----------------|
| `engine/intake/intake-process.md` | Pipeline: raw input -> operator profile -> research scope | Design doc Section 5 + new content |
| `engine/intake/operator-profile-template.md` | Template for capturing operator context | Based on `operator/sean-currie-profile.md` structure |

### Engine Output Structure Templates (Task 7)

| File | Purpose | Source Material |
|------|---------|----------------|
| `engine/templates/project-structure/README.md` | Describes the output scaffold | Design doc Section 4 (Layer 3) |
| `engine/templates/report-templates/README.md` | Describes the 5-report evaluation framework | Current research reports (01-05) as reference |
| `engine/templates/project-structure/CONTEXT-template.md` | Template for output-level CONTEXT.md | Current `CONTEXT.md` (genericized) |
| `engine/templates/project-structure/session-state-template.md` | Template for session state tracking | `skills/session-restart/SKILL.md` lines 118-167 |
| `engine/templates/project-structure/activity-log-template.md` | Template for activity logging | Current `activity-log.md` format |
| `engine/templates/project-structure/intelligence-log-template.md` | Template for strategic insight logging | Current `intelligence-log.md` format |

### Engine Walkthrough Templates (Task 8)

| File | Purpose | Source Material |
|------|---------|----------------|
| `engine/templates/walkthrough-style-guide.md` | Genericized visual/UX spec for interactive walkthroughs | `docs/walkthrough/interactive/src/style-guide.md` (genericized) |
| `engine/templates/interactive-html/README.md` | Describes the HTML framework and parameterization | `docs/walkthrough/interactive/src/index.html` + `convert.mjs` analysis |

### Files Created from HYBRID Splits (Tasks 11, 13, 14)

| File | Purpose | Source Material |
|------|---------|----------------|
| `CLAUDE.md` (rewritten) | Engine constitution — DNA + engine methodology | Current CLAUDE.md DNA + ENGINE sections (see hybrid-file-splits.md §1) |
| `CONTEXT.md` (rewritten) | Engine-level state and output inventory | Current CONTEXT.md ENGINE sections (see hybrid-file-splits.md §2) |
| `CONTEXT-HISTORY.md` (rewritten) | Engine milestone archive (starts near-empty) | Pattern from current CONTEXT-HISTORY.md (see hybrid-file-splits.md §3) |
| `outputs/openclaw-sean/CLAUDE.md` | Output-specific instructions and deployment posture | Current CLAUDE.md OUTPUT sections (see hybrid-file-splits.md §1) |
| `outputs/openclaw-sean/CONTEXT.md` | Output-specific state, decisions, findings | Current CONTEXT.md OUTPUT sections (see hybrid-file-splits.md §2) |

**Total new files to create:** 27 (8 scaffolding .gitkeep + 5 methodology + 2 intake + 6 templates + 2 walkthrough templates + 4 split products)

Note: The 3 root-level rewrites (CLAUDE.md, CONTEXT.md, CONTEXT-HISTORY.md) overwrite existing files — they are listed here as "created" because the content is new, but the file paths already exist.

---

## 2. Files Moving As-Is to `outputs/openclaw-sean/`

These files move unchanged to the output directory. 39 content files + relevant .gitkeep files.

### Logs and State (2 files)

| # | Current Path | New Path |
|---|-------------|----------|
| 4 | `activity-log.md` | `outputs/openclaw-sean/activity-log.md` |
| 5 | `intelligence-log.md` | `outputs/openclaw-sean/intelligence-log.md` |

### Operator Files (4 files)

| # | Current Path | New Path |
|---|-------------|----------|
| 7 | `operator/purpose-refinement-2026-02-22.md` | `outputs/openclaw-sean/operator/purpose-refinement-2026-02-22.md` |
| 8 | `operator/sean-currie-profile.md` | `outputs/openclaw-sean/operator/sean-currie-profile.md` |
| 9 | `operator/session-state.md` | `outputs/openclaw-sean/operator/session-state.md` |
| 10 | `operator/source-transcript-techwith-tim.md` | `outputs/openclaw-sean/operator/source-transcript-techwith-tim.md` |

### Plans & Design Documents (6 files)

| # | Current Path | New Path |
|---|-------------|----------|
| 11 | `docs/plans/2026-02-10-clawdbot-research-project-design.md` | `outputs/openclaw-sean/docs/plans/2026-02-10-clawdbot-research-project-design.md` |
| 12 | `docs/plans/2026-02-10-implementation-plan.md` | `outputs/openclaw-sean/docs/plans/2026-02-10-implementation-plan.md` |
| 13 | `docs/plans/2026-02-11-deployment-walkthrough-design.md` | `outputs/openclaw-sean/docs/plans/2026-02-11-deployment-walkthrough-design.md` |
| 14 | `docs/plans/2026-02-11-deployment-walkthrough-implementation.md` | `outputs/openclaw-sean/docs/plans/2026-02-11-deployment-walkthrough-implementation.md` |
| 15 | `docs/plans/2026-02-14-phase0-implementation-plan.md` | `outputs/openclaw-sean/docs/plans/2026-02-14-phase0-implementation-plan.md` |
| 16 | `docs/plans/2026-02-14-phase0-machine-prep-design.md` | `outputs/openclaw-sean/docs/plans/2026-02-14-phase0-machine-prep-design.md` |

### Walkthrough — Markdown Source (2 files)

| # | Current Path | New Path |
|---|-------------|----------|
| 19 | `docs/walkthrough/2026-02-11-v1-initial-deployment.md` | `outputs/openclaw-sean/docs/walkthrough/2026-02-11-v1-initial-deployment.md` |
| 20 | `docs/walkthrough/crib-sheet.md` | `outputs/openclaw-sean/docs/walkthrough/crib-sheet.md` |

### Walkthrough — Interactive Version (3 files, excluding HYBRID files)

| # | Current Path | New Path |
|---|-------------|----------|
| 21 | `docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` | `outputs/openclaw-sean/docs/walkthrough/interactive/openclaw-deployment-walkthrough.html` |
| 23 | `docs/walkthrough/interactive/src/diagrams.js` | `outputs/openclaw-sean/docs/walkthrough/interactive/src/diagrams.js` |
| 26 | `docs/walkthrough/interactive/build-reports/fidelity-report.md` | `outputs/openclaw-sean/docs/walkthrough/interactive/build-reports/fidelity-report.md` |
| 27 | `docs/walkthrough/interactive/build-reports/ux-report.md` | `outputs/openclaw-sean/docs/walkthrough/interactive/build-reports/ux-report.md` |

### Knowledge Base (11 files)

| # | Current Path | New Path |
|---|-------------|----------|
| 28 | `knowledge-base/01-landscape/competitive-landscape.md` | `outputs/openclaw-sean/knowledge-base/01-landscape/competitive-landscape.md` |
| 29 | `knowledge-base/02-architecture/adjacent-tech-docs.md` | `outputs/openclaw-sean/knowledge-base/02-architecture/adjacent-tech-docs.md` |
| 30 | `knowledge-base/02-architecture/deep-dive-findings.md` | `outputs/openclaw-sean/knowledge-base/02-architecture/deep-dive-findings.md` |
| 31 | `knowledge-base/02-architecture/openclaw-official-docs.md` | `outputs/openclaw-sean/knowledge-base/02-architecture/openclaw-official-docs.md` |
| 32 | `knowledge-base/03-security/security-posture-analysis.md` | `outputs/openclaw-sean/knowledge-base/03-security/security-posture-analysis.md` |
| 33 | `knowledge-base/04-deployment/mac-mini-community-findings.md` | `outputs/openclaw-sean/knowledge-base/04-deployment/mac-mini-community-findings.md` |
| 34 | `knowledge-base/04-deployment/mac-mini-deployment-plan.md` | `outputs/openclaw-sean/knowledge-base/04-deployment/mac-mini-deployment-plan.md` |
| 35 | `knowledge-base/04-deployment/openclaw-macos-official.md` | `outputs/openclaw-sean/knowledge-base/04-deployment/openclaw-macos-official.md` |
| 36 | `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` | `outputs/openclaw-sean/knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` |
| 37 | `knowledge-base/05-skills-and-integrations/skill-system-reference.md` | `outputs/openclaw-sean/knowledge-base/05-skills-and-integrations/skill-system-reference.md` |
| 38 | `knowledge-base/06-community-intelligence/openclaw-community-findings.md` | `outputs/openclaw-sean/knowledge-base/06-community-intelligence/openclaw-community-findings.md` |

### Patterns (5 files)

Note: Patterns move to `engine/patterns/` per Task 8 (they are cross-output reusable), NOT to the output directory. However, per the file inventory, their content is OpenClaw-specific. The implementation plan (Task 8) moves them to engine level because the pattern *format* is reusable and the patterns may inform future outputs. This is a legitimate classification decision documented in the inventory.

| # | Current Path | New Path | Notes |
|---|-------------|----------|-------|
| 41 | `patterns/001-zero-clawhub-supply-chain-defense.md` | `engine/patterns/001-zero-clawhub-supply-chain-defense.md` | `git mv` per Task 8 |
| 42 | `patterns/002-per-agent-routing-over-elevated-mode.md` | `engine/patterns/002-per-agent-routing-over-elevated-mode.md` | `git mv` per Task 8 |
| 43 | `patterns/003-reader-agent-prompt-injection-defense.md` | `engine/patterns/003-reader-agent-prompt-injection-defense.md` | `git mv` per Task 8 |
| 44 | `patterns/004-webhook-n8n-integration.md` | `engine/patterns/004-webhook-n8n-integration.md` | `git mv` per Task 8 |
| 45 | `patterns/005-local-gguf-embeddings.md` | `engine/patterns/005-local-gguf-embeddings.md` | `git mv` per Task 8 |

### Research Reports (5 files)

| # | Current Path | New Path |
|---|-------------|----------|
| 46 | `research/reports/01-landscape-report.md` | `outputs/openclaw-sean/research/reports/01-landscape-report.md` |
| 47 | `research/reports/02-architecture-reference.md` | `outputs/openclaw-sean/research/reports/02-architecture-reference.md` |
| 48 | `research/reports/03-mac-mini-feasibility.md` | `outputs/openclaw-sean/research/reports/03-mac-mini-feasibility.md` |
| 49 | `research/reports/04-security-evaluation.md` | `outputs/openclaw-sean/research/reports/04-security-evaluation.md` |
| 50 | `research/reports/05-open-questions.md` | `outputs/openclaw-sean/research/reports/05-open-questions.md` |

### Research Sources (1 file)

| # | Current Path | New Path |
|---|-------------|----------|
| 51 | `research/sources.md` | `outputs/openclaw-sean/research/sources.md` |

### .gitkeep Placeholders (10 files)

These move with their parent directories or are dropped if the directory already has content files.

| # | Current Path | Disposition |
|---|-------------|-------------|
| 54 | `knowledge-base/01-landscape/.gitkeep` | Drop — directory has `competitive-landscape.md` |
| 55 | `knowledge-base/02-architecture/.gitkeep` | Drop — directory has 3 content files |
| 56 | `knowledge-base/03-security/.gitkeep` | Drop — directory has `security-posture-analysis.md` |
| 57 | `knowledge-base/04-deployment/.gitkeep` | Drop — directory has 3 content files |
| 58 | `knowledge-base/05-skills-and-integrations/.gitkeep` | Drop — directory has 2 content files |
| 59 | `knowledge-base/06-community-intelligence/.gitkeep` | Drop — directory has content file |
| 60 | `knowledge-base/07-operations/.gitkeep` | Drop — directory has 2 content files |
| 61 | `patterns/.gitkeep` | Drop — directory has 5 content files; moves to `engine/patterns/` |
| 62 | `research/reports/.gitkeep` | Drop — directory has 5 report files |
| 63 | `research/scrapes/.gitkeep` | Move to `outputs/openclaw-sean/research/scrapes/.gitkeep` — empty directory, preserved for structure |

Note: When `git mv` moves an entire directory (e.g., `git mv knowledge-base/ outputs/openclaw-sean/knowledge-base/`), .gitkeep files move with it. They can be cleaned up after the move if the directory has content. Only `research/scrapes/.gitkeep` must be explicitly preserved since that directory has no content files.

---

## 3. Files Staying In Place

| # | Current Path | Notes |
|---|-------------|-------|
| 17 | `docs/plans/2026-03-03-on-demand-curriculum-engine-design.md` | Engine-level plan — governs the restructure |
| 18 | `docs/plans/2026-03-03-on-demand-curriculum-engine-implementation.md` | Engine-level plan — governs the restructure |
| 53 | `.gitignore` | Root-level config — will be updated as structure changes |

Note: `docs/plans/audit/` files (file-inventory.md, hybrid-file-splits.md, this manifest) also stay in place as engine-level audit artifacts.

---

## 4. Files Being Split (HYBRID)

Each HYBRID file produces at least two derivative files. Full section-level detail in `docs/plans/audit/hybrid-file-splits.md`.

### Split-and-Move (5 files)

| # | Current Path | Becomes | Details |
|---|-------------|---------|---------|
| 1 | `CLAUDE.md` (230 lines) | **Root `CLAUDE.md`** (engine constitution: DNA principles + engine methodology) + **`outputs/openclaw-sean/CLAUDE.md`** (OpenClaw identity, Mac Mini lens, deployment posture, operator context) | 3 content layers: DNA ~16 lines, ENGINE ~87 lines, OUTPUT ~75 lines. See hybrid-file-splits.md §1 |
| 2 | `CONTEXT.md` (188 lines) | **Root `CONTEXT.md`** (engine state, output inventory) + **`outputs/openclaw-sean/CONTEXT.md`** (OpenClaw status, decisions, findings, infrastructure) | ENGINE ~16 lines, OUTPUT ~155 lines. See hybrid-file-splits.md §2 |
| 3 | `CONTEXT-HISTORY.md` (134 lines) | **Root `CONTEXT-HISTORY.md`** (engine milestones, starts near-empty) + **`outputs/openclaw-sean/CONTEXT-HISTORY.md`** (entire current content — all OpenClaw history) | ENGINE 0 lines current content (pattern only), OUTPUT 134 lines. See hybrid-file-splits.md §3 |
| 6 | `operator/project-genesis.md` (133 lines) | **`engine/templates/project-genesis-template.md`** (purpose structure, "What This Is NOT" DNA, architecture decisions) + **`outputs/openclaw-sean/operator/project-genesis.md`** (moved as-is — Sean's specific purpose, goals, hardware, professional context) | DNA ~9 lines, ENGINE ~33 lines, OUTPUT ~80 lines. See hybrid-file-splits.md §4 |
| 40 | `knowledge-base/07-operations/research-cadence.md` (228 lines) | **`engine/methodology/research-cadence-template.md`** (genericized sweep framework, staleness rules, anti-patterns, success metrics) + **`outputs/openclaw-sean/knowledge-base/07-operations/research-cadence.md`** (moved as-is — all OpenClaw-specific queries preserved) | ENGINE ~148 lines, OUTPUT ~60 lines. See hybrid-file-splits.md §5 |

### Extract-Template (4 files)

| # | Current Path | Becomes | Details |
|---|-------------|---------|---------|
| 22 | `docs/walkthrough/interactive/src/convert.mjs` (1304 lines) | **`engine/templates/walkthrough-converter/convert.mjs`** (generic converter with config object extracted) + **`outputs/openclaw-sean/docs/walkthrough/interactive/src/convert.mjs`** (original moved as-is) + **`outputs/openclaw-sean/docs/walkthrough/interactive/src/convert-config.mjs`** (OpenClaw-specific config: paths, phase data, nav groups) | ENGINE ~1275 lines (98%), OUTPUT ~29 lines (2%). See hybrid-file-splits.md §6 |
| 24 | `docs/walkthrough/interactive/src/index.html` (2193 lines) | **No manual split** — this is a generated artifact (output of convert.mjs). Moves as-is to `outputs/openclaw-sean/`. The engine template is the converter, not the HTML. | ENGINE portion captured in convert.mjs template. See hybrid-file-splits.md §7 |
| 39 | `knowledge-base/07-operations/operational-runbook-template.md` (1047 lines) | **`engine/templates/operational-runbook-template.md`** (skeleton with placeholders: `[CHECK_SERVICE_CMD]`, `[PORT]`, `[CONFIG_PATH]`, etc.) + **`outputs/openclaw-sean/knowledge-base/07-operations/operational-runbook-template.md`** (moved as-is — populated OpenClaw runbook) | ENGINE ~350 lines (33%), OUTPUT ~620 lines (59%). See hybrid-file-splits.md §8 |
| 52 | `skills/session-restart/SKILL.md` (198 lines) | **`engine/templates/skills/session-restart/SKILL.md`** (parameterized template with `{{PROJECT_NAME}}`, `{{OPERATOR_NAME}}`, path placeholders) + **`outputs/openclaw-sean/skills/session-restart/SKILL.md`** (OpenClaw-specific instance) | ENGINE ~145 lines (73%), OUTPUT ~40 lines (20%). See hybrid-file-splits.md §9 |

Note: `index.html` (#24) is classified as extract-template in the inventory but the hybrid-file-splits analysis concluded it should move as-is since it is a generated artifact. The template extraction happens at the converter level (convert.mjs). This is the correct approach — no contradiction, just a refinement of the disposition during detailed analysis.

---

## 5. Templates to Extract

These are engine-reusable structures extracted from existing output-specific files during Tasks 5-8.

| Source File | Template Path | What Gets Parameterized |
|-------------|--------------|------------------------|
| `docs/walkthrough/interactive/src/style-guide.md` | `engine/templates/walkthrough-style-guide.md` | Phase-specific diagram specs become examples; OpenClaw callout examples become generic examples |
| `docs/walkthrough/interactive/src/convert.mjs` | `engine/templates/walkthrough-converter/convert.mjs` | Source/output paths, sidebar title, diagramPlacements, phaseTimeEstimates, securityCritical, navGroups extracted to config object |
| `knowledge-base/07-operations/operational-runbook-template.md` | `engine/templates/operational-runbook-template.md` | All commands, ports, paths, service names become placeholders |
| `skills/session-restart/SKILL.md` | `engine/templates/skills/session-restart/SKILL.md` | Project name, operator name, file paths, phase table entries, calibration framing |
| `operator/project-genesis.md` | `engine/templates/project-genesis-template.md` | Purpose deliverables, hardware decisions, professional context, inspirational source |
| `knowledge-base/07-operations/research-cadence.md` | `engine/methodology/research-cadence-template.md` | Tool-specific queries, subreddits, npm commands, CVE searches, version numbers |
| `operator/sean-currie-profile.md` | `engine/intake/operator-profile-template.md` | All personal details — template retains section structure only |
| `CONTEXT.md` | `engine/templates/project-structure/CONTEXT-template.md` | All tool-specific status, decisions, findings, infrastructure |
| `operator/session-state.md` (via skill template) | `engine/templates/project-structure/session-state-template.md` | Phase names, tool-specific tracking fields |
| `activity-log.md` | `engine/templates/project-structure/activity-log-template.md` | All entries — template retains format/header only |
| `intelligence-log.md` | `engine/templates/project-structure/intelligence-log-template.md` | All entries — template retains format/header only |

---

## 6. Style Guide: ENGINE Move

The style guide has a unique disposition — it moves as-is from the output directory to the engine, not the other way around.

| # | Current Path | New Path | Notes |
|---|-------------|----------|-------|
| 25 | `docs/walkthrough/interactive/src/style-guide.md` | `engine/templates/style-guide.md` | Engine-reusable design system (colors, typography, components, callout patterns). Not OpenClaw-specific. A genericized copy goes to engine (Task 8); the original can remain in the output as reference, or the output can reference the engine version. |

---

## 7. Session-Restart Skill: Special Handling

The session-restart skill moves to engine level (Task 11: `git mv skills/ engine/skills/`) but also needs a template extracted (Task 8 area) and the OpenClaw instance preserved for the output.

| Step | Action |
|------|--------|
| 1 | `git mv skills/ engine/skills/` — moves the current skill to engine level |
| 2 | Create `engine/templates/skills/session-restart/SKILL.md` — parameterized template |
| 3 | Create `outputs/openclaw-sean/skills/session-restart/SKILL.md` — OpenClaw-specific instance (copy of original before parameterization) |
| 4 | The version at `engine/skills/session-restart/SKILL.md` can be updated to be the generic engine version, or point to the template |

---

## 8. Complete File Accounting Summary

### By Disposition

| Disposition | Count | Files |
|-------------|-------|-------|
| **move-as-is to output** | 39 | Content files #4-5, 7-16, 19-21, 23, 26-38, 46-51 |
| **move-as-is to engine** | 6 | Style guide #25 + 5 patterns #41-45 |
| **split-and-move** | 5 | HYBRID files #1-3, 6, 40 |
| **extract-template** | 4 | HYBRID files #22, 24, 39, 52 |
| **leave-in-place** | 3 | Engine plans #17-18 + .gitignore #53 |
| **.gitkeep — drop** | 9 | Files #54-62 (directories have content) |
| **.gitkeep — move to output** | 1 | File #63 (research/scrapes/) |
| **Total** | **63** | **Every file accounted for** |

### By Destination

| Destination | Count | Notes |
|-------------|-------|-------|
| `outputs/openclaw-sean/` | 42 | 39 moved as-is + 2 from CONTEXT-HISTORY split + 1 scrapes .gitkeep. Plus derivative files from splits. |
| `engine/` | 6 | Style guide + 5 patterns. Plus new files from Tasks 4-8. |
| Root (stays/rewritten) | 6 | CLAUDE.md, CONTEXT.md, CONTEXT-HISTORY.md (all rewritten), .gitignore, 2 engine plan docs |
| Dropped | 9 | .gitkeep files for directories that have content |

---

## 9. Inconsistencies and Decisions to Flag

### 1. Patterns Classification: OUTPUT vs ENGINE

The file inventory classifies the 5 pattern files as **OUTPUT** (content is OpenClaw-specific). The implementation plan (Task 8) moves them to `engine/patterns/`. These are not contradictory — the patterns were extracted from OpenClaw research but are framed as cross-output reusable patterns (supply chain defense, model routing, prompt injection defense are relevant to any agent platform). The implementation plan's disposition takes precedence. **Resolution:** Patterns move to `engine/patterns/` as specified in Task 8.

### 2. index.html (#24) Disposition Refinement

The file inventory says **extract-template**. The hybrid-file-splits analysis says **move as-is** (it is a generated artifact; the template extraction happens at the converter level). **Resolution:** Move as-is to output. The engine template is convert.mjs, not the generated HTML. No data loss — the same engine content is captured, just at the right level.

### 3. Session-Restart Skill — Three Copies

The skill ends up in three places: `engine/skills/` (moved original), `engine/templates/skills/` (parameterized template), and `outputs/openclaw-sean/skills/` (output instance). This is intentional: the engine needs a working skill, the templates need a parameterizable version, and the output needs its specific instance. But the `engine/skills/` version and the template overlap — clarify during Task 11 whether the engine skill IS the template or a separate working copy.

### 4. .gitkeep Cleanup Timing

The 9 .gitkeep files in directories with content will be dropped naturally when `git mv` moves entire directories and content files fill the output directories. No explicit deletion needed — but verify during Task 15 (File Accounting) that no orphaned .gitkeep files remain.

### 5. Audit Files Stay Put

The `docs/plans/audit/` directory (this manifest, file-inventory.md, hybrid-file-splits.md) stays at root level alongside the engine plan docs. These are engine-level artifacts, not output-specific. Future verification report (Task 17) also goes here.

---

## 10. Verification Checklist

- [x] Every file in inventory has a disposition (63/63 accounted for in Sections 1-6)
- [x] Every HYBRID file has section-level split documented (9/9 in hybrid-file-splits.md)
- [x] No file is listed in two destinations (except: source files that produce both engine template AND output instance — this is extract-template disposition, not duplication)
- [x] All new files have source material identified (Section 1, all 27 new files sourced)
- [x] The manifest is internally consistent (inconsistencies documented and resolved in Section 9)
- [x] Pattern files' ENGINE vs OUTPUT classification resolved (moved to engine per Task 8)
- [x] index.html disposition refined (move as-is, template captured at converter level)
- [x] Session-restart skill triple-copy documented and flagged for clarification

---

## 11. Execution Order Reference

For Sean's review — the task sequence that implements this manifest:

| Phase | Tasks | What Happens |
|-------|-------|-------------|
| **Phase 2: Engine Extraction** | 4-8 | Scaffold engine/, extract methodology, create templates, move patterns |
| **Phase 3: Output Relocation** | 9-12 | Move operator files, KB, research, docs, logs to outputs/openclaw-sean/ |
| **Phase 4: Engine Constitution** | 13-14 | Rewrite root CLAUDE.md and CONTEXT.md as engine-level documents |
| **Phase 5: Verification** | 15-17 | File accounting, reference integrity, final verification report |

**Review checkpoints:** After Task 3 (this document), after Task 8, after Task 12, after Task 17.
