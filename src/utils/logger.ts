import { config } from '../config/env.js';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const currentLevel = LogLevel[config.logging.level.toUpperCase() as keyof typeof LogLevel] ?? LogLevel.INFO;

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, levelName: string, message: string, data?: unknown) {
    if (level <= currentLevel) {
      const timestamp = this.getTimestamp();
      const logEntry = `[${timestamp}] [${levelName}] ${message}`;

      if (data) {
        console.log(logEntry, JSON.stringify(data, null, 2));
      } else {
        console.log(logEntry);
      }
    }
  }

  error(message: string, error?: unknown) {
    let errorData = error;
    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    this.log(LogLevel.ERROR, 'ERROR', message, errorData);
  }

  warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, 'WARN', message, data);
  }

  info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, 'INFO', message, data);
  }

  debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data);
  }
}

export default new Logger();
