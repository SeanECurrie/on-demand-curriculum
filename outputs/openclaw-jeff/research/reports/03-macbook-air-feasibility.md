# MacBook Air Feasibility Report — OpenClaw for Jeff (Output #2)

**Date:** 2026-03-03
**Report Type:** Feasibility
**Depth:** Full
**Sources:** 18 sources across Tiers 1-5
**Credibility:** Hardware requirements from Tier 1 (OpenClaw docs, Docker docs, Apple docs); real-world performance from Tier 2-4 (community reports, hosting provider data, developer blogs)

---

## Key Takeaway

The MacBook Air M4 is viable for running OpenClaw, but it is a consumer laptop being used as a server. It works with specific configuration requirements -- 24 GB RAM strongly recommended, OrbStack instead of Docker Desktop, sleep prevention mandatory, always plugged in. Jeff should understand the tradeoffs: the Air trades server suitability for portability.

---

## GO/NO-GO Verdict

**GO -- with conditions.**

OpenClaw's resource requirements are modest (1 GB RAM minimum, 2 GB recommended). The MacBook Air M4 exceeds them significantly. The platform's workload profile -- mostly idle with periodic bursts for message processing and skill execution -- is compatible with the Air's fanless design. [Tier 1 -- OpenClaw FAQ, Docker docs]

### Conditions (All Required)

| Condition | Requirement | Priority |
|-----------|-------------|----------|
| RAM | **24 GB strongly recommended** | Critical |
| Storage | 512 GB minimum (Docker images + logs accumulate) | Important |
| Container runtime | **OrbStack over Docker Desktop** | Recommended |
| Sleep prevention | `sudo pmset -a disablesleep 1` or Amphetamine app | Required |
| Power | Always plugged in, charge limit at 80% | Required |
| Thermal management | Laptop stand, lid open when possible | Recommended |
| macOS settings | Disable screen saver, set display sleep (not system sleep) | Required |

---

## Hardware Recommendations: RAM

### The Memory Stack

Running OpenClaw on a MacBook Air means running this full stack simultaneously:

| Layer | Estimated RAM Usage | Source |
|-------|-------------------|--------|
| macOS + system services | 4-6 GB | Community consensus [Tier 5] |
| Docker Desktop VM (idle) | 2-4 GB (grows over time) | Docker docs: 50% of host RAM default; community: 3 GB idle [Tier 1, Tier 3] |
| OrbStack (alternative) | 500 MB - 1.5 GB (dynamic) | OrbStack docs [Tier 2] |
| OpenClaw Gateway + containers | 420-440 MB per bot instance | ZeroClaw production measurement [Tier 3] |
| Playwright/Chromium (if used) | 500 MB - 1.5 GB per instance | OpenClaw browser docs [Tier 1] |

### 16 GB vs. 24 GB

| Factor | 16 GB | 24 GB |
|--------|-------|-------|
| Total stack usage (with OrbStack) | 5.5-9.5 GB (35-60%) | 5.5-9.5 GB (23-40%) |
| Total stack usage (with Docker Desktop) | 8-14 GB (50-88%) | 8-14 GB (33-58%) |
| Headroom for browser automation | Minimal -- may swap under load | Comfortable |
| Docker memory leak impact | High -- system slowdown within days | Manageable -- more buffer |
| Verdict | **Feasible but tight** | **Comfortable** |

**RECOMMENDATION:** 24 GB is strongly recommended.

