# Source Tracking — OpenClaw for Jeff (Output #2)

All sources used in research, with credibility tier and date.

## Credibility Tiers

1. Official documentation + verified changelogs
2. Established creators with proven deployments
3. GitHub issues/PRs with reproducible details
4. Reddit/forum posts with technical specificity
5. General community sentiment

## Inherited from Output #1

Sources reused from Output #1 (openclaw-sean) are marked with `[inherited]` and freshness-checked before use. Original source details in `outputs/openclaw-sean/research/sources.md`.

## Context7 — Official Documentation (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|
| 2026-03-03 | OpenClaw FAQ (`docs/help/faq.md`) via Context7 `/openclaw/openclaw` | Minimum requirements: 1 vCPU, 1 GB RAM, 500 MB disk. Recommended: 2 GB+ RAM, 1-2 vCPUs. Node tools and browser automation resource-intensive. |
| 2026-03-03 | OpenClaw Docker install guide (`docs/install/docker.md`) via Context7 `/openclaw/openclaw` | Docker Desktop or Engine + Compose v2 required. Minimum 2 GB RAM for image build (OOM at 1 GB). |
| 2026-03-03 | OpenClaw browser tools (`docs/tools/browser.md`) via Context7 `/openclaw/openclaw` | Playwright required for snapshots, navigation, PDF, screenshots. Docker Playwright install requires bundled CLI, not npx. |
| 2026-03-03 | OpenClaw Hetzner install (`docs/install/hetzner.md`) via Context7 `/openclaw/openclaw` | Docker install via official script on Ubuntu/Debian. Verification commands documented. |
| 2026-03-03 | Docker Desktop Mac install (`mac-install.md`) via Context7 `/docker/docs` | Apple Silicon: at least 4 GB RAM, Rosetta 2 optional. Supports current + 2 previous macOS versions. |
| 2026-03-03 | Docker Desktop settings docs via Context7 `/docker/docs` | Default memory allocation: 50% of host RAM. Configurable via settings. |
| 2026-03-03 | Apple Support — Battery settings, clamshell mode, sleep prevention | "Prevent automatic sleeping on power adapter when display is off" setting. Clamshell mode requires external display + power. |

## Bright Data — Community Intelligence (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | OrbStack blog — "We fixed container memory usage on macOS" (orbstack.dev/blog/dynamic-memory) | 2 | OrbStack uses dynamic memory management; releases unused RAM automatically. |
| 2026-03-03 | OrbStack docs — comparison with Docker Desktop (orbstack.dev/docs/compare/docker-desktop) | 2 | OrbStack idle CPU ~0.1%, significantly lower than Docker Desktop. Faster startup. |
| 2026-03-03 | Setapp — "5 best Docker Desktop alternatives for Mac" (Jan 2026) | 2 | "OrbStack is the best Docker Desktop alternative for Mac in 2026." |
| 2026-03-03 | DEV Community — "OrbStack vs Apple Containers vs Docker on macOS" (Nov 2025) | 4 | "OrbStack is still my main recommendation today" for Docker compatibility + Mac optimization. |
| 2026-03-03 | GitHub docker/for-mac#7111 — "Docker Desktop eats a lot of memory over time" (Dec 2023) | 3 | Docker Desktop consumes 5-6 GB RAM after 2 days on Mac Mini M2 8 GB. Restarts fix temporarily. |
| 2026-03-03 | Docker Community Forums — "Docker Desktop Idle Memory Usage" (forums.docker.com) | 4 | Docker Desktop consumes 3 GB at idle. Memory limits configurable via .wslconfig (Windows) or settings (Mac). |
| 2026-03-03 | OneUptime blog — "How to Configure Docker Desktop Memory and CPU Limits on macOS" (Feb 2026) | 4 | On 16 GB MacBook Pro, Docker defaults to 5 cores and 2-4 GB memory. Recommended settings by workload documented. |
| 2026-03-03 | Reddit r/developersIndia — "IS A MACBOOK AIR M4 (16GB RAM) ENOUGH FOR FULLSTACK?" | 4 | User reports Docker works on M4 Air 16 GB but uses significant RAM. |
| 2026-03-03 | Reddit r/macbookair — "Air M2/24/512 or M4/16/512 for web development?" | 4 | Community advises extra RAM over newer CPU: "Beats me how anyone who runs docker can survive on 16GB." |
| 2026-03-03 | Hacker News — "Anyone Using MacBook Air M2 24GB for Development?" | 4 | Developer runs Redis + PostgreSQL in Docker Compose on M2 Air 24 GB successfully. |
| 2026-03-03 | Medium — "You Don't Need An M4 MacBook Pro" | 4 | "If you do Docker or VMs probably you need even more memory than that, perhaps as high as 32GB." |
| 2026-03-03 | Reddit r/macbookair — "MacBook Air M3: Throttling concerns for heavy tasks?" | 4 | M1 Air overheats and throttles during sustained tasks. User reports 85C temps on lighter tasks. |
| 2026-03-03 | Apple Discussions thread 251362074 — "Heating issue when running docker" | 4 | Docker container brings CPU to 85C quickly; MacBook "so hot I can't keep it on my lap." |
| 2026-03-03 | Medium — "Is the MacBook Air's Thermal Throttling a Problem?" | 4 | Throttling unlikely unless sustained professional creative work or heavy loads. |
| 2026-03-03 | Ask Different (Stack Exchange) — "Can I use a MacBook as a server with the lid closed?" (52k views) | 3 | `sudo pmset -a disablesleep 1` prevents all sleep. Amphetamine app as alternative. Clamshell mode needs external display. |
| 2026-03-03 | Reddit r/MacOS — "How to prevent MacBook from going to sleep with lid closed" | 4 | Amphetamine app with caffeine extension recommended for clamshell-without-display use. |
| 2026-03-03 | Macworld — "How to stop your MacBook sleeping when the lid is closed" | 4 | Solutions: Amphetamine, clamshell mode, network wake settings. |
| 2026-03-03 | Paolo Mainardi blog — "Docker on MacOS is still slow?" (Jan 2025) | 4 | VirtioFS performance improved significantly. OrbStack recommended for speed + usability blend. |

