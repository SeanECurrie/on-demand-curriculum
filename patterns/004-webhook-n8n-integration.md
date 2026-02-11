# Pattern 004: Webhook-Based n8n Integration

**Date:** 2026-02-11
**Source:** Architecture deep-dive (Context7 official docs), skills reference

## Problem

You need deterministic, auditable workflow automation alongside an autonomous AI agent. Some tasks require guaranteed execution paths (ETL, approval chains, data sync) that should not depend on LLM reasoning.

## Context

- OpenClaw excels at reasoning-heavy, ad-hoc tasks but is non-deterministic
- n8n excels at deterministic, repeatable workflows with 1,200+ pre-built integrations
- Community consensus: "some teams run both" (Contabo guide, Tier 4)
- Recommended stack: OpenClaw + n8n + Langfuse (observability)

## Solution

Use OpenClaw's **webhook API** (`POST /hooks/<path>`) as the bridge between n8n and OpenClaw:

```json5
// In openclaw.json
{
  hooks: {
    enabled: true,
    token: "shared-secret-between-n8n-and-openclaw",
    path: "/hooks",
    mappings: [
      {
        match: { path: "n8n-alerts" },
        action: "agent",
        wakeMode: "now",
        sessionKey: "hook:n8n:{{trigger.id}}",
        messageTemplate: "n8n alert: {{trigger.message}}",
        model: "anthropic/claude-sonnet-4-5"  // Use cheap model for webhook processing
      }
    ]
  }
}
```

n8n workflow nodes POST to `http://localhost:18789/hooks/n8n-alerts` with the shared token.

## Evidence

- Official docs document webhook hooks with template-based message formatting (Tier 1)
- Per-webhook model override means n8n-triggered tasks can use cheaper models (Tier 1)
- Wake modes allow immediate or deferred processing (Tier 1)
- No custom code needed — clean REST interface (Tier 1)

## Trade-offs

- **Pro:** n8n handles deterministic workflows (compliance-heavy, auditable)
- **Pro:** OpenClaw handles reasoning-heavy, ad-hoc tasks
- **Pro:** Per-webhook model selection controls costs
- **Pro:** No custom code — standard HTTP webhook integration
- **Con:** Two systems to maintain and monitor
- **Con:** Shared secret management between n8n and OpenClaw
- **Revisit when:** OpenClaw's Lobster runtime matures enough to handle deterministic workflows natively
