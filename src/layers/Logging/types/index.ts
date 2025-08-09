export type LogLevel = 'trace' | 'debug' | 'log' | 'info' | 'warn' | 'error';

export type ClientSideLogMessage = {
  source: 'client';
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
  message: string;
  args: unknown;
  browserInfo: unknown;
};
