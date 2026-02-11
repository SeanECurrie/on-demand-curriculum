# Phase 1 Report: Security Evaluation

**Date:** 2026-02-11
**Sources:** Context7 + Bright Data (48+ security-specific sources)
**Report Type:** Security evaluation for Mac Mini deployment decision

---

## Security Verdict

OpenClaw is viable for Sean's dedicated Mac Mini deployment, but it is a high-risk, high-reward system requiring strict hardening before any messaging channels are connected. The default configuration is dangerously permissive, the skills ecosystem is actively compromised (12% malicious rate), and critical vulnerabilities were disclosed just 9 days ago. Deploy with loopback-only gateway, full sandboxing, aggressive tool restrictions, zero ClawHub skills, and continuous monitoring. This is NOT a "set and forget" deployment — it requires ongoing security discipline.

---

## Critical Findings (Must Address Before Deployment)

### 1. CVE-2026-25253 (CVSS 8.8) — 1-Click RCE via Auth Token Exfiltration
**Disclosed:** February 2, 2026 (9 days ago)
**Patched in:** v2026.1.29+

**Kill chain:**
1. Victim clicks malicious link or visits compromised webpage
2. OpenClaw blindly accepts `gatewayUrl` URL parameter
3. WebSocket connection to attacker's server sends auth token (cross-site WebSocket hijacking)
4. Attacker uses stolen token to disable exec approvals (`ask: "off"`)
5. Attacker forces host execution instead of Docker sandbox
6. Attacker executes arbitrary commands via `node.invoke`

**Key insight:** Even localhost-only instances are vulnerable because the attack pivots through the victim's browser.

**Required action:** MUST be on v2026.1.29 or later before deployment. Verify with `openclaw --version`.

**Sources:** SOCRadar (Tier 1), NVD (Tier 1), runZero (Tier 2), The Hacker News (Tier 2)

---

### 2. CVE-2026-24763 — Command Injection in Docker Sandbox
**Disclosed:** February 2, 2026
**Patched in:** v2026.1.29+

Command injection in OpenClaw's Docker sandbox execution mechanism allows code execution outside the intended sandbox boundary.

**Required action:** Same version requirement as above (v2026.1.29+).

**Sources:** NVD (Tier 1), Tenable (Tier 2)

---

### 3. ClawHub Skills Ecosystem Actively Compromised (12% Malicious)
**Status:** Ongoing threat

**Findings:**
- 341 confirmed malicious skills out of 2,857 audited by Koi Security (12% malicious rate)
- Academic research: 26% of agent skills across the LLM ecosystem contain at least one vulnerability (8,126/31,132 skills)
- Attack techniques in the wild:
  - ClickFix-style lures inducing manual malware installation
  - Typosquatting on popular skill names
  - Reputation washing (intermediate benign versions to build trust)
  - Password-protected archives, base64-encoded commands
  - `curl | bash` patterns
  - `xattr -d com.apple.quarantine` (macOS Gatekeeper bypass)
  - Auto-update behaviors pulling remote payloads

**Known malicious C2 infrastructure:** `91[.]92[.]242[.]30`

**Required action:** Install ZERO skills from ClawHub initially. If skills are needed later, vet using Cisco's skill scanner. Red flags: external downloads required, base64 encoding, `curl | bash`, Gatekeeper bypass commands, auto-updates.

**Sources:** Koi Security (Tier 2), Semgrep (Tier 2), The Hacker News (Tier 2), arXiv:2601.10338 (Tier 2), Cisco (Tier 2)

---

### 4. ~1000 Exposed Instances on Shodan + 1.5M API Keys Leaked
**Status:** Affects community, not our deployment IF configured correctly

Researcher @fmdz387 found nearly 1,000 publicly accessible OpenClaw instances without authentication. Researcher Jamieson O'Reilly gained access to Anthropic API keys, Telegram bot tokens, Slack accounts, and months of chat history on exposed instances. LinkedIn post by Luke Hinds documented 1.5 million API keys exposed through misconfigurations.

