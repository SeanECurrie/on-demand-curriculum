# Operational Runbook — OpenClaw on Mac Mini

**Created:** 2026-02-11
**Status:** TEMPLATE — populate during/after deployment
**Target Platform:** Apple M4 Mac Mini (16GB RAM), macOS, Tailscale VPN configured

---

## Purpose

This is the operational playbook for the deployed OpenClaw instance. It covers:
- Service lifecycle (start/stop/restart/status)
- Access and authentication
- Updates and patching
- Skills management (add/remove/audit)
- Monitoring and health checks
- Backup and recovery
- Emergency procedures (STOP/REVOKE/ROTATE)
- Common troubleshooting

**This is a living document.** Populate sections during deployment. Update as operational patterns emerge.

---

## Service Management

### Check if Gateway is Running

**macOS (launchd):**
```bash
# Check launchd service status
launchctl list | grep openclaw

# Expected output if running:
# <PID>  0  com.openclaw.gateway

# Alternative: Check process directly
ps aux | grep openclaw

# Check logs for recent activity
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
# OR if custom log location configured:
tail -f ~/.openclaw/logs/openclaw.log
```

**Port check:**
```bash
# Gateway default port: 18789 (loopback-bound for security)
lsof -i :18789
# Should show openclaw process listening on 127.0.0.1:18789
```

---

### Start Gateway

```bash
# If installed as launchd LaunchAgent:
launchctl start com.openclaw.gateway

# Alternative (manual foreground for troubleshooting):
openclaw gateway start

# Verify startup:
curl -s http://127.0.0.1:18789/health
# Expected: {"status":"ok"} or similar health check response
```

---

### Stop Gateway

```bash
# Graceful shutdown via launchd:
launchctl stop com.openclaw.gateway

# Alternative (if running in foreground):
# Ctrl+C in terminal, or:
pkill -TERM -f "openclaw gateway"

# Verify shutdown:
lsof -i :18789
# Should return empty (port released)
```

---

### Restart Gateway

```bash
# Full restart:
launchctl stop com.openclaw.gateway && launchctl start com.openclaw.gateway

# Alternative (if config changes require reload):
openclaw gateway restart
```

**When to restart:**
- After config changes in `~/.openclaw/openclaw.json`
- After updating skills
- After OpenClaw version update
- After adding/removing auth profiles
- If memory usage grows unexpectedly (check via Activity Monitor or `top`)

---

### Reinstall launchd Service (if needed)

```bash
# Uninstall old service:
openclaw gateway uninstall

# Reinstall:
openclaw gateway install

# Verify:
launchctl list | grep openclaw
```

---

## Gateway Access

### Local Access (from Mac Mini itself)

**Default URL:** `http://127.0.0.1:18789`

**Auth token location:**
```bash
cat ~/.openclaw/auth-profiles.json
# Look for "token" field in default profile
```

**UI access (if enabled):**
```bash
open http://127.0.0.1:18789
# Paste auth token when prompted
```

---

### Remote Access (via Tailscale)

**Tailscale Serve setup** (recommended — keeps Gateway on loopback, Tailscale handles external access):
```bash
# Example (adjust port and hostname as needed):
tailscale serve --https=443 --set-path=/openclaw http://127.0.0.1:18789

# Access via Tailscale hostname:
# https://<mac-mini-tailscale-name>.<tailnet>.ts.net/openclaw
```

**Alternative: Tailscale Funnel** (if external access needed beyond tailnet):
```bash
# NOT RECOMMENDED for OpenClaw — exposes to public internet
# Only use if absolutely necessary and with strong gateway auth
```

**Auth via Tailscale identity headers:**
Check `openclaw.json` for:
```json5
{
  gateway: {
    auth: {
      mode: "tailscale-serve",  // Uses Tailscale-User-Login header for auth
      allowedUsers: ["sean@example.com"]  // Restrict to specific Tailscale users
    }
  }
}
```

---

## Updating OpenClaw

### Pre-Update Checklist

