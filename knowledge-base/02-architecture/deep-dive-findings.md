# OpenClaw Architecture Deep-Dive

**Research Date:** 2026-02-11
**Sources:** Context7 (official docs, 4 library IDs queried) + Bright Data (8 search queries, 2 full article scrapes)
**Credibility Range:** Tiers 1-4
**Builds On:** Phase 1 architecture reference (`02-architecture/openclaw-official-docs.md`)

---

## What This Document Adds

Phase 1 gave us the skeleton: Gateway + Nodes + Agents + Sub-agents, launchd on macOS, security hooks exist, per-agent sandboxing. This deep-dive fills the muscle:

1. **The three-layer internal architecture** (Gateway, Channel, LLM) and how they interact -- not documented in official docs, sourced from a detailed source-code walkthrough
2. **Exact message routing precedence** -- deterministic match order now fully documented
3. **Data residency answer** -- what stays local vs what goes to providers, with clear boundaries
4. **Model routing and fallback** -- primary/fallback chain with hybrid local+cloud configurations
5. **Session management internals** -- lifecycle, scoping, reset policies, state ownership
6. **Sub-agent lifecycle** -- spawning, concurrency limits, auto-archive, context limitations
7. **Gateway API surface** -- webhooks, browser control API, cron scheduler
8. **Elevated mode** -- exactly what it is, how it works, per-channel allowlists
9. **Configuration precedence** -- agent-specific overrides global defaults, fully documented
10. **Provider plugin system** -- 2026 refactoring from hard-coded to pluggable

---

## Three-Layer Internal Architecture

**Source:** eastondev.com architecture deep-dive (Tier 3 -- source code analysis by developer), cross-validated against Context7 official docs (Tier 1)

Phase 1 described the architecture as "Gateway + Nodes + Agents + Sub-agents." The deeper reality is a **three-layer design**:

### Layer 1: Gateway (Session Management Hub)
- Manages complete lifecycle of user sessions
- Message queuing and scheduling with concurrency control
- Authentication and permission control
- WebSocket persistent connection maintenance with heartbeat detection (30-second ping intervals)
- Auto-reconnect with exponential backoff (1s, 2s, 4s... max 30s)
- State sync after reconnection

### Layer 2: Channel (Platform Adapter)
- Adapter pattern: each platform (WhatsApp, Telegram, Discord, etc.) implements a standardized `Channel` interface
- Converts platform-specific message formats into a unified `StandardMessage` format
- Handles routing rules: dmPolicy, mentionGating, allowlists
- Platform SDK initialization and lifecycle management

### Layer 3: LLM (Pluggable Model Interface)
- **2026 refactoring**: transformed from hard-coded `if/else` provider selection to a **Provider plugin system**
- All providers implement a unified `LLMProvider` interface with methods: `chat()`, `supportTools()`, `initialize()`
- Auto-discovery and registration at startup via `ProviderRegistry`
- Tool Use mechanism: AI returns tool call requests, OpenClaw executes tools in sandbox, returns results to AI
- Streaming response processing with provider-specific delta handling

### How They Interact
```
User sends message (WhatsApp/Telegram/etc.)
  |
  v
Channel Layer: Receives webhook/WebSocket event
  |-- Converts to StandardMessage (userId, content, timestamp, metadata)
  |-- Checks routing rules (dmPolicy, mentionGating, allowlists)
  |-- If shouldRespond() = false, message is silently dropped
  |
  v
Gateway Layer: Finds or creates Session for this user+channel
  |-- Adds message to processing queue
  |-- Concurrency control (maxConcurrency limit)
  |-- Persists session state to disk
  |-- Error retry with exponential backoff (max 3 retries)
  |
  v
LLM Layer: Selects Provider based on config
  |-- Sends conversation context to LLM API
  |-- Processes streaming response
  |-- If tool calls returned: executes tools, sends results back to LLM
  |-- Returns final response
  |
  v
Gateway Layer: Updates session history
  |
  v
Channel Layer: Sends response back to platform
```

**Implication for Mac Mini:** The three-layer separation means the Gateway is the performance-critical component. Channel adapters are lightweight (just format conversion). LLM calls go to cloud APIs (not local compute unless using local models). The Mac Mini's main job is session management and message orchestration -- confirming 16GB is more than sufficient.

Source: eastondev.com (Tier 3), docs.openclaw.ai (Tier 1)

