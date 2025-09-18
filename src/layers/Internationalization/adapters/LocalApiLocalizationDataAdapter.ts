import { ApiDataClient } from '@/layers/Data';
import { Logger, LoggerService } from '@/layers/Logging';
import { createLogger } from '@/layers/Logging/utils';

import { LocalizationDataAdapter } from '../interfaces';

export class LocalApiLocalizationDataAdapter implements LocalizationDataAdapter {
  private readonly logger: Logger;
  constructor(
    private readonly localApiDataClient: ApiDataClient | null,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = createLogger(this.loggerService, import.meta.url);
  }

  async getMessages<T>(locale: string): Promise<T | null> {
    if (!this.localApiDataClient) {
      await this.logger.error('Local API Data Client is not initialized!');
      return null;
    }
    try {
      const messages = await this.localApiDataClient.get<T, null>(`/translations/${locale}`);
      return messages ?? null;
    } catch (error) {
      await this.logger.error(`Error fetching locale messages for locale ${locale}`, error);
      return null;
    }
  }
}
