# 🦞 Lobster AI - Personal Local Assistant

Your private, always-on AI companion that lives on your devices. Chat with it through WhatsApp, Discord, Telegram, Slack, and via voice on iOS/Android. Everything stays local. Everything stays yours.

## ✨ Features

- **100% Private & Local** - All processing happens on your devices, no data sent to cloud services
- **Multi-Platform Chat Integration** - Talk to Lobster via WhatsApp, Discord, Telegram, and Slack
- **Voice Support** - Speak to your assistant on iPhone and Android
- **Always Ready** - Runs in the background, responds instantly
- **Quirky Personality** - A lobster friend with character and charm
- **Simple Setup** - One command to connect all your accounts
- **Cross-Device Sync** - Continue conversations across your devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Python 3.11+
- Docker (optional but recommended)
- 4GB+ RAM available
- 10GB+ free disk space

### Installation

```bash
# Clone the repository
git clone https://github.com/fadjar1233/personal-ai-assistant.git
cd personal-ai-assistant

# Run the guided setup
npm run setup
# or
python setup.py
```

The setup wizard will guide you through:
1. Selecting local LLM models (Ollama, LM Studio)
2. Connecting to chat platforms
3. Configuring voice on mobile
4. Testing your setup

## 📱 Supported Platforms

### Chat Apps
- **WhatsApp** - Message your assistant as a contact
- **Discord** - Invite to servers or use DMs
- **Telegram** - Create a bot that runs locally
- **Slack** - Install as a workspace app

### Voice
- **iPhone** - Native voice integration + Siri shortcuts
- **Android** - Voice assistant integration + Google Assistant actions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│         Lobster Core (Your Device)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │ Local LLM    │  │ Voice Engine │  │ Memory/DB    │
│  │ (Ollama)     │  │ (Whisper)    │  │ (Local)      │
│  └──────────────┘  └──────────────┘  └──────────────┘
└─────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
    ┌────┴────────────────────┼────────────────────┴─────┐
    │                         │                          │
┌───▼────┐  ┌────▼──┐  ┌─────▼──┐  ┌────────┐  ┌────────┐
│WhatsApp│  │Discord│  │Telegram│  │ Slack  │  │ Voice  │
└────────┘  └───────┘  └────────┘  └────────┘  └────────┘
```

## 🦞 Personality

Lobster is:
- **Helpful** - Always ready with practical advice
- **Quirky** - A bit of crustacean charm
- **Witty** - Loves a good shellfish pun
- **Respectful** - Knows when to be serious
- **Independent** - Doesn't need the cloud

## 📚 Documentation

- [Installation Guide](./docs/installation.md)
- [Configuration](./docs/configuration.md)
- [Chat Integration Setup](./docs/chat-integration.md)
- [Voice Setup](./docs/voice-setup.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Privacy Policy](./docs/privacy.md)

## 🔧 System Requirements

### Minimum
- CPU: Dual-core 2.5 GHz
- RAM: 4GB
- Storage: 10GB SSD
- Network: Local network only (no internet required)

### Recommended
- CPU: Quad-core 3.0 GHz+
- RAM: 8GB+
- Storage: 20GB+ SSD
- GPU: Optional (NVIDIA/AMD for faster inference)

## 🛠️ Development

```bash
# Install dependencies
npm install
# or
pip install -r requirements.txt

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 🤝 Contributing

We love contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

## 🔐 Privacy First

Your data is yours. Here's what we do:
- ✅ All processing local to your device
- ✅ No accounts created or tracking
- ✅ No telemetry or analytics
- ✅ Chat history stored only locally
- ✅ Voice data processed on-device
- ✅ Open source - audit everything

## 🚨 Support

- 📖 [Documentation](./docs)
- 💬 [Discussions](https://github.com/fadjar1233/personal-ai-assistant/discussions)
- 🐛 [Report Issues](https://github.com/fadjar1233/personal-ai-assistant/issues)

---

**Made with 🦞 for your privacy**