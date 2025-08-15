import { promises as fs } from 'fs';
import os from 'os';
import { join } from 'path';

import { serializeError } from '@/utils';

import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';
import { isLogMessage } from '../utils';

export class FileLoggerAdapter implements Logger {
  private logBuffer: LogMessage<unknown>[] = [];
  private idleTimer: NodeJS.Timeout | null = null;
  private isWriting = false;
  private partCounter = 1;

  constructor(
    private readonly logLevels: LogLevel[],
    private readonly filePath: string,
    private readonly fileNamePattern: string,
    private readonly batchSize: number,
    private readonly idleTimeSec: number,
    private readonly maxStoragePeriodDays: number,
    private readonly maxFileSize: number,
  ) {
    // Ensure the log directory exists
    void this.ensureLogDirectory();

    // Start cleanup of old log files
    void this.cleanupOldLogFiles();
  }

  dispose(): void {
    // Flush any remaining logs before disposal
    if (this.logBuffer.length > 0) {
      void this.flushLogs();
    }

    // Clear the idle timer
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
    // Filter messages by log levels
    const filteredMessages = logMessages.filter(msg => this.logLevels.includes(msg.level));

    // Add to buffer
    this.logBuffer.push(...filteredMessages);

    // Check if we need to flush
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

    // Reset idle timer
    this.resetIdleTimer();

    // Check if we need to flush based on batch size
    void this.checkAndFlush();
  }

  private async checkAndFlush(): Promise<void> {
    if (this.logBuffer.length >= this.batchSize && !this.isWriting) {
      await this.flushLogs();
    }
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      if (this.logBuffer.length > 0 && !this.isWriting) {
        void this.flushLogs();
      }
    }, this.idleTimeSec * 1000);
  }

  private async flushLogs(): Promise<void> {
    if (this.isWriting || this.logBuffer.length === 0) {
      return;
    }

    this.isWriting = true;
    const logsToWrite = [...this.logBuffer];
    this.logBuffer = [];

    try {
      const fileName = this.generateFileName();
      const filePath = join(this.filePath, fileName);

      // Check if file needs rotation due to size
      await this.rotateFileIfNeeded(filePath);

      // Format and write logs
      const logEntries = logsToWrite.map(log => this.formatLogEntry(log)).join('\n') + '\n';

      await fs.appendFile(filePath, logEntries, 'utf8');
    } catch (error) {
      // Log to console as fallback if file writing fails
      // eslint-disable-next-line no-console
      console.error('Failed to write logs to file:', error);

      // Put logs back in buffer for retry (optional)
      this.logBuffer.unshift(...logsToWrite);
    } finally {
      this.isWriting = false;
    }
  }

  private async rotateFileIfNeeded(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      if (stats.size >= this.maxFileSize) {
        this.partCounter++;
      }
    } catch {
      // File doesn't exist yet, which is fine
    }
  }

  private generateFileName(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    return this.fileNamePattern
      .replace('%DATE%', dateStr)
      .replace('%PART%', this.partCounter.toString().padStart(3, '0'));
  }

  private populateWithInfo<T>(log: LogMessage<T>): object {
    return {
      timeStampFormatted: new Date(log.timestamp).toISOString(),
      host: os.hostname(),
      ...log,
    };
  }

  private formatLogEntry(log: LogMessage<unknown>): string {
    const populatedLog = this.populateWithInfo(log);
    return JSON.stringify(populatedLog);
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.filePath, { recursive: true });
    } catch (error) {
      throw new Error('Failed to create log directory:', { cause: error });
    }
  }

  private async cleanupOldLogFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.filePath);
      const cutoffTime = Date.now() - (this.maxStoragePeriodDays * 24 * 60 * 60 * 1000);

      for (const file of files) {
        const filePath = join(this.filePath, file);
        const stats = await fs.stat(filePath);

        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      throw new Error('Failed to cleanup old log files:', { cause: error });
    }
  }
}