1. **Check current version:**
   ```bash
   openclaw --version
   npm list -g openclaw
   ```

2. **Read changelog FIRST:**
   - Context7: `query-docs` at docs.openclaw.ai/changelog
   - GitHub: https://github.com/openclaw/openclaw/releases
   - Look for: breaking changes, security fixes, macOS-specific notes, config format changes

3. **Backup config and data:**
   ```bash
   # Create timestamped backup:
   tar -czf ~/.openclaw-backup-$(date +%Y%m%d-%H%M%S).tar.gz ~/.openclaw/

   # Verify backup created:
   ls -lh ~/.openclaw-backup-*.tar.gz
   ```

4. **Check security advisories:**
   - Is this a security patch? (CVE-YYYY-NNNNN in release notes)
   - If yes, prioritize update (schedule within 24-48 hours)

5. **Review config changes:**
   - Did any config keys change format?
   - Are there new required fields?
   - Did default values change for security settings?

---

### Update Procedure

```bash
# Stop gateway:
launchctl stop com.openclaw.gateway

# Update OpenClaw:
npm update -g openclaw

# Alternative (if specific version needed):
npm install -g openclaw@2026.1.30

# Verify new version:
openclaw --version

# Check for config migrations:
openclaw doctor --non-interactive
# Review any warnings or errors

# Reinstall launchd service (if major version change):
openclaw gateway uninstall
openclaw gateway install

# Start gateway:
launchctl start com.openclaw.gateway

# Verify health:
curl -s http://127.0.0.1:18789/health
tail -n 50 /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
```

---

### Post-Update Validation

1. **Run security audit:**
   ```bash
   openclaw security audit
   # Review all findings, especially if new warnings appear
   ```

2. **Test basic functionality:**
   - Send a test message via configured channel (Telegram/WhatsApp)
   - Verify agent responds
   - Test a simple tool call (e.g., `/tools list`)

3. **Check session persistence:**
   ```bash
   # Verify sessions directory intact:
   ls -l ~/.openclaw/agents/main/sessions/
   # Should show existing session files
   ```

4. **Monitor for 24 hours:**
   - Check logs daily for errors
   - Watch for unexpected behavior
   - Monitor token usage (did pricing change?)

5. **Update CONTEXT.md:**
   - Note new version deployed
   - Document any config changes made
   - Flag any issues for investigation

---

## Adding/Removing Skills

### Security Vetting Process (MANDATORY for ANY new skill)

**DO NOT install skills from ClawHub or awesome-openclaw-skills directly.**

**Koi Security finding:** 12% of audited ClawHub skills (341/2857) are malicious (Tier 2)
**Academic research:** 26% of agent skills across LLM ecosystem contain vulnerabilities (arXiv:2601.10338, Tier 2)

**Instead: Build custom skills using vetted patterns.**

---

### Adding a Skill (Custom, Markdown-Based)

**Skills are NOT code — they are Markdown instructions with YAML frontmatter.**

1. **Create skill file:**
   ```bash
   mkdir -p ~/.openclaw/skills/<skill-name>/
   nano ~/.openclaw/skills/<skill-name>/SKILL.md
   ```

2. **Skill template:**
   ```markdown
   ---
   name: "Skill Name"
   description: "What this skill does"
   triggers:
     - "keyword phrase"
     - "another trigger"
   tools:
     - "allowed.tool.name"
     - "another.tool"
   ---

   # Skill Instructions

   When the user says [trigger phrase], you should:
   1. Step one
   2. Step two
   3. Return result in this format

   ## Examples
   [Provide clear examples of usage]

   ## Constraints
   - Never do X
   - Always verify Y before proceeding
   ```

3. **Enable skill in config:**
   ```bash
   nano ~/.openclaw/openclaw.json
   ```

   Add to `skills.entries`:
   ```json5
   {
     skills: {
       entries: {
         "custom-skill-name": {
           enabled: true,
           path: "~/.openclaw/skills/<skill-name>/"
         }
       }
     }
   }
   ```

