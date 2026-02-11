# Phase 1 Report: Open Questions

**Date:** 2026-02-11
**Report Type:** Research gaps and unresolved questions
**Cross-Referenced Sources:** Context7 official docs + Bright Data community intelligence (130+ sources total)

---

## Purpose

These questions could not be resolved through documentation review or community research alone. They require hands-on testing during deployment, deeper investigation in Phase 2, or ongoing monitoring during operations.

This document consolidates every gap identified across:
- `/knowledge-base/02-architecture/openclaw-official-docs.md`
- `/knowledge-base/03-security/security-posture-analysis.md`
- `/knowledge-base/04-deployment/mac-mini-community-findings.md`
- `/knowledge-base/06-community-intelligence/openclaw-community-findings.md`
- `/intelligence-log.md`

---

## Critical (Must Resolve Before Deployment)

### 1. CVE-2026-25253 Patch Status Verification

**Question:** Is the version installed on Mac Mini >= v2026.1.29 (the patched version)?

**Why it matters:** CVE-2026-25253 is a CVSS 8.8 1-click RCE that affects all prior versions. This is the single most critical security item. Even localhost-bound instances are vulnerable because the attack uses the victim's own browser as a bridge.

**What we know:**
- Vulnerability disclosed Feb 2, 2026 (9 days ago)
- Affects all versions prior to v2026.1.29
- Attack vector: crafted URL exfiltrates auth token, disables sandbox via API, executes arbitrary commands
- Also includes CVE-2026-24763 (command injection in Docker sandbox)

**How to resolve:** Run `openclaw --version` immediately after installation/update. If < v2026.1.29, update before ANY other configuration.

**When to resolve:** First action during deployment (Phase 3)

**Source:** SOCRadar, NVD, The Hacker News, runZero (Tier 1)

---

### 2. macOS Keychain Access Behavior on Fresh M4 Mac Mini

**Question:** Does OpenClaw v2026.1.29+ still trigger unexpected macOS Keychain access dialogs? Under what circumstances?

**Why it matters:** A Reddit user uninstalled ClawdBot after receiving "weird permission dialogs all related to accessing Keychain" and accidentally approving one. If this triggers on our Mac Mini, we need to understand what it's requesting and why before enabling any capabilities.

**What we know:**
- Community report from r/ClaudeAI (60+ comments, Tier 4) — date unclear, possibly older version
- macOS companion app requests multiple TCC permissions during onboarding: Notifications, Accessibility, Screen Recording, Microphone, Speech Recognition, Automation/AppleScript
- Two possible mechanisms:
  - `system.run` executing commands that access Keychain (e.g., `security find-generic-password`)
  - OpenClaw or dependencies attempting to use macOS Keychain APIs for credential storage
