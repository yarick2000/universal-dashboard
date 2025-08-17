import { serializeError } from 'serialize-error';

import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';

export class ConsoleLoggerAdapter implements Logger {
  constructor(
    private readonly console: Console,
    private readonly logLevels: LogLevel[],
    private readonly formatMessage: (message: string, args: unknown) => string,
  ) {}

  log<T>(message: string, args?: T): void {
    if (this.logLevels.includes('log')) {
      this.groupWrapCollapsed(this.console.log, message, args);
    }
  }

  info<T>(message: string, args?: T): void {
    if (this.logLevels.includes('info')) {
      this.groupWrapCollapsed(this.console.info, message, args);
    }
  }

  warn<T>(message: string, args?: T): void {
    if (this.logLevels.includes('warn')) {
      this.groupWrapCollapsed(this.console.warn, message, args);
    }
  }

  error<T>(message: string, args?: T): void {
    if (this.logLevels.includes('error')) {
      this.groupWrapCollapsed(this.console.error, message, args);
    }
  }

  debug<T>(message: string, args?: T): void {
    if (this.logLevels.includes('debug')) {
      this.groupWrapCollapsed(this.console.debug, message, args);
    }
  }

  trace<T>(message: string, args?: T): void {
    if (this.logLevels.includes('trace')) {
      this.groupWrapCollapsed(this.console.trace, message, args);
    }
  }

  bulk(logMessages: LogMessage<unknown>[]): Promise<void> {
    const filteredMessages = logMessages.filter(msg => this.logLevels.includes(msg.level));
    filteredMessages.forEach((logMessage) => {
      const { level, message} = logMessage;
      this[level](message, logMessage);
    });
    return Promise.resolve();
  }

  private processArgs(args: unknown): unknown {
    if (args instanceof Error) {
      return JSON.stringify(serializeError(args), null, 2);
    }
    return typeof args === 'object' ? JSON.stringify(args, null, 2) : args;
  }

  private groupWrapCollapsed<T>(
    fn: (message: string, args?: unknown) => void,
    message: string,
    args: T,
  ): void {
    const formattedMessage = this.formatMessage(message, args);
    if (args) {
      this.console.groupCollapsed(formattedMessage);
      fn('', this.processArgs(args));
      this.console.groupEnd();
    }
    else {
      fn(formattedMessage);
    }
  }
}
