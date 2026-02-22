# Source Tracking

All sources used in research, with credibility tier and date. Consolidated from individual KB file source indexes on 2026-02-11.

## Credibility Tiers

1. Official documentation + verified changelogs
2. Established creators with proven deployments
3. GitHub issues/PRs with reproducible details
4. Reddit/forum posts with technical specificity
5. General community sentiment

---

## Founding Source

| Date | Source | Type | Tier | URL/Reference | Notes |
|------|--------|------|------|---------------|-------|
| 2026-02-10 | Tech With Tim — ClawdBot Setup Guide | YouTube video | 2 | See operator/source-transcript-techwith-tim.md | Trusted creator, professional developer, comprehensive security focus. Founding source for this project. |

---

## Context7 — Official Documentation (Tier 1)

All pulled 2026-02-10 through 2026-02-11.

| Source | URL | Key Finding |
|--------|-----|-------------|
| OpenClaw Official Docs — Security | docs.openclaw.ai/gateway/security | Full security documentation, DM scope isolation, disk trust boundary |
| OpenClaw Official Docs — Sandboxing | docs.openclaw.ai/gateway/sandboxing | Sandbox configuration, sandbox vs tool policy vs elevated |
| OpenClaw Official Docs — Configuration | docs.openclaw.ai/gateway/configuration | Webhook hooks, model config, multi-agent setup, skills config schema |
| OpenClaw Official Docs — Multi-Agent | docs.openclaw.ai/concepts/multi-agent | Deterministic routing precedence, binding system |
| OpenClaw Official Docs — Session | docs.openclaw.ai/concepts/session | Session scoping, identity links, reset policies |
| OpenClaw Official Docs — Memory | docs.openclaw.ai/concepts/memory | Local embeddings option, session memory search |
| OpenClaw Official Docs — Sub-Agents | docs.openclaw.ai/tools/subagents | Sub-agent lifecycle, concurrency, context limits |
| OpenClaw Official Docs — Cron Jobs | docs.openclaw.ai/automation/cron-jobs | Cron scheduler architecture, persistence |
| OpenClaw Official Docs — Cron vs Heartbeat | docs.openclaw.ai/automation/cron-vs-heartbeat | Isolated vs main cron execution |
| OpenClaw Official Docs — FAQ | docs.openclaw.ai/help/faq | Data residency — local vs cloud |
| OpenClaw Official Docs — Local Models | docs.openclaw.ai/gateway/local-models | Hybrid model configuration |
| OpenClaw Official Docs — Multi-Agent Sandbox | docs.openclaw.ai/multi-agent-sandbox-tools | Configuration precedence hierarchy |
| OpenClaw Official Docs — Transcript Hygiene | docs.openclaw.ai/reference/transcript-hygiene | Session history sanitization |
| OpenClaw Official Docs — Sandbox vs Policy vs Elevated | docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated | Three control layers documented |
| OpenClaw Official Docs — Skills | docs.openclaw.ai/tools/skills | Full skill system architecture, format, gating |
| OpenClaw Official Docs — Skills Config | docs.openclaw.ai/tools/skills-config | Configuration reference, env injection |
| OpenClaw Official Docs — Exec Tool | docs.openclaw.ai/tools/exec | Exec tool parameters, authorization model |
| OpenClaw Official Docs — Web Tools | docs.openclaw.ai/tools/web | web_search and web_fetch configuration |
| OpenClaw Official Docs — Lobster | docs.openclaw.ai/tools/lobster | Workflow runtime, approval gates |
| OpenClaw Official Docs — Webhooks | docs.openclaw.ai/automation/webhook | Webhook API, n8n integration point |
| OpenClaw Official Docs — Plugins | docs.openclaw.ai/tools/plugin | Plugin system, extensions architecture |
| OpenClaw Official Docs — Telegram | docs.openclaw.ai/channels/telegram | Telegram channel tools and config |

---

## Security Sources (Phase 1 — Task 10)