---

## Message Routing & Orchestration

**Source:** Context7 official docs -- docs.openclaw.ai/concepts/multi-agent (Tier 1)

### Binding System

Messages are routed to agents via `bindings[]` in the main config. Each binding defines match criteria and a target `agentId`.

```json5
{
  bindings: [
    // Most specific: route a specific WhatsApp peer to the "opus" agent
    { agentId: "opus", match: { channel: "whatsapp", peer: { kind: "dm", id: "+15551234567" } } },
    // Less specific: route all WhatsApp to "chat" agent
    { agentId: "chat", match: { channel: "whatsapp" } },
    // Discord guild-specific routing
    { agentId: "agent2", match: { channel: "discord", guildId: "GUILD_ID", peer: { kind: "channel", id: "help" } } },
    // Wildcard: all Slack to agent1
    { agentId: "agent1", match: { channel: "slack", accountId: "*" } }
  ]
}
```

### Deterministic Match Order (Most Specific Wins)

The routing is **deterministic** with a fixed precedence:

```
1. peer match (exact DM/group/channel id)         <- most specific
2. guildId (Discord-specific)
3. teamId (Slack-specific)
4. accountId match for a channel
5. channel-level match (accountId: "*")
6. fallback to default agent                       <- least specific
   (agents.list[].default: true, else first in list, default: "main")
```

**Key insight:** The first matching entry in `bindings` wins. Peer bindings take precedence over channel-wide rules. This is NOT round-robin or load-balanced -- it's strict precedence matching.

### Multi-Agent Isolation

Each agent in `agents.list[]` gets:
- Its own workspace directory
- Its own session store
- Its own sandbox configuration
- Its own tool permissions
- Its own model configuration (can override defaults)
- Its own auth profiles (merged with main as fallback)

**Practical pattern for our deployment:**
```json5
{
  agents: {
    list: [
      { id: "chat", name: "Everyday", model: "anthropic/claude-sonnet-4-5",
        sandbox: { mode: "all" } },
      { id: "opus", name: "Deep Work", model: "anthropic/claude-opus-4-5",
        sandbox: { mode: "off" } }  // trust Opus for deep work
    ]
  },
  bindings: [
    // Route specific trusted peer to Opus for complex tasks
    { agentId: "opus", match: { channel: "whatsapp", peer: { kind: "dm", id: "+1SEANPHONE" } } },
    // Everything else gets Sonnet (cheaper)
    { agentId: "chat", match: { channel: "whatsapp" } }
  ]
}
```

This implements the community-recommended "mix expensive and cheap models" pattern with architectural backing.

Source: docs.openclaw.ai/concepts/multi-agent (Tier 1), docs.openclaw.ai/gateway/configuration (Tier 1)

---

## Data Flow & Residency

**CRITICAL FINDING -- Directly answers the Phase 1 gap**

**Source:** Context7 -- docs.openclaw.ai FAQ + security docs (Tier 1)

### What Stays Local

OpenClaw's state is **local by default**. The following reside on the Gateway host within `~/.openclaw/`:
- **Session transcripts**: `~/.openclaw/agents/<agentId>/sessions/*.jsonl`
- **Session metadata/store**: `~/.openclaw/agents/<agentId>/sessions/sessions.json`
- **Memory files**: Agent workspace memory
- **Configuration**: `~/.openclaw/openclaw.json`
- **Credentials**: `~/.openclaw/credentials/`, `auth-profiles.json`
- **Cron jobs**: `~/.openclaw/cron/`
- **Skills**: `~/.openclaw/skills/`

### What Goes to External Services

| Data | Destination | Why |
|------|------------|-----|
| **Conversation context** (system prompt + message history + tool outputs) | LLM provider (Anthropic, OpenAI, etc.) | This IS the LLM call -- the entire conversation window is sent on each request |
| **Tool call results** | LLM provider | When the agent executes a tool, the output goes back to the LLM for processing |
| **Messages** | Channel platforms (WhatsApp, Telegram, Slack) | Messages transit through platform servers |
| **Embeddings** (if using cloud provider) | Embedding API provider | For semantic memory search; BUT local embeddings are available (see below) |

### Local Embeddings Option

