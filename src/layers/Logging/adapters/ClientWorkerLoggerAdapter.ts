import { serializeError } from 'serialize-error';

import { Logger } from '../interfaces';
import { LogLevel } from '../types';


export class ClientWorkerLoggerAdapter implements Logger {
  private readonly worker: Worker;
  private readonly logLevels: LogLevel[];
  private readonly currentDomain: string = window.location.origin;

  constructor(_logLevels: LogLevel[], batchSize: number, idleTime: number) {
    this.worker = new Worker(new URL('../../../../public/workers/LoggerWorker/index.js', import.meta.url), { type: 'module' });
    this.worker.postMessage({ type: 'init', batchSize, idleTime });
    this.logLevels = _logLevels;
  }

  log<T>(message: string, args: T): void {
    if (this.logLevels.includes('log')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'log', message, args });
    }
  }

  error<T>(message: string, args: T): void {
    if (this.logLevels.includes('error')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'error', message, args: (args instanceof Error) ? serializeError(args) : args });
    }
  }

  info<T>(message: string, args: T): void {
    if (this.logLevels.includes('info')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'info', message, args });
    }
  }

  debug<T>(message: string, args: T): void {
    if (this.logLevels.includes('debug')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'debug', message, args });
    }
  }

  trace<T>(message: string, args: T): void {
    if (this.logLevels.includes('trace')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'trace', message, args });
    }
  }

  warn<T>(message: string, args: T): void {
    if (this.logLevels.includes('warn')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'warn', message, args });
    }
  }
}
