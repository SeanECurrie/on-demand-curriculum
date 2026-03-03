# Open Questions — OpenClaw for Jeff (Output #2)

**Date:** 2026-03-03
**Questions:** 10
**Resolved by prior research:** 3
**Resolved by this research:** 5
**Remaining for hands-on testing:** 2

---

## Question Status Summary

| # | Question | What We Found | Confidence | What Remains Unknown |
|---|----------|---------------|------------|---------------------|
| 1 | How much RAM does OpenClaw + Docker actually use under sustained workloads on MacBook Air? | Each OpenClaw bot instance uses ~420-440 MB RAM. Full stack with OrbStack: 5.5-9.5 GB. With Docker Desktop: 8-14 GB. | **High** | Exact RAM after 7+ days continuous operation on MacBook Air M4 specifically. Docker Desktop memory leak behavior with OrbStack is less documented long-term. |
| 2 | Can OpenClaw post directly to Instagram? | **No.** No native Instagram skill. Requires intermediary: Zapier (recommended), Genviral skill (viable but risky), or n8n workflow. | **High** | Whether Genviral skill handles Instagram token refresh reliably. |
| 3 | What's the latency on social media content generation? | ~3-8 seconds for a full content draft (Gateway processing + Claude API call + skill execution). Average message response time: 1.2 seconds. | **Medium** | Latency under sustained multi-draft sessions. Irrelevant for Jeff's workflow — he reviews async, not real-time. |
| 4 | How does OpenClaw handle learning Jeff's brand voice without fine-tuning? | Via bootstrap files: SOUL.md (personality), IDENTITY.md (brand), USER.md (context), HEARTBEAT.md (interaction style). Injected every turn. No fine-tuning needed — this is persistent prompt engineering. | **High** | How well voice consistency holds across very long conversations (100+ turns). Answered by testing, not research. |
| 5 | How does OpenClaw handle Instagram's rate limiting? | Instagram allows 100 posts/day and 200 API requests/hour. Jeff's use case (3-5 posts/week) is <1% of allowed volume. No throttling concerns. Approved API posting (Graph API) is distinguished from unauthorized bot automation. | **High** | None — Jeff's volume is trivially within limits. |
| 6 | What happens when the MacBook Air sleeps / lid is closed? | All services stop. Fix: `sudo pmset -a disablesleep 1` (disable all sleep) or Amphetamine app for toggling. Battery settings alone insufficient for lid-closed. | **High** | None — fully answered in Task 4. |
| 7 | Can OpenClaw integrate with Google Workspace? | **Yes, but complex.** Gmail integration via Google Cloud Pub/Sub webhooks is documented. Google Calendar via same OAuth + Calendar API. Requires Google Cloud Console project setup, OAuth consent, Pub/Sub. | **Medium** | How reliable the Gmail Pub/Sub integration is for non-developer users. Phase 2 recommendation — too complex for Jeff's initial setup, and creates prompt injection surface. |
| 8 | What's the real monthly API cost for social media automation? | **$3-10/month for Claude API** (Sonnet 4.6, ~300K input + 150K output tokens/month). Plus Claude Pro subscription $20/month (separate). Plus Zapier $0-20/month. **Total: $23-50/month.** | **High** | Actual token usage will vary with Jeff's prompting style. Could be lower if he uses Haiku for drafts. |
| 9 | How does Jeff manage OpenClaw updates safely? | Re-run installer (`curl -fsSL https://openclaw.ai/install.sh | bash --no-onboard`), then `openclaw doctor && openclaw gateway restart && openclaw health`. Pre-update backup via `tar`. Weekly cadence recommended given CVE rate. | **High** | Whether the installer handles edge cases gracefully (interrupted updates, network failures). `openclaw doctor` handles deprecated config automatically. |
| 10 | What's the backup/recovery story? | `tar -czf backup.tar.gz ~/.openclaw` captures everything. Restore by extracting + `openclaw doctor`. Migration to new machine: copy state dir + workspace, run doctor. Backups contain API keys — treat as secrets. | **High** | Backup size growth over months of operation. Session transcripts may accumulate significantly. |

---

## Questions Resolved by Prior Research

### Q2: Instagram Posting (Task 6 — Social Media Skills)

Fully resolved. OpenClaw has no native Instagram skill. The recommended architecture splits content generation (Claude/OpenClaw) from content publishing (Zapier). Genviral skill exists as an alternative but introduces unnecessary risk for Jeff's security profile. Full analysis in `knowledge-base/05-skills-and-integrations/social-media-skills.md`.

### Q5: Instagram Rate Limiting (Task 6 — Social Media Skills)

Fully resolved. Instagram Content Publishing API allows 100 posts per 24-hour period. Jeff's target of 3-5 posts per week is trivially within limits. No restrictions on approved API posting via Graph API with proper credentials. Full details in `knowledge-base/05-skills-and-integrations/social-media-skills.md`.

