import { DI } from '@/enums';
import { ApiDataClient, SupabaseDataClient } from '@/layers/Data';
import { LoggerService } from '@/layers/Logging';
import { isServer } from '@/utils/system';

import { LocalApiLocalizationDataAdapter, SupabaseLocalizationDataAdapter } from '../adapters';
import { LocalizationDataAdapter } from '../interfaces';

export function createLocalizationDataAdapter(
  localApiDataClient: ApiDataClient | null,
  supabaseClient: SupabaseDataClient | null,
  loggerService: LoggerService,
): LocalizationDataAdapter {
  if (isServer()) {
    return new SupabaseLocalizationDataAdapter(supabaseClient, loggerService);
  } else {
    return new LocalApiLocalizationDataAdapter(localApiDataClient, loggerService);
  }
}

createLocalizationDataAdapter.inject = [
  DI.LocalApiDataClient,
  DI.SupabaseDataClient,
  DI.LoggerService,
] as const;
