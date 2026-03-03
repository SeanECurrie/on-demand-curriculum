# Phase 0 Documentation Update — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update the project's deployment document suite to add Phase 0 (Machine Preparation) and adjust Phases A/B for an existing Mac Mini with a v1 DevHub build.

**Architecture:** 7 files edited in-place. Phase 0 content written in the same format as existing phases. Adjustments to Phases A/B are surgical — verify-then-configure instead of install-from-scratch. Logs and context files updated last.

**Tech Stack:** Markdown files, git for version control.

---

## Task 1: Add Phase 0 to the Walkthrough

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md:1-10` (header — update phase count)
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md:36-68` (State of Research / Open Questions table — add Phase 0 references)
- Insert new content before line 107 (before `## Phase A: macOS Hardening`)

**Step 1: Update the walkthrough header**

Change line 1 from:
```markdown
# OpenClaw Deployment Walkthrough — v1
```
to:
```markdown
# OpenClaw Deployment Walkthrough — v1.1
```

Add after line 7 (`**Based On:**` line):
```markdown
**Updated:** 2026-02-14 — Added Phase 0 (Machine Preparation) for existing Mac Mini with v1 DevHub build
```

**Step 2: Add Phase 0 reference to the Open Questions table**

In the Open Questions table (around line 58-68), add a row:
```markdown
| 0 | Machine state audit | Phase 0 (prep) | Audit commands capture current state — review before proceeding |
```

**Step 3: Write Phase 0 content**

Insert the following before `## Phase A: macOS Hardening` (line 107). This is the largest single piece of new content:

```markdown
## Phase 0: Machine Preparation

**What we're doing:** Preparing your existing Mac Mini — which has a v1 DevHub build (Homebrew, Docker, Ollama, Tailscale, FastAPI projects, monitoring containers) — for its new role as a dedicated OpenClaw deployment node. No wipe needed.
**Why it matters:** This isn't tidying. Identity artifacts (iCloud, Google) create data exfiltration paths that conflict with OpenClaw's local-first security model. Unnecessary services (Ollama, monitoring containers) expand the attack surface. Existing software (Homebrew, Docker) changes the deployment path for later phases.
**Time estimate:** 30-45 minutes.
**Source context:** This phase was added on 2026-02-14 based on a review of the Mac Mini's actual state (v1 DevHub build from a prior project) against this project's security research.

### Understanding: Redefining the Machine's Role

Your Mac Mini started life as a modular dev node — a lab bench for Docker, local LLMs, FastAPI, and CI/CD experiments. That was the right build for exploration. But the role is changing. This machine is about to become a security-hardened, headless AI agent orchestration node running OpenClaw as a persistent service, accessible exclusively via Tailscale, with Docker sandbox for tool isolation.

That role change has two implications:

First, **identity artifacts become a security liability.** iCloud sync means files under `~/.openclaw/` (API keys, session transcripts, credentials) could sync to Apple's servers — defeating the data residency controls we designed. Logged-in browsers with saved Google sessions are the exact attack bridge that CVE-2026-25253 (CVSS 8.8, 1-click RCE) exploits. On a personal device, staying logged into iCloud and Google is normal. On an agent node, it's an attack surface.

Second, **leftover services are unnecessary exposure.** Ollama listening on a port, Glances/Dozzle containers running, old project files scattered across the filesystem — none of these are part of the OpenClaw stack, but all of them are surface area the agent could theoretically interact with. The principle is simple: if OpenClaw doesn't need it, it shouldn't be there.

The good news: most of your v1 build helps rather than hurts. Homebrew, Docker Desktop, Tailscale, Git, and your terminal setup are all things we'd install from scratch on a clean machine. You're ahead — you just need to clean and verify rather than build from zero.

### 0.1: Identity & Sync Disconnection

**Concept:** This is a security requirement, not personal preference. OpenClaw stores credentials, session transcripts, and API keys locally. Cloud sync services create paths for that data to leave the machine. A logged-in browser is the attack vector for the most critical CVE in OpenClaw's history.

**Actions (in System Settings and browsers — these are GUI steps):**

1. **iCloud:** System Settings > [Your Name] > Sign Out. If you want to keep your Apple ID for App Store access only, instead go to System Settings > [Your Name] > iCloud and individually disable: iCloud Drive, Photos, Contacts, Calendars, Keychain, Safari, Notes, and everything else. The goal is zero sync.

2. **Google accounts:** Open every browser on this machine (Safari, Chrome, Firefox, etc.). Sign out of all Google accounts. Clear saved sessions and cookies. If you use Chrome, also go to Settings > You and Google > Turn off sync.

3. **Other cloud sync:** If Dropbox, OneDrive, or any other sync service is installed, sign out and quit it. Check System Settings > General > Login Items to see what starts at boot — remove anything sync-related.

**Verification:**
```bash
# Check for running sync processes
ps aux | grep -i -E "icloud|dropbox|onedrive|googledrive" | grep -v grep
# Expected: No results (nothing sync-related running)

