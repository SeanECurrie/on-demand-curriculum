# Social Media Skills — OpenClaw for Jeff

**Date:** 2026-03-03
**Sources:** 28 (14 Context7/Tier 1, 14 Bright Data/Tier 2-4)
**Key Finding:** OpenClaw has no native Instagram skill. The viable path to Instagram posting runs through third-party APIs (Genviral, Postproxy, or direct Graph API) — but every path requires an Instagram Professional account linked to a Facebook Page, and the simpler automation alternatives (Zapier + Claude API, n8n workflows) are more reliable and easier for a non-technical user than an OpenClaw-based stack.

---

## Available OpenClaw Skills for Social Media

### What Exists in the Official Skill Set

OpenClaw's official skill set includes **xurl** — a skill for X (formerly Twitter) that supports posting text, media uploads, replies, and quote posts. Source: Context7 `/openclaw/openclaw`, `skills/xurl/SKILL.md`, Tier 1.

OpenClaw also has a **messaging system** that covers Discord, Slack, Telegram, WhatsApp, Signal, iMessage, and MS Teams — but **not Instagram**. The messaging system supports text, media, polls, reactions, threads, and channel management. Source: Context7 `/openclaw/openclaw`, `docs/tools/index.md`, Tier 1.

**There is no official OpenClaw skill for Instagram.** No Instagram-specific skill appears in the official docs or the built-in tools index.

### Third-Party / Community Skills for Social Media

**Genviral** released a dedicated OpenClaw skill (late February 2026) that automates posting across six platforms: TikTok, Instagram, YouTube, Facebook, Pinterest, and LinkedIn. The Partner API exposes 42 commands including `image_pack.create`, `DIRECT_POST`, `scheduled_at`, and `analytics.fetch`. Internal tests reported 25,000 views on a TikTok slideshow created without human intervention. Source: Newsfilecorp press release, AI CERTs article, Tier 2-4.

**Post Bridge** (post-bridge.com) offers an OpenClaw integration that "lets your AI agent plan, write, and actually post content to Instagram, TikTok." Source: Bright Data search results, Tier 4.

**Lumadock** published a tutorial on automating social media with OpenClaw for cross-platform scheduling and approvals. Source: Bright Data search results, Tier 4.

**VoltAgent/awesome-openclaw-skills** catalogs 5,400+ skills filtered from the ClawHub registry, indicating the ecosystem is large but unvetted. Source: GitHub, Tier 3.

### Security Audit Status of Community Skills

**This is where the picture gets dangerous.**

- **Snyk ToxicSkills report (Feb 5, 2026):** Scanned 3,984 ClawHub skills. 13.4% (534 skills) contain at least one CRITICAL-level security issue. 36.82% (1,467 skills) have at least one security flaw of any severity. 76 confirmed malicious payloads found, including credential theft, backdoor installation, and data exfiltration. 8 malicious skills were still live on ClawHub at publication. Source: Snyk blog, Tier 2.

- **Key finding from Snyk:** "91% of malicious skills combine prompt injection with traditional malware." Skills inherit the agent's full permissions — shell access, filesystem read/write, credential access, and the ability to send messages on the user's behalf.

