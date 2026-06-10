/**
 * Local SQLite Database for chat history and context
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  /**
   * Initialize database
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      // Create data directory if it doesn't exist
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.db.serialize(() => {
          // Messages table
          this.db.run(`
            CREATE TABLE IF NOT EXISTS messages (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT NOT NULL,
              platform TEXT,
              userName TEXT,
              userMessage TEXT NOT NULL,
              assistantResponse TEXT NOT NULL,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(id)
            )
          `);

          // Conversation context table
          this.db.run(`
            CREATE TABLE IF NOT EXISTS context (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT UNIQUE NOT NULL,
              contextData TEXT,
              lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);

          // User preferences table
          this.db.run(`
            CREATE TABLE IF NOT EXISTS preferences (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId TEXT UNIQUE NOT NULL,
              platform TEXT,
              preferences TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);

          // Create indexes for faster queries
          this.db.run(`CREATE INDEX IF NOT EXISTS idx_messages_userId ON messages(userId)`);
          this.db.run(`CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)`);
          this.db.run(`CREATE INDEX IF NOT EXISTS idx_context_userId ON context(userId)`, 
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      });
    });
  }

  /**
   * Save a message exchange
   */
  async saveMessage(data) {
    return new Promise((resolve, reject) => {
      const { userId, platform, userName, userMessage, assistantResponse, timestamp } = data;

      this.db.run(
        `INSERT INTO messages (userId, platform, userName, userMessage, assistantResponse, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, platform, userName, userMessage, assistantResponse, timestamp || new Date()],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  /**
   * Get messages for a user
   */
  async getMessages(userId, limit = 20) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM messages 
         WHERE userId = ? 
         ORDER BY timestamp DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  /**
   * Clear messages for a user
   */
  async clearMessages(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM messages WHERE userId = ?`,
        [userId],
        function(err) {
          if (err) reject(err);
          else resolve({ deletedCount: this.changes });
        }
      );
    });
  }

  /**
   * Save user context
   */
  async saveContext(userId, contextData) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO context (userId, contextData, lastUpdated)
         VALUES (?, ?, ?)`,
        [userId, JSON.stringify(contextData), new Date()],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get user context
   */
  async getContext(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT contextData FROM context WHERE userId = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.contextData) : null);
        }
      );
    });
  }

  /**
   * Save user preferences
   */
  async savePreferences(userId, platform, preferences) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO preferences (userId, platform, preferences, updatedAt)
         VALUES (?, ?, ?, ?)`,
        [userId, platform, JSON.stringify(preferences), new Date()],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId, platform) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT preferences FROM preferences WHERE userId = ? AND platform = ?`,
        [userId, platform],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.preferences) : {});
        }
      );
    });
  }

  /**
   * Get statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT 
          COUNT(DISTINCT userId) as totalUsers,
          COUNT(*) as totalMessages,
          COUNT(DISTINCT platform) as platformsUsed
         FROM messages`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row || {});
        }
      );
    });
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;