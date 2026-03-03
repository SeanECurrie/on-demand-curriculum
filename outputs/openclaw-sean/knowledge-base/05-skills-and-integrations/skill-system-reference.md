# OpenClaw Skill System Reference

**Research Date:** 2026-02-11
**Sources:** Context7 (docs.openclaw.ai, /openclaw/openclaw, /openclaw/skills, /voltagent/awesome-moltbot-skills) + Bright Data (16+ targeted scrapes/searches)
**Credibility Range:** Tiers 1-4

---

## Skill Architecture

### How Skills Work Internally

Skills are **AgentSkills-compatible** folders that teach the agent how to use tools. Each skill is a directory containing a `SKILL.md` file with YAML frontmatter and Markdown instructions. When a session starts, OpenClaw:

1. Scans all skill locations and filters by environment, config, and binary presence
2. Snapshots eligible skills for the session
3. Injects a compact XML list into the system prompt (~97 chars + field lengths per skill)
4. Applies per-skill `env`/`apiKey` to the process environment
5. Restores the original environment after the agent run

Skills refresh mid-session when the skills watcher detects `SKILL.md` changes or when a new eligible node connects.

**Source:** docs.openclaw.ai/tools/skills (Tier 1)

### Skill Locations and Precedence (Highest to Lowest)

1. **Workspace skills:** `<workspace>/skills` (per-agent, highest priority)
2. **Managed/local skills:** `~/.openclaw/skills` (shared across all agents)
3. **Bundled skills:** shipped with the install (53 official skills)
4. **Extra directories:** configured via `skills.load.extraDirs` (lowest priority)

Name conflicts resolve by precedence: workspace wins over managed, managed wins over bundled.

**Source:** docs.openclaw.ai/tools/skills (Tier 1)

### Three Skill Types

| Type | Location | How You Get Them | Security Posture |
|------|----------|------------------|------------------|
| **Built-in tools** | Core gateway code | Ship with OpenClaw install | Highest trust (Tier 1 code) |
| **Bundled skills** | `<install>/skills/` | Ship with OpenClaw install | High trust (official, reviewed) |
| **Installed/custom skills** | `~/.openclaw/skills/` or `<workspace>/skills/` | ClawHub, manual install, or self-authored | UNTRUSTED until vetted |

Additionally, **plugins** can ship skills by listing `skills` directories in their `openclaw.plugin.json` manifest.

**Source:** docs.openclaw.ai/tools/skills, docs.openclaw.ai/tools/plugin (Tier 1)

### Skill Format (SKILL.md)

Minimal skill:
```yaml
---
name: my-skill
description: What this skill does
---

Instructions in Markdown that the agent reads.
Use {baseDir} to reference the skill folder path.
```

Advanced frontmatter options:
- `homepage` -- URL shown in macOS Skills UI
- `user-invocable` -- `true|false` (default: true). Exposes as slash command.
- `disable-model-invocation` -- `true|false`. Excludes from model prompt.
- `command-dispatch: tool` -- Bypasses model; dispatches directly to a tool.
- `command-tool` -- Tool name for direct dispatch.
- `metadata` -- Single-line JSON with `openclaw` key for gating/requirements.

Gating via metadata:
```yaml
metadata: {"openclaw": {"requires": {"bins": ["uv"], "env": ["GEMINI_API_KEY"], "config": ["browser.enabled"]}, "primaryEnv": "GEMINI_API_KEY", "os": ["darwin"]}}
```

Fields:
- `requires.bins` -- Binary must exist on PATH
- `requires.anyBins` -- At least one must exist
- `requires.env` -- Environment variable must exist or be in config
- `requires.config` -- openclaw.json path must be truthy
- `os` -- Platform filter (darwin, linux, win32)
- `install` -- Array of installer specs (brew/node/go/uv/download)
- `always: true` -- Skip all gates

**Source:** docs.openclaw.ai/tools/skills (Tier 1)

### Token Cost

Per the official docs, the token impact is deterministic:
- **Base overhead:** 195 characters (when 1+ skills are eligible)
- **Per skill:** ~97 characters + length of name, description, location fields
- Rough estimate: ~24 tokens per skill (OpenAI-style tokenizer)

