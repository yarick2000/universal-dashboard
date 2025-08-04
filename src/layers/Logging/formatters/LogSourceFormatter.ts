import { isClient } from '@/utils';

import { LoggerFormatter } from '../interfaces';

export class LogSourceFormatter implements LoggerFormatter {
  format(message: string, ...args: unknown[]): { message: string; args: unknown[] } {
    const logSource = isClient() ? 'CLIENT' : 'SERVER';
    const formattedMessage = `${logSource}: ${message}`;
    return {
      message: formattedMessage,
      args,
    };
  }
};