Pulled 2026-02-11. 48+ sources. Full details in `knowledge-base/03-security/security-posture-analysis.md`.

| Date | Source | Type | Tier | URL | Key Finding |
|------|--------|------|------|-----|-------------|
| 2026-02-11 | SOCRadar | CVE analysis | 1 | socradar.io/blog/cve-2026-25253-rce-openclaw-auth-token/ | CVE-2026-25253 1-click RCE details |
| 2026-02-11 | NVD — CVE-2026-25253 | CVE record | 1 | nvd.nist.gov/vuln/detail/CVE-2026-25253 | CVE official record, CVSS 8.8 |
| 2026-02-11 | NVD — CVE-2026-24763 | CVE record | 1 | nvd.nist.gov/vuln/detail/CVE-2026-24763 | Command injection CVE |
| 2026-02-11 | CCB Belgium | Government advisory | 1 | ccb.belgium.be/advisories/ | Government advisory on CVE-2026-25253 |
| 2026-02-11 | U of Toronto | Security advisory | 1 | security.utoronto.ca/advisories/openclaw-vulnerability-notification/ | NPM package compromise advisory |
| 2026-02-11 | Semgrep | Security blog | 2 | semgrep.dev/blog/2026/openclaw-security-engineers-cheat-sheet | First-principles security analysis, skills supply chain |
| 2026-02-11 | Kaspersky | Security blog | 2 | kaspersky.com/blog/openclaw-vulnerabilities-exposed/55263/ | Comprehensive vulnerability overview, Shodan exposure |
| 2026-02-11 | The Hacker News | Security news | 2 | thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html | CVE-2026-25253 coverage |
| 2026-02-11 | runZero | Security blog | 2 | runzero.com/blog/openclaw/ | CVE-2026-25253 rapid response |
| 2026-02-11 | Koi Security | Security research | 2 | koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found | 341 malicious skills analysis |
| 2026-02-11 | 1Password | Security blog | 2 | 1password.com/blog/from-magic-to-malware | Skills as attack surface analysis |
| 2026-02-11 | Cisco | Security blog | 2 | blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare | Skill scanner tool |
| 2026-02-11 | Auth0 | Security guide | 2 | auth0.com/blog/five-step-guide-securing-moltbot-ai-agent/ | 5-step security guide, "padded room" sandbox |
| 2026-02-11 | Gravitee | Security report | 2 | gravitee.io/blog/state-of-ai-agent-security-2026-report | 88% of orgs reported AI agent security incidents |
| 2026-02-11 | CyberArk | Security research | 2 | cyberark.com/resources/threat-research/how-autonomous-ai-agents-like-openclaw-are-reshaping-enterprise-identity-security | Shadow AI, identity security |
| 2026-02-11 | Tenable | Vulnerability plugin | 2 | tenable.com/plugins/nessus/297816 | Multiple vulnerabilities plugin |
| 2026-02-11 | Bitdefender | Security advisory | 2 | businessinsights.bitdefender.com/technical-advisory-openclaw-exploitation-enterprise-networks | Enterprise exploitation advisory |
| 2026-02-11 | eSecurity Planet | Security news | 2 | esecurityplanet.com/threats/hundreds-of-malicious-skills-found-in-openclaws-clawhub/ | Malicious skills supply chain attack |
| 2026-02-11 | The Register | Tech news | 2 | theregister.com/2026/01/27/clawdbot_moltbot_security_concerns/ | Rebrand + security concerns |
| 2026-02-11 | Mashable | Tech news | 2 | mashable.com/article/clawdbot-ai-security-risks | Consumer-facing risk advisory |
| 2026-02-11 | SecureMac | macOS security | 2 | securemac.com/news/basic-briefing-the-clawdbot-moltbot-openclaw-fiasco | macOS-specific security assessment |
| 2026-02-11 | Snyk | Vulnerability DB | 2 | security.snyk.io/vuln/SNYK-JS-OPENCLAW-15202445 | Credential exposure vulnerability |
| 2026-02-11 | Microsoft Security Blog | Security research | 2 | microsoft.com/en-us/security/blog/2026/01/23/runtime-risk-realtime-defense-securing-ai-agents/ | Runtime AI agent defense |
| 2026-02-11 | DarkReading | Security news | 2 | darkreading.com/threat-intelligence/2026-agentic-ai-attack-surface-poster-child | Agentic AI as attack surface |
| 2026-02-11 | Cyera | Security research | 2 | cyera.com/research-labs/the-openclaw-security-saga | Adoption outpacing security |
| 2026-02-11 | arXiv | Academic paper | 2 | arxiv.org/abs/2601.10338 | 26% of agent skills contain vulnerabilities |
| 2026-02-11 | CSA | Industry report | 2 | cloudsecurityalliance.org/artifacts/securing-autonomous-ai-agents | Enterprise AI agent security survey |
| 2026-02-11 | knolli.ai | Developer docs | 3 | knolli.ai/post/how-to-run-openclaw-safely | exec-approvals.json docs, macOS app details |
| 2026-02-11 | Eyal Estrin (Medium) | Security guide | 3 | medium.com/@eyal-estrin/clawdbot-security-guide | Security hardening guide |
| 2026-02-11 | AgentFactory | Developer docs | 3 | agentfactory.panaversity.org/docs/.../trust-but-verify | exec-approvals editing guide |
| 2026-02-11 | aimaker Substack | Security guide | 3 | aimaker.substack.com/p/openclaw-security-hardening-guide | 3-tier hardening guide |
| 2026-02-11 | habr.com | Developer guide | 3 | habr.com/en/articles/992720/ | Setup security guide |
| 2026-02-11 | MAESTRO Framework | Threat model | 3 | kenhuangus.substack.com/p/openclaw-threat-model-maestro-framework | 7-layer threat model analysis |
| 2026-02-11 | PurpleBox | Security blog | 3 | prplbx.com/blog/ai-agent-attack-surface | AI agent attack surface analysis |
| 2026-02-11 | Luke Hinds (LinkedIn) | Security disclosure | 3 | linkedin.com/posts/lukehinds | 1.5M keys leaked, nono tool |
| 2026-02-11 | r/ClaudeAI | Reddit | 4 | reddit.com | macOS Keychain concern |
| 2026-02-11 | r/cybersecurity | Reddit | 4 | reddit.com | ClawHub ecosystem infection |
| 2026-02-11 | r/selfhosted | Reddit | 4 | reddit.com | "Stack of vulnerabilities" sentiment |

