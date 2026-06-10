/**
 * WhatsApp Chat Adapter (Web.js)
 * Integrates Lobster with WhatsApp via WhatsApp Web
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class WhatsAppAdapter {
  constructor(lobsterCore) {
    this.lobsterCore = lobsterCore;
    this.client = null;
    this.initialize();
  }

  /**
   * Initialize WhatsApp client
   */
  initialize() {
    try {
      const sessionPath = process.env.WHATSAPP_SESSION_PATH || './data/whatsapp-session';

      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'lobster',
          dataPath: sessionPath
        })
      });

      // QR code event
      this.client.on('qr', (qr) => {
        logger.info('📱 WhatsApp QR Code (scan with your phone):\n');
        logger.info(qr);
        // In production, you might want to display this as an image
      });

      // Ready event
      this.client.on('ready', () => {
        logger.success('✅ WhatsApp adapter ready');
      });

      // Message event
      this.client.on('message', async (message) => {
        try {
          // Ignore group messages for now
          if (message.from.includes('@g.us')) {
            return;
          }

          const userId = message.from;
          const chat = await message.getChat();
          const userName = chat.name || 'WhatsApp User';
          const userMessage = message.body;

          if (!userMessage.trim()) return;

          // Show typing indicator
          await this.client.sendPresenceSubscription(message.from);
          await this.client.sendState('typing', message.from);

          // Get response
          const response = await this.lobsterCore.chat(userMessage, {
            userId,
            platform: 'whatsapp',
            userName
          });

          // Stop typing
          await this.client.sendState('available', message.from);

          if (response.success) {
            // Split long messages
            const maxLength = 4096;
            if (response.message.length > maxLength) {
              const chunks = response.message.match(new RegExp(`.{1,${maxLength}}`, 'g'));
              for (const chunk of chunks) {
                await message.reply(chunk);
              }
            } else {
              await message.reply(response.message);
            }
          } else {
            await message.reply(response.message);
          }
        } catch (error) {
          logger.error('WhatsApp message error:', error);
        }
      });

      // Authentication failure
      this.client.on('auth_failure', () => {
        logger.error('WhatsApp authentication failed. Please try again.');
      });

      // Disconnect
      this.client.on('disconnected', () => {
        logger.warn('WhatsApp client disconnected');
      });

      // Initialize
      this.client.initialize();

    } catch (error) {
      logger.error('Failed to initialize WhatsApp adapter:', error);
    }
  }
}

module.exports = WhatsAppAdapter;