### Q6: Sleep/Lid Closed (Task 4 — Feasibility)

Fully resolved. `sudo pmset -a disablesleep 1` prevents all sleep including lid close. Amphetamine app provides user-friendly toggling. macOS Battery settings alone are insufficient. Full analysis in `knowledge-base/04-deployment/macbook-air-feasibility.md`.

---

## Questions Newly Resolved

### Q1: RAM Under Sustained Workloads

Resolved with high confidence via ZeroClaw's production measurements (420-440 MB per bot instance) cross-referenced with OrbStack and Docker Desktop overhead data. Full analysis in `knowledge-base/06-community-intelligence/community-findings.md`, Topic 1.

### Q4: Brand Voice Without Fine-Tuning

Resolved with high confidence. OpenClaw provides SOUL.md, IDENTITY.md, USER.md, and HEARTBEAT.md bootstrap files injected into every agent turn. This is persistent prompt engineering — no fine-tuning needed. Standard approach across AI agent platforms. Full analysis in `knowledge-base/06-community-intelligence/community-findings.md`, Topic 3.

### Q8: Monthly API Cost

Resolved with high confidence. Jeff's social media use case costs $3-10/month in Claude API fees using Sonnet 4.6. Total monthly cost including subscriptions: $23-50/month. Full breakdown in `knowledge-base/06-community-intelligence/community-findings.md`, Topic 6.

### Q9: Safe Update Management

Resolved with high confidence. Official update process documented: backup → reinstall → doctor → restart. `openclaw doctor` handles deprecated config automatically. Weekly update cadence recommended given CVE rate. Full process in `knowledge-base/06-community-intelligence/community-findings.md`, Topic 7.

### Q10: Backup/Recovery

Resolved with high confidence. `tar` of `~/.openclaw` directory captures all state. Migration documented officially. Backups contain credentials — must be stored securely. Full process in `knowledge-base/06-community-intelligence/community-findings.md`, Topic 8.

---

## Unresolved Questions for Hands-On Testing

### Q1 (Partial): Long-Term Memory Behavior

**What research couldn't answer:** Exact RAM consumption after 7+ days of continuous operation on MacBook Air M4 specifically. Docker Desktop memory leak is documented, but OrbStack's long-term behavior on Apple Silicon with OpenClaw workloads has not been independently measured.

**How to resolve:** Monitor with `top` or Activity Monitor during Jeff's first week of operation. Check RAM consumption at day 1, day 3, and day 7. If memory grows beyond 10 GB total with OrbStack, investigate.

### Q3 (Partial): Content Generation Latency Under Load

**What research couldn't answer:** Whether latency degrades during sustained multi-draft sessions (e.g., Jeff batching 10 drafts in a row). The 1.2-second average is for single requests, not sustained batches.

**How to resolve:** Test during Jeff's first content creation session. If he notices delays, check if the Claude API is rate-limited (tier-dependent) or if OrbStack is resource-constrained.

**Practical impact:** Minimal. Even if latency doubles during batch sessions, 10-15 seconds per draft is acceptable for a workflow where Jeff reviews async. This is a "nice to know," not a blocker.

### Q7 (Deferred): Google Workspace Integration Reliability

**What research couldn't answer:** How reliable the Gmail Pub/Sub integration is for non-developer users in practice. The setup requires Google Cloud Console familiarity that Jeff doesn't have.

**How to resolve:** Defer to Phase 2 after Jeff has a stable OpenClaw deployment and social media workflow. The Gmail integration also introduces prompt injection risk (agent reading untrusted email content) that should be evaluated carefully before enabling.

---

## Cross-Reference Matrix

| Question | Answered In | KB Location |
|----------|------------|-------------|
| Q1 (RAM) | Task 4 + Task 8 | `04-deployment/macbook-air-feasibility.md`, `06-community-intelligence/community-findings.md` |
| Q2 (Instagram) | Task 6 | `05-skills-and-integrations/social-media-skills.md` |
| Q3 (Latency) | Task 8 | `06-community-intelligence/community-findings.md` |
| Q4 (Brand voice) | Task 8 | `06-community-intelligence/community-findings.md` |
| Q5 (Rate limiting) | Task 6 + Task 8 | `05-skills-and-integrations/social-media-skills.md`, `06-community-intelligence/community-findings.md` |
| Q6 (Sleep) | Task 4 | `04-deployment/macbook-air-feasibility.md` |
| Q7 (Google Workspace) | Task 8 | `06-community-intelligence/community-findings.md` |
| Q8 (API cost) | Task 8 | `06-community-intelligence/community-findings.md` |
| Q9 (Updates) | Task 8 | `06-community-intelligence/community-findings.md` |
| Q10 (Backup) | Task 8 | `06-community-intelligence/community-findings.md` |
