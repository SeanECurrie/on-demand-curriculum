# OpenClaw for Jeff — Interactive Walkthrough

**Version:** 1.0
**Date:** 2026-03-03
**For:** Jeff (Denver real estate, Hatch brand, @jeffanswers)
**Produced by:** On-Demand Curriculum Engine, Output #2

---

<!-- SECTION 1: s1-intro -->
## Section 1: What Is OpenClaw (And What Isn't It)

Before you install anything, you need to understand what you're building and what it will actually do for you. This section sets expectations honestly so nothing catches you off guard.

### The One-Sentence Version

OpenClaw is an AI assistant that runs on your own MacBook, can take real actions on your behalf (like drafting Instagram posts), and keeps your data private on your machine.

### What OpenClaw Is

OpenClaw is a **platform** — a foundation you build on, not a finished product you turn on. Think of it like buying a commercial kitchen: the kitchen has the stove, the counters, the sink, but you still need to decide what you're cooking, buy the ingredients, and learn the recipes.

Here's what OpenClaw gives you:

- A way to talk to an AI (Claude) that lives on your own computer, not on someone else's servers
- The ability to connect that AI to real tools — Instagram, email, scheduling, web research
- A dashboard where you can see what your AI is doing and manage it visually
- Privacy: your conversations, drafts, and data stay on your MacBook unless you choose to send them somewhere

Here's what OpenClaw does NOT give you out of the box:

- A ready-to-go Instagram posting system (that requires configuration)
- AI that knows your brand voice (you teach it)
- Auto-pilot social media (you review and approve everything, especially at the start)
- Security (the default settings are wide open — the walkthrough locks them down)

> **Understanding: Why "platform, not solution" matters**
>
> In real estate, you know the difference between buying a brokerage and buying a desk at someone else's brokerage. OpenClaw is like building your own brokerage for AI — you have full control, but you also have full responsibility for the setup. That's the tradeoff for keeping your data on your machine instead of handing it to a cloud service. This walkthrough handles the setup for you. After that, you're in the driver's seat.

### The Four Pieces

OpenClaw has four main parts. Think of them like the parts of a well-run office:

**1. The Gateway (Front Desk)**
Every message you send goes through the Gateway first. It checks who you are, decides which agent should handle your request, and sends the response back. If the Gateway isn't running, nothing works — it's the foundation.

