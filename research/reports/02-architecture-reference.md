# Phase 1 Report: OpenClaw Architecture Reference

**Date:** 2026-02-11
**Sources:** Context7 official docs + community intelligence (41 sources)
**Report Type:** Architecture reference

---

## Key Takeaway

OpenClaw is a personal AI assistant gateway that orchestrates multi-platform messaging and LLM routing through a distributed architecture of Gateways, Nodes, Agents, and Sub-agents. The official architecture is solid, but community consensus warns the implementation is "vibe-coded" with config duplication issues and rough edges that make it developer-grade, not plug-and-play.

---

## Architecture Overview

### The Distributed Model

```
Gateway (central orchestrator)
├── Channels (Signal/WhatsApp/Telegram/Slack/Discord/iMessage)
│   └── Manages connections, routing, and session state
├── Nodes (peripheral devices)
│   └── Macs/iOS/Android connect as compute peripherals
│   └── Expose local device tools (system.run, canvas, camera)
├── Agents (isolated workers)
│   └── Separate brains/workspaces for specialized roles
│   └── Each has own sandbox config, tool restrictions, memory
│   └── Can run multiple agents in single Gateway process
├── Sub-agents (parallel work)
│   └── Spawned by primary agents for background tasks
└── TUI (terminal interface)
    └── Connect to Gateway, switch agents/sessions
```

**Key architectural insight:** You can run ONE Gateway (even on a Raspberry Pi) plus Nodes and Agents distributed across devices. For our Mac Mini deployment, the Mini is the Gateway with potential for other devices (laptop, phone) as Nodes.

### Multi-Agent Routing

Multiple isolated agents within a single Gateway process:
- Each agent has its own workspace directory, auth credentials, and configurations
- Channel accounts and bindings route messages to specific agents
- Enables distinct agent personalities and functionalities

**Configuration structure:**
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

## How It Actually Works (Docs + Reality)

### Where Docs and Community Agree

1. **Node.js 22+ required** — Hard requirement, ARM-native on Apple Silicon (M4 compatible)
2. **Gateway default port 18789** — Runs on localhost by default (loopback mode)
3. **launchd integration on macOS** — `openclaw gateway install` creates proper macOS LaunchAgent
4. **Security hooks exist** — Prompt injection, command injection, SSRF, path traversal detection documented
5. **Per-agent sandboxing** — Filesystem allow/deny, network domain restrictions, tool allow/deny per agent
6. **Tailscale integration** — Official docs have dedicated Tailscale VPN page

### Where Community Says It's Rougher Than Docs Suggest

1. **"Vibe-coded" codebase** — LinkedIn reviewer: "This is not a plug-and-play AI tool. This is closer to a developer-grade experiment packaged as a product." Reddit consensus: "The experience is awesome, but the project is terrible. The entire thing is very *very* vibe-coded."

2. **Configuration duplication** — Community reports config duplicated across:
   - `~/.clawdbot/clawdbot.json`
   - `~/.clawdbot/agents/main/agent/models.json`
   - No clear documentation on which takes precedence

3. **Setup time vs advertised** — Docs suggest one-liner install. Community reality: "About two hours of wrestling" (Tier 2 creator)

4. **Massive initial token burn** — "8 MILLION TOKENS on Claude-4.5-OPUS" during first setup (Tier 4, Reddit)

5. **Model quality matters** — Docs don't specify model requirements. Community learned: cheaper/smaller models break the agent. Users tried OSS 120B and Qwen3 Next 80B: "NOPE. Neither of those are worth your time." Claude Opus/Sonnet recommended.

6. **Rough UI** — "It feels rough and like no actual designers put any effort into it"

7. **No task visibility** — Zero visibility into multiple concurrent operations, no progress tracking

8. **Known instabilities** — Browser tool marked as unstable by community (Tier 3/5)

---

## Technology Stack

| Component | Role | Mac Mini Compatible | Notes |
|-----------|------|---------------------|-------|
| **Node.js 22+** | Runtime | Yes (native ARM) | Hard requirement, first-class M-series support |
| **TypeScript** | Language | Yes | Confirmed by community + docs |
| **npm** | Package manager | Yes (bundled) | Used for global install |
| **launchd** | Service management | macOS native | `openclaw gateway install` creates LaunchAgent |
| **Tailscale** | VPN/SSH | Yes (native app) | Sean already has this configured |
| **Telegram Bot API** | Messaging channel | N/A (cloud service) | Bot token = critical security credential |

