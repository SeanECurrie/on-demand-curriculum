# Session State — ClawdBot Research Project

**Last Updated:** 2026-02-22
**Last Session Summary:** Phase 0 overhaul completed — added practical DevHub prep steps (connectivity check, macOS updates, revised iCloud guidance). Session restart skill created. All research phases (1-3) complete. Deployment walkthrough ready for execution.

## Walkthrough Progress

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Machine Preparation | not_started | Overhauled 2026-02-22 — now includes connectivity check, macOS updates, revised iCloud approach. Ready when Sean is. |
| A | macOS Hardening | not_started | |
| B | Runtime Setup | not_started | |
| C | OpenClaw Installation | not_started | Deploy version >= 2026.2.19 |
| D | Security Hardening | not_started | Evaluate SecureClaw (adversa-ai/secureclaw) during this phase |
| E | Model Configuration | not_started | |
| F | Channel Setup | not_started | |
| G | Starter Skills & First Run | not_started | Zero ClawHub policy — custom Markdown skills only |
| H | Validation | not_started | |
| I | Post-Deployment | not_started | |

Status values: not_started | in_progress | completed | blocked | deferred

## Current Focus

**Active task:** None — waiting for Sean to kick off Phase 0 (machine prep)
**Phase step:** Pre-deployment. All research and documentation complete.
**Blockers:** None — walkthrough is ready, DevHub is accessible (Universal Control restored 2026-02-21)

## Next Up

1. Begin Phase 0 — Machine Preparation on DevHub (Tailscale SSH, caffeinate, macOS updates, identity isolation, software audit/cleanup)
2. Phase A — macOS Hardening (dedicated service user, firewall, energy settings)
3. Phase B — Runtime Setup (Homebrew, Docker, Node.js verification)

## Session History (Last 5)

| Date | What Happened | Outcome |
|------|--------------|---------|
| 2026-02-22 | Phase 0 overhaul + session restart skill creation | Walkthrough Phase 0 expanded with practical DevHub prep (connectivity, updates, revised iCloud). Deployment plan deduplicated. Crib sheet aligned. Skill created at skills/session-restart/. |
| 2026-02-22 | Staleness sweep + purpose refinement + doc updates | 8 ecosystem changes tracked. All 6 operational docs updated. Purpose refined: learning lab framing. CLAUDE.md rewritten. |
| 2026-02-21 | DevHub Universal Control debugging | Root cause: aborted Recovery Mode put iCloud in zombie state. Fix: Apple Account re-auth. Network details documented. |
| 2026-02-14 | Phase 0 initial creation + Phase A/B adjustments | Phase 0 added to walkthrough for existing Mac Mini prep. |
| 2026-02-11 | Full research project completed + walkthrough written | All 3 research phases done. 7 KB buckets populated. 5 reports. 1,970-line deployment walkthrough. |

## Decisions Made This Phase

- Deploy version >= 2026.2.19 (not 2026.1.29) — 4 additional CVEs discovered post-original research
- No full wipe of DevHub — targeted Phase 0 prep instead
- iCloud: disable sync services individually, don't sign out of Apple ID (prevents system lockout)
- Evaluate SecureClaw during Phase G security hardening
- Zero ClawHub skills policy even more critical — malicious skills grew from 12% to ~20%

## Notes for Next Session

- DevHub is accessible via Tailscale SSH and has Universal Control working
- Phase 0 starts with `tailscale ping devhub` and `caffeinate -d &`
- Check if any macOS updates are pending on DevHub (`softwareupdate --list`)
- Sean may want to jump to experimentation faster — essential hardening is non-negotiable, operational polish can be deferred
- HDMI dummy plug may be needed if running headless — check if Sean has one
