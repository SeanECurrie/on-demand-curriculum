# Deployment Walkthrough Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Write the educational deployment walkthrough at `docs/walkthrough/2026-02-11-v1-initial-deployment.md`, synthesizing the deployment plan and KB research into a read-ahead guide for Sean.

**Architecture:** Single Markdown file built incrementally. Each task writes one section. Source material comes from the knowledge base files. Educational "Understanding" sections appear in 5 of 9 phases.

**Tech Stack:** Markdown documentation. No code to test — verification is format consistency and source accuracy.

---

## Ground Rules

- **Source of truth:** `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 1-1455) has every command, expected outcome, and citation. The walkthrough REFRAMES this content educationally — it does not invent new commands.
- **Walkthrough format (from design):** Each step = Concept → Command → Expected Output → If Something's Wrong. "Understanding" sections are 2-3 paragraphs explaining the WHY.
- **Voice:** Written for Sean specifically. Senior engineer learning a new stack. Not a beginner tutorial, not a reference manual. Conversational but precise.
- **Cross-references:** Link back to KB files for deeper context (e.g., "For the full threat model, see `knowledge-base/03-security/security-posture-analysis.md`").
- **Deployment Notes:** Every phase ends with a blank "Deployment Notes" section for Sean to fill in during actual deployment.
- **No invention:** Every command and config snippet comes from the deployment plan. The walkthrough adds explanation and educational context, not new steps.

---

### Task 1: Create Walkthrough File — Header + State of Research

**Files:**
- Create: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `CONTEXT.md` (verdicts, key decisions, open questions)
- Read: `research/reports/05-open-questions.md` (deployment blockers list)

**What to write:**
1. Document title, date, version context
2. "How to Use This Walkthrough" section — explain the read-ahead model, the check-in process, and the deployment notes convention
3. "State of Research at Time of Writing" snapshot — frozen-in-time context:
   - Date, OpenClaw target version (>= 2026.1.29), research source count (130+)
   - Three verdicts (Mac Mini GO, OpenClaw GO with hardening, stack recommendation)
   - Key decisions applied (zero ClawHub, no elevated mode, local GGUF, security-first order, dedicated user)
   - 8 open questions to resolve during deployment (from CONTEXT.md)
4. "Pre-Flight Checklist" — items to acquire before sitting down (from deployment plan Pre-Flight section, lines 18-46). Add brief explanations of WHY each item is needed, not just what it is.

**Commit:** `docs: walkthrough header and state of research snapshot`

---

### Task 2: Phase A — macOS Hardening

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 49-325, Phase A)
- Read: `knowledge-base/03-security/security-posture-analysis.md` (macOS-specific hardening rationale)
- Read: `knowledge-base/04-deployment/mac-mini-community-findings.md` (headless gotchas, always-on tips)

**What to write:**

**Understanding section: "macOS as a Server"** (2-3 paragraphs)
- macOS was designed as a desktop OS, not a server. Explain what that means practically: sleep defaults, auto-updates, screensaver, Gatekeeper, SIP.
- Contrast with Tim's Linux VPS where the OS was already server-ready.
- Explain the security model: admin vs non-admin users on macOS vs root/non-root on Linux.

**Steps (A1-A8 from deployment plan, reframed):**
Each step needs: concept explanation, the command(s), expected output, common failure modes.
- A1: Dedicated non-admin user (explain blast radius concept)
- A2: Always-on settings (explain pmset, caffeinate, launchd daemon)
- A3: Headless operation (dummy HDMI, why macOS degrades without display)
- A4: Disable auto-updates (explain why manual updates on servers, add to weekly cadence)
- A5: FileVault (explain full-disk encryption, recovery key importance)
- A6: macOS firewall / pf (explain pf vs ufw, the loopback belt-and-suspenders concept)
- A7: Tailscale ACL verification (explain why Tailscale is the strongest security layer)
- A8: SIP and Gatekeeper verification (explain what they protect against)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase A — macOS hardening`

---

### Task 3: Phase B — Runtime Setup

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 327-371, Phase B)

**What to write:**

No "Understanding" section needed — this is straightforward.