# Check Login Items for sync services
osascript -e 'tell application "System Events" to get the name of every login item'
# Review the list — flag anything that syncs to cloud
```

**Expected output:** No cloud sync processes running. Login Items clean of sync services.

**If something's wrong:**
- If iCloud sign-out asks about keeping data locally: choose "Keep on This Mac" — we're not deleting your data, just stopping sync
- If a sync process won't quit: check Activity Monitor, force quit if needed
- If you need your Apple ID for App Store (e.g., to update apps): keep it signed in but disable ALL iCloud services individually

### 0.2: Software Audit

**Concept:** Before removing anything, capture the machine's current state. This serves two purposes: it gives you a record of what was installed (in case you need to reconstruct something later), and it gives you (or your agent) data to review rather than relying on memory.

```bash
# Capture pre-cleanup state — save this output
echo "=== HOMEBREW PACKAGES ===" && brew list && echo "" && \
echo "=== HOMEBREW CASKS ===" && brew list --cask && echo "" && \
echo "=== DOCKER CONTAINERS ===" && docker ps -a 2>/dev/null && echo "" && \
echo "=== DOCKER IMAGES ===" && docker images 2>/dev/null && echo "" && \
echo "=== GLOBAL NPM PACKAGES ===" && npm list -g --depth=0 2>/dev/null && echo "" && \
echo "=== PIP PACKAGES ===" && pip list 2>/dev/null && echo "" && \
echo "=== LISTENING PORTS ===" && lsof -iTCP -sTCP:LISTEN -P 2>/dev/null && echo "" && \
echo "=== HOME DIRECTORY ===" && ls -la ~/
```

**Expected output:** A snapshot of everything on the machine. Save this output — paste it into the Deployment Notes section at the end of this phase, or save it to a file:
```bash
# Optional: save to a file for the record
bash -c 'echo "=== HOMEBREW PACKAGES ===" && brew list && echo "" && echo "=== HOMEBREW CASKS ===" && brew list --cask && echo "" && echo "=== DOCKER CONTAINERS ===" && docker ps -a 2>/dev/null && echo "" && echo "=== DOCKER IMAGES ===" && docker images 2>/dev/null && echo "" && echo "=== GLOBAL NPM PACKAGES ===" && npm list -g --depth=0 2>/dev/null && echo "" && echo "=== PIP PACKAGES ===" && pip list 2>/dev/null && echo "" && echo "=== LISTENING PORTS ===" && lsof -iTCP -sTCP:LISTEN -P 2>/dev/null && echo "" && echo "=== HOME DIRECTORY ===" && ls -la ~/' > ~/pre-openclaw-audit-$(date +%Y%m%d).txt
```

**This is a checkpoint.** Review the output. If you want a second opinion on what should stay or go, share it with your agent before proceeding to Step 0.3.

### 0.3: Software Cleanup

**Concept:** Remove services and software that aren't part of the OpenClaw stack. The keep/remove decisions below are based on this project's research — what OpenClaw needs vs. what was part of the v1 DevHub build.

**Ollama — remove (reinstall later if needed):**
```bash
# Stop Ollama if running
ollama stop 2>/dev/null
pkill -f ollama 2>/dev/null

# Remove Ollama
brew uninstall ollama 2>/dev/null
# Or if installed via the official installer:
sudo rm -rf /usr/local/bin/ollama
rm -rf ~/.ollama

# Verify
which ollama
# Expected: "ollama not found"
```
Ollama is a Week 1-2 roadmap item (local GGUF embeddings). Reinstall then if needed — no reason to keep it consuming disk space now.

**Docker containers — stop and remove all:**
```bash
# Stop all running containers
docker stop $(docker ps -q) 2>/dev/null

# Remove all containers (Glances, Dozzle, Portainer, etc.)
docker rm $(docker ps -aq) 2>/dev/null

