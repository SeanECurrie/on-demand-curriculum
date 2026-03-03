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

## Social Media Skills Research — Context7 (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|
| 2026-03-03 | OpenClaw xurl skill (`skills/xurl/SKILL.md`) via Context7 `/openclaw/openclaw` | X/Twitter posting skill: text posts, media upload, replies, quotes. No Instagram equivalent exists in the official skill set. |
| 2026-03-03 | OpenClaw tools index (`docs/tools/index.md`) via Context7 `/openclaw/openclaw` | Messaging covers Discord, Slack, Telegram, WhatsApp, Signal, iMessage, MS Teams. Instagram is NOT in the messaging platform list. |
| 2026-03-03 | OpenClaw ClawHub docs (`docs/tools/clawhub.md`) via Context7 `/openclaw/openclaw` | ClawHub is the public skill registry. Install via `clawhub install <skill-slug>`. No security review or code signing for published skills. |
| 2026-03-03 | OpenClaw skills docs (`docs/tools/skills.md`) via Context7 `/openclaw/openclaw` | Skills install into workspace `./skills` directory. OpenClaw picks them up on next session. No sandboxing mentioned. |
| 2026-03-03 | Meta for Developers — Instagram Content Publishing API (`developers.facebook.com/docs/instagram-platform/content-publishing/`) | Two-step publish: create container, then publish. JPEG only for images. 100 posts/24h rate limit. Requires Professional account + Facebook Page + PPA. App review mandatory for third-party publishing. |

