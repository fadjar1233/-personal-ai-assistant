/**
 * Slack Chat Adapter
 * Integrates Lobster with Slack
 */

const { App } = require('@slack/bolt');
const logger = require('../utils/logger');

class SlackAdapter {
  constructor(lobsterCore) {
    this.lobsterCore = lobsterCore;
    this.app = null;
    this.initialize();
  }

  initialize() {
    try {
      const botToken = process.env.SLACK_BOT_TOKEN;
      const signingSecret = process.env.SLACK_SIGNING_SECRET;

      if (!botToken || !signingSecret) {
        logger.warn('Slack credentials not provided, skipping initialization');
        return;
      }

      this.app = new App({
        token: botToken,
        signingSecret: signingSecret
      });

      this.app.event('app_mention', async ({ event, client }) => {
        try {
          const userId = event.user;
          const text = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();

          if (!text) return;

          await client.reactions.add({
            channel: event.channel,
            timestamp: event.ts,
            emoji: 'eyes'
          });

          const response = await this.lobsterCore.chat(text, {
            userId,
            platform: 'slack',
            userName: 'Slack User'
          });

          if (response.success) {
            await client.chat.postMessage({
              channel: event.channel,
              text: response.message,
              thread_ts: event.ts
            });
          } else {
            await client.chat.postMessage({
              channel: event.channel,
              text: response.message,
              thread_ts: event.ts
            });
          }

          await client.reactions.remove({
            channel: event.channel,
            timestamp: event.ts,
            emoji: 'eyes'
          });
        } catch (error) {
          logger.error('Slack message error:', error);
        }
      });

      this.app.event('message', async ({ event, client }) => {
        if (event.bot_id || event.channel_type !== 'im' || !event.text) return;

        try {
          const userId = event.user;

          const response = await this.lobsterCore.chat(event.text, {
            userId,
            platform: 'slack',
            userName: 'Slack User'
          });

          if (response.success) {
            await client.chat.postMessage({
              channel: event.channel,
              text: response.message
            });
          } else {
            await client.chat.postMessage({
              channel: event.channel,
              text: response.message
            });
          }
        } catch (error) {
          logger.error('Slack DM error:', error);
        }
      });

      this.app.start(process.env.SLACK_PORT || 3001).then(() => {
        logger.success('✅ Slack adapter initialized');
      });

    } catch (error) {
      logger.error('Failed to initialize Slack adapter:', error);
    }\n  }\n}\n\nmodule.exports = SlackAdapter;