**Required action:** Loopback bind (`gateway.bind: "loopback"`) + Tailscale-only access prevents this entirely. NEVER bind to `0.0.0.0` or LAN IP.

**Sources:** Kaspersky citing X/Twitter researchers (Tier 2-3), LinkedIn/Luke Hinds (Tier 3)

---

### 5. 512 Vulnerabilities Found in Security Audit (8 Critical)
**Status:** Late January 2026 audit

A security audit of OpenClaw (when still branded as Clawdbot) identified 512 vulnerabilities, 8 classified as critical. Details not publicly disclosed.

**Required action:** Use the latest version (v2026.1.29+) which includes significant security hardening. Monitor changelog for future fixes.

**Sources:** Kaspersky citing Facebook developer group (Tier 2-4)

---

## Tim's Recommendations — Our Assessment

| Tim's Recommendation | Status | Sean's Deployment |
|---------------------|--------|-------------------|
| **Dedicated/disposable machine** | **STRONGLY VALIDATED** — Universal consensus. Kaspersky, Semgrep, Auth0 all echo this. | Mac Mini M4 (dedicated) satisfies perfectly. |
| **Tailscale VPN** | **VALIDATED + ENHANCED** — OpenClaw has dedicated Tailscale docs. Gateway can use Tailscale identity headers for auth. Tailscale Serve keeps gateway on loopback while handling access. | Already configured. Use Tailscale ACLs to restrict access to Sean's laptop + phone only. |
| **Non-root user** | **VALIDATED, macOS approach differs** — Tim used Debian non-root. macOS: create dedicated `openclaw` user (NOT admin) and run gateway under it. | Create dedicated `openclaw` user account, non-admin. |
| **SSH key-only auth** | **VALIDATED, Tailscale SSH supersedes** — Tailscale SSH manages keys via identity system. Traditional SSH config less critical. | Tailscale SSH (`tailscale up --ssh`) + ACLs. |
| **Firewall** | **VALIDATED, macOS gap** — Tim configured Hostinger firewall (block all, allow Tailscale UDP 41641). He did NOT cover macOS `pf` firewall. | macOS built-in firewall + stealth mode ON. Loopback bind makes port-specific rules less critical, but enable anyway. |
| **Gateway auth token** | **VALIDATED, now required by default** — Docs confirm fail-closed posture. | Generate 64-char token via `openclaw doctor --generate-gateway-token`. |

**What Tim got right:** Dedicated machine, Tailscale, auth token, non-root user. These are foundational.

**What Tim understated:** He mentioned skills but didn't warn about the 12% malicious rate. He didn't cover the exec-approvals system or sandbox configuration depth.

**What Tim missed (not his fault — most disclosed after his video):**
- CVE-2026-25253 and CVE-2026-24763 (disclosed Feb 2)
- ClawHub supply chain attack scale (341 malicious skills)
- exec-approvals.json system
- mDNS/Bonjour information disclosure
- Credential storage on disk (unencrypted)
- Model choice as security control (Opus 4.6 for prompt injection resistance)
- Browser profile isolation
- Reader agent pattern for untrusted content
- macOS Keychain access concerns

---

## Threat Model Summary

| Threat | Likelihood | Impact | Risk Level | Mitigation |
|--------|-----------|--------|------------|------------|
| **CVE-2026-25253 (1-click RCE)** | High (if unpatched) | Critical (full system compromise) | **CRITICAL** | Patch to v2026.1.29+ |
| **CVE-2026-24763 (command injection)** | High (if unpatched) | Critical (arbitrary command execution) | **CRITICAL** | Patch to v2026.1.29+ |
| **Malicious ClawHub skill installation** | Medium | High (credential theft, malware) | **HIGH** | Zero ClawHub skills initially |
| **Prompt injection via read content** | High | High (data exfiltration, unauthorized tool calls) | **HIGH** | Sandbox + tool restrictions + reader agent pattern |
| **Credential exposure on disk** | Medium | High (API keys, tokens, chat history) | **HIGH** | File permissions 600/700, FileVault, dedicated user |
| **macOS Keychain access** | Low-Medium | Medium (unexpected permission grants) | **MEDIUM** | Dedicated user account, monitor TCC dialogs |
| **mDNS information disclosure** | Low (Tailscale limits LAN exposure) | Low | **LOW** | Disable or set minimal mode |
| **Gateway exposed on LAN** | Low (Tailscale + loopback bind) | Critical | **LOW** (mitigated) | Loopback bind + Tailscale = strong |

