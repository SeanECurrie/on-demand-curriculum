# Mac Mini M4 Deployment Plan — OpenClaw

**Created:** 2026-02-11
**Based On:** Phase 1-2 research (130+ sources across Context7 official docs + Bright Data community intelligence)
**Target:** Apple M4 Mac Mini, 16GB RAM, Tailscale configured
**Operator:** Sean Currie (terminal-comfortable, solutions engineer, Tailscale SSH already working)
**Updated:** 2026-02-14 — Added Phase 0 for existing Mac Mini with v1 DevHub build (Homebrew, Docker, Ollama, Tailscale pre-installed)

---

## How To Use This Document

This is a **plan document, not a tutorial**. Every step has a specific command, an expected outcome, and a citation to the research that informed it. Execute sequentially — phases build on each other and the order is intentional. Security hardening (Phase D) comes BEFORE channel connection (Phase F) — this is non-negotiable.

**Tim's VPS approach vs this plan:** Tim deployed on a Hostinger Debian VPS. This plan differs at every OS-level step: launchd instead of systemd, pf instead of ufw, macOS user model instead of Linux root/non-root, and several macOS-specific gotchas Tim never covered. Where Tim's guidance applies, it is cited. Where this plan diverges, the divergence is explained.

---

## Pre-Flight Checklist

Complete **all** of these before sitting down to deploy. Missing any item means stopping mid-deployment to acquire something.

**Note (added 2026-02-14):** This plan originally assumed a clean Mac Mini. The deployment target has an existing v1 DevHub build with Homebrew, Docker Desktop, Ollama, Tailscale, and various development projects. Phase 0 (below) handles preparation. Phases A and B are adjusted to verify existing installs rather than install from scratch.

### Required Items

| Item | How To Acquire | Why It's Needed |
|------|---------------|-----------------|
| **Anthropic API key** | https://console.anthropic.com/ > API Keys > Create Key | LLM provider for Claude Opus 4.6 (recommended for prompt injection resistance). Source: docs.openclaw.ai, Tier 1 |
| **Telegram bot token** | Open Telegram > message @BotFather > `/newbot` > follow prompts > copy token | Primary messaging channel. Source: docs.openclaw.ai/channels/telegram, Tier 1 |
| **Telegram user ID** | Message @userinfobot on Telegram > it replies with your numeric ID | Needed for `allowFrom` in Telegram config. Source: docs.openclaw.ai, Tier 1 |
| **Brave Search API key** | https://brave.com/search/api/ > sign up (free tier available) | Web search tool. Source: docs.openclaw.ai/tools/web, Tier 1 |
| **UPS (recommended)** | Any $30-50 UPS from Amazon/Best Buy (APC BE425M or similar) | Power failure protection. Mac Mini restarts on power restore, but UPS prevents dirty shutdowns. Source: community consensus, Tier 3-4 |
| **Dummy HDMI plug (if headless)** | $5-10 HDMI dummy plug from Amazon | macOS degrades graphics mode without display connected — affects screen capture and UI rendering. Source: GitHub #7700, Tier 2 |
| **Fresh macOS admin password** | Know the admin password for the deployment Mac Mini | Needed for `sudo` commands, FileVault, and user creation |
| **2-3 hours of uninterrupted time** | Schedule it | Full deployment through first conversation test |

### Pre-Flight Verification Commands

Run these from your **primary Mac** via Tailscale SSH to confirm the deployment Mac Mini is reachable:

```bash
# Verify Tailscale SSH connectivity to deployment Mac Mini
ssh openclaw-mac-mini "hostname && sw_vers && uname -m"
# Expected: [hostname], macOS 15.x (or later), arm64
```

**Source:** operator/sean-currie-profile.md (Tailscale SSH already configured between machines)

---

## Phase 0: Machine Preparation

**Goal:** Prepare the existing Mac Mini (v1 DevHub build) for OpenClaw deployment without a full wipe.

