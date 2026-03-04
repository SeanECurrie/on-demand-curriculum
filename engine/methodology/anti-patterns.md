# Anti-Pattern Gallery

**Created:** 2026-03-03
**Purpose:** A catalog of real failure modes observed during engine work. Every entry cites a specific example from Output #1 or engine history. No theoretical anti-patterns — if we have not seen it fail, it is not listed here.

---

## How This Gallery Works

This is a war story collection, not a rule book. Each entry documents a failure mode that actually happened, what it looked like, and what we learned.

**Rules for this gallery:**
1. **Real examples only.** Every entry must cite a specific instance from engine work — a file, a log entry, a course correction, a session where something went wrong. "This could happen" is not enough. "This did happen" is required.
2. **Honest about our own work.** Output #1 suffered from several of these. That is the point. An engine that cannot name its own failure modes cannot improve.
3. **Framed as failure modes, not commandments.** Each entry describes a pattern that failed, why it was tempting, and what good looks like. The goal is recognition, not obedience.

**Adding new entries:**
- Cite the specific output, file, log entry, or session where the failure occurred
- Include "What it looks like" (so you recognize it), "Why it happens" (so you understand the temptation), and "What good looks like" (so you have an alternative)
- Include a binary self-test — a yes/no question you can ask to catch it. See `binary-self-tests.md` for test design rules.
- Date-stamp the entry

---

## Research Anti-Patterns

### 1. The Understated Warning

**What it looks like:** Initial research surfaces a risk. The finding is noted accurately — but the severity is underestimated, and subsequent research reveals the problem is substantially worse than first reported.

**Real example:** Tim's security warnings during Phase 1 research (2026-02-10). The intelligence log initially captured Tim's warnings about running ClawdBot with root access and prompt injection as valid concerns. One day later, the Phase 2 security deep-dive escalated the finding dramatically: `"Tim's security warnings UNDERSTATED the risk. Tim covered basics... He missed: CVEs, supply chain attacks, exec-approvals system, mDNS information disclosure, on-disk credential exposure, model choice as security control, reader agent pattern for prompt injection defense."` (intelligence-log.md, 2026-02-11). The initial research accepted Tim's framing as the ceiling of concern rather than the floor.

Similarly, the ClawHub supply chain assessment went from "12% malicious (341/2,857)" in Phase 1 to "824+ malicious (~20%)" by the 2026-02-22 staleness sweep (intelligence-log.md, 2026-02-22). The initial finding was accurate at the time — but treating it as settled rather than as a lower bound was the failure.

