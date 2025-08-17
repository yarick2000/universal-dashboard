import os from 'os';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { CONTAINER_ID } from '@/trace';
import { serializeError } from '@/utils';

import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';
import { Database, Json } from '../types/SupabaseDatabaseTypes';
import { isLogMessage } from '../utils';

export class SupabaseLoggerAdapter implements Logger {
  private logBuffer: LogMessage<unknown>[] = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private client: SupabaseClient<Database> | null = null;
  private isSending = false;

  constructor(
    private readonly fallbackLogger: Logger,
    private readonly logLevels: LogLevel[],
    private readonly batchSize: number,
    private readonly idleTimeSec: number,
    supabaseUrl: string,
    supabaseKey: string,
  ) {
    try  {
      this.client = createClient<Database>(supabaseUrl, supabaseKey);
    } catch (error) {
      this.fallbackLogger.error('Failed to create Supabase client:', error);
    }
  }

  dispose(): void {
    if (this.logBuffer.length > 0) {
      void this.flushLogs();
    }
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  log<T>(message: string, args: T): void {
    if (this.logLevels.includes('log')) {
      this.addToBuffer(this.processMessage('log', message, args));
    }
  }

  info<T>(message: string, args: T): void {
    if (this.logLevels.includes('info')) {
      this.addToBuffer(this.processMessage('info', message, args));
    }
  }

  warn<T>(message: string, args: T): void {
    if (this.logLevels.includes('warn')) {
      this.addToBuffer(this.processMessage('warn', message, args));
    }
  }

  error<T>(message: string, args: T): void {
    if (this.logLevels.includes('error')) {
      this.addToBuffer(this.processMessage('error', message, args));
    }
  }

  debug<T>(message: string, args: T): void {
    if (this.logLevels.includes('debug')) {
      this.addToBuffer(this.processMessage('debug', message, args));
    }
  }

  trace<T>(message: string, args: T): void {
    if (this.logLevels.includes('trace')) {
      this.addToBuffer(this.processMessage('trace', message, args));
    }
  }

  async bulk(logMessages: LogMessage<unknown>[]): Promise<void> {
    const filteredMessages = logMessages
      .filter(msg => this.logLevels.includes(msg.level))
      .map(msg => this.processMessage(msg.level, msg.message, msg.args));
    this.logBuffer.push(...filteredMessages);
    await this.checkAndFlush();
  }

  private processMessage<T>(level: LogLevel, message: string, args: T): LogMessage<T> {
    if (isLogMessage(args)) {
      return {
        ...args,
        info: {
          ...args.info,
          host: os.hostname() || CONTAINER_ID,
        },
      } as LogMessage<T>;
    }
    return {
      source: 'server',
      level,
      message,
      args:  serializeError(args) as T,
      timestamp: Date.now(),
      host: os.hostname() || CONTAINER_ID,
    };
  }

  private addToBuffer<T>(message: LogMessage<T>): void {
    this.logBuffer.push(message);
    this.resetIdleTimer();
    void this.checkAndFlush();
  }

  private async checkAndFlush(): Promise<void> {
    if (this.logBuffer.length >= this.batchSize && !this.isSending) {
      await this.flushLogs();
    }
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = setTimeout(() => {
      if (this.logBuffer.length > 0 && !this.isSending) {
        void this.flushLogs();
      }
    }, this.idleTimeSec * 1000);
  }

  private async flushLogs(): Promise<void> {
    if (this.isSending || this.logBuffer.length === 0) return;

    this.isSending = true;
    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      const payload = logsToSend.map(log => ({
        host: log.host,
        args: log.args as Json,
        source: log.source,
        message: log.message,
        timestamp: new Date(log.timestamp).toISOString(),
        info: log.info as Json,
        level: log.level,
      }));
      if (!this.client) {
        this.fallbackLogger.error('Supabase client is not initialized');
        return;
      }

      const { error } = await this.client.from('logs').insert(payload);
      if (error) {
        this.logBuffer.unshift(...logsToSend);
        this.fallbackLogger.error('Failed to send logs to Supabase:', error);
      }
    } catch (error) {
      this.logBuffer.unshift(...logsToSend);
      this.fallbackLogger.error('Failed to send logs to Supabase:', error);
    } finally {
      this.isSending = false;
    }
  }
}
