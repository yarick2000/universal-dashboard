import { DI } from '@/enums';
import { isClient, withTryCatch } from '@/utils';

import { Logger, LoggerService } from '../interfaces';
import { LogLevel, LogMessage } from '../types';

export class DefaultLoggerService implements LoggerService {
  private isInitialized = false;
  private adapters: Logger[] = [];
  constructor(private readonly adaptersFactory: () => Promise<Logger[]>) {}

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      try {
        this.adapters = await this.adaptersFactory();
        await Promise.allSettled(
          this.adapters
            .filter(adapter => typeof adapter.initialize === 'function')
            .map(adapter => withTryCatch(() => adapter.initialize?.())));
        this.isInitialized = true;
      } catch (error) {
        this.isInitialized = false;
        throw new Error('Logger initialization failed', { cause: error });
      }
    }
  }

  async log<T>(message: string, args: T): Promise<void> {
    await this.processLogCall('log', message, args);
  }

  async error<T>(message: string, args: T): Promise<void> {
    await this.processLogCall('error', message, args);
  }

  async warn<T>(message: string, args: T): Promise<void> {
    await this.processLogCall('warn', message, args);
  }


  async info<T>(message: string, args: T): Promise<void> {
    await this.processLogCall('info', message, args);
  }

  async debug<T>(message: string, args: T): Promise<void> {
    await this.processLogCall('debug', message, args);
  }


  async trace<T>(message: string, args: T): Promise<void> {
    await this.processLogCall('trace', message, args);
  }

  async bulk(logMessages: LogMessage<unknown>[]): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      await Promise.allSettled(
        this.adapters.map(adapter =>
          withTryCatch(() =>
            adapter.log(logMessages),
          ),
        ),
      );
    }
  }

  async dispose(): Promise<void> {
    await Promise.allSettled(
      this.adapters
        .filter(adapter => typeof adapter.dispose === 'function')
        .map(adapter => withTryCatch(() => adapter.dispose?.())));
  }

  getAdapters(): Logger[] {
    return this.adapters;
  }

  private async processLogCall<T>(logLevel: LogLevel, message: string, args: T): Promise<void> {
    await this.initialize();
    if (this.isInitialized) {
      await Promise.allSettled(
        this.adapters.map(adapter =>
          withTryCatch(() =>
            adapter.log(
              this.createMessage(logLevel, message, args),
            ),
          ),
        ),
      );
    }
  }

  private createMessage<T>(logLevel: LogLevel, message: string, args: T): LogMessage<T> {
    return {
      source: isClient() ? 'client' : 'server',
      level: logLevel,
      message,
      args,
      timestamp: Date.now(),
      info: undefined,
      host: 'null',
    };
  }

  static inject = [DI.LoggerFactory] as const;
};
