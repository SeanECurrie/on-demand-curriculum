# Pattern 001: Zero ClawHub Supply Chain Defense

**Date:** 2026-02-11
**Source:** Security posture analysis (48+ sources), Koi Security ClawHavoc report

## Problem

AI agent skill ecosystems are actively compromised. Installing third-party skills from community marketplaces introduces supply chain risk that is difficult to detect and easy to exploit.

## Context

- ClawHub (OpenClaw's skill marketplace) has a 12% malicious rate (341/2857 audited skills per Koi Security)
- Attack techniques include ClickFix lures, typosquatting, reputation washing, base64-encoded commands, `curl | bash` patterns
- Academic research found 26% of agent skills across the LLM ecosystem contain at least one vulnerability (arXiv:2601.10338)
- Skills are Markdown instructions with YAML frontmatter — they teach the agent to use tools, meaning a malicious skill can direct the agent to execute arbitrary commands

## Solution

**Zero external skills policy.** Do not install ANY skills from ClawHub or community sources. Instead:

1. Use only bundled skills (53 official, reviewed by OpenClaw team)
2. Write custom skills as Markdown (SKILL.md) for any needed functionality
3. Use `allowBundled` whitelist to control which bundled skills are active
4. If external skills are absolutely necessary, vet with Cisco's skill scanner (`pip install cisco-ai-skill-scanner`)

## Evidence

- Koi Security "ClawHavoc" report: 341 confirmed malicious skills (Tier 2)
- Semgrep firsthand knowledge of PoC skills that evade agentic safeguards (Tier 2)
- 1Password analysis of skills as attack surface (Tier 2)
- Known malicious C2 infrastructure: `91[.]92[.]242[.]30`

## Trade-offs

- **Pro:** Zero supply chain risk from third-party skills
- **Pro:** Custom skills are fully auditable (they're just Markdown)
- **Con:** More effort to build custom skills vs installing community ones
- **Con:** Miss out on legitimate community innovations
- **Revisit when:** ClawHub implements mandatory code signing, automated scanning, and the malicious rate drops below 1%
