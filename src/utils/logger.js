/**
 * Logger utility with color support
 */

const chalk = require('chalk');

const levels = {
  error: { color: 'red', prefix: '❌' },
  warn: { color: 'yellow', prefix: '⚠️' },
  info: { color: 'blue', prefix: 'ℹ️' },
  debug: { color: 'gray', prefix: '🐛' },
  success: { color: 'green', prefix: '✅' }
};

const currentLevel = process.env.LOG_LEVEL || 'info';
const levelPriority = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  success: 2
};

function shouldLog(level) {
  return levelPriority[level] <= levelPriority[currentLevel];
}

function formatMessage(level, message, data) {
  const timestamp = new Date().toISOString();
  const levelConfig = levels[level] || levels.info;
  
  let output = `${levelConfig.prefix} [${timestamp}] ${message}`;
  
  if (data) {
    output += '\n' + JSON.stringify(data, null, 2);
  }
  
  return output;
}

const logger = {
  error(message, data) {
    if (shouldLog('error')) {
      console.error(chalk.red(formatMessage('error', message, data)));
    }
  },
  
  warn(message, data) {
    if (shouldLog('warn')) {
      console.warn(chalk.yellow(formatMessage('warn', message, data)));
    }
  },
  
  info(message, data) {
    if (shouldLog('info')) {
      console.log(chalk.blue(formatMessage('info', message, data)));
    }
  },
  
  debug(message, data) {
    if (shouldLog('debug')) {
      console.log(chalk.gray(formatMessage('debug', message, data)));
    }
  },
  
  success(message, data) {
    if (shouldLog('success')) {
      console.log(chalk.green(formatMessage('success', message, data)));
    }
  }
};

module.exports = logger;