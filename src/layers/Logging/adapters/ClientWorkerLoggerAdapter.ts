import { ClientLoggingFeature } from '@/layers/Configuration';
import { FeatureService } from '@/layers/Feature';

import { Logger } from '../interfaces';
import { LogLevel } from '../types';


export class ClientWorkerLoggerAdapter implements Logger {
  private readonly worker: Worker;
  private readonly logLevels: LogLevel[];

  constructor(private readonly featureService: FeatureService) {
    this.worker = new Worker(new URL('/workers/loggerWorker.js', import.meta.url), { type: 'module' });
    const feature = this.featureService.getFeature<ClientLoggingFeature>('clientLogging');
    this.logLevels = (feature?.logLevels as LogLevel[]) || [];
  }

  assert(condition: boolean, fn: () => void): void {
    this.worker.postMessage({ type: 'assert', condition, fn: fn.toString() });
  }

  group(name: string, fn: () => void, collapsed: boolean = true): void {
    this.worker.postMessage({ type: 'group', name, collapsed, fn: fn.toString() });
  }

  log(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('log')) {
      this.worker.postMessage({ type: 'log', message, args });
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('error')) {
      this.worker.postMessage({ type: 'error', message, args });
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('info')) {
      this.worker.postMessage({ type: 'info', message, args });
    }
  }
  debug(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('debug')) {
      this.worker.postMessage({ type: 'debug', message, args });
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('trace')) {
      this.worker.postMessage({ type: 'trace', message, args });
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.logLevels.includes('warn')) {
      this.worker.postMessage({ type: 'warn', message, args });
    }
  }
}