## Security Research — Context7 (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|
| 2026-03-03 | OpenClaw Gateway security docs (`docs/gateway/security/index.md`) via Context7 `/openclaw/openclaw` | Secure baseline config: local mode, loopback bind, token auth, DM pairing policy. Non-loopback binds now require auth (fail-closed). |
| 2026-03-03 | OpenClaw Gateway troubleshooting (`docs/gateway/troubleshooting.md`) via Context7 `/openclaw/openclaw` | Post-upgrade: bind+auth guardrails stricter, old key formats deprecated, device identity/pairing state changes require re-approval. |

## Security Research — Bright Data (Tier 2-4)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | Infosecurity Magazine — "Researchers Reveal Six New OpenClaw Vulnerabilities" (Feb 19, 2026) | 2 | Endor Labs found 6 new vulns (SSRF, auth bypass, path traversal). CVE-2026-26322 (CVSS 7.6), CVE-2026-26319 (CVSS 7.5), CVE-2026-26329 (high). All patched. |
| 2026-03-03 | The Hacker News — "ClawJacked Flaw Lets Malicious Sites Hijack Local OpenClaw AI Agents" (Feb 28, 2026) | 2 | Oasis Security discovered WebSocket hijack via localhost. Brute-force gateway password + silent device registration. Patched v2026.2.25. Also covers log poisoning (v2026.2.13), 71 new malicious ClawHub skills, agent-to-agent attack chain. |
| 2026-03-03 | SentinelOne — CVE-2026-25475 vulnerability database entry | 2 | Path traversal vulnerability in OpenClaw. Patched v2026.2.2. |
| 2026-03-03 | SonicWall — "OpenClaw Auth Token Theft Leading to RCE: CVE-2026-25253" (late Feb 2026) | 2 | Detailed technical analysis of CVE-2026-25253 kill chain. |
| 2026-03-03 | Oasis Security — "OpenClaw Vulnerability" (ClawJacked disclosure) | 2 | Original ClawJacked research. Localhost auto-approval bypass, missing rate limiting. Fix in <24 hours. |
| 2026-03-03 | Eye Security — "Log Poisoning in OpenClaw" | 2 | Log poisoning enables indirect prompt injection. Agent reads own logs = poisoned logs influence behavior. |
| 2026-03-03 | Trend Micro — "OpenClaw Skills Used to Distribute Atomic macOS Stealer" (Feb 2026) | 2 | Malicious ClawHub skill installs Atomic Stealer via fake "prerequisite." Payload from 91.92.242.30. |
| 2026-03-03 | Straiker — "Built on ClawHub, Spread on Moltbook: The New Agent-to-Agent Attack Chain" | 2 | bob-p2p-beta skill instructs agents to store Solana private keys in plaintext, buy worthless tokens. Agent-to-agent social engineering. |
| 2026-03-03 | Endor Labs — "How AI SAST Traced Data Flows to Uncover Six OpenClaw Vulnerabilities" | 2 | Trust boundaries extend beyond user input; LLM outputs and tool params are attack surfaces. |
| 2026-03-03 | Penligent AI — "OpenClaw 2026.2.23 Brings Security Hardening" | 3 | v2026.2.23: optional HSTS, stricter bind+auth guardrails, security boundary improvements. |
| 2026-03-03 | Inman.com — "3 ways artificial intelligence will reshape real estate in 2026" (Feb 6, 2026) | 4 | Inman Connect NY: AI data security concerns specific to real estate. Client data exposure, deepfake fraud, proptech vendor security. |
| 2026-03-03 | Real Estate News — "AI and real estate data: Who's making the rules?" (Feb 23, 2026) | 4 | MLSs pursuing "license, not lawsuit" strategy for AI data guardrails. Regulatory environment tightening. |
