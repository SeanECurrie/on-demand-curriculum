# Output #2 Design: OpenClaw for Jeff

**Date:** 2026-03-03
**Output:** `outputs/openclaw-jeff/`
**Person:** Jeff — Denver real estate agent, Hatch brand owner (@jeffanswers)
**Operator:** Sean Currie (proxy)

---

## Identity

Jeff is a top-ranked real estate agent in Denver (#1-2 in AI search out of 20k agents). He owns the Hatch brand, has a partner, and is working toward franchising his business. He's having his slowest start to a year and wants to use AI to catch up — specifically to build his Instagram presence, which he's neglected.

He hates social media and being on it makes him anxious. He can follow instructions but has minimal terminal experience and no automation background. He has a Google Suite account and is getting a Claude subscription per Sean's recommendation.

He's buying a new MacBook Air (specs TBD — config-agnostic output).

---

## Scope

Three tiers of depth within this output:

### Core (must-have)
- What OpenClaw is and isn't — mental model, honest about limitations
- Why a dedicated machine matters — isolation, always-on, security boundary
- MacBook Air requirements — config-agnostic with minimum specs noted
- Claude subscription setup
- Step-by-step OpenClaw installation and deployment
- Security hardening calibrated to Jeff's risk level (real estate data, client info)
- How the pieces fit together — LLM, agent platform, skills, APIs

### Primary Use Case
- Social media management via OpenClaw — Instagram posting workflow
- Configure skills/agents for content creation and scheduling
- This is why Jeff is doing this — the walkthrough should get him to a working social media workflow, not just a running OpenClaw instance

### Educational Layer
- Why a dedicated machine (not just "do this" but the reasoning)
- Security vigilance — what to watch for, what's actually dangerous, practical terms
- Prompting basics — how to talk to the LLM effectively, good vs. bad instructions
- How the system works conceptually — enough to not be lost, not enough to be overwhelmed

### Foundational (light touch)
- SEO agent possibilities — brief "what's next" section
- Research agent capabilities — paths, not setup
- No contract/transaction coordinator work (out of scope)

---

## Walkthrough Structure

Estimated 1,200-1,800 lines. Setup-focused with expandable "want to understand this?" sections.

| # | Section | Purpose | Depth |
|---|---------|---------|-------|
| 1 | What is OpenClaw (and what isn't it) | Mental model. Misconceptions addressed. | Educational |
| 2 | Why a dedicated machine | Isolation, always-on, security boundary reasoning. | Educational + practical |
| 3 | Your setup | MacBook Air requirements, Claude subscription, pre-flight checklist. | Practical, config-agnostic |
| 4 | Installation & deployment | Step-by-step OpenClaw setup. Every command explained. | Guided setup + expandable depth |
| 5 | Security hardening | What to lock down, community flags, actual risks. Three-tier model. | Educational + practical, inline |
| 6 | Prompting & working with your agent | Good instructions, how LLM interprets, examples for his business. | Educational, transferable |
| 7 | Social media workflow | Configure skills for Instagram. Build posting workflow. | Primary use case |
| 8 | What's next | SEO, research agents, scaling possibilities. | Foundational, light |

**Interactive elements:** Checkboxes per step, expandable deep-dive sections, progress tracking, dark/light mode, working notes fields with localStorage persistence.

**Tone:** Never condescending — he's smart, just new to this domain. Setup-focused but genuinely educational. He should feel like he learned something, not just followed a recipe.

---

## Research Approach

Output #1's research (130+ sources) is a starting point but not reusable directly. Different hardware, different use case, different user, and staleness risk.

| Report | Needed? | Reasoning |
|--------|---------|-----------|
| Landscape | Abbreviated | Sean already chose OpenClaw. Brief validation — has anything changed? |
| Architecture | Abbreviated | Output #1 covered deeply. Jeff needs mental model, not internals. |
| Feasibility | Yes — new | MacBook Air is different. RAM, thermals, Docker on Air. Community data needed. |
| Security | Yes — refreshed | Jeff's risk profile differs (real estate data, client info). Landscape may have shifted. |
| Open Questions | Yes | Instagram API via OpenClaw, social media skill quality, Air performance. |

**Key dual-source research questions:**
1. OpenClaw on MacBook Air — community performance reports vs. official requirements
2. OpenClaw social media skills — what exists, community vs. official, security audit status
3. Instagram API integration patterns — what works, what's flaky
4. OpenClaw security updates since Output #1's research

**Reuse from Output #1:** Transferable concepts, architectural mental model, security framework structure. All findings get freshness-checked before reuse.

---

## Engine Test Points

Output #2 exercises every methodology improvement built during engine evolution. Explicit tracking:

| What Output #1 Did | What Output #2 Does Different | Engine Component |
|---|---|---|
| Pattern picked after rendering tech | Concept-to-pattern mapping before choosing Rough.js/Mermaid | Style guide 5.5-5.6 |
| No visual verification | Render-validate loop after each section | Render-validate skill, Phase C.5 |
| Hand-picked dark-mode colors | All colors from diagram-color-reference.md | Diagram color reference |
| 2 identical Mermaid flowcharts | Variety rule — distinct diagrams per concept | Isomorphism test |
| Notes fields never instantiated | Working notes with localStorage persistence | V5 self-test |
| No depth assessment | Depth assessment at pipeline start | Depth assessment skill |
| Loose source tracking | Every finding gets credibility tier tag | Credibility tiers + findings pattern |
| Anti-patterns caught retroactively | Anti-pattern check at natural pause points | Anti-pattern check skill |

**Success criteria:** Retroactive visual audit after completion. Score must beat Output #1's 1.5/6 tests and 5/8 isomorphism meaningfully. If not, the methodology didn't translate from documents to practice.

---

## Output Directory Structure

```
outputs/openclaw-jeff/
├── CONTEXT.md
├── operator/
│   └── jeff-profile.md
├── research/
│   ├── sources.md
│   ├── intelligence-log.md
│   ├── knowledge-base/
│   └── reports/
├── docs/
│   └── walkthrough/
│       └── interactive/
│           ├── openclaw-deployment-walkthrough.html
│           └── src/
│               ├── diagrams.js
│               └── styles.css
└── activity-log.md
```

**Delivery:** Self-contained HTML file Jeff can open in a browser, bookmark, and work through at his own pace.

**Reused from engine:** Interactive HTML template structure, CSS framework, JS interaction patterns (expandables, checkboxes, theme toggle, localStorage). These are engine-level patterns.

**Built fresh:** All content, all diagrams, all research. Not a find-and-replace of Output #1.

---

## Operator Profile Summary

- **Name:** Jeff
- **Brand:** Hatch (@jeffanswers on Instagram)
- **Profession:** Real estate agent, Denver, top-ranked in AI search
- **Technical level:** Minimal terminal experience, no automation background, can follow instructions
- **Motivation:** Slowest year start, competitive pressure, wants to be ahead of other agents adopting AI
- **Anxiety:** Hates social media, being on it makes him anxious — automation reduces this friction
- **Hardware:** MacBook Air (new, specs TBD)
- **LLM:** Claude subscription (Sean's recommendation)
- **Working style:** Needs spoon-feeding on tech but is intelligent and motivated. Will engage if guided well.
- **Long-term goals:** Franchise his business, systematize his expertise, scale through AI
