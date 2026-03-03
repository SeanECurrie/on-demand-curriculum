# Intake Process — On-Demand Curriculum Engine

**Created:** 2026-03-03
**Purpose:** Documents how a new output starts — from raw input to research-ready scope.

---

## How a New Output Starts

Every output begins with Sean bringing context about a person and their situation. The engine works with Sean (the operator) to transform raw input into a structured operator profile and scoped research brief.

**Core principle:** The engine talks to Sean, not end users. Sean is the proxy, the translator, and the quality gate.

---

## Input

Sean provides whatever he has. There is no required format — the engine works with what exists:

- **Raw conversation** — iMessage threads, email exchanges, Slack messages, verbal notes
- **Sean's own observations** — what he noticed about their knowledge level, misconceptions, enthusiasm, hesitations
- **Links** — articles they shared, tools they mentioned, videos they watched
- **Sean's assessment** — his read on their actual skill level vs. what they claim, what they need vs. what they asked for
- **Constraints** — budget, timeline, hardware they already own, risk tolerance

The engine does not require all of these. It works with what's available and flags gaps.

---

## Brainstorming Phase

The engine brainstorms WITH SEAN (not the end user). This is a structured conversation that builds toward an operator profile and research scope.

### Questions the Engine Asks Sean

These are not a rigid checklist — they're a framework. The engine asks what's needed based on what Sean has already provided.

**About the person:**
1. Who is this person? (name, relationship to Sean, background)
2. What's their technical level? (specific — not "beginner/intermediate/advanced" but what they can actually do)
3. What's their professional context? (why does this matter to them professionally?)
4. What's their working style? (hands-on learner? needs hand-holding? impatient? methodical?)

**About their goal:**
5. What do they want? (their stated goal, in their words)
6. What do they actually need? (Sean's assessment — may differ from stated goal)
7. What misconceptions has Sean identified? (things they believe that aren't true, or oversimplifications)
8. What's their risk tolerance? (experimenting is fine vs. this needs to be bulletproof)

**About their setup:**
9. What hardware do they have or plan to get?
10. What's their current infrastructure? (networking, existing tools, OS)
11. What existing systems/tools do they already use? (workflows the output might integrate with or replace)
12. What's their budget situation? (not just money — time, attention, willingness to invest effort)

**About scope:**
13. What does Sean think the right scope is? (full deployment? proof of concept? just understanding?)
14. What should be in vs. out for v1?
15. Are there things this person definitely should NOT do yet? (too advanced, too risky, premature)

### The Engine's Job During Brainstorming

- **Push back on assumptions via Sean.** If Sean says "they're pretty technical" but the evidence suggests otherwise, challenge it.
- **Surface the gap between stated and actual need.** Someone asking to "set up an AI agent" might actually need to understand what an AI agent is first.
- **Identify misconceptions early.** These become explicit sections in the walkthrough ("What you might have heard" / "What's actually true").
- **Right-size the scope.** Not everyone needs a 3,030-line walkthrough. Some people need a focused 500-line guide. The engine helps Sean decide.
- **Flag what's unknown.** If Sean doesn't know their hardware specs, or their actual comfort with the terminal, that's a gap to flag — not assume.

---

## Output

The brainstorming phase produces:

### 1. Completed Operator Profile
A filled-in `operator-profile-template.md` for this person. See the template for structure.

### 2. Scoped Research Brief
What the engine needs to research for this specific output:
- **Topic/tool:** What's being researched (e.g., "OpenClaw deployment on MacBook Air")
- **Reports needed:** Which of the 5-report framework applies (not all outputs need all reports)
  - Landscape report — needed if the person hasn't chosen a tool yet
  - Architecture report — needed if the tool is complex enough to warrant understanding internals
  - Feasibility report — needed if hardware/platform compatibility is a question
  - Security report — needed if the tool has security implications (agent platforms always do)
  - Open questions — always produced
- **Platform-specific queries:** What to look for in community intelligence (e.g., "MacBook Air M2 8GB + OpenClaw performance")
- **Known community concerns:** Issues Sean already knows about that need validation

### 3. Identified Misconceptions
Explicit list of things the person believes (or likely believes) that the walkthrough needs to address. These become educational moments in the output, not gotchas.

### 4. Hardware/Platform Decision
Confirmed or recommended hardware and platform. If the person's current hardware isn't suitable, this gets flagged with alternatives and reasoning.

---

## Principles

1. **Engine talks to Sean, not end users.** The person receiving the output never interacts with the engine directly. Sean is the interface.

2. **Push back on assumptions via Sean.** Sean's initial read on someone might be off. The engine's clarifying questions are designed to surface this.

3. **Don't over-gather — work with what you have, flag gaps.** A 30-minute iMessage thread from Sean might be enough to start research. Don't block on having a "complete" profile — start with what exists and iterate.

4. **Start research as soon as enough context exists.** The profile doesn't need to be perfect to begin research. Discovery during research often fills gaps the brainstorming phase couldn't.

5. **Scope is a conversation, not a decree.** The engine recommends scope based on the person's situation. Sean makes the final call. But the engine should push back if the scope seems wrong (too ambitious for a beginner, too limited for someone capable of more).

6. **Every intake captures the "why."** Not just "what do they want to deploy" but "why does this matter to them." The why shapes tone, depth, and which transferable concepts to emphasize.

7. **Misconceptions are opportunities, not problems.** Addressing what someone got wrong is often more educational than teaching them what's right. The intake process explicitly surfaces these.

---

## Example: How Output #1 (OpenClaw — Sean) Would Have Gone Through Intake

For reference, Sean's own output was the engine's first run. If the intake process had existed at the start:

- **Input:** Sean's own knowledge + Tech With Tim video + professional context
- **Brainstorming:** Self-directed (Sean was both operator and subject)
- **Misconceptions identified:** Tim's VPS-over-Mac-Mini recommendation needed validation against Sean's specific setup
- **Scope:** Full deployment walkthrough with research-backed hardening
- **Reports needed:** All 5 (new tool, complex architecture, Mac Mini feasibility, agent security, many open questions)

This intake process is generalized from that experience.

---

## Example: How Output #2 (Jeff) Might Start

Based on what's known about Jeff (from engine memory):

- **Input:** Sean's observations about Jeff — real estate business owner, AI-new, interested in OpenClaw, has a MacBook Air
- **Brainstorming:** Engine asks Sean about Jeff's technical level, what "AI-new" means specifically, what Jeff thinks OpenClaw will do for his business, whether the MacBook Air has enough resources
- **Misconceptions likely:** May underestimate setup complexity; may overestimate what an AI agent can do out of the box for real estate; may not understand security implications
- **Scope:** Probably narrower than Sean's — focused deployment guide, less architecture depth, more "here's what this actually does" framing
- **Reports needed:** Feasibility (MacBook Air viability), Security (always), Open questions (always). Landscape and Architecture likely abbreviated since Sean already has them.