---

## Competitive Landscape Sources (Phase 1 — Task 9)

Pulled 2026-02-11. 16 sources. Full details in `knowledge-base/01-landscape/competitive-landscape.md`.

| Date | Source | Type | Tier | URL | Key Finding |
|------|--------|------|------|-----|-------------|
| 2026-02-11 | CNBC | News | 2 | https://www.cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html | OpenClaw rise and controversy |
| 2026-02-11 | Galileo.ai | Tech blog | 3 | https://galileo.ai/blog/autogen-vs-crewai-vs-langgraph-vs-openai-agents-framework | Framework comparison |
| 2026-02-11 | Composio | Tech blog | 3 | https://composio.dev/blog/openai-agents-sdk-vs-langgraph-vs-autogen-vs-crewai | SDK comparison |
| 2026-02-11 | Langfuse | Tech blog | 3 | https://langfuse.com/blog/2025-03-19-ai-agent-comparison | Agent frameworks comparison |
| 2026-02-11 | Budibase | Tech blog | 3 | https://budibase.com/blog/ai-agents/open-source-ai-agent-platforms/ | 8 open-source agent platforms |
| 2026-02-11 | HumAI | Tech blog | 3 | https://www.humai.blog/ai-agents-that-actually-work-in-2026-i-tested-30-tools-so-you-dont-have-to/ | 30+ agents tested |
| 2026-02-11 | TowardsAI | Tech blog | 3 | https://pub.towardsai.net/the-4-best-open-source-multi-agent-ai-frameworks-2026-9da389f9407a | 4 best multi-agent frameworks |
| 2026-02-11 | C# Corner | Tech blog | 4 | https://www.c-sharpcorner.com/article/openclaw-vs-n8n-explained-autonomous-ai-agents-vs-workflow-automation-platforms/ | OpenClaw vs n8n explained |
| 2026-02-11 | Contabo | VPS provider blog | 4 | https://contabo.com/blog/what-is-openclaw-self-hosted-ai-agent-guide/ | Self-hosted guide |
| 2026-02-11 | Emergent.sh | Tech blog | 4 | https://emergent.sh/learn/best-openclaw-alternatives-and-competitors | 6 OpenClaw competitors |
| 2026-02-11 | SourceForge | Software comparison | 4 | https://sourceforge.net/software/compare/AutoGPT-vs-OpenClaw/ | AutoGPT vs OpenClaw |
| 2026-02-11 | r/AI_Agents | Reddit | 4 | https://www.reddit.com/r/AI_Agents/comments/1qufj7n/top_tools_to_build_ai_agents_in_2026_nocode_and/ | Top tools 2026 |
| 2026-02-11 | r/OpenClawCentral | Reddit | 4 | https://www.reddit.com/r/OpenClawCentral/comments/1qu9umj/openclaw_vs_similar_tools_is_it_right_for_you/ | OpenClaw vs similar tools |
| 2026-02-11 | r/LocalLLaMA — C/ua | Reddit | 4 | https://www.reddit.com/r/LocalLLaMA/comments/1kenw3u/run_ai_agents_with_nearnative_speed_on/ | C/ua Apple Silicon agents |
| 2026-02-11 | Medium — GitHub stars | Blog | 4 | https://techwithibrahim.medium.com/top-10-most-starred-ai-agent-frameworks-on-github-2026-df6e760a950b | Top 10 starred frameworks |
| 2026-02-11 | Nuvi.dev | Tech blog | 4 | https://nuvi.dev/blog/ai-agent-framework-comparison-langgraph-crewai-openai-swarm | Framework comparison |

