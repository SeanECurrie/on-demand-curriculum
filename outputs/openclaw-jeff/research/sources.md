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

## Mac Mini Hardware Research — Context7 (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|
| 2026-03-03 | Apple Mac Mini Technical Specifications (apple.com/mac-mini/specs) | M4 base: 16GB/24GB unified memory, 256GB-2TB SSD, all soldered. M4 Pro: 24GB/48GB, Thunderbolt 5, 10Gb Ethernet option. |
| 2026-03-03 | Apple Mac Mini Store Page (apple.com/shop/buy-mac/mac-mini) | M4 24GB/512GB: $999. M4 16GB/256GB: $599. M4 Pro 24GB/512GB: $1,399. Street pricing ~$100 below Apple. |
| 2026-03-03 | Apple Support — Mac Mini Power Consumption | Mac Mini M4 maximum power consumption: 155W. Confirms Jeff Geerling's independent measurements. |

## Mac Mini Hardware Research — Bright Data (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | Jeff Geerling — M4 Mac Mini Efficiency blog (jeffgeerling.com) | 2 | Measured power draw: idle 3-4W, light load 5-7W, sustained compute 42W, max 155W. At 5W average: ~44 kWh/year = ~$6.50/year at $0.15/kWh. Most credible independent source for Mac hardware power measurements. |
| 2026-03-03 | AppleInsider Pricing Tracker (appleinsider.com) | 2 | Tracks street pricing for Mac Mini configurations. M4 24GB/512GB available ~$899 from authorized resellers. |
| 2026-03-03 | MacRumors Mac Mini Roundup (macrumors.com/roundup/mac-mini) | 2-3 | Comprehensive M4 Mac Mini specs, configuration options, pricing history. Confirms RAM and storage are soldered (non-upgradeable). |
| 2026-03-03 | Macworld — M4 Mac Mini specs and review (macworld.com) | 2 | Detailed specs comparison M4 vs M4 Pro. Port layout, thermal design, form factor analysis. |
| 2026-03-03 | Hostbor — Mac Mini M4 Home Server Review (hostbor.com) | 3-4 | Real-world home server deployment experience. Confirms always-on reliability, low power draw, headless operation viability. |
| 2026-03-03 | MacRumors Forums — M4 Pro Thunderbolt 5 display issues | 3-4 | Users report M4 Pro Thunderbolt 5 has issues powering portable displays via single USB-C cable. Known compatibility problem. |
| 2026-03-03 | iMore — Headless Mac Mini setup guide (imore.com) | 3 | Step-by-step guide for headless Mac Mini operation. Screen Sharing setup, initial peripheral requirements, HDMI dummy plug recommendation. |
| 2026-03-03 | MPU Talk Forums — M4 Mac Mini headless discussion (talk.macpowerusers.com) | 3-4 | Community discussion on running M4 Mac Mini headless. HDMI dummy plug ($8-12) recommended for proper Screen Sharing resolution. |
| 2026-03-03 | Apple Community Discussions — Mac Mini headless setup (discussions.apple.com) | 3-4 | User reports on initial setup requirements. Confirms need for display + keyboard + mouse for first boot only. |

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

## Open Questions Research — Context7 (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|
| 2026-03-03 | OpenClaw system prompt docs (`docs/concepts/system-prompt`) via Context7 `/openclaw/openclaw` | System prompt built per agent run. SOUL.md, IDENTITY.md, USER.md, HEARTBEAT.md bootstrap files for personality. Hooks can swap SOUL.md for alternate persona. |
| 2026-03-03 | OpenClaw update docs (`docs/install/updating`) via docs.openclaw.ai | Preferred update: re-run installer. Post-update: `openclaw doctor` + gateway restart. Pre-1.0 — breaking changes possible. |
| 2026-03-03 | OpenClaw migration docs (`docs/install/migrating`) via Context7 `/openclaw/openclaw` + docs.openclaw.ai | Backup: tar `~/.openclaw` + workspace. Migration: copy state dir, run doctor. Backups contain credentials — treat as secrets. |
| 2026-03-03 | OpenClaw Gmail integration (`docs/gateway/configuration-reference.md`, `docs/automation/gmail-pubsub.md`) via Context7 `/openclaw/openclaw` | Gmail via Google Cloud Pub/Sub. Requires GCP project, OAuth, Pub/Sub topic/subscription. Complex setup. Auto-starts watcher on boot. |