- **Why:** At 16 GB, the combined stack consumes 50-85% of available RAM with Docker Desktop (or 35-60% with OrbStack), leaving little headroom. Docker Desktop has a documented memory leak (GitHub issue docker/for-mac#7111, 2023-present) where usage grows from 80 MB to 5-6 GB over 2 days of operation. At 24 GB, this creep is manageable. At 16 GB, it triggers swap pressure and system slowdowns. [Tier 1 -- Docker docs, Tier 3 -- GitHub issue #7111]
- **What it prevents:** System slowdowns from memory pressure, swap thrashing, potential OpenClaw instability under load.
- **Trade-offs:** Higher MacBook Air purchase price (~$200 upgrade).
- **Confidence level:** High -- based on production measurements (ZeroClaw: 420-440 MB per instance), official documentation, and extensive community reporting on Docker Desktop memory behavior.

Community validation:

> "Counter advice: Get the M2 since the CPU and GPU are already plenty fast, and enjoy your extra 8GBs of RAM. Beats me how anyone who runs docker can survive on 16GB." -- Reddit r/macbookair [Tier 4]

> "If you do Docker or VMs probably you need even more memory than that, perhaps as high as 32GB." -- Medium analysis [Tier 4]

---

## OrbStack Recommendation

**RECOMMENDATION:** Use OrbStack instead of Docker Desktop.

- **Why:** OrbStack uses dynamic memory that releases unused RAM back to the host. Idle CPU drops to ~0.1% vs. Docker Desktop's heavier footprint. OrbStack is purpose-built for Mac and recognized as "the best Docker Desktop alternative for Mac in 2026" across multiple independent reviews. [Tier 2 -- OrbStack docs, Setapp review, DEV Community]
- **What it prevents:** Docker Desktop's memory leak problem, excessive idle resource consumption, thermal issues from unnecessary CPU usage.
- **Trade-offs:** OrbStack is a third-party tool (free for personal use). It adds a dependency that Docker Desktop (from Docker Inc.) does not. If OrbStack is discontinued, migration back to Docker Desktop is straightforward.
- **Confidence level:** High -- multiple independent sources confirm the performance advantage, and OrbStack is widely adopted in the Mac developer community.

> "OrbStack now has dynamic memory management, so that it only uses as much memory as your containers need. Any extra memory is automatically released." -- OrbStack blog [Tier 2]

> "OrbStack is still my main recommendation today. If you want Docker compatibility with a fast, light, Mac-optimized experience, OrbStack is hard to beat right now." -- DEV Community, Nov 2025 [Tier 4]

---

## Sleep Prevention Requirements

### The Problem

Closing a MacBook lid puts it to sleep. An always-on agent cannot sleep. macOS Battery settings ("prevent automatic sleeping on power adapter") do NOT prevent sleep when the lid is physically closed -- Apple distinguishes "display off" from "lid closed." [Tier 1 -- Apple Support]

### Recommended Solution

**Option 1: `pmset disablesleep 1`** (Recommended for dedicated use)

```bash
# Disable sleep entirely (survives lid close)
sudo pmset -a disablesleep 1

# Re-enable when needed
sudo pmset -a disablesleep 0

# Verify current power settings
pmset -g
```

Native macOS command. No third-party software. Persistent setting that survives reboots. [Tier 3 -- Ask Different, 40-upvote answer]

**Tradeoff:** Disables ALL sleep, including manual sleep. If Jeff also uses this laptop on the go, he must remember to re-enable sleep. If the MacBook is exclusively an OpenClaw server, this is the cleanest solution.

**Option 2: Amphetamine app** (If Jeff uses the laptop for other things too)

Free Mac App Store app. Menu bar toggle to prevent sleep with granular options including "prevent sleep when display is closed." Easy to toggle on/off based on whether OpenClaw should be running. [Tier 4 -- multiple community recommendations]

**Tradeoff:** Third-party dependency that could break on macOS updates.

### Additional Sleep-Related Settings

- **Power adapter required:** Always plugged in. Battery life under Docker is 6-10 hours -- not viable for 24/7 operation. [Tier 1 -- Apple battery specifications]
- **Charge limit at 80%:** System Settings > Battery > set charge limit to 80% to protect battery longevity during always-plugged-in operation. [Tier 1 -- Apple macOS Sequoia feature]
- **Display sleep OK:** Display can sleep (saves power, reduces heat). System sleep is what kills the agent.

---

## Thermal Assessment

### The Concern

The MacBook Air M4 has **no fan** -- it relies entirely on passive cooling. This is the most significant hardware concern for running an always-on Docker workload. [Tier 1 -- Apple hardware specs]

### OpenClaw's Thermal Profile

OpenClaw as a social media agent is NOT a sustained-compute workload:

- **95% of the time:** Idle or near-idle. Gateway listening, minimal CPU. Thermal impact: negligible.
- **5% of the time:** Bursts when processing messages, running Claude API calls (network-bound, not CPU-bound), or executing skills. Thermal impact: moderate spikes, short duration.

This is fundamentally different from video rendering or compilation, which are sustained 100% CPU loads that trigger throttling within minutes on an Air. [Tier 4 -- community thermal testing reports]

### Community Evidence

> "When I start running a container on docker the CPU temperature reaches 85 degrees C in no time. Also the entire Mac gets so hot that I can't keep it on my lap." -- Apple Discussions [Tier 4]

> "Under most circumstances, the Air won't throttle unless or until you try to use it for professional creative work or other heavy workloads." -- Medium thermal analysis [Tier 4]

**CONTRADICTION:** Heat dissipation through keyboard

- **Claim A:** MacBooks dissipate heat through the keyboard area. Running lid-closed reduces cooling. [Tier 4 -- Stack Exchange, 10 upvotes]
- **Claim B:** Heat dissipates through the heatsink/fan exhaust under the hinge. Warm keyboard is a side effect of the unibody chassis, not a design feature. [Tier 4 -- Stack Exchange rebuttal, also well-upvoted]
- **Nature:** Community disagreement on thermal design. On the fanless Air, the distinction matters less since there is no fan exhaust regardless.
- **Current assessment:** For a mostly-idle workload, lid position has minimal thermal impact. For sustained bursts, lid-open is marginally better for passive heat dissipation.

### Thermal Verdict

**Acceptable but not ideal.** The Air will not throttle during normal agent operation (mostly idle, periodic API-bound bursts). It may throttle during intensive Playwright browser automation sessions or if multiple skills execute simultaneously. Throttling degrades performance (slower response times), not availability (the agent stays running). [Tier 1 -- Apple thermal management docs, Tier 4 -- community reports]

### Mitigation Strategies

1. **Laptop stand or elevated surface** -- improves passive heat dissipation. Cheap, effective. [Tier 5 -- general best practice]
2. **Lid open with screen brightness at zero** -- marginally better cooling than lid-closed. No display power draw if brightness is zero. [Tier 4 -- community practice]
3. **Use OrbStack** -- lower idle CPU means less sustained heat generation. [Tier 2 -- OrbStack benchmarks]
4. **Monitor thermals** -- Activity Monitor or `powermetrics` CLI can report throttling state. [Tier 4 -- community tooling]

---

## Mac Mini Alternative Note

**For Sean to discuss with Jeff:** If this MacBook Air will sit on a desk 95% of the time, a Mac Mini would be objectively better for this workload.

| Factor | Mac Mini | MacBook Air |
|--------|----------|-------------|
| Cooling | Active (fan) | Passive (fanless) |
| Always-on design | Yes -- designed for it | No -- requires configuration |
| Sleep management | Not an issue | Must be explicitly disabled |
| Battery management | None | Degrades over time when always plugged in |
| RAM options | 16/24/32 GB | 16/24 GB |
| Thermal throttling | Rare | Possible under sustained load |
| Portability | None | Full -- advantage for Jeff's lifestyle |
| Cost at equivalent specs | Lower | Higher |

**The MacBook Air trades server suitability for portability.** If Jeff values having a single machine that also travels with him, the Air works with the caveats documented in this report. If the machine will primarily sit on a desk, a Mac Mini is the better investment for a 24/7 agent deployment. [Tier 1 -- Apple specs, Tier 3-4 -- community server deployment reports]

This is a conversation for Sean to have with Jeff based on Jeff's actual usage pattern.

---

## Residual Risk from Hardware Choice

After all configuration and mitigation, these risks remain from choosing a MacBook Air as the deployment platform:

### Risk 1: Thermal Throttling During Intensive Operations

- **Threat:** Playwright browser automation or simultaneous multi-skill execution triggers thermal throttling, causing temporary slowdowns.
- **Likelihood:** Medium -- depends on Jeff's skill usage patterns. Social media caption generation alone is unlikely to trigger throttling. Browser-based Instagram automation might.
- **Impact:** Low -- degraded performance (slower responses), not lost availability. The agent stays running.
- **Residual:** Cannot be eliminated on a fanless laptop. Mitigated by OrbStack, laptop stand, and workload design that minimizes sustained CPU bursts.

### Risk 2: Docker Memory Creep

- **Threat:** Docker Desktop's documented memory leak (GitHub #7111) causes gradual RAM pressure over days/weeks of continuous operation. Even OrbStack, while better, has less long-term data under this specific workload.
- **Likelihood:** High with Docker Desktop, Low-Medium with OrbStack.
- **Impact:** System slowdowns, potential swap thrashing, possible OpenClaw instability. Resolved by restarting OrbStack/Docker periodically.
- **Residual:** Long-term memory behavior under OpenClaw on MacBook Air M4 specifically has not been independently measured. This is an open question for Jeff's first week of operation (see Report 05, Q1).

### Risk 3: Battery Degradation

- **Threat:** Always-plugged-in operation at 100% charge accelerates battery wear over months/years.
- **Likelihood:** High over long timeframes (this is lithium battery chemistry, not speculation).
- **Impact:** Reduced battery capacity when Jeff uses the laptop away from power. Does not affect plugged-in operation.
- **Residual:** The 80% charge limit mitigates significantly but does not eliminate degradation. Over 2+ years, battery health will decline measurably.

### Risk 4: Shared-Machine Security Surface

- **Threat:** Jeff's MacBook Air runs both OpenClaw and his personal/business applications. A Docker sandbox escape (through a zero-day vulnerability) could expose Jeff's client data, browser sessions, and credentials.
- **Likelihood:** Low -- Docker container escapes are rare and require sophisticated attackers.
- **Impact:** High -- access to client PII, financial data, browser sessions. Full analysis in Report 04.
- **Residual:** Cannot be eliminated on a shared machine. Mitigated by sandbox mode, localhost binding, minimal tool permissions, and FileVault. A dedicated machine would eliminate this risk entirely.

---

## Transferable Principle

This feasibility analysis is not OpenClaw-specific. **Any Docker-based, always-on service deployed on a consumer laptop faces these same constraints:** sleep management, thermal management, battery health, and RAM overhead from the container runtime VM. The mitigations -- OrbStack for efficient resource use, pmset for sleep prevention, charge limits for battery health, laptop stands for thermals -- transfer to any similar deployment scenario. The question "should I use a laptop or a dedicated server?" applies every time someone deploys infrastructure on a consumer device.
