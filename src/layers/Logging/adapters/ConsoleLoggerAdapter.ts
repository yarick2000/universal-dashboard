import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';

export class ConsoleLoggerAdapter implements Logger {
  constructor(
    private readonly console: Console,
    private readonly logLevels: LogLevel[],
    private readonly formatMessage: (message: string, args: unknown) => string,
  ) {}

  async log<T>(data: LogMessage<T> | LogMessage<T>[]): Promise<void> {
    if (Array.isArray(data)) {
      const filteredMessages = data.filter(msg => this.logLevels.includes(msg.level));
      filteredMessages.forEach((logMessage) => {
        this.logSingle(logMessage);
      });
    } else {
      if (!this.logLevels.includes(data.level)) {
        return;
      }
      this.logSingle(data);
    }
    await Promise.resolve();
  }

  private logSingle<T>(data: LogMessage<T>): void {
    if (this.logLevels.includes(data.level)) {
      this.groupWrapCollapsed(this.console[data.level], data.message, data.args);
    }
  }

  private groupWrapCollapsed<T>(
    fn: (message: string, args?: unknown) => void,
    message: string,
    args: T,
  ): void {
    const formattedMessage = this.formatMessage(message, args);
    if (args) {
      this.console.groupCollapsed(formattedMessage);
      fn('', args);
      this.console.groupEnd();
    }
    else {
      fn(formattedMessage);
    }
  }
}
