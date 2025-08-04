
import { Logger } from '../interfaces';

export class ClientConsoleLoggerAdapter implements Logger {

  private readonly console: Console;

  constructor (_console: Console) {
    this.console = _console;
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

  log(message: string, ...args: unknown[]): void {
    this.console.log(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.console.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.console.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.console.error(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.console.debug(message, ...args);
  }

  trace(message: string, ...args: unknown[]): void {
    this.console.trace(message, ...args);
  }
}
