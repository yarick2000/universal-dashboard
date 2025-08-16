import os from 'os';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { serializeError } from '@/utils';

import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';
import { isLogMessage } from '../utils';

interface Database {
  public: {
    Tables: {
      logs: {
        Row: {
          id: string,
          level: string,
          message: string,
          args: string | null,
          timestamp: string,
          host: string,
        }
        Insert: {
          id?: never,
          level: string,
          message: string,
          args?: string | null,
          timestamp: string,
          host: string,
        }
      }
    }
  }
}

export class SupabaseLoggerAdapter implements Logger {
  private logBuffer: LogMessage<unknown>[] = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private client: SupabaseClient<Database>;
  private isSending = false;

  constructor(
    private readonly logLevels: LogLevel[],
    private readonly batchSize: number,
    private readonly idleTimeSec: number,
    supabaseUrl: string,
    supabaseKey: string,
  ) {
    try  {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      this.client = createClient<Database>(supabaseUrl, supabaseKey);
    } catch (error) {
      throw new Error('Failed to create Supabase client', { cause: error });
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
    const filteredMessages = logMessages.filter(msg => this.logLevels.includes(msg.level));
    this.logBuffer.push(...filteredMessages);
    await this.checkAndFlush();
  }

  private processMessage<T>(level: LogLevel, message: string, args: T): LogMessage<T> {
    if (isLogMessage(args)) {
      return args as LogMessage<T>;
    }
    return {
      level,
      message,
      args: args instanceof Error ? serializeError(args) as T : args,
      timestamp: Date.now(),
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
        timestamp: new Date(log.timestamp).toISOString(),
        level: log.level,
        message: log.message,
        args: log.args ? JSON.stringify(log.args) : null,
        host: os.hostname(),
      }));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const { error } = await this.client.from('logs').insert(payload);
      if (error) {
        this.logBuffer.unshift(...logsToSend);
        throw new Error('Failed to insert logs into Supabase', { cause: error });
      }
    } catch (error) {
      this.logBuffer.unshift(...logsToSend);
      throw new Error('Failed to send logs to Supabase', { cause: error });
    } finally {
      this.isSending = false;
    }
  }
}
