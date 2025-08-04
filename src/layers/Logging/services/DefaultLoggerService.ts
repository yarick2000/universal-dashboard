import { DI } from '@/enums';
import { withTryCatch } from '@/utils';

import { LogSourceFormatter, TimeStampFormatter } from '../formatters';
import { Logger, LoggerFormatter } from '../interfaces';
import { format } from '../utils/format';

export class DefaultLoggerService implements Logger {

  private readonly formatters: LoggerFormatter[] = [
    new TimeStampFormatter(),
    new LogSourceFormatter(),
  ];

  constructor(private readonly adapters: Logger[]) {}

  assert(condition: boolean, fn: () => void): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.assert(condition, fn)));
  }
  group(name: string, fn: () => void, collapsed: boolean = true): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.group(name, fn, collapsed)));
  }

  log(message: string, ...args: unknown[]): void {
    const { message: formattedMessage, args: formattedArgs } = format(this.formatters, message, ...args);
    this.adapters.forEach(adapter => withTryCatch(() => adapter.log(formattedMessage, ...formattedArgs)));
  }

  error(message: string, ...args: unknown[]): void {
    const { message: formattedMessage, args: formattedArgs } = format(this.formatters, message, ...args);
    this.adapters.forEach(adapter => withTryCatch(() => adapter.error(formattedMessage, ...formattedArgs)));
  }

  warn(message: string, ...args: unknown[]): void {
    const { message: formattedMessage, args: formattedArgs } = format(this.formatters, message, ...args);
    this.adapters.forEach(adapter => withTryCatch(() => adapter.warn(formattedMessage, ...formattedArgs)));
  }

  info(message: string, ...args: unknown[]): void {
    const { message: formattedMessage, args: formattedArgs } = format(this.formatters, message, ...args);
    this.adapters.forEach(adapter => withTryCatch(() => adapter.info(formattedMessage, ...formattedArgs)));
  }

  debug(message: string, ...args: unknown[]): void {
    const { message: formattedMessage, args: formattedArgs } = format(this.formatters, message, ...args);
    this.adapters.forEach(adapter => withTryCatch(() => adapter.debug(formattedMessage, ...formattedArgs)));
  }

  trace(message: string, ...args: unknown[]): void {
    const { message: formattedMessage, args: formattedArgs } = format(this.formatters, message, ...args);
    this.adapters.forEach(adapter => withTryCatch(() => adapter.trace(formattedMessage, ...formattedArgs)));
  }

  getAdapters(): Logger[] {
    return this.adapters;
  }

  static inject = [DI.LoggerFactory] as const;
};