# Remove all images
docker system prune -a --force

# Verify
docker ps -a
# Expected: empty list
docker images
# Expected: empty list
```
Docker Desktop itself stays — OpenClaw uses it for sandbox containers. We're just cleaning out the v1 monitoring stack.

**Old project repos and Python environments:**
```bash
# Review what's in your home directory
ls ~/

# Archive any repos you want to keep — push to GitHub if not already:
# cd ~/your-project && git push origin main

# Remove local copies of projects that are safely on GitHub:
# rm -rf ~/fastapi-project  (adjust names to match your actual directories)
# rm -rf ~/your-other-project

# Remove Python virtual environments:
# rm -rf ~/venv
# rm -rf ~/.local/lib/python*  (if pip installed packages globally)
```
**Note:** Only remove repos you've confirmed are pushed to GitHub. If in doubt, push first.

**PostgreSQL — stop if running:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# If running:
brew services stop postgresql
# Optional — remove entirely if not needed:
# brew uninstall postgresql
```

**Unused Homebrew packages:**
```bash
# Update Homebrew and upgrade existing packages first
brew update && brew upgrade

# Review what's installed
brew list

# Remove packages you don't need (examples — adjust to your actual install):
# brew uninstall python@3.11  (if you don't need Python for OpenClaw)
# brew uninstall <other-unused-packages>

# Clean up orphaned dependencies and old downloads
brew autoremove && brew cleanup
```

**What to keep (do NOT remove):**
- `git` — needed for config-as-code backup
- `curl`, `wget` — HTTP tools
- `jq` — JSON processing (useful for config inspection)
- `htop` — system monitoring
- Docker Desktop — needed for OpenClaw sandbox
- Tailscale — core security infrastructure
- iTerm2 — terminal
- Node.js (any version) — will be upgraded/installed as Node 22 in Phase B

**Expected output:** A much leaner machine. Only software that serves the OpenClaw deployment remains.

### 0.4: Homebrew Health Check

**Concept:** Your existing Homebrew may have stale packages, broken links, or orphaned dependencies from the v1 build. Clean it up so Phase B starts from a healthy base.

```bash
# Run Homebrew's built-in diagnostics
brew doctor

# Fix any issues it reports (follow the suggestions in the output)

# Verify Homebrew is healthy
brew --version
```

**Expected output:** `brew doctor` reports "Your system is ready to brew" (or only cosmetic warnings).

**If something's wrong:**
- `brew doctor` may suggest unlinking or relinking packages — follow its advice
- If it warns about permissions: `sudo chown -R $(whoami) /opt/homebrew`

### 0.5: Docker Desktop Verification

**Concept:** Docker Desktop stays but should be clean and current. It will be used for OpenClaw's sandbox containers.

```bash
# Verify Docker Desktop is running
docker --version
docker info | head -20

# Check that no containers or images remain from cleanup
docker ps -a
docker images

# Update Docker Desktop if needed
# Open Docker Desktop > Check for Updates (this is a GUI step)
```

**Expected output:** Docker running, no containers, no images, current version.

### 0.6: Readiness Verification

**Concept:** This is the go/no-go gate before Phase A. Run this command block and review the output. Everything should look clean. If something unexpected appears — an unknown listening port, a sync process still running, more disk usage than expected — investigate before proceeding.

```bash
echo "=== READINESS CHECK ==="
echo ""
echo "--- macOS Version ---"
sw_vers
uname -m
echo ""
echo "--- FileVault ---"
sudo fdesetup status
echo ""
echo "--- SIP ---"
csrutil status
echo ""
echo "--- Gatekeeper ---"
spctl --status
echo ""
echo "--- Tailscale ---"
tailscale status
echo ""
echo "--- Homebrew Packages ---"
brew list
echo ""
echo "--- Homebrew Casks ---"
brew list --cask
echo ""
echo "--- Docker Status ---"
docker ps -a 2>/dev/null
docker images 2>/dev/null
echo ""
echo "--- Listening Ports ---"
lsof -iTCP -sTCP:LISTEN -P 2>/dev/null
echo ""
echo "--- Disk Space ---"
df -h /
echo ""
echo "--- Memory ---"
sysctl hw.memsize | awk '{print $2/1073741824 " GB"}'
echo ""
echo "--- Cloud Sync Processes ---"
ps aux | grep -i -E "icloud|dropbox|onedrive|googledrive" | grep -v grep
echo ""
echo "=== END READINESS CHECK ==="
```

