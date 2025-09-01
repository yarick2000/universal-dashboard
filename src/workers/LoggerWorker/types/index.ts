export type LoggerWorkerMessage<T> = {
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
  data: T;
};

export type LoggerWorkerInitMessage = {
  type: 'init';
  batchSize: number;
  idleTime: number;
};

export type LoggerWorkerDisposeMessage = {
  type: 'dispose';
};
