import { DI } from '@/enums';

import { Logger } from '../interfaces';

export class DefaultLoggerService implements Logger {

  constructor(private readonly adapters: Logger[]) {}

  assert(condition: boolean, fn: () => void): void {
    this.adapters.forEach(adapter => adapter.assert(condition, fn));
  }
  group(name: string, fn: () => void, collapsed: boolean = true): void {
    this.adapters.forEach(adapter => adapter.group(name, fn, collapsed));
  }

  log(message: string, ...args: unknown[]): void {
    this.adapters.forEach(adapter => adapter.log(message, ...args));
  }

  error(message: string, ...args: unknown[]): void {
    this.adapters.forEach(adapter => adapter.error(message, ...args));
  }

  warn(message: string, ...args: unknown[]): void {
    this.adapters.forEach(adapter => adapter.warn(message, ...args));
  }

  info(message: string, ...args: unknown[]): void {
    this.adapters.forEach(adapter => adapter.info(message, ...args));
  }

  debug(message: string, ...args: unknown[]): void {
    this.adapters.forEach(adapter => adapter.debug(message, ...args));
  }

  trace(message: string, ...args: unknown[]): void {
    this.adapters.forEach(adapter => adapter.trace(message, ...args));
  }

  getAdapters(): Logger[] {
    return this.adapters;
  }

  static inject = [DI.LoggerFactory] as const;
};
