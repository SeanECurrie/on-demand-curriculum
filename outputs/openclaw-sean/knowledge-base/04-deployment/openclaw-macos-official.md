# OpenClaw macOS Deployment — Official Documentation

**Source:** Context7 (/openclaw/openclaw)
**Credibility Tier:** 1
**Date Pulled:** 2026-02-10

---

## macOS-Specific Installation

### Requirements
- Node.js 22+ (ARM/Apple Silicon compatible)
- npm

### Install Methods
1. **Installer script:** `curl -fsSL https://openclaw.ai/install.sh | bash`
2. **npm direct:** `npm install -g openclaw@<version>`

### macOS Gateway Service (LaunchAgent)

Unlike Linux (which uses systemd), macOS uses **launchd** for background services.

```bash
openclaw gateway install  # Installs as launchd LaunchAgent
```

This is the correct macOS-native approach for:
- Running the gateway in background
- Auto-starting on boot
- Persisting across restarts

### Node Connectivity

Macs can connect as **nodes** to a Gateway, exposing local tools:
- `system.run` — execute commands on the Mac
- `canvas` — visual interface
- `camera` — device camera access

This means the Mac Mini could serve as BOTH the Gateway AND a Node.

---

## macOS vs Linux Differences (from docs)

| Aspect | macOS | Linux |
|--------|-------|-------|
| Service management | launchd (LaunchAgent) | systemd |
| Install command | Same (`openclaw gateway install` adapts) | Same |
| SSH config location | Same (`/etc/ssh/sshd_config`) | Same |
| Node.js | ARM-native available | x86/ARM available |
| Docker | Docker Desktop (heavier) | Native Docker |

---

## Documentation Gaps for macOS

The official docs have macOS-specific content but it's LIMITED compared to Linux:
- No detailed resource usage metrics on Apple Silicon
- No M4-specific performance data
- No macOS firewall configuration guidance (Linux guides reference ufw/iptables)
- No macOS-specific security hardening beyond general guidance
- No guidance on macOS's built-in security features (Gatekeeper, SIP, sandboxing)

**These gaps need to be filled by Bright Data community intelligence.**