---

## Mac Mini Deployment Sources (Phase 1 — Task 8)

Pulled 2026-02-11. 42 sources. Full details in `knowledge-base/04-deployment/mac-mini-community-findings.md`.

| Date | Source | Type | Tier | URL | Key Finding |
|------|--------|------|------|-----|-------------|
| 2026-02-11 | Wccftech | Tech news | 2 | https://wccftech.com/m4-mac-mini-shortage-due-to-installing-ai-agent/ | Mac Mini shortage from AI agent demand |
| 2026-02-11 | AWS Builder Center | Blog | 2 | https://builder.aws.com/content/399VbZq9tzAYguWfAHMtHBD6x8H/ | "The AI Project That Made Developers Rush to Buy Mac Minis" |
| 2026-02-11 | Cloudflare Blog | Blog | 2 | https://blog.cloudflare.com/moltworker-self-hosted-ai-agent/ | Flood of Mac Mini AI agent purchases |
| 2026-02-11 | Scaleway | Cloud provider blog | 2 | https://www.scaleway.com/en/blog/scaleway-and-openclaw-with-mac-mini/ | M4 Neural Engine 38 TOPS for local inference |
| 2026-02-11 | SitePoint | Tutorial | 2 | https://www.sitepoint.com/how-to-set-up-openclaw-on-a-mac-mini/ | OpenClaw Mac Mini setup guide |
| 2026-02-11 | Tailscale Blog | Official blog | 2 | https://tailscale.com/blog/self-host-a-local-ai-stack | Self-host local AI stack with Tailscale |
| 2026-02-11 | OpenClaw GitHub Discussions #7700 | GitHub | 2 | https://github.com/openclaw/openclaw/discussions/7700 | macOS sleep/wake + headless issues |
| 2026-02-11 | Apple Support | Official docs | 2 | https://support.apple.com/en-gb/103253 | M4 Mac Mini specifications |
| 2026-02-11 | PCMag | Review | 2 | https://www.pcmag.com/articles/apples-m4-silicon-tested-and-compared-in-all-the-new-macs | M4 silicon tested |
| 2026-02-11 | BitLaunch | Tutorial | 3 | https://bitlaunch.io/blog/install-configure-openclaw/ | OpenClaw install on macOS/Linux/Windows |
| 2026-02-11 | r/clawdbot | Reddit | 3 | https://www.reddit.com/r/clawdbot/comments/1qwumqu/before_you_buy_a_mac_mini_for_openclaw_read_this/ | "Before you buy" critical analysis |
| 2026-02-11 | r/macmini — always on | Reddit | 3 | https://www.reddit.com/r/macmini/comments/1pbyshz/is_it_okay_to_keep_my_new_mac_mini_m4_powered_on/ | M4 Pro running 1 year at 100% CPU |
| 2026-02-11 | r/macmini — dedicated host | Reddit | 3 | https://www.reddit.com/r/macmini/comments/1qzxvcz/using_my_mac_mini_as_a_dedicated_ai_agent_host/ | "Sips power, runs 24/7" |
| 2026-02-11 | r/macmini — 24x7 safety | Reddit | 3 | https://www.reddit.com/r/macmini/comments/1iklcjw/is_it_safe_to_keep_my_mac_mini_turned_on_24x7/ | "Never turn off my minis" |
| 2026-02-11 | r/homelab — power efficiency | Reddit | 3 | https://www.reddit.com/r/homelab/comments/1n7p3hk/the_mac_mini_m4_power_efficiency_is_insane/ | Power efficiency data |
| 2026-02-11 | r/LocalLLaMA — M4 for local LLMs | Reddit | 3 | https://www.reddit.com/r/LocalLLaMA/comments/1nliifv/how_good_are_macs_m4_products_for_local_llms_and/ | M4 Mac + MoE models |
| 2026-02-11 | r/LocalLLM — self-hosted stack | Reddit | 3 | https://www.reddit.com/r/LocalLLM/comments/1q7ffq5/looking_for_advice_on_a_selfhosted_llm_stack_for/ | Tailscale for Mac Studio to MacBook |
| 2026-02-11 | r/SideProject — one-click deploy | Reddit | 3 | https://www.reddit.com/r/SideProject/comments/1qz0r1m/oneclick_openclaw_deployment/ | One-click deployment tool |
| 2026-02-11 | r/LocalLLaMA — Mac Mini hype | Reddit | 3 | https://www.reddit.com/r/LocalLLaMA/comments/1qnbegl/why_so_much_hype_around_the_mac_mini_for_clawdbot/ | Community hype analysis |
| 2026-02-11 | DEV Community — VM vs Mac Mini | Blog | 3 | https://dev.to/starkprince/vm-vs-mac-mini-for-ai-bots-the-viral-no-fluff-guide-2026-8oj | Linux VM vs Mac Mini comparison |
| 2026-02-11 | DEV Community — Tailscale + VPS | Blog | 3 | https://dev.to/nunc/self-hosting-openclaw-ai-assistant-on-a-vps-with-tailscale-vpn-zero-public-ports-35fn | Zero public ports setup |
| 2026-02-11 | DEV Community — local AI agents | Blog | 3 | https://dev.to/adithyasrivatsa/local-ai-agents-that-run-your-life-offline-the-self-hosted-micro-empire-blueprint-18c2 | Offline AI agent blueprint |
| 2026-02-11 | DEV Community — low power server | Blog | 3 | https://dev.to/yankoaleksandrov/running-a-low-power-ai-server-247-my-setup-under-15w-47m3 | <15W AI server setup |
| 2026-02-11 | Zhimin Zhan (Medium) | Blog | 3 | https://zhiminzhan.medium.com/m4-mac-minis-improvement-over-m1-as-a-server-52a83f5f17fc | M4 vs M1 as server |
| 2026-02-11 | Yogeshwar (Medium) | Blog | 3 | https://yogeshwar9354.medium.com/running-startup-on-mac-mini-build-prod-server-at-home-381f30937ea9 | 15-30W under load, silent |
| 2026-02-11 | Augmented AI (Medium) | Blog | 3 | https://augmentedstartups.medium.com/why-everyones-buying-a-mac-mini-for-clawdbot-a1f3faac05cb | Why everyone's buying Mac Minis |
| 2026-02-11 | hostbor.com | Review | 3 | https://hostbor.com/mac-mini-m4-home-server/ | 4-6W idle power |
| 2026-02-11 | stealthpuppy.com | Blog | 3 | https://stealthpuppy.com/mac-mini-home-server/ | macOS server tweaks |
| 2026-02-11 | chambers.io | Blog | 3 | https://chambers.io/blog/2024/11/09/mac-mini-home-server.html | 2W idle, Mac Mini as server |
| 2026-02-11 | like2byte.com | Benchmarks | 3 | https://like2byte.com/mac-mini-m4-deepseek-r1-ai-benchmarks/ | M4 Pro DeepSeek R1 benchmarks |
| 2026-02-11 | GB Network Solutions | Comparison | 3 | https://www.gbnetwork.my/blog/mac-mini-vs-vps-best-way-to-run-clawdbot/ | Mac Mini vs VPS table |
| 2026-02-11 | tempmailcube.com | Blog | 3 | https://tempmailcube.com/artificial-intelligence/why-a-vps-beats-your-mac-mini-for-running-an-ai-agent-like-openclaw/ | VPS arguments |
| 2026-02-11 | Travis Johnson (LinkedIn) | Social | 3 | https://www.linkedin.com/posts/travcjohnson_i-bought-a-mac-mini-just-to-run-an-ai-agent-activity-7421857283183337474-8nPA | "Bought a Mac Mini just to run an AI agent" |
| 2026-02-11 | Abhishek Ratna (LinkedIn) | Blog | 3 | https://www.linkedin.com/pulse/dont-buy-macmini-use-guide-setup-openclaw-securely-claude-ratna-1xkec | Pro-VPS argument |
| 2026-02-11 | Dmitry Markov (LinkedIn) | Benchmarks | 3 | https://www.linkedin.com/pulse/benchmarking-local-ollama-llms-apple-m4-pro-vs-rtx-3060-dmitry-markov-6vlce | M4 Pro vs RTX 3060 LLM benchmarks |
| 2026-02-11 | Skywork.ai — Tailscale MCP | Blog | 3 | https://skywork.ai/skypage/en/unlocking-secure-ai-agents-tailscale-mcp/1981542140868620288 | Tailscale MCP server for AI agents |
| 2026-02-11 | Apple Stack Exchange | Q&A | 3 | https://apple.stackexchange.com/questions/445257/is-it-bad-to-keep-running-a-mac-mini-for-a-week | Mac Mini always-on safety |
| 2026-02-11 | Facebook — Home Assistant | Forum | 3 | https://www.facebook.com/groups/HomeAssistant/posts/4190249557913049/ | 2011 Mac Mini running Proxmox rock-solid |
| 2026-02-11 | apxml.com | Blog | 3 | https://apxml.com/posts/best-local-llm-apple-silicon-mac | Best local LLM for Apple Silicon |
| 2026-02-11 | Naumanahmad (Medium) | Blog | 3 | https://naumanahmad86.medium.com/is-the-mac-mini-m4-cluster-the-ultimate-machine-for-running-large-ai-models-0b6c6a2d9a18 | M4 Mac Mini cluster for AI |
| 2026-02-11 | MacRumors Forums | Forum | 3 | https://forums.macrumors.com/threads/m4-mac-mini-for-home-server-good-choice.2474718/ | M4 for home server |
| 2026-02-11 | AppleInsider Forums | Forum | 3 | https://forums.appleinsider.com/discussion/238120/a-smaller-mac-mini-brings-big-problems-for-server-farms-and-accessory-makers | Mac Mini server farm implications |

