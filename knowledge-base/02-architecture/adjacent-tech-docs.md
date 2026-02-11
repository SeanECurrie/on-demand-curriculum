# Adjacent Technology Documentation

**Source:** Context7
**Credibility Tier:** 1
**Date Pulled:** 2026-02-10

---

## Tailscale VPN — Relevant to OpenClaw Deployment

### What It Does for Us
Tailscale creates a secure WireGuard-based mesh network between authorized devices. For our Mac Mini deployment, it:
- Provides private network connectivity between Mac Minis + laptop
- Enables SSH access without exposing port 22 to the internet
- Uses identity-based authentication instead of SSH key management

### SSH Configuration via Tailscale

**Enable Tailscale SSH on a device:**
```bash
tailscale up --auth-key=$TS_AUTHKEY --ssh
# or on existing connection:
tailscale set --ssh
```

**Requirements for Tailscale SSH to work:**
1. Tailnet policy file must include ACL rules allowing SSH source and destination
2. Tailscale SSH must be enabled on the destination device

### Access Control (ACLs)

**Default allow-all policy:**
```json
{
  "acls": [
    { "action": "accept", "src": ["*"], "dst": ["*:*"] }
  ],
  "ssh": [
    {
      "action": "check",
      "src": ["autogroup:member"],
      "dst": ["autogroup:self"],
      "users": ["autogroup:nonroot", "root"]
    }
  ]
}
```

**Recommended for our setup — restrict SSH to non-root:**
```json
"ssh": [
  {
    "action": "accept",
    "src": ["autogroup:member"],
    "dst": ["autogroup:self"],
    "users": ["autogroup:nonroot"]
  }
]
```

### Security Notes
- Tailscale SSH uses identity-based auth — no manual SSH key management
- ACL policies can restrict which devices can reach which services
- Can configure "check" action for SSH which requires re-authentication
- Misconfigurations: if ACL rules missing or SSH not enabled on device, connections fail silently

### Relevance to Tim's Video
Tim uses Tailscale for VPN tunneling to the VPS. Sean already has Tailscale configured between Mac Minis. The Tailscale ACL system provides ADDITIONAL security controls Tim didn't mention — we can restrict SSH access at the Tailscale policy level, not just at the SSH config level.

---

## Telegram Bot API — Relevant to Channel Setup

### Bot Token Security
- Bot token format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`
- **Everyone who has your token has FULL CONTROL over your bot**
- Store in a secure place, only share with people who need direct access
- Created via @BotFather on Telegram

### Authentication
- Each bot identified by unique authentication token
- `/getMe` endpoint to test token validity
- Data validation via HMAC-SHA256 (backend) or Ed25519 (third-party)

### Security Considerations for OpenClaw
- The bot token is the primary security credential for Telegram integration
- Token exposure = complete bot takeover
- Tim's video: "Clear your BotFather chat to not accidentally leak the token"
- OpenClaw stores this token in its configuration — understanding where config files live on disk matters for security

---

## Node.js — Runtime Requirement

### OpenClaw Requirement
- **Node.js 22 or higher** (hard requirement from docs)
- Node.js 22 has native ARM/Apple Silicon support
- npm comes bundled with Node.js

### macOS/ARM Compatibility
- Node.js 22+ has first-class Apple Silicon (M-series) support
- No emulation needed — runs natively on ARM
- This is good for performance on the M4 Mac Mini

### Installation on macOS
Recommended: use nvm or Homebrew
```bash
# via Homebrew
brew install node@22

# via nvm
nvm install 22
nvm use 22
```

---

## Key Dependencies Summary

| Technology | Role | Mac Mini Compatible | Notes |
|-----------|------|-------------------|-------|
| Node.js 22+ | Runtime | Yes (native ARM) | Hard requirement |
| npm | Package manager | Yes (bundled) | Used for OpenClaw install |
| Tailscale | VPN/SSH | Yes (native app) | Sean already has this configured |
| Telegram Bot API | Messaging channel | N/A (cloud service) | Bot token is critical security credential |
| launchd | Service management | macOS native | OpenClaw integrates with this |