**What you're looking for:**
- macOS 15.x, arm64
- FileVault: On (or "Encryption in progress...")
- SIP: enabled
- Gatekeeper: assessments enabled
- Tailscale: connected with your devices listed
- Homebrew: lean list — git, core tools, maybe Docker cask
- Docker: no containers, no images
- Listening ports: nothing unexpected (no Ollama on 11434, no Postgres on 5432, no Glances/Dozzle)
- Disk: reasonable free space (50+ GB preferred)
- Memory: 16 GB
- Cloud sync: no results (nothing running)

**If everything looks clean:** Proceed to Phase A.
**If something unexpected appears:** Investigate before continuing. This is the last checkpoint before you start hardening the OS.

### Phase 0 — Deployment Notes

*Fill this in during deployment:*

- [ ] iCloud signed out / all sync disabled?
- [ ] Google accounts signed out of browsers?
- [ ] Pre-cleanup audit saved?
- [ ] Ollama removed?
- [ ] Docker containers/images cleaned?
- [ ] Old project repos archived and removed?
- [ ] Homebrew cleaned and healthy?
- [ ] Readiness check reviewed — all clean?
- Notes / deviations / surprises:

---
```

**Step 4: Verify the insertion**

Read the walkthrough around the insertion point to confirm Phase 0 appears before Phase A and the formatting is consistent.

**Step 5: Commit**

```bash
git add docs/walkthrough/2026-02-11-v1-initial-deployment.md
git commit -m "docs: add Phase 0 (Machine Preparation) to deployment walkthrough"
```

---

## Task 2: Adjust Phase A in the Walkthrough

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md` — Phase A section (starts at line ~107 after Phase 0 insertion, originally line 107)

**Step 1: Update the "Understanding: macOS as a Server" section**

After the existing paragraph that starts "macOS was designed for someone sitting at a desk..." and the paragraph about Tim's VPS, add a new paragraph:

```markdown
One advantage you have: your Mac Mini isn't starting from zero. The Phase 0 prep you just completed means Homebrew is already installed and healthy, Tailscale is already configured and running, and Docker Desktop is clean and ready for sandbox use. The server hardening steps in this phase still apply in full — sleep prevention, FileVault, firewall rules, SIP verification — but you won't be installing foundational tools alongside them.
```

**Step 2: Add state-check notes to Steps A2-A4**

Before each command block in A2 (Always-On Settings), A3 (Headless Operation), and A4 (Disable Automatic Updates), add a brief note:

For A2, add before the `pmset` commands:
```markdown
**Check current state first** (some of these may already be configured from previous use):
```bash
pmset -g
```
Review the output. If sleep settings are already at 0, you can skip those specific commands and just verify.
```

For A4, add before the `defaults write` commands:
```markdown
**Check current state first:**
```bash
defaults read /Library/Preferences/com.apple.SoftwareUpdate 2>/dev/null
```
If auto-updates are already disabled, verify and move on.
```

**Step 3: Add FileVault note to A5**

Add at the top of the A5 section:
```markdown
**If you enabled FileVault during Phase 0:** Just verify it completed:
```bash
sudo fdesetup status
# Expected: "FileVault is On."
```
If it's still encrypting, that's fine — continue with the walkthrough. Encryption runs in the background.
```

**Step 4: Adjust A7 (Tailscale ACL Verification)**

Replace the opening concept text. Current text starts with "Tailscale is the strongest security layer..." Change the first sentence to acknowledge it's already installed:

Current:
```markdown
**Concept:** Tailscale is the strongest security layer in this deployment...
```

New:
```markdown
**Concept:** Tailscale is already installed and running on your Mac Mini from the v1 build — and it's the strongest security layer in this deployment...
```

The rest of the A7 section (ACL configuration, verification commands) stays the same.

**Step 5: Commit**

```bash
git add docs/walkthrough/2026-02-11-v1-initial-deployment.md
git commit -m "docs: adjust walkthrough Phase A for existing Mac Mini state"
```

---

## Task 3: Adjust Phase B in the Walkthrough

**Files:**
- Modify: `docs/walkthrough/2026-02-11-v1-initial-deployment.md` — Phase B section (originally line 446)

**Step 1: Update Phase B intro**

Change:
```markdown
**What we're doing:** Installing Node.js — the only runtime dependency OpenClaw needs.
```
To:
```markdown
**What we're doing:** Installing or upgrading Node.js 22 — the only runtime dependency OpenClaw needs. Homebrew is already installed from your v1 build.
```