With 53 bundled skills, this is roughly ~1,300 extra tokens per agent turn. Not trivial for cost management.

**Source:** docs.openclaw.ai/tools/skills (Tier 1)

---

## Built-In Tools

Based on the official docs navigation structure, OpenClaw ships these built-in tool categories. These are core gateway code, not skills -- they are always available unless explicitly denied.

### Core Tools

| Tool | Function | Security Risk | Our Recommendation |
|------|----------|---------------|-------------------|
| **exec** | Run shell commands in workspace | **CRITICAL** -- arbitrary command execution | Enable with strict exec-approvals allowlist |
| **process** | Manage background exec sessions (poll, kill, write) | **HIGH** -- extends exec capabilities | Tied to exec; same restrictions |
| **read** | Read files from filesystem | **MEDIUM** -- information disclosure | Enable (read-only is relatively safe) |
| **write** | Write files to filesystem | **HIGH** -- can modify any accessible file | Defer; enable after confidence builds |
| **edit** | Edit existing files | **HIGH** -- same as write | Defer; enable after confidence builds |
| **apply_patch** | Structured multi-file edits (experimental) | **HIGH** -- same as write | Defer; experimental, OpenAI models only |
| **web_search** | Search web via Brave Search API or Perplexity Sonar | **LOW** -- read-only web queries | Enable on Day 1 (requires Brave API key) |
| **web_fetch** | HTTP GET + readable extraction (HTML to markdown) | **MEDIUM** -- can fetch arbitrary URLs | Enable with SSRF protections (built-in) |
| **browser** | Full browser automation via Chrome DevTools Protocol | **CRITICAL** -- access to logged-in sessions | Do NOT enable initially |
| **browser_login** | Browser login flow management | **CRITICAL** -- credential handling | Do NOT enable initially |
| **canvas** | Live UI rendering interface | **LOW** -- display only | Defer (not needed for headless Mac Mini) |
| **reactions** | Add/remove emoji reactions to messages | **MINIMAL** -- cosmetic | Enable (harmless) |
| **thinking** | Control thinking depth (low/medium/high) | **MINIMAL** -- model parameter | Enable (cost control tool) |

**Source:** docs.openclaw.ai/tools (Tier 1)

### Workflow Runtime

| Tool | Function | Security Risk | Our Recommendation |
|------|----------|---------------|-------------------|
| **lobster** | Typed workflow runtime -- composable pipelines with approval gates | **MEDIUM** -- deterministic but powerful | Enable after Week 1 (valuable for automation) |
| **llm-task** | Structured LLM step for workflows (JSON-only) | **LOW** -- constrained model calls | Enable with Lobster |

**Lobster details:** This is the missing automation piece. It runs multi-step tool sequences as a single deterministic operation with explicit approval checkpoints. Workflows are defined in `.lobster` YAML files with `steps`, `condition`, and `approval` fields. Paused workflows return a `resumeToken` for resuming after human approval. This is how you build reliable, auditable automation. It is an optional plugin -- enable via `tools.alsoAllow: ["lobster"]`.

**Source:** docs.openclaw.ai/tools/lobster (Tier 1)

### Agent Coordination

| Tool | Function | Security Risk | Our Recommendation |
|------|----------|---------------|-------------------|
| **agent_send** | Send messages between agents | **LOW** -- inter-agent communication | Enable when multi-agent is set up |
| **subagents** | Spawn background sub-agents for parallel work | **MEDIUM** -- multiplies capability and cost | Defer until comfortable with single agent |
| **multi-agent sandbox** | Per-agent sandbox and tool restrictions | **BENEFICIAL** -- enables isolation | Enable (security tool) |

**Source:** docs.openclaw.ai/tools (Tier 1)

### Elevated Mode

`tools.elevated` is the global escape hatch that runs exec on the gateway host even when sandbox is enabled. The docs warn: "Keep `tools.elevated.allowFrom` tight and don't enable it for strangers."