---

## Community Intelligence Sources (Phase 1 — Task 7)

Pulled 2026-02-10. 41 sources. Full details in `knowledge-base/06-community-intelligence/openclaw-community-findings.md`.

Sources are referenced inline throughout the community findings document. Key sources:

| Date | Source | Type | Tier | URL | Key Finding |
|------|--------|------|------|-----|-------------|
| 2026-02-10 | r/LocalLLM (140+ comments) | Reddit | 4 | reddit.com/r/LocalLLM | "Talking to J.A.R.V.I.S." experience; "vibe-coded" codebase |
| 2026-02-10 | r/selfhosted (130+ comments) | Reddit | 4 | reddit.com/r/selfhosted | "Agentic version of Home Assistant" |
| 2026-02-10 | r/AgentsOfAI (80+ comments) | Reddit | 4 | reddit.com/r/AgentsOfAI | "Root-level shell via chat messages" security concern |
| 2026-02-10 | r/ClaudeAI (60+ comments) | Reddit | 4 | reddit.com/r/ClaudeAI | macOS Keychain access dialogs |
| 2026-02-10 | nxcode.io | Tech blog | 2 | nxcode.io | Branding confusion: Clawdbot → Moltbot → OpenClaw |
| 2026-02-10 | lumadock.com | Security blog | 2 | lumadock.com | Prompt injection via content agent reads |
| 2026-02-10 | Auth0 | Security guide | 2 | auth0.com | "Enable the sandbox (padded room)" |
| 2026-02-10 | hostinger.com | Tutorial | 3 | hostinger.com | Gateway exposed without auth by default |

