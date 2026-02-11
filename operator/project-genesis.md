# Project Genesis — Why This Exists

**Created:** 2026-02-10
**Source:** Initial brainstorming session

---

## Sean's Stated Goals

1. **Persistent knowledge system** — Not a one-time setup guide. A living intelligence system that stays current as ClawdBot/OpenClaw evolves, new tools emerge, and best practices shift.

2. **Informed deployment** — Deploy ClawdBot on a dedicated M4 Mac Mini, but do it with intention, research-backed decisions, and the best current practices within his capabilities. Not rushing to set up — understanding first.

3. **Professional skill-building** — Master this new technology space (autonomous AI agents) as an addition to professional skills. Sean is adjacent and involved in the AI tooling world and wants deep competency, not surface familiarity.

4. **Multi-use-case exploration** — Personal productivity, professional work augmentation, and understanding the full capability landscape before committing to specific use cases.

5. **Education-first** — Build expertise to teach himself first, potentially create content later.

6. **Continuous currency** — The knowledge base must stay agile and current. Documentation alone isn't enough — community intelligence (Reddit, YouTube, developer blogs) catches what docs miss.

---

## What This Project Is NOT

- Not a one-time setup guide that goes stale
- Not a copy of someone else's tutorial
- Not limited to ClawdBot — it's aware of the full landscape
- Not documentation-only — community intelligence is equally weighted
- Not a static repo — it's a living system that accumulates knowledge

---

## Key Decisions Made During Brainstorming

### Hardware: M4 Mac Mini (16GB)
- Sean already owns dedicated hardware
- Tailscale VPN already configured between devices
- SSH already working between machines
- Tim's video argued VPS > Mac Mini, but Sean's situation differs:
  - He already owns the hardware (cost argument moot)
  - Tailscale solves the "open home network" concern
  - Physical security risk accepted for the tradeoff of full local control
  - Research will still evaluate VPS as a complement/alternative

### Architecture: Adapted salesenablementengine Pattern
- CLAUDE.md constitution (leaner, focused on research/deployment)
- 7-bucket knowledge base (adapted from client engagement to tech research)
- CONTEXT.md session continuity protocol
- Dual-layer logging (activity + intelligence)
- Pattern extraction discipline
- Progressive disclosure

### Research Methodology: Dual-Source Intelligence
- **Context7** = official truth (documentation, APIs, configuration)
- **Bright Data** = community truth (Reddit, YouTube, GitHub, developer blogs)
- Cross-validation between sources — contradictions are flagged as intelligence insights
- Source credibility tiers (1-5, from official docs to general sentiment)

### Skill Chain: Superpowers Workflow
1. brainstorming (current) → design document
2. writing-plans → detailed implementation plan
3. competitive-research-brightdata → Phase 1 landscape research
4. executing-plans → execution with review checkpoints
5. verification-before-completion → validates each phase
6. Other skills as relevant (systematic-debugging, etc.)

---

## Inspirational Source: Tech With Tim Video

Sean identified a trusted creator (Tech With Tim) whose comprehensive ClawdBot setup guide provided initial context. The video covers VPS setup with Hostinger, Tailscale VPN tunneling, SSH hardening, ClawdBot installation, Telegram integration, firewall configuration, gateway UI tunneling, skills configuration, prompt injection awareness, and LLM usage safeguarding.

**Key takeaways Sean valued from the video:**
- Security-first mindset (not running on home computer, VPN tunneling, IP restrictions)
- Don't trust 5-minute guides from people who've never written code
- Separate accounts for bot connections (sandboxing)
- Prompt injection as a real attack vector via email/external inputs
- API spending limits as a safety net
- The bot can modify its own configuration

**Where this project goes further:**
- Independent verification of Tim's security recommendations
- Competitive landscape analysis Tim didn't cover
- Mac Mini deployment path Tim dismissed but which fits Sean's situation
- Community intelligence beyond a single creator's perspective
- Living knowledge system vs. point-in-time video guide