### Attack Surface for Mac Mini Deployment

| Surface | Exposure | Notes |
|---------|----------|-------|
| **Gateway WebSocket (port 18789)** | Localhost only if configured correctly | Default bind is loopback — good. Reverse proxy misconfiguration can bypass (Kaspersky confirmed ~1000 exposed instances). |
| **Messaging channels (Telegram, etc.)** | Inbound messages from paired contacts | Primary prompt injection vector. Even with DM pairing, content the agent reads (emails, URLs, docs) carries adversarial instructions. |
| **ClawHub skills** | Supply chain attack vector | 341 confirmed malicious skills. |
| **Tailscale tunnel** | Encrypted, authenticated | Strongest layer in our setup. Only Tailscale-authorized devices can reach the Mac Mini. |
| **macOS local filesystem** | Full access if sandbox is off | `~/.openclaw/` contains credentials, session transcripts, API keys — all unencrypted on disk. |
| **mDNS/Bonjour broadcast** | LAN information disclosure | Default "full" mode broadcasts CLI path, SSH port, hostname. Enables reconnaissance. |
| **Browser control (CDP)** | Remote code execution if exposed | If enabled, equivalent to operator-level access. |
| **macOS Keychain** | Permission dialog risk | Reported: user received unexpected Keychain access dialogs. Needs investigation. |
| **Deep links (`openclaw://`)** | Local automation trigger | Without `key` parameter: requires user confirmation. With valid `key`: runs unattended. |

---

## Recommended Security Configuration

**Full details in `/Users/seancurrie/Desktop/clawdbot-research-project/knowledge-base/03-security/security-posture-analysis.md` — this is the high-level summary.**

### Gateway: Loopback Bind, Token Auth, DM Pairing
```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",            // CRITICAL: localhost only
    port: 18789,
    auth: {
      mode: "token",
      token: "YOUR-64-CHAR-RANDOM-TOKEN"
    }
  },
  channels: {
    telegram: {
      dmPolicy: "pairing",       // Require pairing for DMs
      groups: {
        "*": { requireMention: true }
      }
    }
  },
  discovery: {
    mdns: { mode: "off" }        // Disable Bonjour
  }
}
```

