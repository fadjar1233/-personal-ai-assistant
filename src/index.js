#!/usr/bin/env node

/**
 * 🦞 Lobster AI - Personal Local Assistant
 * Main entry point
 */

const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const config = require('./config');
const LobsterCore = require('./core/lobster');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

let lobsterCore;

/**
 * Initialize Lobster AI
 */
async function initialize() {
  try {
    logger.info('🦞 Initializing Lobster AI...');
    
    // Verify LLM connection
    logger.info(`Connecting to ${config.llm.provider}...`);
    
    // Initialize core system
    lobsterCore = new LobsterCore(config);
    await lobsterCore.initialize();
    
    logger.success('✅ Lobster Core initialized');
    
    // Initialize chat integrations
    if (config.integrations.telegram.enabled) {
      logger.info('🤖 Loading Telegram integration...');
      const TelegramAdapter = require('./adapters/telegram');
      new TelegramAdapter(lobsterCore);
    }
    
    if (config.integrations.discord.enabled) {
      logger.info('💜 Loading Discord integration...');
      const DiscordAdapter = require('./adapters/discord');
      new DiscordAdapter(lobsterCore);
    }
    
    if (config.integrations.slack.enabled) {
      logger.info('⚫ Loading Slack integration...');
      const SlackAdapter = require('./adapters/slack');
      new SlackAdapter(lobsterCore);
    }
    
    if (config.integrations.whatsapp.enabled) {
      logger.info('💚 Loading WhatsApp integration...');
      const WhatsAppAdapter = require('./adapters/whatsapp');
      new WhatsAppAdapter(lobsterCore);
    }
    
    logger.success('✅ All enabled integrations loaded');
    
  } catch (error) {
    logger.error('Failed to initialize Lobster AI:', error);
    process.exit(1);
  }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '0.1.0',
    llm: config.llm.provider,
    timestamp: new Date().toISOString()
  });
});

/**
 * API endpoint for testing
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await lobsterCore.chat(message, {
      userId: 'api-user',
      platform: 'api',
      context
    });
    
    res.json(response);
  } catch (error) {
    logger.error('Chat API error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Start server
 */
async function start() {
  try {
    await initialize();
    
    const port = config.port;
    app.listen(port, () => {
      logger.success(`\n🦞 Lobster AI is running on port ${port}`);
      logger.info('Press Ctrl+C to stop\n');
      
      // Print enabled integrations
      const enabled = [];
      if (config.integrations.telegram.enabled) enabled.push('Telegram');
      if (config.integrations.discord.enabled) enabled.push('Discord');
      if (config.integrations.slack.enabled) enabled.push('Slack');
      if (config.integrations.whatsapp.enabled) enabled.push('WhatsApp');
      
      if (enabled.length > 0) {
        logger.info(`📱 Active integrations: ${enabled.join(', ')}`);
      }
      
      logger.info(`🧠 Using ${config.llm.provider} for AI processing\n`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('\n🛑 Shutting down Lobster AI...');
  if (lobsterCore) {
    await lobsterCore.shutdown();
  }
  process.exit(0);
});

// Start the application
if (require.main === module) {
  start();
}

module.exports = { app, lobsterCore };