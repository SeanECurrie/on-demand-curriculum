# Three-Tier Hardening Framework

**Created:** 2026-03-03
**Purpose:** A reusable framework for classifying security hardening steps into three tiers — essential, educational, and operational polish — so that deployment walkthroughs serve both security and learning goals without conflating the two.

---

## Why Three Tiers

When deploying any tool that handles sensitive operations (agent platforms, API gateways, automation servers), the hardening guide can easily balloon into dozens of steps. Without classification, operators face a wall of configuration with no way to prioritize.

Worse, in a learning context, treating every step as equally critical obscures the actual lesson. An operator who spends equal time on authentication token setup and screen saver timeout settings has learned nothing about relative risk.

The three-tier framework solves this by making the priority and purpose of each step explicit:

1. **What MUST be done** regardless of context (essential)
2. **What teaches transferable security principles** (educational)
3. **What matters for long-running services but can be deferred** (operational polish)

This framework applies to any tool deployment, not just agent platforms. The classification questions below work for databases, web servers, automation platforms, or any software with a security surface.

---

## Tier 1: Essential Hardening

### What it is
Security fundamentals that prevent actual harm. These are non-negotiable regardless of whether the deployment is a learning lab, a staging environment, or production.

### Characteristics
- Skipping this step creates a concrete, exploitable vulnerability
- The attack it prevents is well-documented and actively exploited in the wild
- No legitimate reason to leave it unconfigured
- Usually involves: authentication, authorization, network binding, input validation, or disabling known-dangerous defaults

### Generic Examples
- **Authentication on exposed interfaces** — Any gateway, dashboard, or API that accepts connections must require authentication. "Internal only" is not a substitute for auth when the tool could be misconfigured to bind externally.
- **Disabling untrusted plugin/extension sources** — If a tool has a community marketplace with unvetted contributions, disable marketplace installs and use only locally-authored or audited extensions.
- **Sandbox mode for code execution** — If the tool can execute arbitrary code (agent platforms, CI runners, notebook servers), enable sandboxing. Unsandboxed execution means a prompt injection or malicious input can run system commands.
- **Loopback/localhost binding** — Services that don't need network exposure should bind to 127.0.0.1, not 0.0.0.0. This is defense-in-depth: even if other network controls fail, the service isn't reachable from the network.

### The test
> "If I skip this step and an attacker finds this service, can they cause harm?"
> If yes -> Essential.

---

## Tier 2: Educational Hardening

### What it is
Steps where the "Understanding" section is as valuable as the configuration change itself. The concept transfers to any platform. The WHY matters: what attack does this prevent? What's the security principle? Does this apply elsewhere?

### Characteristics
- The configuration change improves security, but the real value is understanding the principle behind it
- The concept transfers directly to other tools and platforms
- Often involves: least-privilege access, defense-in-depth layering, supply chain trust evaluation, credential management, or audit logging
- The "Understanding" section should be longer than the "Commands" section

### Generic Examples
- **Dedicated non-admin service user** — Running a service under a user that cannot `sudo` limits blast radius. This is the principle of least privilege, and it applies to every service on every platform. Understanding WHY a compromised service process shouldn't have admin rights is more valuable than the `useradd` command.
- **Understanding token/credential rotation** — Setting up API key rotation isn't just about the specific tool's config. It's about understanding why long-lived credentials are a risk, what happens when a key is leaked, and how rotation limits exposure windows. This transfers to every API-connected system.
- **Defense-in-depth layering** — Configuring both application-level auth AND network-level restrictions (firewall, VPN, loopback binding) teaches that no single control is sufficient. If one fails, the others still protect you.
- **Exec-approval patterns** — Understanding how to restrict which commands an agent can execute, and why pattern matching alone is insufficient (path aliases, symlinks, shell builtins), teaches input validation principles that apply to any system that runs user-influenced commands.

### The test
> "Would understanding WHY this step exists help me secure a completely different tool?"
> If yes -> Educational.

---

## Tier 3: Operational Polish

### What it is
Configuration that matters for a persistent, always-on service but can be deferred if the operator wants to reach hands-on experimentation faster. These steps improve reliability, performance, or operational hygiene without addressing active security threats.

### Characteristics
- Skipping this step does NOT create an exploitable vulnerability
- It matters for uptime, performance, or operational cleanliness
- Often involves: service management (systemd/launchd tuning), temp directory configuration, log rotation, display/power settings, backup scheduling, monitoring dashboards
- Can be revisited after the operator has a working deployment and wants to harden for persistence

### Generic Examples
- **Service auto-restart configuration** — Configuring a service manager to restart on crash is good operations but not a security issue. The service works fine without it; you just have to restart manually.
- **Temp directory isolation** — Pointing a tool's temp files to a dedicated directory prevents edge cases with shared /tmp, but the security implications are minimal in a single-user deployment.
- **Display/power management for headless servers** — Preventing screen sleep, setting energy saver preferences, or installing dummy display adapters matters for remote management but has no security impact.
- **Log rotation and retention policies** — Important for long-running services to prevent disk exhaustion, but not urgent for a deployment that's days or weeks old.
- **Backup encryption verification** — Confirming that backups are encrypted is important for data protection, but can be verified after the initial deployment is functional.

### The test
> "If I skip this step, will the deployment work correctly for the first few weeks while I'm actively learning?"
> If yes -> Operational polish (deferrable).

---

## How to Classify Steps for Any New Tool

When building a hardening guide for a new tool, run each proposed step through these questions in order:

```
Step: [describe the configuration change]

1. Does skipping this create an exploitable vulnerability?
   YES -> ESSENTIAL (Tier 1). Stop here.
   NO  -> Continue.

2. Does the underlying principle transfer to other tools/platforms?
   YES -> Does the operator learn more from the "why" than the "how"?
          YES -> EDUCATIONAL (Tier 2). Write the Understanding section first.
          NO  -> Might still be Tier 2, but consider if it's just operational.
   NO  -> Continue.

3. Does this matter primarily for long-running/persistent operation?
   YES -> OPERATIONAL POLISH (Tier 3). Flag as deferrable.
   NO  -> Reconsider — it might not belong in the guide at all.
```

### Edge cases

- **A step that is both essential AND educational:** Classify as Essential but include the educational framing. Auth token setup is non-negotiable, AND understanding why is transferable.
- **A step where the risk depends on deployment context:** Note the context dependency. Firewall rules are essential for internet-exposed services but operational polish for localhost-only + VPN deployments.
- **A step the operator might skip:** If it's Essential, say so explicitly — "Non-negotiable." If it's Operational Polish, say "Deferrable — revisit when you want persistence."

---

## Output #1 Example

For a worked example of this framework applied to a real deployment walkthrough (10 phases, all steps classified), see `outputs/openclaw-sean/`. The walkthrough classifies every step and includes "Understanding" sections for all Tier 2 steps.

---

## Related Documents

- `editorial-standards.md` — How hardening guidance is written and framed
- `dual-source-intelligence.md` — How hardening recommendations are researched
- `credibility-tiers.md` — How to weight sources when hardening advice conflicts
- `depth-assessment.md` — How to classify work depth before starting any pipeline stage
