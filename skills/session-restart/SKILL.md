---
name: session-restart
description: >
  Session restart and context reload for the ClawdBot Research Project. Use this skill
  whenever starting a new co-work session, resuming after compaction, recovering from a
  closed session, or when context feels stale or thin. Also use when Sean says things like
  "restart session", "refresh context", "new session", "pick up where we left off",
  "reload project", "what were we doing", or any variation of resuming work on this project.
  This skill ensures every session starts calibrated — with the right files loaded, the right
  posture set, and zero wasted context window on stuff that's already done.
---

# Session Restart — ClawdBot Research Project

You're an agent resuming work on Sean Currie's ClawdBot Research Project. This skill gets you
oriented fast without bloating the context window. Follow these steps in order.

## Step 1: Load Session State

Read the session state file first — it's the single source of truth for where things stand:

```
Read: operator/session-state.md
```

This file tracks:
- Which walkthrough phase is current (and which are done)
- Active tasks and blockers
- What happened last session
- What's queued next

If `session-state.md` doesn't exist yet, create it using the template in Step 5 below.

## Step 2: Load Core Context (Selectively)

Read these files in this order. The session state tells you which sections matter — don't
load everything if you don't need it.

**Always read (they're short and high-signal):**
```
Read: CONTEXT.md
```

CONTEXT.md has: current status, key decisions, open questions, known gaps, experimental
use cases. It's the project map.

**Read if session state says "posture check needed" or if this is your first session:**
```
Read: operator/project-genesis.md
```

This has the refined purpose. Reminds you: learning lab, not production. Transferable
skills matter more than OpenClaw specifics. Sean is a Solutions Engineer and this builds
professional credibility.

**Read if you need to gut-check whether your approach matches Sean's actual intent:**
```
Read: operator/purpose-refinement-2026-02-22.md
```

This is the raw, unfiltered conversation about WHY this project exists. It's the
calibration document. Use it when direction feels uncertain.

**Read if the session involves deployment work:**
```
Read: docs/walkthrough/crib-sheet.md
```

The crib sheet is the quick-reference version of the walkthrough. Faster to load than
the full walkthrough when you just need to check what comes next.

## Step 3: Check Staleness

Run a quick staleness check on the session state and CONTEXT.md:

1. Look at the `last_updated` date in session-state.md
2. If it's been more than 5 days since the last session, flag it: "It's been [N] days since
   the last session. This ecosystem moves fast — should we do a staleness sweep before
   diving into work?"
3. Check the intelligence log tail (last 5 entries) for anything that might affect today's work:
   ```
   Read: intelligence-log.md (last 30 lines)
   ```

## Step 4: Present Session Brief

Give Sean a focused brief. Keep it tight — the goal is orientation, not a book report.
Use this format:

```
**Session Brief — [date]**

**Current phase:** [phase name and number from session-state.md]
**Last session:** [1-sentence summary of what was accomplished]
**Next up:** [what's queued — from session-state.md]
**Blockers:** [any, or "none"]
**Days since last session:** [N] [+ staleness warning if >5]

Ready to proceed with [next task], or do you want to adjust direction?
```

That's it. Don't summarize the entire project. Don't re-explain the purpose. Don't list
every file in the knowledge base. Sean knows his project — he just needs to know where
the needle is.

## Step 5: Update Session State When Work Happens

During the session, keep session-state.md current. Update it when:
- A walkthrough phase or step is completed
- A new blocker is discovered
- A significant decision is made
- The session ends (always update before closing)

### Session State Template

If `operator/session-state.md` doesn't exist, create it with this structure:

```markdown
# Session State — ClawdBot Research Project

**Last Updated:** [date]
**Last Session Summary:** [1-2 sentences]

## Walkthrough Progress

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Machine Preparation | not_started | |
| A | macOS Hardening | not_started | |
| B | Runtime Setup | not_started | |
| C | OpenClaw Installation | not_started | |
| D | Security Hardening | not_started | |
| E | Model Configuration | not_started | |
| F | Channel Setup | not_started | |
| G | Starter Skills & First Run | not_started | |
| H | Validation | not_started | |
| I | Post-Deployment | not_started | |

Status values: not_started | in_progress | completed | blocked | deferred

## Current Focus

**Active task:** [what we're working on right now]
**Phase step:** [e.g., "Phase 0, Step 0.3 — Identity & Sync Isolation"]
**Blockers:** [anything preventing progress, or "none"]

## Next Up

1. [next task]
2. [task after that]
3. [etc.]

## Session History (Last 5)

| Date | What Happened | Outcome |
|------|--------------|---------|
| | | |

## Decisions Made This Phase

- [decision and rationale — accumulates as phases progress]

## Notes for Next Session

[Anything the current session wants to flag for the next one. Could be: "check if macOS
update finished", "Sean mentioned wanting to try X", "need to research Y before Phase D".]
```

## Operator Calibration Reminders

Every session, keep these in mind (from CLAUDE.md and the purpose refinement):

- **This is a learning lab.** Not production. Hardening is educational. If Sean wants to
  skip operational polish to get to experimentation, that's fine. Essential security is
  non-negotiable; operational polish is deferrable.
- **Challenge, don't agree.** Sean explicitly demands evidence-based pushback. Ask "why
  are we doing this?" if the direction seems off. Don't validate assumptions without data.
- **Transferable > tool-specific.** Always note what's universally applicable vs. what's
  OpenClaw-only. The ability to evaluate the NEXT tool is as valuable as deploying this one.
- **Agent vs. automation.** When testing use cases, always ask: could a cron job or n8n
  workflow do this better? The comparison is part of the learning.
- **Log significant things.** Activity log for actions, intelligence log for strategic
  insights. Not every keystroke — just the stuff that matters.

## Context Window Efficiency

The whole point of this skill is to avoid reloading the entire project every time a session
starts. Here's what NOT to do:

- Don't read every KB file at session start — only load what the current phase needs
- Don't read the full walkthrough — use the crib sheet for quick reference, load specific
  phases on demand
- Don't re-read purpose-refinement unless calibration is needed
- Don't dump the full activity log — the session state captures what matters
- Don't read old research reports unless the current task specifically needs them

The session-state.md file exists so you can start fast. Trust it. If it feels stale,
update it — don't work around it by loading everything else.
