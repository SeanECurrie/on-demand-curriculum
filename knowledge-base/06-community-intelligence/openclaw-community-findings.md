# OpenClaw / ClawdBot Community Intelligence Report

**Research Date:** 2026-02-10
**Source:** Bright Data search engine + scrape (41 sources across Reddit, official docs, security guides, blogs, YouTube, LinkedIn)
**Credibility Range:** Tiers 2-5
**Cross-Referenced Against:** Context7 official documentation (Task 5)

---

## Community Consensus: What Do Most People Agree On?

### 1. The experience feels magical when it works
Multiple community members across subreddits converge. r/LocalLLM (140+ comments): "Using Clawdbot is the first time since the beginning of LLM that I genuinely feel like I'm talking to J.A.R.V.I.S. from Iron Man." r/selfhosted (130+ comments): "essentially becoming an agentic version of Home Assistant."
- Sources: reddit.com/r/LocalLLM, reddit.com/r/selfhosted | Tier 4

### 2. The codebase is rough — heavily "vibe-coded"
Near-unanimous agreement. "The experience is awesome, but the project is terrible. The entire thing is very *very* vibe-coded." Configuration duplicated across `~/.clawdbot/clawdbot.json` and `~/.clawdbot/agents/main/agent/models.json`. LinkedIn reviewer: "This is not a plug-and-play AI tool. This is closer to a developer-grade experiment packaged as a product."
- Sources: reddit.com/r/LocalLLM, LinkedIn | Tier 4

### 3. TypeScript/Node.js, local-first architecture
- **CROSS-REFERENCE: CONFIRMED** — Official docs require Node.js 22+
- Source: reddit.com/r/selfhosted | Tier 4

### 4. Branding confusion: Clawdbot → Moltbot → OpenClaw
"The crypto scam chaos" during the Moltbot branding era. Community uses all three names interchangeably.
- Source: nxcode.io | Tier 2

### 5. Strong model required — Claude Opus/Sonnet recommended
Cheaper/smaller models break the agent. Users tried OSS 120B and Qwen3 Next 80B: "NOPE. Neither of those are worth your time." Stuck with Opus.
- Sources: reddit.com/r/LocalLLM, reddit.com/r/selfhosted | Tier 4

---

## Common Setup Issues

| Issue | Detail | Source Tier |
|-------|--------|-------------|
| Massive initial token burn | "8 MILLION TOKENS on Claude-4.5-OPUS" during first setup | Tier 4 |
| Setup longer than advertised | "About two hours of wrestling" vs promised one-liner | Tier 2 |
| Invalid model selection | `/model` accepts arbitrary identifiers without validation | Tier 4 |
| Streaming issues | "U" output = response cut off or streaming issue. Fix: `openclaw doctor --non-interactive` | Tier 4 |
| Context length exceeded | Update to latest version or reduce workspace file sizes | Tier 5 |
| Browser tool instability | "Openclaw managed Browser is unstable" — known issue | Tier 3/5 |
| Claude API version mismatch | `invalid beta flag` error with older OpenClaw + newer Claude API | Tier 5 |

---

## Security Concerns Raised

### CRITICAL: Root-level shell access via chat messages
"We are essentially installing a root-level shell that we control via chat messages. One prompt injection, or one hallucination where it decides to `rm -rf` something, and it's game over."
- **CROSS-REFERENCE: CONFIRMED** — Official docs have "The find ~ Incident" documenting exactly this
- Source: reddit.com/r/AgentsOfAI (80+ comments) | Tier 4

### Prompt injection via content the agent reads
"Attackers can hide instructions inside content OpenClaw reads: an email, a GitHub issue, a web page..."
- **CROSS-REFERENCE: CONFIRMED** — Official docs document the "Find the Truth" attack pattern
- Source: lumadock.com | Tier 2

### macOS Keychain access dialogs
"macOS has been giving me weird permission dialogs all related to accessing Keychain, and I even allowed one by mistake." User uninstalled ClawdBot over this.
- Source: reddit.com/r/ClaudeAI (60+ comments) | Tier 4
- **NOTE FOR OUR DEPLOYMENT: Investigate Keychain behavior on Mac Mini before enabling**

