# Hybrid File Splits — Section-Level Classification

**Date:** 2026-03-03
**Task:** Task 2 of 17 (Phase 1: Systematic Audit)
**Files Analyzed:** 9 HYBRID files from Task 1 inventory
**Purpose:** Document exactly which sections of each hybrid file are ENGINE, OUTPUT, or DNA — and how each file gets split.

---

## 1. `CLAUDE.md` (230 lines)

### Sections that are DNA (stays at root or engine constitution)

- Lines 1-7: **Header/metadata** — project identity boilerplate (rewrite for engine)
- Lines 49-64: **Non-Negotiable Operator Rules** — the 7 rules and red flags are DNA-level editorial principles. These define HOW the engine collaborates with any operator, not just Sean. Rules 1-4 (research before agreeing, push back with evidence, bring data, ask clarifying questions) are universally applicable. Rule 5 (knowledge accumulates, never resets) is a core engine principle. Rule 6 (security as lens) and Rule 7 (distinguish transferable from tool-specific) are engine methodology.
- Lines 214-220: **Versioning rules** — date-stamping, outdated marking, no deletion policy. These are engine-level knowledge management rules.

### Sections that are ENGINE (move to engine/)

- Lines 68-109: **Research Methodology — Dual-Source Intelligence** — the two-source model (Context7 + Bright Data), the three operating modes, and the source credibility tiers table. This is pure engine methodology. The specific subreddit names (r/selfhosted, r/LocalLLaMA, r/ClaudeAI, r/homelab) are examples that should be parameterized per output.
- Lines 113-137: **Session Protocol** — session start, during, and end procedures. The pattern (read session state, load context, check staleness, present brief, log actions, update state) is engine methodology. The specific file paths (operator/session-state.md, CONTEXT.md, intelligence-log.md) will vary per output but the protocol is fixed.
- Lines 141-155: **Knowledge Base Structure** — the 7-bucket taxonomy and the raw/refined/synthesized/patterns pipeline. The bucket names are parameterizable but the structure is engine.
- Lines 172-191: **Superpowers Skill Chain** — the ordered skill chain and discipline rules. This is engine process methodology.
- Lines 222-230: **Source-Derivative Sync** — the sync rule pattern (source changes require derivative update flagging). The table entries are output-specific but the mechanism is engine.

### Sections that are OUTPUT (move to outputs/openclaw-sean/)

