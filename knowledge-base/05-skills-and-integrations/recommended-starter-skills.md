# Recommended Starter Skills for Mac Mini Deployment

**Research Date:** 2026-02-11
**Operator Context:** Sean Currie -- personal productivity, professional work, learning about AI agents
**Security Posture:** Conservative -- zero ClawHub, minimal initial surface
**Sources:** Context7 official docs + Bright Data community intelligence (16+ targeted queries)

---

## Philosophy: Start Narrow, Widen With Confidence

The official docs state: "Start with the smallest access that still works, then widen it as you gain confidence." This is our guiding principle.

OpenClaw's power comes from tools, not skills. Skills are instructions that teach the agent how to use tools. The real security boundary is the tool policy and exec-approvals. We control what the agent CAN do (tools), and skills guide what it SHOULD do.

---

## Recommended: Enable on Day 1

These are safe, immediately useful, and have minimal attack surface.

### 1. web_search (Built-in Tool)

**What it does:** Search the web via Brave Search API or Perplexity Sonar. Returns structured results.

**Security assessment:** LOW RISK. Read-only web queries. No side effects. Cached for 15 minutes.

**Configuration needed:**
```json
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "brave",
        "apiKey": "YOUR_BRAVE_API_KEY"
      }
    }
  }
}
```
Get a Brave API key at https://brave.com/search/api/ (free tier available).

**Why Day 1:** An agent without web search is dramatically less useful. This is the single highest-value tool to enable.

**Source:** docs.openclaw.ai/tools/web (Tier 1)

### 2. web_fetch (Built-in Tool)

**What it does:** HTTP GET + readable content extraction (HTML to markdown). No JavaScript execution.

**Security assessment:** MEDIUM-LOW RISK. Built-in SSRF protections block private/internal hostnames. Redirects are limited. Content is cached.

**Configuration needed:** Enabled by default. Optionally add Firecrawl for JS-heavy sites:
```json
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,
        "maxChars": 50000,
        "timeoutSeconds": 30
      }
    }
  }
}
```

**Why Day 1:** Complements web_search. The agent can search AND read URLs. Essential for research and information gathering.

**Source:** docs.openclaw.ai/tools/web (Tier 1)

### 3. read (Built-in Tool)

**What it does:** Read files from the filesystem.

**Security assessment:** MEDIUM RISK. Information disclosure only -- cannot modify anything. Risk is the agent reading sensitive files (API keys, credentials). Mitigated by dedicated user account and filesystem allow/deny lists.

**Configuration needed:** Enable in tool policy:
```json
{
  "tools": {
    "allow": ["read", "web_search", "web_fetch", "reactions", "thinking"]
  }
}
```

And restrict via sandbox:
```json
{
  "sandbox": {
    "filesystem": {
      "allow": ["~/.openclaw/workspace"],
      "deny": ["~/.ssh", "~/.aws", "~/.openclaw/credentials"]
    }
  }
}
```

**Why Day 1:** The agent needs to read files to be useful for any local work.

**Source:** docs.openclaw.ai/tools/exec (Tier 1)

### 4. reactions (Built-in Tool)

**What it does:** Add/remove emoji reactions to messages.

**Security assessment:** MINIMAL RISK. Cosmetic only. No data access or side effects.

**Why Day 1:** Makes the interaction feel more natural. Agent can acknowledge messages.

**Source:** docs.openclaw.ai/tools/reactions (Tier 1)

### 5. thinking (Built-in Tool)

**What it does:** Control thinking depth (low/medium/high) per agent turn.

**Security assessment:** MINIMAL RISK. Only changes model parameters. Helps control cost.

**Why Day 1:** Useful for cost management. You can set default thinking level and override per task.

**Source:** docs.openclaw.ai/tools/thinking (Tier 1)

### 6. Telegram Channel

**What it does:** Connect to Telegram via bot token. The agent can send messages, react, and receive messages from paired contacts.