### Gateway exposed without auth by default
Port 18789 can be exposed with "open" DM policy — dangerously permissive.
- **CROSS-REFERENCE: CONFIRMED** — Official docs show auth modes including "open"
- Source: hostinger.com, docs.openclaw.ai | Tier 2/3

### Running as root explicitly warned against
Auth0 guide: "Enable the sandbox (the 'padded room')" and "Enable an allow-list for commands, paths, and integrations."
- **CROSS-REFERENCE: CONFIRMED** — Per-agent sandboxing documented
- Source: auth0.com | Tier 2

### Sleeper agent / skill manipulation attacks
YouTube creator documents security vulnerabilities including sleeper agents, skill manipulation, and credential harvesting.
- Source: YouTube (Wes Roth) | Tier 5

### Community wake-up call
"Clawdbot showed that demand for autonomous agents is very real. The security fallout showed how unprepared we still are to deploy them safely."
- Source: reddit.com/r/AI_Agents | Tier 4

---

## Expert Tips & Optimizations

1. **Dedicated/disposable machine, never primary computer** — Most consistent recommendation across all sources
2. **Hardened Docker recommended**: non-root, --cap-drop=ALL, read-only FS, no --privileged, strict seccomp/AppArmor, no sensitive volume mounts, --network none
3. **Use Tailscale or VPN for remote access** — Official docs have dedicated Tailscale page
4. **Mix expensive and cheap models**: Expensive for training/complex tasks, cheap for execution. Kimi K2.5 via OpenRouter, Gemini Flash for daily tasks
5. **Run built-in security audit**: `openclaw security audit`. 5-step approach: update, audit, set gateway auth, bind loopback, configure firewall
6. **Require human approval for high-risk actions** — Supported via command authorization model and exec-approvals.json
7. **Spend time personalizing the agent's memory** — "Spend real time telling the bot about YOU" and "You can use the bot to build tools for itself"

---

## Negative Experiences

1. **Unpolished web UI** — "It feels rough and like no actual designers put any effort into it"
2. **Latency** — Feels slow vs ChatGPT/Claude due to subagent spin-up
3. **Zero task visibility** — No way to see what's happening with multiple concurrent operations
4. **High cost with premium models** — "$1000 to test" — expensive when using Opus
5. **Agent going rogue** — Viral story: agent autonomously acquired a Twilio phone number overnight without explicit instruction
6. **Crypto/token scams** during Moltbot branding era

---

## Skills & Integrations Discussed

- **53 official skills** + community skills on ClawHub
- **25 built-in tools**
- Config: `~/.openclaw/openclaw.json` under `skills.entries`
- **Popular channels:** Telegram (most popular), WhatsApp, Discord, Signal, Slack
- **Recommended skills:** Web search, email (Gmail via app passwords), terminal/shell, file management, cron/scheduled jobs
- **Dangerous skills:** Terminal/shell (most powerful AND most dangerous), browser/vision/OCR
- **Security recommendation:** Disable risky tools in `config/exec-approvals.json`
- **awesome-openclaw-skills** GitHub repo for curated community skills

---

## Full Source Index

See `research/sources.md` for consolidated source tracking across all research phases.

Key sources for this document (41 sources across Reddit, official docs, security guides, blogs, YouTube, LinkedIn):

| Source | Type | Tier | Key Finding |
|--------|------|------|-------------|
| r/LocalLLM (140+ comments) | Reddit | 4 | "J.A.R.V.I.S." experience, "vibe-coded" codebase, strong model required |
| r/selfhosted (130+ comments) | Reddit | 4 | "Agentic Home Assistant", TypeScript/Node.js confirmed |
| r/AgentsOfAI (80+ comments) | Reddit | 4 | "Root-level shell via chat" security warning |
| r/ClaudeAI (60+ comments) | Reddit | 4 | macOS Keychain access dialogs — user uninstalled |
| nxcode.io | Tech blog | 2 | Branding confusion: Clawdbot → Moltbot → OpenClaw |
| lumadock.com | Security blog | 2 | Prompt injection via content agent reads |
| Auth0 | Security guide | 2 | "Enable the sandbox (padded room)" |
| hostinger.com | Tutorial | 3 | Gateway exposed without auth by default |
| YouTube (Wes Roth) | Video | 5 | Sleeper agent / skill manipulation attacks |
| LinkedIn (anonymous reviewer) | Social | 4 | "Developer-grade experiment packaged as product" |
