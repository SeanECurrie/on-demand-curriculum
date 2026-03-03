# Phase 0: Machine Preparation — Design Document

**Created:** 2026-02-14
**Status:** Pending approval
**Operator:** Sean Currie
**Source:** Brainstorming session informed by other agent's Mac Mini v1 DevHub state recap + ClawdBot Research Project security research (130+ sources)

---

## 1. What This Is

A documentation update across the project's deployment document suite to account for the reality that Sean's Mac Mini M4 is **not a fresh machine**. It has an existing v1 DevHub build (Homebrew, Docker Desktop, Ollama, Tailscale, FastAPI projects, monitoring containers, Git/GitHub, zsh customizations) that needs targeted preparation — not a full wipe — before OpenClaw deployment.

**What this changes:** The walkthrough, deployment plan, crib sheet, walkthrough design doc, CONTEXT.md, and logs — adding a new Phase 0 and adjusting Phases A/B to account for existing software.

**What this does NOT change:** Research artifacts, KB research files, security analysis, architecture docs, patterns, operator files, open questions report, or any other historical research document. Git history preserves the pre-update state.

**The deliverable is updated files in the repo.** No deployment actions are taken in this session.

---

## 2. Why This Matters (Security Framing)

This is not housekeeping. The machine prep has direct security implications from our research:

- **Identity/sync disconnection** is a security requirement. iCloud syncing `~/.openclaw/` defeats the data residency controls we designed (intelligence log Feb 11: "Sessions, memory, config, credentials stay local"). A logged-in browser with saved sessions is the attack bridge for CVE-2026-25253 (CVSS 8.8, 1-click RCE).
- **Unnecessary services** expand the attack surface. Ollama listening on a port, monitoring containers running, old project files — all are filesystem and network surface the OpenClaw agent doesn't need and could theoretically enumerate or interact with.
- **Existing software** changes the deployment path. Homebrew and Docker are already installed. Tailscale is already configured. The walkthrough shouldn't tell you to install things that are already there — it should tell you to verify and clean them.

---

## 3. Design Decisions (from brainstorming)

| Decision | Choice | Why |
|----------|--------|-----|
| Structure | New Phase 0 before Phase A | Clear separation — prep is its own phase with its own checklist and deployment notes |
| Specificity | Written for Sean's actual machine state | The v1 DevHub build is known — names specific software (Ollama, Glances, Dozzle, FastAPI) rather than being generic |
| Verification | Readiness check at end of Phase 0 | Audit commands produce output Sean can review (alone or with agent) before proceeding to Phase A |
| Versioning | Edit documents in-place | Git history preserves originals. Documents should reflect current truth. |
| Scope | Approach C — full document suite | All deployment-related documents updated for consistency. Research artifacts left as historical record. |
| Downstream phases | Phase A/B adjusted, C-I unchanged | By end of Phase B, machine state converges regardless of starting point |

---

## 4. Phase 0 Content Design

Phase 0 follows the same walkthrough format as Phases A-I: concept explanation, commands, expected output, "if something's wrong" guidance, blank Deployment Notes section.

### Part 1: Identity & Sync Disconnection

**Purpose:** Remove personal identity artifacts and cloud sync that conflict with OpenClaw's security model.

**Actions:**
- Sign out of iCloud entirely (or disable all sync services: Drive, Photos, Contacts, Calendars, Keychain)
- Sign out of Google accounts in all browsers
- Clear browser saved sessions/cookies
- Disable any other cloud sync (Dropbox, OneDrive, etc. if present)

**Educational framing:** Explains WHY — ties to CVE-2026-25253 browser bridge attack, data residency requirements from our security research, and the principle that this machine's role is now "headless AI agent node" not "personal device."

### Part 2: Software Audit & Cleanup

**Purpose:** Capture current machine state, remove what's not needed, keep what helps.

**Audit commands** (capture pre-cleanup state for the record):
```
brew list / brew list --cask
docker ps -a / docker images
pip list (if pip exists)
npm list -g --depth=0
lsof -iTCP -sTCP:LISTEN (listening ports)
launchctl list (running services)
ls ~/  (home directory overview)
```

**Remove/stop:**
- Ollama and pulled models (reinstall later for local GGUF embeddings if needed, Week 1-2 roadmap item)
- Docker containers: Glances, Dozzle, Portainer, any others from v1 build
- Old project repos (archive to GitHub first if not already pushed)
- FastAPI wrapper and associated Python virtual environments
- PostgreSQL if running (not part of OpenClaw stack)
- Unused Homebrew packages (after review)

**Keep:**
- Homebrew (needed for Node.js 22, general package management)
- Docker Desktop (needed for OpenClaw sandbox, clean it but keep it)
- Tailscale (already configured, core to our security architecture)
- Git (needed for config-as-code backup strategy)
- zsh / iTerm2 (operational tooling for SSH management)
- Core CLI tools: curl, wget, jq, htop

