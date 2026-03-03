# Depth Assessment

**Created:** 2026-03-03
**Purpose:** A mandatory 30-second classification step at the start of any pipeline stage that determines the appropriate level of depth, preventing the engine from defaulting to medium-quality everything.

---

## Why This Exists

LLMs default to medium depth on everything. Without explicit classification, research gets "pretty thorough" and outputs get "pretty good" — never sharp. A landscape scan that should cover 15 tools in 20 minutes instead spends 20 minutes on the first three. A security evaluation that needs exhaustive source chains gets two Reddit posts and a docs link.

The problem is not capability — it is calibration. The engine can do shallow-and-wide or narrow-and-deep, but it will not choose correctly without a forcing function. Depth assessment is that forcing function.

This pattern was reverse-engineered from Cole Medin's Excalidraw diagram skill, which forces a classification step before any diagram work — determining whether a concept needs a simple sketch or a detailed architectural diagram. Same principle, applied to the entire pipeline instead of visual output.

---

## The Two Depths

### Scan (Breadth-First)

**When to use:** Landscape surveys, initial intake, quick staleness checks, simple outputs for experienced operators, early-stage exploration where the goal is to map the territory before choosing where to dig.

**Characteristics:**
- Covers many topics at surface level
- 1-2 sources per claim is sufficient
- Findings pattern library structures can use lightweight versions (skip optional fields)
- Walkthrough sections can be generated in larger chunks
- Binary self-tests use the quick versions
- The goal is coverage, not exhaustiveness

**What scan is NOT:** An excuse to skip dual-source validation. Even at scan depth, key claims get both an official and a community source. The difference is HOW MANY claims get dual-sourced — a scan might dual-source 3 pivotal claims where a deep-dive dual-sources everything.

### Deep-Dive (Depth-First)

**When to use:** Security evaluation, tool-specific architecture analysis, comprehensive outputs for operators new to a topic, any finding that will drive a GO/NO-GO decision, and any area where getting it wrong has real consequences.

**Characteristics:**
- Focuses on fewer topics with exhaustive coverage
- Dual-source validation required per claim (see `dual-source-intelligence.md`)
- Findings pattern library structures must use full templates with complete evidence chains
- Walkthrough sections must be built section-by-section (see `section-construction.md` when available)
- Binary self-tests use the thorough versions
- The goal is confidence, not coverage

**What deep-dive is NOT:** A license to spend unlimited time. Deep-dive means exhaustive on the specific topic — not comprehensive across all topics. Depth on security does not mean depth on operational polish.

---

## The 30-Second Classification

At the start of any pipeline stage, run through these three questions. The first YES answer determines the depth. If all three are NO, scan is appropriate.

```
Topic: [what you're about to work on]

1. "Will this finding drive a GO/NO-GO decision?"
   YES → Deep-dive. Stop here.
   NO  → Continue.

2. "Is the operator new to this topic?"
   YES → Deep-dive for their areas of unfamiliarity.
         Scan for context they already know.
   NO  → Continue.

3. "Has this topic had security implications in past research?"
   YES → Deep-dive on security aspects. Scan the rest.
   NO  → Scan is appropriate.
```

### Mixed-Depth Is Normal

A single pipeline stage often has both scan and deep-dive areas. Evaluating a new tool might mean:
- **Deep-dive:** Security posture, plugin trust model (GO/NO-GO decision + security implications)
- **Scan:** Feature comparison with alternatives (landscape context, not decision-critical)
- **Scan:** Installation requirements (experienced operator, familiar territory)

Classify per-topic, not per-stage.

---

## Reclassification

Depth can change mid-work. This is expected, not a failure. Scans exist partly to find what needs depth.

**When to reclassify:**
- A scan surfaces a security concern that was not anticipated
- A scan reveals the operator's knowledge gap is bigger than assumed
- A deep-dive determines the topic is simpler than expected and further depth adds noise, not signal
- Community intelligence contradicts official docs on something assumed to be settled

**How to reclassify:**
1. Flag it: "Reclassifying [topic] from scan to deep-dive because [specific reason]"
2. Log the reclassification in the activity log
3. Adjust the work accordingly — do not continue at the old depth after reclassifying

**Reclassification is a signal, not a problem.** If you are reclassifying frequently in the same direction (e.g., always promoting scan to deep-dive), the initial classification was probably too aggressive. Calibrate.

---

## How This Connects to Other Patterns

- **Findings Pattern Library:** Scan-depth findings use lightweight structures (skip optional fields). Deep-dive findings use full evidence chains with every field populated.
- **Binary Self-Tests:** Each test has a quick version (for scans) and a thorough version (for deep-dives). Quick tests check for presence. Thorough tests check for quality.
- **Section-by-Section Construction:** Only activates for deep-dive walkthrough generation. Scan-depth outputs are generated in larger chunks without incremental construction overhead.
- **Anti-Pattern Gallery:** Applies at all depths. The "Wall of Findings" anti-pattern is just as dangerous at scan depth as at deep-dive depth — it just manifests differently.

---

## Output #1 Example

In the OpenClaw evaluation (Output #1), the following depth assignments would have applied:

- **Deep-dive:** ClawHub security analysis (drove the GO/NO-GO decision on marketplace plugins — Tier 1 finding)
- **Deep-dive:** Sandbox configuration (security implications, operator unfamiliar with macOS sandboxing)
- **Scan:** Mac Mini hardware reliability (42 sources confirmed, no decision hinged on this)
- **Scan:** Competitor landscape (context for positioning, not a direct deployment decision)

This was done implicitly during Output #1. The depth assessment pattern makes it explicit and repeatable.

---

## Related Documents

- `dual-source-intelligence.md` — Scan depth still uses dual sources; depth determines how many claims get dual-sourced
- `editorial-standards.md` — Quality standards apply at both depths; depth determines thoroughness, not whether standards apply
- `three-tier-hardening.md` — Security-related depth decisions often align with Tier 1 (essential) hardening steps
- `credibility-tiers.md` — Deep-dive findings require higher-tier source chains; scan findings can rely on Tier 3-4 sources for initial mapping
