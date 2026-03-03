# Security Evaluation — OpenClaw for Jeff (Output #2)

**Date:** 2026-03-03
**Report Type:** Security
**Depth:** Full
**Sources:** 62 sources across Tiers 1-5 (48 inherited from Output #1, 14 new)
**Credibility:** Core vulnerability data from Tier 1-2 (NVD, official docs, security researchers); threat landscape from Tier 2-3 (security firms, GitHub advisories); Jeff-specific risk assessment synthesized across all tiers

---

## Key Takeaway

OpenClaw's security situation has worsened since Output #1. CVE count doubled in February 2026, new attack vectors were confirmed (ClawJacked, log poisoning), and the skills ecosystem remains actively hostile with 20%+ malicious rate on ClawHub. For Jeff -- a non-technical user running OpenClaw on his personal MacBook Air alongside client data and API tokens -- the hardening requirements are non-negotiable. Every Essential-tier control must be in place before the agent does anything. The walkthrough must present security as part of setup, not as a separate phase.

---

## Threat Landscape Summary

### New Vulnerabilities Since Output #1

The research surfaced 8+ new CVEs and attack vectors disclosed between late February and early March 2026:

| Vulnerability | Type | Severity | Patched In | Jeff Impact |
|--------------|------|----------|------------|-------------|
| CVE-2026-25475 | Path traversal | High | v2026.2.2 | Version requirement |
| CVE-2026-26322 | SSRF in Gateway tool | High (CVSS 7.6) | v2026.2.14 | Version requirement |
| CVE-2026-26319 | Missing webhook auth | High (CVSS 7.5) | v2026.2.14 | Version requirement |
| CVE-2026-26329 | Path traversal (browser upload) | High | v2026.2.14 | Version requirement |
| GHSA-56f2-hvwg-5743 | SSRF in image tool | High (CVSS 7.6) | v2026.2.14 | Version requirement |
| GHSA-pg2v-8xwh-qhcc | SSRF in Urbit auth | Moderate | v2026.2.14 | Version requirement |
| GHSA-c37p-4qqg-3p76 | Twilio webhook auth bypass | Moderate | v2026.2.14 | Version requirement |
| **ClawJacked** | WebSocket hijack via localhost | **High** | **v2026.2.25** | **Critical -- see below** |
| Log poisoning | Indirect prompt injection via logs | High | v2026.2.13 | Version requirement |

[Tier 1 -- NVD, GitHub Security Advisories; Tier 2 -- Infosecurity Magazine, The Hacker News, SentinelOne, Oasis Security, Eye Security, Endor Labs]

### ClawJacked -- The Most Significant New Finding

Discovered by Oasis Security (Feb 28, 2026). This attack works against localhost-bound instances -- exactly how Jeff's deployment will be configured.

**How the attack works, in plain terms:** Jeff visits any website in his normal browser. Hidden code on that website silently connects to OpenClaw running on his MacBook. It guesses the gateway password by trying many combinations rapidly (no rate limiting existed for localhost connections). Once in, it registers itself as a trusted device (auto-approved for localhost). The attacker now controls Jeff's agent -- can read conversations, dump configuration, and interact with the agent as if they were Jeff.

**Why this matters for Jeff specifically:** Jeff browses the web on the same machine running OpenClaw. He visits real estate sites, client portals, social media. Any compromised page could execute this silently.

**Fix:** Version 2026.2.25 adds rate limiting for localhost connections and removes auto-approval for localhost device registration. **Minimum safe version is now v2026.2.25.** [Tier 2 -- Oasis Security, The Hacker News]

### Malicious Skills Ecosystem

The ClawHub skills registry remains actively hostile:

- **Snyk ToxicSkills report (Feb 5, 2026):** Scanned 3,984 skills. 13.4% (534) contain CRITICAL-level issues. 36.82% (1,467) have at least one security flaw. 76 confirmed malicious payloads. [Tier 2]
- **Trend Micro:** Atomic Stealer (macOS information stealer) distributed through ClawHub skills disguised as legitimate tools. [Tier 2]
- **Straiker:** 71 additional malicious skills found in late February 2026, including agent-to-agent attacks via the Moltbook social network. [Tier 2]
- **Publishing barrier:** A SKILL.md file and a one-week-old GitHub account. No code signing, no security review, no sandbox by default. [Tier 2 -- Snyk]

**Assessment:** ClawHub is a hostile ecosystem. For Jeff -- low technical sophistication, macOS user, has API keys and client data -- the risk is unacceptable. Zero ClawHub skills, no exceptions.

---

## Jeff's Risk Profile

### What's at Stake

Jeff is not a developer running experiments. He is a top-2-ranked Denver real estate agent whose livelihood depends on client trust.

| Asset | If Compromised |
|-------|---------------|
| **Client names and contact info** | Breach of professional trust. Potential legal liability. Reputational damage among 20,000 agent peers. |
| **Client addresses** | Physical safety concern for clients. Property security concern. |
| **Contract details** | Financial exposure, deal disruption, professional liability. |
| **Instagram API token** | Unauthorized posts from @jeffanswers. Brand damage visible to entire professional network. |
| **Claude API key** | Unauthorized API usage billed to Jeff. Financial exposure. |
| **Chat history / session logs** | Contains client conversations, business strategy, personal communications. |
| **Browser sessions** | If browser tools enabled: access to Jeff's email, banking, real estate platforms, contract software. |

### Relevant Threat Actors

| Actor | Likelihood | Why |
|-------|-----------|-----|
| **Malicious ClawHub skills** | HIGH (if installed) | 20%+ malicious rate. Atomic Stealer specifically targets macOS. Jeff is an ideal target profile. |
| **ClawJacked-style browser attacks** | LOW (if patched) | Patched in v2026.2.25. Requires Jeff to visit a compromised page. |
| **Prompt injection via content** | MEDIUM | If Jeff's agent reads emails, social media, or web content, any of it can carry hidden instructions. |
| **Physical device theft** | LOW-MEDIUM | Jeff attends open houses, client meetings. Laptop could be stolen. FileVault is the primary defense. |

### What Jeff Does NOT Face

Jeff is not an infrastructure target. No nation-state threats, no corporate network lateral movement, no complex multi-service orchestration attacks. The threat model is simpler than Sean's. But the consequences of a breach are arguably higher because Jeff's business is built on personal relationships and trust. [Security analysis synthesis]

### Industry Context

The real estate industry is actively grappling with AI data security. Inman Connect New York (Feb 2026) featured sessions on AI data exposure. MLSs are pursuing "license, not lawsuit" strategies for AI data guardrails. Jeff's concern about data security is aligned with where his industry is heading. [Tier 4 -- Inman.com, Real Estate News]

---

## Three-Tier Hardening Summary

### Tier 1: Essential (Non-Negotiable)

These must be completed before Jeff connects any messaging channels or grants any tool permissions. Skipping any one creates a concrete, exploitable vulnerability.

| # | Control | Plain-Language Explanation | Cross-Ref |
|---|---------|--------------------------|-----------|
| 1.1 | **Install version >= v2026.2.25** | Older versions have known security holes that let attackers take control of the agent -- even running only on your own computer. The most recent fix closes a hole where any website could silently connect to the agent. | ClawJacked, 8+ CVEs |
| 1.2 | **Enable Gateway authentication** | The gateway is the front door to the agent. Without a password, anyone who can reach it can tell the agent what to do. Generate a long random token and never share it. | Report 02, Gateway component |
| 1.3 | **Bind to localhost only** | "Localhost" means only Jeff's computer can access the agent. If the gateway listens on the network, anyone on Jeff's WiFi could reach it. Since Jeff accesses OpenClaw directly on his MacBook, localhost is all that's needed. | Report 02, data flow |
| 1.4 | **Enable sandbox mode** | A sandbox is a locked room for the AI agent to work in. If the agent is tricked into something harmful, the sandbox keeps the damage contained. Without it, a tricked agent could access everything on Jeff's computer. | Docker isolation |
| 1.5 | **Disable elevated mode** | Elevated mode is an escape hatch that lets the agent bypass the sandbox. Jeff has no reason to enable this. Leaving it off means even a compromised agent cannot execute commands directly on Jeff's MacBook. | Sandbox reinforcement |
| 1.6 | **Zero ClawHub skills** | ClawHub is like an app store where roughly 1 in 5 "apps" are actually malware. Confirmed macOS malware has been distributed through it. Only use skills built locally by the walkthrough. | Snyk, Trend Micro, Straiker |
| 1.7 | **Enable FileVault** | Scrambles Jeff's hard drive so a stolen laptop cannot be read. All of OpenClaw's data -- API keys, chat history, configurations -- is stored as regular files, not encrypted by the app. FileVault is the encryption layer. | Physical theft risk |
| 1.8 | **Enable macOS firewall + stealth mode** | Prevents other devices on Jeff's network from finding and connecting to services on his MacBook. Stealth mode means his computer does not even respond to network probes. | Network exposure |
| 1.9 | **Disable mDNS/Bonjour broadcasting** | OpenClaw broadcasts "I'm here!" on the local network by default, including technical details about the setup. Turning it off stops this announcement. | Network exposure |
| 1.10 | **Run built-in security audit** | OpenClaw includes a tool that checks the setup for common security mistakes. Run it after configuration to catch anything the walkthrough missed: `openclaw security audit`. | Post-config verification |

[All controls sourced from Tier 1 (docs.openclaw.ai, Apple documentation) and Tier 2 (security researchers)]

### Tier 2: Educational (Understanding Why Security Matters)

These improve security, but the real value is that the concepts transfer to every tool Jeff will ever use.

**2.1 Why a Dedicated Machine Matters (Even Though Jeff Doesn't Have One)**

Jeff's MacBook Air runs both OpenClaw and his personal/business applications. His client data coexists with the agent on the same machine. The sandbox provides containment, but no single security layer is perfect. Defense-in-depth (sandbox + localhost + auth + minimal tools) compensates for using a shared machine, but Jeff should understand that a dedicated computer would be ideal. [Cross-ref: Report 03, shared machine risk]

**Transferable:** Isolation reduces blast radius. Keep work and personal separate where you can. This applies to email accounts, cloud storage, browser profiles -- not just computers.

**2.2 What "API Key Exposure" Means**

An API key is like a credit card number for a service. Jeff will have at least two: a Claude API key (charges to his Anthropic account) and an Instagram API token (posts to @jeffanswers). Never paste API keys into chat, email, or social media. Set spending limits where possible (Anthropic allows this). If Jeff suspects a key is compromised, change it immediately. [Tier 1 -- Anthropic docs, Meta docs]

**Transferable:** Treat API keys like credit card numbers. Don't share them, set spending limits, change them if compromised.

**2.3 What Prompt Injection Is (And Why It Matters for Social Media)**

The AI agent cannot always distinguish between "instructions from Jeff" and "instructions hidden in content the agent reads." A malicious email, web page, or social media message can contain hidden instructions that the agent follows without Jeff knowing. Proven examples include agents forwarding private keys after reading a crafted email, and agents dumping home directories after a manipulated file search request. [Tier 2 -- security researcher demonstrations]

**Transferable:** In AI systems, data and instructions are the same thing. Any content the agent reads is a potential source of instructions. This applies to every AI tool, not just OpenClaw.

**2.4 Browser Profile Isolation**

If OpenClaw has browser access, it can see everything in Jeff's browser profile -- logged-in sessions to banking, email, real estate platforms, everything. If browser tools are enabled, the walkthrough must create a dedicated browser profile that is ONLY used by OpenClaw. [Security best practice]

**Transferable:** Isolate automated tools from personal sessions. Same reason you don't share your personal login with scripts.

### Tier 3: Operational Polish (When Jeff Is Ready)

These matter for long-running operation but can be deferred until Jeff has a working deployment.

| Control | What | When to Start |
|---------|------|---------------|
| **Update cadence** | Check for updates weekly. CVE rate was ~1 every 3-4 days in Feb 2026. | After initial deployment is stable |
| **Log review** | Run `openclaw security audit --deep` weekly to catch unexpected behavior. | After 1-2 weeks of operation |
| **API key rotation** | Change API keys every 30-90 days. Limits exposure window if a key leaked. | After initial deployment. Set calendar reminder. |
| **Session cleanup** | Delete session transcripts older than 30 days. They contain everything the agent saw and did. | After 1 month of use |
| **Claude API spending limit** | Set a monthly cap in Anthropic console. If key is compromised, limits the financial damage. | Immediately during API key setup (lightweight enough for Phase 1) |

---

## Residual Risk After Hardening

After all three tiers are applied, these risks remain. They cannot be eliminated -- only acknowledged and managed.

### Risk 1: Shared Machine

**Threat:** Jeff's MacBook Air runs both OpenClaw and his personal/business applications. If the Docker sandbox is breached (zero-day vulnerability), the agent could access Jeff's client files, browser sessions, and credentials.
**Likelihood:** Low -- Docker container escapes are rare and require sophisticated attackers.
**Residual:** This is the biggest residual risk in Jeff's deployment. Multiple layers mitigate it (sandbox + localhost + auth + minimal tools), but a dedicated machine would eliminate it entirely. The walkthrough should acknowledge this plainly.
[Cross-ref: Report 03, shared machine risk]

### Risk 2: Zero-Day Vulnerabilities

**Threat:** OpenClaw's CVE discovery rate in February 2026 was approximately 12+ vulnerabilities in 4 weeks. New vulnerabilities will be found.
**Likelihood:** HIGH that new CVEs will be discovered. LOW-MEDIUM that Jeff will be targeted by one before a patch is available.
**Residual:** Jeff is accepting the risk of running software that is being rapidly patched. The sandbox limits blast radius even for unknown vulnerabilities. Weekly updates are the primary mitigation.

### Risk 3: Prompt Injection Has No Complete Solution

**Threat:** No current technology can fully prevent prompt injection. The fundamental problem -- data and instructions are indistinguishable to the model -- has no architectural fix.
**Likelihood:** MEDIUM -- depends on what content sources Jeff's agent reads.
**Residual:** If the agent reads untrusted content (emails, web pages, social media), prompt injection is possible. Mitigated by limiting content sources aggressively, using read-only tools, and using Claude Opus 4.6 (strongest at rejecting injections).

### Risk 4: API Key Exposure Window

**Threat:** API keys are stored unencrypted on disk. Between rotation cycles, a compromised key remains valid.
**Likelihood:** LOW if FileVault is enabled and the machine is not physically compromised.
**Residual:** Acceptable for Jeff's use case. FileVault is the critical control. Spending limits cap the financial damage.

### Risk 5: Instagram Brand Risk

**Threat:** If Jeff's Instagram API token or agent is compromised, unauthorized content could be posted to @jeffanswers -- his business account with 20,000 agent peers watching.
**Likelihood:** LOW if ClawHub skills are avoided and the agent is properly sandboxed.
**Residual:** Jeff should never allow fully autonomous posting without a human review step. The reputational risk is too high for a top-ranked agent. The walkthrough builds a review-then-post workflow, not auto-posting.

---

## Recommendations for Walkthrough Presentation

How security content should appear in the walkthrough, per DNA principle #4 (Security as a Lens):

1. **Authentication and localhost binding** configured in the same step as initial OpenClaw setup -- not in a separate "security" section. The message: "This is how you set it up. There is no insecure way to set it up."

2. **Sandbox mode** framed as part of installation. Jeff should never see OpenClaw running without sandbox mode.

3. **FileVault** verified at the very start of the walkthrough, before Docker, before OpenClaw. If it is not on, the walkthrough pauses.

4. **API key setup** includes inline "what is an API key" education -- not as a sidebar. When Jeff creates his Claude API key, he understands what it is, what it costs, and why it matters.

5. **ClawHub warning** appears once, clearly, with a plain explanation of risk. Then moves on. Do not nag -- Jeff will follow clear instructions.

6. **Browser profile isolation** is a walkthrough step if browser tools are enabled, not a recommendation in a footnote.

7. **Residual risk** is stated honestly at the end of the security setup section. One paragraph: "Here's what we've secured. Here's what risk remains. Here's how to manage it."

### Language Calibration for Jeff

Jeff has zero security background. Every security concept needs a plain-language equivalent:

| Technical Term | Jeff's Version |
|---------------|----------------|
| Localhost | "Only on your computer, not on the internet" |
| Sandbox | "A locked room the AI works inside" |
| API key | "A password that also works as a credit card number" |
| Prompt injection | "Someone hides secret instructions in content the AI reads" |
| FileVault | "Scrambles your hard drive so stolen laptops can't be read" |
| Rate limiting | "A speed limit that prevents rapid guessing of passwords" |
| mDNS/Bonjour | "An announcement that tells other devices on your WiFi that OpenClaw exists" |

Do not use CVSS scores, CVE numbers, or attack chain terminology in the walkthrough without explanation. Jeff needs to understand the IMPACT ("someone could post on your Instagram"), not the technical mechanism.
