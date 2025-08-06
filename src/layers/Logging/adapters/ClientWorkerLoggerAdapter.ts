import { Logger } from '../interfaces';
import { LogLevel } from '../types';


export class ClientWorkerLoggerAdapter implements Logger {
  private readonly worker: Worker;
  private readonly logLevels: LogLevel[];
  private readonly currentDomain: string = window.location.origin;

  constructor(_logLevels: LogLevel[]) {
    this.worker = new Worker(new URL('../../../../public/workers/LoggerWorker/index.js', import.meta.url), { type: 'module' });
    this.logLevels = _logLevels;
  }

  assert(condition: boolean, fn: () => void): void {
    this.worker.postMessage({ domain: this.currentDomain, type: 'assert', condition, fn: fn.toString() });
  }

  group(name: string, fn: () => void, collapsed: boolean = true): void {
    this.worker.postMessage({ domain: this.currentDomain, type: 'group', name, collapsed, fn: fn.toString() });
  }

  log(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('log')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'log', message, args });
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('error')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'error', message, args });
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('info')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'info', message, args });
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('debug')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'debug', message, args });
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('trace')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'trace', message, args });
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('warn')) {
      this.worker.postMessage({ domain: this.currentDomain, type: 'warn', message, args });
    }
  }
}