## Open Questions Research — Bright Data (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | ZeroClaw Migration Assessment (GitHub Gist, yanji84, Feb 22, 2026) | 3 | Each OpenClaw bot instance consumes ~420-440 MB RAM in always-running Docker container on 8 GB VPS. |
| 2026-03-03 | Tencent Cloud — OpenClaw Deploying Optimal Configuration (tencentcloud.com/techpedia/140020) | 4 | 4 GB RAM recommended for standard deployment, 2 GB absolute minimum. |
| 2026-03-03 | Medium — OpenClaw Review (kannasekarr) | 4 | Average response time 1.2 seconds, 99.8% uptime, zero lost messages for self-hosted instance. |
| 2026-03-03 | oflight.co.jp — "OpenClaw Prompt Engineering Tips" | 4 | Practical prompt engineering: system prompt design, task decomposition, persona definition in SOUL.md. |
| 2026-03-03 | CreatorFlow — "Instagram API Rate Limits: 200 DMs/Hour Explained (2026)" | 4 | Meta Instagram Graph API: 200 requests/hour, 100 posts/24h. DM automation: 200 messages/hour. |
| 2026-03-03 | Storrito — "How Does Instagram Handle Automation in 2026" | 4 | Instagram's 2026 formal shift: approved API automation allowed, unauthorized bot behavior penalized. |
| 2026-03-03 | DigitalOcean — "How to Connect Google to OpenClaw" | 3 | Tutorial covering Gmail, Calendar, Drive integration with OpenClaw using OAuth. |
| 2026-03-03 | Lumadock — "How to integrate OpenClaw with Google Calendar" | 4 | Calendar integration reuses Gmail OAuth. Enable Calendar API in same GCP project. |
| 2026-03-03 | YouTube (Z0tfD0wJt5M) — OpenClaw + Google Workspace Integration Tutorial | 4 | Full video walkthrough of Gmail and Google ecosystem integration. |
| 2026-03-03 | getopenclaw.ai — Google Workspace Integration page | 4 | Lists full Google Workspace support: Gmail, Calendar, Drive, Docs, Sheets, Contacts. |
| 2026-03-03 | IntuitionLabs — "Claude Pricing Explained" | 2 | Sonnet 4.6: $3/$15 per MTok. Haiku 4.5: $1/$5 per MTok. |
| 2026-03-03 | TLDL — "Claude API Pricing 2026" | 2 | Opus 4.6: $5/$25 per MTok. Sonnet 4.6: $3/$15. Haiku: $0.25/$1.25. |
| 2026-03-03 | Finout — "Claude Pricing in 2026" | 4 | Low-cost content generation example: Haiku 4.5 at 20M tokens = $70/month. |
| 2026-03-03 | CostGoat — "Claude API Pricing Calculator (Mar 2026)" | 4 | Light use estimate: $10-50/month for <1K requests/day. |
| 2026-03-03 | Lumadock — "How to upgrade OpenClaw safely" | 4 | Step-by-step upgrade guide with backups, post-upgrade testing, version rollback. |
| 2026-03-03 | Lumadock — "OpenClaw backup guide for data, settings, and memory" | 4 | What to back up, how to encrypt, how to restore on new machine. |
| 2026-03-03 | Hostinger — "OpenClaw best practices for safe and reliable usage" | 4 | Start with low-risk read-only automations. Keep private by default. |

## Access Methods Research — Context7 (Tier 1)