**Security assessment:** MEDIUM RISK. Primary attack surface for prompt injection via incoming messages. Mitigated by `dmPolicy: "pairing"` and `allowFrom`.

**Configuration needed:**
```json
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

**Why Day 1:** This is your primary interface to the agent from your phone/desktop. Community consensus: Telegram is the best first channel.

**Source:** docs.openclaw.ai/channels/telegram (Tier 1), community consensus (Tier 4)

### 7. Heartbeat (Automation)

**What it does:** Periodic check-ins where the agent reviews a HEARTBEAT.md checklist.

**Security assessment:** LOW RISK when checklist is simple. The agent only does what the checklist says, within tool constraints.

**Configuration needed:**
```json
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

Start with a minimal HEARTBEAT.md:
```markdown
# Heartbeat checklist
- If idle for 8+ hours, send a brief check-in to Telegram
```

**Why Day 1:** Validates that the agent is alive and running. Start minimal, expand the checklist gradually.

**Source:** docs.openclaw.ai/automation/cron-vs-heartbeat (Tier 1)

---

## Recommended: Enable After Validation (Week 1-2)

These need testing and monitoring before trusting.

### 8. exec (Built-in Tool) -- Restricted

**What it does:** Run shell commands in the workspace.

**Security assessment:** CRITICAL RISK. Arbitrary command execution. ONLY enable with strict exec-approvals.

**Configuration needed:**
```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss"
    }
  }
}
```

With `~/.openclaw/exec-approvals.json`:
```json
{
  "version": 1,
  "defaults": { "security": "deny", "ask": "on-miss" },
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

**Why Week 1-2:** The agent needs exec to be truly useful for development and system tasks. But you need to observe its behavior first with read-only tools. Start with a tight allowlist and expand as you understand usage patterns.

**Source:** docs.openclaw.ai/tools/exec (Tier 1)

### 9. write / edit (Built-in Tools)

**What it does:** Create and modify files on the filesystem.

**Security assessment:** HIGH RISK. Can modify any file the user has access to. Mitigated by sandbox filesystem allow/deny lists.

**Configuration:** Add to tool allow list after you are comfortable with read-only operation:
```json
{
  "tools": {
    "allow": ["read", "write", "edit", "exec", "web_search", "web_fetch", "reactions", "thinking"]
  }
}
```

Restrict via sandbox:
```json
{
  "sandbox": {
    "filesystem": {
      "allow": ["~/.openclaw/workspace", "~/Projects"],
      "deny": ["~/.ssh", "~/.aws", "~/.openclaw/credentials", "~/.openclaw/openclaw.json"]
    }
  }
}
```

**Why Week 1-2:** Write capabilities turn the agent from a reader into a doer. Essential for taking notes, writing code, creating reports.

### 10. Cron Jobs (Automation)

**What it does:** Precise scheduling of agent tasks.

**Security assessment:** MEDIUM RISK. Cron runs autonomously. Isolated sessions limit blast radius.

**Start with simple, low-risk cron jobs:**
```bash
# Morning briefing at 8am
openclaw cron add \
  --name "Morning brief" \
  --cron "0 8 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Good morning. What's on my calendar today? Any important news?" \
  --model sonnet \
  --announce \
  --channel telegram
