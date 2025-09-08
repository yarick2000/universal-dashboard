import { SupabaseDataClient } from '@/layers/Data';
import { Json } from '@/layers/Data/types/SupabaseDatabaseTypes';

import { LoggerAdapter } from '../interfaces';
import { LogLevel, LogMessage } from '../types';

export class SupabaseLoggerAdapter implements LoggerAdapter {
  private logBuffer: LogMessage<unknown>[] = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private isSending = false;

  constructor(
    private readonly subabaseClient: SupabaseDataClient,
    private readonly logLevels: LogLevel[],
    private readonly batchSize: number,
    private readonly idleTimeSec: number,
    private readonly processError: (error: unknown) => Promise<void>,
  ) {
    if (!subabaseClient) {
      void this.processError(new Error('Supabase client not initialized'));
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
    if (!this.subabaseClient) {
      await this.processError(new Error('Supabase client not initialized'));
      return;
    }
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

      const { error } = await this.subabaseClient.from('logs').insert(payload);
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