4. **Restart gateway:**
   ```bash
   launchctl stop com.openclaw.gateway && launchctl start com.openclaw.gateway
   ```

5. **Test skill:**
   - Send trigger phrase via channel
   - Verify agent recognizes and executes skill
   - Check logs for any errors
   - Verify tool usage matches expectations

---

### Disabling a Skill

**Temporary disable:**
```json5
{
  skills: {
    entries: {
      "skill-name": {
        enabled: false  // Keeps config, disables skill
      }
    }
  }
}
```

**Permanent removal:**
```bash
# Remove from config (delete entry from skills.entries)
nano ~/.openclaw/openclaw.json

# Optional: Remove skill files
rm -rf ~/.openclaw/skills/<skill-name>/
```

**Restart gateway after changes.**

---

### Bundled Skills Management

**OpenClaw ships with 53 bundled skills.** By default, ALL are enabled = ~1,300 extra tokens per agent turn.

**Cost control:**
```json5
{
  skills: {
    allowBundled: ["web-search", "gmail", "calendar"],  // Whitelist only
    // OR disable specific ones:
    entries: {
      "bundled-skill-name": { enabled: false }
    }
  }
}
```

**Check bundled skills list:**
```bash
openclaw skills list --bundled
```

---

## Monitoring

### Log Locations

**Default log path:**
```bash
/tmp/openclaw/openclaw-YYYY-MM-DD.log
```

**Custom log path (if configured):**
```json5
{
  logging: {
    file: "~/.openclaw/logs/openclaw.log"
  }
}
```

**View logs:**
```bash
# Real-time tail:
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# Search for errors:
grep -i "error\|warn\|fail" /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# View specific agent logs:
cat ~/.openclaw/agents/<agent-id>/sessions/*.jsonl | jq
```

---

### What to Check Daily

**First 2 weeks after deployment:**
- Gateway still running? (`launchctl list | grep openclaw`)
- Any errors in logs? (`grep -i error /tmp/openclaw/*.log`)
- Token usage tracking (set up alerts if usage spikes)
- Unexpected tool calls or commands executed?
- macOS permission dialogs appearing? (Keychain, TCC)

**After stable (weekly checks):**
- OpenClaw version current? (`npm outdated -g openclaw`)
- Any new CVEs? (weekly security sweep)
- Disk usage for session storage growing unexpectedly?
  ```bash
  du -sh ~/.openclaw/agents/*/sessions/
  ```
- Backup successful? (Time Machine or manual backup script)

---

### Signs of Problems

| Symptom | Possible Cause | Investigation |
|---------|---------------|---------------|
| Gateway not responding | Process crashed, port conflict, config error | Check `launchctl list`, check logs, verify port 18789 free |
| "U" streaming output | Response truncated, streaming issue | Run `openclaw doctor --non-interactive` |
| Context length exceeded | Workspace files too large, session history too long | Reduce files in workspace, clear old session history |
| High token usage | Heartbeat too frequent, bundled skills enabled, long sessions | Check heartbeat interval, disable unused skills, review session limits |
| Permission dialogs (macOS) | TCC requests, Keychain access attempts | Review what triggered dialog, deny by default, check tool policy |
| Unexpected commands executed | Prompt injection, skill misconfiguration | Check session logs, review exec-approvals, audit skills |
| Browser tool crashes | Known instability issue | Disable browser tool, use alternative approach |
| Model API errors | Invalid API key, rate limit, model deprecated | Check auth-profiles.json, review API provider status |

---

### Token Usage Tracking

**Setup:**
1. Enable logging of LLM calls:
   ```json5
   {
     logging: {
       logEvents: true,
       logLLMCalls: true
     }
   }
   ```

2. Track via provider dashboards:
   - Anthropic Console: https://console.anthropic.com/usage
   - OpenAI Dashboard: https://platform.openai.com/usage
   - OpenRouter Dashboard: https://openrouter.ai/activity

3. Set budget alerts:
   - Configure billing alerts at provider level
   - Monthly budget threshold recommendation: Set alert at 80% of expected cost