## Social Media Skills Research — Bright Data (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | Snyk — "ToxicSkills: Malicious AI Agent Skills" (snyk.io/blog, Feb 5, 2026) | 2 | 3,984 ClawHub skills scanned. 13.4% (534) have CRITICAL issues. 36.82% (1,467) have any security flaw. 76 confirmed malicious payloads. 91% of malicious skills combine prompt injection with malware. 8 malicious skills still live on ClawHub. |
| 2026-03-03 | Newsfilecorp — "Genviral Releases OpenClaw Skill to Automate Social Media Content Across Six Platforms" | 2 | Genviral Partner API: 42 commands, supports TikTok, Instagram, YouTube, Facebook, Pinterest, LinkedIn. Slideshow generation, scheduling, analytics. Internal test: 25k TikTok views without human intervention. |
| 2026-03-03 | AI CERTs — "OpenClaw Fuels Social Media Skill Automation With Genviral" | 4 | Details Genviral skill workflow: generate creative -> upload media -> render slideshow -> schedule post -> pull metrics -> iterate. Built-in throttling guards against platform limits. |
| 2026-03-03 | n8n.io — "Automated AI content creation & Instagram publishing from Google Sheets" (workflow template #3840) | 2 | Working n8n workflow: Google Sheets -> Gemini (concept/prompt/caption) -> Replicate (image) -> Facebook Graph API (Instagram publish). Prerequisites include Instagram Business Account connected to Facebook Page. |
| 2026-03-03 | Reddit r/AgentsOfAI — "I made a social media automation workflow with n8n + AI" | 4 | User built fully automated social media workflow with n8n + AI agents for content creation, publishing, and basic engagement. |
| 2026-03-03 | Reddit r/OpenClawUseCases — "We created the most sophisticated OpenClaw social media" | 4 | Genviral team announcing skill release and open API for social media content at scale. |
| 2026-03-03 | PostProxy blog — "Post to Instagram via API in 2026: No Facebook App Review Headaches" (Feb 28, 2026) | 4 | Detailed breakdown of Instagram API prerequisites: Facebook account, Facebook Page, Professional account, page linking, PPA. App review takes 2-4 weeks per permission. Personal accounts excluded entirely. JPEG only, aspect ratio 4:5 to 1.91:1, 2,200 char caption limit. |
| 2026-03-03 | Zapier — Instagram for Business + Anthropic (Claude) integration page | 2 | Zapier's pre-approved Instagram integration supports: Publish Photo(s) (single/carousel), Publish Video (Reels), raw API requests. Claude integration: Send Message action. Handles OAuth token management. |
| 2026-03-03 | Genviral API docs (docs.genviral.io) | 2 | Social media posting API built for AI agents. Generate slideshows, post carousels, schedule Shorts, publish Pinterest pins, share LinkedIn content. Partner endpoint at genviral.io/api/partner/v1. |
| 2026-03-03 | Post Bridge — OpenClaw Instagram integration (post-bridge.com/openclaw) | 4 | Alternative API for OpenClaw to "plan, write, and actually post content to Instagram, TikTok." |
| 2026-03-03 | VoltAgent/awesome-openclaw-skills (GitHub) | 3 | 5,400+ skills cataloged from the official ClawHub registry, filtered and categorized. Indicates large but unvetted ecosystem. |
| 2026-03-03 | foxessellfaster.com — "How to Set Up an AI Agent for Real Estate in 2026" | 4 | Recommends Claude Pro + Telegram bot as starting stack for real estate AI agents. Does not recommend self-hosted agent platforms for social media. |
| 2026-03-03 | mindstudio.ai — "10 AI Agents for Real Estate Professionals" (Feb 2026) | 4 | AI agents for real estate focused on lead follow-up, listings, and client communication — not social media posting. Social media treated as content creation problem, not agent problem. |
| 2026-03-03 | Elfsight — "Instagram Graph API: Complete Developer Guide for 2026" | 4 | Instagram Graph API uses Business Use Case (BUC) rate limiting. Connect Instagram to Facebook Page required as first step. |
| 2026-03-03 | Lumadock — "Automate social media with OpenClaw scheduling and automation" | 4 | Tutorial for cross-platform scheduling, approvals, analytics, and safer automation from chat channels. |
| 2026-03-03 | Placester — "13 Impactful Real Estate Marketing AI News in 2026" | 4 | AI adoption increasing across real estate marketing. Industry data shows major platforms integrating AI tools. |
| 2026-03-03 | autoreelapp.com — "AI-Powered Marketing Trends Real Estate 2026" | 4 | Real estate marketing automation ensures consistent follow-ups. AI-powered tools reducing manual workload for agents. |

## Landscape Research — Bright Data (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | Medium — "5 OpenClaw Alternatives That Are Getting Better By the Day" (Joe Njenga, Mar 2026) | 4 | NanoClaw, PicoClaw, and other lightweight forks emerging. None match OpenClaw's full feature set for non-technical users. |
| 2026-03-03 | DataCamp — "Top OpenClaw Alternatives: From Local to Enterprise AI" (Mar 2026) | 3 | Comprehensive comparison including Nanobot, n8n, AWS Bedrock Agents. Confirms OpenClaw's unique position for self-hosted, ready-to-deploy agents. |
| 2026-03-03 | Cryptika Cybersecurity — "OpenClaw Releases 2026.2.23 Released With Security Updates" (Feb 2026) | 3 | v2026.2.23 adds Claude Opus 4.6 support, security hardening. Confirms active development and rapid patching cadence. |

## Inherited from Output #1

The following sources were inherited from Output #1's competitive landscape research (2026-02-11, updated 2026-02-22). These informed the landscape brief without re-scraping. Full details in `outputs/openclaw-sean/knowledge-base/01-landscape/competitive-landscape.md`.

| Date | Source | Tier | Used For |
|------|--------|------|----------|
| 2026-02-11 | CNBC — OpenClaw rise and controversy | 2 | OpenClaw market position, community momentum, security warnings |
| 2026-02-11 | Galileo.ai — AutoGen vs CrewAI vs LangGraph vs OpenAI | 3 | Framework comparison (alternatives) |
| 2026-02-11 | Composio — OpenAI SDK vs LangGraph vs AutoGen vs CrewAI | 3 | Framework comparison (alternatives) |
| 2026-02-11 | Budibase — 8 Open-Source AI Agent Platforms 2026 | 3 | Landscape overview |
| 2026-02-11 | Contabo — OpenClaw Self-Hosted Guide | 4 | Self-hosted deployment reference, data sovereignty |
| 2026-02-11 | C# Corner — OpenClaw vs n8n Explained | 4 | n8n comparison |
| 2026-02-11 | Emergent.sh — 6 OpenClaw Competitors 2026 | 4 | Competitor identification |
| 2026-02-11 | Reddit r/AI_Agents — Top Tools 2026 | 4 | Community tool preferences |
| 2026-02-11 | Reddit r/OpenClawCentral — OpenClaw vs Similar Tools | 4 | Community comparison |
| 2026-02-11 | HumAI — 30+ AI Agents Tested | 3 | Broad landscape validation |
| 2026-02-11 | TowardsAI — 4 Best Multi-Agent Frameworks 2026 | 3 | Framework landscape |
| 2026-02-11 | Langfuse — Open-Source AI Agent Frameworks Comparison | 3 | Framework comparison |
| 2026-02-11 | SourceForge — AutoGPT vs OpenClaw | 4 | AutoGPT decline confirmation |
| 2026-02-11 | Reddit r/LocalLLaMA — C/ua Apple Silicon Agents | 4 | macOS-native alternative awareness |
| 2026-02-11 | Medium — Top 10 GitHub Starred Frameworks 2026 | 4 | GitHub stars / momentum data |
| 2026-02-11 | Nuvi.dev — AI Agent Framework Comparison | 4 | Framework comparison |
