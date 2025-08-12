import { DI } from '@/enums';
import { withTryCatch } from '@/utils';

import { Logger, LoggerService } from '../interfaces';
import { LogMessage } from '../types';

export class DefaultLoggerService implements LoggerService {
  private isInitialized = false;
  private adapters: Logger[] = [];
  constructor(private readonly adaptersFactory: () => Promise<Logger[]>) {}

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      try {
        this.adapters = await this.adaptersFactory();
        this.isInitialized = true;
      } catch {
        this.isInitialized = false;
      }
    }
  }

  async log<T>(message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      this.adapters.forEach(adapter => withTryCatch(() => adapter.log(message, args)));
    }
  }

  async error<T>(message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      this.adapters.forEach(adapter => withTryCatch(() => adapter.error(message, args)));
    }
  }

  async warn<T>(message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      this.adapters.forEach(adapter => withTryCatch(() => adapter.warn(message, args)));
    }
  }

  async info<T>(message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      this.adapters.forEach(adapter => withTryCatch(() => adapter.info(message, args)));
    }
  }

  async debug<T>(message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      this.adapters.forEach(adapter => withTryCatch(() => adapter.debug(message, args)));
    }
  }

  async trace<T>(message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      this.adapters.forEach(adapter => withTryCatch(() => adapter.trace(message, args)));
    }
  }

  async bulk(logMessages: LogMessage<unknown>[]): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      await Promise.allSettled(this.adapters.map(adapter => withTryCatch(() => adapter.bulk(logMessages))));
    }
  }

  getAdapters(): Logger[] {
    return this.adapters;
  }

  static inject = [DI.LoggerFactory] as const;
};