**Cost optimization:**
- Use cheaper models for routine tasks (Sonnet for chat, Opus for deep work)
- Disable unused bundled skills
- Keep HEARTBEAT.md concise
- Use Lobster workflows for deterministic automation (no LLM cost)

---

## Backup & Recovery

### What to Back Up

**Critical paths:**
```
~/.openclaw/openclaw.json            # Main config
~/.openclaw/auth-profiles.json       # Credentials (SENSITIVE)
~/.openclaw/credentials/             # OAuth tokens, API keys (SENSITIVE)
~/.openclaw/agents/*/SOUL.md         # Agent personality/identity
~/.openclaw/agents/*/IDENTITY.md     # Agent context
~/.openclaw/agents/*/USER.md         # User profile
~/.openclaw/agents/*/sessions/       # Session history (OPTIONAL — can be large)
~/.openclaw/skills/                  # Custom skills
~/.openclaw/cron/                    # Scheduled jobs
```

**NOT needed (can be regenerated):**
```
~/.openclaw/node_modules/            # Dependencies (npm install regenerates)
/tmp/openclaw/                       # Temporary logs
```

---

### Backup Methods

**Method 1: Time Machine (macOS built-in)**
```bash
# Enable Time Machine for entire Mac Mini
# Ensure ~/.openclaw/ is NOT excluded

# Verify in Time Machine preferences:
# System Settings > General > Time Machine
# Check that "Back up all disks" is enabled OR ~/.openclaw/ is explicitly included

# IMPORTANT: Time Machine backups should be ENCRYPTED (contains credentials)
# System Settings > General > Time Machine > Options > Encrypt backups
```

**Method 2: Manual backup script**
```bash
#!/bin/bash
# ~/scripts/backup-openclaw.sh

BACKUP_DIR="$HOME/backups/openclaw"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/openclaw-backup-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

# Create encrypted backup:
tar -czf - ~/.openclaw/ | openssl enc -aes-256-cbc -salt -out "$BACKUP_FILE"

# Prompt for encryption password
echo "Backup created: $BACKUP_FILE"
echo "ENCRYPTED — password required for restore"

# Optional: Copy to external drive or cloud storage
# rclone copy "$BACKUP_FILE" remote:openclaw-backups/
```

**Schedule via cron:**
```bash
# Weekly backup at 2 AM Sunday
0 2 * * 0 ~/scripts/backup-openclaw.sh
```

---

### Config-as-Code (Git Backup)

**DO track in git (this repo or separate config repo):**
- `openclaw.json` (with secrets removed/templated)
- `agents/*/SOUL.md`, `IDENTITY.md`, `USER.md`
- Custom skills (`skills/*/SKILL.md`)
- Backup scripts

**DO NOT track in git:**
- `auth-profiles.json` (contains API keys)
- `credentials/` directory
- Session transcripts (contains conversation history)

**Template approach:**
```bash
# Create template config with placeholders:
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.template

# Replace secrets with placeholders:
sed -i '' 's/"apiKey": "sk-.*"/"apiKey": "ANTHROPIC_API_KEY_HERE"/g' ~/.openclaw/openclaw.json.template

# Commit template to git
git add ~/.openclaw/openclaw.json.template
git commit -m "config: update OpenClaw config template"
```

---

### Recovery Procedure

**Scenario 1: Config corruption, Gateway won't start**
```bash
# Stop Gateway:
launchctl stop com.openclaw.gateway

# Restore from latest backup:
# If Time Machine:
# Use Time Machine browser to restore ~/.openclaw/openclaw.json

# If manual backup:
tar -xzf ~/backups/openclaw/openclaw-backup-YYYYMMDD-HHMMSS.tar.gz -C /

# Verify config syntax:
openclaw doctor --non-interactive

# Restart:
launchctl start com.openclaw.gateway
```

