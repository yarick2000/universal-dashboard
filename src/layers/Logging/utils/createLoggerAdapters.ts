import { DI } from '@/enums';
import { FeatureService } from '@/layers/Feature';
import { isClient, isServer } from '@/utils';

import { Logger } from '../interfaces';

export function createLoggerAdapters(featureService: FeatureService): () => Promise<Logger[]> {
  return async () => {
    const adapters: Logger[] = [];
    if (isClient()) {
      const clientAdapters = (await import('./createClientLoggerAdapters')).default(featureService);
      adapters.push(...clientAdapters);
    } else if (isServer() && process.env.NEXT_RUNTIME === 'nodejs') {
      const serverAdapters = (await import('./createServerLoggerAdapters')).default(featureService);
      adapters.push(...serverAdapters);
    }
    return adapters;
  };
};

createLoggerAdapters.inject = [DI.FeatureService] as const;