**Steps (B1-B2):**
- B1: Install Node.js 22+ via Homebrew (brief note on why Homebrew, why 22+, what ARM-native means for performance)
- B2: Verify ARM-native (explain why Rosetta emulation is bad for a long-running service)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase B — runtime setup`

---

### Task 4: Phase C — OpenClaw Installation

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 373-455, Phase C)
- Read: `knowledge-base/02-architecture/deep-dive-findings.md` (gateway architecture section)
- Read: `knowledge-base/03-security/security-posture-analysis.md` (CVE-2026-25253 details)

**What to write:**

**Understanding section: "What the Gateway Actually Is"** (2-3 paragraphs)
- OpenClaw's architecture: Gateway → Nodes → Agents → Sub-agents. The gateway is the central nervous system.
- What `openclaw gateway install` does under the hood — creates a launchd LaunchAgent, not a systemd service.
- Why the version check matters — explain CVE-2026-25253 in plain terms (1-click RCE via browser, even on localhost).

**Steps (C1-C3):**
- C1: Install OpenClaw (npm, version check as CRITICAL GATE)
- C2: Onboard wizard (what each prompt means, Keychain/TCC dialog guidance)
- C3: Verify gateway via launchd (explain launchd vs systemd, how to check it's running)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase C — OpenClaw installation`

---

### Task 5: Phase D — Security Hardening

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 457-758, Phase D)
- Read: `knowledge-base/03-security/security-posture-analysis.md` (full threat model)
- Read: `patterns/001-zero-clawhub-supply-chain-defense.md`
- Read: `patterns/002-per-agent-routing-over-elevated-mode.md`
- Read: `patterns/003-reader-agent-prompt-injection-defense.md`

**What to write:**

This is the LARGEST and MOST IMPORTANT phase. Take time with the educational content.

**Understanding section: "Defense in Depth — Why This Order Matters"** (3-4 paragraphs)
- The default OpenClaw config is "dangerously permissive." Explain what that means: full filesystem access, all tools enabled, no exec restrictions.
- Explain defense in depth: multiple overlapping security layers so no single failure is catastrophic.
- Why security BEFORE channels: once Telegram is connected, messages from the internet can reach the agent. Hardening after connection is closing the barn door after the horse left.
- Brief mention of the two CVEs and the 12% malicious ClawHub skills — this is not theoretical.

