---
name: anti-pattern-check
description: >
  Quick scan for known failure modes. Use periodically during research, synthesis, or output work.
  NOT mandatory — a spot-check when something feels off or when producing substantial output.
---

# Anti-Pattern Check — On-Demand Curriculum Engine

A lightweight spot-check against the 10 known failure modes in the anti-pattern gallery. This is
not a gate — it is a pulse check. Run it when something feels off, when you have just produced a
large chunk of work, or at natural pause points between sections.

**This should take under 2 minutes. If it's taking longer, you're overthinking it.**

## When NOT to Use This Skill

- **Trivial work.** Fixing a typo, updating a date, renaming a file. If the work cannot exhibit
  a failure mode, the check adds nothing.
- **Mid-sentence.** Do not interrupt active writing or research to run this. Finish the thought,
  then check.
- **Every single commit.** This is a periodic spot-check, not a commit hook. Use it at natural
  pause points: end of a research sweep, after drafting a synthesis section, before finalizing
  a walkthrough segment.
- **As a substitute for code review.** This catches known failure modes. Code review
  (`superpowers:requesting-code-review`) catches everything else. They are complementary,
  not interchangeable.

## Step 1: Load the Gallery

Read the anti-pattern gallery:

```
Read: engine/methodology/anti-patterns.md
```

Focus on the "What it looks like" description for each of the 10 anti-patterns. These are your
recognition patterns.

## Step 2: Scan Current Work Against Each Anti-Pattern

Run through each anti-pattern and ask: "Does the work I just produced show signs of this?"

| # | Anti-Pattern | Quick Check |
|---|-------------|-------------|
| 1 | The Understated Warning | Am I treating a severity assessment as settled without Tier 1 evidence? |
| 2 | Premature Confidence | Am I calling something "consensus" with fewer than 5 independent sources? |
| 3 | The Settled Question That Was Not Settled | Did I mark something "RESOLVED" without cross-validation or a staleness date? |
| 4 | The One-Source Frame | Is one source setting the framing for my entire investigation? |
| 5 | The Missing Source Trail | Is sources.md (or equivalent) keeping pace with the intelligence log? |
| 6 | The Empty Scaffold | Are there directories that should have content by now but don't? |
| 7 | The Process Deviation Nobody Noticed | Did I skip a skill the skill chain says applies? |
| 8 | Staleness Blindness | Am I working from findings older than 5 days without a staleness check? |
| 9 | The Scope Ratchet | Has the purpose changed since the work I'm building on was produced? |
| 10 | The Deferred Template Pile | Is the pile of deferred items growing without a visible manifest? |

This is a quick mental pass — not a deep audit. If nothing jumps out, move on.

## Step 3: Run the Binary Test for Suspected Matches

If any anti-pattern triggered a "maybe" in Step 2, go back to `anti-patterns.md` and run that
entry's binary test. The binary test is a yes/no question designed to give a clear signal.

- **Clear YES on the binary test:** The anti-pattern is present. Proceed to Step 4.
- **Clear NO on the binary test:** False alarm. Continue working.
- **Ambiguous:** Flag it for Sean in Step 4 — do not spend time resolving ambiguity yourself.

## Step 4: Act on Results

- **No matches found:** Continue working. Log nothing — this check is lightweight by design.
- **Clear match found:** Fix it now if the fix is straightforward (under 5 minutes). Log the
  fix in the activity log: `"Anti-pattern check: caught [#N name], fixed by [action]."`
- **Possible match, unclear:** Flag it for Sean with the specific anti-pattern number and what
  triggered the suspicion. Let Sean decide whether it needs attention:

```
"Anti-pattern check flagging a possible #[N] ([name]): [what I noticed]. Worth investigating
or move on?"
```

- **Multiple matches found:** Fix what you can, flag the rest for Sean in a single summary.
  Multiple hits may indicate a systemic issue — note that possibility when flagging.
