# Security Posture — OpenClaw for Jeff

**Date:** 2026-03-03
**Sources:** 62 sources (48 inherited from Output #1, 14 new)
**Key Finding:** OpenClaw's security situation has worsened since Output #1 — CVE count doubled, new attack vectors confirmed (ClawJacked, log poisoning), and the skills ecosystem remains actively hostile. For Jeff's MacBook Air deployment with client data and API tokens at stake, the hardening requirements are non-negotiable, but must be explained in plain language because Jeff has zero security background.

---

## Inherited Findings (Freshness-Checked)

Output #1's security research (2026-02-11, updated 2026-02-22) covered 48+ sources. Below is the freshness status of each major finding as of 2026-03-03.

### Still Current — Fully Applies to Jeff

| Finding | Original Date | Status | Jeff Relevance |
|---------|--------------|--------|----------------|
| **CVE-2026-25253 (1-click RCE, CVSS 8.8)** | 2026-02-02 | CURRENT — patched in v2026.1.29 | Critical. Jeff must be on patched version. |
| **CVE-2026-24763 (command injection)** | 2026-02-02 | CURRENT — patched in v2026.1.29 | Critical. Same version requirement. |
| **Four additional CVEs (Teams token leak, Twitch auth bypass, BlueBubbles path traversal, Telegram token in logs)** | 2026-02-22 | CURRENT — patched through v2026.2.15 | Critical. Minimum safe version now higher (see New Findings). |
| **ClawHub malicious skills (~20% of registry)** | 2026-02-11 | CURRENT and WORSENING — Straiker found 71 additional malicious skills in late Feb 2026. Source: The Hacker News, Tier 2 | Critical. Jeff MUST NOT install any ClawHub skills. Zero tolerance. |
| **42,000+ publicly exposed instances** | 2026-02-22 | CURRENT — Bitsight and NeuralTrust confirmed ongoing exposure. Source: The Hacker News, Tier 2 | Reinforces: localhost binding is essential, not optional. |
| **Default config is dangerously permissive** | 2026-02-11 | CURRENT — unchanged. Source: Context7 official docs, Tier 1 | The walkthrough must configure security BEFORE connecting any channels. |
| **Prompt injection via read content** | 2026-02-11 | CURRENT — new attack vectors confirmed (log poisoning). Source: Eye Security, Tier 2 | Applies to Jeff if agent reads emails or social media content. |
| **Credentials stored unencrypted on disk** | 2026-02-11 | CURRENT — no change to storage model. Source: docs.openclaw.ai, Tier 1 | FileVault is essential on Jeff's MacBook Air. |
| **mDNS/Bonjour information disclosure** | 2026-02-11 | CURRENT. Source: docs.openclaw.ai, Tier 1 | Must disable. Jeff's home network likely has other devices. |
| **Model choice as security control** | 2026-02-11 | CURRENT — Claude Opus 4.6 recommended. Source: docs.openclaw.ai, Tier 1 | Jeff should use Claude Opus 4.6 for prompt injection resistance. |
| **88% of orgs with AI agents reported security incidents** | 2026-02-11 | CURRENT. Source: Gravitee, Tier 2 | Contextual — reinforces that security is not paranoia, it is baseline. |

### Sean-Specific — Does NOT Apply to Jeff

| Finding | Why Sean-Specific |
|---------|-------------------|
| **Tailscale VPN configuration** | Sean runs OpenClaw on a dedicated Mac Mini accessed remotely via Tailscale. Jeff runs OpenClaw on his personal MacBook Air, accessed locally. No VPN needed. |
| **Tailscale ACL configuration** | Same as above — Jeff has no remote access requirement. |
| **SSH hardening** | Jeff will not SSH into his own laptop. |
| **macOS `pf` firewall rules for Tailscale interface** | No Tailscale = no need for interface-specific rules. macOS built-in firewall is sufficient. |
| **Dedicated `openclaw` user account** | Sean's Mac Mini is a dedicated server. Jeff's MacBook Air is his personal laptop — creating a separate macOS user adds complexity that outweighs the benefit for Jeff's use case. Sandbox mode + Docker isolation provides the containment layer instead. |
| **launchd LaunchAgent under dedicated user** | Related to dedicated user — not applicable. |

### Partially Applies — Needs Jeff-Specific Calibration

| Finding | How It Changes for Jeff |
|---------|----------------------|
| **Dedicated machine recommendation** | Sean has a dedicated Mac Mini. Jeff is buying a MacBook Air that will also be his personal laptop. This is a meaningful security tradeoff — the walkthrough must acknowledge that Jeff's client data coexists with OpenClaw on the same machine, making sandbox mode even more critical. |
| **macOS Keychain access concerns** | Still relevant, but Jeff won't create a dedicated user. The walkthrough should warn Jeff to deny any unexpected Keychain permission dialogs and explain what they mean. |
| **exec-approvals.json allowlist/denylist** | Sean's list includes developer tools (rg, git). Jeff's should be far more restrictive — he has no development use case. |
| **Browser profile isolation** | If Jeff uses browser tools for Instagram, a dedicated browser profile is essential to prevent the agent from accessing his logged-in sessions (banking, email, real estate platforms). |

---

## New Findings

Research conducted 2026-03-03 via Context7 and Bright Data. These are findings that emerged AFTER Output #1's last update (2026-02-22).

### CVE-2026-25475: Path Traversal Vulnerability

**Severity:** High | **Disclosed:** Late Feb 2026 | **Patched in:** v2026.2.2
A path traversal vulnerability in the OpenClaw AI assistant allowing filesystem access beyond intended boundaries.
- Source: SentinelOne vulnerability database (Tier 2), NVD (Tier 1)
- **Jeff impact:** Reinforces minimum version requirement.

### Six New Vulnerabilities (Endor Labs, Feb 18 2026)

Endor Labs disclosed six additional vulnerabilities, all patched:

| CVE/Advisory | Type | Severity | Patched |
|-------------|------|----------|---------|
| CVE-2026-26322 | SSRF in Gateway tool | High (CVSS 7.6) | v2026.2.14 |
| CVE-2026-26319 | Missing Telnyx webhook auth | High (CVSS 7.5) | v2026.2.14 |
| CVE-2026-26329 | Path traversal in browser upload | High | v2026.2.14 |
| GHSA-56f2-hvwg-5743 | SSRF in image tool | High (CVSS 7.6) | v2026.2.14 |
| GHSA-pg2v-8xwh-qhcc | SSRF in Urbit auth | Moderate (CVSS 6.5) | v2026.2.14 |
| GHSA-c37p-4qqg-3p76 | Twilio webhook auth bypass | Moderate (CVSS 6.5) | v2026.2.14 |

- Source: Infosecurity Magazine (Tier 2), Endor Labs blog (Tier 2)
- **Key insight from Endor Labs:** "Trust boundaries extend beyond traditional user input. Configuration values, LLM outputs, and tool parameters are potential attack surfaces that require validation."
- **Jeff impact:** Minimum safe version must be >= v2026.2.25 (see ClawJacked below).

### ClawJacked — WebSocket Hijack via Localhost (Feb 28, 2026)

**Severity:** High | **Discovered by:** Oasis Security | **Patched in:** v2026.2.25

This is the most significant new finding since Output #1. The attack works against localhost-bound instances — which is exactly how Jeff's deployment will be configured.

**Attack chain:**
1. Jeff visits a malicious or compromised website in his normal browser
2. JavaScript on the page opens a WebSocket connection to `localhost:18789` (OpenClaw's gateway port)
3. The script brute-forces the gateway password — no rate limiting existed for localhost connections
4. Once authenticated, the script silently registers as a trusted device (auto-approved for localhost)
5. Attacker gains complete control: interact with agent, dump config, enumerate nodes, read logs

**Why this matters for Jeff specifically:** Jeff browses the web normally on the same machine running OpenClaw. He visits real estate sites, client portals, social media. Any compromised page could execute this attack silently. The fix in v2026.2.25 adds rate limiting and removes auto-approval for localhost device registration.

- Source: The Hacker News (Tier 2), Oasis Security blog (Tier 2)
- **MINIMUM SAFE VERSION IS NOW v2026.2.25**

### Log Poisoning Vulnerability (Feb 14, 2026)

**Patched in:** v2026.2.13

Attackers could write malicious content to OpenClaw log files via WebSocket requests. Because the agent reads its own logs for troubleshooting, this enables indirect prompt injection — the agent interprets poisoned log entries as operational information and acts on them.

- Source: Eye Security research blog (Tier 2), GitHub Security Advisory GHSA-g27f-9qjv-22pm (Tier 1)
- **Jeff impact:** Version requirement. Also reinforces that prompt injection is not theoretical — it has multiple proven pathways.

### Infostealers Targeting OpenClaw Users (Late Feb 2026)

Trend Micro documented malicious ClawHub skills distributing Atomic Stealer (macOS information stealer). The attack chain: a seemingly benign skill installs a "prerequisite" that downloads the stealer payload.

Additionally, a threat actor (@liuhui1010) was caught leaving comments on legitimate ClawHub skill pages, urging users to run terminal commands that download Atomic Stealer.

- Source: Trend Micro (Tier 2), The Hacker News (Tier 2), OpenGuardRails (Tier 3)
- **Jeff impact:** ABSOLUTE zero-ClawHub-skills policy. Jeff would be an ideal target — low technical sophistication, macOS user, has API keys and client data.

### Agent-to-Agent Attack Chain (Late Feb 2026)

Straiker uncovered malicious skills that use Moltbook (an AI agent social network) to promote themselves to other agents. One skill (`bob-p2p-beta`) instructed agents to store Solana wallet private keys in plaintext and purchase worthless tokens through attacker infrastructure. This is a supply chain attack with social engineering layered on top.

- Source: Straiker/Somalkar & Regalado (Tier 2), The Hacker News (Tier 2)
- **Jeff impact:** Not directly relevant (Jeff won't use crypto skills), but demonstrates the ecosystem's hostility level. The principle transfers: never trust community-contributed skills.

### OpenClaw v2026.2.23 Security Hardening Features

The latest releases added:
- Optional HSTS headers for gateway
- Stricter bind+auth guardrails (non-loopback binds now require auth — fails closed)
- Rate limiting for localhost connections (ClawJacked fix)
- Device registration now requires user approval even from localhost

- Source: Penligent AI (Tier 3), Context7 troubleshooting docs (Tier 1)
- **Jeff impact:** Positive — newer versions are meaningfully more secure by default.

### Real Estate + AI Data Security Context (Feb 2026)

Inman Connect New York (Feb 2026) featured sessions on AI data security in real estate specifically:
- "Feeding sensitive client information into AI tools introduces new exposure points"
- AI-generated deepfakes identified as emerging wire-fraud vector in real estate transactions
- Industry consensus: "Vet technology partners carefully, understand how platforms handle data"

Separately, Real Estate News reported that MLSs are pursuing "license, not lawsuit" strategies to create AI data guardrails. The regulatory environment around AI + real estate data is tightening.

- Source: Inman.com (Tier 4 — industry press, not security-specific), Real Estate News (Tier 4)
- **Jeff impact:** Validates that Jeff's industry is actively grappling with this. His concern about data security is not paranoia — it is aligned with where the industry is heading. This context belongs in the walkthrough.

---

## Jeff's Risk Profile

### What's at Stake

Jeff is not a developer running experiments. He is a real estate agent whose livelihood depends on client trust. The data at risk:

| Asset | Type | If Compromised |
|-------|------|---------------|
| **Client names and contact info** | PII | Breach of professional trust. Potential legal liability. Reputational damage in a market of 20,000 agents where Jeff is ranked #1-2. |
| **Client addresses** | PII | Physical safety concern for clients. Property security concern. |
| **Contract details** | Business confidential | Financial exposure, deal disruption, professional liability. |
| **Instagram API token** | Credential | Unauthorized posts from @jeffanswers. Brand damage. Account takeover. |
| **Claude API key** | Credential | Financial exposure — unauthorized API usage billed to Jeff. |
| **Chat history / session logs** | Business intelligence | Contains client conversations, business strategy, personal communications. |
| **Browser sessions (if browser tool enabled)** | Session tokens | Access to Jeff's email, banking, real estate platforms, contract software. |

### Threat Actors Relevant to Jeff

| Actor | Motivation | Likelihood | Notes |
|-------|-----------|------------|-------|
| **Malicious ClawHub skills** | Credential theft, crypto mining | HIGH | 20%+ malicious rate. Atomic Stealer specifically targets macOS. Jeff is an ideal target. |
| **Opportunistic scanners** | Gateway takeover | LOW (if localhost-bound) | ClawJacked demonstrated this is possible even on localhost. Patched in v2026.2.25. |
| **Prompt injection via content** | Data exfiltration | MEDIUM | If Jeff's agent reads emails, social media, or web content, any of it can carry adversarial instructions. |
| **Social engineering** | Account access, financial fraud | MEDIUM | AI deepfakes of Jeff's voice/image could target clients. Not an OpenClaw vulnerability, but part of the threat landscape. |

### What Jeff Does NOT Face

- **Targeted nation-state attacks** — Jeff is not an infrastructure target
- **Enterprise lateral movement** — Jeff has no corporate network
- **Multi-service orchestration attacks** — Jeff's setup is simple (one agent, limited tools)

The threat model is simpler than Sean's. But the consequences of a breach are arguably higher because Jeff's business is built on personal relationships and trust, and his client data carries real-world implications (addresses, financial details).

---

## Three-Tier Hardening for Jeff

### Tier 1: Essential (Non-Negotiable)

These steps MUST be completed before Jeff connects any messaging channels or grants any tool permissions. Skipping any of these creates a concrete, exploitable vulnerability.

#### 1.1 Install the Correct Version

**What:** OpenClaw version must be >= v2026.2.25.
**Why in plain terms:** Older versions have known security holes that let attackers take control of your AI agent — even if it's only running on your own computer. The most recent fix (v2026.2.25) closes a hole where any website you visit could silently connect to your agent.
**Verification:** Run `openclaw --version` and confirm >= 2026.2.25.
- Source: NVD, Oasis Security, The Hacker News (Tiers 1-2)
- Transfers to: ANY software — always run patched versions. This is universal.

#### 1.2 Enable Gateway Authentication

**What:** Set a strong, random authentication token on the gateway.
**Why in plain terms:** The gateway is the front door to your AI agent. Without a password, anyone who can reach it (even code running in your web browser) can tell your agent what to do. Generate a long random token and never share it.
**Config:**
```json5
{
  gateway: {
    auth: {
      mode: "token",
      token: "YOUR-64-CHAR-RANDOM-TOKEN"  // Generate: openclaw doctor --generate-gateway-token
    }
  }
}
```
- Source: docs.openclaw.ai (Tier 1), Context7 (Tier 1)
- Transfers to: Every service you run needs authentication. No exceptions.

#### 1.3 Bind to Localhost Only

**What:** Configure the gateway to listen only on `127.0.0.1` (your computer), not on the network.
**Why in plain terms:** "Localhost" means "only accessible from this computer." If the gateway listens on the network instead, anyone on your home WiFi — or potentially the internet — can reach it. Since Jeff accesses OpenClaw directly on his MacBook Air (not remotely), localhost is all that's needed.
**Config:**
```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    port: 18789
  }
}
```
- Source: docs.openclaw.ai (Tier 1), Kaspersky (Tier 2)
- Transfers to: Any local service should only listen where it needs to. Don't expose things to the network unnecessarily.

#### 1.4 Enable Sandbox Mode

**What:** Run all agent tool execution inside Docker containers (isolated environments).
**Why in plain terms:** A sandbox is like a locked room for the AI agent to work in. If the agent is tricked into doing something harmful (by a malicious message, a poisoned email, a bad website), the sandbox keeps the damage contained. Without it, a tricked agent could access everything on your computer — including your client files, browser sessions, and saved passwords.
**Config:**
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        scope: "session",
        docker: {
          network: "none",
          readOnlyRoot: true,
          capDrop: ["ALL"],
          user: "1000:1000"
        }
      }
    }
  }
}
```
- Source: docs.openclaw.ai (Tier 1), Semgrep (Tier 2), Auth0 (Tier 2)
- Transfers to: Any software that runs code on your behalf should be sandboxed. This is the "padded room" principle.

#### 1.5 Disable Elevated Mode

**What:** Prevent the agent from bypassing the sandbox to run commands directly on your Mac.
**Why in plain terms:** "Elevated mode" is an escape hatch that lets the agent run commands outside its locked room. Jeff has no reason to enable this. Leaving it off means even if the agent is compromised, it cannot execute commands directly on your MacBook.
**Config:**
```json5
{
  tools: {
    elevated: {
      enabled: false
    }
  }
}
```
- Source: docs.openclaw.ai (Tier 1)
- Transfers to: Always disable escape hatches you don't need.

#### 1.6 Zero ClawHub Skills

**What:** Do not install ANY community skills from ClawHub.
**Why in plain terms:** ClawHub is like an app store for OpenClaw — but roughly 1 in 5 "apps" there are actually malware designed to steal your passwords, API keys, and data. Confirmed macOS malware (Atomic Stealer) has been distributed through ClawHub. The only skills Jeff should use are ones built locally by the walkthrough.
- Source: Koi Security (Tier 2), Trend Micro (Tier 2), Straiker (Tier 2)
- Transfers to: Never install extensions/plugins from unvetted marketplaces. This applies to browser extensions, WordPress plugins, everything.

#### 1.7 Enable FileVault (Full-Disk Encryption)

**What:** Turn on macOS full-disk encryption.
**Why in plain terms:** All of OpenClaw's data — your API keys, chat history, agent configurations — is stored as regular files on your hard drive, not encrypted by the app itself. If your MacBook is stolen (from your car, office, open house), FileVault ensures that data is unreadable without your login password.
**Verification:** System Settings > Privacy & Security > FileVault > ON.
- Source: docs.openclaw.ai (Tier 1), Apple documentation (Tier 1)
- Transfers to: Every laptop with sensitive data should have full-disk encryption. Period.

#### 1.8 Enable macOS Firewall

**What:** Turn on the built-in macOS firewall with stealth mode.
**Why in plain terms:** The firewall prevents other devices on your network from finding and connecting to services on your MacBook. "Stealth mode" means your computer doesn't even respond to network probes — it's invisible.
**How:** System Settings > Network > Firewall > ON. Click Options > Enable stealth mode.
- Source: Apple documentation (Tier 1), security best practice
- Transfers to: Every computer should have its firewall enabled.

#### 1.9 Disable mDNS/Bonjour Broadcasting

**What:** Stop OpenClaw from announcing its presence on the local network.
**Why in plain terms:** By default, OpenClaw broadcasts "I'm here!" on your home network, including technical details about your setup. Anyone on your WiFi can see this. Turning it off is like pulling down the "OPEN" sign.
**Config:**
```json5
{
  discovery: {
    mdns: { mode: "off" }
  }
}
```
- Source: docs.openclaw.ai (Tier 1)
- Transfers to: Disable service discovery for anything that doesn't need to be found by other devices.

#### 1.10 Run the Built-In Security Audit

**What:** After all configuration, run OpenClaw's own security checker.
**Why in plain terms:** OpenClaw includes a tool that checks your setup for common security mistakes. Run it after configuration to catch anything the walkthrough might have missed.
**Command:**
```bash
openclaw security audit
openclaw security audit --fix  # Auto-fix common issues
```
- Source: docs.openclaw.ai (Tier 1)
- Transfers to: Many tools have built-in security audits. Always run them.

### Tier 2: Educational (Understanding Security)

These steps improve security, but the real value is understanding WHY they matter. The concepts transfer to every tool Jeff will ever use.

#### 2.1 Why a Dedicated Machine Matters (Even Though Jeff Doesn't Have One)

**The principle:** Running AI agents on the same computer as your sensitive data increases risk. If the agent is compromised, it can potentially access everything else on the machine.

**Jeff's situation:** Jeff is buying a MacBook Air for this. It will also be his personal laptop. This is a meaningful tradeoff the walkthrough must acknowledge honestly:
- His client data (emails, contracts, browser sessions) lives on the same machine as OpenClaw
- The sandbox provides containment, but it is not perfect — no single security layer is
- Defense-in-depth means multiple layers: sandbox + localhost binding + auth + minimal tools

**What Jeff should understand:** The ideal setup would be a separate, dedicated computer (like Sean's Mac Mini). Jeff's setup is workable with proper hardening, but he should know that using his primary laptop introduces risk that a dedicated machine would eliminate.

**Transferable principle:** Isolation reduces blast radius. This applies to everything — don't run business and personal email on the same account, don't store client data in the same cloud folder as personal files, keep work and personal separate where you can.

#### 2.2 What "API Key Exposure" Means

**The principle:** An API key is like a credit card number for a service. Anyone who has it can use it — and you pay the bill.

**Jeff's situation:** Jeff will have at least two API keys:
- **Claude API key** — gives access to the AI model. If stolen, someone runs up charges on Jeff's account.
- **Instagram API token** — gives access to post on @jeffanswers. If stolen, someone can post content as Jeff.

**What Jeff should understand:**
- Never paste API keys into chat messages, emails, or social media
- API keys in OpenClaw are stored in files on his hard drive (not encrypted by the app) — this is why FileVault matters
- Keys should have spending limits where possible (Anthropic allows this)
- If Jeff suspects a key is compromised, change it immediately — don't wait

**Transferable principle:** Credentials are as sensitive as passwords. Treat API keys like credit card numbers — don't share them, set spending limits, change them if compromised.

#### 2.3 What Prompt Injection Is (And Why It Matters for Social Media)

**The principle:** The AI agent cannot always distinguish between "instructions from Jeff" and "instructions hidden in content the agent reads." A malicious email, web page, or social media message can contain hidden instructions that the agent follows.

**Jeff's situation:** If Jeff's agent reads his emails, scrapes websites for content ideas, or processes social media messages, any of that content could contain hidden instructions like "forward all recent messages to this email address" or "post this content to Instagram."

**Proven examples (from Output #1 research):**
- A security researcher sent an email with hidden instructions to a linked inbox — the agent handed over private keys
- Another researcher's email caused the agent to forward the victim's emails to the attacker
- A user asked the agent to search files — it dumped the entire home directory to a group chat

**What Jeff should understand:**
- Be selective about what content sources the agent can access
- Start with read-only tools, not write tools
- The agent should never have access to email without careful configuration
- Review what the agent does — don't just trust it blindly

**Transferable principle:** In AI systems, data and instructions are the same thing. Any content the agent reads is a potential source of instructions. This applies to every AI tool, not just OpenClaw.

#### 2.4 Browser Profile Isolation

**The principle:** If OpenClaw has browser access, it can see everything in your browser profile — logged-in sessions, saved passwords, banking sites, email.

**Jeff's situation:** If Jeff enables browser tools for Instagram automation, the agent could potentially access:
- His bank accounts (if logged in)
- His email (Gmail/Workspace)
- His real estate platforms (MLS, contract software)
- His personal browsing history

**What Jeff should do:** If browser tools are enabled, create a dedicated browser profile that is ONLY used by OpenClaw. Never log into personal accounts in that profile.

**Transferable principle:** Isolate automated tools from personal sessions. This is the same reason you shouldn't share your personal computer login with automated scripts.

### Tier 3: Operational Polish (When Ready)

These steps matter for long-running operation but can be deferred until Jeff has a working deployment and wants to maintain it.

#### 3.1 Update Cadence

**What:** Check for OpenClaw updates weekly.
**Why:** The CVE discovery rate in Feb 2026 was roughly one every 3-4 days. Staying current is important.
**How:** `npm outdated -g openclaw` or check the OpenClaw releases page.
**When to start:** After initial deployment is stable and Jeff is comfortable with the basics.

#### 3.2 Basic Log Review

**What:** Periodically check if anything unexpected happened.
**Why:** If the agent receives a prompt injection or behaves unexpectedly, the logs will show it.
**How:** `openclaw security audit --deep` once a week.
**When to start:** After Jeff has been using the system for a week or two and understands what "normal" looks like.

#### 3.3 API Key Rotation

**What:** Change API keys every 30-90 days.
**Why:** Limits the window of exposure if a key was leaked without Jeff knowing.
**How:** Generate new key in Anthropic/Instagram dashboard, update in OpenClaw config, delete old key.
**When to start:** After initial deployment. Set a calendar reminder.

#### 3.4 Session Transcript Cleanup

**What:** Periodically delete old session transcripts.
**Why:** Session transcripts contain everything the agent saw and did — including client names, messages, and data. Accumulating months of transcripts increases what an attacker could access.
**How:** Delete files in `~/.openclaw/agents/*/sessions/` older than 30 days.
**When to start:** After a month of use.

#### 3.5 Spending Limit on Claude API

**What:** Set a monthly spending cap on the Anthropic API.
**Why:** If Jeff's API key is compromised, the attacker can run up unlimited charges. A spending cap limits the damage.
**How:** Set in Anthropic console under API key settings.
**When to start:** Immediately when setting up the API key (this is lightweight enough to do during setup).

---

## Residual Risk

After all hardening tiers are applied, the following risks remain. These cannot be eliminated — only acknowledged and managed.

### Risk 1: Shared Machine

**What remains:** Jeff's MacBook Air runs both OpenClaw and his personal/business applications. If the Docker sandbox is breached (through a zero-day vulnerability, for example), the agent could access Jeff's client files, browser sessions, and credentials.
**Likelihood:** Low (Docker container escapes are rare and require sophisticated attackers).
**Mitigation:** The sandbox, combined with minimal tool permissions and localhost binding, creates multiple layers. A dedicated machine would eliminate this risk entirely, but Jeff's situation makes that impractical.
**Honest assessment:** This is the biggest residual risk in Jeff's deployment. The walkthrough should acknowledge it plainly.

### Risk 2: Zero-Day Vulnerabilities

**What remains:** OpenClaw's CVE discovery rate in Feb 2026 was approximately 12+ vulnerabilities in 4 weeks. The project's security surface is large and under active scrutiny. New vulnerabilities will be found.
**Likelihood:** HIGH that new CVEs will be discovered. LOW-MEDIUM that Jeff will be targeted by one before a patch is available.
**Mitigation:** Keep OpenClaw updated. Run `openclaw security audit` regularly. The sandbox limits blast radius even for unknown vulnerabilities.
**Honest assessment:** This is an actively evolving security surface. Jeff is accepting the risk of running software that is being rapidly patched.

### Risk 3: Prompt Injection Has No Complete Solution

**What remains:** No current technology can fully prevent prompt injection in AI agents. The fundamental problem — that data and instructions are indistinguishable to the model — has no architectural fix.
**Likelihood:** MEDIUM — depends on what content sources Jeff's agent reads.
**Mitigation:** Limit content sources. Use read-only tools. Review agent actions. Use Claude Opus 4.6 (strongest at rejecting injections).
**Honest assessment:** If the agent reads untrusted content (emails, web pages, social media), prompt injection is possible. The walkthrough should limit content sources aggressively.

### Risk 4: API Key Exposure Window

**What remains:** API keys are stored unencrypted on disk. Between rotation cycles, a compromised key remains valid.
**Likelihood:** LOW if FileVault is enabled and Jeff's machine is not physically compromised.
**Mitigation:** FileVault, spending limits, rotation schedule.
**Honest assessment:** Acceptable risk for Jeff's use case. FileVault is the critical control.

### Risk 5: Instagram Brand Risk

**What remains:** If Jeff's Instagram API token or agent is compromised, unauthorized content could be posted to @jeffanswers — his business account with 20,000 agent peers watching.
**Likelihood:** LOW if ClawHub skills are avoided and the agent is properly sandboxed.
**Mitigation:** Human review of all posts before publishing (at least initially). The walkthrough should build a review workflow, not fully automated posting.
**Honest assessment:** Jeff should never allow fully autonomous posting without a review step. The reputational risk is too high for a top-ranked agent.

---

## Recommendations for Walkthrough

### How Security Content Should Be Presented

Per DNA principle #4 (Security as a Lens), security should be evaluated inline at the point of decision, not deferred to an appendix. Specific recommendations:

1. **Authentication and localhost binding** should be configured in the same walkthrough step as the initial OpenClaw setup — not in a separate "security" section. The message: "This is how you set it up. There is no insecure way to set it up."

2. **Sandbox mode** should be framed as part of installation, not as hardening. Jeff should never see OpenClaw running without sandbox mode. The walkthrough enables it before the agent does anything.

3. **FileVault** should be verified at the very start of the walkthrough (before Docker, before OpenClaw). If it's not on, the walkthrough pauses until it is.

4. **API key setup** should include the "what is an API key" educational content inline — not as a sidebar. When Jeff creates his Claude API key, he understands what it is, what it costs, and why it matters to protect it.

5. **ClawHub warning** should appear once, clearly, and never be revisited. Don't nag — explain the risk plainly, state the policy (zero ClawHub skills), and move on. Jeff will follow clear instructions; he doesn't need repeated warnings.

6. **Browser profile isolation** should be a walkthrough step, not a recommendation. If browser tools are enabled, the walkthrough creates the dedicated profile.

7. **Residual risk** should be stated honestly at the end of the security setup section. One paragraph: "Here's what we've secured. Here's what risk remains. Here's how to manage it." Jeff deserves to know.

### Language Calibration

Jeff has zero security background. Every security concept needs a plain-language explanation:
- "Localhost" = "only on your computer, not on the internet"
- "Sandbox" = "a locked room the AI works inside"
- "API key" = "a password that also works as a credit card number"
- "Prompt injection" = "someone hides secret instructions in content the AI reads"
- "FileVault" = "scrambles your hard drive so stolen laptops can't be read"

Do not use: CVSS scores, CVE numbers, attack chain terminology, or security jargon without explanation. Jeff needs to understand the IMPACT ("someone could post on your Instagram"), not the technical mechanism ("SSRF via unvalidated URL parameter").

---

## Source Index for This Analysis

### New Sources (2026-03-03)

| Source | URL | Tier | Key Finding |
|--------|-----|------|-------------|
| Infosecurity Magazine | infosecurity-magazine.com/news/researchers-six-new-openclaw/ | 2 | Six new CVEs discovered by Endor Labs |
| The Hacker News (ClawJacked) | thehackernews.com/2026/02/clawjacked-flaw-lets-malicious-sites.html | 2 | ClawJacked WebSocket hijack via localhost, log poisoning, 71 malicious skills, agent-to-agent attacks |
| SentinelOne | sentinelone.com/vulnerability-database/cve-2026-25475/ | 2 | CVE-2026-25475 path traversal |
| SonicWall | sonicwall.com/blog/openclaw-auth-token-theft-leading-to-rce-cve-2026-25253 | 2 | CVE-2026-25253 detailed analysis |
| Oasis Security | oasis.security/blog/openclaw-vulnerability | 2 | ClawJacked discovery and disclosure |
| Eye Security | research.eye.security/log-poisoning-in-openclaw/ | 2 | Log poisoning vulnerability analysis |
| Trend Micro | trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html | 2 | Atomic Stealer distribution via ClawHub skills |
| Straiker | straiker.ai/blog/built-on-clawhub-spread-on-moltbook-the-new-agent-to-agent-attack-chain | 2 | Agent-to-agent attack chain via ClawHub + Moltbook |
| Endor Labs | endorlabs.com/learn/how-ai-sast-traced-data-flows-to-uncover-six-openclaw-vulnerabilities | 2 | Six vulnerability disclosures with analysis |
| Penligent AI | penligent.ai/hackinglabs/openclaw-2026-2-23-brings-security-hardening-and-new-ai-features | 3 | v2026.2.23 security hardening features |
| Context7 (security/index.md) | docs.openclaw.ai/gateway/security | 1 | Secure baseline configuration, auth/bind guardrails |
| Context7 (troubleshooting.md) | docs.openclaw.ai/gateway/troubleshooting | 1 | Post-upgrade security behavior changes |
| Inman.com | inman.com/2026/02/06/3-ways-artificial-intelligence-will-reshape-real-estate-in-2026/ | 4 | Real estate industry AI security concerns |
| Real Estate News | realestatenews.com/2026/02/23/ai-and-real-estate-data-whos-making-the-rules | 4 | MLS data governance and AI guardrails |

### Inherited Sources (48 from Output #1)

Full source index at `outputs/openclaw-sean/knowledge-base/03-security/security-posture-analysis.md` (Source Index section). All inherited sources freshness-checked on 2026-03-03 — findings remain current.
