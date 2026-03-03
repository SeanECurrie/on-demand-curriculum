# Output Project Structure — Scaffold Template

**Purpose:** Every new engine output gets this directory structure. It provides consistent organization so the engine's methodology, session continuity, and research pipeline work the same way regardless of topic.

**Created by:** Engine Task 7 (2026-03-03)

---

## The Scaffold

When the engine creates a new output, it generates this structure:

```
outputs/[name]/
├── operator/
│   └── [name]-profile.md          # Who this output is for — background, goals, hardware, constraints
├── knowledge-base/
│   ├── 01-landscape/              # Competitive landscape — tools, comparisons, positioning
│   ├── 02-architecture/           # Tool internals — how it works, from docs AND reality
│   ├── 03-security/               # Threat models, hardening, best practices, attack surfaces
│   ├── 04-deployment/             # Hardware/platform setup, config, operations
│   ├── 05-skills-and-integrations/  # Extensibility — skills, plugins, connected services
│   ├── 06-community-intelligence/ # Reddit, YouTube, creator insights, expert knowledge
│   └── 07-operations/             # Running it, monitoring, maintaining, troubleshooting
├── research/
│   ├── sources.md                 # All sources with credibility tier, URL, date accessed
│   ├── reports/                   # 5-report evaluation framework (see report-templates/)
│   └── scrapes/                   # Raw Bright Data outputs — persist before synthesizing
├── docs/
│   └── walkthrough/
│       ├── interactive/           # HTML walkthrough (primary deliverable)
│       └── crib-sheet.md          # Quick-reference command sheet
├── patterns/                      # Reusable patterns extracted during research
├── CONTEXT.md                     # Current state — what happened, what's next, key decisions
├── activity-log.md                # Lightweight breadcrumbs — what happened, when
├── intelligence-log.md            # Strategic insights — hypotheses validated, contradictions found
└── session-state.md               # Session continuity — walkthrough progress, blockers, history
```

---

## Bucket Naming

The 7 knowledge-base buckets are a framework, not rigid labels. The numbering (01-07) and general purpose stays constant, but the names adapt to the topic:

| Bucket | Default Name | Example Adaptation |
|--------|-------------|-------------------|
| 01 | landscape | Always "landscape" — every tool has competitors |
| 02 | architecture | Could be "internals" for non-software topics |
| 03 | security | Could be "risk-assessment" for non-tech deployments |
| 04 | deployment | Could be "setup" or "installation" |
| 05 | skills-and-integrations | "plugins-and-extensions", "modules", "add-ons" — whatever the tool calls its extensibility |
| 06 | community-intelligence | Always "community-intelligence" — dual-source methodology requires it |
| 07 | operations | Could be "maintenance" or "ongoing-management" |

**Rule:** Rename to match the tool's vocabulary, but keep the numbering and the underlying purpose. Bucket 03 is always about risk. Bucket 06 is always about what real users say vs. what the docs claim.

---

## What Each Directory Contains

### `operator/`
The person this output is for. Background, capabilities, infrastructure, working style, goals. This is the intake output — the engine's understanding of who it's serving. One file per operator.

### `knowledge-base/`
Refined, synthesized knowledge organized by bucket. Each file is date-stamped and accumulates (never deletes — mark outdated content with `[OUTDATED as of YYYY-MM-DD]`). Raw research goes to `research/scrapes/`, synthesized knowledge goes here.

### `research/`
The research trail. `sources.md` is the master source list with credibility tiers. `reports/` holds the 5 evaluation reports (see `engine/templates/report-templates/`). `scrapes/` holds raw outputs from Bright Data and other research tools — persist these before synthesizing.

### `docs/walkthrough/`
The primary deliverable. The interactive HTML walkthrough lives in `interactive/`. The crib sheet is a quick-reference command sheet for operators who've already read the walkthrough.

### `patterns/`
Reusable patterns extracted during research. Each pattern gets a numbered file (e.g., `001-zero-clawhub-supply-chain-defense.md`). Patterns are transferable insights — they apply beyond the specific tool being researched.

### Root files
- `CONTEXT.md` — Single source of truth for current state. See `CONTEXT-template.md`.
- `activity-log.md` — Lightweight breadcrumbs. See `activity-log-template.md`.
- `intelligence-log.md` — Strategic insights only. See `intelligence-log-template.md`.
- `session-state.md` — Session continuity. See `session-state-template.md`.

---

## Scaffold Creation

When creating a new output, the engine:

1. Creates the directory structure above under `outputs/[name]/`
2. Populates templates from `engine/templates/project-structure/`
3. Creates empty KB bucket directories with `.gitkeep` files
4. Creates `research/sources.md` with header only
5. Fills in `[TOOL_NAME]`, `[OPERATOR_NAME]`, `[HARDWARE]` placeholders from intake

The scaffold is the skeleton. Research fills the muscle. The walkthrough is the deliverable.
