/**
 * 🦞 Lobster Core AI Engine
 * Main intelligence and routing system
 */

const axios = require('axios');
const logger = require('../utils/logger');
const Database = require('./database');
const Personality = require('./personality');

class LobsterCore {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.personality = new Personality(config.personality);
    this.llmClient = null;
    this.conversationHistory = new Map();
  }

  /**
   * Initialize the core system
   */
  async initialize() {
    try {
      // Initialize database
      this.db = new Database(this.config.database.path);
      await this.db.initialize();
      logger.debug('Database initialized');

      // Verify LLM connection
      await this.verifyLLMConnection();

      logger.success('Lobster Core ready');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Lobster Core:', error);
      throw error;
    }
  }

  /**
   * Verify connection to LLM
   */
  async verifyLLMConnection() {
    try {
      if (this.config.llm.provider === 'ollama') {
        const response = await axios.get(
          `${this.config.llm.ollama.url}/api/tags`,
          { timeout: 5000 }
        );
        logger.info(`Connected to Ollama. Available models: ${response.data.models.map(m => m.name).join(', ')}`);
      } else if (this.config.llm.provider === 'lmstudio') {
        const response = await axios.get(
          `${this.config.llm.lmstudio.url}/v1/models`,
          { timeout: 5000 }
        );
        logger.info('Connected to LM Studio');
      }
    } catch (error) {
      throw new Error(`Failed to connect to ${this.config.llm.provider}: ${error.message}`);
    }
  }

  /**
   * Process a chat message
   */
  async chat(message, context = {}) {
    try {
      const {
        userId = 'unknown',
        platform = 'api',
        userName = 'User'
      } = context;

      logger.debug(`Message from ${userName} (${platform}): ${message}`);

      // Get conversation history
      let history = this.conversationHistory.get(userId) || [];

      // Build prompt with history and personality
      const systemPrompt = this.personality.getSystemPrompt();
      const fullPrompt = this.buildPrompt(systemPrompt, history, message);

      // Call LLM
      const response = await this.callLLM(fullPrompt);

      // Store message and response
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: response });

      // Keep history within limits
      if (history.length > this.config.privacy.maxMessageHistory) {
        history = history.slice(-this.config.privacy.maxMessageHistory);
      }

      this.conversationHistory.set(userId, history);

      // Save to database
      await this.db.saveMessage({
        userId,
        platform,
        userName,
        userMessage: message,
        assistantResponse: response,
        timestamp: new Date()
      });

      return {
        success: true,
        message: response,
        metadata: {
          platform,
          userId,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Chat error:', error);
      return {
        success: false,
        message: this.personality.getErrorResponse(),
        error: error.message
      };
    }
  }

  /**
   * Build prompt with history
   */
  buildPrompt(systemPrompt, history, userMessage) {
    let prompt = systemPrompt + '\n\n';

    // Add relevant history (last 5 exchanges)
    const recentHistory = history.slice(-10);
    if (recentHistory.length > 0) {
      prompt += 'Recent conversation:\n';
      recentHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Lobster'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `User: ${userMessage}\nLobster:`;

    return prompt;
  }

  /**
   * Call LLM API
   */
  async callLLM(prompt) {
    try {
      if (this.config.llm.provider === 'ollama') {
        return await this.callOllama(prompt);
      } else if (this.config.llm.provider === 'lmstudio') {
        return await this.callLMStudio(prompt);
      }
    } catch (error) {
      logger.error('LLM call failed:', error);
      throw error;
    }
  }

  /**
   * Call Ollama
   */
  async callOllama(prompt) {
    const response = await axios.post(
      `${this.config.llm.ollama.url}/api/generate`,
      {
        model: this.config.llm.ollama.model,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
        top_p: 0.95,
        num_predict: 256
      },
      { timeout: this.config.llm.timeout }
    );

    return response.data.response.trim();
  }

  /**
   * Call LM Studio
   */
  async callLMStudio(prompt) {
    const response = await axios.post(
      `${this.config.llm.lmstudio.url}/v1/completions`,
      {
        prompt: prompt,
        max_tokens: 256,
        temperature: 0.7,
        top_p: 0.95
      },
      { timeout: this.config.llm.timeout }
    );

    return response.data.choices[0].text.trim();
  }

  /**
   * Get user conversation history
   */
  async getHistory(userId, limit = 20) {
    return await this.db.getMessages(userId, limit);
  }

  /**
   * Clear user history
   */
  async clearHistory(userId) {
    this.conversationHistory.delete(userId);
    return await this.db.clearMessages(userId);
  }

  /**
   * Shutdown gracefully
   */
  async shutdown() {
    try {
      if (this.db) {
        await this.db.close();
      }
      logger.info('Lobster Core shut down');
    } catch (error) {
      logger.error('Error during shutdown:', error);
    }
  }
}

module.exports = LobsterCore;