OpenClaw supports **local embeddings** for memory search, keeping embedding creation entirely on-device:

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "local",
        local: { modelPath: "path/to/your/model.gguf" },
        fallback: "none"
      }
    }
  }
}
```

This means semantic memory can be created WITHOUT sending data to cloud APIs. The GGUF model runs locally on the Mac Mini's M4 chip.

### Session Memory Search (Experimental)

Sessions can be indexed for memory search:

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        experimental: { sessionMemory: true },
        sources: ["memory", "sessions"]
      }
    }
  }
}
```

### Privacy Implications for Sean

1. **Every message Sean sends to the bot goes to the LLM provider** (Anthropic) as part of the conversation context. This includes the full conversation history within the session window.
2. **Tool outputs** (file contents read, command outputs, etc.) are sent to the LLM provider for processing.
3. **Session transcripts stay local** on the Mac Mini -- the LLM provider does NOT store them (subject to their data retention policies).
4. **Using local embeddings** keeps memory search entirely on-device.
5. **Channel traffic** (WhatsApp, Telegram) goes through those platforms' servers -- end-to-end encryption depends on the channel.

**Recommendation:** Use Anthropic's API (which has a zero data retention policy for API usage) as primary provider. Configure local embeddings for memory search. Be aware that anything the agent reads or processes becomes part of the LLM context.

Source: docs.openclaw.ai FAQ (Tier 1), docs.openclaw.ai/concepts/memory (Tier 1), docs.openclaw.ai/gateway/security (Tier 1)

---

## Multi-Model Architecture

**Source:** Context7 official docs (Tier 1), eastondev.com (Tier 3)

### How Model Selection Works

OpenClaw uses a **primary + fallback chain** model, NOT automatic task-based routing. The system does NOT automatically decide which model to use based on task complexity -- this was a Phase 1 open question now resolved.

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: ["lmstudio/minimax-m2.1-gs32", "anthropic/claude-opus-4-5"]
      }
    }
  }
}
```

**Behavior:** If the primary model is unavailable (API error, rate limit), OpenClaw falls through the fallback list in order. This is automatic failover, NOT intelligent routing.

### Per-Agent Model Override

Different agents can use different models:

```json5
{
  agents: {
    list: [
      { id: "chat", model: "anthropic/claude-sonnet-4-5" },     // cheap for everyday
      { id: "opus", model: "anthropic/claude-opus-4-5" }         // expensive for deep work
    ]
  }
}
```

### Hybrid Local + Cloud Configuration

Combine cloud and local models with custom provider definitions:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: ["lmstudio/minimax-m2.1-gs32"]
      }
    }
  },
  models: {
    mode: "merge",
    providers: {
      lmstudio: {
        baseUrl: "http://127.0.0.1:1234/v1",
        apiKey: "lmstudio",
        api: "openai-responses",
        models: [{
          id: "minimax-m2.1-gs32",
          name: "MiniMax M2.1 GS32",
          reasoning: false,
          input: ["text"],
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          contextWindow: 196608,
          maxTokens: 8192
        }]
      }
    }
  }
}
```

### Manual Model Switching

Users can switch models mid-conversation with the `/model` command. Aliases make this convenient:

```json5
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-5": { alias: "opus" },
        "anthropic/claude-sonnet-4-5": { alias: "sonnet" }
      }
    }
  }
}
```

Then in chat: `/model opus` switches to the expensive model.

### Image Model Configuration

Separate configuration for image processing:

```json5
{
  imageModel: {
    primary: "openrouter/qwen/qwen-2.5-vl-72b-instruct:free"
  }
}
```

**Key discovery:** The community's "mix expensive and cheap models" pattern is NOT automatic routing. It's implemented through either (a) per-agent model assignment with routing rules, or (b) manual `/model` switching. There is no intelligence-based model selection.

Source: docs.openclaw.ai/gateway/configuration (Tier 1), docs.openclaw.ai/gateway/local-models (Tier 1), eastondev.com (Tier 3)

---

## Session & Memory Architecture

**Source:** Context7 -- docs.openclaw.ai/concepts/session (Tier 1)

### Session Ownership

**All session state is owned by the Gateway** (the "master" OpenClaw). UI clients (macOS app, WebChat, etc.) must query the gateway for session lists and token counts instead of reading local files. In remote mode, the session store lives on the remote gateway host, not the local Mac.

### Where State Lives on Disk

