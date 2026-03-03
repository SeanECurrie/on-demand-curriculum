# Architecture Mental Model — OpenClaw for Jeff

**Date:** 2026-03-03
**Depth:** Conceptual (Jeff-level, not engineer-level)
**Purpose:** Give Jeff enough understanding to not be lost, without overwhelming him

---

## The Pieces

There are four main parts to OpenClaw. Think of them like the parts of a business office:

- **Gateway:** The front desk. It receives every message you send, decides what to do with it, and sends the response back. It runs on your MacBook Air and keeps everything organized. If the Gateway is not running, nothing works — it is the foundation.

- **LLM Connection:** The brain you are renting. The Gateway does not think on its own — it sends your messages to an AI model (like Claude) over the internet, gets the response back, and delivers it to you. You provide your own API key, which is like a password that lets OpenClaw use Claude on your behalf. You pay per use, not a flat fee (though costs for Jeff's use case should be modest — a few dollars per month).

- **Skills:** The hands. Skills are add-ons that let OpenClaw actually do things — post to Instagram, search the web, read files, schedule tasks. Without skills, the agent can only talk. With skills, it can act. Skills are installed into your setup and the agent uses them when they are relevant to what you asked it to do.

- **Dashboard:** The control panel. A web page that runs on your MacBook Air (not on the internet — only accessible from your computer) where you can see what the agent is doing, review its work, change settings, and manage your setup visually instead of typing commands.

## How They Talk to Each Other

Here is what happens when Jeff sends a message to OpenClaw, step by step:

1. **Jeff types a message** — either through a messaging app (WhatsApp, Telegram) or through the Dashboard on his MacBook.
2. **The Gateway receives it** — the front desk checks who sent it, whether they are authorized, and which agent should handle it.
3. **The Gateway sends it to Claude** — Jeff's message, plus the conversation history and any relevant instructions, goes to Claude's servers over the internet.
4. **Claude thinks and responds** — Claude reads the message, decides what to do, and sends back either a response or a request to use a skill (like "I need to create an Instagram post").
5. **If a skill is needed, the Gateway runs it** — the Gateway executes the skill on Jeff's MacBook (for example, calling the Instagram API to prepare a post), then sends the result back to Claude so it can continue.
6. **The final response comes back to Jeff** — through whatever channel he used to send the original message.

The whole cycle takes a few seconds for simple messages, longer if skills need to run.

## Where Jeff's Data Flows

For Jeff's specific use case — prompting about Instagram content — here is what goes where:

**What stays on Jeff's MacBook (private):**
- All conversation history and session logs
- OpenClaw's configuration and settings
- Installed skills and their files
- Saved memory (things the agent remembers about Jeff's preferences)
- Draft content before it is posted

**What leaves Jeff's MacBook (sent over the internet):**
- The conversation text goes to Claude's servers (Anthropic) for processing. Anthropic's API has a zero data retention policy — they process it and do not store it. But the text does travel over the internet to get there.
- When posting to Instagram, the content (image, caption) goes to Instagram's servers via their API. This is the post itself — it is meant to be public.
- Messages through WhatsApp or Telegram travel through those platforms' servers, as they normally would.

**The key principle:** OpenClaw keeps Jeff's data local by default. The only things that leave are (1) what Jeff asks the AI to think about (sent to Claude for processing, not stored) and (2) what Jeff intentionally publishes (sent to Instagram because that is the whole point).

## What Can Go Wrong

Four things Jeff should understand about what can go wrong:

1. **A bad skill can do bad things.** Skills are like apps — most are fine, but some can be malicious. The public skill registry (ClawHub) has had malicious skills discovered on it. The walkthrough only installs vetted skills and configures OpenClaw to restrict what skills can do. Jeff should never install a skill on his own without checking with Sean first.

2. **The AI can misunderstand and take wrong actions.** If Jeff tells the agent to "post something about the Denver market" and the agent misinterprets the tone or makes a factual error, that goes out under Jeff's professional brand. This is why the walkthrough sets up a review-before-posting workflow — the agent drafts, Jeff approves, then it posts. No auto-posting without review, at least until Jeff is comfortable with the quality.

3. **If the Gateway is exposed to the internet, anyone could talk to it.** By default, OpenClaw only listens on Jeff's MacBook (localhost — meaning only his computer can access it). The walkthrough keeps it that way. If someone changed that setting, anyone on Jeff's network (or the internet) could potentially send commands to his agent. The security configuration prevents this.

4. **API keys are like passwords to Jeff's wallet.** The Claude API key lets anyone who has it use Claude and charge it to Jeff's account. The Instagram credentials let anyone who has them post as Jeff. These are stored on Jeff's MacBook in OpenClaw's configuration files. The walkthrough configures file permissions and sandbox settings to protect them, but Jeff should understand that these keys are sensitive — do not share them, do not screenshot them, do not paste them into conversations.

## The Mental Model in One Sentence

OpenClaw is a switchboard on Jeff's MacBook that takes his instructions, sends them to Claude for thinking, uses skills to take real actions (like posting to Instagram), and keeps everything private on his machine except what he intentionally sends out.
