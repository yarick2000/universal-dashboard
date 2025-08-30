import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';
import { Database, Json } from '../types/SupabaseDatabaseTypes';

export class SupabaseLoggerAdapter implements Logger {
  private logBuffer: LogMessage<unknown>[] = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private client: SupabaseClient<Database> | null = null;
  private isSending = false;

  constructor(
    private readonly logLevels: LogLevel[],
    private readonly batchSize: number,
    private readonly idleTimeSec: number,
    supabaseUrl: string,
    supabaseKey: string,
    private readonly processError: (error: unknown) => Promise<void>,
  ) {
    try {
      this.client = createClient<Database>(supabaseUrl, supabaseKey);
    } catch (error) {
      void this.processError(error);
    }
  }

  async dispose(): Promise<void> {
    if (this.logBuffer.length > 0) {
      await this.flushLogs();
    }
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  async log<T>(data: LogMessage<T> | LogMessage<T>[]): Promise<void> {
    if (Array.isArray(data)) {
      const filteredMessages = data.filter(msg => this.logLevels.includes(msg.level));
      await this.addToBuffer(filteredMessages);
    } else {
      if (!this.logLevels.includes(data.level)) {
        return;
      }
      await this.addToBuffer(data);
    }
  }

  private async addToBuffer<T>(message: LogMessage<T> | LogMessage<T>[]): Promise<void> {
    if (Array.isArray(message)) {
      this.logBuffer.push(...message);
    } else {
      this.logBuffer.push(message);
    }
    this.resetIdleTimer();
    await this.checkAndFlush();
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
        args: log.args as Json,
        source: log.source,
        message: log.message,
        timestamp: new Date(log.timestamp).toISOString(),
        info: log.info as Json,
        level: log.level,
      }));
      if (!this.client) {
        await this.processError(new Error('Supabase client not initialized'));
        return;
      }

      const { error } = await this.client.from('logs').insert(payload);
      if (error) {
        this.logBuffer.unshift(...logsToSend);
        await this.processError(error);
      }
    } catch (error) {
      this.logBuffer.unshift(...logsToSend);
      await this.processError(error);
    } finally {
      this.isSending = false;
    }
  }
}
