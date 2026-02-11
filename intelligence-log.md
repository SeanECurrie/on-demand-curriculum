# Intelligence Log

Strategic insights only. Hypotheses validated, contradictions found, key discoveries.

---

| Date | Insight | Source | Tier |
|------|---------|--------|------|
| 2026-02-10 | Tim warns most ClawdBot guides have "massive security vulnerabilities" — independent verification needed during Phase 1 security research | Tech With Tim video | Tier 2 |
| 2026-02-10 | Tim argues VPS > Mac Mini (cost, network exposure, physical security). Sean's setup partially addresses these: owns hardware (cost moot), Tailscale configured (network exposure mitigated). Physical security/uptime is the remaining valid concern — research should quantify this risk. | Tech With Tim video + operator context | Tier 2 + Tier 1 |
| 2026-02-10 | Tim identifies prompt injection via email/external inputs as primary attack vector for connected bots. This should be a priority investigation during security research. | Tech With Tim video | Tier 2 |
| 2026-02-10 | VALIDATED: Tim's security warnings confirmed by community. Reddit/Auth0/Hostinger all independently identify root-level shell access and prompt injection as critical concerns. The "find ~ Incident" is documented in official docs. | Community sweep (41 sources) | Tier 2-4 |
| 2026-02-10 | DISCOVERY: Codebase described as "heavily vibe-coded" by multiple independent sources. Config duplication across files. "Developer-grade experiment packaged as product." Expect rough edges during deployment. | Reddit, LinkedIn | Tier 4 |
| 2026-02-10 | DISCOVERY: Strong model REQUIRED. Community consensus: Claude Opus/Sonnet work; cheaper/OSS models break the agent. Initial setup burns massive tokens (8M+ reported). Budget accordingly. | Reddit (multiple threads) | Tier 4 |
| 2026-02-10 | DISCOVERY: macOS Keychain access dialogs reported — ClawdBot may request Keychain access on macOS. User uninstalled over this. MUST investigate before deploying on Mac Mini. | reddit.com/r/ClaudeAI | Tier 4 |
| 2026-02-10 | DISCOVERY: Community strongly recommends hardened Docker deployment (non-root, cap-drop=ALL, read-only FS). Our Mac Mini approach should evaluate Docker vs native launchd. | reddit.com/r/LocalLLM | Tier 4 |
| 2026-02-10 | DISCOVERY: `openclaw security audit` is a built-in command. Must run this as part of deployment validation. | Medium (Reza Rezvani) | Tier 2 |
