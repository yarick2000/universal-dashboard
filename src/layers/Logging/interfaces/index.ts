export interface Logger {
  log<T>(message: string, args: T): void;
  info<T>(message: string, args: T): void;
  warn<T>(message: string, args: T): void;
  error<T>(message: string, args: T): void;
  debug<T>(message: string, args: T): void;
  trace<T>(message: string, args: T): void;
};
