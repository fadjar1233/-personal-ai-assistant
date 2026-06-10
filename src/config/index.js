/**
 * Configuration management
 * Loads and validates all configuration from environment
 */

const path = require('path');

const config = {
  // Core
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // LLM Configuration
  llm: {
    provider: process.env.LLM_PROVIDER || 'ollama',
    timeout: parseInt(process.env.OLLAMA_TIMEOUT || '30000'),
    
    ollama: {
      url: process.env.OLLAMA_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'mistral'
    },
    
    lmstudio: {
      url: process.env.LMSTUDIO_URL || 'http://localhost:1234'
    }
  },
  
  // Voice Configuration
  voice: {
    enabled: process.env.VOICE_ENABLED !== 'false',
    whisperModel: process.env.WHISPER_MODEL || 'base',
    ttsProvider: process.env.TTS_PROVIDER || 'local'
  },
  
  // Database
  database: {
    path: process.env.DB_PATH || './data/lobster.db'
  },
  
  // Chat Integrations
  integrations: {
    telegram: {
      enabled: process.env.TELEGRAM_ENABLED === 'true',
      token: process.env.TELEGRAM_TOKEN
    },
    
    discord: {
      enabled: process.env.DISCORD_ENABLED === 'true',
      token: process.env.DISCORD_TOKEN
    },
    
    slack: {
      enabled: process.env.SLACK_ENABLED === 'true',
      botToken: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET
    },
    
    whatsapp: {
      enabled: process.env.WHATSAPP_ENABLED === 'true',
      sessionPath: process.env.WHATSAPP_SESSION_PATH || './data/whatsapp-session'
    }
  },
  
  // Privacy & Security
  privacy: {
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    enableTelemetry: process.env.ENABLE_TELEMETRY === 'true',
    allowRemoteAccess: process.env.ALLOW_REMOTE_ACCESS === 'true',
    maxMessageHistory: parseInt(process.env.MAX_MESSAGE_HISTORY || '1000')
  },
  
  // Personality
  personality: {
    name: process.env.PERSONALITY_NAME || 'Lobster',
    quirkyMode: process.env.PERSONALITY_QUIRKY_MODE !== 'false'
  }
};

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];
  
  // Validate LLM provider
  if (!['ollama', 'lmstudio'].includes(config.llm.provider)) {
    errors.push('Invalid LLM_PROVIDER. Must be "ollama" or "lmstudio"');
  }
  
  // Validate at least one integration is enabled
  const hasIntegration = Object.values(config.integrations).some(i => i.enabled);
  if (!hasIntegration) {
    errors.push('At least one chat integration must be enabled');
  }
  
  // Validate required tokens
  if (config.integrations.telegram.enabled && !config.integrations.telegram.token) {
    errors.push('TELEGRAM_TOKEN is required when TELEGRAM_ENABLED=true');
  }
  
  if (config.integrations.discord.enabled && !config.integrations.discord.token) {
    errors.push('DISCORD_TOKEN is required when DISCORD_ENABLED=true');
  }
  
  if (config.integrations.slack.enabled && 
      (!config.integrations.slack.botToken || !config.integrations.slack.signingSecret)) {
    errors.push('SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET are required when SLACK_ENABLED=true');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get validation result
 */
const validation = validateConfig();

if (!validation.valid) {
  console.error('\n❌ Configuration Error:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
  console.error('\nPlease check your .env file\n');
}

module.exports = config;
module.exports.validate = validateConfig;