- **Store file**: `~/.openclaw/agents/<agentId>/sessions/sessions.json` (per agent)
- **Transcripts**: `~/.openclaw/agents/<agentId>/sessions/*.jsonl` (one file per session)
- Token counts tracked in store: `inputTokens`, `outputTokens`, `totalTokens`, `contextTokens`

### Session Scoping (dmScope)

Controls how direct messages are grouped:

| Mode | Behavior |
|------|----------|
| `main` (default) | All DMs share the main session for continuity |
| `per-peer` | Isolate by sender ID across channels |
| `per-channel-peer` | Isolate by channel + sender (recommended for multi-user inboxes) |
| `per-account-channel-peer` | Isolate by account + channel + sender (for multi-account inboxes) |

### Identity Links (Cross-Channel Identity)

Map provider-prefixed peer IDs to a canonical identity so the same person shares a DM session across channels:

```json5
{
  session: {
    identityLinks: {
      alice: ["telegram:123456789", "discord:987654321012345678"]
    }
  }
}
```

### Session Reset Policies

Configurable per-type and per-channel:

```json5
{
  session: {
    reset: {
      mode: "daily",
      atHour: 4,           // Gateway host local time
      idleMinutes: 120     // If also set, whichever expires first wins
    },
    resetByType: {
      thread: { mode: "daily", atHour: 4 },
      dm: { mode: "idle", idleMinutes: 240 },
      group: { mode: "idle", idleMinutes: 120 }
    },
    resetByChannel: {
      discord: { mode: "idle", idleMinutes: 10080 }  // 1 week for Discord
    },
    resetTriggers: ["/new", "/reset"]
  }
}
```

### Session Key Format

- Main session: `agent:<agentId>:<mainKey>` (default mainKey is "main")
- Group/channel: Separate keys per group
- Sub-agent: `agent:<agentId>:subagent:<uuid>`
- Cron job (isolated): `cron:<jobId>`

### Memory Architecture

Two sources for memory search:
1. **Memory files** -- persistent knowledge stored in agent workspace
2. **Session transcripts** (experimental) -- indexed session history

Vector search uses embeddings that can be either cloud-based (LLM provider API) or **local** (GGUF model on device).

Source: docs.openclaw.ai/concepts/session (Tier 1), docs.openclaw.ai/concepts/memory (Tier 1)

---

## Sub-Agent System

**Source:** Context7 -- docs.openclaw.ai/tools/subagents (Tier 1)

### How Sub-Agents Work

Sub-agents are background agent processes spawned from an existing agent run. They run in the same Gateway process.

**Spawning:**
```
POST /sessions/spawn
Parameters:
  - task (string, required): What the sub-agent should do
  - label (string, optional): Label for the run
  - agentId (string, optional): Which agent to spawn under
  - model (string, optional): Override the model
  - thinking (string, optional): Override thinking level
  - runTimeoutSeconds (integer, optional): Abort after N seconds (default: 0 = no timeout)
  - cleanup (string, optional): "delete" or "keep" (default: "keep")
```

**Response:**
```json
{
  "status": "accepted",
  "runId": "run_12345abc",
  "childSessionKey": "agent:agent_xyz:subagent:uuid_abcdef"
}
```

### Concurrency

- Sub-agents use a dedicated in-process queue lane: `subagent`
- Default concurrency limit: `agents.defaults.subagents.maxConcurrent` = **8**
- This is a safety valve -- all sub-agents share the same Gateway process resources

### Lifecycle

1. **Spawn**: `sessions_spawn` returns immediately (always non-blocking) with `{ status: "accepted", runId, childSessionKey }`
2. **Execute**: Sub-agent performs its task independently
3. **Announce**: On completion, posts results back to the requester's chat channel (best-effort)
4. **Auto-archive**: After `archiveAfterMinutes` (default: 60 minutes), session is archived
5. **Archive = rename**: Transcript is renamed to `*.deleted.<timestamp>` in the same folder (not actually deleted)

### Management Commands

```
/subagents list              -- List active sub-agents
/subagents stop <id|#|all>   -- Stop specific or all sub-agents
/subagents log <id|#> [limit] [tools]  -- View sub-agent transcript
/subagents info <id|#>       -- Detailed metadata
/subagents send <id|#> <message>       -- Send message to running sub-agent
```

### Context Limitations

**Important:** Sub-agent context only injects `AGENTS.md` and `TOOLS.md`. It does NOT include:
- `SOUL.md`
- `IDENTITY.md`
- `USER.md`
- `HEARTBEAT.md`
- `BOOTSTRAP.md`

