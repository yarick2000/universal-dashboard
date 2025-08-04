import { LoggerFormatter } from '../interfaces';

export class TimeStampFormatter implements LoggerFormatter {
  format(message: string, ...args: unknown[]): { message: string; args: unknown[] } {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}]: ${message}`;
    return {
      message: formattedMessage,
      args,
    };
  }
};
