import { serializeError } from 'serialize-error';

import { recordClientSideLogs } from '@/app/actions';

import { Logger } from '../interfaces';
import { ClientSideLogMessage, LogLevel, LogMessage } from '../types';

export class WorkerLoggerAdapter implements Logger {
  private readonly worker: Worker;
  private readonly logLevels: LogLevel[];
  private readonly currentDomain: string = window.location.origin;
  private readonly console: Console = window.console;

  constructor(_logLevels: LogLevel[], batchSize: number, idleTime: number) {
    try {
      this.worker = new Worker(
        new URL('../../../../public/workers/LoggerWorker.js', import.meta.url),
        { type: 'module' },
      );
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.postMessage({ type: 'init', batchSize, idleTime });
      this.logLevels = _logLevels;
    } catch (error) {
      this.console.error('Failed to initialize WorkerLoggerAdapter:', error);
      throw new Error('Worker initialization failed', { cause: error });
    }
  }

  dispose(): void {
    if (this.worker) {
      this.worker.terminate();
    }
  }

  log<T>(message: string, args: T): void {
    if (this.logLevels.includes('log')) {
      this.worker.postMessage({ type: 'log', message, args });
    }
  }

  error<T>(message: string, args: T): void {
    if (this.logLevels.includes('error')) {
      this.worker.postMessage({
        domain: this.currentDomain,
        type: 'error',
        message,
        args: this.serializeError(args),
      });
    }
  }

  info<T>(message: string, args: T): void {
    if (this.logLevels.includes('info')) {
      this.worker.postMessage({ type: 'info', message, args });
    }
  }

  debug<T>(message: string, args: T): void {
    if (this.logLevels.includes('debug')) {
      this.worker.postMessage({ type: 'debug', message, args });
    }
  }

  trace<T>(message: string, args: T): void {
    if (this.logLevels.includes('trace')) {
      this.worker.postMessage({ type: 'trace', message, args });
    }
  }

  warn<T>(message: string, args: T): void {
    if (this.logLevels.includes('warn')) {
      this.worker.postMessage({ type: 'warn', message, args });
    }
  }

  async bulk(logMessages: LogMessage<unknown>[]): Promise<void> {
    await recordClientSideLogs(logMessages as ClientSideLogMessage<unknown>[]);
  }

  private async handleWorkerMessage(event: MessageEvent<ClientSideLogMessage<unknown>[]>): Promise<void> {
    await this.bulk(event.data);
  }

  private serializeError(error: unknown): unknown {
    if (error instanceof Error) {
      return serializeError(error);
    }
    if (typeof error === 'object' && error !== null) {
      // Handle other error-like objects
      return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    return error;
  }

}