**Community-confirmed stack:**
- Local-first architecture (not cloud-hosted)
- WebSocket/HTTP for Gateway communication
- Chrome DevTools Protocol (CDP) for browser control
- Vector search for semantic memory

---

## Configuration Architecture

### Where Configs Live

Per official docs:
- Main config: `~/.openclaw/openclaw.json` (renamed from `~/.clawdbot/`)
- Agent-specific: `~/.openclaw/agents/<agent-name>/agent/models.json`
- Skill config: Listed under `skills.entries` in main config
- Security: `config/exec-approvals.json` for command authorization

**Community-reported issue:** Configuration duplicated between main config and agent configs, unclear precedence.

### What Controls What

**Gateway level (`openclaw.json`):**
- `gateway.mode` — "local" (not internet-exposed) or "open"
- `gateway.bind` — "loopback" (127.0.0.1 only) or broader
- `gateway.port` — Default 18789
- `gateway.auth` — Token-based authentication
- `channels` — WhatsApp, Telegram, Slack, Discord, Signal, iMessage configs
- `agents.list` — Multi-agent routing and bindings

**Agent level (`agent/models.json`):**
- Model provider configurations (OpenAI, Anthropic, etc.)
- Model routing logic (unclear from docs)

**Sandbox level:**
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
    },
    "tools": {
      "allow": ["web.search", "file.read"],
      "deny": ["system.run"]
    }
  }
}
```

**Security validator (`exec-approvals.json`):**
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

### The Duplication Issue

Community reports configuration scattered across multiple files with unclear precedence. This creates risk:
- Updating model config in one place may not apply globally
- Security settings may conflict between Gateway and Agent configs
- No single source of truth for which config wins

**Recommendation:** Document actual config precedence during deployment phase via testing.

---

## Communication Flow

### Message In → Response Out

```
1. User sends message via channel (Telegram, WhatsApp, etc.)
   ↓
2. Gateway receives message, validates auth/pairing
   ↓
3. Gateway routes to appropriate Agent based on bindings
   ↓
4. Agent processes message (may spawn Sub-agents for parallel work)
   ↓
5. Agent calls LLM provider (OpenAI, Anthropic, etc.)
   ↓
6. LLM responds with tool calls or text
   ↓
7. Agent executes tools (if allowed by sandbox)
   ↓
8. Response sent back through Gateway to channel
```

### Security Checkpoints

**Layered security architecture:**
1. **Security Engine** — Main orchestrator, coordinates all modules
2. **Detection Modules** (parallel) — Prompt injection, command injection, URL validation, path validation, secret detection, content scanning
3. **Severity Scorer** — Evaluates and weights threat levels
4. **Action Engine** — Rate limiting, reputation scoring, allow/warn/block decisions
5. **Async Queue** — Non-blocking database writes, logging, notifications

**Where security checks happen:**
- Gateway: DM policy (pairing), group mention requirements, auth tokens
- Agent: Sandbox restrictions (filesystem, network, tools)
- Execution: Command authorization, pattern matching (SSRF, path traversal, etc.)

### Community-Observed Latency

"Feels slow vs ChatGPT/Claude due to subagent spin-up" — Community consensus is that multi-agent routing adds noticeable latency compared to direct LLM access.

---

## Mac Mini Deployment Architecture

### Single-Device Setup (Our Target)

```
M4 Mac Mini (16GB RAM)
├── Gateway (launchd service)
│   └── Always-on, auto-start on boot
│   └── Port 18789, loopback only
├── Node (local device tools)
│   └── Exposes Mac Mini filesystem, terminal, etc.
├── Agent(s) (one or more)
│   └── Sandboxed workspaces
└── Tailscale VPN
    └── Secure remote access (already configured)