**2. The LLM Connection (The Brain You're Renting)**
The Gateway doesn't think on its own. It sends your messages to Claude (an AI made by Anthropic) over the internet, gets the response back, and delivers it to you. You provide your own API key — like a membership card that lets OpenClaw use Claude on your behalf. You pay per use, and for your workload (social media captions), the cost is modest: roughly $3-10 per month.

**3. Skills (The Hands)**
Skills are add-ons that let OpenClaw actually do things — search the web, read files, create content. Without skills, the agent can only talk. With skills, it can act. The walkthrough installs only safe, locally-built skills. We'll explain why in the Security section.

**4. The Dashboard (Control Panel)**
A web page that runs on your MacBook (not on the internet — only accessible from your computer) where you can see what the agent is doing, review its work, and manage your setup visually instead of typing commands.

*[Diagram 1: The Four Pieces of OpenClaw — shows Gateway, Skills, and Dashboard inside a "Your MacBook Air" boundary, with Claude outside connected by an arrow that crosses the boundary]*

### How It Works When You Use It

Here's what happens when you ask OpenClaw to draft an Instagram post:

1. **You type a message** — through the Dashboard on your MacBook or through a messaging app
2. **The Gateway receives it** — the front desk checks who sent it and whether they're authorized
3. **The Gateway sends it to Claude** — your message, plus your brand voice instructions, goes to Claude's servers over the internet
4. **Claude thinks and responds** — it reads your request, might ask a skill to look up Denver market data, and writes a draft
5. **The draft comes back to you** — through whatever channel you used to send the original message
6. **You review and approve** — nothing gets posted without your say-so

The whole cycle takes a few seconds for a caption draft.

### The Split Architecture: Two Tools, Not One

Here's something important to understand upfront: **OpenClaw has no built-in Instagram posting ability.** It can create content beautifully — captions, hashtags, brand-voice-consistent drafts — but it cannot publish directly to Instagram.

That's actually a good thing, and here's why.

The workflow uses two tools:
- **OpenClaw + Claude** handles the thinking — drafting captions, suggesting hashtags, maintaining your brand voice
- **Zapier** handles the posting — the mechanical act of publishing to Instagram on a schedule

This split follows a principle that applies well beyond this project: **use AI for tasks that need intelligence, use automation for tasks that are mechanical.** Writing a caption requires creativity. Posting it to Instagram at the right time is just pushing a button — a simple automation tool does that more reliably than an AI agent.

*[Diagram 5 reference: Split Architecture — Content Creation to Instagram]*

> **Understanding: Agent vs. automation honesty**
>
> Could a simple script post to Instagram without any AI? Absolutely. The posting part is mechanical — it's the same steps every time. That's why Zapier handles it. What a script can't do is write a compelling caption about the Sloans Lake market that sounds like you and uses the right hashtags. That's where Claude earns its keep. The best systems use intelligence where it adds value and automation where it doesn't. This principle applies to any tool you'll ever evaluate — ask "could a simpler tool do this part?"

### What This Will Cost

Let's be direct about money:

| Item | Monthly Cost | What It Is |
|------|-------------|-----------|
| Claude Pro subscription | $20/mo | Web access to Claude for your own use (separate from OpenClaw) |
| Claude API | $3-10/mo | What OpenClaw uses to talk to Claude. Pay-per-use, based on how much content you generate |
| Zapier | $0-20/mo | Instagram publishing automation. Free tier may be enough for 3-5 posts/week |
| **Total** | **$23-50/mo** | |

The Claude Pro subscription and Claude API are separate things. The subscription gives you direct web access to Claude (useful for ad hoc work). The API is the connection OpenClaw uses. You need both.

> **Understanding: What an API key is**
>
> An API key is like a combination of a password and a credit card number. Anyone who has it can use Claude and charge it to your account. You'll create one during setup, and this walkthrough stores it securely. Never share your API key in messages, emails, or screenshots. If you think it's been compromised, change it immediately on the Anthropic website. You can also set a monthly spending cap so even if someone gets your key, the damage is limited. This principle applies to every service that uses API keys — treat them like you treat your banking password.

### What You Should Expect

**The first week:** You'll set up the infrastructure — install OpenClaw, configure security, set up your Instagram business account. This is the heaviest lift. Expect 2-3 focused sessions, each 1-2 hours.

**Weeks 2-3:** You'll get the content workflow running — teach the AI your brand voice, connect Zapier for posting, create your first AI-drafted posts. Things start feeling useful.

**Weeks 3-4:** You hit a rhythm. You spend ~15 minutes a day reviewing what the AI drafted, approving posts, and giving feedback to improve the voice. The system gets better the more you use it.

**What this will NOT do:**
- Grow your Instagram overnight. Automation handles posting mechanics. Growth comes from content quality, consistency, and local relevance. The AI helps with quality; you provide the Denver expertise.
- Eliminate all your involvement. Even with full automation, you review content and provide local context. The goal is to move from "I have to be on Instagram" to "I review and approve what the AI prepared." That's a real improvement.
- Work without maintenance. You'll need to update OpenClaw weekly (takes 5 minutes), and occasionally adjust your brand voice as you learn what works.

### Self-Test: Section 1

Before moving on, you should be able to answer these:

- [ ] I understand that OpenClaw is a platform I need to configure, not a turn-key solution
- [ ] I know the four pieces: Gateway (front desk), Claude (brain), Skills (hands), Dashboard (control panel)
- [ ] I understand that OpenClaw creates content and Zapier publishes it (split architecture)
- [ ] I know the approximate monthly cost ($23-50/mo)
- [ ] I understand that I'll review and approve all content before it's posted

---

<!-- SECTION 2: s2-machine -->
## Section 2: Why a Dedicated Machine

This section explains why you're setting up a separate MacBook for this, rather than just installing it on whatever computer you already use. The reasoning here applies to any AI agent platform — not just OpenClaw.

### The Problem with Sharing

Your current computer has everything on it: your email, your banking, your client contracts, your browsing history, your saved passwords. If you install an AI agent on that same computer and something goes wrong — a bad skill, a security vulnerability, a misconfiguration — the agent could potentially access all of it.

Think of it like this: you wouldn't let a new hire sit at your desk with your email open, your banking logged in, and your client files spread out. You'd give them their own workspace with only the tools they need.

*[Diagram 2: Shared Machine vs. Dedicated Machine — shows cluttered shared machine on the left, clean separation on the right]*

### Your Situation: The Honest Tradeoff

You're buying a MacBook Air. It's going to run OpenClaw, but it's also going to be a laptop you use. That means it's a **shared machine** — OpenClaw and your personal activities (email, banking, client work) coexist on the same device.

**Is this ideal?** No. A dedicated machine — like a Mac Mini that does nothing but run OpenClaw — would be safer because even if something went wrong with the AI agent, your personal data wouldn't be on the same device.

**Is your setup workable?** Yes, with proper security. The walkthrough configures multiple security layers — a sandbox (locked room) for the agent, authentication (password) on the gateway, localhost binding (only your computer can access it), and encryption on the whole drive. These layers compensate for sharing the machine.

**Should you consider a Mac Mini instead?** If this MacBook Air is going to sit on a desk 95% of the time, a Mac Mini would actually be a better investment. It costs less at the same specs, has a fan for cooling (the Air doesn't), is designed for always-on use, and has no battery to manage. The Air trades all of those server-friendly features for portability. If you need portability, the Air works. If you don't, the Mini is objectively better for this.

> **Understanding: Isolation reduces blast radius (transferable)**
>
> This is a principle that applies far beyond OpenClaw. In real estate, you probably keep your personal and business finances in separate accounts — not because you expect fraud, but because separation limits the damage if something goes wrong. The same logic applies to computers. Every IT professional will tell you: don't run sensitive systems on general-purpose machines if you can avoid it. When you can't avoid it (like your situation), you compensate with layers of protection. This walkthrough builds those layers.

### What Makes the MacBook Air Work

The MacBook Air M4 is more than powerful enough for OpenClaw. The platform's requirements are modest:

| What OpenClaw Needs | What the MacBook Air Has |
|---------------------|--------------------------|
| 1-2 GB RAM | 16 or 24 GB |
| 1 CPU core | 10 CPU cores |
| ~500 MB storage | 256 GB - 1 TB |
| Docker support | Full support via OrbStack |

The real questions aren't about power — they're about running a server on a laptop that wasn't designed to be a server. We'll handle those:
- **Sleep prevention:** Laptops sleep. Servers can't. We'll configure yours to stay awake.
- **Battery management:** Always plugged in with a charge limit to protect battery health.
- **Thermal management:** The Air has no fan. For OpenClaw's workload (mostly idle, occasional bursts), this is fine. A laptop stand helps with heat.

### Self-Test: Section 2

- [ ] I understand why running OpenClaw on a shared machine has tradeoffs
- [ ] I understand that multiple security layers compensate for those tradeoffs
- [ ] I know my MacBook Air is powerful enough for this workload
- [ ] I've considered whether a Mac Mini might be better for my situation

---

<!-- SECTION 3: s3-setup -->
## Section 3: Your Setup — Everything You Need Before Installation

This section covers everything that needs to be in place before you install OpenClaw. Think of it as a pre-flight checklist. Don't skip ahead — if any of these prerequisites are missing, the installation will fail or the system won't work correctly.

### 3.1 Hardware Checklist

- [ ] **MacBook Air M4 in hand** — powered on, logged in, connected to WiFi
- [ ] **24 GB RAM strongly recommended** — if you haven't purchased yet, the $200 upgrade from 16 GB to 24 GB is the single highest-impact hardware decision. With 16 GB, the system will work but will be tight on memory under sustained use. With 24 GB, you'll have comfortable headroom.
- [ ] **512 GB storage minimum** — Docker images and logs accumulate over time. 256 GB will get tight.
- [ ] **Power adapter connected** — this machine will run plugged in nearly all the time

> **Understanding: Why 24 GB matters**
>
> Running OpenClaw means running several layers at once: macOS itself (4-6 GB), the container runtime (0.5-1.5 GB), OpenClaw's gateway and agents (about 450 MB each), and potentially a web browser for automation (another 500 MB - 1.5 GB). On 16 GB, that stack uses 50-85% of your available memory, leaving little room for anything else. On 24 GB, it uses 30-55%, with comfortable breathing room. Think of it like listing square footage: technically a family of four can live in 800 square feet, but 1,200 changes the experience entirely. This principle applies to any Docker-based service on a consumer laptop — the container runtime adds overhead that isn't obvious until you're running it.

### 3.2 macOS Essentials

These are macOS settings you need to verify or enable before anything else.

#### FileVault (Full-Disk Encryption)

- [ ] **Verify FileVault is ON:** Open System Settings > Privacy & Security > scroll down to FileVault

If FileVault shows "ON" — you're good. Move on.

If FileVault shows "OFF" — turn it on now. Click "Turn On FileVault" and follow the prompts.

**Why this matters:** All of OpenClaw's data — your API keys, chat history, agent configurations — is stored as regular files on your hard drive, not encrypted by the app itself. If your MacBook is stolen (from your car, an open house, a coffee shop), FileVault ensures that data is unreadable without your login password. Without it, someone who steals your laptop can read everything by connecting the drive to another computer.

**Expected result:** FileVault shows "On" with a green indicator. Encryption may take a few hours to complete in the background if you just turned it on — that's normal and doesn't prevent you from continuing.

> **Understanding: Why does OpenClaw store credentials unencrypted? (transferable)**
>
> This is actually common in software. Most applications store their configuration and credentials as plain text files on disk. They rely on the operating system's security (your login password, FileVault encryption) to protect those files. This is why full-disk encryption matters on every laptop with sensitive data — not just for OpenClaw, but for anything. If you have client contracts, financial documents, or business plans on your MacBook, FileVault protects all of it.

#### macOS Firewall

- [ ] **Enable the firewall:** Open System Settings > Network > Firewall > turn ON
- [ ] **Enable stealth mode:** Click "Options..." > check "Enable stealth mode"

**Why this matters:** The firewall prevents other devices on your network from finding and connecting to services on your MacBook. Stealth mode means your computer doesn't even respond to network probes — it's invisible on the network.

**Expected result:** Firewall shows "Active" with stealth mode enabled.

### 3.3 Claude Subscription and API Key

You need two things from Anthropic: a Claude Pro subscription and an API key.

#### Claude Pro Subscription ($20/month)

- [ ] Go to [claude.ai](https://claude.ai) and sign up or log in
- [ ] Subscribe to Claude Pro ($20/month)

This gives you web access to Claude for your own use — writing emails, brainstorming, research. It's useful on its own, but it's separate from what OpenClaw uses.

#### Claude API Key (pay-per-use)

- [ ] Go to [console.anthropic.com](https://console.anthropic.com)
- [ ] Create an account (or log in — this is a separate account from claude.ai)
- [ ] Navigate to API Keys
- [ ] Click "Create Key"
- [ ] Name it something recognizable: `openclaw-jeff-macbook`
- [ ] **Copy the key immediately** — you won't be able to see it again after you close this page
- [ ] **Store it temporarily** in a note (you'll enter it into OpenClaw during installation). Do NOT paste it into any chat, email, or social media message.

**Set a spending limit:**
- [ ] In the Anthropic console, go to Settings > Plans & Billing
- [ ] Set a monthly usage limit — $25 is plenty for your use case (expected usage: $3-10/month)

This cap means even if someone got your key, the maximum damage is $25/month — not an open-ended bill.

**Expected result:** You have an API key copied and a $25/month spending limit set.

> **Understanding: Two accounts, two purposes**
>
> Claude Pro (claude.ai) = your personal access to Claude. Think of it like having a subscription to a gym.
> Claude API (console.anthropic.com) = OpenClaw's connection to Claude. Think of it like buying a membership card for your employee to use the same gym.
> They're billed separately. The Pro subscription is flat-rate ($20/month). The API is pay-per-use, and for social media captions, it's inexpensive.

### 3.4 OrbStack Installation

OrbStack is the container runtime — the software that lets OpenClaw run in an isolated environment (container) on your Mac. We're using OrbStack instead of Docker Desktop because it uses significantly less memory, has lower CPU usage, and is specifically optimized for Mac.

- [ ] Go to [orbstack.dev](https://orbstack.dev)
- [ ] Download OrbStack for Mac
- [ ] Open the downloaded file and drag OrbStack to your Applications folder
- [ ] Launch OrbStack from Applications
- [ ] When prompted, grant the system permissions OrbStack requests (it needs these to manage containers)

**Verify OrbStack is running:**
- [ ] Open Terminal (Applications > Utilities > Terminal)
- [ ] Type the following command and press Enter:

```bash
docker --version
```

**Expected output:** Something like:
```
Docker version 27.x.x, build xxxxxxx
```

If you see a version number, OrbStack is working correctly. If you see "command not found," OrbStack isn't fully installed — try quitting and relaunching it.

> **Understanding: What's a container?**
>
> A container is a self-contained package that has everything a program needs to run, isolated from the rest of your computer. Think of it like a furnished apartment inside your house — the tenant (OpenClaw) has everything they need in their unit, and they can't wander into your living room. If something goes wrong inside the apartment, your house is unaffected. That's why we run OpenClaw in a container: it keeps the agent contained. This concept applies to any software that supports containers — it's one of the most important isolation techniques in computing.

### 3.5 Instagram Prerequisites

OpenClaw can create your content, but to publish to Instagram via Zapier, you need specific account types set up. Instagram's publishing API has strict requirements — if any of these are missing, automated posting will not work.

#### Create an Instagram Account

- [ ] If you don't already have one, create an Instagram account. Choose a handle for your professional brand (e.g., @jeffanswers if available)
- [ ] Download the Instagram app on your phone

#### Convert to a Professional Account

- [ ] Open Instagram > your profile > Settings > Account > Switch to Professional Account
- [ ] Choose "Business" (not Creator)
- [ ] Select a category that fits (e.g., "Real Estate Agent")
- [ ] Connect your business contact info

**Why Business, not Creator:** The publishing API that Zapier uses only works with Business or Creator accounts, not personal accounts. Business gives you the analytics features relevant to your real estate work.

#### Create a Facebook Page

- [ ] Go to [facebook.com/pages/create](https://facebook.com/pages/create)
- [ ] Create a Page for your real estate business
- [ ] Fill in the basic information (name, category, description)

**Why you need this:** Instagram's API runs through Facebook's infrastructure. To publish programmatically, your Instagram Business account must be linked to a Facebook Page. This is a Meta requirement, not an OpenClaw one. Every tool that publishes to Instagram — Zapier, Buffer, Hootsuite, anything — requires this.

#### Link Instagram to Facebook Page

- [ ] Open Facebook Page Settings > Linked Accounts > Instagram
- [ ] Connect your Instagram Business account to the Facebook Page
- [ ] Follow the authorization prompts

**Verify the link:**
- [ ] Go to your Instagram Settings > Account > Linked Accounts
- [ ] Confirm your Facebook Page appears

> **Understanding: The Facebook prerequisite chain**
>
> This chain — Facebook account, Facebook Page, Instagram Professional account, linking them — trips up a lot of people. It exists because Meta (the company that owns both Facebook and Instagram) routes all Instagram API access through their Facebook infrastructure. It feels unnecessary, but it's a hard requirement. Once it's set up, you don't need to think about it again. Any service that publishes to Instagram on your behalf has already navigated this same requirement on their end.

#### Complete Page Publishing Authorization

- [ ] On your Facebook Page, go to Settings > Page Transparency
- [ ] Complete any required verification steps Meta presents
- [ ] This may take 24-48 hours to process

**Note:** If Meta asks for additional verification (ID, business documents), this is normal for new pages that want publishing access. It's a one-time process.

### 3.6 Zapier Account

- [ ] Go to [zapier.com](https://zapier.com) and create a free account
- [ ] You don't need to set up any automations yet — we'll do that in Section 7

Zapier's free tier allows 100 tasks per month. If you're posting 3-5 times per week (12-20 posts per month), the free tier should be sufficient to start. If you exceed it, the Starter plan is about $20/month.

### 3.7 Pre-Flight Checklist Summary

Before proceeding to installation, verify everything:

- [ ] MacBook Air powered on, connected to WiFi, plugged into power
- [ ] FileVault is ON
- [ ] macOS Firewall is ON with stealth mode
- [ ] Claude Pro subscription active
- [ ] Claude API key created and copied (with $25/month spending limit)
- [ ] OrbStack installed and `docker --version` returns a version number
- [ ] Instagram Business account created and linked to a Facebook Page
- [ ] Zapier account created

**If anything above is incomplete, stop and finish it before moving to Section 4.** The installation assumes all of these are in place.

### Self-Test: Section 3

- [ ] All pre-flight checklist items are complete
- [ ] I have my Claude API key ready (not shared with anyone)
- [ ] I understand that the Instagram account must be a Business type linked to a Facebook Page
- [ ] OrbStack is installed and working

---

<!-- SECTION 4: s4-install -->
## Section 4: Installation and Deployment

This is where you install OpenClaw on your MacBook Air. Every command is explained — what it does, what you should see, and what to do if something goes wrong. Follow these steps in order. Don't skip ahead.

### 4.1 Open Terminal

- [ ] Open Terminal: press Command + Space, type "Terminal", press Enter

You'll see a window with a blinking cursor and something like:

```
jeff@jeffs-macbook-air ~ %
```

This is the command line. You type commands here and press Enter to run them. If anything in this walkthrough says "run this command," you type it (or copy-paste it) into Terminal and press Enter.

> **Understanding: The command line isn't scary**
>
> The Terminal is just a way to talk to your computer by typing instead of clicking. Every command in this walkthrough is copy-pasteable — you don't need to memorize anything or type from memory. When you paste a command and press Enter, watch the output. If it matches what the walkthrough says to expect, you're on track. If it doesn't, check the troubleshooting notes below each step.

### 4.2 Install OpenClaw

- [ ] Copy and paste this command into Terminal and press Enter:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**What this does:** Downloads the official OpenClaw installer and runs it. The installer:
1. Checks that Docker (OrbStack) is running
2. Downloads the OpenClaw container images
3. Sets up the initial configuration
4. Starts the gateway

**Expected output:** You'll see a progress display as images download. It may take 3-5 minutes depending on your internet speed. At the end, you should see something like:

```
 _____ _                 _____ _
|  _  | |               /  __ \ |
| | | | |__   ___  _ __ | /  \/ | __ ___      __
| | | | '_ \ / _ \| '_ \| |   | |/ _` \ \ /\ / /
\ \_/ / |_) |  __/| | | | \__/\ | (_| |\ V  V /
 \___/|_.__/ \___||_| |_|\____/_|\__,_| \_/\_/

OpenClaw is running!
Dashboard: http://localhost:18789
```

**If you see an error about Docker not running:**
> Close and reopen OrbStack from your Applications folder. Wait 10 seconds, then try the install command again.

**If you see a network error or download failure:**
> Check your internet connection. Try again. If it persists, wait a few minutes — the download server may be temporarily busy.

### 4.3 Set Your Gateway Password

The installer may prompt you to create a password during setup. If it doesn't, or if you want to ensure a strong, random password is set:

- [ ] Run this command to generate a secure gateway token:

```bash
openclaw doctor --generate-gateway-token
```

**Expected output:** A long random string of characters. This is your gateway password. Copy it — you'll need it to log into the Dashboard.

**Security note (inline):** This token is what prevents anyone else from controlling your AI agent. Without it, any code running on your computer — including JavaScript from a website you visit — could talk to your agent. This is not hypothetical: a vulnerability called "ClawJacked" (patched in version 2026.2.25) exploited exactly this scenario. The token is your front door lock.

### 4.4 Verify the Installation

Let's confirm everything is running correctly.

- [ ] Check OpenClaw's version:

```bash
openclaw --version
```

**Expected output:** A version number. It must be **2026.2.25 or higher.**

```
openclaw version 2026.2.x
```

**Why this version matters:** Versions before 2026.2.25 have known security vulnerabilities that can be exploited even from websites you visit normally. If your version is lower, run the installer again:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash --no-onboard
```

- [ ] Check system health:

```bash
openclaw health
```

**Expected output:** All checks show green/passing status. You should see the gateway listed as "running."

- [ ] Open the Dashboard:

Open your web browser (Safari or Chrome) and go to:

```
http://localhost:18789
```

**Expected result:** You see the OpenClaw Dashboard. It will ask for your gateway token — paste the token you generated in step 4.3.

> **Understanding: What "localhost:18789" means**
>
> "Localhost" means "this computer" — not the internet, not your network, just your MacBook. The number 18789 is a "port" — think of it like an apartment number. Your MacBook is the building, and OpenClaw lives in apartment 18789. When you type "localhost:18789" in your browser, you're saying "go to this computer, apartment 18789." Nobody else on your WiFi or the internet can visit this address — it only works from your own machine. This is a key part of your security: the agent's front door only opens from inside your house.

**If the Dashboard doesn't load:**
> Make sure OrbStack is running (check for its icon in the menu bar). Then run:
> ```bash
> openclaw gateway restart
> ```
> Wait 10 seconds and try the browser again.

### 4.5 Connect Your Claude API Key

Now connect OpenClaw to Claude so it can use AI.

- [ ] In the Dashboard, go to Settings (or Configuration)
- [ ] Find the LLM provider section
- [ ] Select "Anthropic" as the provider
- [ ] Paste your Claude API key from Section 3.3
- [ ] Set the model to **Claude Sonnet 4.6** (good balance of quality and cost)

Alternatively, you can set this via the command line:

```bash
openclaw config set llm.provider anthropic
openclaw config set llm.apiKey YOUR-API-KEY-HERE
openclaw config set llm.model claude-sonnet-4-6
```

Replace `YOUR-API-KEY-HERE` with your actual API key. After pasting, it's stored in OpenClaw's configuration on your MacBook.

- [ ] Verify the connection works — send a test message through the Dashboard:

Type something like: "Hello, can you confirm you're working?"

**Expected result:** Claude responds through the Dashboard. If it does, the AI connection is working.

**If you get an authentication error:**
> Double-check your API key. Go to console.anthropic.com, verify the key is active, and re-enter it. API keys are case-sensitive — copy the entire string exactly.

**If you get a model not found error:**
> The model name may have changed. Try `claude-sonnet-4-5` or check the Anthropic documentation for current model names.

### 4.6 Sleep Prevention

Your MacBook needs to stay awake for the AI agent to work. By default, closing the lid puts it to sleep, which kills the agent.

- [ ] Run this command to prevent sleep:

```bash
sudo pmset -a disablesleep 1
```

**What this does:** Tells macOS to never sleep, even when the lid is closed. The `sudo` part means it needs your Mac login password — type it when prompted (you won't see the characters as you type, that's normal).

**Expected output:**

```
Password: [you type your password here, nothing visible]
[no output — silence means success]
```

- [ ] Verify the setting:

```bash
pmset -g | grep disablesleep
```

**Expected output:**

```
 disablesleep        1
```

**Important:** This disables ALL sleep, including manual sleep. If you take this laptop on the go, you'll want to re-enable sleep to save battery:

```bash
sudo pmset -a disablesleep 0
```

And re-disable it when you get home:

```bash
sudo pmset -a disablesleep 1
```

> **Understanding: Why servers don't sleep (transferable)**
>
> Any always-on service — a web server, a home automation hub, an AI agent — needs its host machine to stay awake. This isn't specific to OpenClaw. If you ever run any other service on this machine (a smart home controller, a media server, anything), the same rule applies: the computer must stay powered on and awake. Sleep is for laptops that travel. Servers don't sleep.

### 4.7 Battery and Charge Management

Since this MacBook will be plugged in most of the time, you need to protect the battery from degradation.

- [ ] Open System Settings > Battery
- [ ] Set the charge limit to **80%**

**What this does:** Stops charging the battery at 80% instead of 100%. Lithium batteries degrade faster when kept at full charge for long periods. Since your MacBook is plugged in and doesn't need full battery capacity, capping at 80% significantly extends battery lifespan.

**Expected result:** The Battery settings show a charge limit of 80%.

- [ ] Also in Battery settings: Set "Turn display off after" to a short interval (5 minutes)

**Why:** The display can sleep while the computer stays awake. This saves power and reduces heat without affecting the agent.

### 4.8 Thermal Management

The MacBook Air has no fan — it cools passively. For OpenClaw's workload (mostly idle, occasional bursts), this is fine. But a few practices help:

- [ ] Use a laptop stand or elevate the MacBook on a hard surface (not a blanket, pillow, or couch cushion)
- [ ] If running with the lid closed, keep it on a well-ventilated surface
- [ ] If running with the lid open, set the screen brightness to zero — this gives marginally better heat dissipation

**You do NOT need to worry about thermal throttling for normal use.** OpenClaw's workload is 95% idle. The Air handles this comfortably. Throttling would only matter during intensive browser automation or if multiple skills run simultaneously — and even then, the agent just gets slower, it doesn't crash.

### 4.9 Installation Verification Checkpoint

Let's confirm everything from this section is working:

- [ ] `openclaw --version` shows 2026.2.25 or higher
- [ ] `openclaw health` shows all green
- [ ] Dashboard loads at localhost:18789
- [ ] Claude responds to test messages through the Dashboard
- [ ] `pmset -g | grep disablesleep` shows `disablesleep 1`
- [ ] Battery charge limit is set to 80%
- [ ] Laptop is on a stand or hard surface

**If all checkboxes above are checked, OpenClaw is installed and running.** The next section locks it down.

### Self-Test: Section 4

- [ ] OpenClaw is installed and running version 2026.2.25+
- [ ] I can access the Dashboard at localhost:18789
- [ ] Claude is connected and responding
- [ ] Sleep is disabled and battery charge limit is set
- [ ] I understand what each command I ran actually does

---

<!-- SECTION 5: s5-security -->
## Section 5: Security Hardening

This section configures the security controls that protect your agent, your data, and your professional reputation. These are not optional steps — they are as essential as the installation itself. The default OpenClaw configuration is wide open, and the walkthrough locks it down before you use it for anything real.

**The approach:** Think of security as layers, like the walls and locks in a building. Each layer stops a different type of problem. Even if one layer fails, the others still protect you.

*[Diagram 3: Security Layers — Defense in Depth — shows concentric layers: macOS Firewall/FileVault > Localhost Binding > Gateway Password > Docker Sandbox, with "Your Agent + Your Data" at the center]*

### Why This Matters for You Specifically

You're not just a person running a tech experiment. You're a top-ranked Denver real estate agent whose livelihood depends on client trust. Here's what's at stake:

| What's on Your Machine | If Compromised |
|------------------------|----------------|
| Client names and contact info | Breach of professional trust. Potential legal liability. |
| Instagram credentials | Unauthorized posts from @jeffanswers. Brand damage to Hatch. |
| Claude API key | Someone runs up charges on your account. |
| Chat history and session logs | Contains business conversations and strategy. |
| Browser sessions (if browser tools enabled) | Access to your email, banking, real estate platforms. |

Your real estate industry is actively grappling with AI security. Industry conferences in early 2026 flagged "feeding sensitive client information into AI tools" as a new risk. You're ahead of the curve by taking this seriously.

### 5.1 Gateway Authentication

You already generated a gateway token in Section 4.3. Now let's verify it's properly configured.

- [ ] Run:

```bash
openclaw config get gateway.auth
```

**Expected output:** Shows that authentication is enabled with a token set.

If authentication isn't set, configure it now:

```bash
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token YOUR-GENERATED-TOKEN
```

**What this prevents:** Without authentication, any code running on your computer — including JavaScript from websites you visit — could control your agent. The "ClawJacked" vulnerability exploited exactly this: a malicious website opened a connection to the gateway, brute-forced the password (there was none), and took control. Your token makes this impossible.

### 5.2 Localhost Binding

This ensures the gateway only listens on your computer, not on the network.

- [ ] Verify localhost binding:

```bash
openclaw config get gateway.bind
```

**Expected output:** Shows binding to `loopback` or `127.0.0.1`.

If it shows anything else, fix it:

```bash
openclaw config set gateway.mode local
openclaw config set gateway.bind loopback
openclaw config set gateway.port 18789
```

**What this prevents:** If the gateway listened on your network instead of just your computer, anyone on your home WiFi could reach it. Localhost means "this computer only." Since you access OpenClaw directly on your MacBook (not from another device), localhost is all you need.

> **Understanding: "Localhost" in plain language (transferable)**
>
> Every computer has a special address — 127.0.0.1, also called "localhost" — that means "me, and only me." When a program listens on localhost, it's like having a conversation in your own head: nobody else can hear it. When a program listens on your network address instead, it's like speaking out loud in a room full of people. For any service you run on your own computer — not just OpenClaw — binding to localhost is the safe default. Only bind to the network if you specifically need other devices to connect.

### 5.3 Enable Sandbox Mode

This is one of the most important security controls. The sandbox runs all agent tool execution inside an isolated container — a locked room the agent works inside.

- [ ] Configure sandbox mode:

```bash
openclaw config set agents.defaults.sandbox.mode all
openclaw config set agents.defaults.sandbox.scope session
openclaw config set agents.defaults.sandbox.docker.network none
openclaw config set agents.defaults.sandbox.docker.readOnlyRoot true
openclaw config set agents.defaults.sandbox.docker.capDrop '["ALL"]'
openclaw config set agents.defaults.sandbox.docker.user "1000:1000"
```

- [ ] Verify:

```bash
openclaw config get agents.defaults.sandbox
```

**Expected output:** Shows sandbox mode "all," network "none," readOnlyRoot "true."

**What this prevents:** Without the sandbox, a tricked agent (via a malicious message, a poisoned email, or a bad website) could access everything on your computer — your client files, browser sessions, saved passwords. With the sandbox, even a compromised agent is contained in its locked room. It can't reach out.

**The `network none` setting** means the sandbox has no internet access on its own. The agent communicates through the gateway, which controls what goes in and out. This prevents a compromised agent from calling home to an attacker.

> **Understanding: What a sandbox actually does (transferable)**
>
> A sandbox is like a padded room in a bank where employees handle cash. The room has cameras, the door locks from the outside, and nothing leaves without being checked. Even if an employee makes a mistake (or is compromised), the damage stays in the room. In computing, sandboxes use the same principle: the program runs inside an isolated environment where it can do its job but can't affect anything outside. This applies to any software that runs code on your behalf — browser extensions, AI agents, automation tools. If it can be sandboxed, it should be.

### 5.4 Disable Elevated Mode

Elevated mode is an escape hatch that lets the agent bypass the sandbox and run commands directly on your Mac. You have no reason to enable this.

- [ ] Verify elevated mode is off:

```bash
openclaw config get tools.elevated
```

**Expected output:** Shows `enabled: false`.

If it shows `true`, disable it:

```bash
openclaw config set tools.elevated.enabled false
```

**What this prevents:** Even if something tricks the agent into trying to run commands outside its sandbox, the system blocks it at the door.

### 5.5 Zero Community Skills

This is a hard policy, not a suggestion: **do not install any skills from ClawHub** (OpenClaw's public skill registry).

Here's why, in plain terms:

Roughly 1 in 5 skills on ClawHub are actually malware — programs designed to steal your passwords, API keys, and data. This isn't speculation. Security researchers scanned nearly 4,000 skills and found 534 with critical security problems and 76 that were outright malicious. Confirmed macOS malware (called "Atomic Stealer") has been distributed through ClawHub skills that look legitimate.

**The publishing barrier to ClawHub is negligible.** All you need is a one-week-old GitHub account and a text file. No code review. No security audit. No quality control.

Skills inherit your agent's full permissions — file access, network access, credential access, the ability to send messages as you. A malicious social media skill could post anything from @jeffanswers. A credential-stealing skill could grab your Claude API key and your Instagram token.

**The policy:**
- [ ] I will NOT install any skills from ClawHub
- [ ] I will NOT install any skill without checking with Sean first
- [ ] The only skills on my system will be ones built locally by this walkthrough

> **Understanding: Why app stores aren't always safe (transferable)**
>
> ClawHub is like an app store with no security review. You already know to be careful about what apps you install on your phone — this is the same principle, amplified. Browser extensions, WordPress plugins, phone apps from unknown developers — they all carry the same risk. The more permissions something has, the more careful you need to be about where it came from. Your agent has extensive permissions by design (it needs them to be useful). That makes skill selection a critical security decision.

### 5.6 Disable mDNS/Bonjour Broadcasting

By default, OpenClaw announces its presence on your local network — like putting up a sign that says "AI agent running here."

- [ ] Disable it:

```bash
openclaw config set discovery.mdns.mode off
```

- [ ] Verify:

```bash
openclaw config get discovery.mdns
```

**Expected output:** Shows `mode: off`.

**What this prevents:** Anyone on your home WiFi (guests, other devices, smart home gadgets) can see that you're running OpenClaw, including technical details about your setup. Turning this off pulls down the sign. Your agent still works — it just doesn't advertise itself.

### 5.7 Run the Security Audit

OpenClaw includes a built-in security checker. Run it after all the configuration above.

- [ ] Run the audit:

```bash
openclaw security audit
```

**Expected output:** A report showing the security status of your configuration. Look for green checks or "PASS" on each item.

**If any items show warnings or failures:**

```bash
openclaw security audit --fix
```

This auto-fixes common issues. Run the audit again afterward to confirm.

- [ ] Run a deeper audit:

```bash
openclaw security audit --deep
```

This checks additional items that the basic audit skips. Review the output and address any warnings.

### 5.8 What We've Secured and What Risk Remains

**What you now have:** Four layers of security, each protecting independently:

1. **macOS Firewall + FileVault** — blocks network probes and encrypts your drive
2. **Localhost binding** — blocks anyone not on this computer from reaching the agent
3. **Gateway authentication** — blocks unauthorized access even from your own machine
4. **Docker sandbox** — blocks the agent from escaping its isolated environment

Plus: no community skills (eliminating the #1 attack vector), mDNS broadcasting disabled (your agent is invisible on the network), and a verified security audit.

**What risk remains — honestly:**

**Shared machine risk.** Your MacBook runs OpenClaw and your personal applications on the same device. If the Docker sandbox were breached (through a rare, sophisticated attack), the agent could potentially access your client files, browser sessions, and credentials. This risk is LOW (container escapes are rare) but real. A dedicated machine would eliminate it entirely.

**New vulnerabilities will be found.** OpenClaw's security has been heavily scrutinized — 12+ vulnerabilities were discovered and patched in February 2026 alone. New ones will emerge. Keeping OpenClaw updated (Section 8 covers this) is your primary defense. The sandbox limits damage even from unknown vulnerabilities.

**Prompt injection has no complete solution.** If your agent reads untrusted content (emails, web pages, social media messages), hidden instructions in that content could influence the agent's behavior. No current technology fully prevents this. Your defense: limit what content sources the agent accesses, review what it does, and use Claude Sonnet 4.6 (the strongest available model at resisting injection).

**API key exposure window.** Your API keys are stored on your hard drive (protected by FileVault). If they're somehow leaked, they remain valid until you change them. Set calendar reminders to rotate keys every 90 days (Section 8 covers this).

These risks are manageable. They are the same kinds of risks any AI agent deployment faces. You're mitigated better than most because this walkthrough doesn't take shortcuts.

### Self-Test: Section 5

- [ ] Gateway authentication is configured with a strong token
- [ ] Gateway is bound to localhost only
- [ ] Sandbox mode is enabled for all agents
- [ ] Elevated mode is disabled
- [ ] No ClawHub skills installed (zero tolerance)
- [ ] mDNS broadcasting is disabled
- [ ] Security audit passes clean
- [ ] I understand the residual risks and how to manage them
- [ ] I understand that these security principles apply to any agent platform, not just OpenClaw

---

<!-- SECTION 6: s6-prompting -->
## Section 6: Prompting — Working With Your Agent

Now that OpenClaw is installed and secured, you need to learn how to talk to it effectively. This section covers how to give your agent instructions that produce useful results — specifically for your real estate content workflow.

The skills in this section transfer to every AI tool you'll ever use. Whether it's Claude directly, ChatGPT, Gemini, or any future AI platform, the principles of good prompting are the same.

### How Prompting Works

When you send a message to your agent, here's what happens behind the scenes:

*[Diagram 4: How a Prompt Becomes Action — sequence diagram showing Jeff > Gateway > Claude > Skills > back to Jeff]*

1. Your message goes to the Gateway
2. The Gateway adds your brand voice instructions (from files you'll set up below) to the message
3. The combined package goes to Claude
4. Claude reads your message in the context of your brand voice and writes a response
5. If Claude needs information (like current market data), it asks a skill to get it
6. The response comes back to you

**The key insight:** Claude doesn't just read your message. It reads your message plus everything in your brand voice files plus the conversation history. That context is what makes the response sound like you, not like a generic AI.

### 6.1 Setting Up Your Brand Voice

OpenClaw uses special files that get injected into every conversation with the agent. These files teach Claude who you are and how you communicate.

#### SOUL.md — Your Core Voice

- [ ] In the Dashboard, navigate to your agent's workspace (or use the file path `~/.openclaw/workspace/`)
- [ ] Create a file called `SOUL.md` with this content (customize it for your actual voice):

```markdown
# Brand Voice — Jeff Answers / Hatch Real Estate

## Who I Am
I'm Jeff, a top-ranked Denver real estate agent and owner of the Hatch brand.
I've been in Denver real estate for [X] years. I know the neighborhoods,
the market dynamics, and the real story behind the numbers.

## How I Sound
- Professional but approachable — like talking to a knowledgeable friend
- Confident without being arrogant — I know my market, and it shows
- Denver-specific — I reference real neighborhoods, real trends, real numbers
- Direct — I don't use filler or corporate jargon
- Warm but authoritative — people trust me because I'm honest

## What I Never Do
- I never use clickbait or sensationalism
- I never make guarantees about market performance
- I never sound like a generic AI or a template
- I never use excessive emojis or hashtags (3-5 relevant hashtags max)
- I never discuss politics or controversial topics

## Content Style
- Instagram captions: 50-150 words, conversational, end with a question or
  call-to-action that invites engagement
- Market updates: lead with the insight, follow with the data
- Property features: tell the story of the home, not just the specs
- Hashtags: always include #DenverRealEstate, vary the rest based on content

## Example Tone
"The Sloans Lake market is telling a different story this spring. Inventory is
up 15% from last year, but homes priced right are still moving in under two
weeks. If you've been waiting for the right moment, the data says the window
is opening. What neighborhood are you watching?"
```

Customize this with your actual experience, neighborhoods you specialize in, and the tone that represents your brand.

#### IDENTITY.md — Your Brand Identity

- [ ] Create a file called `IDENTITY.md`:

```markdown
# Identity

## Name
Jeff — @jeffanswers on Instagram

## Brand
Hatch Real Estate, Denver

## Role
Denver's top-ranked real estate agent helping buyers and sellers navigate
the market with honesty and expertise.

## Platform Focus
Instagram — visual storytelling and market insights for the Denver real
estate community.
```

#### USER.md — Context About You

- [ ] Create a file called `USER.md`:

```markdown
# User Context

## Market Area
Denver, Colorado — all neighborhoods and suburbs. Primary focus areas:
[list your top neighborhoods].

## Target Audience
Denver homebuyers and sellers. Mix of first-time buyers, move-up buyers,
and investors. Age range 28-55.

## Business Context
- Top-ranked Denver real estate agent (ranked #1-2 out of 20,000 agents
  by AI search)
- Owner of Hatch Real Estate brand
- Building @jeffanswers as the primary social media presence
- Franchise aspirations — systematizing what makes the business effective

## Content Goals
- Establish @jeffanswers as the go-to Denver real estate resource on Instagram
- Post 3-5 times per week consistently
- Mix of: market updates, neighborhood spotlights, home features,
  behind-the-scenes, tips for buyers/sellers
- Build a community, not just a following
```

### 6.2 Good Prompts vs. Bad Prompts

The quality of what the AI produces depends entirely on the quality of what you ask for. Here are real examples:

#### Bad: Vague and Generic

```
Write me an Instagram post
```

**Result:** A generic, bland caption that could be from any agent in any city. The AI has nothing to work with.

#### Good: Specific and Contextual

```
Write an Instagram post about the Denver housing market in March 2026.
Inventory in Sloans Lake is up 15% year-over-year. Tone: optimistic but
realistic. End with a question that invites engagement. Include 3-5
relevant hashtags.
```

**Result:** A caption that references real data, sounds like a local expert, and engages the audience.

#### Bad: Too Many Instructions at Once

```
Write me 5 Instagram posts for this week about different Denver neighborhoods,
also create a content calendar, also tell me the best posting times, also
suggest hashtag strategies
```

**Result:** A scattered response that does everything poorly.

#### Good: One Task, Clear Parameters

```
Write one Instagram post about the Cherry Creek neighborhood for a buyer
audience. Highlight the walkability and restaurant scene. Keep it under
150 words. Include my signature hashtags plus 2 neighborhood-specific ones.
```

**Result:** A focused, high-quality caption you can actually use.

#### The Pattern

Good prompts share three things:
1. **One clear task** — what you want
2. **Specific context** — the details that make it relevant
3. **Constraints** — length, tone, format, audience

This pattern works with every AI tool. Whether you're using Claude through OpenClaw, Claude directly on the web, or any other AI platform, specificity produces better results.

### 6.3 Common Prompting Mistakes

**Mistake 1: Accepting the first draft**
The first response is rarely the best one. Treat it like a first draft from a copywriter — give feedback and iterate.

```
That's too formal. Rewrite it like I'm talking to a friend at a backyard
barbecue who just asked about the Denver market.
```

**Mistake 2: Not providing examples**
If you have Instagram posts you admire (from other agents, from any brand), tell the AI:

```
Here's a post style I like: [paste example]. Write my Sloans Lake market
update in a similar tone but with my voice from SOUL.md.
```

**Mistake 3: Forgetting to specify the platform**
An Instagram caption is different from a blog post is different from an email. Always specify:

```
This is for an Instagram carousel post. Write the caption for the first
slide and brief text for 4 additional slides about Denver market trends.
```

**Mistake 4: Not reviewing before posting**
The AI will sometimes make factual errors about your market, suggest hashtags that are off-brand, or produce content that doesn't sound like you. Always review. Always. Your professional reputation is attached to every post from @jeffanswers.

> **Understanding: Prompting is a skill, not a talent (transferable)**
>
> Prompting is like learning to brief a new assistant. The first few days, you give very detailed instructions and correct a lot. Over time, the assistant learns your preferences (through the SOUL.md and IDENTITY.md files) and you can give shorter instructions. But even experienced prompters still review outputs. The AI is a force multiplier for your ideas, not a replacement for your judgment. This applies to every AI tool — better instructions produce better results, across the board.

### 6.4 Real Estate Prompt Templates

Here are starter templates you can customize. Save the ones you like for reuse.

**Market Update:**
```
Write an Instagram caption about the [neighborhood] real estate market
this [week/month]. Key data point: [specific stat]. Tone: insightful and
conversational. End with a question. 100-150 words. 3-5 hashtags including
#DenverRealEstate.
```

**Property Feature:**
```
Write an Instagram caption for a property at [address/neighborhood].
Highlights: [2-3 features]. Target buyer: [type]. Make it feel like
storytelling, not a listing sheet. 80-120 words. 3-5 hashtags.
```

**Neighborhood Spotlight:**
```
Write an Instagram caption about why [neighborhood] is great for
[buyer type]. Include: [2-3 specific things — restaurants, parks, schools,
vibe]. Tone: enthusiastic but genuine. End with "What's your favorite spot
in [neighborhood]?" 100-150 words.
```

**Behind the Scenes:**
```
Write an Instagram caption about [situation — open house prep, closing day,
market research]. Make it relatable and human. Show the work behind the
results. Keep it under 100 words. 3-4 hashtags.
```

### 6.5 Iterating and Refining

After the AI produces a draft, you can refine it:

- "Make it shorter — under 80 words"
- "That hashtag doesn't fit my market. Replace #RealEstateInvesting with #DenverHomes"
- "Too salesy. More conversational, less pitch."
- "Add a specific mention of the upcoming open house on Saturday at 2pm"
- "I like the opening but the ending falls flat. Rewrite just the last two sentences."

The more specific your feedback, the better the revision. "Make it better" gives the AI nothing to work with. "The tone is right but the call-to-action feels generic — make it specific to first-time buyers in Washington Park" gives it everything.

### Self-Test: Section 6

- [ ] SOUL.md, IDENTITY.md, and USER.md are created and customized
- [ ] I understand the difference between a vague prompt and a specific one
- [ ] I have at least 2-3 prompt templates saved for my common content types
- [ ] I understand that prompting skills transfer to every AI tool
- [ ] I understand that I always review AI output before publishing

---

<!-- SECTION 7: s7-social -->
## Section 7: Your Social Media Workflow

This section builds your complete Instagram workflow: AI-powered content creation through OpenClaw, human review (that's you), and automated publishing through Zapier. By the end, you'll have a system that takes ~15 minutes a day.

### The Split Architecture

Your workflow has two distinct halves, deliberately separated:

*[Diagram 5: Split Architecture — Content Creation to Instagram — shows the flow from Jeff through OpenClaw/Claude to Draft, then through human approval gate to Zapier to Instagram]*

**Left side — Content Creation (OpenClaw + Claude):**
You give the AI a content idea. Claude drafts a caption with hashtags in your brand voice. You review and approve (or revise).

**Right side — Publishing (Zapier):**
Approved content goes to Zapier, which handles the mechanical posting to Instagram on your schedule.

**Why the split?** Three reasons:
1. OpenClaw has no native Instagram skill — it literally cannot post directly
2. Zapier already has a pre-approved Instagram integration that handles all the Meta API complexity
3. The split creates a mandatory human review point between creation and publishing — protecting your brand

*[Diagram 6: What Stays Local vs. What Leaves — shows conversation history, API keys, skills, drafts staying on your MacBook; only prompt text and published posts crossing the internet boundary]*

### Part A: Content Creation with OpenClaw

This part happens on your MacBook, using the brand voice files you set up in Section 6.

#### Setting Up a Content Workspace

- [ ] In your agent's workspace, create a folder for content:

```bash
mkdir -p ~/.openclaw/workspace/content/drafts
mkdir -p ~/.openclaw/workspace/content/approved
mkdir -p ~/.openclaw/workspace/content/posted
```

These folders organize your workflow:
- `drafts/` — AI-generated content waiting for your review
- `approved/` — content you've approved and queued for posting
- `posted/` — archive of published content

#### Creating Your First Content Draft

- [ ] Open the Dashboard and start a conversation with your agent
- [ ] Use one of the templates from Section 6. For your first post:

```
Write an Instagram caption introducing @jeffanswers to my audience.
I'm Jeff, Denver's top-ranked real estate agent, and this account will
be the place for honest Denver market insights, neighborhood spotlights,
and real talk about buying and selling homes. Tone: confident, warm,
genuine. This is my first post — make it count but don't make it feel
forced. Under 150 words. 4-5 hashtags including #DenverRealEstate
and #JeffAnswers.
```

- [ ] Review the draft Claude produces
- [ ] If you like it, save it. If not, iterate:

```
Good start but the opening is too generic. Start with something unexpected —
a specific Denver market fact that grabs attention. Keep the same warm tone.
```

- [ ] When you're satisfied, copy the final caption to `approved/`

#### Batch Content Creation

For efficiency, create multiple pieces in one session:

```
I need 5 Instagram posts for this week. Here are the topics:
1. Denver market update — spring inventory trends
2. Neighborhood spotlight — Highland
3. First-time buyer tip — what to know about inspections
4. Behind the scenes — what a typical Tuesday looks like for me
5. Engagement post — "What's your dream Denver neighborhood and why?"

Create each one separately. Follow the voice in SOUL.md. Each should be
80-150 words with 3-5 hashtags. Number them 1-5.
```

Review each one individually. Approve the good ones, revise the ones that need work.

> **Understanding: Why batch creation saves you time**
>
> Creating 5 posts at once takes about 20-30 minutes including review. Creating them one at a time over the week takes the same total time but spread across 5 separate sessions, each with its own context-switching cost. Batch creation is how content professionals work — set aside focused time once or twice a week, create the content, then schedule it. The AI makes this even faster because it handles the first draft. You're the editor, not the writer. This workflow pattern applies whether you're using OpenClaw, Claude directly, or any AI content tool.

### Part B: Zapier Publishing Setup

Now you'll connect Zapier to your Instagram Business account and create the automation that posts approved content.

#### Connect Zapier to Instagram

- [ ] Log in to [zapier.com](https://zapier.com)
- [ ] Click "Create a Zap" (Zapier's term for an automation)
- [ ] For the trigger, search for and select "Google Sheets"
  - Choose trigger: "New or Updated Spreadsheet Row"
  - Connect your Google account when prompted
  - We'll create the spreadsheet in the next step

#### Create Your Content Calendar Spreadsheet

- [ ] Open Google Sheets and create a new spreadsheet
- [ ] Name it: "Jeff Instagram Content Calendar"
- [ ] Set up columns:

| A: Date | B: Caption | C: Hashtags | D: Image URL | E: Status |
|---------|-----------|-------------|-------------|-----------|
| 2026-03-10 | [Your caption] | #DenverRealEstate #Highland | [URL to image] | Ready |

- [ ] **Status column values:**
  - `Draft` — still being revised
  - `Ready` — approved and waiting to post
  - `Posted` — published to Instagram
  - `Skip` — decided not to post this one

The spreadsheet is your control center. Claude drafts go here, you review and set status to "Ready," and Zapier watches for "Ready" rows.

#### Set Up the Zapier Flow

- [ ] **Step 1 — Trigger: Google Sheets**
  - Spreadsheet: "Jeff Instagram Content Calendar"
  - Worksheet: Sheet1
  - Trigger on: "Status" column changes to "Ready"

- [ ] **Step 2 — Action: Instagram for Business**
  - Search for "Instagram for Business" in Zapier
  - Choose action: "Publish Photo"
  - Connect your Instagram Business account when prompted (this uses the Facebook Page link you set up in Section 3)
  - Map fields:
    - Image URL → column D
    - Caption → combine column B + column C (caption + hashtags)

- [ ] **Step 3 — Action: Update Google Sheet**
  - After publishing, update the Status column to "Posted"
  - This completes the loop so you know what's been published

- [ ] **Test the Zap:**
  - Add a test row to your spreadsheet with a real caption and an image URL
  - Set the status to "Ready"
  - Watch Zapier process it
  - Check Instagram to confirm the post appeared

**Expected result:** A post appears on your Instagram from the content in your spreadsheet.

> **Understanding: Why Google Sheets as the bridge?**
>
> You might wonder why we're using a spreadsheet instead of a more sophisticated system. Three reasons: (1) you already know how to use Google Sheets, (2) it gives you a visual content calendar you can share with your business partner, and (3) it creates a clear audit trail of what was posted and when. Simplicity is a feature, not a limitation. You can add complexity later (scheduling, AI-generated images, performance tracking) once the basic workflow is running. Start simple, add only what proves necessary.

#### Image Strategy

Instagram posts need images. Options, from simplest to most complex:

**Option 1: Your own photos (start here)**
- Property photos from listings
- Neighborhood shots from your phone
- Headshots and behind-the-scenes photos
- Upload them to Google Drive and use the sharing link as the image URL

**Option 2: Canva templates**
- Create branded templates in Canva for market updates and tips
- Export as JPEG (Instagram requires JPEG — PNG won't work via the API)
- Upload to Google Drive

**Option 3: AI-generated images (later)**
- Services like DALL-E or Midjourney can create custom images from text descriptions
- This adds complexity and cost — start with your own photos and add AI images later if needed

**Important format note:** Instagram's API only accepts JPEG images. If you have PNG images, convert them to JPEG before uploading. Aspect ratios must be between 4:5 (portrait) and 1.91:1 (landscape).

### Part C: Your Daily Workflow

Here's what a typical day looks like with this system running:

#### Once or Twice a Week: Content Batch Session (30-45 minutes)

1. Open the OpenClaw Dashboard
2. Tell your agent what content you need for the week:
   ```
   Create 4 Instagram posts for this week:
   - Monday: Denver market update for first week of March
   - Wednesday: Neighborhood spotlight on RiNo
   - Friday: Tip for sellers — how to price right in a shifting market
   - Sunday: Engagement — "What does your dream Denver home look like?"
   ```
3. Review each draft. Revise what needs work.
4. Copy approved captions to your Google Sheets content calendar
5. Add images (your photos or Canva graphics) to the Image URL column
6. Set each row's status to "Ready"

#### Daily: Quick Review (5-10 minutes)

1. Check that Zapier posted today's content correctly
2. Glance at comments and engagement on recent posts
3. Note any content ideas that come up during your day — add them to a "Ideas" tab in the spreadsheet for your next batch session

#### Weekly: Maintenance (10 minutes)

1. Review what performed well and what didn't — adjust your SOUL.md if the tone needs tweaking
2. Run `openclaw security audit` (30 seconds)
3. Check for OpenClaw updates (covered in Section 8)

**Total time investment:** ~15-20 minutes per day, with one longer batch session per week. This is a significant reduction from creating content from scratch while still maintaining the quality your brand demands.

### Part D: Measuring Success

#### First 2 Weeks: Establishing the System

Don't measure Instagram metrics yet. Focus on:
- [ ] Is the content workflow smooth? Can you go from idea to approved draft in under 5 minutes?
- [ ] Is Zapier posting reliably? Check that every "Ready" row actually gets posted.
- [ ] Does the content sound like you? Show drafts to your business partner or someone who knows your voice.

#### Weeks 3-4: Early Signals

Now start watching:
- **Consistency:** Are you posting 3-5 times per week? Consistency matters more than any single post.
- **Engagement rate:** Are people liking, commenting, saving? Early engagement rates on new accounts are typically low — that's normal. Look for gradual increase.
- **Content quality:** Which types of posts get the most engagement? Market updates? Neighborhood spotlights? Tips? Lean into what works.
- **Time savings:** Are you spending less time on social media while posting more? That's the win.

#### What to Adjust

- If content sounds too generic: add more specific examples to SOUL.md
- If engagement is low: experiment with different content types and posting times
- If Zapier fails: check your Instagram token (they expire every 60 days — Zapier usually handles refresh, but verify)
- If the AI makes market errors: always double-check data claims before approving

#### Realistic Expectations

**Building @jeffanswers from zero to a meaningful following takes months of consistent posting, not weeks.** The AI accelerates content creation but doesn't accelerate audience building. What the AI gives you is the ability to post consistently without the anxiety of creating everything from scratch. That consistency, over time, builds the audience.

The agents in your market who are winning at social media post 3-5 times per week with quality content. This system lets you do that in 15-20 minutes a day. That's the competitive advantage.

### Self-Test: Section 7

- [ ] I have a content workspace set up (drafts/approved/posted folders)
- [ ] I can create content drafts with OpenClaw and iterate on them
- [ ] Zapier is connected to my Instagram Business account
- [ ] My Google Sheets content calendar is set up with the correct columns
- [ ] I've tested the full flow: draft > approve > Zapier posts > Instagram
- [ ] I understand that content creation and publishing are separate systems
- [ ] I have a realistic expectation of ~15-20 min/day time investment

---

<!-- SECTION 8: s8-next -->
## Section 8: What's Next

Your system is running. Content is flowing. Instagram is getting consistent posts for the first time. Now let's talk about what comes next — both immediate maintenance and future possibilities.

### Immediate: Keeping Your System Healthy

#### Weekly Update Routine (5 minutes)

OpenClaw is actively maintained, with security patches released frequently. Update weekly:

- [ ] **Step 1 — Back up your configuration:**

```bash
tar -czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw
```

This creates a timestamped backup. If an update breaks something, you can restore from this.

- [ ] **Step 2 — Run the update:**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash --no-onboard
```

- [ ] **Step 3 — Verify:**

```bash
openclaw doctor && openclaw gateway restart && openclaw health
```

**Expected result:** All checks pass, gateway restarts, health shows green.

- [ ] **Step 4 — Open the Dashboard and confirm the agent responds.**

**If an update breaks something:**

```bash
openclaw gateway stop
tar -xzf ~/openclaw-backup-YYYYMMDD.tar.gz -C ~/
openclaw gateway start
```

This restores your previous configuration. Then check with Sean.

> **Understanding: Backup before update, verify after update (transferable)**
>
> This three-step pattern — backup, update, verify — applies to every piece of software you maintain. WordPress updates, phone OS updates, any tool you depend on. The backup gives you a safety net. The verification confirms the update didn't break anything. The rollback plan means you're never stuck. This is how IT professionals approach every update, whether it's a single app or a data center.

#### API Key Rotation (every 90 days)

Set calendar reminders to change your API keys quarterly:

1. Generate a new key in the Anthropic console (console.anthropic.com)
2. Update it in OpenClaw: `openclaw config set llm.apiKey NEW-KEY-HERE`
3. Delete the old key in the Anthropic console
4. Verify the agent still responds

**Why:** If a key was leaked without you knowing, rotation limits the exposure window. It's like changing your locks periodically — probably unnecessary, but the cost is minimal and the protection is real.

#### Session Cleanup (monthly)

Old session transcripts accumulate and contain everything the agent saw and did — including client names and business data.

```bash
# Delete sessions older than 30 days
find ~/.openclaw/agents/*/sessions/ -mtime +30 -delete
```

**Why:** The less historical data sitting on your machine, the less an attacker could access.

### Future: Expanding What Your Agent Can Do

Once your Instagram workflow is running smoothly (give it 4-6 weeks), here are paths worth exploring:

#### SEO and Website Content

OpenClaw supports a WordPress integration that could help with blog posts and SEO content for your Hatch website. This would extend the same content workflow (AI drafts, you review, automation publishes) to your website.

**When to consider:** After Instagram is running smoothly and you're comfortable with the content workflow. The WordPress integration adds complexity but uses the same prompting skills you've already learned.

#### Research Agents

You could set up a separate agent focused on competitive intelligence — monitoring Denver market data, tracking competitor listings, summarizing market reports. This would give you market insights fed directly into your content workflow.

**When to consider:** After you've been creating content for 2-3 months and want more data-driven posts.

#### Google Workspace Integration

Connecting OpenClaw to your Gmail and Google Calendar is technically possible and would let the agent help with scheduling, email drafting, and calendar management.

**When to consider:** Phase 2, and carefully. Connecting your email to an AI agent creates a prompt injection risk — any email you receive could contain hidden instructions the agent follows. This needs careful configuration and is not recommended until you're comfortable with how agents handle untrusted content. Discuss with Sean before attempting this.

#### Franchise Systematization

You mentioned wanting to franchise your essence — systematize what makes you effective so it can scale. Your SOUL.md, IDENTITY.md, and content templates are the first building blocks of that. As you refine your brand voice and content strategy with the AI, you're documenting your approach in a way that could be replicated.

**When to consider:** Once your social media system is generating consistent, quality content, use that as a case study for what systematized, AI-assisted real estate marketing looks like. The templates, prompts, and workflow you're building now are the franchise playbook.

### Getting Help

- **Sean** is your first call for anything technical — updates that break things, security concerns, expanding the system
- **The OpenClaw Dashboard** shows logs and error messages if something goes wrong. Screenshot these before reaching out.
- **This walkthrough** is your reference document. Come back to it when you need to re-check a configuration or remember a command.

### Final Checklist

Before you close this walkthrough, confirm:

- [ ] OpenClaw is installed, secured, and running (Sections 4-5)
- [ ] Your brand voice files (SOUL.md, IDENTITY.md, USER.md) are created and customized (Section 6)
- [ ] You can create content with your agent and iterate on drafts (Section 6)
- [ ] Zapier is connected and posting to Instagram (Section 7)
- [ ] Your Google Sheets content calendar is working (Section 7)
- [ ] You know how to update weekly (Section 8)
- [ ] You have a backup of your configuration
- [ ] You understand the residual risks and how to manage them (Section 5)

You're running an AI-powered content system on your own hardware, with proper security, producing content in your brand voice, published to Instagram on your schedule. Most real estate agents haven't figured this out yet.

You have.

### Self-Test: Section 8

- [ ] I know how to update OpenClaw weekly (backup, update, verify)
- [ ] I have a plan for API key rotation
- [ ] I understand what future expansions are possible and when to pursue them
- [ ] I know who to contact for help

---

*Walkthrough produced by the On-Demand Curriculum Engine. 80+ sources, three-tier security hardening, dual-source intelligence (official documentation + community validation). Last updated: 2026-03-03.*
