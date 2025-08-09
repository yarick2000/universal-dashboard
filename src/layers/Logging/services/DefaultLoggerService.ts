import { DI } from '@/enums';
import { withTryCatch } from '@/utils';

import { Logger } from '../interfaces';

export class DefaultLoggerService implements Logger {
  constructor(private readonly adapters: Logger[]) {}

  log<T>(message: string, args: T): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.log(message, args)));
  }

  error<T>(message: string, args: T): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.error(message, args)));
  }

  warn<T>(message: string, args: T): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.warn(message, args)));
  }

  info<T>(message: string, args: T): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.info(message, args)));
  }

  debug<T>(message: string, args: T): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.debug(message, args)));
  }

  trace<T>(message: string, args: T): void {
    this.adapters.forEach(adapter => withTryCatch(() => adapter.trace(message, args)));
  }

  getAdapters(): Logger[] {
    return this.adapters;
  }

  static inject = [DI.LoggerFactory] as const;
};