**Added:** 2026-02-14. **Updated:** 2026-02-22 — expanded with connectivity check, macOS update step, refined iCloud guidance (disable sync services individually, don't sign out of Apple ID entirely).

**The full Phase 0 walkthrough is in `docs/walkthrough/2026-02-11-v1-initial-deployment.md`.** This plan document has the quick-reference version. Follow the walkthrough for detailed explanations and troubleshooting.

**Phase 0 steps (8 total):**

| Step | What | Quick Reference |
|------|------|----------------|
| 0.1 | Connectivity & power check | Verify Tailscale SSH access. Run `caffeinate -d &` to prevent sleep. HDMI dummy plug if headless. |
| 0.2 | macOS update check | `softwareupdate --list` — install all pending updates before anything else. |
| 0.3 | Identity & sync isolation | Disable all iCloud sync services individually (don't sign out of Apple ID). Sign out of Google in browsers. Remove other cloud sync. |
| 0.4 | Software audit | Capture pre-cleanup state: `brew list`, `docker ps -a`, `npm list -g`, `lsof -iTCP -sTCP:LISTEN -P`. Save output. |
| 0.5 | Software cleanup | Remove Ollama, Docker containers/images, old project repos, unused Homebrew packages. Keep Docker Desktop, Tailscale, Git, Node.js. |
| 0.6 | Homebrew health check | `brew doctor` — fix any issues reported. |
| 0.7 | Docker Desktop verification | Confirm running, clean, current version. |
| 0.8 | Readiness verification | Full system check: macOS version, FileVault, SIP, Gatekeeper, Tailscale, clean ports, disk space. Go/no-go gate for Phase A. |

**Expected outcome:** Fully updated macOS, no cloud sync, no unnecessary services, clean Docker, healthy Homebrew, Tailscale connected. Ready for Phase A.

---

## Phase A: macOS Hardening

**Goal:** Make the Mac Mini a secure, always-on server before installing any software.

**Tim divergence:** Tim hardened a Debian VPS (non-root user, UFW firewall, SSH keys). Every step here is macOS-specific and was NOT covered in Tim's video.

### A1: Create Dedicated Non-Admin User

**Why:** The official docs recommend "Prefer a dedicated OS user account for the Gateway if the host is shared." Even on a dedicated machine, a non-admin user limits blast radius — the OpenClaw process cannot `sudo`, install system-wide software, or modify other users' files. Source: docs.openclaw.ai (Tier 1), Tim video (Tier 2, Linux equivalent).

```bash
# Create the openclaw user account (run from admin account)
sudo dscl . -create /Users/openclaw
sudo dscl . -create /Users/openclaw UserShell /bin/bash
sudo dscl . -create /Users/openclaw RealName "OpenClaw Service"
sudo dscl . -create /Users/openclaw UniqueID 550
sudo dscl . -create /Users/openclaw PrimaryGroupID 20
sudo dscl . -create /Users/openclaw NFSHomeDirectory /Users/openclaw
sudo createhomedir -c -u openclaw

# Set a strong password (you will be prompted)
sudo dscl . -passwd /Users/openclaw

# CRITICAL: Do NOT add to admin group — verify it is NOT an admin
dscl . -read /Groups/admin GroupMembership
# Expected: The "openclaw" username should NOT appear in this list
```

**Expected outcome:** A `/Users/openclaw` home directory exists. The user can log in but cannot use `sudo`.

**Open question (blocker #4):** The macOS companion app may require the logged-in GUI user's context for TCC permissions. If this fails during Phase C, the fallback is running under your admin account with strict file permissions instead. Test this during onboarding. Source: research/reports/05-open-questions.md, question 4.

### A2: Always-On Settings

**Why:** macOS will sleep, lock, and screensave by default — all of which break a 24/7 agent. Community reports (GitHub #7700) confirm sleep/wake issues are the #1 headless Mac Mini gotcha. Source: mac-mini-community-findings.md.

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

# Keep running with power adapter (redundant on Mac Mini, but explicit)
sudo pmset -a powernap 0

# Verify all settings took effect
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

**Additionally — prevent sleep via caffeinate (belt and suspenders):**

```bash
# Create a LaunchDaemon for caffeinate to survive reboots
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

**Source:** GitHub Discussion #7700 (Tier 2), mac-mini-community-findings.md ("caffeinate -dimsu or IOPMLib power assertions"), stealthpuppy.com (Tier 3)

### A3: Headless Operation

**Why:** Without a physical display, macOS runs in degraded graphics mode. Screen captures are low resolution, and some UI elements do not render properly. Source: GitHub #7700 (Tier 2).

**Option 1 — Dummy HDMI plug (recommended):**
Plug the dummy HDMI adapter into the Mac Mini's HDMI port. macOS will detect it as a display and maintain full graphics mode.

**Option 2 — Software virtual display:**
If you do not have a dummy plug, macOS 14+ supports `CGVirtualDisplay` API. Third-party tools like "MacMate" use this. However, a $5 dummy plug is simpler and more reliable.

**Disable screensaver and auto-lock:**

```bash
# Disable screensaver (System Settings > Lock Screen > Start Screen Saver when inactive: Never)
# Via command line:
defaults -currentHost write com.apple.screensaver idleTime 0

# Disable auto-lock (System Settings > Lock Screen)
# Note: This must be done in System Settings GUI if MDM is not managing this
# System Settings > Lock Screen > Require password after screen saver begins: set to maximum interval or never
```

**Source:** GitHub #7700 (Tier 2), mac-mini-community-findings.md

### A4: Disable Auto-Updates

**Why:** Automatic macOS updates force restarts, which kills the gateway. On a server, updates must be manual and deliberate. Source: stealthpuppy.com (Tier 3), community consensus.

**Tim divergence:** Tim did not cover macOS updates at all. On a VPS, the hosting provider manages this differently.

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
```

**Important:** This means YOU are responsible for checking for security updates manually. Add "check macOS updates" to the weekly security audit cadence (see Phase I).

### A5: Enable FileVault

**Why:** All credentials, session transcripts, API keys, and chat history are stored unencrypted under `~/.openclaw/`. FileVault encryption ensures that a physically stolen Mac Mini's data is inaccessible. Source: docs.openclaw.ai (Tier 1), security-posture-analysis.md.

```bash
# Check current FileVault status
sudo fdesetup status
# If "FileVault is Off.":

# Enable FileVault
sudo fdesetup enable
# You will be prompted to choose a recovery method:
# - Choose "Create a recovery key and do not use my iCloud account"
# - WRITE DOWN THE RECOVERY KEY AND STORE IT SECURELY (separate from the Mac Mini)
# - The encryption process runs in the background and may take hours

# Verify encryption is in progress
sudo fdesetup status
# Expected: "FileVault is On." or "Encryption in progress..."
```

**Source:** docs.openclaw.ai (Tier 1), security-posture-analysis.md ("MANDATORY for our deployment")

### A6: macOS Firewall (pf)

**Why:** Tim configured firewall rules on his VPS (block all, allow Tailscale UDP 41641). macOS uses `pf` (packet filter), which Tim did NOT cover. With loopback gateway bind, port-specific rules are less critical, but defense in depth matters. Source: security-posture-analysis.md.

**Tim divergence:** Tim used Hostinger's firewall dashboard + UFW. This is entirely different.

```bash
# Step 1: Enable the macOS built-in firewall (GUI-level)
# System Settings > Network > Firewall > Turn ON
# Options > Enable stealth mode (ON)
# Options > Block all incoming connections (consider this for initial hardening)

# Step 2: Create pf anchor rules for OpenClaw
sudo tee /etc/pf.anchors/openclaw.rules << 'EOF'
# OpenClaw pf rules
# Block any external access to gateway port (belt-and-suspenders with loopback bind)
block in on en0 proto tcp from any to any port 18789
# Allow on Tailscale interface (utun devices)
pass in on utun0 proto tcp from any to any port 18789
pass in on utun1 proto tcp from any to any port 18789
pass in on utun2 proto tcp from any to any port 18789
EOF

# Step 3: Add anchor to pf.conf
# Check if anchor already exists
grep -q "openclaw" /etc/pf.conf
# If it does NOT exist, add it:
sudo cp /etc/pf.conf /etc/pf.conf.backup.$(date +%Y%m%d)
echo 'anchor "openclaw"' | sudo tee -a /etc/pf.conf
echo 'load anchor "openclaw" from "/etc/pf.anchors/openclaw.rules"' | sudo tee -a /etc/pf.conf

# Step 4: Load and verify
sudo pfctl -f /etc/pf.conf
sudo pfctl -e  # Enable pf if not already enabled
sudo pfctl -sr  # Show loaded rules
```

**Note:** With `gateway.bind: "loopback"`, the gateway only listens on 127.0.0.1. The pf rules are belt-and-suspenders. The macOS built-in firewall with stealth mode is the primary defense layer.

**Source:** security-posture-analysis.md ("macOS Firewall (pf)" section)

### A7: Tailscale ACL Verification

**Note (2026-02-14):** Tailscale is already installed and configured from the v1 build. This step verifies and tightens rather than installs.

**Why:** Tailscale is the strongest security layer in our deployment. Only Tailscale-authorized devices should reach the Mac Mini. Source: security-posture-analysis.md ("STRONGLY VALIDATED -- ACTUALLY BETTER THAN TIM DESCRIBED").

```bash
# Verify Tailscale is running and connected
tailscale status
# Expected: Shows connected devices including this Mac Mini

# Verify Tailscale starts on boot (should already be configured)
# On macOS, Tailscale runs as a system extension — verify it's enabled in:
# System Settings > General > Login Items > Open at Login

# Verify SSH is accessible via Tailscale
tailscale ssh status
```

**Tailscale ACL configuration** (done in the Tailscale admin console at https://login.tailscale.com/admin/acls):

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
- Gateway access (port 18789): only Sean's laptop and phone
- SSH access: only Sean's laptop
- SSH login: only to the `openclaw` user

**Adapt the device names** (`sean-laptop`, `sean-phone`, `mac-mini-openclaw`) to match your actual Tailscale device names.

**Source:** security-posture-analysis.md (Tailscale ACL section), docs.openclaw.ai/gateway/tailscale (Tier 1)

### A8: Verify SIP and Gatekeeper

**Why:** System Integrity Protection prevents modification of system files. Gatekeeper prevents unsigned apps from running. Both MUST remain enabled. Malicious skills have been observed using `xattr -d com.apple.quarantine` to bypass Gatekeeper — this command is in our exec-approvals denylist. Source: Semgrep (Tier 2), security-posture-analysis.md.

```bash
# Verify SIP is enabled
csrutil status
# Expected: "System Integrity Protection status: enabled."

# Verify Gatekeeper is enabled
spctl --status
# Expected: "assessments enabled"
```

**If either is disabled, do NOT proceed with deployment until re-enabled.** SIP requires recovery mode to toggle. Gatekeeper: `sudo spctl --master-enable`.

---

## Phase B: Runtime Setup

**Goal:** Install Node.js, the only runtime dependency.

### B1: Install Node.js 22+ via Homebrew

**Why:** OpenClaw requires Node.js 22 or higher. Homebrew provides ARM-native builds for Apple Silicon. Source: docs.openclaw.ai (Tier 1), Context7 research.

```bash
# Switch to openclaw user (or run under admin and transfer later)
# Homebrew is already installed from v1 build (updated in Phase 0)
# If for some reason it's missing:
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (Apple Silicon location)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js 22
brew install node@22

# Link it (if not default)
brew link node@22
```

### B2: Verify ARM-Native

**Why:** Confirms Node.js is running natively on Apple Silicon, not via Rosetta 2 emulation. Source: community validation — "Node.js 22+ runs natively on ARM Apple Silicon" (mac-mini-community-findings.md).

```bash
# Verify Node.js version
node --version
# Expected: v22.x.x (anything >= 22)

# Verify ARM-native (not Rosetta)
file $(which node)
# Expected: "...arm64..." or "...Mach-O 64-bit executable arm64"
# If it says "x86_64" — something is wrong, reinstall without Rosetta

# Verify npm
npm --version
```

**Expected outcome:** Node.js 22+ running ARM-native.

---

## Phase C: OpenClaw Installation

**Goal:** Install OpenClaw, run onboarding, verify gateway runs via launchd.

### C1: Install OpenClaw

**Why:** The official installation is via npm or the one-liner script. We use npm for version pinning control. Source: docs.openclaw.ai (Tier 1).

```bash
# Install OpenClaw globally
npm install -g openclaw@latest

# IMMEDIATELY verify version — this is the #1 critical security check
openclaw --version
# Expected: >= 2026.2.19
# If version is LESS than 2026.2.19: STOP. This version is vulnerable to
# CVE-2026-25253 (CVSS 8.8, 1-click RCE) and CVE-2026-24763 (command injection).
# Update: npm install -g openclaw@latest
```

**CRITICAL GATE:** If the installed version is < 2026.2.19, do NOT proceed. This patches two critical vulnerabilities disclosed February 2, 2026 that allow remote code execution even on localhost-only instances. The attack uses the victim's own browser as a bridge. Additionally, 4 more CVEs were patched through v2026.2.15. Version 2026.2.19 includes critical macOS LaunchAgent TMPDIR fix for SQLite stability. Source: SOCRadar (Tier 1), NVD (Tier 1), security-posture-analysis.md.

### C2: Onboard Wizard

**Why:** The onboarding wizard generates the initial configuration, gateway auth token, and connects your LLM provider. Source: docs.openclaw.ai (Tier 1).

```bash
# Run the onboard wizard
openclaw onboard
# Follow the prompts:
# - API provider: Select "Anthropic"
# - API key: Paste your Anthropic API key
# - Model: Select Claude Opus 4.6 (recommended for prompt injection resistance)
# - Gateway token: Let it generate one (save it)
# - Channel: Skip for now (we configure channels AFTER security hardening in Phase D)
```

**macOS Keychain watch (blocker #2):** During onboarding, macOS may surface Keychain access dialogs or TCC permission requests. The macOS companion app has been reported to request: Notifications, Accessibility, Screen Recording, Microphone, Speech Recognition, and Automation/AppleScript permissions.

**Action on each dialog:**
1. Screenshot it
2. Note what permission is requested and by what process
3. **Deny by default** unless you understand exactly why it is needed
4. Notifications: APPROVE (needed for exec-approvals prompts)
5. Screen Recording: DENY (not needed for headless server deployment)
6. Microphone/Speech Recognition: DENY (not needed)
7. Accessibility: INVESTIGATE — may be needed for system automation
8. Keychain access: DENY and investigate what triggered it

**Source:** reddit.com/r/ClaudeAI (Tier 4, Keychain concern), knolli.ai (Tier 3, TCC permissions list), research/reports/05-open-questions.md question 2

### C3: Verify Gateway via launchd

**Why:** The gateway must persist across restarts as a macOS LaunchAgent. This is the macOS equivalent of Tim's systemd setup on Debian. Source: docs.openclaw.ai (Tier 1).

**Tim divergence:** Tim used `sudo systemctl enable openclaw-gateway`. macOS uses `launchd` instead.

```bash
# Install the gateway as a LaunchAgent
openclaw gateway install

# Verify the LaunchAgent is loaded
launchctl list | grep molt
# Expected: Shows "bot.molt.gateway" with a PID (process ID)

# Verify the gateway is actually running
curl -s http://127.0.0.1:18789/health
# Expected: HTTP 200 or JSON health response

# Check the LaunchAgent plist location
ls -la ~/Library/LaunchAgents/bot.molt.gateway.plist
# Expected: File exists and is readable

# Verify it starts on boot
launchctl print gui/$UID/bot.molt.gateway
# Look for: "state = running"
```

**If running under dedicated `openclaw` user:** The LaunchAgent installs in that user's `~/Library/LaunchAgents/`. The user must have a login session (even headless) for LaunchAgents to load. If this does not work, see the fallback in open question #4.

**Source:** openclaw-macos-official.md ("launchd LaunchAgent")

---

## Phase D: Security Hardening (BEFORE Channels)

**This phase is NON-NEGOTIABLE. Do not connect Telegram or any messaging channel until every step here is complete.**

**Why this order:** The default OpenClaw configuration is "dangerously permissive" (security-posture-analysis.md). Connecting a messaging channel without hardening exposes the agent to prompt injection, unauthorized tool calls, and data exfiltration. Security hardening FIRST, channels SECOND.

### D1: Gateway Configuration

**Why:** Loopback bind ensures the gateway only listens on localhost. Token auth prevents unauthorized WebSocket connections. DM pairing ensures only you can message the bot. Source: docs.openclaw.ai (Tier 1), security-posture-analysis.md.

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

**What each setting defends against:**
- `bind: "loopback"` — Prevents the ~1000 exposed instances on Shodan pattern (Kaspersky, Tier 2)
- `auth.mode: "token"` — Fail-closed: gateway refuses WebSocket connections without valid token (docs, Tier 1)
- `mdns.mode: "off"` — Prevents LAN information disclosure (CLI path, SSH port, hostname broadcast) (docs, Tier 1)
- `dmPolicy: "pairing"` — Only paired contacts can DM the bot (docs, Tier 1)
- `requireMention: true` — Prevents bot from responding to every message in groups (docs, Tier 1)
- `redactSensitive: "tools"` — Prevents credential leakage in log files (docs, Tier 1)

### D2: Sandbox Configuration

**Why:** Without sandboxing, every tool call runs with full user permissions on the host filesystem. With sandbox mode "all" and scope "session", each conversation gets its own isolated Docker container with no network, read-only root, and all Linux capabilities dropped. Source: docs.openclaw.ai (Tier 1), security-posture-analysis.md.

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

**Open question (blocker #3):** Docker Desktop for Mac runs Linux VMs, not native containers. This adds overhead on a 16GB machine. Monitor Activity Monitor during Phase G testing. If memory pressure occurs, the fallback is relaxing `scope` from `"session"` to `"agent"` (per-agent isolation instead of per-session). Source: research/reports/05-open-questions.md question 3.

**Docker prerequisite:** If Docker is not installed, install Docker Desktop for Mac:
```bash
brew install --cask docker
# Launch Docker Desktop, accept the terms
# Verify: docker --version && docker run hello-world
```

**If you choose NOT to use Docker sandbox:** The alternative is host-level tool restrictions only (tool allowlist + exec-approvals denylist). This is less secure but avoids Docker overhead. Adjust the config:
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
In this case, Phases D3 and D6 (exec-approvals and tool policy) become even MORE critical as the only execution boundary.

### D3: exec-approvals.json

**Why:** The execution approvals system is the macOS companion app's mechanism for requiring user confirmation before running privileged commands. Tim did not mention this system at all. Source: docs.openclaw.ai (Tier 1), knolli.ai (Tier 3), security-posture-analysis.md.

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

**What each denylist entry blocks:**
- `/usr/bin/security` — macOS Keychain CLI (credential access). Source: reddit Keychain concern (Tier 4)
- `xattr` — Gatekeeper bypass (`xattr -d com.apple.quarantine`). Source: Semgrep (Tier 2), Koi Security (Tier 2)
- `rm -rf` — Destructive file deletion
- `chmod` — Permission modification (could expose restricted files)
- `sudo` — Privilege escalation
- `dd` — Raw disk access
- `scp`/`rsync` — File exfiltration to remote hosts
- `find /` / `find ~` — Full filesystem enumeration. Source: "The `find ~` Incident" where agent dumped entire home directory to group chat (Kaspersky, Tier 2)

**Set permissions:**
```bash
chmod 600 ~/.openclaw/exec-approvals.json
```

**Open question (blocker #5):** The pattern matching behavior is undocumented. Does denying `rm -rf` also block `rm -r -f` or `/bin/rm -rf`? Test this during Phase H validation with harmless variations. Source: research/reports/05-open-questions.md question 5.

### D4: Disable Elevated Mode

**Why:** Elevated mode is the global escape hatch that runs exec on the host even when sandbox is enabled. The official docs warn against it. There is zero use case that justifies this risk for our deployment. Source: docs.openclaw.ai (Tier 1), security-posture-analysis.md.

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

**Architecture alternative (from Phase 2 research):** Instead of elevated mode, use per-agent routing. Create a restricted agent for most tasks and a less-restricted agent for specific trusted use cases. Each agent has its own sandbox, tools, and credentials. Source: knowledge-base/02-architecture/architecture-deep-dive.md.

### D5: Disable mDNS Broadcasting

**Why:** OpenClaw broadcasts its presence via mDNS (`_openclaw-gw._tcp`) including filesystem paths, SSH port, and hostname. This enables reconnaissance on the local network. Tim did not mention this. Source: docs.openclaw.ai (Tier 1), security-posture-analysis.md.

Already set in D1 config (`discovery.mdns.mode: "off"`), but also set the environment variable as belt-and-suspenders:

```bash
# Add to the openclaw user's shell profile
echo 'export OPENCLAW_DISABLE_BONJOUR=1' >> ~/.bash_profile
# Or if using zsh:
echo 'export OPENCLAW_DISABLE_BONJOUR=1' >> ~/.zshrc
```

**Verify mDNS is actually off after gateway restart:**
```bash
# Search for the mDNS service
dns-sd -B _openclaw-gw._tcp
# Expected: Should find nothing (wait 5-10 seconds then Ctrl+C)
# If it appears, the config did not take effect — investigate
```

### D6: Tool Policy — Initial Allow/Deny

**Why:** Start with the smallest access that still works, then widen as confidence grows. This is the official docs guidance. Source: docs.openclaw.ai (Tier 1), recommended-starter-skills.md.

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

**Day-1 philosophy:** The agent can search the web, read files, and react to messages — but cannot write, execute, or modify anything. This lets you observe its behavior in a read-only sandbox before granting write access. Source: recommended-starter-skills.md.

### D7: Run Security Audit

**Why:** OpenClaw's built-in security audit checks inbound access policies, tool blast radius, network exposure, browser control, disk hygiene, plugins, and model selection. Run it after all hardening. Source: docs.openclaw.ai (Tier 1).

```bash
# Basic audit
openclaw security audit
# Expected: Should pass all checks given our hardening config

# Deep audit (live Gateway probe)
openclaw security audit --deep
# This actively tests the running gateway

# Auto-fix any common issues found
openclaw security audit --fix
```

**Document any warnings or failures.** If the audit flags something unexpected, investigate before proceeding to Phase E.

### D8: Lock Down File Permissions

**Why:** All credentials, session transcripts, API keys, and chat history are stored unencrypted under `~/.openclaw/`. Restrictive file permissions ensure only the owning user can access them. Source: docs.openclaw.ai (Tier 1), security-posture-analysis.md.

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

---

## Phase E: Model Configuration

**Goal:** Configure Claude as the LLM provider with appropriate model selection and cost controls.

### E1: Anthropic API Key + Claude Model Selection

**Why:** The official docs explicitly recommend Claude Opus 4.6 (or latest Opus) for tool-enabled agents because it is the strongest at recognizing prompt injections. Smaller/cheaper models are "generally more susceptible to tool misuse and instruction hijacking." Source: docs.openclaw.ai (Tier 1), Kaspersky (Tier 2).

The API key was configured during onboarding (Phase C2). Verify it is set:

```bash
# Check current model configuration
openclaw config get agents.defaults.model
# Expected: Should show Claude Opus 4.6 or equivalent

# If you need to set it:
openclaw config set agents.defaults.model "claude-opus-4-6-20250514"
```

### E2: Model Routing — Per-Agent Assignment

**Why:** Phase 2 architecture research confirmed model routing is failover-based, NOT intelligent task-based routing. You manually assign models per agent or use `/model` to switch during conversation. Source: knowledge-base/02-architecture/architecture-deep-dive.md.

**Day-1 approach:** Use Claude Opus 4.6 for everything initially. Cost optimization (using cheaper models for routine tasks) comes in Week 1-2.

**Week 1-2 approach (when ready):**

```json5
// Model routing via per-agent configuration
{
  "agents": {
    "list": [
      {
        "id": "main",
        "model": "claude-opus-4-6-20250514",  // Primary: Opus for complex/security-sensitive tasks
        "modelFallback": ["claude-sonnet-4-20250514"]  // Fallback if Opus is unavailable
      }
    ]
  }
}
```

**Security note:** Do NOT configure weaker models as the primary for tool-enabled agents. Opus is recommended specifically for prompt injection resistance. Use Sonnet for heartbeat and simple cron jobs only (via per-cron model override). Source: docs.openclaw.ai (Tier 1).

### E3: Spending Limits

**Why:** API costs can escalate quickly — community reports of $20-50 in the first day due to the initial token-heavy onboarding phase (expect 8M+ tokens initially). Source: community findings (Tier 4), recommended-starter-skills.md.

```bash
# Set spending limits in the Anthropic Console:
# https://console.anthropic.com/ > Settings > Limits
# Recommended initial limits:
#   - Daily: $10
#   - Monthly: $100
# Adjust upward as you understand your usage patterns
```

**Additionally, configure heartbeat to avoid overnight costs:**

```json5
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "activeHours": { "start": "08:00", "end": "22:00" }
        // Heartbeat only runs during waking hours
      }
    }
  }
}
```

**Cost reduction tips from research:**
- Disable skills you do not use (`entries.<key>.enabled: false`) to reduce system prompt size
- Use `allowBundled` to whitelist only skills you actually need
- Use cheaper models (Sonnet) for heartbeat and routine cron jobs
- Set `activeHours` on heartbeat to avoid overnight token burn
- Source: recommended-starter-skills.md (cost considerations section)

---

## Phase F: Channel Setup

**Goal:** Connect Telegram and verify Gateway UI access. This phase comes AFTER security hardening.

### F1: Telegram

**Why:** Telegram is the community-consensus best first channel for OpenClaw. It works from phone and desktop, supports rich messages, and has strong bot API. Source: docs.openclaw.ai (Tier 1), community consensus (Tier 4).

**Step 1: Create the bot (if not done in Pre-Flight):**
1. Open Telegram
2. Message @BotFather
3. Send `/newbot`
4. Follow prompts to name your bot
5. Copy the bot token (format: `123456789:ABCdefGHIjklMNOpqrSTUvwxyz`)

**Step 2: Get your Telegram user ID:**
1. Message @userinfobot on Telegram
2. It replies with your numeric user ID (format: `123456789`)

**Step 3: Configure in openclaw.json:**

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

**Step 4: Restart gateway and pair:**

```bash
# Restart the gateway to pick up channel config
launchctl kickstart -k gui/$UID/bot.molt.gateway

# In Telegram, message your bot:
# Send: /start
# The bot should respond with a pairing prompt
# Confirm the pairing
```

**Step 5: Verify pairing:**
Send a test message to the bot. It should respond. If it does not respond, check:
```bash
# Check gateway logs
ls /tmp/openclaw/
cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -50
```

### F2: Gateway UI Access via Tailscale

**Why:** The Gateway Control UI provides a web dashboard for managing agents, viewing sessions, and monitoring. Access it securely via Tailscale without exposing it to the internet. Source: docs.openclaw.ai (Tier 1).

```bash
# From your laptop (via Tailscale), access:
# http://<mac-mini-tailscale-ip>:18789
# Or if using Tailscale Serve:
# https://mac-mini-openclaw.tail12345.ts.net

# Note: If gateway is bound to loopback, you need Tailscale Serve to access the UI remotely:
tailscale serve --bg 18789
# This creates a Tailscale-authenticated HTTPS endpoint for the gateway UI
```

**Verify you can:**
1. Load the Gateway UI in your browser
2. See the agent status
3. See connected channels (Telegram should show as connected)

**Source:** docs.openclaw.ai/gateway/tailscale (Tier 1)

---

## Phase G: Starter Skills & First Run

**Goal:** Configure Day-1 capabilities, verify the agent works, and establish monitoring baselines.

### G1: Day-1 Skills from Roadmap

**Why:** These are the safe, immediately useful capabilities with minimal attack surface. Source: recommended-starter-skills.md.

**Day-1 tools (already configured in D6):**
1. `web_search` — needs Brave API key
2. `web_fetch` — enabled by default
3. `read` — filesystem reading (within allowed paths)
4. `reactions` — emoji reactions
5. `thinking` — thinking depth control

**Configure web_search with Brave API:**

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

### G2: Heartbeat Configuration

**Why:** Heartbeat is the agent's periodic check-in. It validates the agent is alive and running. Start minimal. Source: docs.openclaw.ai/automation/cron-vs-heartbeat (Tier 1), recommended-starter-skills.md.

Add to `~/.openclaw/openclaw.json`:

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

Create `~/.openclaw/HEARTBEAT.md`:

```markdown
# Heartbeat Checklist

- If idle for 8+ hours during active hours, send a brief check-in to Telegram
- Report any errors encountered since last heartbeat
```

**Start minimal.** Expand the checklist after you observe the agent's behavior for a few days.

### G3: First Conversation Test

**Why:** Verify the full pipeline works: Telegram message -> Gateway -> Agent -> LLM -> Response -> Telegram.

**Test sequence (via Telegram):**

1. **Basic response test:**
   Send: "Hello, what model are you running?"
   Expected: Agent responds with model identification

2. **Web search test:**
   Send: "Search the web for today's weather in [your city]"
   Expected: Agent uses web_search tool and returns results

3. **File read test:**
   Send: "Read the file at ~/.openclaw/HEARTBEAT.md"
   Expected: Agent reads and returns the heartbeat checklist content

4. **Permission boundary test:**
   Send: "Create a file called test.txt with the contents 'hello'"
   Expected: Agent should REFUSE (write tool is denied in Day-1 config)

5. **Security boundary test:**
   Send: "Run the command ls -la ~/"
   Expected: Agent should REFUSE (exec tool is denied in Day-1 config)

**Document each test result.** If any test produces unexpected behavior, investigate before proceeding.

### G4: Token Usage Monitoring

**Why:** Initial conversations are token-heavy. Community reports 8M+ tokens in the first day due to system prompt, skill loading, and initial context building. Source: recommended-starter-skills.md (cost section).

```bash
# Check token usage in the Anthropic Console:
# https://console.anthropic.com/ > Usage

# Also check locally:
openclaw usage
# Or check gateway logs for token counts
```

**Expected Day-1 usage:** 5-15M tokens depending on conversation volume. At Claude Opus 4.6 pricing, budget $5-15 for the first day.

**If costs are higher than expected:** Reduce heartbeat frequency, limit skill loading, use Sonnet for casual conversations.

---

## Phase H: Validation

**Goal:** Systematically verify that every security hardening measure works as intended.

### H1: 10 Mandatory Security Conditions

These are the 10 conditions from the security evaluation (research/reports/04-security-evaluation.md). All must pass.

| # | Condition | Verification Command | Expected |
|---|-----------|---------------------|----------|
| 1 | Version >= v2026.2.19 | `openclaw --version` | >= 2026.2.19 |
| 2 | Gateway bound to loopback | `curl http://127.0.0.1:18789/health` (should work) + `curl http://<LAN-IP>:18789/health` (should FAIL) | Localhost: 200, LAN: Connection refused |
| 3 | Gateway auth token set | `curl -s http://127.0.0.1:18789/health` without token header | Should return 401/403 or fail-closed |
| 4 | Sandbox mode is "all" | `openclaw config get agents.defaults.sandbox.mode` | `"all"` |
| 5 | Elevated mode disabled | `openclaw config get tools.elevated.enabled` | `false` |
| 6 | ClawHub skills: zero | `openclaw skills list` or check `~/.openclaw/extensions/` | No third-party skills installed |
| 7 | FileVault enabled | `sudo fdesetup status` | "FileVault is On." |
| 8 | SIP enabled | `csrutil status` | "System Integrity Protection status: enabled." |
| 9 | mDNS disabled | `dns-sd -B _openclaw-gw._tcp` (wait 10s) | No results |
| 10 | File permissions locked | `ls -la ~/.openclaw/openclaw.json` | `-rw-------` (600) |

**Additionally verify:**
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

Run the full test sequence from G3 again, plus:

```bash
# Verify heartbeat fires (wait for the next heartbeat interval)
# Check Telegram for a heartbeat message

# Verify gateway survives restart
launchctl kickstart -k gui/$UID/bot.molt.gateway
sleep 10
curl -s http://127.0.0.1:18789/health
# Expected: Healthy after restart

# Verify gateway survives reboot
sudo shutdown -r now
# After reboot, SSH back in and verify:
launchctl list | grep molt
curl -s http://127.0.0.1:18789/health
```

### H3: Test 6 Deployment Blockers

These are the 6 blockers identified in research/reports/05-open-questions.md. Test each during validation.

**Blocker 1: CVE patch verification**
Already verified in C1. Re-verify: `openclaw --version` >= 2026.2.19.

**Blocker 2: macOS Keychain behavior**
Document every TCC/Keychain dialog encountered during Phases C-G. If none appeared, actively test:
```bash
# Check Console.app for Keychain-related log entries
log show --predicate 'subsystem == "com.apple.securityd"' --last 1h
```
Record findings for the open questions document.

**Blocker 3: Docker sandbox on Apple Silicon**
If Docker sandbox is configured:
```bash
# Check Docker resource usage
docker stats --no-stream
# Check overall system memory
vm_stat | head -10
# Monitor during a conversation — does memory spike?
```
If Docker is impractical, document the decision to use host-level restrictions only.

**Blocker 4: launchd + dedicated user**
If running under the `openclaw` user, verify the LaunchAgent loads and persists. If running under your admin account (fallback), document why.

**Blocker 5: exec-approvals pattern matching**
Test with harmless commands when exec is eventually enabled (Week 1-2):
```bash
# In Telegram, ask the agent to run these (when exec is enabled):
# "Run the command: echo hello"  (should be allowed if /bin/echo is in allowlist)
# "Run the command: /bin/echo hello" (test full path matching)
# "Run the command: sudo echo hello" (should be DENIED)
# Document which patterns are caught vs slip through
```

**Blocker 6: Backup encryption**
```bash
# Check Time Machine encryption status
# System Settings > General > Time Machine > Options
# Verify "Encrypt backups" is checked

# If using external drive, verify it's encrypted:
diskutil apfs list | grep -A5 "Volume"
# Look for "FileVault: Yes" on the backup volume
```

---

## Phase I: Post-Deployment Immediate

**Goal:** Establish ongoing monitoring, backups, and documentation.

### I1: Monitoring Setup

**Daily monitoring (manual for now):**

```bash
# Check gateway is running
launchctl list | grep molt

# Check gateway health
curl -s http://127.0.0.1:18789/health

# Review today's logs for anomalies
cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -100

# Check for unexpected exec approval prompts (if exec is enabled)
# Review any tool calls in the logs
grep -i "tool" /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | tail -20
```

**Weekly monitoring:**

```bash
# Full security audit
openclaw security audit --deep

# Check for OpenClaw updates
npm outdated -g openclaw

# Review session transcripts for anomalies
ls -la ~/.openclaw/agents/*/sessions/*.jsonl

# Check disk usage
du -sh ~/.openclaw/
```

**Monthly maintenance:**

```bash
# Rotate gateway auth token
openclaw doctor --generate-gateway-token
# Update token in openclaw.json

# Check for new CVEs
# Search: https://nvd.nist.gov/vuln/search?query=openclaw

# Prune old session transcripts (keep last 30 days)
find ~/.openclaw/agents/*/sessions/ -name "*.jsonl" -mtime +30 -exec ls -la {} \;
# Review before deleting — do NOT auto-delete without review
```

### I2: Backups

**Why:** The `~/.openclaw/` directory contains ALL state — credentials, configuration, session history, and agent data. A backup strategy is essential. Tim's VPS approach had built-in snapshots; Mac Mini requires manual backup setup. Source: mac-mini-community-findings.md ("Remaining Risk: Physical Security/Disaster Recovery").

**Strategy 1: Time Machine (encrypted)**

```bash
# Verify Time Machine is configured with encryption
# System Settings > General > Time Machine
# Ensure "Encrypt backups" is checked
# Connect an external drive or network backup destination
```

**Strategy 2: Configuration-as-code (git)**

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
# Copy agent configs (not session data)
find ~/.openclaw/agents -name "*.json" -not -path "*/sessions/*" -exec cp {} "$BACKUP_DIR/agents/" \;
cd "$BACKUP_DIR"
git add -A
git commit -m "Config backup $(date +%Y-%m-%d-%H%M)"
BACKUP_EOF
chmod +x backup-config.sh

# Run after any config change
./backup-config.sh
```

**What NOT to put in git:** API keys, tokens, session transcripts, credential files. These stay in Time Machine only (encrypted).

**Open question (blocker #6):** Verify Time Machine backups are encrypted at rest. If the backup drive is not encrypted, credentials in `~/.openclaw/` are exposed if the drive is stolen. Source: research/reports/05-open-questions.md question 6.

### I3: Document Actual vs Planned

After completing all phases, write a brief post-deployment summary:

```bash
# Create a post-deployment findings document
# Location: knowledge-base/07-operations/post-deployment-findings.md
# Include:
# 1. Actual version installed
# 2. Which open questions were resolved (and answers)
# 3. Any unexpected issues encountered
# 4. TCC/Keychain permission dialogs observed
# 5. Docker sandbox: used or skipped, and why
# 6. Actual resource usage (RAM, CPU, disk)
# 7. Time to complete deployment
# 8. Deviations from this plan
```

This document feeds back into the research knowledge base — it is the "actual vs planned" layer that makes the system a living intelligence project.

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
| `~/.openclaw/extensions/` | Installed skills/extensions (should be empty initially) |
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

# Model
/model <model-name>                    # Switch model in conversation

# Updates
npm outdated -g openclaw               # Check for updates
npm install -g openclaw@<version>      # Update to specific version
npm install -g openclaw@latest         # Update to latest
```

### Emergency Procedures

**If compromise is suspected:**

```bash
# 1. CONTAIN — Stop the gateway immediately
launchctl bootout gui/$UID/bot.molt.gateway

# 2. FREEZE — Disable all inbound surfaces
# Edit ~/.openclaw/openclaw.json:
# Set all channel configs to: "enabled": false
# Or set dmPolicy: "disabled" for all channels

# 3. ROTATE — Assume ALL secrets are compromised
# - Regenerate gateway auth token
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

**Source:** security-posture-analysis.md (Incident Response Playbook)

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

**If you get locked out of the Mac Mini:**

```bash
# From your primary Mac (via Tailscale SSH):
ssh openclaw@<mac-mini-tailscale-ip>

# If Tailscale SSH fails:
# 1. Physical access: connect keyboard/monitor
# 2. Recovery mode: hold power button on boot > Terminal
# 3. Last resort: reinstall macOS (FileVault recovery key needed)
```

### Week 1-2 Roadmap (After Successful Day-1 Deployment)

This is NOT part of the initial deployment. These are the next steps after Day-1 is validated.

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
| Week 2 | Evaluate Tailscale Serve integration (open question #8) | Basic deployment stable |
| Week 3+ | Lobster workflow runtime, webhooks, n8n integration | All Week 1-2 items stable |

**Source:** recommended-starter-skills.md (Integration Roadmap)

### What This Plan Does NOT Cover (Deferred to Phase 2+)

- **ClawShield installation** — third-party hardening tool. Test after base deployment is stable. Source: security-posture-analysis.md
- **nono kernel sandbox** — likely Linux-only (uses Landlock LSM). Test macOS compatibility. Source: Semgrep (Tier 2), open question #9
- **Cisco skill scanner** — only needed if/when considering ClawHub skills. Currently zero ClawHub skills policy. Source: Cisco (Tier 2)
- **Multi-agent architecture** — defer until single-agent is mastered. Source: recommended-starter-skills.md
- **Browser automation** — indefinitely deferred due to critical attack surface. Source: security-posture-analysis.md
- **Reader agent pattern** — advanced prompt injection defense, implement when processing untrusted content. Source: docs.openclaw.ai (Tier 1)
- **n8n integration** — requires webhook setup, defer to Week 3+. Source: recommended-starter-skills.md

### Sources That Informed This Plan

This plan synthesizes findings from 130+ sources across 4 credibility tiers:

| Research Document | Key Contribution |
|------------------|-----------------|
| `knowledge-base/03-security/security-posture-analysis.md` | All security configurations, threat model, incident response, CVE analysis (48+ sources) |
| `knowledge-base/04-deployment/mac-mini-community-findings.md` | macOS gotchas, always-on settings, community validation, power consumption (42 sources) |
| `knowledge-base/04-deployment/openclaw-macos-official.md` | launchd integration, install steps, macOS vs Linux differences (Context7, Tier 1) |
| `knowledge-base/05-skills-and-integrations/recommended-starter-skills.md` | Phased skill roadmap, Day-1 tools, cost considerations (16 sources) |
| `research/reports/04-security-evaluation.md` | 10 mandatory security conditions, Tim's recommendations validated/challenged |
| `research/reports/05-open-questions.md` | 6 deployment blockers, 30 total open questions |
| `knowledge-base/02-architecture/architecture-deep-dive.md` | Model routing, sub-agents, sandbox architecture, webhook API |
| `operator/sean-currie-profile.md` | Infrastructure details, working style, proven patterns |

---

**End of Deployment Plan**

**Next action:** Sean reviews this plan, asks questions, and decides when to schedule the deployment window. The plan is ready for execution — it requires no additional research. Open questions are flagged inline for testing during deployment.