**Step 2: Rewrite Step B1**

Replace the current B1 content. Current version starts with "If Homebrew is not installed..." — replace with:

```markdown
### B1: Install Node.js 22+ via Homebrew

**Concept:** OpenClaw requires Node.js 22 or higher. Homebrew is already installed on your Mac Mini from the v1 build and was updated during Phase 0. If you have an older Node version installed, we'll upgrade. If not, we'll install fresh.

```bash
# Check if Node.js is already installed and what version
node --version 2>/dev/null
# If this shows v22.x.x — you're already set, skip to B2

# If Node.js is not installed or is an older version:
brew install node@22

# If an older version is installed and linked:
brew unlink node 2>/dev/null
brew install node@22
brew link node@22

# If you used nvm in the v1 build, clean it up:
# nvm deactivate 2>/dev/null
# Consider removing nvm entirely: rm -rf ~/.nvm
# Then install Node via Homebrew instead (simpler for a server)
```

**Expected output:** No errors from brew install.

**If something's wrong:**
- If `brew link` warns about conflicts: another Node version is linked. Run `brew unlink node` first, then `brew link node@22`
- If nvm is intercepting the node path: either remove nvm (`rm -rf ~/.nvm` and remove nvm lines from `~/.zshrc`) or use `nvm install 22 && nvm alias default 22`
- If you're running this under the `openclaw` user: Homebrew should be accessible if installed under the admin user at `/opt/homebrew`
```

**Step 3: Commit**

```bash
git add docs/walkthrough/2026-02-11-v1-initial-deployment.md
git commit -m "docs: adjust walkthrough Phase B for existing Homebrew/Node state"
```

---

## Task 4: Add Phase 0 to the Deployment Plan

**Files:**
- Modify: `knowledge-base/04-deployment/mac-mini-deployment-plan.md:1-48` (header, Pre-Flight Checklist)
- Insert new Phase 0 section before Phase A (line 49)

**Step 1: Update the deployment plan header**

After the existing line `**Operator:** Sean Currie (terminal-comfortable, solutions engineer, Tailscale SSH already working)`:

Add:
```markdown
**Updated:** 2026-02-14 — Added Phase 0 for existing Mac Mini with v1 DevHub build (Homebrew, Docker, Ollama, Tailscale pre-installed)
```

**Step 2: Add note to Pre-Flight Checklist**

After the Pre-Flight Checklist header, add:

```markdown
**Note (added 2026-02-14):** This plan originally assumed a clean Mac Mini. The deployment target has an existing v1 DevHub build with Homebrew, Docker Desktop, Ollama, Tailscale, and various development projects. Phase 0 (below) handles preparation. Phases A and B are adjusted to verify existing installs rather than install from scratch.
```

**Step 3: Insert Phase 0 section**

Before `## Phase A: macOS Hardening` (line 49), insert a Phase 0 section in the deployment plan's terser format (commands + expected outcomes + citations, no educational framing):

```markdown
---

## Phase 0: Machine Preparation

**Goal:** Prepare the existing Mac Mini (v1 DevHub build) for OpenClaw deployment without a full wipe.

**Added:** 2026-02-14. Source: Security research cross-referenced with actual machine state (v1 DevHub: Homebrew, Docker Desktop, Ollama, Tailscale, FastAPI, monitoring containers).

### 0.1: Identity & Sync Disconnection

**Why:** iCloud sync creates data exfiltration paths for `~/.openclaw/` contents. Logged-in browsers are the attack bridge for CVE-2026-25253 (CVSS 8.8). Source: security-posture-analysis.md, intelligence-log.md.

- Sign out of iCloud: System Settings > [Your Name] > Sign Out (or disable all individual sync services)
- Sign out of Google in all browsers, clear sessions/cookies
- Disable/remove any other cloud sync (Dropbox, OneDrive)

```bash
# Verify no sync processes running
ps aux | grep -i -E "icloud|dropbox|onedrive|googledrive" | grep -v grep
# Expected: No results
```

### 0.2: Software Audit

**Why:** Capture pre-cleanup state for the record before removing anything.

```bash
brew list && brew list --cask
docker ps -a && docker images
npm list -g --depth=0
lsof -iTCP -sTCP:LISTEN -P
```

**Expected outcome:** Snapshot of machine state saved (file or deployment notes).

### 0.3: Software Cleanup

**Why:** Remove services not part of OpenClaw stack. Reduces attack surface and frees resources. Source: session conversation 2026-02-14.

```bash
# Remove Ollama
ollama stop 2>/dev/null; pkill -f ollama 2>/dev/null
brew uninstall ollama 2>/dev/null
rm -rf ~/.ollama