```

**Why Week 1-2:** Once you trust the agent with read-only tools and a basic heartbeat, scheduled tasks are the next productivity win.

### 11. Memory Plugin (LanceDB)

**What it does:** Long-term memory with auto-recall and capture. The agent remembers across sessions.

**Security assessment:** LOW RISK. Stores data locally. Risk is the agent remembering and surfacing sensitive information from past conversations.

**Configuration:**
```json
{
  "plugins": {
    "slots": {
      "memory": "memory-lancedb"
    }
  }
}
```

**Why Week 1-2:** Memory transforms the agent from stateless to contextual. But you want to observe what it remembers and decide if the retention is appropriate.

---

## Recommended: Defer Until Comfortable (Week 3-4+)

These are powerful capabilities that require experience and trust.

### 12. Lobster (Workflow Runtime)

**What it does:** Deterministic, multi-step tool pipelines with approval gates.

**Security assessment:** MEDIUM RISK. Workflows are deterministic, but they chain multiple tool calls. Approval gates provide human checkpoints.

**Configuration:**
```json
{
  "tools": {
    "alsoAllow": ["lobster"]
  }
}
```

**Why defer:** Lobster is the right way to build reliable automation. But you need to understand tool behavior first. Start building workflows after you have a week of exec/write experience.

### 13. Webhooks (n8n Integration Point)

**What it does:** HTTP endpoints for external triggers.

**Security assessment:** MEDIUM RISK. Exposes HTTP endpoints. Token-authenticated. Keep behind loopback/Tailscale.

**Configuration:**
```json
{
  "hooks": {
    "enabled": true,
    "token": "DEDICATED_WEBHOOK_TOKEN",
    "path": "/hooks",
    "allowedAgentIds": ["main"]
  }
}
```

**Why defer:** The n8n integration is strategically important but not needed on Day 1. Get the agent working first, then add the workflow automation layer.

### 14. Sub-Agents

**What it does:** Spawn background agents for parallel work.

**Security assessment:** MEDIUM-HIGH RISK. Multiplies capability and cost. Each sub-agent runs with its own tool access.

**Why defer:** Complexity multiplier. Master single-agent operation first.

### 15. process (Built-in Tool)

**What it does:** Manage background exec sessions (poll, kill, write stdin).

**Security assessment:** HIGH RISK. Extends exec with background process management.

**Why defer:** Only needed when you start running long-running commands. Enable alongside advanced exec usage.

---

## Do Not Enable

### Browser / Browser Login / Chrome Extension
**Why:** Gives the model access to logged-in browser sessions. Full CDP control is equivalent to operator-level access. Community reports instability ("Openclaw managed Browser is unstable"). Critical attack surface for credential theft.
**Source:** docs.openclaw.ai/tools/browser (Tier 1), community (Tier 4)

### Elevated Mode
**Why:** Global escape hatch that runs exec on the gateway host even when sandbox is enabled. The docs themselves warn against it. There is no use case that justifies this risk for our deployment.
**Source:** docs.openclaw.ai/tools/elevated (Tier 1)

### Canvas
**Why:** UI rendering for macOS companion app. Not useful on a headless Mac Mini deployment. Adds unnecessary token overhead.

### nodes (Device Pairing)
**Why:** Exposes local device tools and enables remote execution across paired devices. Unnecessary complexity for a single-machine deployment. When you eventually want multi-device, re-evaluate with full security review.
**Source:** docs.openclaw.ai/nodes (Tier 1)

### Any ClawHub Skill
**Why:** 12% confirmed malicious rate. Zero ClawHub skills until the ecosystem matures significantly. Build custom skills instead.
**Source:** Koi Security (Tier 2)

### Voice Call Plugin (Initially)
**Why:** Requires Twilio account setup, exposes telephony surface. Not needed for initial deployment. Re-evaluate if voice interaction becomes a priority.

---

## Custom Skills to Build

These address Sean's use cases and avoid ClawHub entirely.

### Priority 1: Personal Briefing Skill
**Use case:** Daily summary of weather, calendar, news, and task priorities.
**How:** Custom SKILL.md that instructs the agent to use web_search + exec (for local calendar CLI) and format a morning briefing.
**Trigger:** Cron job at 8am -> Telegram delivery.

### Priority 2: Research Assistant Skill
**Use case:** Professional research -- gather sources, summarize findings, maintain a knowledge base.
**How:** Custom SKILL.md that instructs the agent to use web_search, web_fetch, and write to save research notes to a designated directory.
**Trigger:** On-demand via Telegram messages.

### Priority 3: Project Status Skill
**Use case:** Track progress on projects, maintain task lists, generate status updates.
**How:** Custom SKILL.md that instructs the agent to read/write a structured project file and generate status summaries.
**Trigger:** Heartbeat checklist item + on-demand.

### Priority 4: Learning Journal Skill
**Use case:** Capture insights about AI agents, deployment lessons, and technical notes.
**How:** Custom SKILL.md that appends entries to a learning journal with timestamps and categories.
**Trigger:** On-demand via Telegram.

### Priority 5: n8n Bridge Skill (After Webhook Setup)
**Use case:** Trigger n8n workflows from the agent and interpret results.
**How:** Custom SKILL.md that instructs the agent to call n8n webhook endpoints via exec/curl and process responses.
**Trigger:** On-demand.

---

## Integration Roadmap

### Week 0 (Day 1): Foundation
1. **Telegram** -- primary communication channel
2. **web_search + web_fetch** -- read-only web access
3. **read** -- filesystem reading
4. **reactions + thinking** -- quality of life
5. **Heartbeat** -- basic monitoring (minimal checklist)

### Week 1: Core Capabilities
6. **exec** (restricted allowlist) -- shell access
7. **write / edit** -- file modification
8. **Cron jobs** -- simple scheduled tasks
9. **Memory (LanceDB)** -- long-term recall
10. **First custom skill** (personal briefing)

### Week 2-3: Automation Layer
11. **Lobster** -- workflow runtime
12. **Webhooks** -- external trigger support
13. **More custom skills** (research, project status)
14. **n8n installation and webhook integration**

### Week 4+: Advanced
15. **Sub-agents** -- parallel work
16. **Multi-agent routing** (Sonnet for casual, Opus for work)
17. **Additional custom skills** (learning journal, specialized workflows)
18. **Evaluate additional channels** (WhatsApp, Discord) based on need

### NOT on the roadmap (indefinitely deferred):
- Browser automation
- Elevated mode
- ClawHub skills
- Node pairing
- Voice calls

---

## Cost Considerations

| Component | Token Cost | API Cost |
|-----------|-----------|----------|
| Base system prompt | ~2,000 tokens | Included in every turn |
| Skills list (53 bundled) | ~1,300 tokens | Included in every turn |
| Heartbeat (hourly) | ~3,000+ tokens/turn | 24 turns/day = ~72K tokens/day |
| Cron (isolated, daily) | ~3,000+ tokens/turn | 1 turn/day |
| Cron (isolated, with Opus) | ~3,000+ tokens/turn | Expensive per turn |

**Recommendations:**
- Disable skills you do not use (`entries.<key>.enabled: false`) to reduce system prompt size
- Use `allowBundled` to whitelist only the skills you actually need
- Use cheaper models (Sonnet, Gemini Flash) for heartbeat and routine cron
- Use Opus only for tasks that require it (complex reasoning, tool-heavy work)
- Set `activeHours` on heartbeat to avoid overnight costs

**Source:** docs.openclaw.ai/tools/skills (Tier 1), community cost reports (Tier 4)

---

## Source Index

| Source | Tier | Contribution |
|--------|------|-------------|
| docs.openclaw.ai/tools/skills | 1 | Skill architecture, format, gating |
| docs.openclaw.ai/tools/skills-config | 1 | Configuration reference |
| docs.openclaw.ai/tools/exec | 1 | Exec tool, authorization model |
| docs.openclaw.ai/tools/web | 1 | Web tools configuration |
| docs.openclaw.ai/tools/lobster | 1 | Workflow runtime, approvals |
| docs.openclaw.ai/automation/cron-vs-heartbeat | 1 | Scheduling guide |
| docs.openclaw.ai/automation/webhook | 1 | Webhook API for n8n |
| docs.openclaw.ai/channels/telegram | 1 | Telegram setup and tools |
| docs.openclaw.ai/tools/plugin | 1 | Plugin architecture |
| Koi Security ClawHavoc | 2 | ClawHub malicious skills data |
| Semgrep security cheat sheet | 2 | Skill red flags |
| Community consensus (Reddit, forums) | 4 | Telegram preference, cost reports |
| Phase 1 landscape analysis | 2-3 | n8n stack recommendation |