**Our recommendation: Disable elevated mode entirely** (`tools.elevated.enabled: false`).

**Source:** docs.openclaw.ai/tools/elevated (Tier 1)

### Channel-Specific Tools

Each messaging channel provides its own tools:
- **telegram** tool: `sendMessage`, `react`, `deleteMessage` actions
- **whatsapp** tool: similar message/reaction capabilities
- **discord/slack** tools: channel-specific messaging

These are gated by channel configuration flags (e.g., `channels.telegram.actions.reactions`).

**Source:** docs.openclaw.ai/channels/telegram (Tier 1)

---

## Official Skills (53 Bundled)

### Categorization by Function

Based on the awesome-openclaw-skills curated list (27 categories) and official docs:

**Productivity & Tasks**
- Personal task management with standups/reviews
- Energy-optimized daily planning
- Todoist integration
- todo.txt management via topydo CLI
- Calendar scheduling

**Development & Coding**
- Gemini CLI integration (coding assistance + Google search)
- Summarize (content summarization via CLI)
- Skill creator (init_skill.py -- scaffolding for new skills)

**Communication**
- Voice call (Twilio integration -- plugin)
- Message sending across channels

**AI & LLMs**
- Peekaboo (image analysis)
- nano-banana-pro (Gemini image generation/editing)

**Search & Research**
- Web search integration skills
- Various search provider skills

**Browser & Automation**
- Browser automation skills (require browser tool)
- Chrome extension integration

**System & Administration**
- System monitoring
- File management

**Media**
- Image/media support
- Audio/voice notes
- Camera capture

**Source:** Context7 /openclaw/skills, /voltagent/awesome-moltbot-skills (Tier 1-2)

### Security Tiers for Skill Categories

| Security Tier | Categories | Why |
|---------------|-----------|-----|
| **SAFE** | Reactions, thinking levels, message formatting | No side effects, read-only or cosmetic |
| **LOW RISK** | Web search, content summarization, calendar reading | Read-only external access, limited attack surface |
| **MEDIUM RISK** | Task management, note-taking, email reading | Read/write to personal data, injection vector via content |
| **HIGH RISK** | File management, code execution, system commands | Direct system access, potential for damage |
| **CRITICAL RISK** | Browser automation, terminal/shell, vision/OCR | Full system or browser session access |

---

## Custom Skill Development

### How to Write Custom Skills

1. **Initialize the scaffold:**
```bash
scripts/init_skill.py my-skill --path skills/public --resources scripts,references --examples
```
Or manually create: `~/.openclaw/skills/my-skill/SKILL.md`

2. **Write the SKILL.md:**
```yaml
---
name: my-custom-skill
description: What this skill does for the agent
metadata: {"openclaw": {"os": ["darwin"], "requires": {"bins": ["curl"]}}}
---

# Instructions for the agent

When the user asks about [topic], do the following:
1. Use the exec tool to run: `curl -s https://api.example.com/data`
2. Parse the JSON response
3. Present the results in a formatted table