This means sub-agents have a **limited personality/identity context** compared to the main agent.

### Authentication

- Sub-agent auth is resolved by agent ID, not session type
- Auth store loaded from that agent's `agentDir`
- Main agent's auth profiles are merged as fallback
- The merge is additive -- main profiles always available as fallbacks
- Fully isolated auth per agent is NOT supported yet

### Stopping

Sending `/stop` in the requester chat aborts the requester session AND stops any active sub-agent runs spawned from it.

### Resource Implications for M4 Mac Mini

- 8 concurrent sub-agents max by default (configurable)
- All share the Gateway process memory -- this is NOT container isolation
- Each sub-agent makes its own LLM API calls
- Sub-agents do NOT run local compute -- they call cloud APIs
- The Mac Mini bottleneck is not CPU/RAM but API rate limits
- Consider reducing `maxConcurrent` to 4 if running other services on the Mac Mini

Source: docs.openclaw.ai/tools/subagents (Tier 1)

---

## Gateway API Surface

**Source:** Context7 official docs (Tier 1)

### WebSocket API (Primary)

The Gateway primarily communicates via WebSocket on port 18789. This is the main interface for:
- TUI connections
- macOS app connections
- Remote client connections
- The CVE-2026-25253 attack exploited the lack of WebSocket origin header validation

### HTTP Webhook Endpoint

The Gateway exposes an HTTP webhook endpoint for external service integration:

```json5
{
  hooks: {
    enabled: true,
    token: "shared-secret",
    path: "/hooks",
    maxBodyBytes: 262144,  // 256 KB
    presets: ["gmail"],
    transformsDir: "~/.openclaw/hooks",
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        wakeMode: "now",
        name: "Gmail",
        sessionKey: "hook:gmail:{{messages[0].id}}",
        messageTemplate: "From: {{messages[0].from}}\nSubject: {{messages[0].subject}}\n{{messages[0].snippet}}",
        deliver: true,
        channel: "last",
        model: "openai/gpt-5.2-mini"
      }
    ]
  }
}
```

**Key capabilities:**
- Pattern-based matching on incoming webhook paths
- Template-based message formatting (Mustache-style `{{}}`)
- Per-mapping model override (use cheap models for webhook processing)
- Wake modes: `"now"` (immediate) or `"next-heartbeat"` (deferred)
- Delivery to specific channels

### Wake Endpoint

```
POST /hooks/wake
Body: { "text": "Process this data now", "mode": "now" }
```

Triggers an immediate agent action or defers to next heartbeat.

### Browser Control API

When browser control is enabled, the Gateway exposes a full HTTP REST API for browser automation:

| Category | Endpoints |
|----------|----------|
| **Control** | `GET /` (status), `POST /start`, `POST /stop` |
| **Tabs** | `GET /tabs`, `POST /tabs/open`, `POST /tabs/focus`, `DELETE /tabs/:targetId` |
| **Capture** | `GET /snapshot`, `POST /screenshot`, `POST /pdf` |
| **Actions** | `POST /navigate`, `POST /act`, `POST /highlight` |
| **Hooks** | `POST /hooks/file-chooser`, `POST /hooks/dialog` |
| **Downloads** | `POST /download`, `POST /wait/download` |
| **Debug** | `GET /console`, `GET /errors`, `GET /requests`, `POST /trace/start`, `POST /trace/stop` |
| **State** | `GET /cookies`, `POST /cookies/set`, `POST /cookies/clear`, `GET /storage/:kind`, `POST /storage/:kind/set` |
| **Settings** | `POST /set/offline`, `POST /set/headers`, `POST /set/credentials`, `POST /set/geolocation`, `POST /set/media`, `POST /set/timezone`, `POST /set/locale`, `POST /set/device` |

All endpoints accept optional `?profile=<name>` query parameter. Endpoints requiring Playwright return 501 if Playwright is not installed.

### Cron Job API

```
POST /cron/add
Parameters:
  - name (string, required)
  - at (string): one-shot time ("2026-01-12T18:00:00Z" or "20m")
  - cron (string): recurring schedule ("0 7 * * *")
  - tz (string): timezone
  - session (string, required): "main" or "isolated"
  - wake (string): "now" or "next-heartbeat"
  - deliver (boolean): send output to channel
  - channel (string): delivery channel
  - model (string): override model for this job
  - agent (string): pin to specific agent
```

