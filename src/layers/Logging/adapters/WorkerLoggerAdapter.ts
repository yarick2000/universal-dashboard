import { recordClientSideLogs } from '@/app/actions';
import { serializeError } from '@/utils';

import { Logger } from '../interfaces';
import { ClientSideLogMessage, LogLevel, LogMessage } from '../types';

export class WorkerLoggerAdapter implements Logger {
  private readonly worker: Worker | null = null;
  private readonly logLevels: LogLevel[];
  private readonly fallbackLogger: Logger;
  private readonly currentDomain: string = window.location.origin;

  constructor(_fallbackLogger: Logger, _logLevels: LogLevel[], batchSize: number, idleTime: number) {
    this.fallbackLogger = _fallbackLogger;
    this.logLevels = _logLevels;
    try {
      this.worker = new Worker(
        new URL('../../../../public/workers/LoggerWorker.js', import.meta.url),
        { type: 'module' },
      );
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.postMessage({ type: 'init', batchSize, idleTime });
    } catch (error) {
      this.fallbackLogger.error('Failed to initialize WorkerLoggerAdapter:', error);
    }
  }

  dispose(): void {
    this.worker?.postMessage({ type: 'dispose' });
  }

  log<T>(message: string, args?: T): void {
    if (this.logLevels.includes('log')) {
      this.worker?.postMessage({ type: 'log', message, args });
    }
  }

  error<T>(message: string, args?: T): void {
    if (this.logLevels.includes('error')) {
      this.worker?.postMessage({
        domain: this.currentDomain,
        type: 'error',
        message,
        args: serializeError(args),
      });
    }
  }

  info<T>(message: string, args?: T): void {
    if (this.logLevels.includes('info')) {
      this.worker?.postMessage({ type: 'info', message, args });
    }
  }

  debug<T>(message: string, args?: T): void {
    if (this.logLevels.includes('debug')) {
      this.worker?.postMessage({ type: 'debug', message, args });
    }
  }

  trace<T>(message: string, args?: T): void {
    if (this.logLevels.includes('trace')) {
      this.worker?.postMessage({ type: 'trace', message, args });
    }
  }

  warn<T>(message: string, args?: T): void {
    if (this.logLevels.includes('warn')) {
      this.worker?.postMessage({ type: 'warn', message, args });
    }
  }

  async bulk(logMessages: LogMessage<unknown>[]): Promise<void> {
    const filteredMessages = logMessages.filter(msg => this.logLevels.includes(msg.level));
    await recordClientSideLogs(filteredMessages as ClientSideLogMessage<unknown>[]);
  }

  private async handleWorkerMessage(event: MessageEvent<ClientSideLogMessage<unknown>[]>): Promise<void> {
    await this.bulk(event.data);
  }
}
