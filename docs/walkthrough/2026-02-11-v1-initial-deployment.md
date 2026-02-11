# OpenClaw Deployment Walkthrough — v1

**Date:** 2026-02-11
**Operator:** Sean Currie
**Target:** Apple M4 Mac Mini, 16GB RAM, Tailscale configured
**OpenClaw Target Version:** >= 2026.1.29 (mandatory — CVE patches)
**Based On:** ClawdBot Research Project — 130+ sources across Context7 + Bright Data

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

## Phase A: macOS Hardening

**What we're doing:** Turning your Mac Mini from a desktop computer into a secure, always-on server.
**Why it matters:** Everything you install after this sits on the foundation you build here. A poorly hardened OS undermines every security layer above it.
**Time estimate:** 20-30 minutes.
**Deeper context:** `knowledge-base/03-security/security-posture-analysis.md`

### Understanding: macOS as a Server

macOS was designed for someone sitting at a desk. It sleeps after inactivity, pops up update dialogs, runs screensavers, and assumes there's a human watching. None of that works for a 24/7 AI agent that needs to respond to Telegram messages at 3am.

Tim's VPS ran Debian Linux — an OS built for servers. It doesn't sleep, doesn't auto-update, doesn't assume a display. When Tim hardened his VPS (non-root user, UFW firewall, SSH keys), he was following well-documented server administration patterns. On macOS, you're doing the equivalent work, but every step is different: `launchd` instead of `systemd`, `pf` instead of `ufw`, `dscl` instead of `useradd`, and a handful of macOS-specific gotchas that Tim never covered because they don't exist on Linux.

The other thing that's different is the security model. On Linux, the root/non-root separation is sharp and well-understood. On macOS, there are "admin" users and "standard" users, plus a hidden root account, plus System Integrity Protection (SIP) preventing even root from modifying system files, plus Gatekeeper checking app signatures. We're going to use all of these layers. The dedicated non-admin user means the OpenClaw process can't `sudo` — so even if an attacker gets code execution through the agent, they can't escalate to system-level access.

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

**Concept:** Tailscale is the strongest security layer in this deployment — stronger than the firewall, stronger than the loopback bind. It creates an encrypted tunnel between your devices, and only devices on your Tailscale network can reach each other. Our research concluded Tailscale is "ACTUALLY BETTER THAN TIM DESCRIBED" because it replaces several of Tim's manual hardening steps (SSH keys, port-based firewall rules) with a single identity-based access control system.

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
