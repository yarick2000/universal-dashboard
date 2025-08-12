export type LogLevel = 'trace' | 'debug' | 'log' | 'info' | 'warn' | 'error';

export type LogMessage<T> = {
  level: LogLevel;
  message: string;
  timestamp: number;
  args?: T;
};

export type ClientSideLogMessage<T> = LogMessage<T> & {
  source: 'client';
  browserInfo: unknown;
};

export type ServerSideLogMessage<T> = LogMessage<T> & {
  source: 'server';
  requestId: string;
};
