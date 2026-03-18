---
name: session-restart
description: >
  Session restart and context reload for the On-Demand Curriculum Engine. Use whenever
  starting a new session, resuming after compaction, recovering from a closed session,
  or when context feels stale. Trigger phrases: "restart session", "refresh context",
  "new session", "pick up where we left off", "reload project", "what were we doing",
  "let's work on [output name]", or any variation of resuming work. This skill discovers
  available outputs via OUTPUT.md files, routes by type, and gets Sean oriented fast.
---

# Session Restart — On-Demand Curriculum Engine

You're an agent resuming work on Sean Currie's On-Demand Curriculum Engine. This skill
gets you oriented fast without bloating the context window. Follow these steps in order.

## Step 1: Load Engine State

Read the engine-level state first:

```
Read: CONTEXT.md
```

This tells you: what outputs exist, engine evolution notes, what's next at the engine level.

## Step 2: Discover and Select Output

Scan for available outputs:

Scan the `outputs/` directory for subdirectories. For each one that has an `OUTPUT.md`,
read it. For example:

```
Read: outputs/openclaw-sean/OUTPUT.md
Read: outputs/openclaw-jeff/OUTPUT.md
```

(There may be more or fewer — discover what exists, don't assume a fixed list.)

Each OUTPUT.md tells you: type (A-F), status, source documents, deliverables, and
what to read to resume.

**Routing:**
- If Sean's message mentions a specific output ("let's work on the JSE design",
  "back to Jeff's walkthrough"), go directly to that output.
- If Sean's message implies new work ("I have a design doc", "new output for..."),
  this is not a restart — hand off to `pipeline-start`.
- If unclear, present available outputs and ask:

```
**Available outputs:**

| # | Output | Type | Status |
|---|--------|------|--------|
| [N] | [Name from OUTPUT.md] | [Type] | [Status] |

Which output are you working on, or is this something new?
```

## Step 2.5: Pipeline-Start Gate (New Work Only)

If Step 2 identified this as **new work** (not resuming an existing output), stop here
and invoke `pipeline-start` (`engine/skills/pipeline-start/SKILL.md`). New work includes:

- Sean brings a document from another project ("here's a design doc", "turn this into...")
- Sean describes a new topic or person ("new output for...", "let's start on...")
- Sean wants to update engine methodology ("we should change how...")
- Any work that would create new files, not modify existing ones

**Do not proceed to Step 3 without pipeline-start for new work.** Pipeline-start will
classify the operation (Type A-F), build a run plan, and get Sean's approval before
execution begins. This is non-negotiable — the Jeff session proved that skipping
orchestration leads to 3+ course corrections.

**Resuming existing work:** If Sean is returning to an output that already has a run plan
on disk (check `outputs/[name]/run-plans/`), read the run plan and pick up where it left
off. Pipeline-start is not needed for resumption — the run plan IS the session state.

**Exception:** Trivial mechanical changes (fixing a typo, updating a date) don't need
pipeline-start. If the work wouldn't benefit from a plan, skip this step.

## Step 3: Load Output Context (Type-Specific)

Once an output is selected, load context based on its type.

### Type A/B/C — Research-Based Outputs

1. Read the output's `CONTEXT.md` (current phase, key decisions, open questions)
2. Read `operator/session-state.md` if it exists (walkthrough progress, active tasks)
3. Check staleness: if `last_updated` in CONTEXT.md is >5 days ago, flag it
4. Check activity log tail (last 5 entries) for recent context

### Type D — Research-Only

1. Read the output's `CONTEXT.md` or research state file
2. Check what questions were being investigated
3. Check staleness

### Type E — Engine Update

1. Root CONTEXT.md is sufficient (already loaded in Step 1)
2. Read the relevant methodology or skill file being updated

### Type F — Review Artifact

1. Read the output's `OUTPUT.md` (already loaded — has source documents and sync dates)
2. **Check source document freshness:** For each source document listed in OUTPUT.md,
   check if the file has been modified since the last sync date. Flag any that have changed:
   > "Source doc [name] has been modified since last sync on [date]. Want to review changes?"
3. Read the HTML deliverable path (don't load the full HTML — just know where it is)
4. Check if Sean mentioned bringing updates or a new source document

## Step 4: Present Session Brief

Give Sean a focused brief. Keep it tight — orientation, not a book report.

### For Type A/B/C:

```
**Session Brief — [date]**

**Output:** [name] (Type [X])
**Current phase:** [from session-state or CONTEXT.md]
**Last session:** [1-sentence summary]
**Next up:** [what's queued]
**Blockers:** [any, or "none"]
**Days since last session:** [N] [+ staleness warning if >5]

Ready to proceed with [next task], or adjust direction?
```

### For Type F:

```
**Session Brief — [date]**

**Output:** [name] (Type F — Review Artifact)
**Source documents:**
- [doc 1]: [synced/modified since last sync]
- [doc 2]: [synced/modified since last sync]
**Deliverable:** [HTML path]
**Last sync:** [date and what was synced]

Source docs current, or do you have updates to integrate?
```

## Step 5: Update State When Work Happens

During the session, keep the output's state current:

**For Type A/B/C:**
- Update `session-state.md` or `CONTEXT.md` at significant changes
- Log to activity log for actions, intelligence log for strategic moments

**For Type F:**
- Update `OUTPUT.md` sync history when changes are applied
- Add new source documents to the source table when integrated

**At session end (all types):**
- Update the relevant state file with current status
- Note what's next for the next session

## Operator Calibration Reminders

Every session, keep these in mind (from CLAUDE.md):

- **Challenge, don't agree.** Sean demands evidence-based pushback.
- **Transferable > tool-specific.** Note what's universally applicable.
- **Agent vs. automation.** Could a simpler tool do this better?
- **Log significant things.** Activity log for actions, intelligence log for insights.

## Context Window Efficiency

- Don't read every file at session start — only what the current output needs
- Don't load full walkthroughs or HTML — use the brief to orient
- Don't re-read operator profiles unless calibration is needed
- Trust OUTPUT.md and CONTEXT.md — they exist to avoid reloading everything
- For Type F: don't load the source documents unless Sean is syncing changes
