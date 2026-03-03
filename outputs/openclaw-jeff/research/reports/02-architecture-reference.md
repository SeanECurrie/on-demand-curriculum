# Architecture Reference — OpenClaw for Jeff (Output #2)

**Date:** 2026-03-03
**Report Type:** Architecture
**Depth:** Abbreviated
**Sources:** 8 sources across Tiers 1-4
**Credibility:** Core architecture from Tier 1 (official docs); data flow analysis cross-validated with community experience (Tier 2-4)

---

## Key Takeaway

OpenClaw is a switchboard on Jeff's MacBook Air that takes his instructions, sends them to Claude for thinking, uses skills to take real actions (like posting to Instagram), and keeps everything private on his machine except what he intentionally sends out. The architecture has four components; Jeff needs to understand all four to make informed decisions about his deployment.

---

## The Four Components

### 1. Gateway -- The Front Desk

The Gateway is the foundation. It receives every message Jeff sends, manages authentication, routes requests to the right agent, and delivers responses back. It runs as a Docker container on Jeff's MacBook Air.

**If the Gateway is not running, nothing works.** This is why sleep prevention (Report 03) and update management are critical.

**Security implication:** The Gateway is the attack surface. Every security control in Report 04 -- authentication, localhost binding, rate limiting -- protects the Gateway. [Tier 1 -- OpenClaw architecture docs]

### 2. LLM Connection -- The Brain You're Renting

The Gateway does not think on its own. It sends Jeff's messages to Claude (Anthropic's AI model) over the internet and receives the response. Jeff provides his own API key -- a credential that authorizes usage and determines billing.

**Key detail for Jeff:** The thinking happens on Anthropic's servers, not on Jeff's MacBook. This means Jeff's MacBook Air does not need AI-grade hardware -- it only needs enough resources to run the Gateway and manage connections. Claude's API has a zero data retention policy for API usage. [Tier 1 -- Anthropic API docs, OpenClaw FAQ]

**Cost implication:** Jeff pays per use. For social media content creation, estimated $3-10/month using Claude Sonnet 4.6. See community findings for full cost breakdown. [Tier 2 -- pricing analysis]

### 3. Skills -- The Hands

Skills are add-ons that let OpenClaw take real actions: post to Instagram, search the web, read files, schedule tasks. Without skills, the agent can only talk. With skills, it can act.

**Critical security context:** Skills inherit the agent's full permissions. A malicious skill can access everything the agent can access -- including API keys, chat history, and browser sessions. This is why Report 04 mandates zero ClawHub skills and why the walkthrough builds custom skills only. [Tier 1 -- OpenClaw docs, Tier 2 -- Snyk ToxicSkills report]

**Instagram-specific:** OpenClaw has no native Instagram skill. The recommended architecture separates content generation (OpenClaw + Claude) from content publishing (Zapier or similar). Full analysis in the social media skills KB entry. [Tier 1 -- OpenClaw tools index]

### 4. Dashboard -- The Control Panel

A web page that runs locally on Jeff's MacBook Air (not on the internet) where Jeff can see what the agent is doing, review its work, change settings, and manage the setup visually.

**Access note:** The Dashboard is only accessible from Jeff's computer (localhost). No one on Jeff's WiFi network or the internet can reach it, provided localhost binding is configured per Report 04. [Tier 1 -- OpenClaw docs]

---

## Data Flow -- Jeff's Use Case

When Jeff sends a message to OpenClaw asking it to draft an Instagram post:

1. **Jeff types a message** -- through a messaging app (WhatsApp, Telegram) or the Dashboard
2. **Gateway receives it** -- checks authentication, identifies Jeff, routes to the content agent
3. **Gateway sends to Claude** -- Jeff's message + conversation history + SOUL.md brand voice instructions go to Anthropic's servers
4. **Claude generates content** -- drafts a caption, suggests hashtags, may request a skill action
5. **If a skill is needed, Gateway executes it** -- e.g., formatting for Instagram, looking up market data
6. **Response returns to Jeff** -- the draft appears in his chat interface for review
7. **Jeff approves** -- then a separate automation (Zapier) handles the mechanical posting step

