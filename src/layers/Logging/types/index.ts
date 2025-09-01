export type LogLevel = 'trace' | 'debug' | 'log' | 'info' | 'warn' | 'error';

export type LogMessage<T> = {
  level: LogLevel;
  message: string;
  timestamp: number;
  source: 'client' | 'server';
  info?: object;
  args?: T;
};