```

### Why This Works

**Per official docs:** Gateway can run on "something as small as a Raspberry Pi" — M4 Mac Mini (16GB RAM) is significantly more powerful.

**Community validation:** Multiple users run on single machines. Main requirements are Node.js 22+ and sufficient RAM for model context.

### macOS-Specific Considerations

**launchd vs systemd:**
- Linux guides reference systemd — NOT applicable on macOS
- macOS uses launchd for service management
- `openclaw gateway install` handles this automatically

**Keychain access concerns:**
- Community report: "macOS has been giving me weird permission dialogs all related to accessing Keychain, and I even allowed one by mistake." User uninstalled over this.
- **ACTION ITEM:** Investigate Keychain behavior on Mac Mini before enabling full access

**Tailscale SSH integration:**
- Sean already has Tailscale configured between Mac Minis
- Tailscale ACLs provide ADDITIONAL security layer beyond SSH config
- Can restrict SSH access at Tailscale policy level, not just SSH config
- Recommended ACL: restrict to non-root users only

**Node.js ARM compatibility:**
- Node.js 22+ has native Apple Silicon support (no Rosetta emulation)
- First-class M-series performance

---

## Documentation Gaps

### What Official Docs Don't Cover

1. **Resource usage metrics** — No CPU/RAM/disk guidance for macOS/ARM specifically
2. **M4-specific performance data** — No Apple Silicon benchmarks or capacity planning
3. **macOS firewall configuration** — Docs only cover Linux ufw/iptables
4. **Data residency details** — Exactly what gets sent to LLM providers vs. stored locally
5. **Model routing logic** — How does it decide which model to use in multi-model setups?
6. **Upgrade/update procedures** — How to safely update without breaking existing config
7. **Backup and disaster recovery** — What to back up, how to restore
8. **Config precedence** — When main config conflicts with agent config, which wins?
9. **Initial token burn** — Why does first setup consume millions of tokens?
10. **Streaming issues** — "U" output documented as community fix, not in official docs

### What Community Fills In (But Needs Validation)

1. **Recommended model requirements** — Claude Opus/Sonnet, smaller models fail
2. **Actual setup time** — 2+ hours vs one-liner claim
3. **Security best practices** — Dedicated machine, hardened Docker, VPN access
4. **Model mixing strategy** — Expensive for training, cheap for execution
5. **Personalization importance** — "Spend real time telling the bot about YOU"
6. **Skill security audit** — `openclaw security audit` (community-documented)

---

## Architecture Risks

### Security Risks (Community-Validated)

1. **Root-level shell access via chat** — "We are essentially installing a root-level shell that we control via chat messages. One prompt injection, or one hallucination where it decides to `rm -rf` something, and it's game over."
   - **CONFIRMED:** Official docs document "The find ~ Incident"

2. **Prompt injection via content** — "Attackers can hide instructions inside content OpenClaw reads: an email, a GitHub issue, a web page..."
   - **CONFIRMED:** Official docs document "Find the Truth" attack pattern

3. **Gateway exposed without auth** — Port 18789 can be exposed with "open" DM policy
   - **CONFIRMED:** Official docs show auth modes including "open"

4. **Keychain access on macOS** — Unexpected permission dialogs, risk of accidental approval

5. **Sleeper agent attacks** — Skills manipulated to perform malicious actions later

6. **Credential harvesting** — Agent could exfiltrate API keys, tokens, passwords

7. **Agent going rogue** — Viral story: agent autonomously acquired Twilio phone number overnight

### Operational Risks (Community-Reported)

1. **Config drift** — Multiple config files, unclear precedence
2. **No task visibility** — Can't see what's happening with concurrent operations
3. **Model validation gaps** — `/model` accepts arbitrary identifiers without validation
4. **Browser tool instability** — Known unreliability
5. **High cost with premium models** — "$1000 to test" with Opus
6. **Latency vs direct LLM** — Subagent spin-up adds noticeable delay

### Mitigation Strategies (Community Consensus)

1. **Dedicated/disposable machine** — Most consistent recommendation
2. **Enable sandboxing** — Auth0 guide: "Enable the sandbox (the 'padded room')"
3. **Strict filesystem/network restrictions** — Use allow/deny lists
4. **Tailscale or VPN only** — Never expose Gateway to internet
5. **Require human approval** — Use `exec-approvals.json` for high-risk commands
6. **Run security audit** — `openclaw security audit` (community-documented)
7. **Start with minimal skills** — Add incrementally, audit each

---

## For Mac Mini Deployment: Key Takeaways

### What Works in Our Favor

- Node.js 22+ has native M4 support (no emulation)
- launchd integration is macOS-native (not a workaround)
- Tailscale already configured (adds security layer)
- M4 Mac Mini (16GB) exceeds minimum requirements
- Dedicated hardware = less risk than primary laptop

### What We Need to Watch

- Keychain access dialogs — investigate before deployment
- Config duplication — document actual precedence
- Initial token burn — budget accordingly
- Model selection — start with Claude Opus/Sonnet
- Sandbox configuration — restrict filesystem/network/tools from day 1

### Next Phase Actions

1. Test Node.js 22 installation on M4 Mac Mini
2. Document Keychain behavior during onboarding
3. Map actual config precedence (main vs agent)
4. Establish baseline resource usage metrics (CPU/RAM/disk)
5. Configure Tailscale ACLs to restrict non-root SSH only
6. Test launchd auto-start behavior
7. Measure initial token consumption during setup
