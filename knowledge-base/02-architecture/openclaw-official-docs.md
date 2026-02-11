# OpenClaw — Official Documentation Synthesis

**Source:** Context7 (libraries: /openclaw/openclaw, /llmstxt/openclaw_ai_llms-full_txt, /openclaw/skills)
**Credibility Tier:** 1 (Official documentation)
**Date Pulled:** 2026-02-10

---

## What OpenClaw Actually Is

OpenClaw is a **personal AI assistant gateway** that runs on your own devices. It's NOT an AI model — it's an orchestration layer that:
- Connects to multiple messaging platforms (WhatsApp, Telegram, Slack, Discord, iMessage)
- Routes messages to LLM providers (OpenAI, Anthropic, etc.)
- Manages agent sessions, memory, and tool access
- Supports voice capabilities and a live canvas interface
- Enables autonomous task execution via skills, cron jobs, and multi-agent routing

**Core architecture:** Gateway server that handles channel connections, session management, and agent orchestration.

---

## Architecture — Gateway + Nodes + Agents

### The Distributed Model

```
Gateway (central)
├── Owns channels (Signal/WhatsApp/Telegram), routing, and sessions
├── Nodes (devices)
│   └── Macs/iOS/Android connect as peripherals
│   └── Expose local tools (system.run, canvas, camera)
├── Agents (workers)
│   └── Separate brains/workspaces for specialized roles
│   └── Each can have own sandbox config and tool restrictions
├── Sub-agents
│   └── Spawn background work for parallelism
└── TUI
    └── Connect to Gateway, switch agents/sessions
```

**Key insight:** You can run ONE Gateway (even on something as small as a Raspberry Pi) plus NODES and AGENTS distributed across devices. This is directly relevant to our Mac Mini setup — the Mac Mini could be the Gateway, with other devices as nodes.

### Multi-Agent Routing

Multiple isolated agents within a single gateway process:
- Each agent has its own workspace, auth credentials, and configurations
- Supports distinct agent personalities and functionalities
- Channel accounts and bindings route messages to specific agents

**Configuration example:**
```json
{
  "agents": {
    "list": [
      {
        "agentDir": "/path/to/agent1",
        "bindings": ["binding1"]
      },
      {
        "agentDir": "/path/to/agent2",
        "bindings": ["binding2"]
      }
    ]
  }
}
```

---

## Installation — macOS Specific

### Requirements
- **Node.js version 22 or higher** (critical requirement)
- npm (comes with Node.js)

### Installation Methods

**Method 1: One-liner installer**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```

**Method 2: npm global install**
```bash
npm install -g openclaw@<version>
```

### macOS Gateway as LaunchAgent

OpenClaw can be installed as a **launchd service** on macOS — this is the macOS-native way to run background services (equivalent to systemd on Linux). This ensures the gateway:
- Runs in the background
- Persists across application restarts
- Starts automatically on boot

```bash
openclaw gateway install
```

**This is significant for Mac Mini deployment** — launchd is the proper macOS way to handle this, not just running it in a terminal session.

### Onboarding Wizard

```bash
openclaw onboard --install-daemon
```
The wizard:
- Builds UI assets
- Configures the gateway (default port 18789)
- Sets up initial channel connections
- Configures model connections

### Diagnostics
```bash
openclaw doctor    # System health check
openclaw configure # Access configuration
```

---

## Security Model

### Gateway Security Configuration

Secure default configuration:
```json
{
  "gateway": {
    "mode": "local",
    "bind": "loopback",
    "port": 18789,
    "auth": { "mode": "token", "token": "your-long-random-token" }
  },
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "groups": { "*": { "requireMention": true } }
    }
  }
}
```

**Key security features:**
- `mode: "local"` — gateway not exposed to internet
- `bind: "loopback"` — only accessible from localhost (127.0.0.1)
- `auth.mode: "token"` — requires authentication token
- `dmPolicy: "pairing"` — users must pair before they can message the bot
- `requireMention: true` — in groups, bot only responds when mentioned

### Multi-Agent Sandbox Configuration

Each agent can have its own security profile:
```json
{
  "sandbox": {
    "mode": "auto-allow",
    "filesystem": {
      "allow": ["/Users/projects"],
      "deny": ["~/.ssh", "~/.aws"]
    },
    "network": {
      "allowedDomains": ["github.com", "npmjs.org"]
    }
  }
}
```

**Security controls per agent:**
- `sandbox.mode` — controls execution sandboxing
- `filesystem.allow/deny` — whitelist/blacklist file system access
- `network.allowedDomains` — restrict network access to specific domains
- `tools.allow/tools.deny` — restrict which tools each agent can use

### Skill Security

**Skill scanning:**
```bash
./scripts/scan-skills.sh        # Full security scan of all installed skills
./scripts/scan-skills.sh --json # JSON output for automation
```

**Security validator hooks:**
```json
{
  "strictMode": false,
  "blockThreats": true,
  "logEvents": true,
  "patterns": {
    "commandInjection": true,
    "ssrf": true,
    "pathTraversal": true,
    "promptInjection": true
  }
}
```

**Layered security architecture:**
1. **Security Engine** — main orchestrator, coordinates all modules
2. **Detection Modules** (parallel) — prompt injection, command injection, URL validation, path validation, secret detection, content scanning
3. **Severity Scorer** — evaluates and weights threat levels
4. **Action Engine** — rate limiting, reputation scoring, allow/warn/block decisions
5. **Async Queue** — non-blocking database writes, logging, notifications

---

## Agent Capabilities

Agents can:
- Control browsers via CDP (Chrome DevTools Protocol)
- Search the web
- Manage cron jobs (scheduled tasks)
- Send messages across platforms
- Maintain semantic memory through vector search
- Spawn sub-agents for parallel work
- Access local device tools (system.run, canvas, camera) via nodes

---

## Gaps / Things Documentation Doesn't Fully Cover

- [ ] Detailed resource requirements for macOS/ARM (CPU, RAM, disk)
- [ ] Performance characteristics on Apple Silicon specifically
- [ ] Specific Node.js 22 ARM compatibility notes
- [ ] Detailed data residency — exactly what gets sent to LLM providers vs. stored locally
- [ ] Model routing logic in multi-model setups (how does it decide which model to use?)
- [ ] Upgrade/update procedures
- [ ] Backup and disaster recovery

These gaps should be investigated via Bright Data community intelligence.