## Important
- Always confirm before making changes
- Never expose API keys in responses
```

3. **Place it in the right location:**
   - Personal: `~/.openclaw/skills/my-skill/`
   - Per-agent: `<workspace>/skills/my-skill/`
   - Shared pack: add to `skills.load.extraDirs`

4. **Enable in config if needed:**
```json
{
  "skills": {
    "entries": {
      "my-custom-skill": {
        "enabled": true,
        "env": { "MY_API_KEY": "..." }
      }
    }
  }
}
```

### Security Considerations for Custom Skills

- Custom skills are just Markdown instructions -- they guide the agent's tool usage
- The actual security boundary is the **tool policy** and **exec-approvals**, not the skill itself
- A malicious skill can instruct the agent to do anything the enabled tools allow
- Skills with `env` injection put secrets into the host process environment
- Sandboxed sessions do NOT inherit host `process.env` -- use `sandbox.docker.env` instead
- **Never install skills from untrusted sources without reading the full SKILL.md**

**Source:** docs.openclaw.ai/tools/skills, docs.openclaw.ai/tools/skills-config (Tier 1)

---

## MCP (Model Context Protocol) Integration

### How MCP Integrates with OpenClaw

As of February 2026, OpenClaw has added support for MCP Servers (Model Context Protocol). This enables:
- Unified access to multiple external tools and data sources
- Standard protocol for tool discovery and invocation
- Connection to the growing MCP ecosystem (hundreds of available servers)

MCP servers run as local processes or network services that expose tools via a standardized JSON-RPC protocol. OpenClaw connects to them and makes their tools available to the agent alongside built-in tools.

**Source:** eastondev.com (Tier 3), community reports (Tier 4)

### Security Implications of MCP

| Concern | Detail | Mitigation |
|---------|--------|------------|
| **Trust boundary** | MCP servers run with the gateway's permissions | Only run trusted MCP servers; review code |
| **Data exposure** | MCP servers can see all data passed through them | Use per-tool allow/deny lists |
| **Network access** | MCP servers may make external network calls | Restrict with `network.allowedDomains` |
| **Credential exposure** | MCP servers may require API keys | Store keys in dedicated env vars, not in config |
| **Supply chain** | MCP server packages can be compromised | Same vetting process as ClawHub skills |

### MCP and Our Deployment

MCP is strategically important because it is how we would connect external services (databases, APIs, custom tooling) without writing full OpenClaw plugins. It is also how the n8n integration could work in the future.

**Recommendation:** Enable MCP support, but vet each MCP server individually. Treat MCP servers with the same suspicion as ClawHub skills.

---

## Cron / Scheduled Tasks

### Two Scheduling Mechanisms

OpenClaw provides two complementary scheduling systems:

#### 1. Heartbeat (Periodic Awareness)

Runs in the **main session** at regular intervals (default: 30 min). The agent checks a `HEARTBEAT.md` checklist and handles all items in one batched turn.

**Configuration:**
```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "30m",
        "target": "last",
        "activeHours": { "start": "08:00", "end": "22:00" }
      }
    }
  }
}
```

**Best for:** Multiple periodic checks batched together (inbox, calendar, notifications), context-aware decisions, low-overhead monitoring.

**Cost:** One agent turn per interval. Keep HEARTBEAT.md small to minimize tokens.

#### 2. Cron (Precise Scheduling)

Runs at exact times via 5-field cron expressions with timezone support. Can run in isolated sessions.

**CLI:**
```bash
# Daily morning briefing at 7am
openclaw cron add \
  --name "Morning briefing" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate today's briefing: weather, calendar, top emails, news summary." \
  --model opus \
  --announce \
  --channel whatsapp \
  --to "+15551234567"

# One-shot reminder in 20 minutes
openclaw cron add \
  --name "Meeting reminder" \
  --at "20m" \
  --session main \
  --system-event "Reminder: standup meeting starts in 10 minutes." \
  --wake now \
  --delete-after-run
```

**Best for:** Exact timing, standalone tasks, different model/thinking per job, one-shot reminders.

**Source:** docs.openclaw.ai/automation/cron-vs-heartbeat, docs.openclaw.ai/automation/cron-jobs (Tier 1)

### Session Isolation for Cron

| Mode | Session | History | Context | Model |
|------|---------|---------|---------|-------|
| Heartbeat | Main | Shared | Full | Main session model |
| Cron (main) | Main (via system event) | Shared | Full | Main session model |
| Cron (isolated) | `cron:<jobId>` | Fresh each run | None | Can override |

**Recommendation:** Use isolated cron for tasks that do NOT need conversational context. Use heartbeat for batched monitoring.

### Security: Cron Tasks Without Human Approval

**This is a critical security concern.** Cron tasks run autonomously -- there is no human in the loop unless:
1. The task hits an exec-approvals gate
2. The task uses Lobster workflows with `approval: required` steps
3. The tool policy blocks the action

**Mitigations:**
- Use isolated sessions with limited tool access for cron jobs
- Use Lobster workflows for any cron task that has side effects
- Set `activeHours` on heartbeat to prevent 3am surprises
- Use cheaper models for routine cron tasks (cost savings + reduced capability = smaller blast radius)
- Monitor cron job logs: `~/.openclaw/agents/*/sessions/cron:*/`

**Source:** docs.openclaw.ai/automation/cron-vs-heartbeat (Tier 1)

### Lobster: Deterministic Workflows with Approvals

For cron tasks that need approval gates, combine cron with Lobster:

```bash
# Cron triggers Lobster workflow
openclaw cron add --name "Email triage" --cron "0 9 * * *" --session isolated \
  --message "Run the email triage Lobster workflow at /path/to/inbox-triage.lobster"
