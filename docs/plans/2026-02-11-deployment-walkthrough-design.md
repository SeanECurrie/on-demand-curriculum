# Deployment Walkthrough — Design Document

**Created:** 2026-02-11
**Status:** Approved (brainstorming session)
**Operator:** Sean Currie
**Source:** Brainstorming session building on 130+ sources from Phase 1-3 research

---

## 1. What This Is

An **educational deployment walkthrough** — the culmination of the ClawdBot research project. It takes everything we learned across 100+ sources, 5 synthesis reports, and 45+ intelligence log entries, and turns it into a step-by-step guide Sean can follow to deploy OpenClaw on the Mac Mini.

**What it is NOT:**
- Not a copy of the deployment plan (that's the reference document)
- Not a tutorial written for strangers (it's written for Sean, with his context)
- Not a live session transcript — it's a read-ahead guide

## 2. Design Decisions (from brainstorming)

| Decision | Choice | Why |
|----------|--------|-----|
| Tutorial depth | "Explain the concept, then the command" with deeper dives on important topics | Senior engineer learning a new stack — not a beginner, but new to this tool |
| Project relationship | Part of the existing research project | Culmination of the research, not a separate effort |
| Content location | `docs/walkthrough/` | Timestamped, versioned, with state-of-research context |
| Execution approach | Read-ahead guide + check-in during deployment | Sean reads ahead, deploys independently, checks in for questions |
| File structure | Single comprehensive file per walkthrough | Linear reading flow, no tab-switching |

## 3. File Structure

```
docs/walkthrough/
└── 2026-02-11-v1-initial-deployment.md   # First walkthrough
```

Future walkthroughs (after major OpenClaw updates, config changes, or re-deployment):
```
docs/walkthrough/
├── 2026-02-11-v1-initial-deployment.md
└── 2026-XX-XX-v2-<topic>.md
```

Each walkthrough is self-contained. Older ones stay as historical records — never deleted (per project constitution).

## 4. Walkthrough Document Structure

### Header: State of Research Snapshot

Every walkthrough opens with a frozen-in-time snapshot:

```markdown
## State of Research at Time of Writing

**Date:** 2026-02-11
**OpenClaw target version:** >= 2026.1.29 (CVE patches mandatory)
**Research sources:** 130+ across Context7 + Bright Data
**Key verdicts:**
- Mac Mini M4: GO (community validated)
- OpenClaw: GO with mandatory hardening
- Stack: OpenClaw + n8n (future) + Langfuse (future)

**Key decisions applied in this walkthrough:**
- Zero ClawHub skills — custom Markdown skills only
- Elevated mode DISABLED — per-agent routing
- Local GGUF embeddings for on-device memory search
- Security hardening BEFORE channel connection
- Dedicated non-admin macOS user for OpenClaw

**Open questions to resolve during this deployment:**
[List from CONTEXT.md — the things we'll test hands-on]
```

This snapshot means that 3 months from now, Sean can look at this walkthrough and know exactly what the research said when it was written.

### Per-Phase Structure

Each of the 9 phases follows this format:

```markdown
## Phase X: [Title]

**What we're doing:** One-sentence summary.
**Why it matters:** 2-3 sentences connecting this to security/architecture/operations.
**Time estimate:** Rough duration.
**Cross-reference:** Link to the deployment plan section for raw details.

### Understanding [Key Concept]
(Deeper educational content — 2-3 paragraphs)
(Only included for phases with important concepts to grasp)
(Security, routing, architecture, troubleshooting)

### Step X.1: [Step Title]

**Concept:** What this does and why we're doing it.

[command block]

**Expected output:**
[what you should see]

**If something's wrong:**
- [common failure mode 1] — [what to do]
- [common failure mode 2] — [what to do]

### Deployment Notes
(Blank section — Sean fills this in during/after deployment)
(What actually happened, any deviations, observations)
```

### Footer: Post-Deployment Checklist

```markdown
## After Deployment

### Verification Checklist
- [ ] Version confirmed >= 2026.1.29
- [ ] Non-admin user running gateway
- [ ] FileVault enabled
- [ ] exec-approvals configured
- [ ] All 6 deployment blockers tested
- [ ] First conversation completed successfully

### Report Back
When deployment is done (or stuck), check in with:
- What phase you completed through
- Any deviations from the walkthrough
- Open questions that came up
- Anything that surprised you

We'll update: activity-log, intelligence-log, CONTEXT.md, and annotate
this walkthrough with what actually happened.
```

## 5. The Nine Phases

Based on the deployment plan (knowledge-base/04-deployment/mac-mini-deployment-plan.md), reframed with educational context:

| Phase | Deployment Plan | Walkthrough Focus | "Understanding" Section |
|-------|----------------|-------------------|------------------------|
| A | macOS Hardening | Why a dedicated user matters, what FileVault does, macOS vs Linux server model | Yes: macOS as a server |
| B | Runtime Setup | What Node.js 22 brings, why ARM-native matters on M4 | No (straightforward) |
| C | OpenClaw Installation | What the gateway is, what `openclaw gateway install` does under the hood (launchd) | Yes: Gateway architecture |
| D | Security Hardening | The CVEs and what they mean, exec-approvals, sandboxing layers, why before channels | Yes: Defense in depth |
| E | Model Configuration | Per-agent routing vs global, why no elevated mode, cost awareness | Yes: Agent routing |
| F | Channel Setup | Telegram bot mechanics, Tailscale Serve, auth headers, why order matters | No (procedural) |
| G | Starter Skills & First Run | What skills actually are (Markdown instructions), which ones and why, the zero-ClawHub decision | Yes: Skill security model |
| H | Validation | Testing each security layer, the 6 deployment blockers, verification evidence | No (procedural, critical) |
| I | Post-Deployment Immediate | Backups, monitoring, what to watch in first 48 hours, research cadence kickoff | No (operational) |

"Understanding" sections appear in 5 of 9 phases — the ones where grasping the concept makes the commands make sense rather than just being copy-paste.

## 6. Interaction Model

```
1. Walkthrough is written and committed to the project
2. Sean reads ahead — entire walkthrough or phase by phase
3. Sean starts deploying on the Mac Mini
4. Sean checks in here when:
   - Something doesn't match expected output
   - A question comes up
   - Wants to discuss a decision before executing
   - Completed a phase and wants to report
5. After deployment completes:
   - Sean reports final state
   - We update activity-log, intelligence-log, CONTEXT.md
   - Annotate the walkthrough with "what actually happened"
   - Log any new open questions or intelligence
   - The living system continues
```

## 7. What The Walkthrough Draws From

| Source | What It Provides |
|--------|-----------------|
| `knowledge-base/04-deployment/mac-mini-deployment-plan.md` | Every command, every step, every expected outcome |
| `knowledge-base/03-security/security-posture-analysis.md` | Security rationale behind each hardening step |
| `knowledge-base/02-architecture/deep-dive-findings.md` | Architecture concepts for "Understanding" sections |
| `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` | Which skills to enable and why |
| `knowledge-base/05-skills-and-integrations/skill-system-reference.md` | How skills work under the hood |
| `patterns/` | Reusable patterns referenced in context |
| `research/reports/05-open-questions.md` | The 6 deployment blockers to test |
| `operator/sean-currie-profile.md` | Infrastructure details, Sean's setup |

## 8. Scope Boundaries

**In scope:**
- Educational deployment walkthrough (Phases A-I)
- State-of-research snapshot
- "Understanding" sections for key concepts
- Blank deployment notes sections for Sean to fill
- Post-deployment checklist
- Cross-references to KB files

**Out of scope (future work):**
- n8n installation and integration (Phase 2 of the stack)
- Langfuse observability setup (Phase 3 of the stack)
- Custom skill development (post-deployment activity)
- Multi-agent architecture beyond starter config
- Performance tuning and optimization

## 9. Success Criteria

The walkthrough is successful if:
1. Sean can read it and understand *why* each step exists, not just *what* to type
2. Every command is copy-pasteable and correct
3. Expected outputs are accurate enough to confirm success
4. The "if something's wrong" sections cover the most likely failure modes
5. After deployment, the project can be updated with real-world findings
6. The walkthrough serves as a reference for future re-deployments or updates
