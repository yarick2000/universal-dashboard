import { LogMessage } from '../types';

export interface LoggerAdapter {
  log<T>(data: LogMessage<T> | LogMessage<T>[]): Promise<void>;
  initialize?(): Promise<void>;
  dispose?(): Promise<void>;
};

export interface LoggerInfoProvider {
  populateWithInfo<T>(message: LogMessage<T>): LogMessage<T>;
}

export interface Logger {
  log<T>(message: string, args?: T): Promise<void>;
  info<T>(message: string, args?: T): Promise<void>;
  warn<T>(message: string, args?: T): Promise<void>;
  error<T>(message: string, args?: T): Promise<void>;
  debug<T>(message: string, args?: T): Promise<void>;
  trace<T>(message: string, args?: T): Promise<void>;
}

export interface LoggerService extends Logger {
  bulk(logMessages: LogMessage<unknown>[]): Promise<void>;
  dispose(): Promise<void>;
  initialize(): Promise<void>;
}
