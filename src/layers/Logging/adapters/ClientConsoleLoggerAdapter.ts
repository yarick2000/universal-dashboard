
import { serializeError } from 'serialize-error';

import { Logger } from '../interfaces';
import { LogLevel } from '../types';

export class ClientConsoleLoggerAdapter implements Logger {

  private readonly console: Console;
  private readonly logLevels: LogLevel[];

  constructor (_console: Console, _logLevels: LogLevel[]) {
    this.console = _console;
    this.logLevels = _logLevels;
  }

  assert(condition: boolean, fn: () => void): void {
    if (!condition) {
      fn();
    }
  }

  group(name: string, fn: () => void, collapsed: boolean = true): void {
    if (collapsed) {
      this.console.groupCollapsed(name);
    } else {
      this.console.group(name);
    }
    fn();
    this.console.groupEnd();
  }

  log<T>(message: string, args: T): void {
    if (this.logLevels.includes('log')) {
      this.groupWrapCollapsed(this.console.log, message, args);
    }
  }

  info<T>(message: string, args: T): void {
    if (this.logLevels.includes('info')) {
      this.groupWrapCollapsed(this.console.info, message, args);
    }
  }

  warn<T>(message: string, args: T): void {
    if (this.logLevels.includes('warn')) {
      this.groupWrapCollapsed(this.console.warn, message, args);
    }
  }

  error<T>(message: string, args: T): void {
    if (this.logLevels.includes('error')) {
      this.groupWrapCollapsed(this.console.error, message, args);
    }
  }

  debug<T>(message: string, args: T): void {
    if (this.logLevels.includes('debug')) {
      this.groupWrapCollapsed(this.console.debug, message, args);
    }
  }

  trace<T>(message: string, args: T): void {
    if (this.logLevels.includes('trace')) {
      this.groupWrapCollapsed(this.console.trace, message, args);
    }
  }

  private processArgs(args: unknown): unknown {
    if (args instanceof Error) {
      return JSON.stringify(serializeError(args), null, 2);
    }
    return typeof args === 'object' ? JSON.stringify(args, null, 2) : args;
  }

  private groupWrapCollapsed<T>(fn: (message: string, args?: unknown) => void, message: string, args: T): void {
    if (args) {
      this.console.groupCollapsed(message);
      fn('', this.processArgs(args));
      this.console.groupEnd();
    }
    else {
      fn(message);
    }
  }
}