---

## Architecture Deep-Dive Sources (Phase 2 — Task 13)

Pulled 2026-02-11. 16 sources. Full details in `knowledge-base/02-architecture/deep-dive-findings.md`.

| Date | Source | Type | Tier | Key Finding |
|------|--------|------|------|-------------|
| 2026-02-11 | eastondev.com — architecture guide | Source code analysis | 3 | Three-layer architecture, Provider plugin system, message flow |
| 2026-02-11 | eastondev.com — config guide | Source code analysis | 3 | Configuration priority, 5-module breakdown, security checklist |
| 2026-02-11 | Context7 (12 targeted doc queries) | Official docs | 1 | See individual entries above |

---

## Skills & Integrations Sources (Phase 2 — Task 14)

Pulled 2026-02-11. 16+ sources. Full details in `knowledge-base/05-skills-and-integrations/skill-system-reference.md`.

| Date | Source | Type | Tier | URL | Key Finding |
|------|--------|------|------|-----|-------------|
| 2026-02-11 | Awesome OpenClaw Skills | GitHub repo | 2 | github.com/VoltAgent/awesome-openclaw-skills | 700+ curated skills, 27 categories |
| 2026-02-11 | yu-wenhao.com | Developer blog | 3 | yu-wenhao.com/blog/openclaw-tools-skills-tutorial | Tools vs skills tutorial |

