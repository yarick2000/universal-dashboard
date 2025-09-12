import { DI } from '@/enums';
import { SupabaseDataClient } from '@/layers/Data';
import { LoggerService } from '@/layers/Logging';
import { isClient } from '@/utils';

import { AuthenticationProvider } from '../interfaces';
import { DefaultAuthenticationProvider } from '../providers';

export function createAuthenticationProvider(
  loggerService: LoggerService,
  supabaseDataClient: SupabaseDataClient,

): AuthenticationProvider | null {
  if (isClient()) {
    return null;
  }
  const provider = new DefaultAuthenticationProvider(loggerService, supabaseDataClient);
  return provider;
}

createAuthenticationProvider.inject = [DI.LoggerService, DI.SupabaseDataClient] as const;