- **Previously documented (Output #1 security research):** ~20% of community marketplace skills are malicious. Atomic Stealer malware distributed via ClawHub skill. Source: Trend Micro, The Hacker News, Tier 2.

- **ClawHub publishing barrier is negligible:** A `SKILL.md` file and a one-week-old GitHub account. No code signing, no security review, no sandbox by default. Source: Snyk ToxicSkills report, Tier 2.

**Assessment for Jeff:** The Genviral skill is from a commercial entity with a public API and press coverage, which places it in a different risk category than anonymous ClawHub skills. However, installing ANY community skill grants it the agent's full permissions. For Jeff — running OpenClaw on the same MacBook Air as his client data, email, and banking — the risk surface is significant. The Genviral skill would need careful vetting before installation. The anonymous community skills are off-limits entirely.

---

## Instagram API Capabilities and Limitations

### What the Instagram Content Publishing API Can Do

The Instagram Graph API supports programmatic publishing of:
- Single image posts (JPEG only — no PNG, WebP, or GIF)
- Video posts / Reels (MP4, H.264, 3-60 seconds for feed, up to 15 minutes for Reels)
- Carousel posts (2-10 items, images or videos)
- Stories (image or video, expire after 24 hours)

Rate limit: 100 API-published posts per 24-hour rolling period per account. Carousels count as one post. Source: Meta for Developers, `developers.facebook.com/docs/instagram-platform/content-publishing/`, Tier 1.

### Hard Prerequisites (Non-Negotiable)

Every single path to Instagram API posting requires ALL of these:

1. **A Facebook account** — Instagram API access flows through Meta's authentication
2. **A Facebook Page** — The Instagram account must be linked to a Facebook Page
3. **An Instagram Professional account** — Must be Business or Creator type. Personal accounts are excluded entirely from the publishing API
4. **Page linking** — The Professional account must be connected to the Facebook Page in Instagram settings
5. **Page Publishing Authorization (PPA)** — The connected Facebook Page must have PPA completed

If any of these are missing, API publishing will fail. Source: Meta for Developers, Tier 1; PostProxy blog analysis, Tier 4.

**Jeff's current status:** He has no personal Instagram presence. His partner's account exists but Jeff "couldn't be tagged" — suggesting he has no Instagram account at all. He would need to:
- Create an Instagram account (@jeffanswers)
- Convert it to a Professional (Business) account
- Create a Facebook Page for his real estate business
- Link the Instagram Professional account to the Facebook Page
- Complete Page Publishing Authorization

This is a prerequisite chain that must be completed manually before any automation is possible.

### Additional Requirements for Third-Party App Publishing

If a third-party app (like an OpenClaw skill or n8n workflow) publishes on Jeff's behalf:

- **App review by Meta** is mandatory for production use — each permission requires a separate screencast submission showing the user journey
- **Review takes 2-4 weeks** per submission, with possible rejections
- Required permissions: `instagram_business_basic` + `instagram_business_content_publish` (Instagram Login path) or `instagram_basic` + `instagram_content_publish` + `pages_read_engagement` (Facebook Login path)
- **Advanced Access** required for publishing on behalf of accounts you don't own

Source: Meta for Developers, Tier 1; PostProxy analysis, Tier 4.

**Workaround:** Services like Zapier, Postproxy, and Genviral maintain their own Meta-approved apps, so Jeff wouldn't need to go through app review himself. He would authenticate through their OAuth flow instead.

### Format Restrictions

- Images: JPEG only. PNG, WebP, GIF all rejected
- Aspect ratio: 4:5 (portrait) to 1.91:1 (landscape). Outside this range = container creation failure
- Captions: 2,200 characters max. First 125 characters show without truncation
- Hashtags: Max 30 per post. Hashtag-heavy captions may have reduced reach
- No markdown, bold, or italic in captions via API

Source: Meta for Developers, Tier 1; PostProxy analysis, Tier 4.

### The Two-Step Publish Flow

Instagram API publishing is always two steps:
1. **Create a media container** — POST to `/{ig-user-id}/media` with `image_url` or `video_url` (must be on a publicly accessible server)
2. **Publish the container** — POST to `/{ig-user-id}/media_publish` with the container ID

If the container is not published within 24 hours, it expires. Source: Meta for Developers, Tier 1.

---

## Content Generation Workflow

### What Jeff's Actual Daily Workflow Would Look Like

**Option A: OpenClaw + Genviral Skill (most complex)**

1. Jeff tells OpenClaw (via chat) what he wants to post about — e.g., "Write an Instagram post about the Denver housing market this week"
2. OpenClaw's LLM generates caption text and suggests image concepts
3. OpenClaw calls the Genviral skill to generate or upload an image
4. Genviral creates a media container via Instagram API
5. Jeff reviews the draft in his chat interface
6. Jeff approves; Genviral publishes

**Unknowns:** How polished is the Genviral skill? Does it handle Jeff's OAuth tokens securely? What happens when the Instagram token expires (every 60 days)?

**Option B: Zapier + Claude API (simplest for Jeff)**

1. Jeff adds a content idea to a Google Sheet (or a Zapier form)
2. Zapier triggers: sends the idea to Claude API for caption generation
3. Claude generates caption + hashtags
4. Jeff manually provides or approves an image (or Zapier generates one via AI)
5. Zapier publishes to Instagram for Business via its pre-approved Meta integration
6. Sheet is updated with "posted" status

Zapier's Instagram for Business integration already supports: Publish Photo(s) (single or carousel), Publish Video (as Reel), and raw API requests. It handles OAuth token management and Meta's two-step publish flow. Source: zapier.com, Tier 2.

**Option C: n8n + Claude API (most flexible, self-hosted)**

A working n8n workflow template already exists: "Automated AI content creation & Instagram publishing from Google Sheets" (n8n.io/workflows/3840). It chains: Schedule Trigger -> Google Sheets -> Google Gemini (concept + prompt + caption) -> Replicate (image generation) -> Facebook Graph API (container create -> wait -> publish) -> Sheet update. Source: n8n.io, Tier 2.

This requires n8n self-hosting (which Jeff would already have if running OpenClaw in Docker) and the same Instagram Professional account + Facebook Page prerequisites. The Claude API could replace Gemini in the chain.

A Reddit user in r/AgentsOfAI reported building "a fully automated social media workflow using n8n combined with AI agents to handle content creation, publishing and basic" engagement. Source: Reddit, Tier 4.

---

## Security Considerations for Social Media Skills

### Community Skill Risks (Critical for Jeff)

1. **Full agent permissions:** Any installed skill inherits shell access, filesystem read/write, credential access, and the ability to send messages on Jeff's behalf. A compromised social media skill could post anything from @jeffanswers. Source: Snyk ToxicSkills, Tier 2.

2. **API token exposure:** Instagram/Facebook access tokens stored in OpenClaw's workspace are accessible to any installed skill. Credentials are stored unencrypted on disk (existing finding from security research). A malicious skill could exfiltrate Jeff's Instagram token and use it to post from his account remotely. Source: Output #1 security research + Snyk, Tier 1-2.

3. **Brand risk from AI-generated content:** A compromised agent posting inappropriate content from a top-2-ranked Denver real estate agent's account is a career-level reputational risk. This was already flagged in the intelligence log. Source: Security analysis, N/A.

4. **Token refresh vulnerability:** Instagram tokens expire every 60 days. Whatever automation Jeff uses must handle token refresh. If the refresh flow is exposed to a compromised skill, the attacker gets persistent access. Source: Meta for Developers, Tier 1.

### Mitigation Requirements

- **Human-in-the-loop posting is mandatory.** Jeff should never have fully autonomous Instagram posting. Every post should require his explicit approval before publishing. This is both a security decision and a brand protection decision.
- **Separate API credentials:** If using a third-party service (Zapier, Genviral), the OAuth flow should be managed by that service, not stored locally where skills can access it.
- **Zero ClawHub community skills for social media.** Only commercial services with public APIs, press coverage, and accountability.
- **Monitor posting activity:** Jeff should have Instagram notifications enabled for all posts from @jeffanswers to catch unauthorized publishing immediately.

---

## Agent vs. Automation Honesty

**DNA Principle #10 requires this assessment: Could a deterministic script do this better?**

### Where OpenClaw Adds Genuine Value

1. **Conversational content ideation.** Jeff can describe what he wants in plain language ("write a post about the Sloans Lake open house this Saturday") and get a draft. An LLM is genuinely useful here. A cron job cannot ideate.

2. **Contextual content adaptation.** An LLM can adjust tone, length, and hashtag strategy based on Jeff's evolving preferences. This is what agents do that scripts cannot.

3. **Multi-step orchestration across tools.** In theory, an agent can chain: research market data -> generate content -> create image prompt -> generate image -> format for Instagram -> present for approval. Each step benefits from LLM reasoning.

### Where OpenClaw Is Unnecessary Complexity

1. **The actual posting.** Publishing to Instagram is a deterministic API call. It does not require intelligence. Zapier, n8n, or a cron job does this more reliably than an agent. The two-step container/publish flow is mechanical.

2. **Scheduling.** Cron/scheduler beats agent for reliability. An agent that "decides" when to post adds unpredictability without value.

3. **Token management.** OAuth token refresh is a mechanical process. Handling it through a service like Zapier (which manages it automatically) is more reliable than hoping an agent skill does it correctly.

4. **Image hosting.** Instagram requires images on a publicly accessible URL. Services like Zapier/n8n handle this as part of their integration. An OpenClaw agent would need additional infrastructure to serve images publicly.

### Honest Recommendation for Jeff

**The best architecture for Jeff separates content generation from content publishing.**

- **Content generation:** Use Claude (via OpenClaw, Claude Pro, or the API) to draft captions, suggest hashtags, and brainstorm content ideas. This is where the LLM adds real value.
- **Content publishing:** Use Zapier or a similar automation platform to handle the mechanical posting workflow. Zapier already has a pre-approved Instagram for Business integration that handles OAuth, token refresh, the two-step publish flow, and carousel support.
- **The bridge:** Jeff reviews and approves in between. This can be as simple as a Google Sheet where Claude drafts go in one column and Jeff marks "approved" in another, triggering Zapier to publish.

**Why not OpenClaw for the full pipeline?**
- Jeff has zero automation experience. Zapier's visual builder is designed for non-technical users. OpenClaw's skill system requires understanding SKILL.md manifests, API authentication, and agent permissions.
- The skill security risk is real. Every ClawHub skill has full agent permissions. Zapier's integrations are vetted and sandboxed.
- Instagram API integration is complex (Professional account, Facebook Page, PPA, app review). Zapier has already navigated this. An OpenClaw skill would need to either replicate this work or rely on a third-party like Genviral — adding another dependency and another trust relationship.
- Zapier + Claude API costs ~$20-50/month. An OpenClaw + Genviral setup has more moving parts and more failure modes for no additional capability in the posting step.

**OpenClaw's role in Jeff's social media workflow:** Content ideation assistant, not end-to-end publishing pipeline. The agent helps Jeff think; deterministic automation handles the doing.

---

## What Real Estate Agents Are Actually Doing

### Community Intelligence

- **Content volume is the expectation.** "Top agents in 2026 produce 5x more content in half the time" using tools like Canva and AI content generators. The bar has moved from "post occasionally" to "post consistently with quality." Source: Instagram @howsoutsold, Tier 4-5.

- **AI tools gaining traction in real estate.** A guide on setting up "an AI Agent for Real Estate in 2026" recommends Claude Pro + Telegram bot as the starting stack, not a full self-hosted agent platform. Source: foxessellfaster.com, Tier 4.

- **MindStudio lists 10 AI agents for real estate** (Feb 2026), focused on lead follow-up, listing descriptions, and client communication — not social media posting. Social media is treated as a content creation problem, not an agent problem. Source: mindstudio.ai, Tier 4.

- **The practical stack for most agents:** AI (ChatGPT/Claude) for content writing + scheduling tool (Later, Buffer, Hootsuite) for posting + Canva for visuals. This is the established pattern in 2026. Source: Multiple Instagram posts and articles, Tier 4-5.

- **"If you want Instagram to bring you real clients in 2026, you need to stop posting random content and start building a system."** This community sentiment aligns with Jeff's goal of systematized posting rather than ad hoc effort. Source: Facebook @theamygregory, Tier 5.

### What's NOT Happening

- No evidence of real estate agents using OpenClaw for Instagram automation specifically.
- No evidence of agents using self-hosted AI agent platforms for social media. The community pattern is SaaS tools, not self-hosted infrastructure.
- The search term "real estate agent OpenClaw Instagram" returns zero relevant results.

---

## Realistic Expectations for Jeff

### What Jeff Can Achieve

1. **AI-assisted content creation** — Using Claude (either through OpenClaw or directly) to draft Instagram captions, suggest content themes, and write hashtag strategies. This is achievable within the first week.

2. **Systematized posting workflow** — A Google Sheet content calendar where Jeff (or Claude) adds ideas, Jeff approves, and Zapier publishes. This can be operational within 2-3 weeks (including Instagram Business account setup).

3. **Consistent posting cadence** — With the system above, Jeff could realistically post 3-5 times per week without spending more than 15-20 minutes per day on content.

### What Requires Custom Development

1. **Fully autonomous posting** — Not recommended (brand risk + security risk), and would require significant custom integration work regardless.

2. **AI-generated images** — Possible via Replicate, DALL-E, or Midjourney APIs, but adds complexity. Jeff should start with his own photos (property photos, neighborhood shots, headshots) and add AI-generated visuals later if needed.

3. **Analytics-driven content optimization** — An agent that reads post performance and adjusts strategy. This is genuinely valuable but requires both Instagram Insights API access and significant prompt engineering. Phase 2 goal, not Phase 1.

### Timeline to Value

| Milestone | Timeline | What's Involved |
|-----------|----------|-----------------|
| Instagram Professional account + Facebook Page | Week 1 | Manual setup, 30-60 minutes |
| First AI-drafted post published | Week 1-2 | Claude writes caption, Jeff publishes manually |
| Zapier automation live | Week 2-3 | Connect Zapier to Instagram, set up Claude API step, configure Google Sheet trigger |
| Consistent 3x/week posting | Week 3-4 | Batch content creation sessions with Claude, Zapier handles scheduling |
| OpenClaw as content ideation assistant | Week 4-6 | After Jeff is comfortable with the basic stack, add OpenClaw as the conversational front-end for content brainstorming |

### What Jeff Should NOT Expect

- **Instagram follower growth from automation alone.** Automation handles posting mechanics. Growth comes from content quality, consistency, engagement, and local relevance. The AI helps with quality; Jeff provides the local expertise and authenticity.
- **Zero time investment.** Even with full automation, Jeff needs to review content, provide local context, and engage with comments. Estimate 15-20 minutes/day minimum.
- **Immediate results.** Building @jeffanswers from zero to meaningful following takes months of consistent posting, not weeks. The AI accelerates content creation but does not accelerate audience building.

---

## Sources Summary

### Context7 (Tier 1)
- OpenClaw `skills/xurl/SKILL.md` — X/Twitter posting skill documentation
- OpenClaw `docs/tools/index.md` — Messaging platform integrations (no Instagram)
- OpenClaw `docs/tools/clawhub.md` — ClawHub skills registry
- OpenClaw `docs/tools/skills.md` — Skill installation and management
- Meta for Developers — Instagram Content Publishing API documentation

### Bright Data (Tier 2)
- Snyk ToxicSkills report (Feb 5, 2026) — 3,984 skills scanned, 13.4% critical issues
- Newsfilecorp — Genviral OpenClaw skill press release
- AI CERTs — Genviral + OpenClaw social media automation analysis
- n8n.io — Automated AI content creation & Instagram publishing workflow
- Zapier — Instagram for Business + Anthropic (Claude) integration page

### Bright Data (Tier 3-4)
- PostProxy blog — "Post to Instagram via API in 2026: No Facebook App Review Headaches"
- Reddit r/AgentsOfAI — n8n social media automation workflow
- Reddit r/OpenClawUseCases — Genviral social media skill release
- foxessellfaster.com — "How to Set Up an AI Agent for Real Estate in 2026"
- mindstudio.ai — "10 AI Agents for Real Estate Professionals"
- Elfsight — Instagram Graph API complete developer guide 2026
- Instagram/Facebook community posts on real estate AI content automation
- Genviral API documentation (docs.genviral.io)
- Post Bridge — OpenClaw Instagram integration
- Lumadock — Social media automation with OpenClaw tutorial
- VoltAgent/awesome-openclaw-skills — 5,400+ categorized skills
