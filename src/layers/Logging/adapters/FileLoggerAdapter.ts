import { Logger } from '../interfaces';
import { LogLevel } from '../types';

export class FileLoggerAdapter implements Logger {
  constructor(
    private readonly logLevels: LogLevel[],
    private readonly filePath: string,
    private readonly fileNamePattern: string,
    private readonly batchSize: number,
    private readonly idleTimeSec: number,
    private readonly maxStoragePeriodDays: number,
    private readonly maxFileSize: number,
  ) {}

  log<T>(message: string, args: T): void {

  }