**Why it happens:** Early research establishes a frame. Subsequent work within that frame tends to confirm it rather than challenge it. A Tier 2 source (Tim's video) set the security ceiling, and the initial sweep validated it instead of pushing past it.

**What good looks like:** Treat initial severity assessments as provisional lower bounds, not conclusions. Explicitly mark findings with "severity may escalate with deeper research" when the investigation is in early stages. When a Tier 2 source frames a risk, the next research cycle should try to falsify that framing, not just validate it.

**Binary test:** Read the severity language on your most critical finding. Does it read as a provisional assessment ("initial evidence suggests...") or a settled conclusion ("the risk is...")? If settled: you stopped too early unless you have Tier 1 evidence.

*(First observed: 2026-02-10/11, Output #1 security research)*

---

### 2. Premature Confidence

**What it looks like:** Treating a small number of community sources as consensus. Language escalates from "some users report" to "the community consensus is" without the evidence base to support it.

**Real example:** The engine's own CLAUDE.md explicitly calls this out as a red flag: `"Based on 2 Reddit posts" is not "the community consensus is." Be precise about your evidence base.` This made it into the constitution because it was observed during research — the temptation to upgrade a handful of Tier 4 Reddit posts into "community consensus" was real and recurring during Output #1 research sweeps. The credibility-tiers.md document (Tier 5: "General community sentiment — Low weight, direction indicator, not decision-maker") exists specifically because this anti-pattern was observed.

The intelligence log shows the discipline working correctly in several entries — e.g., the macOS Keychain concern was appropriately kept at Tier 4 with qualified language: `"RESOLVED (partially): macOS Keychain concern is NOT a hard deployment blocker. Likely caused by TCC permission requests..."` (intelligence-log.md, 2026-02-11). But the fact that the red flag needed to be encoded in the constitution means the pull toward premature confidence was strong enough to warrant a structural defense.

**Why it happens:** Confirmation bias. When you find 2-3 sources saying the same thing, the brain pattern-matches to "consensus" because agreement feels like signal. But 3 Reddit posts from the same week might all trace back to one person's experience being reshared.

**What good looks like:** Count your independent sources. State the count explicitly: "3 independent Tier 4 sources report this" — not "community consensus." Reserve "consensus" language for findings where 5+ independent sources across multiple platforms agree. Use the credibility tier system to keep yourself honest about source weight.

**Binary test:** Find a claim described as "consensus" or "widely reported." Can you count 5+ independent sources behind it? If not: downgrade the language to match your actual evidence base.

*(First observed: 2026-02-10, Output #1 research phase; encoded as red flag in CLAUDE.md)*

---

### 3. The Settled Question That Was Not Settled

**What it looks like:** A research question gets marked as "RESOLVED" based on initial findings, and then later evidence forces it to reopen — revealing that the original resolution was premature.

**Real example:** Model routing was initially understood as intelligent task-based routing during Phase 1 research. The Phase 2 architecture deep-dive revealed it was actually failover-based (primary + fallback chain on API errors), not smart task routing at all: `"RESOLVED: Model routing is NOT intelligent/automatic. It uses a primary + fallback chain (failover on API errors), NOT task-based routing."` (intelligence-log.md, 2026-02-11). The initial understanding was wrong, and it shaped early thinking about deployment strategy before being corrected.

The version target is another example. The walkthrough initially specified `>= 2026.1.29` as the deployment target. By 2026-02-22, the staleness sweep discovered 4 additional CVEs patched in later versions: `"CRITICAL: Version target MUST update. Our walkthrough says >= 2026.1.29. Latest is 2026.2.19."` (intelligence-log.md, 2026-02-22). The original target was correct when written but became dangerously outdated in 11 days.

**Why it happens:** Research wants to produce answers, not more questions. When a question gets a plausible answer backed by a source, there is pressure to close it and move on. The discipline of marking resolved questions as still-provisional is tedious. The version target example shows a different variant: the answer was correct when given but has a shelf life the engine did not track.

**What good looks like:** Distinguish between "answered" and "resolved." An answer is what the evidence currently says. A resolution is an answer that has been cross-validated and stress-tested. Mark the distinction. For time-sensitive findings (versions, CVEs, ecosystem status), always attach a staleness date: "Valid as of YYYY-MM-DD; recheck before deployment."

**Binary test:** Pick any "RESOLVED" finding. Has it been cross-validated by at least two independent sources? Does it have a staleness date? If either is no: it is answered, not resolved.

*(First observed: 2026-02-11, Output #1 architecture deep-dive; version staleness observed 2026-02-22)*

---

### 4. The One-Source Frame

**What it looks like:** A single high-quality source establishes the framing for an entire investigation, and subsequent research validates that frame instead of challenging it.

**Real example:** Tech With Tim's video was the catalytic source for the entire OpenClaw project. Tim's framing — VPS deployment, basic security (non-root, firewall, Tailscale, gateway auth), prompt injection as the main risk — set the initial investigation scope. The project-genesis.md documents this explicitly as the "Inspirational Source." While the research methodology eventually pushed well past Tim's framing (the Phase 2 security deep-dive surfaced CVEs, supply chain attacks, and threat models Tim never covered), the initial research phase was structured around validating or extending Tim's recommendations rather than independently scoping the investigation.

This is visible in the intelligence log structure: early entries are consistently framed as responses to Tim's claims — "VALIDATED: Tim's security warnings confirmed," "VALIDATED: Mac Mini M4 deployment path is STRONGLY supported," and then the escalation: "Tim's security recommendations validated but understated." Tim was right about many things, but the investigation started inside his frame rather than constructing its own.

**Why it happens:** A good source is invaluable for getting started. But starting with a source's framing is different from starting with a question. When you begin with a source, your subsequent research becomes a series of "was Source X right about Y?" checks. When you begin with a question, you construct the scope independently and sources become evidence, not framing.

**What good looks like:** Use catalytic sources for orientation, but construct research scope from the operator's actual questions, not from the source's coverage. Explicitly note when a source is providing your investigation frame versus providing evidence within a frame you independently constructed.

**Binary test:** List the 3 most important questions your research investigated. Did they originate from the operator's needs/goals, or from what a particular source happened to cover? If from a source: your scope may be shaped by someone else's priorities.

*(First observed: 2026-02-10, Output #1 inception; visible in intelligence-log.md entry structure)*

---

## Output Anti-Patterns

### 5. The Missing Source Trail

**What it looks like:** Research finds 130+ sources. The consolidated source list is an afterthought, created during code review rather than maintained as research happens.

**Real example:** During the code review of Output #1 (superpowers:requesting-code-review), one of the three "Important" issues was: `"research/sources.md had only 1 entry vs 130+ sources"` (CONTEXT-HISTORY.md, 2026-02-11, Verification & Code Review section). The sources file had been created as part of the project scaffold but was never maintained during the research phases. 130+ sources were cited across knowledge base files, intelligence log entries, and reports — but the consolidated source index was empty.

The fix was retrospective: `"research/sources.md: Consolidated 130+ sources from all KB files with dates, tiers, URLs"` (CONTEXT-HISTORY.md). This is strictly worse than building the list as you go, because retrospective consolidation is error-prone and loses citation context.

A related issue: `"community-findings.md line 123 referenced empty sources.md"` — a cross-reference to a file that had no content. The broken reference was only caught during code review.

**Why it happens:** During active research, adding a finding to the intelligence log or knowledge base feels productive. Adding the same source to a source index feels like bookkeeping. The source index has no immediate consumer — it is infrastructure for later, and "later" does not motivate during fast-paced research sessions.

**What good looks like:** The source index is updated at the same time as the intelligence log entry that cites the source. Same commit. Not a separate task. The source trail is a research artifact, not a documentation artifact.

**Binary test:** Open sources.md (or equivalent). Does the entry count roughly match the number of unique sources cited in the intelligence log and knowledge base? If sources.md is substantially smaller: the source trail is retroactive, not contemporaneous.

*(First observed: 2026-02-11, Output #1 code review)*

---

### 6. The Empty Scaffold

**What it looks like:** Project structure is created early (good), but placeholder files and empty directories persist through phases where they should have been populated, creating a false impression of completeness.

**Real example:** Two instances from Output #1 code review. First: `"research/scrapes/ empty (raw Bright Data outputs not persisted)"` (CONTEXT-HISTORY.md, 2026-02-11). The scrapes directory was part of the initial scaffold. Bright Data was used extensively during research. But raw scrape outputs were never saved to the directory — only synthesized findings made it into the knowledge base. The directory existed to hold raw data; the raw data was never preserved.

Second: `"patterns/ empty"` at the time of code review (CONTEXT-HISTORY.md, 2026-02-11). The patterns directory was scaffolded on day one. Patterns were identified during research (the intelligence log contains several). But extracting them into the patterns directory was not done until the code review caught the gap. The fix: `"patterns/: 5 patterns extracted (zero-ClawHub, per-agent routing, reader agent, webhook n8n, local GGUF)."` Those patterns existed in the knowledge — they just had not been moved to the structure that was built to hold them.

**Why it happens:** Creating structure is a one-time act. Maintaining structure requires ongoing discipline. The scaffold is created during Phase 0, and the research phases are focused on findings, not on filing. Empty directories do not generate warnings — they just sit there, looking like they are part of the plan.

**What good looks like:** Every scaffold directory gets populated or explicitly marked as "intentionally empty — pending [phase/event]" during each phase review. Phase boundary checkpoints should include a structural audit: "Are there empty directories that should have content by now?"

**Binary test:** List all directories in the output scaffold. Does every directory contain at least one content file, or a note explaining why it is still empty? If any directory is empty with no explanation: the scaffold outran the work.

*(First observed: 2026-02-11, Output #1 code review; both scrapes/ and patterns/)*

---

### 7. The Process Deviation Nobody Noticed

**What it looks like:** The defined process includes specific tools, skills, or checkpoints. One or more are skipped during execution. Nobody notices until code review.

**Real example:** The Output #1 code review identified two process deviations: `"competitive-research-brightdata skill never formally invoked via Skill tool"` and `"verification-before-completion only invoked at project end, not at phase boundaries"` (CONTEXT-HISTORY.md, 2026-02-11, Code Review section).

The competitive research was done — the intelligence log has extensive competitive landscape findings. But it was done informally rather than through the defined skill. Similarly, verification happened — but only at the end, not at each phase boundary as the skill chain prescribes. The work got done, but the process discipline was not followed.

**Why it happens:** When you are in flow, invoking a formal skill feels like overhead. The research is happening, the findings are good — why interrupt to formally invoke a skill that would tell you to do what you are already doing? The answer is that skills encode discipline that ad-hoc work misses. The competitive research skill likely had steps that the informal research did not follow. The verification skill at phase boundaries would have caught the empty patterns/ and source-index gaps earlier.

**What good looks like:** Treat skill invocation as non-optional when the skill chain says it applies. Log each invocation in the activity log. When a skill feels like overhead, that is a signal that the work would benefit from the structure — the overhead feeling is the temptation to skip discipline.

**Binary test:** List the skills the skill chain says apply to this phase. Were all of them formally invoked? If any were skipped: the process deviation is already in progress.

*(First observed: 2026-02-11, Output #1 code review)*

---

## Process Anti-Patterns

### 8. Staleness Blindness

**What it looks like:** Research findings from days or weeks ago are treated as current without checking whether the underlying facts have changed. The engine works from cached assumptions instead of verified state.

**Real example:** The 2026-02-22 session opened with a staleness flag: `"STALENESS FLAG: CONTEXT.md was 8 days stale (last updated 2026-02-14, reviewed 2026-02-22). OpenClaw ecosystem moves fast."` (intelligence-log.md, 2026-02-22). The subsequent staleness sweep discovered the findings had aged badly in those 8 days:

- Version target needed updating (4 new CVEs patched between 2026.1.29 and 2026.2.19)
- ClawHub supply chain numbers had worsened (12% to ~20% malicious)
- The project's creator had joined OpenAI, changing governance fundamentally
- GitHub stars had grown from 145K to 209K+ (indicating massively increased attack surface)
- New security tooling (SecureClaw) had been released

Eight days. All of those changes. The research cadence document now mandates weekly security sweeps specifically because this staleness gap was observed.

**Why it happens:** Research feels done once it has been written up. The knowledge base exists, the findings are documented, the synthesis is complete. But in fast-moving ecosystems, "done" has a shelf life measured in days, not months. The transition from "active research" to "written findings" creates a psychological sense of completion that masks ongoing staleness.

**What good looks like:** Every session starts with a staleness check. The research-cadence-template.md exists for this reason. If more than 5 days have passed since the last session on a topic, flag for review before doing anything else. Treat staleness as a first-class risk, not housekeeping.

**Binary test:** When did the last session on this topic occur? If more than 5 days ago: have you run a staleness check before proceeding? If no: you are working from potentially stale intelligence.

*(First observed: 2026-02-22, Output #1 staleness sweep)*

---

### 9. The Scope Ratchet

**What it looks like:** A project's framing evolves significantly during execution — from specific tool deployment, to learning lab, to reusable engine — but each expansion feels natural in context, making it hard to recognize that the scope has materially changed.

**Real example:** The project's scope evolved through three distinct framings across three weeks:

1. **2026-02-10 (inception):** "Deploy ClawdBot on a dedicated M4 Mac Mini" — a specific tool deployment project with a knowledge base.
2. **2026-02-22 (purpose refinement):** "Hands-on learning lab using OpenClaw as the first case study" — the deployment became educational, the tool became a case study, and "transferable judgment" became the primary deliverable. The project-genesis.md was rewritten to reflect this.
3. **2026-03-03 (engine extraction):** "On-Demand Curriculum Engine" — the methodology became the product, the deployment became Output #1, and the system was restructured into a three-layer architecture designed to produce outputs for different people on different topics.

Each transition was well-reasoned and well-documented. The session-state.md captures the decisions. But the project that started as "install OpenClaw on my Mac Mini" became a "reusable curriculum engine" in 21 days. That is a massive scope change, even if each step felt incremental.

This is not necessarily bad — the scope changes were genuine improvements in understanding. But the anti-pattern is failing to recognize scope evolution as it happens, which can lead to carrying forward assumptions from an earlier, narrower framing.

**Why it happens:** Each expansion feels like clarification, not scope change. "We're not just deploying — we're learning" is a refinement. "We're not just learning — we're building a reusable system" is another refinement. In context, each one makes sense. But the cumulative effect is that work started under framing #1 may not serve framing #3.

**What good looks like:** When the project's purpose statement changes, explicitly audit existing work against the new framing. Ask: "Does the work we already did still serve the purpose as we now understand it?" The 2026-03-03 restructure was the right response to the scope change — it audited every file and reclassified them under the new architecture. The anti-pattern would have been to keep the old structure while mentally working under the new framing.

**Binary test:** Read the project's current purpose statement. Now read the oldest purpose statement. Are they describing the same project? If not: has the existing work been explicitly reviewed against the current purpose? If no: you are carrying forward work shaped by a purpose that has changed.

*(First observed: 2026-02-10 through 2026-03-03, Output #1 scope evolution across 3 framings)*

---

### 10. The Deferred Template Pile

**What it looks like:** During a restructure or extraction, work items are classified as "deferred — extract when needed." Each individual deferral is reasonable. But the pile of deferred items grows, and collectively they represent significant unfinished extraction that will all come due at once when the next output starts.

**Real example:** The verification report (docs/plans/audit/verification-report.md, 2026-03-03) documents five deferred items:

1. Output CLAUDE.md not created as separate file
2. Engine converter template not extracted
3. Engine operational-runbook-template not extracted
4. Engine session-restart template not parameterized
5. Redundant .gitkeep files

Each is individually minor and correctly classified as "needed when Output #2 starts, not before." The verification report notes: `"The 5 deferred items are all template extractions that become necessary only when the second output reveals what needs to be generic vs. specific — exactly the right time to do that work (not before)."`

This reasoning is sound. But the anti-pattern is worth naming because the pile is invisible until Output #2 starts, at which point "just start the new output" requires first clearing a backlog of extraction work. The cost of deferral is not zero — it is deferred, loaded onto the start of the next output.

**Why it happens:** Deferral is often the right call for any individual item. "Don't extract a template until you have two instances" is good engineering. But multiple correct deferrals accumulate into a hidden startup cost that is easy to underestimate because each piece was individually small.

**What good looks like:** Keep a deferred-work manifest that is explicitly reviewed before starting a new output. The verification report already serves this purpose. The discipline is: when starting Output #2, the first task is "review deferred items from verification report" — not "start intake."

**Binary test:** Is there a single document that lists all deferred work items from previous phases? Can you estimate the total effort to clear them? If no to either: the deferred pile is invisible.

*(First observed: 2026-03-03, engine restructure verification report)*

---

### 11. The Unverified Render

**What it looks like:** Visual or interactive output is generated, reviewed in source code, and declared complete — without anyone opening it in a browser to see what it actually looks like.

**Real example:** Output #1's interactive walkthrough (3,030 lines of HTML) had four visual defects that are invisible in source code and obvious in a browser:

1. **Hidden diagram:** The Phase Overview diagram (`diagram-phase-overview`) was rendered by Mermaid.js but had `style="display:none"` on its container. The most useful orientation diagram — showing the full walkthrough roadmap — was built and invisible. Nobody opened the HTML and noticed the diagram wasn't there.

2. **Broken expandables:** 14 of 22 troubleshooting expandable sections had content that leaked outside their containers. The toggle button worked (the chevron rotated) but the content was always visible below the container. This is a DOM structure issue that is trivial to spot visually and nearly impossible to catch by reading HTML source.

3. **Missing syntax highlighting:** The style guide specifies 8 token-type colors for code blocks (keywords, strings, comments, etc.) with exact hex values for light and dark mode. The actual HTML has monochrome code blocks across all 75 code blocks. The specification existed, the implementation didn't follow it, and nobody noticed because nobody compared the rendered output to the spec.

4. **Non-persisting notes:** The style guide specifies localStorage persistence with 500ms debounce for `.notes-input` textarea fields. The implementation persists checkbox state but not text inputs. A user who fills in version numbers and deployment notes loses them on page reload.

All four defects survived through the entire construction process and code review. They would have been caught in under 60 seconds by opening the file in a browser and clicking through one phase.

**Why it happens:** During construction, the source code IS the output — you write HTML, you see HTML. The mental model is "I wrote the right structure, so it renders correctly." But HTML rendering is not deterministic from reading source — CSS interactions, JavaScript timing, DOM nesting, CDN load order, and viewport behavior all affect the result. The only reliable verification is looking at the rendered page. But "open it in a browser" feels like a separate step, not part of the build process, so it gets deferred to "later" — and later never comes.

**What good looks like:** Visual verification is part of the build process, not a post-build step. The render-validate loop (see `section-construction.md` Phase C.5) makes this mandatory: render → screenshot → audit → fix → re-render. The loop runs until the output passes visual inspection. "It works in the source" is not sufficient.

**Binary test:** Has the output been opened in a browser and visually inspected since the last source code edit? If no: you are about to ship unverified visual output. Open it now.

*(First observed: 2026-02-22 (Output #1 construction), documented 2026-03-03 during engine methodology review)*

---

### 12. The Contradictory Frame

**What it looks like:** The same output contains two conflicting framings of the same fact, and neither the engine nor the operator catches it until the end user does. The output teaches one thing in one section and assumes the opposite in another.

**Real example:** Output #2 (OpenClaw for Jeff) contains both of these statements in the same walkthrough:

- Section 2 intro: *"This section explains why you're setting up a separate MacBook for this, rather than just installing it on whatever computer you already use."* — framing the MacBook Air as a **dedicated** machine.
- Section 2 body (line 722): *"You're buying a MacBook Air. It's going to run OpenClaw, but it's also going to be a laptop you use. That means it's a shared machine."* — framing the same MacBook Air as a **shared** machine.
- Section 5 security (line 1399): *"Your MacBook runs OpenClaw and your personal applications on the same device."* — reinforcing the shared-machine framing.

Jeff read the walkthrough and responded: *"It thinks I'm going to use the MacBook Air as my personal computer. Which I'm not."* He was right — the walkthrough contradicted itself. The intro said "separate," the body said "shared." The security section built its biggest residual risk assessment around the shared-machine assumption. Jeff caught the contradiction that the engine didn't.

**Root cause:** The operator profile said "dedicated purchase" (bought new for this purpose). The engine inferred "shared use" (because why buy a laptop you never open as a laptop?). Both interpretations were reasonable. The problem is that the engine never resolved the ambiguity — it held both framings simultaneously and wrote different sections under different assumptions. The intake process did not include an explicit question: "Will this machine also be used for personal/work tasks, or exclusively for OpenClaw?"

**Why it happens:** Intake captures what someone IS doing and what they WANT. It does not always capture the operational model — how the hardware will be used day-to-day. When hardware use is ambiguous, different pipeline stages can resolve the ambiguity differently. Research may assume shared (because it's a laptop). Output generation may assume dedicated (because the intro says "separate"). Neither checks the other's assumption.

**What good looks like:** The intake process should include an explicit question about hardware operational model: dedicated vs. shared use. When the answer is ambiguous, the walkthrough should present it as a decision point rather than assuming either frame. And the whole-output review (Phase C) should include a consistency check: "Does every section agree on the same assumptions about the user's setup?"

**Binary test:** Pick any assumption the walkthrough makes about the user's setup (shared/dedicated, always-on/occasional, primary/secondary machine). Search the full output for that assumption. Does every mention agree? If any section contradicts another: you have a contradictory frame.

*(First observed: 2026-03-03, Output #2 post-delivery feedback from Jeff)*

---

## Related Documents

- `binary-self-tests.md` — The framework for writing the binary tests in each anti-pattern entry
- `editorial-standards.md` — The quality bar that anti-patterns violate
- `dual-source-intelligence.md` — The research methodology whose failure modes appear in the Research section
- `depth-assessment.md` — How to classify work depth, which helps prevent premature depth anti-patterns
- `credibility-tiers.md` — The tier system referenced in premature confidence and understated warning entries
- `research-cadence-template.md` — The staleness management framework that addresses staleness blindness
- `section-construction.md` — Phase C.5 (render-validate loop) directly addresses this anti-pattern
