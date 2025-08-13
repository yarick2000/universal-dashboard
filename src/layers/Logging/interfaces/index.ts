import { LogMessage } from '../types';

export interface Logger {
  log<T>(message: string, args: T): void;
  info<T>(message: string, args: T): void;
  warn<T>(message: string, args: T): void;
  error<T>(message: string, args: T): void;
  debug<T>(message: string, args: T): void;
  trace<T>(message: string, args: T): void;
  bulk(logMessages: LogMessage<unknown>[]): Promise<void>;
  dispose?(): void;
};

export interface LoggerService {
  log<T>(message: string, args: T): Promise<void>;
  info<T>(message: string, args: T): Promise<void>;
  warn<T>(message: string, args: T): Promise<void>;
  error<T>(message: string, args: T): Promise<void>;
  debug<T>(message: string, args: T): Promise<void>;
  trace<T>(message: string, args: T): Promise<void>;
  bulk(logMessages: LogMessage<unknown>[]): Promise<void>;
  dispose(): Promise<void>;
  initialize(): Promise<void>;
}