# Clean Docker (keep Desktop, remove containers/images)
docker stop $(docker ps -q) 2>/dev/null
docker rm $(docker ps -aq) 2>/dev/null
docker system prune -a --force

# Remove old project repos (after confirming pushed to GitHub)
# rm -rf ~/fastapi-project (adjust to actual paths)

# Stop PostgreSQL if running
brew services stop postgresql 2>/dev/null

# Clean Homebrew
brew update && brew upgrade
brew autoremove && brew cleanup
brew doctor
```

**Expected outcome:** Only OpenClaw-relevant software remains. Docker clean. Homebrew healthy.

### 0.4: Readiness Verification

**Why:** Go/no-go gate before Phase A.

```bash
sw_vers && uname -m                           # macOS version, arm64
sudo fdesetup status                          # FileVault on
csrutil status                                # SIP enabled
spctl --status                                # Gatekeeper enabled
tailscale status                              # Connected
brew list                                     # Lean package list
docker ps -a && docker images                 # Empty
lsof -iTCP -sTCP:LISTEN -P                   # No unexpected ports
df -h /                                       # Adequate disk space
```

**Expected outcome:** All checks pass. No unexpected listening ports, no sync processes, clean Docker, healthy Homebrew.

---
```

**Step 4: Adjust Phase A and B in the deployment plan**

In Phase A, before step A7 (Tailscale ACL Verification), add:
```markdown
**Note (2026-02-14):** Tailscale is already installed and configured from the v1 build. This step verifies and tightens rather than installs.
```

In Phase B, step B1, change:
```markdown
# If Homebrew is not installed on this Mac Mini:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
To:
```markdown
# Homebrew is already installed from v1 build (updated in Phase 0)
# If for some reason it's missing:
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 5: Commit**

```bash
git add knowledge-base/04-deployment/mac-mini-deployment-plan.md
git commit -m "docs: add Phase 0 to deployment plan, adjust Phase A/B for existing installs"
```

---

## Task 5: Update the Crib Sheet

**Files:**
- Modify: `docs/walkthrough/crib-sheet.md`

**Step 1: Add Pre-Deployment Machine Prep section**

Insert after the title and before `## Accounts & Tokens to Create` (line 7):

```markdown
## Pre-Deployment Machine Prep (Phase 0)

Do this BEFORE anything else. Full details in the walkthrough Phase 0.

**Identity disconnection:**
- [ ] iCloud: signed out or all sync services disabled
- [ ] Google: signed out of all browsers, cookies cleared
- [ ] Other cloud sync: removed/disabled

**Software cleanup:**
```bash
# Audit current state (save the output)
brew list && brew list --cask && docker ps -a && docker images && lsof -iTCP -sTCP:LISTEN -P

# Clean Docker (keep Desktop, remove old containers/images)
docker stop $(docker ps -q) 2>/dev/null && docker rm $(docker ps -aq) 2>/dev/null && docker system prune -a --force

# Remove Ollama
brew uninstall ollama 2>/dev/null && rm -rf ~/.ollama

# Clean Homebrew
brew update && brew upgrade && brew autoremove && brew cleanup && brew doctor
```

**Readiness check (run before Phase A):**
```bash
sw_vers && uname -m && sudo fdesetup status && csrutil status && spctl --status && tailscale status && brew list && docker ps -a && lsof -iTCP -sTCP:LISTEN -P && df -h /
```

---
```

**Step 2: Adjust the Software to Install table**

Change the current table to distinguish verify-existing from install-new:

Current:
```markdown
| Homebrew | `/bin/bash -c "$(curl -fsSL ...)"` | Latest | Package manager... |
```

New:
```markdown
| Homebrew | Already installed (v1 build). Verify: `brew --version` | Latest | Updated in Phase 0 |
| Node.js 22 | `brew install node@22 && brew link node@22` | >= 22 | Must be ARM-native (`file $(which node)` should show `arm64`) |
| OpenClaw | `npm install -g openclaw@latest` | **>= 2026.1.29** | **CRITICAL** — older versions have 1-click RCE (CVE-2026-25253) |
| Docker Desktop | Already installed (v1 build). Verify: `docker --version` | Latest | Cleaned in Phase 0. Only if using sandbox mode. |
```