**Scenario 2: Complete Mac Mini failure, restore to new hardware**
```bash
# Fresh macOS install on new Mac Mini
# Install Node.js 22+:
brew install node@22

# Install OpenClaw:
npm install -g openclaw@<version>

# Restore from backup:
# If Time Machine: Restore entire ~/.openclaw/ directory
# If manual backup: Extract tar.gz to ~/

# Reinstall launchd service:
openclaw gateway install

# Start Gateway:
launchctl start com.openclaw.gateway

# Verify:
openclaw security audit
curl -s http://127.0.0.1:18789/health
```

**Scenario 3: Credential compromise**
```bash
# STOP Gateway immediately:
launchctl stop com.openclaw.gateway

# Rotate ALL credentials:
# - Anthropic API key: console.anthropic.com
# - OpenAI API key: platform.openai.com
# - Channel tokens (Telegram, WhatsApp, etc.)
# - Gateway auth token

# Update auth-profiles.json with new credentials:
nano ~/.openclaw/auth-profiles.json

# Review session logs for unauthorized access:
grep -r "unexpected" ~/.openclaw/agents/*/sessions/

# Restart with new credentials:
launchctl start com.openclaw.gateway

# Document incident in intelligence-log.md
```

---

## Emergency Procedures

### STOP — Immediate Shutdown

**When to use:** Agent going rogue, unexpected commands executing, security incident suspected

```bash
# Kill Gateway process immediately:
launchctl stop com.openclaw.gateway
pkill -9 -f "openclaw gateway"

# Verify shutdown:
ps aux | grep openclaw  # Should return empty
lsof -i :18789          # Should return empty (port released)

# Disable auto-restart:
launchctl unload ~/Library/LaunchAgents/com.openclaw.gateway.plist
```

**Do NOT restart until root cause identified.**

---

### REVOKE — Remove All Access

**When to use:** Credentials compromised, unauthorized access detected, prolonged shutdown needed

```bash
# Stop Gateway (see STOP procedure above)

# Revoke API keys at provider level:
# - Anthropic: console.anthropic.com > Settings > API Keys > Delete
# - OpenAI: platform.openai.com > API Keys > Delete
# - OpenRouter: openrouter.ai/keys > Revoke

# Revoke channel access:
# - Telegram: BotFather > /revoke
# - WhatsApp: Revoke access token via WhatsApp Business API
# - Discord: Developer Portal > Bot > Reset Token

# Disable Tailscale access (if remote access was via Tailscale):
tailscale down
# OR revoke device from Tailscale admin panel

# Document what happened:
echo "$(date): REVOKE executed — [reason]" >> ~/.openclaw/incident-log.txt
```

**Recovery requires full credential rotation and security audit.**

---

### ROTATE — Credential Rotation

**When to use:** Scheduled rotation (quarterly recommended), post-incident, credential exposure suspected

**Rotation checklist:**
- [ ] Generate new API keys at provider level
- [ ] Update `auth-profiles.json` with new keys
- [ ] Rotate Gateway auth token
- [ ] Rotate channel access tokens (Telegram, WhatsApp, etc.)
- [ ] Update Tailscale auth (if applicable)
- [ ] Test access with new credentials
- [ ] Delete old credentials from providers
- [ ] Document rotation in activity-log.md

**Script template:**
```bash
#!/bin/bash
# ~/scripts/rotate-credentials.sh

echo "OpenClaw Credential Rotation"
echo "============================"
echo ""
echo "1. Stop Gateway"
launchctl stop com.openclaw.gateway

echo "2. Backup current credentials"
cp ~/.openclaw/auth-profiles.json ~/.openclaw/auth-profiles.json.backup-$(date +%Y%m%d)

echo "3. Manual steps required:"
echo "   - Generate new Anthropic API key: console.anthropic.com"
echo "   - Generate new OpenAI API key (if used): platform.openai.com"
echo "   - Regenerate Gateway auth token: openclaw gateway --reset-token"
echo "   - Update Telegram bot token (if used): BotFather /newtoken"
echo ""
read -p "Press Enter when new credentials are ready..."

echo "4. Update auth-profiles.json"
nano ~/.openclaw/auth-profiles.json

echo "5. Restart Gateway"
launchctl start com.openclaw.gateway

echo "6. Test health"
sleep 3
curl -s http://127.0.0.1:18789/health

echo ""
echo "7. Document rotation"
echo "$(date): Credential rotation completed" >> ~/.openclaw/rotation-log.txt
```

