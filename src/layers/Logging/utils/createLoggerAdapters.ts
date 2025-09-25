import { DI } from '@/enums';
import { SupabaseDataClient } from '@/layers/Data';
import { FeatureService } from '@/layers/Feature';
import { isClient, isServer } from '@/utils/system';

import { LoggerAdapter } from '../interfaces';

export function createLoggerAdapters(
  supabaseClient: SupabaseDataClient,
  featureService: FeatureService,
): () => Promise<LoggerAdapter[]> {
  return async () => {
    const adapters: LoggerAdapter[] = [];
    if (isClient()) {
      const clientAdapters = (await import('./createClientLoggerAdapters')).default(featureService);
      adapters.push(...clientAdapters);
    } else if (isServer() && process.env.NEXT_RUNTIME === 'nodejs') {
      const serverAdaptersModule = await import('./createServerLoggerAdapters');
      const serverAdapters = serverAdaptersModule.default(supabaseClient, featureService);
      adapters.push(...serverAdapters);
    }
    return adapters;
  };
};

createLoggerAdapters.inject = [DI.SupabaseDataClient, DI.FeatureService] as const;