| Date | Source | Key Finding |
|------|--------|-------------|
| 2026-03-03 | Apple Support — Screen Sharing documentation | Screen Sharing built into macOS via System Settings > Sharing. One toggle to enable. Mac appears in Finder sidebar on same network. |
| 2026-03-03 | Apple Support — High Performance Screen Sharing documentation | Apple Silicon + macOS Sonoma 14+: up to 60fps, 1-2 virtual displays up to 4K, audio routing, HDR support. Near-native latency. |
| 2026-03-03 | Apple Support — Remote Login (SSH) documentation | SSH built into macOS via System Settings > Sharing > Remote Login. Command-line access to headless machines. |
| 2026-03-03 | Apple Support — Universal Control documentation | Shares keyboard/mouse across Macs, but each device MUST have its own display. Not suitable for headless use. |
| 2026-03-03 | Apple Support — Apple Remote Desktop documentation | Apple Remote Desktop ($80) for managing multiple Macs. Overkill for single-machine management — Screen Sharing sufficient. |
| 2026-03-03 | Apple Support — Setup Assistant documentation | First-boot setup requires physical display, keyboard, and mouse. Cannot be completed remotely. |
| 2026-03-03 | Apple Support — FileVault documentation | Full-disk encryption. Pre-boot unlock screen requires physical keyboard — cannot be accessed remotely. |
| 2026-03-03 | Apple Mac Mini M4 — Technical Specifications page | Front 2x USB-C = USB 3 only (no DisplayPort Alt Mode). Rear 3x Thunderbolt 4 + 1x HDMI support display output. |
| 2026-03-03 | Apple macOS Continuity — overview page | Universal Clipboard, AirDrop, iCloud Drive, Find My, Handoff. Requires same Apple ID, Wi-Fi, Bluetooth. |
| 2026-03-03 | Apple Support — Continuity system requirements | Both M1 and M4 qualify. Same Apple ID + Wi-Fi + Bluetooth + Handoff enabled. Stable since Yosemite (2014). |

## Access Methods Research — Bright Data (Tier 2-5)

| Date | Source | Tier | Key Finding |
|------|--------|------|-------------|
| 2026-03-03 | 9to5Mac — Screen Sharing / High Performance Screen Sharing tutorial | 2 | Independent verification of High Performance mode: 60fps, low latency, virtual display support on Apple Silicon. |
| 2026-03-03 | MacRumors — Universal Control Guide | 2 | Confirms each device needs its own display for Universal Control. Screenshots show physical display arrangement requirement. |
| 2026-03-03 | NotebookCheck — NexDock 6 Review | 2 | 14" 1920x1200 IPS, 400 nits, 100% sRGB, 38Wh battery (~6-7hrs), rebuilt trackpad. Single USB-C cable for video + input. $229. |
| 2026-03-03 | NexDock official site (nexdock.com) | 2 | Product specifications, USB-C DisplayPort Alt Mode compatibility, Mac Mini support confirmed. |
| 2026-03-03 | AppleInsider — M4 Mac Mini headless review | 2 | Confirms Setup Assistant requires physical display. Details headless configuration steps post-setup. |
| 2026-03-03 | MacStadium — Remote Access Guide / blog | 3 | Professional Mac hosting perspective: Screen Sharing for GUI, SSH for CLI, FileVault complicates headless reboot. |
| 2026-03-03 | iMore — Headless Mac Mini setup guide | 3 | Step-by-step: borrow a TV via HDMI for 10-minute setup, then enable Screen Sharing + Remote Login for headless operation. |
| 2026-03-03 | machow2 — Remote access guide | 3-4 | Evaluates Apple Remote Desktop ($80) as overkill for single-machine management. Screen Sharing sufficient for personal use. |
| 2026-03-03 | Apple Community forums — Front USB-C port discussions | 3-4 | Community reports confirming front USB-C ports do not output video. Multiple threads with same finding. |
| 2026-03-03 | MPU Talk forums — FileVault + headless operation | 3-4 | Community experience: FileVault pre-boot unlock requires physical keyboard. Workaround: disable FileVault or keep keyboard accessible. |
| 2026-03-03 | AppleVis — VoiceOver accessibility setup guide | 3-4 | Documented but awkward: Mac Mini initial setup via audio prompts + keyboard navigation without visual display. Wired headphones required. |
| 2026-03-03 | Dopesplay / Uperfect — portable monitor alternatives | 3-4 | Alternative portable monitors evaluated. Lack integrated keyboard/trackpad — less convenient than NexDock for headless access. |
