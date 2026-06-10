# 🔐 Privacy Policy

## Our Commitment

Lobster AI is designed with privacy as the core principle. **Your data is yours alone.**

## What We Collect

- **Chat History**: Stored only on your device in local SQLite database
- **User ID**: Per-platform identifier (Telegram ID, Discord ID, etc.)
- **Preferences**: Your settings stored locally
- **No Personal Data**: We don't collect names, emails, or personal information

## Where Data is Stored

```
📁 Your Device
  └── data/
      ├── lobster.db (chat history, preferences)
      └── whatsapp-session/ (WhatsApp authentication)
```

All data remains on your device. **Zero data is sent to external servers.**

## What We Don't Do

❌ **No Cloud Storage** - Data never leaves your device
❌ **No Tracking** - No user tracking or analytics
❌ **No Telemetry** - No information sent to Lobster servers
❌ **No Monetization** - Your data is never sold or used for profit
❌ **No Third Parties** - Data is never shared with third parties
❌ **No LLM Training** - Your conversations don't train the AI

## LLM Models

- **Ollama**: Open-source, runs locally on your device
- **LM Studio**: Runs locally on your device
- **No Model Updates**: Models are your responsibility to update
- **No Conversation Logging**: Your conversations don't leave your device

## Conversation Data

- **Retention**: Kept for 1000 messages by default (configurable)
- **Deletion**: Use `/clear` command to delete your conversation
- **Backup**: No automatic backups (you control your data)

## Security

- **Encryption**: Recommended to use full-disk encryption on your device
- **Network**: Works offline or on local network only
- **Authentication**: Each platform's auth is handled locally
- **Database**: SQLite with no remote access

## Your Rights

1. **Access**: View all your data in `./data/lobster.db`
2. **Deletion**: Delete anytime with `/clear` command
3. **Export**: Manual database export supported
4. **Control**: Full control over what data is stored

## Open Source

Lobster AI is open source. You can:
- Audit the code yourself
- Run your own modified version
- Fork and customize as needed
- Never worry about hidden behavior

## Data Deletion

### Delete Everything
```bash
rm -rf ./data/
rm .env
```

### Delete Specific User
```bash
# Via command in chat platform
/clear

# Or via direct database deletion
sqlite3 ./data/lobster.db "DELETE FROM messages WHERE userId='xxx'"
```

### Delete Chat Platform Sessions
```bash
rm -rf ./data/whatsapp-session/
```

## Compliance

- **GDPR**: Your data is yours - you have full control
- **Privacy Laws**: No data sharing means full compliance
- **Data Residency**: Data stays in your country (on your device)

## Third-Party Services

The following are **only used for authentication**, not data:

| Service | Usage | Data Shared |
|---------|-------|-------------|
| Telegram | Bot token validation | Only token (read-only) |
| Discord | Bot token validation | Only token (read-only) |
| Slack | OAuth token validation | Only token (read-only) |
| WhatsApp | Local session storage | None (local only) |

## LLM Provider Privacy

### Ollama
- Runs completely locally
- No data sent to any server
- Visit: https://ollama.ai

### LM Studio
- Runs completely locally
- No data sent to any server
- Visit: https://lmstudio.ai

## Updates

If we make privacy changes:
- You'll be notified in release notes
- Changes are opt-in by updating the code
- You maintain full control

## Contact

Privacy questions? Check:
- 📖 This policy
- 🔧 Source code on GitHub
- 💬 GitHub discussions

## Last Updated

June 10, 2026

---

**Remember**: This software is open source. You can always audit what's happening with your data.