---

## Staleness Sweep Sources (2026-02-22)

Added during pre-deployment staleness sweep. 15 new sources across security, governance, and ecosystem.

| Date | Source | Type | Tier | URL | Key Finding |
|------|--------|------|------|-----|-------------|
| 2026-02-22 | GitHub Releases — v2026.2.19 | Official | 1 | https://github.com/openclaw/openclaw/releases/tag/v2026.2.19 | Latest release: LaunchAgent TMPDIR fix, skills hardening, ACP session rate limiting, Apple Watch companion |
| 2026-02-22 | TechCrunch — Steinberger joins OpenAI | Tech news | 1 | https://techcrunch.com/2026/02/15/openclaw-creator-peter-steinberger-joins-openai/ | Creator joined OpenAI, Foundation transition announced |
| 2026-02-22 | Fortune — Who is Peter Steinberger | Tech news | 1 | https://fortune.com/2026/02/19/openclaw-who-is-peter-steinberger-openai-sam-altman-anthropic-moltbook/ | Turned down Meta, 2M visitors/week peak |
| 2026-02-22 | steipete.me — OpenClaw, OpenAI and the future | Creator blog | 1 | https://steipete.me/posts/2026/openclaw | Steinberger's own statement on joining OpenAI |
| 2026-02-22 | Microsoft Security Blog | Enterprise security | 2 | https://www.microsoft.com/en-us/security/blog/2026/02/19/running-openclaw-safely-identity-isolation-runtime-risk/ | "Use only in isolated environments"; 42K+ exposed instances |
| 2026-02-22 | eSecurity Planet — Malicious ClawHub Skills | Security news | 2 | https://www.esecurityplanet.com/threats/hundreds-of-malicious-skills-found-in-openclaws-clawhub/ | Updated malicious skill counts and ClawHavoc campaign details |
| 2026-02-22 | CyberSecurityNews — ClawHavoc | Security news | 2 | https://cybersecuritynews.com/clawhavoc-poisoned-openclaws-clawhub/ | 1,184 malicious skills historically published |
| 2026-02-22 | GBHackers — ClawHavoc | Security news | 2 | https://gbhackers.com/clawhavoc-infects-openclaws-clawhub/ | Reverse shells, credential exfiltration, AMOS payloads |
| 2026-02-22 | 1Password Blog — Skills as attack surface | Security blog | 2 | https://1password.com/blog/from-magic-to-malware-how-openclaws-agent-skills-become-an-attack-surface | Agentic AI supply chain analysis |
| 2026-02-22 | The Hacker News — 341 Malicious Skills | Security news | 2 | https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html | Initial Koi Security audit details |
| 2026-02-22 | SecurityWeek — SecureClaw | Security news | 2 | (via web search) | SecureClaw by Adversa AI: OWASP-aligned security tool, 55 audit checks |
| 2026-02-22 | Trending Topics EU — Steinberger joins OpenAI | Tech news | 2 | https://www.trendingtopics.eu/openclaw-developer-peter-steinberger-joins-openai-his-ai-agent-will-stay-open-source/ | OpenAI funding for Foundation |
| 2026-02-22 | PointGuard AI — Supply Chain Attack | Security analysis | 2 | https://www.pointguardai.com/ai-security-incidents/openclaw-clawhub-malicious-skills-supply-chain-attack | Structured incident analysis |
| 2026-02-22 | Barrack.ai — OpenClaw Security Nightmare | Security blog | 2 | https://blog.barrack.ai/openclaw-security-vulnerabilities-2026/ | "Security nightmare" framing with safe deployment guide |
| 2026-02-22 | Conscia — OpenClaw Security Crisis | Security blog | 2 | https://conscia.com/blog/the-openclaw-security-crisis/ | Enterprise security perspective |

---

## Summary Statistics

| Category | Source Count | Primary Tiers |
|----------|-------------|---------------|
| Context7 — Official Docs | 22 entries | Tier 1 |
| Security Sources | 38 entries | Tiers 1-4 |
| Competitive Landscape | 16 entries | Tiers 2-4 |
| Mac Mini Deployment | 42 entries | Tiers 2-3 |
| Community Intelligence | 41 entries (inline refs) | Tiers 2-5 |
| Architecture Deep-Dive | 16 entries | Tiers 1-3 |
| Skills & Integrations | 16+ entries | Tiers 1-3 |
| Staleness Sweep (2026-02-22) | 15 entries | Tiers 1-2 |
| **Total unique sources** | **~145+** | |

**Note:** Some sources appear in multiple categories (e.g., Koi Security in both security and skills). The individual KB files contain the most detailed source attribution. This file is the consolidated index.
