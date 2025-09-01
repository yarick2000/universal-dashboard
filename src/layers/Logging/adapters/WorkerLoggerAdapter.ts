import { recordClientSideLogs } from '@/app/actions';

import { Logger } from '../interfaces';
import { LogLevel, LogMessage } from '../types';

export class WorkerLoggerAdapter implements Logger {
  private readonly worker: Worker | null = null;

  constructor(
    private readonly logLevels: LogLevel[],
    private readonly batchSize: number,
    private readonly idleTime: number,
  ) {
    this.worker = new Worker(
      new URL('../../../../public/workers/LoggerWorker.js', import.meta.url),
      { type: 'module' },
    );
  }

  async initialize(): Promise<void> {
    this.worker?.postMessage({ type: 'init', batchSize: this.batchSize, idleTime: this.idleTime });
    this.worker?.addEventListener('message', this.handleWorkerMessage.bind(this));
    await Promise.resolve();
  }

  async dispose(): Promise<void> {
    this.worker?.postMessage({ type: 'dispose' });
    await Promise.resolve();
  }

  async log<T>(data: LogMessage<T> | LogMessage<T>[]): Promise<void> {
    if (Array.isArray(data)) {
      const filteredMessages = data.filter(msg => this.logLevels.includes(msg.level));
      this.worker?.postMessage({ type: 'log', data: filteredMessages });
    } else {
      if (!this.logLevels.includes(data.level)) {
        return;
      }
      this.worker?.postMessage({ type: 'log', data });
    }
    await Promise.resolve();
  }

  private handleWorkerMessage(event: MessageEvent<LogMessage<unknown>[]>): void {
    void recordClientSideLogs(event.data);
  }
}