```

The Lobster workflow halts at `approval: required` steps and returns a `resumeToken`. The agent can announce the pending approval to your messaging channel.

---

## Channel Integrations

### Telegram (Most Popular, Recommended First Channel)

**Setup:** Requires a Telegram bot token from @BotFather.

**Configuration:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_TOKEN",
      "allowFrom": "123456789",
      "dmPolicy": "pairing",
      "groups": {
        "*": { "requireMention": true }
      }
    }
  }
}
```

**Agent tools available:**
- `telegram` tool with `sendMessage` action (to, content, mediaUrl, replyToMessageId)
- `telegram` tool with `react` action (chatId, messageId, emoji)
- `telegram` tool with `deleteMessage` action (chatId, messageId)

**Gating flags:**
- `channels.telegram.actions.reactions` (default: enabled)
- `channels.telegram.actions.sendMessage` (default: enabled)
- `channels.telegram.actions.deleteMessage` (default: enabled)
- `channels.telegram.actions.sticker` (default: disabled)

**Why Telegram first:**
1. Most popular in the community (confirmed across multiple sources)
2. Simple bot token setup (no business verification like WhatsApp)
3. Good API, reliable delivery
4. Works well on all devices including Mac Mini headless

**Security:** Set `dmPolicy: "pairing"` to require explicit pairing. Set `allowFrom` with your Telegram user ID to restrict access. In groups, `requireMention: true` prevents the bot from responding to every message.

**Source:** docs.openclaw.ai/channels/telegram (Tier 1), community consensus (Tier 4)

### WhatsApp

**Setup:** Uses the WhatsApp Web multi-device protocol. Requires QR code scanning.

**Configuration:**
```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "groups": {
        "*": { "requireMention": true }
      }
    }
  }
}
```

**Community experience:** Works but occasionally requires re-scanning QR code. Meta can ban unofficial API usage. More fragile than Telegram.

**Source:** docs.openclaw.ai/channels, community reports (Tier 4)

### Discord

**Setup:** Requires a Discord bot token and app setup in Discord Developer Portal.

**Community experience:** Works well for team/community use. Bot slash commands integrate naturally.

### Slack

**Setup:** Requires Slack app setup with proper OAuth scopes.

**Community experience:** Enterprise-friendly but complex setup. Good for professional use cases.

### Multi-Agent Channel Routing

OpenClaw supports routing different channels to different agents:
```json
{
  "agents": {
    "list": [
      { "id": "chat", "name": "Everyday", "model": "anthropic/claude-sonnet-4-5" },
      { "id": "opus", "name": "Deep Work", "model": "anthropic/claude-opus-4-5" }
    ]
  },
  "bindings": [
    { "agentId": "chat", "match": { "channel": "whatsapp" } },
    { "agentId": "opus", "match": { "channel": "telegram" } }
  ]
}
```

This is strategically valuable: use a cheaper model for casual WhatsApp chats and Opus for focused Telegram work.

**Source:** docs.openclaw.ai/concepts/multi-agent (Tier 1)

### Channel-Specific Security Considerations

| Channel | Key Risk | Mitigation |
|---------|----------|------------|
| Telegram | Public groups can send messages | `dmPolicy: "pairing"` + `allowFrom` |
| WhatsApp | QR code = physical access needed | Session backup, re-pair procedures |
| Discord | Bot can be invited to any server | Restrict guild IDs in config |
| Slack | OAuth scopes determine capabilities | Minimize scopes, review workspace access |
| All | Prompt injection via incoming messages | Reader agent pattern for untrusted content |

---

