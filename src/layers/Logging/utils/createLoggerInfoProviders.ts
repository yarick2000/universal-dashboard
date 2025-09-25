import { isClient } from '@/utils/system';

import { LoggerInfoProvider } from '../interfaces';

export function createLoggerInfoProviders(): () => Promise<LoggerInfoProvider[]> {
  return async () => {
    const providers: LoggerInfoProvider[] = [];
    if (isClient()) {
      const clientInfoProvider = new (await import('../providers/ClientInfoProvider')).default();
      providers.push(clientInfoProvider);
    }
    return providers;
  };
}

createLoggerInfoProviders.inject = [] as const;