---

### INCIDENT RESPONSE — Full Procedure

**Steps:**
1. **CONTAIN** — Execute STOP procedure
2. **FREEZE** — Do not modify any files; preserve logs for analysis
3. **ROTATE** — Execute ROTATE procedure for all credentials
4. **AUDIT** — Investigate what happened
   ```bash
   # Review session logs for timeframe:
   grep -r "timestamp" ~/.openclaw/agents/*/sessions/*.jsonl

   # Check executed commands:
   grep -i "system.run\|exec\|shell" ~/.openclaw/agents/*/sessions/*.jsonl

   # Review Gateway logs:
   grep -i "error\|unauthorized\|failed" /tmp/openclaw/*.log
   ```
5. **DOCUMENT** — Write incident report
   - What happened (timeline)
   - Root cause (if determined)
   - What was compromised
   - Mitigation actions taken
   - Preventive measures for future
6. **RECOVER** — Only restart after full audit and hardening review
7. **REPORT** — If vulnerability found, report to openclaw/openclaw GitHub

**Store incident reports:** `~/.openclaw/incidents/YYYY-MM-DD-incident-name.md`

---

## Troubleshooting

### Common Issues

**Issue: Streaming "U" output (response truncated)**

**Symptoms:** Agent responses end with just "U" character, incomplete output

**Fix:**
```bash
openclaw doctor --non-interactive
# This runs diagnostics and attempts auto-fix
```

**Source:** Community (Tier 4), validated by Context7 official troubleshooting

---

**Issue: Context length exceeded**

**Symptoms:** Error message "context length exceeded", agent fails to respond

**Causes:**
- Workspace files too large (large codebases, binary files)
- Session history too long (accumulated over many turns)
- Bundled skills adding too many tokens

**Fix:**
```bash
# 1. Update to latest OpenClaw (may have higher context limits):
npm update -g openclaw

# 2. Clear workspace or reduce file sizes:
# Review what's in workspace:
ls -lh ~/.openclaw/agents/*/workspace/
# Remove large/unnecessary files

# 3. Clear old session history (CAUTION: loses conversation memory):
rm ~/.openclaw/agents/*/sessions/*.jsonl
# OR move to archive:
mkdir -p ~/.openclaw/archive/sessions-$(date +%Y%m%d)
mv ~/.openclaw/agents/*/sessions/*.jsonl ~/.openclaw/archive/sessions-$(date +%Y%m%d)/

# 4. Disable unused bundled skills (see Skills Management section)
```

**Source:** Community (Tier 5), Context7 troubleshooting

---

**Issue: Browser tool instability**

**Symptoms:** Browser tool crashes, hangs, or produces errors

**Status:** Known issue per community reports (Tier 3/5)

**Workaround:**
```json5
{
  agents: {
    defaults: {
      tools: {
        deny: ["browser.*"]  // Disable browser tools
      }
    }
  }
}
```

**Alternative:** Use web scraping skills or external tools instead of built-in browser

**Source:** Community (Tier 3-5)

---

**Issue: macOS Keychain permission dialogs**

**Symptoms:** macOS prompts for Keychain access, unexpected permission dialogs

**Investigation:**
1. What triggered the dialog? (check logs immediately before dialog appeared)
2. Is `system.run` tool enabled? (can execute commands that access Keychain)
3. Is agent attempting credential operations?

**Mitigation:**
```json5
{
  agents: {
    defaults: {
      sandbox: {
        commandDeny: [
          "security",      // macOS Keychain CLI
          "keychain",
          "*password*"
        ]
      }
    }
  }
}
```

**Assessment:** NOT a hard deployment blocker per intelligence-log.md analysis (entry 2026-02-11)