### Sandbox: Full Isolation, Read-Only Tools Initially
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",             // Sandbox ALL sessions
        scope: "session",        // Per-session isolation (strictest)
        docker: {
          readOnlyRoot: true,
          network: "none",       // No network access from sandbox
          capDrop: ["ALL"]       // Drop all Linux capabilities
        }
      }
    }
  },
  tools: {
    elevated: {
      enabled: false             // DISABLE elevated mode entirely
    },
    sandbox: {
      tools: {
        allow: ["read", "sessions_list"],
        deny: ["browser", "exec", "process", "write", "edit"]
      }
    }
  }
}
```

### exec-approvals: Deny Dangerous Commands
```json
{
  "defaults": {
    "security": "deny",
    "ask": "on-miss"
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "denylist": [
        { "pattern": "/usr/bin/security" },   // macOS Keychain CLI
        { "pattern": "xattr" },               // Gatekeeper bypass
        { "pattern": "rm -rf" },
        { "pattern": "chmod" },
        { "pattern": "sudo" },
        { "pattern": "find /" },
        { "pattern": "find ~" }
      ]
    }
  }
}
```

### Skills: Zero ClawHub Skills Initially
- Install NO skills from ClawHub until vetting process matures.
- If skills needed later, vet using Cisco's skill scanner.
- Red flags: external downloads, base64, `curl | bash`, `xattr -d`, auto-updates.

### Network: Tailscale-Only Access
```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["sean-laptop", "sean-phone"],
      "dst": ["mac-mini-openclaw:18789"]
    }
  ]
}
```

### macOS: Dedicated User, FileVault, pf Firewall
- Create dedicated `openclaw` user account (NOT admin)
- Enable FileVault (full-disk encryption) — mandatory
- Enable macOS built-in firewall + stealth mode
- Verify SIP enabled: `csrutil status`
- File permissions: `chmod 700 ~/.openclaw`, `chmod 600` for all credentials and config files

---

## The "Lethal Trifecta" Problem

**Palo Alto Networks' AI agent risk framework:** System access + Untrusted content + Memory retention = Catastrophic risk

### How Each Leg Applies to OpenClaw

**1. System Access**
OpenClaw agents can execute arbitrary commands, read/write files, browse the web, manage processes — equivalent to operator-level access if tools are unrestricted.

**2. Untrusted Content**
Even with DM pairing locked down, agents read emails, web pages, GitHub issues, PDFs — ALL of which can contain embedded prompt injection instructions. The sender is not the only threat surface; the content itself is hostile.

**3. Memory Retention**
OpenClaw retains full session transcripts (`~/.openclaw/agents/*/sessions/*.jsonl`) including private messages, tool output, API keys in logs. A successful prompt injection can instruct the agent to exfiltrate its own memory.

### Our Configuration's Response to Each Leg

| Leg | Mitigation |
|-----|------------|
| **System Access** | Sandbox mode `all` + scope `session` = per-session Docker containers with no network, read-only root, all capabilities dropped. Elevated mode disabled entirely. Tool allowlist starts with read-only tools only. exec-approvals denylist blocks dangerous commands. |
| **Untrusted Content** | DM pairing + requireMention in groups limits inbound messaging. Reader agent pattern (read-only, tool-disabled agent summarizes untrusted content, passes summary to main agent) contains prompt injections. Model choice: Claude Opus 4.6 (strongest prompt injection resistance). |
| **Memory Retention** | File permissions 600/700 on session transcripts. FileVault encrypts at rest. Dedicated user account contains blast radius. Monthly transcript pruning. |

**Assessment:** Configuration significantly reduces trifecta risk, but cannot eliminate it entirely. Prompt injection remains the hardest leg to defend — it's an AI alignment problem, not a configuration problem.

---

## What Cannot Be Mitigated Through Configuration

### 1. Prompt Injection (Fundamental AI Alignment Problem)
Semgrep Principle 1: "In agentic systems, the boundary between data and code does not exist." The LLM consumes data and produces code (tool calls). Input sanitization strategies assume you can identify "the input" — when the agent reads a webpage, summarizes an email, and generates a shell command, ALL of it is input.

**Residual risk:** Even with reader agent pattern, sandbox, and tool restrictions, a sufficiently sophisticated prompt injection can trick the model into unauthorized actions within its allowed toolset.

**Mitigation strategy:** Defense in depth. Sandbox limits blast radius. Tool restrictions limit available actions. Reader agent pattern contains injections in untrusted content. Model choice (Opus 4.6) improves resistance. But this is NOT solved — it's managed.

### 2. Supply Chain Risk (NPM Dependencies)
OpenClaw is installed via `npm install -g openclaw`. NPM package compromise is a known attack vector (University of Toronto advisory cited compromised NPM packages in late 2025).

**Residual risk:** A compromised dependency in OpenClaw's supply chain could introduce backdoors.

**Mitigation strategy:** Install from official NPM registry only. Monitor security advisories. Run in sandboxed environment to contain potential compromise.

### 3. Zero-Day Vulnerabilities
CVE-2026-25253 and CVE-2026-24763 were both disclosed February 2, 2026 — 9 days ago. The project's security maturity is still catching up to its explosive adoption.

**Residual risk:** Additional undiscovered vulnerabilities likely exist.

**Mitigation strategy:** Continuous monitoring. Subscribe to OpenClaw security advisories. Run `openclaw security audit --deep` weekly. Deploy on dedicated machine to contain blast radius.

### 4. Model Provider Risks
All LLM calls route to external providers (Anthropic, OpenAI, etc.). Prompts and tool outputs are transmitted to these services.

**Residual risk:** Data residency, provider logging policies, potential provider breaches.

**Mitigation strategy:** Use providers with strong security posture (Anthropic Claude). Avoid including PII/credentials in prompts. Be aware that conversation history is visible to the model provider.

### 5. Operator Error
The most dangerous commands require user confirmation via exec-approvals. A tired, distracted, or socially-engineered operator can approve a malicious command.

**Residual risk:** Human in the loop is a security control AND a vulnerability.

**Mitigation strategy:** Default to deny. Read every exec approval prompt carefully. When in doubt, deny and investigate.

---

## Security Monitoring Cadence

### Daily
- Check Gateway logs for unexpected tool calls or suspicious WebSocket connections
  - Log location: `/tmp/openclaw/openclaw-YYYY-MM-DD.log` (or `logging.file`)
- Review any exec approval prompts — deny anything unexpected

### Weekly
- Run `openclaw security audit --deep`
- Run `clawshield audit` (if installed)
- Check for OpenClaw updates: `npm outdated -g openclaw`
- Review session transcripts for anomalies: `~/.openclaw/agents/*/sessions/*.jsonl`

### Monthly
- Rotate gateway auth token
- Review and rotate all connected API keys
- Audit channel allowlists and pairing approvals
- Check for new CVEs: search NVD for "openclaw"
- Review and prune old session transcripts

### On Every OpenClaw Update
- Read the changelog for security fixes
- Re-run `openclaw security audit --deep` after updating
- Re-run `clawshield audit`
- Verify sandbox configuration is preserved

### Incident Response Playbook
If compromise is suspected:
1. **CONTAIN** — Stop the gateway immediately: `launchctl bootout gui/$UID/bot.molt.gateway`
2. **FREEZE** — Disable all inbound surfaces: Edit `openclaw.json`, set `dmPolicy: "disabled"` for all channels
3. **ROTATE** — Assume all secrets compromised: Gateway auth token, all API keys, channel credentials
4. **AUDIT** — Check logs, review transcripts, check for unauthorized config changes, check for unexpected files in `~/.openclaw/extensions/`
5. **DOCUMENT** — Timestamp, OS version, OpenClaw version, attack details

---

## Open Security Questions

These cannot be resolved through research alone — they require hands-on testing during deployment:

### 1. macOS Keychain Behavior on Fresh M4 Mac Mini
**Question:** Does the current version (v2026.1.29+) still trigger unexpected Keychain access dialogs? Under what circumstances?

**Context:** Reddit user reported Keychain permission dialogs on earlier version, uninstalled over this. Medium post suggests Keychain integration is a DESIRED feature for secure credential storage, not a bug.

**Testing plan:** Monitor for TCC permission requests during onboarding. If Keychain dialogs appear, investigate each before approving — deny by default.

---

### 2. Docker on Apple Silicon Performance Impact
**Question:** With `sandbox.mode: "all"` and Docker containers per session, what's the actual memory/CPU impact on 16GB M4? Does it degrade under normal usage?

**Context:** Docker Desktop for Apple Silicon uses VM-based containerization (not native). Sandbox configuration assumes Docker is available.

**Testing plan:** Monitor Activity Monitor during normal operation. Test with multiple concurrent sessions. Measure resource consumption.

---

### 3. Tailscale Serve + OpenClaw Integration on macOS
**Question:** Does `gateway.auth.allowTailscale` for Serve identity headers work correctly on macOS? Is it more secure than token-based auth?

**Context:** Official docs mention this integration. Tailscale Serve keeps gateway on loopback while Tailscale handles access.

**Testing plan:** Test both token-based auth and Tailscale identity headers. Compare security posture and usability.

---

### 4. launchd + Dedicated User Interaction
**Question:** Running the gateway under a non-admin `openclaw` user via launchd — does this work cleanly, or does the macOS companion app require the logged-in user's context?

**Context:** The macOS companion app (menubar app) may expect to run under the logged-in user's session.

**Testing plan:** Test gateway installation under dedicated user. Check if companion app still works.

---

### 5. exec-approvals Enforcement Granularity
**Question:** Does the denylist actually block command variations? (e.g., does denying "rm -rf" also block "rm -r -f" or "/bin/rm -rf"?)

**Context:** Pattern matching effectiveness determines whether denylist provides real protection.

**Testing plan:** Test with harmless variations (e.g., `echo` instead of `rm`). Document which patterns are caught vs. which slip through.

---

### 6. Backup and Restore Security (Time Machine)
**Question:** When backing up `~/.openclaw/` (which contains credentials), what's the encryption posture of Time Machine backups? Are they encrypted at rest?

**Context:** Time Machine backups to external drives may not be encrypted by default.

**Testing plan:** Check Time Machine encryption settings. Test restore process. Determine if credentials in backups are protected.

---

### 7. nono Compatibility with Apple Silicon
**Question:** The `nono` kernel sandbox uses Landlock LSM — does this work on macOS/Apple Silicon, or is it Linux-only? If Linux-only, what's the macOS equivalent?

**Context:** Semgrep recommends `nono` for additional containment. Luke Hinds created it in response to 1.5M leaked keys.

**Testing plan:** Attempt `brew install nono` and test basic functionality. If it's Linux-only, research macOS sandbox alternatives (potentially Apple's App Sandbox or `sandbox-exec`).

---

### 8. Rate Limiting for Tool Calls
**Question:** Does OpenClaw have configurable rate limits for tool invocations? Could an attacker trigger rapid-fire tool calls via prompt injection?

**Context:** Prompt injection could instruct agent to execute many tool calls in quick succession (e.g., exfiltrate files via repeated read + web_fetch).

**Testing plan:** Search docs for rate limiting configuration. Test with benign rapid tool calls. Determine if rate limits exist and are configurable.

---

### 9. Update Mechanism Security
**Question:** When running `npm install -g openclaw@latest`, is the package integrity verified? Is there a signed release or checksum verification process?

**Context:** NPM package compromise is a known attack vector.

**Testing plan:** Check if NPM package is signed. Verify checksums if available. Research OpenClaw's release signing process.

---

### 10. Model Routing Logic in Multi-Model Setups
**Question:** How does model routing work when multiple models are configured? Can prompt injection force routing to a weaker model?

**Context:** Official docs recommend Opus 4.6 for security. If cheaper models are configured as fallbacks, an attacker might try to force routing to them.

**Testing plan:** Test multi-model configuration. Attempt to influence model selection via prompt.

---

## Final Assessment

**For Sean's Mac Mini deployment:**

**GO / NO-GO:** GO — with mandatory hardening

**Conditions:**
1. Version MUST be v2026.1.29 or later (CVE patches)
2. Gateway MUST be loopback-only with token auth
3. Sandbox MUST be mode `all`, scope `session`
4. Tools MUST start with read-only allowlist, deny dangerous tools
5. ClawHub skills MUST be zero initially
6. FileVault MUST be enabled
7. Dedicated user account MUST be created (non-admin)
8. Tailscale ACLs MUST restrict access to Sean's devices only
9. exec-approvals MUST include denylist for dangerous commands
10. Daily log review + weekly security audits MUST be performed

**Residual risks that remain even with full hardening:**
- Prompt injection (AI alignment problem, not configuration problem)
- Supply chain risk (NPM dependencies)
- Zero-day vulnerabilities (project security maturity still catching up)
- Model provider risks (data transmitted to Anthropic/OpenAI)
- Operator error (approval fatigue, social engineering)

**Bottom line:** OpenClaw is NOT "set and forget" — it's a powerful, permissive system that requires ongoing security discipline. The dedicated Mac Mini architecture is the RIGHT choice (contains blast radius, Tailscale already configured). The hardening configuration is MANDATORY, not optional. The skills ecosystem is actively hostile — stay away from ClawHub until vetting matures. The security monitoring cadence is the difference between controlled deployment and eventual compromise.

**This is viable. It is not safe by default. It requires respect.**
