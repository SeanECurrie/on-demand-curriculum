# Pattern 002: Per-Agent Routing Over Elevated Mode

**Date:** 2026-02-11
**Source:** Architecture deep-dive (Context7 + eastondev.com source analysis)

## Problem

You need some tasks to run on the host (outside the Docker sandbox) while keeping most agent interactions sandboxed. OpenClaw's `tools.elevated` mode provides an escape hatch, but it bypasses the entire sandboxing layer — your primary security boundary.

## Context

- Elevated mode allows authorized senders to execute commands directly on the host, even when sandbox is enabled
- `allowFrom` lists are static — no time-based or context-based restrictions
- Combined with prompt injection, an attacker who controls content the agent reads could trigger elevated exec through an authorized channel
- Once enabled, elevated mode applies to ALL exec calls from that sender

## Solution

**Disable elevated mode entirely.** Instead, use OpenClaw's multi-agent architecture with per-agent routing:

```json5
{
  agents: {
    list: [
      { id: "chat", model: "anthropic/claude-sonnet-4-5", sandbox: { mode: "all" } },
      { id: "deepwork", model: "anthropic/claude-opus-4-6", sandbox: { mode: "off" } }
    ]
  },
  bindings: [
    // Only Sean's direct messages go to the unsandboxed agent
    { agentId: "deepwork", match: { channel: "whatsapp", peer: { kind: "dm", id: "+1SEANPHONE" } } },
    // Everything else is sandboxed
    { agentId: "chat", match: { channel: "whatsapp" } }
  ],
  tools: { elevated: { enabled: false } }
}
```

## Evidence

- Official docs warn: "Keep `tools.elevated.allowFrom` tight and don't enable it for strangers" (Tier 1)
- Bindings use deterministic match order (most specific wins) — architecturally clean (Tier 1)
- eastondev.com source analysis confirms per-agent isolation extends to workspace, sessions, sandbox config, tool permissions (Tier 3)

## Trade-offs

- **Pro:** Security boundary is architectural (agent isolation) rather than a single escape hatch
- **Pro:** Each agent has its own workspace, sessions, sandbox config, and tool permissions
- **Pro:** Routing is deterministic and auditable
- **Con:** More configuration than a simple `elevated.enabled: true`
- **Con:** Requires understanding the binding/routing system
- **Revisit when:** Never — this is strictly superior to elevated mode for security
