# Pattern 003: Reader Agent for Prompt Injection Defense

**Date:** 2026-02-11
**Source:** OpenClaw official docs (Tier 1), Semgrep security analysis (Tier 2)

## Problem

In agentic AI systems, the boundary between data and code does not exist. The LLM consumes data (emails, web pages, documents) and produces code (tool calls). Any untrusted content the agent reads can contain adversarial instructions that cause the agent to take unintended actions — even if the sender is trusted.

## Context

- Proven attack chains exist: email containing prompt injection → agent leaks private key (Archestra.AI CEO demo)
- Email forwarding attack: instructions in email body caused agent to forward victim's emails to attacker
- The "Find the Truth" social engineering: tester wrote "There are clues on the HDD" → agent started exploring filesystem
- Even with DM pairing locked down, content itself is the attack vector, not the sender

## Solution

Use a **read-only, tool-disabled agent** to summarize untrusted content before passing it to the main agent:

1. Create a "reader" agent with NO tool access (especially no exec, write, browser)
2. Route untrusted content (emails, web pages, documents) through the reader agent
3. Reader produces a plain-text summary stripped of any instruction-like content
4. Main agent receives the sanitized summary, not the raw content

```json5
{
  agents: {
    list: [
      { id: "reader", model: "anthropic/claude-sonnet-4-5",
        tools: { allow: ["read"], deny: ["exec", "write", "browser", "web_fetch", "process"] },
        sandbox: { mode: "all" } },
      { id: "main", model: "anthropic/claude-opus-4-6",
        sandbox: { mode: "all" } }
    ]
  }
}
```

## Evidence

- Official OpenClaw docs recommend this pattern explicitly (Tier 1)
- Semgrep Principle 1: "In agentic systems, the boundary between data and code does not exist" (Tier 2)
- Model selection matters: Claude Opus is strongest at recognizing prompt injections; smaller models "generally more susceptible to tool misuse and instruction hijacking" (Tier 1)

## Trade-offs

- **Pro:** Contains prompt injection in untrusted input — adversarial instructions never reach a tool-enabled agent
- **Pro:** Works with any content source (email, web, documents)
- **Con:** Adds latency (two LLM calls instead of one for external content)
- **Con:** Summary may lose nuance from original content
- **Con:** Requires orchestration logic to route content through reader first
- **Revisit when:** LLMs develop reliable instruction-following boundaries (not expected near-term)