Cron jobs persist under `~/.openclaw/cron/` -- survives gateway restarts.

Two execution styles:
1. **Main session**: Enqueue a system event, run on next heartbeat
2. **Isolated**: Full agent turn in `cron:<jobId>` session -- can use a cheaper model

### Implications for n8n Integration

The webhook endpoint is the primary integration point for n8n:
- n8n can POST to `/hooks/<path>` with the shared token
- Template-based message formatting enables structured data passing
- Per-webhook model selection means n8n-triggered tasks can use cheap models
- Wake modes allow n8n to trigger immediate or deferred processing
- This is a clean integration path -- no custom code needed

Source: docs.openclaw.ai/gateway/configuration (Tier 1), docs.openclaw.ai/automation/cron-jobs (Tier 1)

---

## Elevated Mode

**Source:** Context7 -- docs.openclaw.ai/gateway/sandboxing, docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated (Tier 1)

### What It Is

OpenClaw has **three related but different controls**:

1. **Sandbox** (`agents.defaults.sandbox.*`): Decides **where** tools run (Docker vs host)
2. **Tool policy** (`tools.*`): Decides **which** tools are available/allowed
3. **Elevated** (`tools.elevated.*`): An **exec-only escape hatch** to run on the host when sandboxed

Elevated mode is specifically designed for when you have sandboxing enabled but need certain trusted users to execute commands directly on the host (bypassing the Docker sandbox).

### Configuration

```json5
{
  tools: {
    elevated: {
      enabled: true,
      allowFrom: {
        whatsapp: ["+15555550123"],        // E.164 numbers
        telegram: ["chat_ids_or_usernames"],
        discord: ["steipete", "1234567890123"],
        signal: ["E.164 numbers"],
        imessage: ["handles/chat_ids"],
        webchat: ["session_ids_or_usernames"]
      }
    }
  }
}
```

### How It Works

- When `elevated.enabled: true`, authorized senders (per the `allowFrom` lists) can execute `exec` commands directly on the host, even when sandbox mode is enabled
- The `/exec` directive is session-persistent and only applies for authorized senders
- Tool allow/deny policies still apply BEFORE sandbox rules -- if a tool is denied globally or per-agent, sandboxing doesn't bring it back
- This is a per-agent configurable setting -- `agents.list[].tools.elevated.*` can restrict it further

### Why It's Dangerous