## n8n Integration Potential

### How OpenClaw and n8n Can Work Together

OpenClaw's webhook system provides the bridge. n8n can trigger OpenClaw agent runs via HTTP webhooks, and OpenClaw can call n8n workflows via web_fetch or exec.

### Webhook API (The Integration Point)

OpenClaw exposes webhook endpoints when enabled:

**Configuration:**
```json
{
  "hooks": {
    "enabled": true,
    "token": "shared-secret-for-n8n",
    "path": "/hooks",
    "allowedAgentIds": ["hooks", "main"]
  }
}
```

**Endpoints:**

1. `POST /hooks/wake` -- Wake the agent with a system event
```bash
curl -X POST http://127.0.0.1:18789/hooks/wake \
  -H 'Authorization: Bearer SECRET' \
  -d '{"text":"New email received","mode":"now"}'
```

2. `POST /hooks/agent` -- Run an isolated agent turn
```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H 'Authorization: Bearer SECRET' \
  -d '{"message":"Summarize inbox","name":"Email","sessionKey":"hook:email","deliver":true,"channel":"telegram"}'
```

3. `POST /hooks/<name>` -- Custom mapped hooks with templates/transforms

**Source:** docs.openclaw.ai/automation/webhook (Tier 1)

### n8n Integration Patterns

| Pattern | How | Use Case |
|---------|-----|----------|
| **n8n triggers OpenClaw** | n8n HTTP Request node -> OpenClaw webhook | New email arrives -> n8n processes -> triggers OpenClaw to draft reply |
| **OpenClaw triggers n8n** | exec tool calls `curl` to n8n webhook | Agent decides to start a workflow -> calls n8n webhook endpoint |
| **Shared webhooks** | Both listen on same events, different handlers | GitHub webhook -> n8n for CI/CD, OpenClaw for code review |
| **n8n as tool** | Custom MCP server or skill wraps n8n API | Agent directly invokes n8n workflows as tools |

### The OpenClaw + n8n Stack Value

From Phase 1 competitive research: n8n fills the 1,200+ integration gap that OpenClaw lacks. The recommended stack is:
- **OpenClaw** = intelligent agent (reasoning, tool use, conversation)
- **n8n** = deterministic workflows (integrations, data pipelines, compliance-critical flows)
- **Langfuse** = observability (optional, for monitoring)

n8n handles the "boring but critical" workflows (data sync, notifications, scheduled reports) while OpenClaw handles the "intelligent but risky" work (analysis, drafting, decision support).

**Security:** The webhook token is a shared secret. Use a dedicated token for n8n (not the gateway auth token). Keep webhook endpoints behind loopback/Tailscale. Set `allowedAgentIds` to restrict which agents n8n can target.

**Source:** docs.openclaw.ai/automation/webhook (Tier 1), Phase 1 landscape analysis (Tier 2-3)

---

## Plugins (Extensions)

### What Plugins Are

Plugins are TypeScript modules that extend OpenClaw with:
- Gateway RPC methods and HTTP handlers
- Agent tools (exposed to the model)
- CLI commands
- Background services
- Skills (via skills directories in manifest)
- Auto-reply commands (bypass AI, execute directly)
- Messaging channels

Plugins run **in-process** with the Gateway -- treat them as trusted code.

### Official Plugins

| Plugin | Install | Function |
|--------|---------|----------|
| Voice Call | `@openclaw/voice-call` | Twilio voice calls |
| Zalo Personal | `@openclaw/zalouser` | Zalo messaging |
| Matrix | `@openclaw/matrix` | Matrix protocol |
| Nostr | `@openclaw/nostr` | Nostr protocol |
| Microsoft Teams | `@openclaw/msteams` | MS Teams (plugin-only since 2026.1.15) |
| Memory (Core) | bundled | Memory search (default) |
| Memory (LanceDB) | bundled | Long-term memory with auto-recall |
| Google OAuth | bundled (disabled) | Google auth for Gemini/etc. |

### Plugin Security