**Source:** Community (Tier 4), mitigated per KB analysis (Tier 1-3)

---

**Issue: Gateway won't start after config change**

**Symptoms:** `launchctl start` fails, Gateway process doesn't appear

**Investigation:**
```bash
# Check Gateway logs for config errors:
tail -n 100 /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# Validate JSON syntax:
python3 -m json.tool ~/.openclaw/openclaw.json
# Should output formatted JSON if valid, error if syntax broken

# Run diagnostics:
openclaw doctor --non-interactive
```

**Common causes:**
- JSON syntax error (trailing comma, missing quote, invalid escape)
- Invalid config value (unknown key, wrong type)
- File permissions (config file not readable)

**Fix:**
```bash
# Restore from backup:
cp ~/.openclaw/openclaw.json.backup ~/.openclaw/openclaw.json

# OR fix syntax error identified in logs

# Retry start:
launchctl start com.openclaw.gateway
```

---

**Issue: Model API errors ("invalid beta flag", rate limit, auth failure)**

**Symptoms:** Agent fails to respond, logs show LLM provider errors

**Investigation:**
1. Check API key validity:
   ```bash
   # Anthropic:
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":1024,"messages":[{"role":"user","content":"test"}]}'

   # OpenAI:
   curl https://api.openai.com/v1/chat/completions \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}]}'
   ```

2. Check rate limits at provider dashboard
3. Verify model name is current (models get deprecated)

**Common fixes:**
- Update to latest OpenClaw version (API version mismatch)
- Regenerate API key
- Switch to different model if deprecated
- Wait if rate limited (or upgrade API tier)

**Source:** Community (Tier 5)

---

### When to Check Logs

| Scenario | What to Look For | Command |
|----------|-----------------|---------|
| Agent not responding | Errors, API failures, config issues | `grep -i "error" /tmp/openclaw/*.log` |
| Unexpected behavior | Tool calls, command execution, prompt injections | `grep -i "system.run\|exec" ~/.openclaw/agents/*/sessions/*.jsonl` |
| High token usage | LLM call frequency, large context windows | `grep -i "llm.*tokens" /tmp/openclaw/*.log` |
| After update | Startup errors, deprecated config warnings | `tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log` during restart |
| Performance issues | Memory usage, sub-agent spawn rate, concurrency limits | `grep -i "memory\|subagent\|concurrent" /tmp/openclaw/*.log` |

---

## Appendix: Quick Reference Commands

```bash
# Service management
launchctl list | grep openclaw          # Check if running
launchctl start com.openclaw.gateway   # Start
launchctl stop com.openclaw.gateway    # Stop
lsof -i :18789                          # Check port

# Version & updates
openclaw --version                      # Current version
npm outdated -g openclaw                # Check for updates
npm update -g openclaw                  # Update

# Health checks
curl -s http://127.0.0.1:18789/health   # Gateway health
openclaw doctor --non-interactive       # Diagnostics
openclaw security audit                 # Security scan

# Logs
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log  # Real-time logs
grep -i error /tmp/openclaw/*.log                     # Find errors

# Backup
tar -czf ~/.openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/  # Backup

# Config validation
python3 -m json.tool ~/.openclaw/openclaw.json       # Validate JSON
```

---

## Notes for Future Population

**During deployment, add:**
- Actual Tailscale hostname and access URL
- Specific channel configuration (Telegram bot token location, WhatsApp setup)
- Actual log paths if different from defaults
- Custom monitoring scripts or dashboards
- Specific model routing configuration
- Token cost tracking baseline (expected monthly cost)
- Time Machine backup schedule (if used)
- UPS configuration (if added for disaster recovery)

**During operation, add:**
- Patterns extracted from troubleshooting sessions
- Optimizations discovered (e.g., heartbeat tuning, skill combinations)
- Integration points with other tools (n8n webhooks, etc.)
- Performance baselines (normal memory usage, typical response times)

**This runbook should grow with operational experience. It's a living document.**