1. Elevated mode bypasses the entire sandboxing layer -- the primary security boundary
2. Once enabled, an authorized sender (or anyone who compromises that sender's channel) has direct host access
3. Combined with prompt injection, an attacker who controls content the agent reads could potentially trigger elevated exec through an authorized channel
4. The `allowFrom` lists are static -- no time-based or context-based restrictions

### Our Recommendation for Mac Mini Deployment

**DISABLE elevated mode entirely:**

```json5
{
  tools: {
    elevated: {
      enabled: false
    }
  }
}
```

If we later need host execution for specific tasks, we should:
1. Create a dedicated agent with sandbox mode off
2. Route only Sean's direct messages to that agent via bindings
3. Keep all other agents fully sandboxed
4. This gives us the "elevated" capability through architecture (agent routing) rather than through the dangerous escape hatch

Source: docs.openclaw.ai/gateway/sandboxing (Tier 1), docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated (Tier 1)

---

## Configuration Architecture (Deep)

**Source:** Context7 official docs (Tier 1), eastondev.com configuration guide (Tier 3)

### Configuration Priority (Now Fully Documented)

Three layers of priority:

```
Environment Variables > Configuration File (~/.openclaw/openclaw.json) > Default Values
```

This means environment variables can temporarily override any config file setting -- useful for debugging.

### Agent Configuration Precedence

Agent-specific settings override global defaults. This is the exact precedence chain:

```
agents.list[].sandbox.mode           > agents.defaults.sandbox.mode
agents.list[].sandbox.scope          > agents.defaults.sandbox.scope
agents.list[].sandbox.workspaceRoot  > agents.defaults.sandbox.workspaceRoot
agents.list[].sandbox.workspaceAccess > agents.defaults.sandbox.workspaceAccess
agents.list[].sandbox.docker.*       > agents.defaults.sandbox.docker.*
agents.list[].sandbox.browser.*      > agents.defaults.sandbox.browser.*
agents.list[].sandbox.prune.*        > agents.defaults.sandbox.prune.*
agents.list[].model                  > agents.defaults.model
agents.list[].tools.*                > agents.defaults.tools (implied)
```

**Exception:** Settings related to `agents.list[].sandbox.{docker,browser,prune}.*` are **ignored** when the sandbox scope is resolved to `shared`.

### The Duplication Problem (Resolved)

Phase 1 reported community complaints about config duplication across `~/.openclaw/openclaw.json` and `~/.openclaw/agents/main/agent/models.json`. The actual architecture is:

1. **`openclaw.json`** is the single source of truth for Gateway-level config
2. **`agents.defaults`** defines global agent defaults
3. **`agents.list[]`** defines per-agent overrides
4. The `models.json` in agent directories is a **legacy artifact** from before the 2026 multi-agent refactoring

**Best practice (from config guide):**
- Put all model configuration in `openclaw.json` under `agents.defaults.model` and `agents.list[].model`
- Do NOT duplicate model configuration in agent-specific `models.json` files
- Use `agents.defaults` for shared settings across all agents
- Use `agents.list[]` overrides only for agent-specific divergences

### Configuration Validation

```bash
openclaw config validate    # Validate config file format and settings
openclaw doctor             # Health check including config status
```

### Skills Priority

```
Workspace Skills (project directory) > User Skills (~/.openclaw/skills/) > Built-in Skills
```

This means project-specific skill customizations override global installations.

Source: docs.openclaw.ai/gateway/configuration (Tier 1), docs.openclaw.ai/multi-agent-sandbox-tools (Tier 1), eastondev.com config guide (Tier 3)

---

## Cron & Autonomous Execution

**Source:** Context7 -- docs.openclaw.ai/automation/cron-jobs (Tier 1)

### How Cron Works

Cron runs **inside the Gateway** (not inside the model). Jobs persist under `~/.openclaw/cron/` so restarts don't lose schedules.

### Two Execution Styles

1. **Main session**: Enqueue a system event, then run on the next heartbeat. The cron job doesn't trigger a full agent turn on its own -- it queues work.

2. **Isolated**: Run a dedicated agent turn in `cron:<jobId>`. This is advantageous for:
   - Using a cheaper model for routine tasks
   - Ensuring a specific action happens at a set time
   - Keeping cron output separate from main session history

### Schedule Types

| Type | CLI Flag | Example |
|------|----------|---------|
| One-shot | `--at` | `"2026-01-12T18:00:00Z"` or `"20m"` |
| Interval | `--interval` | Every X minutes/hours |
| Daily | `--daily` | Specific time of day |
| Weekly | `--weekly` | Specific day of week |
| Monthly | `--monthly` | Specific day of month |
| Full cron | `--cron` | `"0 7 * * *"` |

### Cron vs Heartbeat

- **Cron**: Precise scheduling, can run in isolation, supports delivery to channels
- **Heartbeat**: Agent's periodic wake cycle, processes queued events

### Security Implications

Cron jobs can:
- Execute any prompt as the agent
- Use any configured model
- Deliver output to any channel
- Run with full tool access of the assigned agent

**For our deployment:** Cron should be disabled initially. If enabled later, pin cron jobs to a restricted agent with limited tool access.

Source: docs.openclaw.ai/automation/cron-jobs (Tier 1), docs.openclaw.ai/automation/cron-vs-heartbeat (Tier 1)

---

## Architecture Implications for Mac Mini

### Resource Planning (Informed by Architecture)

| Component | Resource Impact | Notes |
|-----------|----------------|-------|
| **Gateway process** | Low (Node.js event loop) | Single process, lightweight |
| **Session storage** | Disk I/O (JSONL writes) | Will grow over time, plan cleanup |
| **Sub-agents** | Low per sub-agent (API calls) | Default max 8 concurrent, share Gateway memory |
| **Local embeddings** | CPU/RAM (M4 Neural Engine) | GGUF model loads into memory |
| **Docker sandbox** | 1GB RAM per container + VM overhead | Docker Desktop runs a Linux VM |
| **Channel adapters** | Negligible | WebSocket/webhook listeners |
| **Cron scheduler** | Negligible | In-process timer, disk persistence |

**Total estimate for our deployment:**
- Gateway + 2 agents + local embeddings: ~2-4GB RAM
- With Docker sandbox (per-session): +1GB per active session
- 16GB Mac Mini can comfortably handle 4-6 concurrent sandboxed sessions
- Without Docker sandbox: 16GB is massive overkill

### Configuration Decisions (Now Informed)

1. **Start with `sandbox.mode: "non-main"`** -- sandbox non-main sessions only, main session runs on host. This is the documented default and balances security with resource usage.

2. **Use per-agent model routing** instead of elevated mode -- create a "deep work" agent with `sandbox.mode: "off"` for Sean's direct use, and keep all other agents sandboxed.

3. **Configure `dmScope: "per-channel-peer"`** -- prevents cross-user context leakage.

4. **Set up daily session reset** at 4 AM -- prevents unbounded session growth.

5. **Use local embeddings** for memory search -- keeps embedding data on the Mac Mini, uses M4 Neural Engine.

6. **Configure webhook endpoint** for n8n integration -- clean REST interface, no custom code needed.

7. **Reduce `maxConcurrent` sub-agents to 4** -- conservative for a machine also running other services.

---

## Remaining Unknowns

Even with this deep-dive, some questions require hands-on testing:

1. **Docker Desktop VM overhead on M4**: How much RAM does the Docker Desktop VM itself consume on Apple Silicon? This affects our sandbox resource budget.

2. **Local embeddings performance on M4**: How fast does the M4 Neural Engine process GGUF embeddings? What model size is optimal for 16GB RAM?

3. **WebSocket connection limits**: How many concurrent WebSocket clients can the Gateway handle? (Relevant if multiple channel connections + TUI + macOS app all connect simultaneously.)

4. **Session transcript growth rate**: How quickly do JSONL transcript files grow under normal personal usage? This informs our cleanup strategy.

5. **Cron job authorization**: Can the cron tool itself be restricted via tool policy, or is it always available to all agents?

6. **exec-approvals pattern matching**: Still not documented whether patterns use regex, glob, or exact match. This remains a Phase 3 testing item.

7. **Transcript hygiene**: The docs reference `sanitizeSessionHistory()` for transcript hygiene -- what exactly gets sanitized? Tool call inputs? Sensitive data? This affects what appears in LLM context.

8. **Agent-to-agent communication**: The config shows `session.agentToAgent.maxPingPongTurns: 5` -- how do agents communicate with each other? What are the security implications?

---

## Source Index

| Source | Type | Tier | Key Finding |
|--------|------|------|-------------|
| docs.openclaw.ai/concepts/multi-agent | Context7 | 1 | Deterministic routing precedence, binding system |
| docs.openclaw.ai/concepts/session | Context7 | 1 | Session scoping, identity links, reset policies |
| docs.openclaw.ai/concepts/memory | Context7 | 1 | Local embeddings option, session memory search |
| docs.openclaw.ai/gateway/configuration | Context7 | 1 | Webhook hooks, model config, multi-agent setup |
| docs.openclaw.ai/gateway/sandboxing | Context7 | 1 | Sandbox vs tool policy vs elevated |
| docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated | Context7 | 1 | Three control layers documented |
| docs.openclaw.ai/gateway/security | Context7 | 1 | DM scope isolation, disk trust boundary |
| docs.openclaw.ai/tools/subagents | Context7 | 1 | Sub-agent lifecycle, concurrency, context limits |
| docs.openclaw.ai/automation/cron-jobs | Context7 | 1 | Cron scheduler architecture, persistence |
| docs.openclaw.ai/automation/cron-vs-heartbeat | Context7 | 1 | Isolated vs main cron execution |
| docs.openclaw.ai/help/faq | Context7 | 1 | Data residency -- local vs cloud |
| docs.openclaw.ai/gateway/local-models | Context7 | 1 | Hybrid model configuration |
| docs.openclaw.ai/multi-agent-sandbox-tools | Context7 | 1 | Configuration precedence hierarchy |
| docs.openclaw.ai/reference/transcript-hygiene | Context7 | 1 | Session history sanitization |
| eastondev.com/blog/en/posts/ai/20260205-openclaw-architecture-guide/ | Bright Data | 3 | Three-layer architecture (source code analysis), Provider plugin system, message flow, session lifecycle |
| eastondev.com/blog/en/posts/ai/20260205-openclaw-config-guide/ | Bright Data | 3 | Configuration priority, 5-module breakdown, practical scenarios, security checklist |
