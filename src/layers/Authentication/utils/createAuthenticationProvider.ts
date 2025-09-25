import { DI } from '@/enums';
import { SupabaseDataClient } from '@/layers/Data';
import { LoggerService } from '@/layers/Logging';
import { isClient, isServer } from '@/utils/system';

import { AuthenticationProvider } from '../interfaces';

export function createAuthenticationProvider(
  loggerService: LoggerService,
  supabaseDataClient: SupabaseDataClient,

): () => Promise<AuthenticationProvider | null | undefined> {
  return async () => {
    if (isClient()) {
      return null;
    } else if (isServer() && process.env.NEXT_RUNTIME === 'nodejs') {
      const providerModule = await import('../providers/DefaultAuthenticationProvider');
      const provider = new providerModule.default(loggerService, supabaseDataClient);
      return provider;
    }
  };
}

createAuthenticationProvider.inject = [DI.LoggerService, DI.SupabaseDataClient] as const;
