import { baseName, fileURLToPath } from '@/utils';

import { LoggerService } from '..';

export function createLogger(loggerService: LoggerService, metaUrl: string) {
  let baseFile: string;

  try {
    baseFile = baseName(fileURLToPath(new URL(metaUrl)));
  } catch {
    baseFile = baseName(metaUrl);
  }

  function formatMessage(message: string) {
    return `[${baseFile}] ${message}`;
  }

  return {
    log: async (message: string, args: unknown) =>
      await loggerService.log(formatMessage(message), args),
    info: async (message: string, args: unknown) =>
      await loggerService.info(formatMessage(message), args),
    error: async (message: string, args: unknown) =>
      await loggerService.error(formatMessage(message), args),
    warn: async (message: string, args: unknown) =>
      await loggerService.warn(formatMessage(message), args),
    debug: async (message: string, args: unknown) =>
      await loggerService.debug(formatMessage(message), args),
    trace: async (message: string, args: unknown) =>
      await loggerService.trace(formatMessage(message), args),
  };
}
