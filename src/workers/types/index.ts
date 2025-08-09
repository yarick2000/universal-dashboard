export type WorkerMessage = {
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
  message: string;
  args: unknown;
};

export type WorkerInitMessage = {
  type: 'init';
  batchSize: number;
  idleTime: number;
};