**Steps (D1-D8):**
- D1: Gateway configuration (explain each setting and what it defends against — use the deployment plan's table)
- D2: Sandbox configuration (explain Docker sandbox concept, per-session isolation, the Apple Silicon overhead question)
- D3: exec-approvals.json (explain each denylist entry and what attack it prevents — this is key educational content)
- D4: Disable elevated mode (explain what it is and why per-agent routing is better — reference Pattern 002)
- D5: Disable mDNS (explain what gets broadcast and why that's bad)
- D6: Tool policy (explain Day-1 read-only philosophy — allow list vs deny list)
- D7: Security audit (explain the built-in audit tool)
- D8: File permissions (explain why 600/700 matters)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase D — security hardening`

---

### Task 6: Phase E — Model Configuration

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 760-839, Phase E)
- Read: `knowledge-base/02-architecture/deep-dive-findings.md` (model routing section)
- Read: `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` (cost section)

**What to write:**

**Understanding section: "How Model Routing Actually Works"** (2-3 paragraphs)
- Model routing is failover-based (primary + fallback chain), NOT intelligent task routing. This surprised us in research.
- Why Opus for security: it's the strongest at recognizing prompt injections. Cheaper models are more susceptible.
- Cost awareness: community reports of $20-50 Day 1. Explain active hours, heartbeat model override, skill pruning.

**Steps (E1-E3):**
- E1: Verify Anthropic API key + model selection
- E2: Model routing — Day-1 is Opus for everything, explain the Week 1-2 optimization path
- E3: Spending limits and cost controls (Anthropic console + active hours config)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase E — model configuration`

---

### Task 7: Phase F — Channel Setup

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 841-926, Phase F)

**What to write:**

No "Understanding" section needed — this is procedural.

Brief intro: "This is the moment the agent becomes reachable from the outside world. Everything before this was preparation. The security hardening in Phase D exists specifically to make this step safe."

**Steps (F1-F2):**
- F1: Telegram setup (BotFather, user ID, config, restart, pair — step by step)
- F2: Gateway UI access via Tailscale (explain Tailscale Serve for remote access to loopback-bound gateway)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase F — channel setup`

---

### Task 8: Phase G — Starter Skills & First Run

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 928-1053, Phase G)
- Read: `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md`
- Read: `knowledge-base/05-skills-and-integrations/skill-system-reference.md` (skill architecture overview)

**What to write:**

**Understanding section: "What Skills Actually Are (and Why ClawHub Is Dangerous)"** (2-3 paragraphs)
- Skills are Markdown instructions (SKILL.md), not code. The tool policy IS the security boundary.
- The ClawHub ecosystem has 12% malicious entries (341/2857). This is why we use zero external skills.
- Custom skills are safe because you write the Markdown yourself. No supply chain risk.

**Steps (G1-G4):**
- G1: Day-1 skills configuration (web_search, web_fetch, read, reactions, thinking — explain why each is safe)
- G2: Heartbeat configuration (explain what heartbeat does, active hours, the HEARTBEAT.md file)
- G3: First conversation test (the 5-test sequence — explain what each test validates)
- G4: Token usage monitoring (where to check, what to expect Day 1)

End with blank **Deployment Notes** section.

**Commit:** `docs: walkthrough Phase G — starter skills and first run`

---

### Task 9: Phase H — Validation

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 1055-1162, Phase H)
- Read: `research/reports/05-open-questions.md` (6 deployment blockers detail)

**What to write:**

No "Understanding" section — but a brief intro emphasizing that this is NOT optional. Every security measure needs to be verified, not assumed.

**Steps (H1-H3):**
- H1: 10 mandatory security conditions (the table from the deployment plan — each with the verification command and expected result)
- H2: Functional validation (full test sequence, gateway restart survival, reboot survival)
- H3: Test 6 deployment blockers (each blocker with specific test instructions and what to document)

End with blank **Deployment Notes** section (this one is especially important — document every test result).

**Commit:** `docs: walkthrough Phase H — validation`

---

### Task 10: Phase I + Footer + Appendix

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md`
- Read: `knowledge-base/04-deployment/mac-mini-deployment-plan.md` (lines 1164-1455, Phase I + Appendix)
- Read: `knowledge-base/07-operations/research-cadence.md`
- Read: `knowledge-base/07-operations/operational-runbook-template.md`

**What to write:**

**Phase I steps (I1-I3):**
- I1: Monitoring setup (daily/weekly/monthly commands, explain what you're looking for)
- I2: Backups (Time Machine encrypted + config-as-code via git, explain what goes where and why)
- I3: Document actual vs planned (the post-deployment findings template)

End with blank **Deployment Notes** section.

**Post-Deployment Checklist:**
- Verification checklist (checkboxes for all critical items)
- "Report Back" section — what to bring when checking in

**Appendix (from deployment plan):**
- Key file locations table
- Key commands reference
- Emergency procedures (compromise suspected, gateway won't start, locked out)
- Week 1-2 roadmap (what comes after Day 1)
- What this walkthrough does NOT cover (deferred items)

**Commit:** `docs: walkthrough Phase I + footer + appendix`

---

### Task 11: Project Bookkeeping

**Files:**
- Modify: `CONTEXT.md` — update status to reflect walkthrough exists
- Modify: `activity-log.md` — log walkthrough completion
- Modify: `CONTEXT-HISTORY.md` — add walkthrough section

**What to update:**

1. **CONTEXT.md:** Add "Deployment Walkthrough" section pointing to the file. Update "Current Status" to note that the walkthrough is ready.
2. **activity-log.md:** Add entries for walkthrough implementation.
3. **CONTEXT-HISTORY.md:** Add section documenting the walkthrough creation (brainstorming decisions, what it covers, how to use it).

**Commit:** `docs: update project files for walkthrough completion`

---

## Execution Notes

- **No TDD** — this is documentation, not code. Verification = reading the source KB files and checking the walkthrough accurately represents them.
- **Batch size for checkpoints:** Every 3 tasks (after Tasks 3, 6, 9, then final after 11).
- **The deployment plan is the source of truth** for every command and config snippet. The walkthrough adds educational framing, not new technical content.
- **Voice check:** If a section sounds like a reference manual, rewrite it. If it sounds like a beginner tutorial, tighten it. Target: senior engineer being onboarded to a new tool by a knowledgeable colleague.