**Step 3: Commit**

```bash
git add docs/walkthrough/crib-sheet.md
git commit -m "docs: add Phase 0 prep section to crib sheet, adjust software table"
```

---

## Task 6: Update the Walkthrough Design Doc

**Files:**
- Modify: `docs/plans/2026-02-11-deployment-walkthrough-design.md`

**Step 1: Add revision note**

After the header block (line 5), add:
```markdown
**Revised:** 2026-02-14 — Added Phase 0 (Machine Preparation) per design document `docs/plans/2026-02-14-phase0-machine-prep-design.md`
```

**Step 2: Update the phase table in Section 5**

Add Phase 0 row at the top of the table:
```markdown
| 0 | Machine Preparation | Why identity sync and leftover services are security concerns, not housekeeping | Yes: Redefining the machine's role |
```

Update the table header to say "10 phases" instead of implying 9.

**Step 3: Update Section 7 (What The Walkthrough Draws From)**

Add a row to the source table:
```markdown
| 2026-02-14 brainstorming session + other agent's Mac Mini v1 state recap | Machine's actual current state, security-informed prep approach |
```

**Step 4: Commit**

```bash
git add docs/plans/2026-02-11-deployment-walkthrough-design.md
git commit -m "docs: update walkthrough design doc with Phase 0, 10-phase structure"
```

---

## Task 7: Update CONTEXT.md, Activity Log, and Intelligence Log

**Files:**
- Modify: `CONTEXT.md`
- Modify: `activity-log.md`
- Modify: `intelligence-log.md`

**Step 1: Update CONTEXT.md**

In the `## Current Status` section, change:
```markdown
- **Phase:** DEPLOYMENT WALKTHROUGH READY — research complete, educational walkthrough written.
```
To:
```markdown
- **Phase:** DEPLOYMENT WALKTHROUGH READY (v1.1) — research complete, walkthrough updated with Phase 0 for existing Mac Mini prep.
```

After `- **CRITICAL:** Must deploy version >= 2026.1.29 (CVE patches).`, add:
```markdown
- **Mac Mini current state:** v1 DevHub build (Homebrew, Docker Desktop, Ollama, Tailscale, FastAPI projects, monitoring containers). Phase 0 added to walkthrough for prep without wipe.
```

In the `## How to Use This Project` section, update item 1:
```markdown
1. **Ready to deploy?** Follow `docs/walkthrough/2026-02-11-v1-initial-deployment.md` — start with Phase 0 (machine prep), then Phases A-I
```

Update `**Last Updated:**` to `2026-02-14`.

**Step 2: Add activity log entries**

Append to the activity log table:
```markdown
| 2026-02-14 | Brainstorming session (superpowers:brainstorming) for Phase 0 machine prep. Design questions: structure (new Phase 0), specificity (Sean's actual machine), versioning (edit in-place), scope (Approach C — full doc suite). |
| 2026-02-14 | Design document written: docs/plans/2026-02-14-phase0-machine-prep-design.md. Phase 0 content, Phase A/B adjustments, 7 files to update. |
| 2026-02-14 | Implementation plan written (superpowers:writing-plans): docs/plans/2026-02-14-phase0-implementation-plan.md. 7 tasks. |
| 2026-02-14 | Documentation updates executed: Phase 0 added to walkthrough, deployment plan, crib sheet. Phases A/B adjusted. Design doc, CONTEXT.md, logs updated. |
```

**Step 3: Add intelligence log entry**

Append to the intelligence log table:
```markdown
| 2026-02-14 | STRATEGIC: Existing machine prep is a SECURITY concern, not housekeeping. iCloud sync defeats data residency. Logged-in browsers are the CVE-2026-25253 attack bridge. Unnecessary services (Ollama, monitoring containers) expand attack surface. Machine role redefinition drives specific cleanup requirements. | Session conversation + security research synthesis | Tier 1-2 |
```

**Step 4: Commit**

```bash
git add CONTEXT.md activity-log.md intelligence-log.md
git commit -m "docs: update CONTEXT.md, activity log, and intelligence log for Phase 0"
```

---

Plan complete and saved to `docs/plans/2026-02-14-phase0-implementation-plan.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open a new session with executing-plans, batch execution with checkpoints

Which approach?