- Lines 11-33: **Identity & Purpose** — heavily OpenClaw-specific ("OpenClaw is Case Study #1", Mac Mini deployment, "learning lab" framing specific to Sean's professional context as Solutions Engineer). The purpose statement structure is engine-templatable, but the content is Sean's OpenClaw output.
- Lines 37-45: **Operator Context** — references Sean's specific operator files (sean-currie-profile.md, project-genesis.md, purpose-refinement-2026-02-22.md, source-transcript-techwith-tim.md). This entire section is output-specific.
- Lines 159-168: **Mac Mini as First-Class Research Lens** — entirely OpenClaw/Sean-specific (M4 Mac Mini, Tailscale, Tim's VPS arguments). This is output deployment context.
- Lines 195-211: **Deployment Posture — Learning Lab** — the three tiers of hardening concept is engine-templatable, but the specific framing (Sean's learning lab, OpenClaw hardening details, ClawHub skills, experimental use cases) is output-specific.
- Lines 226-228: **Source-Derivative Sync table entries** — the specific walkthrough-to-interactive mapping is OpenClaw output.

### Split Strategy

This file becomes **three files:**

1. **Root `CLAUDE.md`** (engine constitution) — rewritten to contain:
   - Engine identity and purpose (what the curriculum engine does)
   - Non-negotiable operator rules (DNA, kept verbatim with minor generalization)
   - Research methodology (dual-source, credibility tiers — parameterized examples)
   - Session protocol (generalized file references)
   - Knowledge base structure (7-bucket taxonomy, generalized)
   - Skill chain (verbatim)
   - Versioning rules (verbatim)
   - Source-derivative sync mechanism (table empty, pattern documented)

2. **`outputs/openclaw-sean/CLAUDE.md`** (output-specific instructions) — contains:
   - OpenClaw identity and purpose
   - Operator context (Sean's files)
   - Mac Mini research lens
   - Deployment posture (learning lab with three hardening tiers, filled in)
   - Source-derivative sync entries (walkthrough -> interactive)
   - Any OpenClaw-specific session protocol additions

3. The DNA rules (lines 49-64) live in the root CLAUDE.md since they govern the engine itself.

**Line accounting:** 230 lines total. DNA: ~16 lines (rules). ENGINE: ~87 lines (methodology sections). OUTPUT: ~75 lines (OpenClaw/Sean specifics). Shared/boilerplate/formatting: ~52 lines (headers, HRs, blank lines that appear in both rewrites).

---

## 2. `CONTEXT.md` (188 lines)

### Sections that are ENGINE (move to engine/)

- Lines 1-4: **Header pattern** — the staleness threshold concept and last-updated tracking. The pattern is engine; the values are output.
- Lines 168-178: **How to Use This Project** — the numbered guide structure (new session -> deploy -> update -> reference -> security -> skills -> staying current -> troubleshooting -> evaluating alternatives) is an engine-level navigation template. The specific file paths and OpenClaw references are output.

### Sections that are OUTPUT (move to outputs/openclaw-sean/)

- Lines 6-14: **Project Purpose** — Sean-specific framing (learning lab, Solutions Engineer context, OpenClaw as Case Study #1).
- Lines 16-23: **Current Status** — entirely OpenClaw-specific (deployment walkthrough version, phase status, version targets).
- Lines 26-68: **Staleness Sweep Results** — OpenClaw governance changes (Peter Steinberger, OpenClaw Foundation), security CVEs, version details, ClawHub numbers, SecureClaw. All output-specific.
- Lines 70-83: **What Was Updated** — specific edit tracking for OpenClaw documents.
- Lines 74-105: **What This Project Produced** — KB bucket contents, research reports, interactive walkthrough status. All OpenClaw output inventory.
- Lines 107-111: **Key Verdicts** — Mac Mini GO, OpenClaw GO with hardening, landscape verdict, stack recommendation. Output-specific.
- Lines 113-136: **Key Decisions + Open Questions** — all OpenClaw-specific (zero ClawHub, elevated mode, model routing, n8n integration, CVE verification, Docker sandbox, etc.).
- Lines 138-159: **Reusable Patterns + Experimental Use Cases** — the patterns are OpenClaw-extracted (but live in output's patterns/); use cases are Sean-specific.
- Lines 161-166: **Known Gaps** — OpenClaw-specific gaps (scrapes empty, community source URLs).
- Lines 180-188: **Infrastructure** — Sean's hardware (Mac Mini M4, MacBook Pro, Tailscale, network details).

### Split Strategy

This file becomes **two files:**

1. **Root `CONTEXT.md`** (engine-level state) — a new file tracking:
   - Engine development state (what phase of engine build)
   - Active outputs and their status
   - Engine-level decisions and open questions
   - Staleness threshold and tracking pattern
   - "How to Use" navigation template (generalized)

2. **`outputs/openclaw-sean/CONTEXT.md`** — the existing content, adjusted to be output-scoped:
   - All OpenClaw-specific status, decisions, findings, infrastructure
   - Staleness sweep results
   - Key verdicts, open questions, known gaps

**Line accounting:** 188 lines total. ENGINE: ~16 lines (header pattern + navigation template structure). OUTPUT: ~155 lines (nearly everything is OpenClaw-specific). Shared/formatting: ~17 lines.

---

## 3. `CONTEXT-HISTORY.md` (134 lines)

### Sections that are ENGINE (move to engine/)

- Line 1: **File concept** — the milestone archive pattern (archive from CONTEXT.md when major phase completes) is engine methodology. No engine-level milestones exist yet, so the engine version is created empty with the pattern documented.

### Sections that are OUTPUT (move to outputs/openclaw-sean/)

- Lines 1-134: **All content** — every entry is OpenClaw-specific:
  - Lines 3-9: Project Inception (2026-02-10) — OpenClaw research decisions
  - Lines 11-35: Phase 0-1 completion — KB population, source counts, findings
  - Lines 37-64: Phase 2 — architecture deep-dive, skills & integrations, key decisions (all OpenClaw)
  - Lines 66-84: Phase 3 — deployment plan, living system framework, scope correction
  - Lines 86-108: Verification & code review — OpenClaw project fixes
  - Lines 110-134: Deployment walkthrough — OpenClaw-specific deliverable

### Split Strategy

This file becomes **two files:**

1. **Root `CONTEXT-HISTORY.md`** — starts empty (or with a single "Engine created" entry). Engine milestones will accumulate as the engine is built and outputs are produced.

2. **`outputs/openclaw-sean/CONTEXT-HISTORY.md`** — the entire current file, moved as-is. Every line is OpenClaw output history.

**Line accounting:** 134 lines total. ENGINE: 0 lines of current content (pattern only). OUTPUT: 134 lines (all content).

---

## 4. `operator/project-genesis.md` (133 lines)

### Sections that are DNA (stays at root or engine constitution)

- Lines 53-61: **What This Project Is NOT** — several items are DNA-level editorial values that apply to any output ("Not a one-time setup guide that goes stale", "Not a copy of someone else's tutorial", "Not documentation-only — community intelligence is equally weighted", "Not a static repo — it's a living system that accumulates knowledge"). These express the engine's editorial DNA.

### Sections that are ENGINE (move to engine/)

- Lines 65-97: **Key Decisions Made During Brainstorming** — the Architecture subsection (lines 77-83) describes the adapted salesenablementengine pattern: CLAUDE.md constitution, 7-bucket KB, CONTEXT.md continuity, dual-layer logging, pattern extraction, progressive disclosure. This is engine architecture documentation. The Research Methodology subsection (lines 85-89) and Skill Chain subsection (lines 91-97) are also engine methodology.

### Sections that are OUTPUT (move to outputs/openclaw-sean/)

- Lines 1-7: **Header** — creation dates and source references specific to this output.
- Lines 10-23: **Project Purpose (Refined)** — Sean's four deliverables (transferable judgment, hands-on credibility, assessment readiness, meta-learning). This is the output-specific purpose. The structure (numbered deliverables + deployment posture + tool role) is engine-templatable.
- Lines 26-31: **Sean's Four Reasons** — entirely Sean-specific motivations.
- Lines 35-49: **Original Stated Goals** — Sean's 6 original goals from brainstorming. Output-specific.
- Lines 67-75: **Hardware: M4 Mac Mini** — Sean's specific hardware decision and rationale. Output-specific.
- Lines 101-113: **Professional Context** — Sean as Solutions Engineer, relationship to SaleEnablementEngine and WondaKB. Output-specific.
- Lines 116-133: **Inspirational Source: Tech With Tim Video** — OpenClaw-specific source material. Output-specific.

### Split Strategy

This file becomes **two files:**

1. **`engine/templates/project-genesis-template.md`** — a template with:
   - Purpose section structure (deliverables, deployment posture, tool role)
   - "What This Is NOT" DNA values (generalized)
   - Architecture decisions section (engine pattern documentation)
   - Research methodology reference
   - Professional context section (placeholder for operator's professional framing)

2. **`outputs/openclaw-sean/operator/project-genesis.md`** — the current file, moved as-is. All Sean-specific content preserved. The engine-reusable patterns have been extracted as templates, but the original remains intact as the first output instance.

**Line accounting:** 133 lines total. DNA: ~9 lines (editorial "what this is NOT" values). ENGINE: ~33 lines (architecture, methodology, skill chain). OUTPUT: ~80 lines (Sean's purpose, goals, hardware, professional context, Tim video). Shared/formatting: ~11 lines.

---

## 5. `knowledge-base/07-operations/research-cadence.md` (228 lines)

### Sections that are ENGINE (move to engine/)

- Lines 1-4: **Header pattern** — the research cadence concept and "keeping intelligence current" framing.
- Lines 23-94: **Periodic Research Sweeps structure** — the three-tier cadence (weekly/biweekly/monthly) with escalating depth is engine methodology. The structure (what to check, tools, output, skip-if criteria) is a reusable template. The specific queries and sources are output parameters.
- Lines 97-110: **Trigger-Based Research** — the trigger table structure (trigger -> action -> tools -> output) is engine methodology. The specific triggers are partially engine (new version, CVE, new competitor, something breaks) and partially output-specific (Tim posts, macOS update, model pricing).
- Lines 113-163: **How Findings Feed Back Into the System** — the four logging layers and decision tree are engine methodology. They describe the intelligence pipeline: intelligence-log (strategic), CONTEXT (operational), activity-log (breadcrumbs), KB (accumulated truth). This entire section is engine.
- Lines 167-178: **Staleness Rules** — the staleness threshold table structure is engine. The specific thresholds (CONTEXT.md 5 days, KB no fixed, reports 30 days, security 0 days, landscape 60 days, community 14 days) are reasonable defaults that could be engine defaults with output override.
- Lines 182-189: **Meta-Research** — the "evaluate the cadence itself after 60 days" concept is engine methodology.
- Lines 194-201: **Anti-Patterns** — the 6 anti-patterns are engine methodology (research without synthesis, logging everything, chasing every thread, ignoring staleness, deleting outdated knowledge, researching without deployment context).
- Lines 205-215: **Tools Reference** — the tools table structure is engine. The specific tools (Context7, Bright Data, GitHub CLI, npm view) are engine-level since they're the MCP tools the engine uses.
- Lines 219-228: **Success Metrics** — the 6 success criteria are engine methodology.

### Sections that are OUTPUT (move to outputs/openclaw-sean/)

- Lines 8-18: **Why This Matters** — the "evidence of pace" section is entirely OpenClaw-specific (GitHub stars, CVE-2026-25253, ClawHub malicious percentage, provider plugin refactoring, naming history).
- Lines 27-39: **Weekly sweep specific queries** — OpenClaw-specific npm commands, CVE search queries, specific subreddits with "OpenClaw" filter.
- Lines 44-58: **Biweekly sweep specific queries** — OpenClaw-specific Bright Data batch search queries (OpenClaw reddit, Manus/Lindy/OpenClaw comparison, ClawHub skills, Claude Opus/Sonnet updates).
- Lines 72-84: **Monthly sweep specific queries** — OpenClaw architecture, macOS/Apple Silicon ecosystem, model landscape queries.
- Lines 103-109: **Trigger table specific entries** — OpenClaw-specific triggers (Tim follow-up, macOS update for launchd/TCC, model pricing for OpenClaw routing).

### Split Strategy

This file becomes **two files:**

1. **`engine/methodology/research-cadence-template.md`** — the engine template containing:
   - Three-tier periodic sweep structure (weekly/biweekly/monthly) with placeholder queries
   - Trigger-based research table with generic triggers (new version, CVE, new competitor, something breaks)
   - Four logging layers and decision tree (verbatim — this is core engine)
   - Staleness rules table with default thresholds
   - Meta-research evaluation concept
   - Anti-patterns (verbatim)
   - Tools reference structure
   - Success metrics (verbatim)

2. **`outputs/openclaw-sean/knowledge-base/07-operations/research-cadence.md`** — the current file, kept intact as the first output instance. All OpenClaw-specific queries and evidence preserved.

**Line accounting:** 228 lines total. ENGINE: ~148 lines (methodology structures, logging pipeline, anti-patterns, success metrics). OUTPUT: ~60 lines (OpenClaw-specific queries, evidence, triggers). Shared/formatting: ~20 lines.

---

## 6. `docs/walkthrough/interactive/src/convert.mjs` (1304 lines)

### Sections that are ENGINE (extract as template)

- Lines 1-3: **Imports** — standard Node.js file/path imports. Engine (generic).
- Lines 12-32: **Helper functions** — `escapeHtml()`, `inlineMarkdown()`, `slugify()`. These are generic markdown-to-HTML utilities. Engine.
- Lines 34-138: **`parseBlocks()` function** — generic markdown block parser (headings, paragraphs, code blocks, tables, ordered lists, unordered lists with checkboxes, horizontal rules). Engine — works on any markdown walkthrough.
- Lines 140-165: **`parseTable()` function** — generic markdown table to HTML converter. Engine.
- Lines 243-377: **`renderBlock()` function** — generic block-to-HTML renderer. The callout detection patterns (CRITICAL, WARNING, TIP, Concept, Transferable concept, Expected output, If something's wrong, Security note, Important) are engine-level style guide conventions. The code block, table, list, checkbox rendering is all generic.
- Lines 379-481: **Phase rendering functions** — `renderPhaseBlocks()` and `renderPhase()` are generic phase-section renderers. The understanding-section tracking, deployment-notes tracking, and section-closing logic is engine.
- Lines 483-523: **Pre-phase and appendix rendering** — `renderPrePhase()`, `renderAppendix()`. Generic structure rendering.
- Lines 525-571: **`buildNav()` function** — sidebar navigation builder. The structure (intro link, top sections, phase groups, appendix, progress bar) is engine. The nav group labels ('PREPARATION', 'DEPLOYMENT', 'CONNECTION', 'VALIDATION') are output-specific but the grouping mechanism is engine.
- Lines 573-1082: **`buildCSS()` function** — the entire CSS design system (custom properties, layout, typography, code blocks, callouts, understanding sections, expandable sections, tables, checkboxes, deployment notes, diagrams, print styles, responsive breakpoints). This is engine — it's the walkthrough style guide implemented as CSS.
- Lines 1084-1241: **`buildJS()` function** — theme toggle, copy-to-clipboard, expandable sections, checkbox persistence (localStorage), scroll spy, smooth scroll, mobile hamburger, phase completion tracking, progress bar. All generic interactive walkthrough functionality. Engine.
- Lines 1244-1289: **HTML assembly** — the document structure (DOCTYPE, head, body, sidebar, main content, script). Engine template.
- Lines 1291-1304: **Verification output** — console.log of generation stats. Engine.

### Sections that are OUTPUT (parameterize for outputs/openclaw-sean/)

- Lines 5-7: **Source and output paths** — hardcoded paths to `2026-02-11-v1-initial-deployment.md` and `index.html`. These are output-specific file references.
- Lines 167-177: **`detectPhaseInfo()` function** — the regex pattern `Phase\s+(\w+):\s*(.+)` is actually generic (works for any "Phase X: Title" format). Engine.
- Lines 382-404: **`diagramPlacements` and `phaseTimeEstimates` objects** — hardcoded OpenClaw phase IDs ('0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i') with specific diagram names and time estimates. Output-specific.
- Lines 406-407: **`securityCritical` array** — `['d', 'h']` — output-specific phase marking.
- Lines 409-415: **`navGroups` object** — phase grouping into PREPARATION/DEPLOYMENT/CONNECTION/VALIDATION with specific phase IDs. Output-specific (though the concept of nav groups is engine).
- Lines 531: **Sidebar title** — hardcoded "OpenClaw Walkthrough". Output-specific.
- Lines 564: **Progress bar initial text** — references `phases.length` (generic, engine).

### Split Strategy

This file becomes **two files:**

1. **`engine/templates/walkthrough-converter/convert.mjs`** — the engine template converter with:
   - All helper functions (escapeHtml, inlineMarkdown, slugify)
   - Full parseBlocks and parseTable functions
   - All rendering functions (renderBlock, renderPhaseBlocks, renderPhase, renderPrePhase, renderAppendix)
   - buildNav, buildCSS, buildJS functions (complete)
   - HTML assembly logic
   - Verification output
   - **Configuration extracted to a separate config object** at the top of the file (or imported from a JSON/JS config):
     ```js
     const config = {
       srcPath: '...',        // markdown source
       outPath: '...',        // HTML output
       title: '...',          // sidebar title
       diagramPlacements: {}, // phase -> diagram ID mapping
       phaseTimeEstimates: {},// phase -> time string
       securityCritical: [],  // phase IDs with security emphasis
       navGroups: {},         // label -> phase ID arrays
     };
     ```

2. **`outputs/openclaw-sean/docs/walkthrough/interactive/src/convert-config.mjs`** (or inline in the output's convert.mjs) — the OpenClaw-specific configuration:
   - Source path to OpenClaw walkthrough markdown
   - Output path
   - Title: "OpenClaw Walkthrough"
   - diagramPlacements, phaseTimeEstimates, securityCritical, navGroups with OpenClaw values

**Line accounting:** 1304 lines total. ENGINE: ~1275 lines (nearly the entire converter is generic). OUTPUT: ~29 lines (hardcoded paths, phase configs, title string). The ratio is extreme — this file is ~98% engine, ~2% output configuration.

---

## 7. `docs/walkthrough/interactive/src/index.html` (2193 lines)

### Sections that are ENGINE (extract as template)

- Lines 1-512: **HTML head + CSS** — the complete design system (CSS custom properties, layout, typography, code blocks, callouts, understanding sections, expandable sections, tables, checkboxes, deployment notes, diagrams, print styles, responsive breakpoints). This is the same CSS that `buildCSS()` in convert.mjs generates. Engine style guide.
- Lines 514-531: **HTML structure boilerplate** — hamburger button, sidebar backdrop, diagram placeholder, sidebar shell with theme toggle. Engine.
- Lines 2044-2193: **JavaScript** — theme toggle, copy-to-clipboard, expandable sections, checkbox persistence, scroll spy, smooth scroll, mobile hamburger, phase completion tracking, progress bar. Engine (identical to buildJS() output).

### Sections that are OUTPUT (outputs/openclaw-sean/)

- Line 6: **Title** — "OpenClaw Deployment Walkthrough". Output-specific.
- Lines 532-534: **Sidebar title** — "OpenClaw Walkthrough". Output-specific.
- Lines 535-595: **Sidebar navigation items** — specific phase names (Machine Preparation, macOS Hardening, Runtime Setup, OpenClaw Installation, Security Hardening, Model Configuration, Channel Setup, Starter Skills, Validation, Post-Deployment), nav group labels (PREPARATION, DEPLOYMENT, CONNECTION, VALIDATION, REFERENCE). Output-specific.
- Lines 596-2043: **Main content** — the entire walkthrough body content: all phase sections with OpenClaw-specific commands, explanations, CVE details, version requirements, macOS configuration, Tailscale setup, firewall rules, security hardening config, model routing, channel setup, skill configuration, validation checklists, deployment notes sections, understanding sections. This is 100% OpenClaw output content.

### Split Strategy

This file is a **generated artifact** (output of convert.mjs). It does NOT need to be split directly. Instead:

1. **Engine keeps:** The convert.mjs template (see file 6 above), which generates this HTML. The CSS and JS are embedded in buildCSS() and buildJS() — they are the engine's style system.

2. **Output keeps:** The generated `index.html` file as-is at `outputs/openclaw-sean/docs/walkthrough/interactive/src/index.html`. It's the build output of running the engine's converter on the OpenClaw walkthrough markdown.

3. **No manual split needed.** The split happens at the converter level (file 6). This file is regenerated from source markdown + engine converter.

**Line accounting:** 2193 lines total. ENGINE: ~660 lines (CSS + JS framework, identical to converter functions). OUTPUT: ~1533 lines (content, navigation, title — all OpenClaw-specific). But since this is a generated file, the real split is in convert.mjs.

---

## 8. `knowledge-base/07-operations/operational-runbook-template.md` (1047 lines)

### Sections that are ENGINE (extract as template)

- Lines 1-5: **Header pattern** — "Operational Runbook" concept with TEMPLATE status, target platform field. Engine template structure.
- Lines 9-21: **Purpose section structure** — the runbook covers list (service lifecycle, access/auth, updates/patching, skills management, monitoring, backup/recovery, emergency procedures, troubleshooting). This checklist of operational categories is engine — any agent platform needs these same categories.
- Lines 25-119: **Service Management section structure** — the categories (check if running, start, stop, restart, reinstall service) are engine. The command patterns (check service status, verify port, start/stop/restart service, reinstall) are transferable to any agent platform on any OS.
- Lines 122-170: **Gateway Access section structure** — local access and remote access patterns are engine. The concept of loopback binding + VPN tunneling for secure remote access is engine methodology.
- Lines 174-271: **Updating section structure** — pre-update checklist (check version, read changelog, backup, check advisories, review config changes), update procedure, post-update validation. This entire workflow is engine — it applies to any software update on any platform.
- Lines 274-405: **Adding/Removing Skills section structure** — security vetting process concept, skill addition workflow, disabling/removing skills, bundled skills management. The structure is engine.
- Lines 409-502: **Monitoring section structure** — log locations pattern, daily/weekly check cadence, signs-of-problems table structure, token usage tracking concept. Engine.
- Lines 506-601: **Backup & Recovery section structure** — what to back up (critical vs regenerable), backup methods pattern (OS-native + manual script + scheduled), config-as-code pattern (template approach with secrets removed), recovery procedures by scenario. Engine.
- Lines 674-805: **Emergency Procedures structure** — STOP/REVOKE/ROTATE/INCIDENT RESPONSE procedures. The emergency response framework (contain -> freeze -> rotate -> audit -> document -> recover -> report) is engine methodology.
- Lines 809-994: **Troubleshooting section structure** — the issue/symptoms/fix/source template, the "when to check logs" table structure. Engine.
- Lines 997-1025: **Quick Reference Commands structure** — the categorized command reference concept. Engine.
- Lines 1029-1047: **Notes for Future Population** — the concept of "during deployment, add X" and "during operation, add Y" guidance. Engine.

### Sections that are OUTPUT (outputs/openclaw-sean/)

- Lines 1-5: **Header values** — "OpenClaw on Mac Mini", "Apple M4 Mac Mini (16GB RAM), macOS, Tailscale VPN configured". Output-specific.
- Lines 30-52: **Service management commands** — `launchctl list | grep openclaw`, `com.openclaw.gateway`, port 18789, `/tmp/openclaw/` log paths. All OpenClaw-specific commands.
- Lines 57-67: **Start commands** — `launchctl start com.openclaw.gateway`, `openclaw gateway start`, `curl http://127.0.0.1:18789/health`. OpenClaw-specific.
- Lines 73-84: **Stop commands** — OpenClaw-specific kill/verify commands.
- Lines 90-103: **Restart commands and triggers** — `openclaw.json`, specific restart triggers. OpenClaw-specific.
- Lines 110-118: **Reinstall commands** — `openclaw gateway uninstall/install`. OpenClaw-specific.
- Lines 126-170: **Access details** — port 18789, auth-profiles.json, Tailscale Serve commands, Tailscale identity headers config JSON. OpenClaw-specific.
- Lines 179-237: **Update commands** — `npm update -g openclaw`, `openclaw doctor`, `openclaw security audit`. OpenClaw-specific.
- Lines 246-265: **Post-update validation commands** — OpenClaw-specific test steps.
- Lines 278-281: **Security stats** — ClawHub malicious percentages, Koi Security citation. OpenClaw-specific.
- Lines 291-342: **Skill template** — YAML frontmatter + markdown skill structure. OpenClaw-specific skill format.
- Lines 361-405: **Bundled skills config** — `skills.allowBundled`, `openclaw skills list --bundled`. OpenClaw-specific.
- Lines 413-437: **Log paths and commands** — `/tmp/openclaw/` paths, agent session paths. OpenClaw-specific.
- Lines 443-457: **Daily/weekly check commands** — OpenClaw-specific monitoring commands.
- Lines 463-472: **Signs of problems table** — OpenClaw-specific symptoms (streaming "U" output, ClawHub issues, browser tool crashes). OpenClaw-specific.
- Lines 479-502: **Token tracking config** — OpenClaw logging config JSON, provider dashboard URLs, cost optimization tips. OpenClaw-specific.
- Lines 511-599: **Backup paths and methods** — `~/.openclaw/` specific paths, Time Machine + manual script with OpenClaw paths. OpenClaw-specific.
- Lines 607-670: **Recovery scenarios** — OpenClaw-specific recovery commands. OpenClaw-specific.
- Lines 680-805: **Emergency procedure commands** — OpenClaw-specific kill/revoke/rotate commands, Tailscale-specific steps, credential rotation script. OpenClaw-specific (though the procedure structure is engine).
- Lines 813-993: **Troubleshooting entries** — all OpenClaw-specific issues (streaming "U", context length, browser tool, Keychain, config corruption, model API errors). OpenClaw-specific.
- Lines 999-1025: **Quick reference commands** — OpenClaw-specific command cheat sheet.
- Lines 1031-1047: **Future population notes** — OpenClaw-specific items to add (Tailscale hostname, channel config, model routing, etc.).

### Split Strategy

This file becomes **two files:**

1. **`engine/templates/operational-runbook-template.md`** — a skeleton template with:
   - All section headers and structural categories preserved
   - Command placeholders: `[CHECK_SERVICE_CMD]`, `[START_CMD]`, `[STOP_CMD]`, `[PORT]`, `[CONFIG_PATH]`, `[LOG_PATH]`, etc.
   - The emergency response framework (STOP/REVOKE/ROTATE/INCIDENT RESPONSE) with generic steps
   - The troubleshooting issue template structure (issue/symptoms/fix/source)
   - The backup strategy categories (what to back up, methods, recovery scenarios)
   - "Fill in during deployment" and "fill in during operation" guidance preserved
   - Approximately 40-50% of the current file by line count (structure without implementation details)

2. **`outputs/openclaw-sean/knowledge-base/07-operations/operational-runbook-template.md`** — the current file, moved as-is. It serves as both the output-specific runbook AND the reference implementation showing how the engine template gets populated.

**Line accounting:** 1047 lines total. ENGINE: ~350 lines (section structures, frameworks, patterns, placeholders). OUTPUT: ~620 lines (all OpenClaw-specific commands, configs, paths, troubleshooting). Shared/formatting: ~77 lines.

---

## 9. `skills/session-restart/SKILL.md` (198 lines)

### Sections that are ENGINE (extract as template)

- Lines 1-10: **YAML frontmatter structure** — the skill frontmatter pattern (name, description with trigger phrases) is engine. The trigger phrases ("restart session", "refresh context", "new session", "pick up where we left off", "reload project", "what were we doing") are generic enough to be engine-level.
- Lines 13-15: **Intro pattern** — "You're an agent resuming work on [operator]'s [project]. This skill gets you oriented fast without bloating the context window." Engine template.
- Lines 17-23: **Step 1: Load Session State** — the concept of reading a session state file as single source of truth. Engine. The specific file path `operator/session-state.md` is parameterizable.
- Lines 25-31: **Session state tracking concept** — what it tracks (phase, tasks, blockers, last session, next up). Engine.
- Lines 33-68: **Step 2: Load Core Context (Selectively)** — the selective loading pattern (always read CONTEXT.md, conditionally read purpose/calibration/deployment docs). Engine methodology. The specific file paths are output parameters.
- Lines 70-83: **Step 3: Check Staleness** — staleness check procedure (look at last_updated, flag if >5 days, check intelligence log tail). Engine.
- Lines 85-103: **Step 4: Present Session Brief** — the brief format template (current phase, last session, next up, blockers, days since last). Engine.
- Lines 105-112: **Step 5: Update Session State** — when to update (phase complete, blocker discovered, decision made, session end). Engine.
- Lines 114-167: **Session State Template** — the markdown template for session-state.md (walkthrough progress table, current focus, next up, session history, decisions, notes for next). Engine template structure.
- Lines 185-198: **Context Window Efficiency** — the "what NOT to do" guidance (don't read every KB file, don't read full walkthrough, don't re-read purpose unless needed, don't dump activity log). Engine methodology.

### Sections that are OUTPUT (parameterize for outputs/openclaw-sean/)

- Lines 1-2: **Skill name** — "session-restart" is generic enough (engine). But the description references "ClawdBot Research Project" specifically. Output.
- Lines 13-14: **Intro text** — "Sean Currie's ClawdBot Research Project". Output-specific.
- Lines 22: **File path** — `operator/session-state.md`. Output-specific path (though convention may be engine-standard).
- Lines 41: **File reference** — `CONTEXT.md` (engine-standard, but context is output-specific).
- Lines 47-49: **File reference** — `operator/project-genesis.md`. Output-specific.
- Lines 57-59: **File reference** — `operator/purpose-refinement-2026-02-22.md`. Output-specific.
- Lines 64-66: **File reference** — `docs/walkthrough/crib-sheet.md`. Output-specific.
- Lines 128-137: **Walkthrough progress table** — OpenClaw-specific phase names (Machine Preparation, macOS Hardening, Runtime Setup, OpenClaw Installation, Security Hardening, Model Configuration, Channel Setup, Starter Skills & First Run, Validation, Post-Deployment). Output-specific.
- Lines 169-183: **Operator Calibration Reminders** — mix of engine DNA ("challenge, don't agree", "transferable > tool-specific", "agent vs. automation") and output-specific framing ("learning lab", OpenClaw references). The DNA principles are engine; the specific framing is output.

### Split Strategy

This file becomes **two files:**

1. **`engine/templates/skills/session-restart/SKILL.md`** — engine template with:
   - Generic YAML frontmatter (parameterized project name in description)
   - All 5 steps preserved with `{{PROJECT_NAME}}`, `{{OPERATOR_NAME}}`, `{{SESSION_STATE_PATH}}`, `{{CONTEXT_PATH}}`, `{{PURPOSE_DOC_PATH}}`, `{{CALIBRATION_DOC_PATH}}`, `{{DEPLOYMENT_REF_PATH}}` placeholders
   - Session state template with placeholder phase table (phases vary per output)
   - Operator calibration reminders with engine DNA only (challenge over agreement, transferable over tool-specific, log significant things)
   - Context window efficiency guidance (verbatim — fully generic)

2. **`outputs/openclaw-sean/skills/session-restart/SKILL.md`** — the current file, moved as-is. All OpenClaw-specific file paths, phase names, and Sean-specific framing preserved.

**Line accounting:** 198 lines total. ENGINE: ~145 lines (all procedural methodology, templates, efficiency guidance). OUTPUT: ~40 lines (project name, operator name, file paths, phase table entries, OpenClaw framing). Shared/formatting: ~13 lines.

---

## Summary Table

| # | File | Lines | ENGINE | OUTPUT | DNA | Split Into |
|---|------|-------|--------|--------|-----|------------|
| 1 | `CLAUDE.md` | 230 | ~87 (38%) | ~75 (33%) | ~16 (7%) | 2 files: root CLAUDE.md (engine+DNA), output CLAUDE.md |
| 2 | `CONTEXT.md` | 188 | ~16 (9%) | ~155 (82%) | 0 | 2 files: root CONTEXT.md (engine), output CONTEXT.md |
| 3 | `CONTEXT-HISTORY.md` | 134 | 0 (pattern only) | 134 (100%) | 0 | 2 files: root CONTEXT-HISTORY.md (empty+pattern), output moves as-is |
| 4 | `operator/project-genesis.md` | 133 | ~33 (25%) | ~80 (60%) | ~9 (7%) | 2 files: engine template, output moves as-is |
| 5 | `research-cadence.md` | 228 | ~148 (65%) | ~60 (26%) | 0 | 2 files: engine template, output moves as-is |
| 6 | `convert.mjs` | 1304 | ~1275 (98%) | ~29 (2%) | 0 | 2 files: engine converter (config extracted), output config |
| 7 | `index.html` | 2193 | ~660 (30%) | ~1533 (70%) | 0 | No manual split — generated artifact; split at converter level |
| 8 | `operational-runbook-template.md` | 1047 | ~350 (33%) | ~620 (59%) | 0 | 2 files: engine skeleton template, output moves as-is |
| 9 | `session-restart/SKILL.md` | 198 | ~145 (73%) | ~40 (20%) | 0 | 2 files: engine template (parameterized), output moves as-is |

**Totals across all hybrid files:**
- Total lines analyzed: 5,655
- ENGINE content: ~2,714 lines (48%)
- OUTPUT content: ~2,726 lines (48%)
- DNA content: ~25 lines (0.4%)
- Shared/formatting: ~190 lines (3.4%)

---

## Uncertain Split Decisions

1. **CLAUDE.md Non-Negotiable Rules (lines 49-64):** Classified as DNA because they express editorial values, but they could also be argued as ENGINE (they're operational rules the engine enforces). Decision: DNA at root, since they govern all engine behavior including engine development itself.

2. **Research cadence staleness thresholds (lines 167-178):** These specific numbers (5 days for CONTEXT, 30 days for reports, etc.) could be engine defaults or output-specific tuning. Decision: ENGINE defaults — they can be overridden per output but the defaults reflect the engine's opinion on fast-moving tech ecosystems.

3. **Session-restart calibration reminders (lines 169-183):** Mix of DNA principles and output-specific framing. Decision: Split — DNA principles stay in engine template, output-specific framing stays in output instance.

4. **Operational runbook emergency procedures (lines 674-805):** The STOP/REVOKE/ROTATE/INCIDENT RESPONSE framework is engine, but the specific commands are deeply OpenClaw-interleaved. Decision: Engine gets the framework structure with command placeholders; output keeps the full populated version.

5. **index.html as generated artifact:** Since this file is the output of running convert.mjs, it technically doesn't need its own split — the split happens at the converter level. Decision: Treat it as output (move as-is) and note that the engine template is the converter, not the HTML.

6. **convert.mjs nav group labels ('PREPARATION', 'DEPLOYMENT', 'CONNECTION', 'VALIDATION'):** These are somewhat generic but also reflect the specific phase grouping of the OpenClaw walkthrough. Decision: OUTPUT configuration — different walkthroughs will have different phase groupings.
