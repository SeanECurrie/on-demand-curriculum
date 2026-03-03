# On-Demand Curriculum Engine — Design Document

**Date:** 2026-03-03
**Author:** Sean Currie + Claude
**Status:** Approved (brainstorming session)
**Builds On:** ClawdBot Research Project (Output #1)
**Repo:** SeanECurrie/on-demand-curriculum (private)

---

## 1. What This Is

The ClawdBot Research Project produced a high-quality, research-backed, interactive deployment walkthrough for OpenClaw — tailored to Sean's hardware, skill level, security posture, and professional goals. That output took ~38-40 hours across 12 days, consumed 130+ sources, and produced 9,000+ lines of knowledge base, reports, patterns, and a 3,030-line interactive HTML walkthrough.

This design document describes how to restructure the existing repo into a **reusable engine** that can produce equivalent-quality outputs for different people on different topics — without losing anything from the original project.

The engine encodes the **process** (how to research, evaluate, and produce a tailored walkthrough) separately from the **output** (OpenClaw-specific content for Sean). The original project becomes Output #1 — proof that the engine works, and the reference implementation for quality.

---

## 2. The Problem

The current repo has engine and output intertwined. Reusable methodology (dual-source research, credibility tiers, three-tier hardening, session continuity, pattern extraction) lives alongside OpenClaw-specific content (CVEs, configs, Mac Mini hardware details) in the same files. To produce a second output, you'd have to manually disentangle what's reusable from what's specific — every time.

The restructure makes this separation explicit and permanent.

---

## 3. Design Principles

These govern every restructuring decision:

1. **Nothing is lost.** Every file, every section, every line of the current project must be accounted for in the new structure. Restructure, don't delete. Git history preserved.

2. **Engine encodes process, not content.** The engine knows HOW to research, evaluate, and produce walkthroughs. It doesn't contain OpenClaw findings — those live in the output.

3. **DNA is the most durable layer.** Sean's editorial values (evidence-based pushback, security-as-a-lens, transferable-over-specific, honest assessment, community-as-primary-source) govern all outputs. These live at the engine level, not per-output.

4. **Outputs are self-contained.** Each output should be understandable on its own. Someone looking at `outputs/openclaw-sean/` should be able to follow the walkthrough without reading engine internals.

5. **The structure stays malleable.** This is v1 of the engine. It will evolve as more outputs are produced. Don't over-engineer for hypothetical future needs.

6. **Audit before action.** The implementation plan includes systematic review of every file before any move. Agents classify, then decide, then act — not the reverse.

---

## 4. Three-Layer Architecture

### Layer 1: DNA (Root Level)

Sean's editorial values and collaboration rules. These are non-negotiable across all outputs.

**What lives here:**
- Root `CLAUDE.md` — engine constitution encoding: editorial DNA, research methodology, pipeline description, operator rules, skill chain
- Root `CONTEXT.md` — engine-level state (what outputs exist, what's in progress, engine evolution)

**DNA principles (extracted from current CLAUDE.md and purpose refinement):**
- Research before agreeing with any hypothesis
- Push back when evidence contradicts assumptions
- Bring data and sources, not agreement
- Security is a lens on every decision, not a phase
- Distinguish transferable learning from tool-specific detail
- Living documentation — mark outdated, never delete
- Agent vs. automation: always ask if a deterministic script does it better
- Honest assessment of residual risk — no "this is completely secure"
- Community expertise weighted equally with official docs
- Contradictions are signals, not errors

### Layer 2: Engine (`engine/`)

The reusable process, methodology, and templates that produce outputs.

**Subdirectories:**

```
engine/
├── methodology/              # How to do the work
│   ├── dual-source-intelligence.md    # Context7 + Bright Data methodology
│   ├── credibility-tiers.md           # 5-tier source weighting system
│   ├── three-tier-hardening.md        # Essential / Educational / Operational
│   ├── research-cadence-template.md   # Staleness management framework
│   └── editorial-standards.md         # Quality bar for outputs
├── intake/                   # How new outputs start
│   ├── intake-process.md              # Pipeline: raw input → operator profile → research scope
│   └── operator-profile-template.md   # What to capture about the person
├── templates/                # Structural templates
│   ├── project-structure/             # KB bucket scaffold, log templates, session state
│   ├── report-templates/              # 5-report evaluation framework
│   ├── walkthrough-style-guide.md     # Visual/UX spec for interactive output
│   └── interactive-html/              # HTML shell, CSS framework, JS components
├── patterns/                 # Cross-output reusable patterns
│   └── (extracted from current patterns/)
└── skills/                   # Engine-level skills
    └── session-restart/               # Adapted for engine context
```

**Key methodology documents to extract/create:**

- **Dual-source intelligence:** Currently embedded in CLAUDE.md sections. Extract to standalone doc with the three operating modes, the rule ("neither stands alone"), and tool-specific instructions (Context7 queries, Bright Data searches).
- **Credibility tiers:** Currently a table in CLAUDE.md. Extract with examples from the OpenClaw project showing how tiers were applied in practice.
- **Three-tier hardening:** Currently described in walkthrough intro and CLAUDE.md deployment posture section. Extract as a standalone framework applicable to any agent platform or security-sensitive deployment.
- **Research cadence template:** Currently in `knowledge-base/07-operations/research-cadence.md`. Genericize — remove OpenClaw-specific queries, keep the framework (weekly/biweekly/monthly/trigger-based).
- **Intake process:** NEW. Describes how Sean feeds raw input (iMessage dumps, his own context, links) and the engine brainstorms, asks clarifying questions, and builds an operator profile.
- **Operator profile template:** NEW. Captures: who is this person, tech background, hardware/infrastructure, goals, current knowledge level, misconceptions to address, professional context.

### Layer 3: Outputs (`outputs/`)

Each person's tailored deliverable.

```
outputs/
└── openclaw-sean/            # Output #1 (current project, relocated)
    ├── operator/             # Sean's operator context
    ├── knowledge-base/       # 7 buckets of OpenClaw research
    ├── research/             # Sources, reports, scrapes
    ├── docs/                 # Walkthrough, crib sheet, interactive HTML
    ├── CONTEXT.md            # Output-specific state
    ├── activity-log.md       # Output-specific activity
    ├── intelligence-log.md   # Output-specific strategic insights
    ├── CONTEXT-HISTORY.md    # Output-specific history
    └── session-state.md      # Output-specific session tracking
```

**Self-containment rule:** Someone should be able to `cd outputs/openclaw-sean/` and understand the full OpenClaw walkthrough without reading engine docs. The engine produced this output; the output stands on its own.

**Future outputs** follow the same structure:
```
outputs/
├── openclaw-sean/
├── openclaw-jeff/            # Same tool, different person
├── github-actions-client-x/  # Different topic entirely
└── ...
```

---

## 5. The Engine Pipeline

When Sean wants to produce a new output, the engine runs these stages:

### Stage 1: Intake

**Input:** Whatever Sean has — iMessage conversation, his own notes, a link, a verbal description of what the person wants.

**Process:** The engine brainstorms with Sean (not the end user). It asks clarifying questions to build an operator profile:
- Who is this person? (background, tech level, working style)
- What do they want to do? (stated goal)
- What do they actually need? (may differ from stated goal — the engine pushes back)
- What hardware/infrastructure do they have or plan to get?
- What's their current knowledge level? (what they know, what they think they know, what they don't know they don't know)
- What misconceptions need addressing?
- What's their risk tolerance and professional context?

**Output:** An operator profile and a scoped research brief.

### Stage 2: Research

**Process:** Dual-source intelligence runs against the person's specific situation.
- Context7 pulls official docs for the tool/topic
- Bright Data scrapes community intelligence (Reddit, YouTube, GitHub, blogs)
- Cross-validation: where do docs and community agree/contradict?
- Source credibility tiering applied to all findings

**Scoping:** Not every output needs all 5 reports. The engine assesses:
- Landscape report: needed if the person hasn't chosen a tool yet
- Architecture report: needed if the tool is complex enough to warrant understanding internals
- Feasibility report: needed if hardware/platform compatibility is a question
- Security report: needed if the tool has security implications (agent platforms always do)
- Open questions: always produced — captures what needs hands-on testing

**Output:** Populated knowledge base buckets, research reports, intelligence log entries.

### Stage 3: Synthesis

**Process:** Research gets synthesized into an honest assessment.
- Is this the right tool for this person? (maybe the answer is "no" or "not yet")
- What do they need to understand before starting?
- Where should they be challenged? (misconceptions, unrealistic expectations)
- What's the three-tier hardening breakdown for their situation?
- What transferable concepts apply?

**Output:** Synthesized knowledge base, strategic assessment, walkthrough outline.

### Stage 4: Output Generation

**Process:** The interactive walkthrough gets built using the templates and style guide.
- Phase structure adapted to the topic (not every output has 10 phases)
- Understanding sections written for their knowledge level
- Commands/configs tailored to their hardware and setup
- Three-tier hardening applied (essential/educational/operational polish labeled)
- Crib sheet generated as quick reference
- Interactive HTML built from the style guide framework

**Output:** Complete walkthrough (markdown + interactive HTML), crib sheet, build/fidelity reports.

### Stage 5: Delivery

**Malleable by design.** Could be:
- GitHub Pages link to the interactive HTML
- Walking them through it on a call
- Setting up their own repo if they want to go deeper
- Something else entirely depending on the person and situation

The engine produces the output. How it reaches the person is Sean's call every time.

---

## 6. What the Implementation Plan Will Cover

The plan prescribes a systematic, agent-driven process:

### Phase 1: Systematic Audit
Agents read every file in the current repo. Every section gets classified: engine, output, DNA, or hybrid. Every file gets a disposition: move as-is, split and move, extract template from, or leave in place. Produces a complete audit manifest.

### Phase 2: Engine Extraction
Based on the audit manifest, agents extract reusable methodology, templates, and patterns up to `engine/`. New methodology docs get written (intake process, operator profile template, editorial standards). Templates get created from the OpenClaw output (walkthrough structure, report framework, KB scaffold). Every extraction is verified against the original.

### Phase 3: Output Relocation
OpenClaw-specific content moves under `outputs/openclaw-sean/`. Internal references get updated. Links get fixed. The output is verified as self-contained — you can navigate it without engine knowledge.

### Phase 4: Engine Constitution
Root CLAUDE.md gets rewritten as the engine constitution. It encodes: DNA principles, methodology references, pipeline description, operator rules, output management, and the skill chain for engine-level work.

### Phase 5: Verification
Full verification sweep: every file accounted for, all references resolve, OpenClaw output works standalone, engine structure supports producing a second output, git history clean. Verification report produced.

**Each phase has a review checkpoint.** Sean approves before the next phase starts.

---

## 7. What This Design Does NOT Cover

- **Jeff's output.** Jeff is a test case for the engine, not part of this design. Once the engine is built and verified, Jeff becomes the first real test.
- **GitHub Pages setup.** Hosting the interactive HTML is a delivery detail, not an engine design question. Handle it when the first output needs to be shared.
- **Automation of the pipeline.** The engine is Claude + Sean working together, not an automated pipeline. If automation makes sense later, that's an evolution, not a v1 requirement.
- **Pricing or productization.** Sean is doing this for friends and learning. If it becomes a service later, the engine adapts — but don't design for that now.

---

## 8. Success Criteria

The restructure is complete when:

1. Every file from the current repo is accounted for in the new structure
2. `outputs/openclaw-sean/` is self-contained and navigable
3. `engine/` contains all reusable methodology, templates, and patterns
4. Root `CLAUDE.md` functions as the engine constitution
5. A new session starting from scratch can understand how to produce a new output by reading the engine docs
6. The OpenClaw interactive walkthrough still works (no broken links, missing content)
7. Git history shows restructure, not deletion
8. Sean reviews and approves