**Cycle time:** 3-8 seconds for a content draft. Irrelevant for Jeff's async review workflow. [Tier 1 -- OpenClaw docs, Tier 4 -- community benchmarks]

---

## Where Jeff's Data Goes

### Stays on Jeff's MacBook (Private)

- All conversation history and session logs
- OpenClaw configuration and API keys
- Installed skills and their files
- Agent memory (Jeff's preferences, brand voice settings in SOUL.md)
- Draft content before publication

### Leaves Jeff's MacBook (Sent Over the Internet)

| Data | Destination | Retention | Why |
|------|-------------|-----------|-----|
| Conversation text | Anthropic (Claude API) | Zero retention (API policy) | For AI processing -- Claude reads the message, generates a response, does not store it |
| Published content | Instagram (Meta) | Permanent (it's a post) | This is the whole point -- Jeff wants to publish content |
| Messages via WhatsApp/Telegram | Those platforms' servers | Per platform policy | If Jeff uses messaging apps to interact with OpenClaw |

**The principle:** OpenClaw keeps Jeff's data local by default. The only things that leave are (1) what Jeff asks the AI to think about (sent to Claude for processing, not stored) and (2) what Jeff intentionally publishes (sent to Instagram because that is the goal). [Tier 1 -- OpenClaw architecture docs, Anthropic API terms]

---

## Security Implications

The architecture creates four security boundaries that the walkthrough must enforce. Each is detailed in Report 04 (Security Evaluation):

1. **Gateway authentication** -- prevents unauthorized access to the agent. Without it, any code running on Jeff's machine (including JavaScript in a web browser) could control the agent. See: ClawJacked vulnerability. [Cross-ref: Report 04, Section 1.2]

2. **Localhost binding** -- prevents network exposure. The Gateway listens only on Jeff's computer, not on the network. [Cross-ref: Report 04, Section 1.3]

3. **Sandbox mode** -- contains skill execution. Skills run inside Docker containers with restricted permissions, preventing a compromised skill from accessing Jeff's personal files. [Cross-ref: Report 04, Section 1.4]

4. **Skill trust boundary** -- skills are instructions, not sandboxed code. A skill can request any action the agent's tool policy allows. The tool policy, not the skill itself, is the execution boundary. This is why the zero-ClawHub-skills policy matters. [Cross-ref: Report 04, Section 1.6]

---

## Diagrams Recommended for Walkthrough

The walkthrough should include visual aids for these concepts:

1. **Component diagram** -- the four parts (Gateway, LLM, Skills, Dashboard) and how they connect. Simple boxes-and-arrows showing what runs on Jeff's MacBook vs. what runs on external servers.

2. **Data flow diagram** -- trace a single message from Jeff through the system and back. Highlight what stays local vs. what crosses the internet. Color-code private (local) vs. public (transmitted) data.

3. **Security boundary diagram** -- show the four security layers (auth, localhost, sandbox, skill policy) as concentric rings around Jeff's data. Illustrate what each layer prevents.

4. **Split architecture diagram** -- show the recommended content generation (OpenClaw) + content publishing (Zapier) split, making clear where each tool's responsibility begins and ends.

These should be simple, Jeff-level visuals -- not engineering diagrams. Labels in plain language. No technical jargon in the diagrams themselves.

---

## Transferable Principle

The Gateway/LLM/Skills/Dashboard architecture is not unique to OpenClaw. Most AI agent platforms follow a similar pattern: a local coordinator that manages authentication and routing, an external AI model for reasoning, plugins/tools for actions, and a management interface. Understanding this architecture means Jeff can evaluate any future AI tool by asking: "Where does my data go? What can the plugins access? How is the front door protected?" These questions transfer to every agent platform.
