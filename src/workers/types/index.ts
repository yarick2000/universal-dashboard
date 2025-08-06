export type WorkerMessage = {
  domain: string;
  type: 'group' | 'assert' | 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
  message: string;
  args: unknown[];
};

