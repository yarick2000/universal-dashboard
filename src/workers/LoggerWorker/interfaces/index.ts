import { LoggerWorkerInitMessage, LoggerWorkerMessage } from '../types';

export interface LoggerWorker {
  postMessage<T>(message: LoggerWorkerMessage<T> | LoggerWorkerInitMessage): void;
  onmessage<T>(callback: (message: LoggerWorkerMessage<T>[]) => void): void;
}