- Plugins run in-process -- full gateway access
- Only install plugins you trust
- Use `plugins.allow` allowlists
- Plugin commands execute before built-in commands and the AI agent
- Plugin skills follow normal skill precedence rules

**Source:** docs.openclaw.ai/tools/plugin (Tier 1)

---

## ClawHub Assessment

### Current State of the Marketplace

ClawHub (clawhub.com) is the public skills registry. As of February 2026:
- **2,857+ skills audited** by Koi Security
- **341 confirmed malicious** (12% of audited)
- Attack techniques: ClickFix lures, typosquatting, reputation washing, base64-encoded commands, `curl | bash` patterns, `xattr -d com.apple.quarantine` (Gatekeeper bypass)
- Academic research: 26% of agent skills across LLM ecosystem contain at least one vulnerability

**Source:** Koi Security ClawHavoc report (Tier 2), arXiv:2601.10338 (Tier 2)

### Why We Recommend Zero ClawHub Skills

1. **12% confirmed malicious rate** -- unacceptable risk for personal deployment
2. **No code review before publication** -- anyone can publish
3. **Typosquatting and reputation washing** -- even careful selection can be fooled
4. **Skills run with agent permissions** -- a malicious skill has whatever tool access the agent has
5. **The awesome-openclaw-skills curated list** exists but does not guarantee safety

### Vetting Process If We Ever Want to Evaluate a ClawHub Skill

If a specific ClawHub skill becomes essential:

1. **Read the full SKILL.md** -- every line of instructions
2. **Check for red flags** (from Semgrep, Tier 2):
   - "Prerequisites" requiring external downloads
   - Base64-encoded commands
   - `curl | bash` patterns
   - Password-protected archives
   - References to `xattr -d com.apple.quarantine`
   - Auto-update behavior
   - Unprintable or zero-width Unicode characters
3. **Run Cisco skill scanner:**
```bash
pip install cisco-ai-skill-scanner
skill-scanner scan ./skill-directory
```
4. **Check the author** -- GitHub profile, other packages, reputation
5. **Test in a sandboxed environment** before deploying to production
6. **Monitor the first 24 hours** -- watch logs for unexpected tool calls

---

## Configuration Reference

### Where Skill Configs Live

- **Main config:** `~/.openclaw/openclaw.json` under `skills` key
- **Exec approvals:** `~/.openclaw/exec-approvals.json`
- **Tool policy:** `~/.openclaw/openclaw.json` under `tools.allow`/`tools.deny`
- **Per-agent tools:** `~/.openclaw/openclaw.json` under `agents.list[].tools`

### How to Enable/Disable Skills

```json
{
  "skills": {
    "allowBundled": ["gemini", "peekaboo"],
    "load": {
      "extraDirs": ["~/my-skills"],
      "watch": true,
      "watchDebounceMs": 250
    },
    "install": {
      "preferBrew": true,
      "nodeManager": "npm"
    },
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": { "GEMINI_API_KEY": "GEMINI_KEY_HERE" }
      },
      "dangerous-skill": { "enabled": false }
    }
  }
}
```

- `allowBundled` -- optional allowlist for bundled skills only
- `entries.<key>.enabled: false` -- disable a skill even if bundled
- `entries.<key>.env` -- inject environment variables (host only, not sandbox)
- `entries.<key>.apiKey` -- convenience for skills declaring `primaryEnv`
- `load.watch: true` -- auto-refresh when SKILL.md files change

### How to Enable/Disable Tools

```json
{
  "tools": {
    "allow": ["exec", "read", "write", "edit", "apply_patch", "web_search", "web_fetch"],
    "deny": ["browser", "canvas"],
    "alsoAllow": ["lobster"]
  }
}
```

Or per-agent:
```json
{
  "agents": {
    "list": [
      {
        "id": "work",
        "tools": {
          "allow": ["read", "write", "apply_patch", "exec"],
          "deny": ["browser", "gateway", "discord"]
        }
      }
    ]
  }
}
```

Tool groups available: `group:web` (web_search + web_fetch), etc.

### exec-approvals.json Detailed Reference

