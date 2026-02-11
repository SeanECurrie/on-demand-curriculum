# Deployment Crib Sheet

Quick reference for everything you need before and during deployment. The walkthrough (`2026-02-11-v1-initial-deployment.md`) has the full explanations — this is just the checklist.

---

## Accounts & Tokens to Create

| What | Where | Format | Used For |
|------|-------|--------|----------|
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com/) > API Keys | `sk-ant-api03-...` | LLM provider (Claude Opus 4.6) |
| Telegram bot token | Telegram > @BotFather > `/newbot` | `123456789:ABCdef...` | Messaging channel |
| Telegram user ID | Telegram > @userinfobot | `123456789` (numeric) | `allowFrom` config — restricts who can talk to bot |
| Brave Search API key | [brave.com/search/api](https://brave.com/search/api/) | Free tier available | Web search tool for agent |

**Save all of these somewhere secure before starting.** You'll paste them into config files during deployment.

---

## Software to Install (in order)

| Software | Install Command | Version Required | Notes |
|----------|----------------|-----------------|-------|
| Homebrew | `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` | Latest | Package manager. Installs to `/opt/homebrew` on Apple Silicon |
| Node.js 22 | `brew install node@22 && brew link node@22` | >= 22 | Must be ARM-native (`file $(which node)` should show `arm64`) |
| OpenClaw | `npm install -g openclaw@latest` | **>= 2026.1.29** | **CRITICAL** — older versions have 1-click RCE (CVE-2026-25253) |
| Docker Desktop | `brew install --cask docker` | Latest | Only if using sandbox mode (recommended but optional on 16GB) |

**Verify after install:**
```bash
node --version          # >= 22
file $(which node)      # arm64
openclaw --version      # >= 2026.1.29
docker --version        # if installed
```

---

## macOS Settings (System Settings app)

| Setting | Location | Set To | Why |
|---------|----------|--------|-----|
| Firewall | Network > Firewall | **ON** | Block inbound connections |
| Stealth mode | Network > Firewall > Options | **ON** | Don't respond to pings/port scans |
| FileVault | Privacy & Security > FileVault | **ON** | Full-disk encryption — save recovery key separately |
| Screen saver | Lock Screen > Start Screen Saver | **Never** | Prevent lockout on headless server |
| Auto-lock | Lock Screen > Require password | **Never** (or max interval) | Same |
| Auto-updates | General > Software Update > Automatic Updates | **ALL OFF** | Prevent unplanned reboots (you check manually) |
| Tailscale | General > Login Items | **Enabled at login** | Must start on boot |

---

## Terminal Commands — macOS Hardening

Run these from an admin account on the Mac Mini:

**Create dedicated user:**
```bash
sudo dscl . -create /Users/openclaw
sudo dscl . -create /Users/openclaw UserShell /bin/bash
sudo dscl . -create /Users/openclaw RealName "OpenClaw Service"
sudo dscl . -create /Users/openclaw UniqueID 550
sudo dscl . -create /Users/openclaw PrimaryGroupID 20
sudo dscl . -create /Users/openclaw NFSHomeDirectory /Users/openclaw
sudo createhomedir -c -u openclaw
sudo dscl . -passwd /Users/openclaw
```

**Prevent sleep (all of these):**
```bash
sudo pmset -a sleep 0 displaysleep 0 disksleep 0 autopoweroff 0 powernap 0 womp 0
sudo pmset -a autorestart 1
```

**Disable auto-updates:**
```bash
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled -bool false
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticDownload -bool false
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool false
sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate CriticalUpdateInstall -bool false
defaults write com.apple.commerce AutoUpdate -bool false
```

**Disable screensaver:**
```bash
defaults -currentHost write com.apple.screensaver idleTime 0
```

**Verify SIP & Gatekeeper (don't change, just confirm):**
```bash
csrutil status      # "enabled"
spctl --status      # "assessments enabled"
```

---

## Key Config Files

| File | What Goes In It |
|------|----------------|
| `~/.openclaw/openclaw.json` | Everything: gateway, agents, channels, tools, sandbox |
| `~/.openclaw/exec-approvals.json` | Command allowlist/denylist |
| `~/.openclaw/HEARTBEAT.md` | Agent's periodic check-in instructions |
| `~/Library/LaunchAgents/bot.molt.gateway.plist` | launchd service config (auto-created by `openclaw gateway install`) |
| `/etc/pf.anchors/openclaw.rules` | Firewall rules |

---

## Critical Config Values

These are the security-critical settings in `openclaw.json`. Get any of these wrong and you have a problem.

```
gateway.bind              = "loopback"        ← localhost only
gateway.auth.mode         = "token"           ← require auth token
controlUi.allowInsecureAuth = false           ← prevents CVE-2026-25253
discovery.mdns.mode       = "off"             ← stop broadcasting on LAN
channels.telegram.dmPolicy = "pairing"        ← only paired contacts
tools.elevated.enabled    = false             ← no sandbox escape hatch
agents.defaults.sandbox.mode = "all"          ← sandbox everything
logging.redactSensitive   = "tools"           ← don't leak secrets in logs
```

---

## Day-1 Tool Policy (read-only)

**Allowed:** `read`, `web_search`, `web_fetch`, `reactions`, `thinking`, `sessions_list`, `sessions_history`, `session_status`

**Denied:** `browser`, `canvas`, `nodes`, `cron`, `discord`, `exec`, `process`, `write`, `edit`, `apply_patch`

---

## Key Commands

```bash
# Gateway
openclaw gateway install                          # Create launchd service
launchctl list | grep molt                        # Is it running?
launchctl kickstart -k gui/$UID/bot.molt.gateway  # Restart
launchctl bootout gui/$UID/bot.molt.gateway       # Stop
curl -s http://127.0.0.1:18789/health             # Health check

# Security
openclaw security audit --deep                    # Full audit
openclaw --version                                # Version check

# Config
openclaw config get <key>                         # Read setting
openclaw config set <key> <value>                 # Write setting
openclaw doctor                                   # Health check

# Tailscale
tailscale status                                  # Connected devices
tailscale serve --bg 18789                        # Expose gateway UI via Tailscale HTTPS
```

---

## File Permissions (after setup)

```bash
chmod 700 ~/.openclaw
chmod 600 ~/.openclaw/openclaw.json
chmod 600 ~/.openclaw/exec-approvals.json
```

---

## Hardware Extras

| Item | ~Cost | Why |
|------|-------|-----|
| Dummy HDMI plug | $5-10 | macOS degrades graphics without display — affects screen capture |
| UPS (battery backup) | $30-50 | Prevents dirty shutdowns on power flickers |

---

## Spending Limits (set in Anthropic Console)

- **Daily:** $10
- **Monthly:** $100
- Adjust after Week 1 once you have usage data

---

## Quick Verification After Deployment

```bash
openclaw --version                    # >= 2026.1.29
curl http://127.0.0.1:18789/health    # gateway responds
sudo fdesetup status                  # FileVault is On
csrutil status                        # SIP enabled
ls ~/.openclaw/extensions/            # empty (no ClawHub skills)
ls -la ~/.openclaw/openclaw.json      # -rw------- (600)
dns-sd -B _openclaw-gw._tcp          # nothing found (wait 10s, Ctrl+C)
```
