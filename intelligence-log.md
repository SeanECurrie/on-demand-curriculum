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
| 2026-02-10 | VALIDATED: Mac Mini M4 deployment path is STRONGLY supported by community. Caused actual hardware supply shortages. M4 16GB is MORE than sufficient — agent orchestrates API calls, doesn't need heavy compute. | 42 sources (Wccftech, Cloudflare, AWS, Reddit, etc.) | Tier 2-3 |
| 2026-02-10 | VALIDATED: Mac Mini 24/7 reliability is extensively proven. Users report years of continuous operation. Apple designed for this (bottom power button). ~$1/month electricity at 5-10W average. | Reddit, Medium, Stack Exchange, multiple independent measurements | Tier 3 |
| 2026-02-10 | VALIDATED: Tailscale completely resolves Tim's "opens home network" concern. Community-standard solution for self-hosted AI agent access. 5-minute setup on macOS. | DEV Community, Tailscale official blog, Reddit | Tier 2-3 |
| 2026-02-10 | DISCOVERY: macOS gotchas for headless operation: sleep prevention (caffeinate/IOPMLib), headless display (dummy HDMI plug), auto-update disable, screensaver/auto-lock disable, auto-restart after power failure. All solvable. | GitHub openclaw/openclaw #7700, stealthpuppy.com | Tier 2-3 |
| 2026-02-10 | GAP IDENTIFIED: Disaster recovery is the only remaining valid VPS advantage. No automated snapshots on Mac Mini. Mitigation: Time Machine + config-as-code in git + UPS ($30-50). | Community synthesis | Tier 3-4 |
