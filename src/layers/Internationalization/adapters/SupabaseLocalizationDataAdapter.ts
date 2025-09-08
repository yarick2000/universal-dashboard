import { SupabaseDataClient } from '@/layers/Data';
import { Logger, LoggerService } from '@/layers/Logging';
import { createLogger } from '@/layers/Logging/utils';

import { LocalizationDataAdapter } from '../interfaces';
import { convertDataArrayToTranslationsObject } from '../utils';

export class SupabaseLocalizationDataAdapter implements LocalizationDataAdapter {
  private readonly logger: Logger;

  constructor(
    private readonly supabaseClient: SupabaseDataClient | null,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = createLogger(this.loggerService, import.meta.url);
  }

  async getMessages<T>(
    locale: string,
  ): Promise<T | null> {
    if (!this.supabaseClient) {
      await this.logger.error('Supabase client is not initialized!');
      return null;
    }
    try {
      const { data, error } = await this.supabaseClient
        .from('translations')
        .select('*')
        .eq('locale', locale);
      if (error) {
        await this.logger.error('Error fetching locale messages', error);
        return null;
      }
      if (data) {
        const messages = convertDataArrayToTranslationsObject(
          'label',
          'value',
          data as unknown as Record<string, string>[],
        ) as T;
        return messages;
      }
      return null;
    } catch (error) {
      await this.logger.error('Unexpected error fetching locale messages', error);
      return null;
    }
  }
}
