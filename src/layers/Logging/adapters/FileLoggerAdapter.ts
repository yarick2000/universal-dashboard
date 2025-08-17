import { promises as fs } from 'fs';
import { join } from 'path';


import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';

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

  }

  async initialize(): Promise<void> {
    // Ensure the log directory exists
    await this.ensureLogDirectory();

    // Start cleanup of old log files
    await this.cleanupOldLogFiles();
  }

  async dispose(): Promise<void> {
    // Flush any remaining logs before disposal
    if (this.logBuffer.length > 0) {
      await this.flushLogs();
    }

    // Clear the idle timer
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

  private async addToBuffer<T extends LogMessage<unknown>>(message: T | T[]): Promise<void> {
    if (Array.isArray(message)) {
      this.logBuffer.push(...message);
    } else {
      this.logBuffer.push(message);
    }

    // Reset idle timer
    this.resetIdleTimer();

    // Check if we need to flush based on batch size
    await this.checkAndFlush();
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
      const logEntries = logsToWrite.map(log => JSON.stringify(log)).join('\n') + '\n';

      await fs.appendFile(filePath, logEntries, 'utf8');
    } catch {
      // Put logs back in buffer for retry (optional)
      this.logBuffer.unshift(...logsToWrite);
      // TODO: Implement fallback logging for that specific error
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

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.filePath, { recursive: true });
    } catch {
      // TODO: Implement fallback logging for that specific error
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
    } catch {
      // TODO: Implement fallback logging for that specific error
    }
  }
}