**Docker cleanup:**
- Stop all running containers
- Remove all containers from v1 build
- Prune images (`docker system prune -a`)
- Verify Docker Desktop itself is updated

**Homebrew cleanup:**
- `brew update && brew upgrade` (bring existing packages current)
- Review installed packages against keep/remove list
- `brew autoremove && brew cleanup` (remove orphaned dependencies)

### Part 3: Readiness Verification

**Purpose:** A checkpoint before Phase A. Run a set of commands that produce a machine state snapshot confirming the prep is complete.

**Readiness check covers:**
- macOS version + architecture (arm64)
- FileVault status (should be on or enabling — if off, flag it for Phase A5)
- SIP + Gatekeeper status (both should be enabled)
- Tailscale status (connected, starts at login)
- Homebrew packages (post-cleanup, should be lean)
- Docker status (no running containers, minimal images, Desktop running)
- Listening ports (nothing unexpected — no Ollama, no Postgres, no monitoring stacks)
- Disk space available
- RAM available
- No iCloud/Google sync active

**This is the go/no-go gate.** If the readiness check looks clean, proceed to Phase A. If something unexpected shows up, investigate before continuing.

---

## 5. Adjustments to Existing Phases

### Phase A (macOS Hardening)

- "Understanding: macOS as a Server" section: brief addition acknowledging the machine has been a dev node — server hardening still applies but foundations (Terminal familiarity, Homebrew) are already there
- Steps A2-A4 (sleep, headless, auto-updates): add verification commands to check current state before overwriting — some may already be partially configured
- Step A5 (FileVault): add note that if enabled during Phase 0 prep, just verify completion
- Step A7 (Tailscale): shift from "install and set up" to "verify and tighten ACLs" — Tailscale is already installed and working

### Phase B (Runtime Setup)

- Step B1 (Node.js 22): change from "install Homebrew then install Node" to "verify Homebrew is current, upgrade/install Node.js 22" — `brew update && brew upgrade` since existing Homebrew may be stale
- Add note about cleaning up old Node versions if nvm or multiple versions exist from v1 build
- Step B2 (Verify ARM-Native): no change, verification still needed

### Phases C through I

No changes. By the end of Phase B, the machine state converges to the same point regardless of whether it started fresh or was prepped from an existing build.

---

## 6. Documents to Update

| Document | Change |
|----------|--------|
| `docs/walkthrough/2026-02-11-v1-initial-deployment.md` | Add Phase 0 before Phase A. Adjust Phase A/B per Section 5. Update header/phase count. |
| `knowledge-base/04-deployment/mac-mini-deployment-plan.md` | Add Phase 0 section in plan format (commands + expected outcomes + citations). Adjust Pre-Flight, Phase A/B. |
| `docs/walkthrough/crib-sheet.md` | Add "Pre-Deployment Machine Prep" section at top. Adjust "Software to Install" table (verify existing vs install new). |
| `docs/plans/2026-02-11-deployment-walkthrough-design.md` | Update 9-phase table to 10 phases (Phase 0-I). Add Phase 0 to source list. Add revision note with date. |
| `CONTEXT.md` | Update status to reflect Phase 0 addition. Note Mac Mini's actual current state (v1 DevHub build). |
| `activity-log.md` | Log brainstorming session, design approval, and documentation updates. |
| `intelligence-log.md` | Log strategic insight: existing machine prep is a security concern, not housekeeping. |

**Documents NOT changing:** All research artifacts, KB research files (01-landscape through 07-operations except deployment plan), security analysis, architecture docs, patterns, operator files, open questions report, sources file.

---

## 7. Source Context for Phase 0

Phase 0 content is informed by:

| Source | What It Provides |
|--------|-----------------|
| Other agent's Mac Mini v1 DevHub state recap | Actual machine state: what's installed, how it was built, phased architecture |
| This session's conversation (2026-02-14) | Security-informed prep recommendations, keep/remove decisions |
| `knowledge-base/03-security/security-posture-analysis.md` | Security rationale for identity disconnection, attack surface reduction |
| `intelligence-log.md` entries on CVE-2026-25253 | Browser bridge attack vector — why logged-in browsers matter |
| `intelligence-log.md` entries on data residency | Why cloud sync defeats local-first architecture |
| `knowledge-base/04-deployment/mac-mini-community-findings.md` | Community patterns for Mac Mini server prep |

---

## 8. Success Criteria

The documentation update is successful if:

1. Someone reading the walkthrough tomorrow understands they need to prep the machine before Phase A
2. Phase 0 commands are specific to the known v1 DevHub build state
3. The readiness verification gives confidence the machine is clean before proceeding
4. Phases A and B don't ask you to install things that are already there
5. All 7 updated documents are internally consistent about the 10-phase structure
6. Research artifacts remain untouched as historical record
7. Git commit captures the update cleanly