- Medium post notes "community is actively developing patches — macOS Keychain integration for secrets" (suggests it's a FEATURE in development, not a bug)

**How to resolve:**
1. During onboarding wizard, document every TCC permission request
2. Monitor Console.app for any Keychain-related access attempts during first 24 hours
3. If Keychain dialogs appear: screenshot, investigate what command triggered it, deny by default
4. Test with dedicated `openclaw` user account that has a separate Keychain

**When to resolve:** During deployment (Phase 3), actively monitored

**Source:** reddit.com/r/ClaudeAI (Tier 4), Medium (Tier 3), knolli.ai (Tier 3)

---

### 3. Docker on Apple Silicon for Sandbox Configuration

**Question:** Does the sandbox configuration's Docker requirement work cleanly on Apple Silicon? What are the performance/security implications of Docker Desktop's VM-based architecture on macOS?

**Why it matters:** The recommended security configuration uses Docker for per-session sandboxing (`sandbox.mode: "all"`, `scope: "session"`). Docker Desktop for Mac runs Linux VMs under the hood, not native containers. This affects both security guarantees and resource consumption.

**What we know:**
- Official docs recommend sandbox mode "all" with Docker isolation
- Docker Desktop for Mac uses a Linux VM (not native macOS containers)
- Community recommendation split: some say "hardened Docker" (Linux-focused advice), others say "native install on macOS" (avoiding Docker overhead)
- Official docs do NOT explicitly cover macOS Docker requirements or alternatives

**How to resolve:**
1. Test Docker Desktop installation and configuration on M4 Mac Mini
2. Measure resource consumption (RAM, CPU) with Docker sandbox vs native execution
3. Verify sandbox escape prevention works as documented on macOS/ARM
4. Research if there's a macOS-native sandboxing alternative (macOS Sandbox/App Sandbox APIs?)

**When to resolve:** Before finalizing sandbox configuration in Phase 3 deployment

**Source:** docs.openclaw.ai (Tier 1), community split opinion (Tier 3-4)

---

### 4. launchd + Dedicated User Interaction

**Question:** Can the OpenClaw gateway run cleanly under a non-admin `openclaw` user via launchd? Does the macOS companion app require the logged-in user's context?

**Why it matters:** Security best practice is to run the gateway under a dedicated non-admin user account. However, if the macOS companion app (TCC permissions, Canvas, screen recording, etc.) requires interaction with a logged-in user session, the dedicated user approach may not work cleanly.

**What we know:**
- Official docs recommend: "Prefer a dedicated OS user account for the Gateway if the host is shared"
- Tim configured non-root user on Debian (Linux equivalent)
- macOS LaunchAgent (user-level) runs in user context vs LaunchDaemon (system-level)
- macOS companion app requires TCC permissions (screen recording, accessibility, etc.) — these are per-user

**How to resolve:**
1. Test gateway installation under dedicated `openclaw` user
2. Verify LaunchAgent starts on boot for that user
3. Test if TCC permissions work when the `openclaw` user is NOT the logged-in GUI user
4. If GUI context required, evaluate security trade-off of running under primary admin user vs dedicated user

**When to resolve:** During deployment user setup (Phase 3)

**Source:** docs.openclaw.ai (Tier 1), Tim video (Tier 2)

---

### 5. exec-approvals.json Pattern Matching Behavior

**Question:** Does the denylist actually block command variations? For example, does denying `rm -rf` also block `rm -r -f`, `/bin/rm -rf`, or `rm -rf /`?

**Why it matters:** The exec-approvals.json system is a critical security control. If pattern matching is too literal, attackers can bypass the denylist with simple command variations. We need to understand the exact matching logic.

**What we know:**
- exec-approvals.json supports `pattern` field with allowlist/denylist
- Official docs show examples like `{ "pattern": "/opt/homebrew/bin/rg" }` but don't document the matching algorithm
- knolli.ai shows patterns like `"rm -rf"` but doesn't explain if this is regex, glob, or exact match
- No documentation on whether it matches full command paths or just basenames

**How to resolve:**
1. Review OpenClaw source code for exec-approvals pattern matching logic
2. Test denylist during deployment with variations: `rm -rf`, `rm -r -f`, `/bin/rm -rf`, `rm -rf /`
3. Document actual matching behavior
4. Expand denylist patterns based on findings

**When to resolve:** During security configuration (Phase 3), with source code review in Phase 2 architecture deep-dive

**Source:** docs.openclaw.ai (Tier 1), knolli.ai (Tier 3)

---

### 6. Backup Encryption Posture for ~/.openclaw/

**Question:** When backing up `~/.openclaw/` (which contains unencrypted credentials, API keys, session transcripts, and chat history), what's the encryption posture of Time Machine backups? Are they encrypted at rest?

**Why it matters:** The `~/.openclaw/` directory contains extremely sensitive data:
- Gateway auth tokens
- API keys (Anthropic, OpenAI, etc.)
- Channel credentials (Telegram bot tokens, etc.)
- Session transcripts with full chat history and tool output
- All stored unencrypted on disk

If Time Machine backups are not encrypted, we've created an additional credential exposure vector.

**What we know:**
- Official docs confirm credentials stored unencrypted at `~/.openclaw/`
- FileVault encrypts the live filesystem
- Time Machine can encrypt backups, but it's NOT the default
- External Time Machine drives are not automatically encrypted

**How to resolve:**
1. Verify Time Machine encryption is enabled: System Settings > General > Time Machine > Options
2. If using external drive, verify it's encrypted (FileVault for external drives)
3. Test backup/restore of `~/.openclaw/` to confirm permissions are preserved (600/700)
4. Document backup encryption requirements in deployment guide

**When to resolve:** Before connecting any messaging channels or API keys (Phase 3)

**Source:** docs.openclaw.ai (Tier 1), macOS security best practices

---

## Important (Should Resolve Before or During Deployment)

### 7. Resource Consumption with Full Sandboxing on 16GB M4

**Question:** With `sandbox.mode: "all"` and Docker containers per session, what's the actual memory/CPU impact on a 16GB M4 Mac Mini under normal usage? Does it degrade performance or hit memory limits?

**Why it matters:** The recommended security configuration creates a Docker container for EVERY session. If Sean has multiple concurrent messaging conversations (Telegram DMs + group mentions), each spawns a container. 16GB RAM might not be enough under heavy usage.

**What we know:**
- Base M4 Mac Mini with 16GB is "more than sufficient" for OpenClaw (community consensus)
- BUT that consensus is based on typical single-user usage, not necessarily full per-session sandboxing
- Docker Desktop on macOS has VM overhead
- Official docs show sandbox scope options: `session` (strictest, most containers), `agent` (default), `shared` (least isolation)

**How to resolve:**
1. Monitor RAM/CPU usage during first week of operation with `sandbox.mode: "all"`, `scope: "session"`
2. Test with multiple concurrent sessions (5+ simultaneous conversations)
3. If memory pressure occurs, evaluate trade-off: relax to `scope: "agent"` vs upgrade to 24GB Mac Mini
4. Document actual resource usage in operational findings

**When to resolve:** During first week of deployment (Phase 3), with ongoing monitoring

**Source:** Community findings (Tier 3), docs.openclaw.ai (Tier 1)

---

### 8. Tailscale Serve + OpenClaw Gateway Auth Integration

**Question:** Does `gateway.auth.allowTailscale` (for Tailscale Serve identity headers) work correctly on macOS? Is it more secure than token-based auth?

**Why it matters:** Tailscale Serve can pass authenticated identity headers (`tailscale-user-login`) to the gateway. If this works, it eliminates the need to manage gateway auth tokens separately — Tailscale identity becomes the authentication layer.

**What we know:**
- Official docs mention `gateway.auth.allowTailscale` and Tailscale Serve integration
- Tailscale Serve keeps the gateway on loopback while Tailscale handles access (recommended pattern)
- Official OpenClaw docs have a dedicated Tailscale page
- No macOS-specific caveats documented
- Community consensus: Tailscale is the standard solution, but most guides focus on token auth

**How to resolve:**
1. Test Tailscale Serve configuration on Mac Mini
2. Verify identity header passing works on macOS
3. Compare security posture: Tailscale identity vs long-lived token
4. Document configuration if it works cleanly

**When to resolve:** During Tailscale configuration (Phase 3)

**Source:** docs.openclaw.ai/gateway/tailscale (Tier 1), DEV Community (Tier 3)

---

### 9. nono Kernel Sandbox Compatibility with macOS/Apple Silicon

**Question:** Does the `nono` kernel-level sandbox (recommended by Semgrep) work on macOS/Apple Silicon, or is it Linux-only? If Linux-only, what's the macOS equivalent?

**Why it matters:** Semgrep (Tier 2 credible source) recommends `nono` as an additional containment layer. It uses Landlock LSM (Linux Security Module) to provide kernel-level sandboxing. If it's Linux-only, we need to find the macOS equivalent.

**What we know:**
- `nono` created by Luke Hinds in response to 1.5M API keys leaked via OpenClaw
- Uses Landlock LSM (Linux-specific)
- Installation: `brew tap lukehinds/nono && brew install nono`
- Blocks: rm, dd, chmod, sudo, scp, rsync by default
- Allows: filesystem access to specific directories, network blocking

**How to resolve:**
1. Attempt `brew install nono` on macOS
2. Test if it works on Apple Silicon
3. If it fails, research macOS alternatives: macOS App Sandbox, Sandbox.app, macOS seatbelt profiles
4. Document macOS-specific containment approach

**When to resolve:** After basic deployment works (Phase 3 hardening phase)

**Source:** Semgrep (Tier 2), GitHub/lukehinds (Tier 3)

---

### 10. Model Routing Logic in Multi-Model Setups

**Question:** When multiple models are configured (e.g., Opus for complex tasks, Flash for simple tasks), how does OpenClaw decide which model to use? Is it automatic, user-selected, or context-based?

**Why it matters:** Community recommends mixing expensive and cheap models for cost optimization. Understanding the routing logic is necessary to configure this correctly and predict costs.

**What we know:**
- Community tip: "Mix expensive and cheap models: Expensive for training/complex tasks, cheap for execution"
- Configuration exists at `~/.openclaw/agents/main/agent/models.json` (per community)
- Official docs show `/model` command to switch models
- No documentation on automatic routing based on task complexity

**How to resolve:**
1. Review official docs for model routing/selection logic
2. Test multi-model configuration during deployment
3. Experiment with `/model` command
4. Document actual behavior

**When to resolve:** During model configuration (Phase 3), with deeper architecture investigation in Phase 2

**Source:** Community findings (Tier 4), docs.openclaw.ai (Tier 1)

---

### 11. Update Mechanism Security and Integrity Verification

**Question:** When running `npm install -g openclaw@latest`, is package integrity verified? Is there a signed release or checksum verification process?

**Why it matters:** Supply chain security. NPM package compromise is a known attack vector (University of Toronto advisory cited compromised NPM packages in late 2025). We need to verify the update mechanism is secure.

**What we know:**
- Installation via `npm install -g openclaw@<version>` or one-liner curl script
- U of Toronto security advisory warns of NPM package compromise precedent
- OpenClaw has 145,000+ GitHub stars — high-value target
- No documentation on signed releases or checksum verification

**How to resolve:**
1. Check if OpenClaw releases are GPG-signed
2. Verify NPM package has checksums
3. Review the one-liner install script for security (does it verify signatures?)
4. Consider pinning to specific versions vs `@latest`
5. Document verified update procedure

**When to resolve:** Before first update, documented in operations procedures

**Source:** University of Toronto advisory (Tier 1), npm security best practices

---

### 12. Rate Limiting for Tool Calls

**Question:** Does OpenClaw have configurable rate limits for tool invocations? Could an attacker trigger rapid-fire tool calls via prompt injection?

**Why it matters:** Even if individual tool calls are sandboxed, rapid-fire execution could be used for:
- Denial of service (resource exhaustion)
- API quota burning (cost attack)
- Reconnaissance (repeated file reads to map filesystem)

**What we know:**
- Security engine has "Action Engine" layer that includes rate limiting
- Official docs mention rate limiting in security architecture overview
- No documentation on how to CONFIGURE rate limits or what the defaults are

**How to resolve:**
1. Review official docs for rate limiting configuration
2. Review source code for default rate limit values
3. Test behavior: can a single message trigger 100+ rapid tool calls?
4. Configure appropriate limits if available

**When to resolve:** Phase 2 architecture deep-dive + Phase 3 security testing

**Source:** docs.openclaw.ai (Tier 1) — mentioned but not detailed

---

## Nice to Know (Investigate During Operation)

### 13. Detailed Data Residency — What Stays Local vs Goes to LLM Providers

**Question:** Exactly what data gets sent to LLM providers (Anthropic, OpenAI) vs stored only locally?

**Why it matters:** Privacy and compliance. We need to understand:
- Are session transcripts sent in full context on every request?
- Is semantic memory (vector embeddings) created locally or via provider APIs?
- Are tool outputs sent to the LLM for processing?
- What's the token/data retention policy of providers?

**What we know:**
- OpenClaw is "local-first architecture" (community)
- It routes requests to cloud LLM providers (not local inference by default)
- Session transcripts stored locally at `~/.openclaw/agents/*/sessions/*.jsonl`
- No detailed documentation on what data leaves the Mac Mini

**How to resolve:**
1. Monitor network traffic during operation (Wireshark/Charles Proxy)
2. Review API calls to Anthropic/OpenAI
3. Check what's included in request payloads
4. Document actual data flow

**When to resolve:** Post-deployment monitoring (Phase 4 operations)

**Source:** Gap identified in official docs

---

### 14. Upgrade/Update Procedures and Rollback

**Question:** What's the official upgrade procedure? How do we rollback if an update breaks something?

**Why it matters:** OpenClaw is a fast-moving project (recent rebrand, frequent updates, CVEs patched quickly). We need a safe upgrade path.

**What we know:**
- Installation via npm global install
- Version checking: `openclaw --version`
- No documented upgrade procedure
- No documented rollback procedure
- Config files at `~/.openclaw/` — unclear if updates modify these

**How to resolve:**
1. Document baseline upgrade procedure: backup → npm update → verify → test
2. Test upgrade from v2026.1.29 to next version
3. Verify config files are preserved
4. Document rollback: `npm install -g openclaw@<previous-version>`
5. Consider version pinning strategy

**When to resolve:** After stable deployment, before first production upgrade

**Source:** Gap identified in official docs

---

### 15. Disaster Recovery Playbook Testing

**Question:** Does the documented incident response playbook actually work? Have we tested each step?

**Why it matters:** Security incidents happen. We documented a playbook in the security posture analysis, but it's untested.

**What we know (from security analysis):**
1. CONTAIN: `launchctl bootout gui/$UID/bot.molt.gateway`
2. FREEZE: Edit config to disable all channels
3. ROTATE: All secrets (gateway token, API keys, channel credentials)
4. AUDIT: Logs, transcripts, config changes, unauthorized files
5. DOCUMENT: Timeline, attacker actions, exposure

**How to resolve:**
1. Test the CONTAIN step in a non-emergency scenario — does it cleanly stop the gateway?
2. Test FREEZE — can we quickly disable all inbound surfaces?
3. Document credential rotation procedures for each service
4. Practice the full playbook quarterly

**When to resolve:** Post-deployment, during operational maturity phase

**Source:** Security posture analysis (this project)

---

### 16. Session Log Retention and Cleanup

**Question:** How long should we retain session transcripts? What's the cleanup/archival strategy?

**Why it matters:**
- Session transcripts grow indefinitely at `~/.openclaw/agents/*/sessions/*.jsonl`
- Each contains full chat history and tool output
- Disk space and privacy concerns

**What we know:**
- Session transcripts stored as JSONL files
- No automatic cleanup/rotation documented
- No guidance on retention policy

**How to resolve:**
1. Monitor session transcript disk usage over first month
2. Implement cleanup strategy: keep last 30 days, archive older to encrypted storage
3. Automate via cron or similar

**When to resolve:** After 1 month of operation

**Source:** Gap identified in official docs

---

## Documentation Gaps

These are things the official OpenClaw documentation should cover but doesn't. They may be resolved by future docs updates.

### 17. macOS Firewall Configuration (pf)

**Gap:** Official docs cover Linux firewall (`ufw`, `iptables`) but not macOS `pf` (packet filter) or built-in macOS Firewall.

**Impact:** macOS users have no official guidance on firewall configuration.

**Workaround:** Community synthesis + macOS documentation. Documented in security posture analysis.

**Source:** docs.openclaw.ai (Tier 1) — Linux-focused only

---

### 18. macOS-Specific Resource Usage Metrics

**Gap:** No documentation on CPU, RAM, or disk usage specifically for macOS/Apple Silicon deployments.

**Impact:** Users can't capacity plan for Mac Mini deployments.

**Workaround:** Community reports suggest 5-10W idle, minimal RAM (orchestrates API calls, doesn't run LLMs locally).

**Source:** Gap identified, community filled it

---

### 19. Specific Node.js 22 ARM Compatibility Notes

**Gap:** Docs require "Node.js 22 or higher" but don't explicitly confirm ARM compatibility or Apple Silicon optimizations.

**Impact:** Uncertainty for Mac Mini M4 users whether Node.js 22 is ARM-native or Rosetta.

**Workaround:** Node.js official docs confirm ARM64 builds. Not an actual problem, just a documentation gap.

**Source:** Gap identified

---

### 20. Model Routing Logic in Multi-Model Setups (duplicate, see #10)

**Gap:** No documentation on how model selection works when multiple models configured.

**Source:** Gap identified

---

### 21. exec-approvals.json Pattern Matching Algorithm (duplicate, see #5)

**Gap:** No documentation on pattern matching logic (regex? glob? exact match?).

**Source:** Gap identified

---

### 22. Backup and Disaster Recovery Procedures

**Gap:** No official documentation on backup strategy, disaster recovery, or state restoration.

**Impact:** Users don't know what to back up or how to restore after failure.

**Workaround:** Obvious targets are `~/.openclaw/` (full state), but no official guidance on backup encryption, retention, or restore testing.

**Source:** Gap identified

---

### 23. Detailed Sandbox Architecture Documentation

**Gap:** High-level sandbox docs exist, but detailed architecture (how Docker isolation works, what syscalls are blocked, filesystem mount strategy, network isolation implementation) is not documented.

**Impact:** Security-conscious users can't fully evaluate sandbox strength.

**Workaround:** Source code review required.

**Source:** Gap identified, requires Phase 2 architecture deep-dive

---

## Questions for Phase 2 Architecture Deep-Dive

These are specific technical questions to investigate during the architecture research phase.

### 24. Multi-Agent Routing Architecture

**Question:** How does multi-agent routing work? How are messages routed to specific agents? What's the isolation boundary between agents?

**Why it matters:** Understanding the architecture is necessary to design secure multi-agent deployments (e.g., read-only research agent + write-enabled task agent).

**What we know:**
- Official docs show multi-agent config with `agents.list[]` and `bindings`
- Each agent can have its own sandbox, tools, and credentials
- Channel accounts route to specific agents via bindings

**How to resolve:** Phase 2 architecture deep-dive — source code review, official docs deep-read, architecture diagrams

**Source:** docs.openclaw.ai (Tier 1) — overview exists, details missing

---

### 25. Semantic Memory Implementation

**Question:** How is semantic memory implemented? Vector database? Embeddings model? Local vs cloud?

**Why it matters:** Understanding memory architecture is key to:
- Privacy (are embeddings created locally or via API?)
- Performance (how much disk/RAM does memory consume?)
- Security (can semantic memory be poisoned?)

**What we know:**
- Official docs mention "semantic memory through vector search"
- Community mentions "spend time personalizing the agent's memory"
- No details on implementation

**How to resolve:** Phase 2 architecture deep-dive

**Source:** Gap identified

---

### 26. Gateway WebSocket Protocol

**Question:** What's the WebSocket protocol between gateway and clients? Is it custom or standard?

**Why it matters:** Understanding the protocol helps evaluate:
- Security (encryption, authentication, message validation)
- Custom client development possibilities
- Attack surface

**What we know:**
- Gateway listens on port 18789 (WebSocket)
- CVE-2026-25253 exploited lack of origin header validation
- No protocol documentation

**How to resolve:** Phase 2 architecture deep-dive — source code review, packet capture

**Source:** Gap identified

---

### 27. Sub-Agent Architecture and Lifecycle

**Question:** How do sub-agents work? How are they spawned, managed, and cleaned up? What's the isolation boundary?

**Why it matters:** Understanding sub-agents helps evaluate:
- Parallelism capabilities
- Resource consumption
- Security isolation

**What we know:**
- Official docs mention "spawn sub-agents for parallel work"
- No details on lifecycle, isolation, or resource limits

**How to resolve:** Phase 2 architecture deep-dive

**Source:** Gap identified

---

### 28. Browser Control (CDP) Security Model

**Question:** How is Chrome DevTools Protocol access secured? What prevents a compromised agent from accessing other browser profiles?

**Why it matters:** Browser control is one of the most powerful and dangerous capabilities. Need to understand the security model.

**What we know:**
- Official docs recommend dedicated browser profile
- Agent can control browsers via CDP
- No details on isolation mechanisms

**How to resolve:** Phase 2 architecture deep-dive

**Source:** docs.openclaw.ai (Tier 1) — recommendation exists, mechanism unclear

---

### 29. Cron Job / Autonomous Execution Architecture

**Question:** How do cron jobs work? How are they authorized? What prevents an agent from scheduling unauthorized tasks?

**Why it matters:** Autonomous execution (scheduled tasks) is a significant security concern. Need to understand the authorization and audit model.

**What we know:**
- Official docs mention cron capabilities
- Community warns about autonomous behavior
- No details on authorization or audit logging

**How to resolve:** Phase 2 architecture deep-dive

**Source:** Gap identified

---

### 30. Channel Binding and Message Routing Logic

**Question:** How does message routing from channels to agents work? What's the precedence when multiple agents could handle a message?

**Why it matters:** Understanding routing is necessary to configure multi-agent setups correctly and predict behavior.

**What we know:**
- Channels have bindings: `"bindings": ["binding1"]`
- Agents subscribe to bindings
- No details on routing logic when multiple agents match

**How to resolve:** Phase 2 architecture deep-dive

**Source:** Gap identified

---

## Summary Statistics

**Total Open Questions:** 30

**By Priority:**
- Critical (must resolve before deployment): 6
- Important (should resolve before/during deployment): 6
- Nice to Know (investigate during operation): 4
- Documentation Gaps: 8 (may be resolved by future official docs)
- Phase 2 Architecture Questions: 7

**By Resolution Timeline:**
- Resolve in Phase 2 (Architecture): 7 questions
- Resolve in Phase 3 (Deployment): 10 questions
- Resolve in Phase 4 (Operations): 4 questions
- Ongoing/Future: 8 questions

**Deployment Blockers Identified:**
1. CVE patch verification (absolutely critical)
2. macOS Keychain behavior investigation
3. Docker sandbox on Apple Silicon testing
4. exec-approvals pattern matching verification
5. Backup encryption confirmation
6. launchd + dedicated user interaction testing

**Non-Blockers (Can Deploy Without, But Should Investigate):**
- Resource consumption with full sandboxing (monitor during operation)
- Tailscale Serve integration (token auth works, Serve is optimization)
- nono compatibility (nice-to-have additional layer)
- Model routing logic (can configure manually with `/model` command)
- Most Phase 2 architecture questions (understanding vs blocking)

---

## Next Actions

1. **Before Deployment (Phase 3):**
   - Verify CVE-2026-25253 patch status first action
   - Test macOS Keychain behavior during onboarding
   - Test Docker sandbox on M4
   - Test launchd + dedicated user setup
   - Verify backup encryption configuration
   - Test exec-approvals pattern matching with variations

2. **During Deployment (Phase 3):**
   - Monitor resource consumption with full sandboxing
   - Test Tailscale Serve integration
   - Document all TCC permission requests
   - Test disaster recovery playbook steps

3. **Phase 2 Architecture Deep-Dive:**
   - Investigate all 7 architecture questions through source code review
   - Document actual implementations vs documented behavior
   - Create architecture diagrams

4. **Post-Deployment Operations (Phase 4):**
   - Monitor data residency (network traffic analysis)
   - Implement session log cleanup strategy
   - Practice disaster recovery quarterly
   - Document first production upgrade experience

---

**End of Report**
