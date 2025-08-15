export type LoggerWorkerMessage<T> = {
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
  message: string;
  args: T;
};

export type LoggerWorkerInitMessage = {
  type: 'init';
  batchSize: number;
  idleTime: number;
};

export type LoggerWorkerDisposeMessage = {
  type: 'dispose';
};