Located at `~/.openclaw/exec-approvals.json` with permissions `600`.

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
        { "pattern": "/usr/bin/curl" }
      ],
      "denylist": [
        { "pattern": "/usr/bin/security" },
        { "pattern": "xattr" },
        { "pattern": "rm -rf" },
        { "pattern": "sudo" }
      ]
    }
  }
}
```

**Key behaviors:**
- `security: "deny"` -- block all exec by default
- `security: "allowlist"` -- only allow explicitly listed binaries
- `security: "full"` -- allow everything (DANGEROUS)
- `ask: "on-miss"` -- prompt user when command is not in allowlist
- `ask: "off"` -- no prompts (auto-deny or auto-allow based on security mode)
- `ask: "always"` -- prompt for every command
- Allowlist matches **resolved binary paths only** (no basename matches)
- Chaining (`;`, `&&`, `||`) and redirections are rejected in allowlist mode
- Host execution rejects `env.PATH` and loader overrides (`LD_*`/`DYLD_*`)

**Source:** docs.openclaw.ai/tools/exec, docs.openclaw.ai/tools/exec-approvals (Tier 1)

---

## Automation Infrastructure Summary

| Mechanism | When to Use | Delivery | Cost |
|-----------|-------------|----------|------|
| **Heartbeat** | Batched periodic checks (inbox, calendar) | Main session | 1 turn per interval |
| **Cron (main)** | Events for main session context | Via heartbeat | Added to next heartbeat |
| **Cron (isolated)** | Precise timing, standalone tasks | Direct announce | Full agent turn per job |
| **Lobster** | Multi-step workflows with approvals | Tool output | 1 tool call |
| **Webhooks** | External triggers (n8n, services) | Configurable | 1 agent turn per hook |
| **Hooks** | Event-driven automation | System events | Varies |
| **Gmail PubSub** | Email-triggered actions | Via webhook mapping | 1 turn per notification |
| **Polls** | Periodic data fetching | Via system events | Varies |

**Source:** docs.openclaw.ai/automation/* (Tier 1)

---

## Source Index

| Source | URL | Tier | Key Finding |
|--------|-----|------|-------------|
| OpenClaw Skills Docs | docs.openclaw.ai/tools/skills | 1 | Full skill system architecture, format, gating |
| OpenClaw Skills Config | docs.openclaw.ai/tools/skills-config | 1 | Configuration reference, env injection |
| OpenClaw Exec Tool | docs.openclaw.ai/tools/exec | 1 | Exec tool parameters, authorization model |
| OpenClaw Web Tools | docs.openclaw.ai/tools/web | 1 | web_search and web_fetch configuration |
| OpenClaw Lobster | docs.openclaw.ai/tools/lobster | 1 | Workflow runtime, approval gates |
| OpenClaw Cron vs Heartbeat | docs.openclaw.ai/automation/cron-vs-heartbeat | 1 | Complete scheduling guide |
| OpenClaw Webhooks | docs.openclaw.ai/automation/webhook | 1 | Webhook API, n8n integration point |
| OpenClaw Plugins | docs.openclaw.ai/tools/plugin | 1 | Plugin system, extensions architecture |
| OpenClaw Telegram | docs.openclaw.ai/channels/telegram | 1 | Telegram channel tools and config |
| OpenClaw Configuration | docs.openclaw.ai/gateway/configuration | 1 | Skills configuration schema |
| Awesome OpenClaw Skills | github.com/VoltAgent/awesome-openclaw-skills | 2 | 700+ curated skills, 27 categories |
| yu-wenhao.com | yu-wenhao.com/blog/openclaw-tools-skills-tutorial | 3 | Tools vs skills tutorial |
| eastondev.com | eastondev.com/blog/openclaw-config-guide | 3 | MCP server integration note |
| Koi Security | koi.ai/blog/clawhavoc | 2 | 341 malicious skills, ClawHub ecosystem |
| Semgrep | semgrep.dev/blog/2026/openclaw-security-engineers-cheat-sheet | 2 | Skill red flags, supply chain analysis |
| Cisco | blogs.cisco.com/ai/personal-ai-agents-like-openclaw | 2 | Skill scanner tool |
