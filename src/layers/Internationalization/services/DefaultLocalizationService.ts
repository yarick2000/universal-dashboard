import { merge } from 'ts-deepmerge';

import { DI } from '@/enums';
import { ConfigService } from '@/layers/Configuration';
import { Logger, LoggerService } from '@/layers/Logging';
import { createLogger } from '@/layers/Logging/utils';
import { isServer } from '@/utils';
import localMessages from '@root/locales/default.json';

import { LocalizationDataAdapter, LocalizationService } from '../interfaces';

export class DefaultLocalizationService implements LocalizationService {
  private readonly logger: Logger;
  constructor(
    private readonly loggingService: LoggerService,
    private readonly configService: ConfigService,
    private readonly localizationDataAdapter: LocalizationDataAdapter,
  ) {
    this.logger = createLogger(this.loggingService, import.meta.url);
  }

  getCookieName(): string {
    return this.configService.get('i18n.cookieName');
  }

  getDefaultLocale(): string {
    return this.configService.get('i18n.defaultLocale');
  }

  getSupportedLocales(): string[] {
    return this.configService.get('i18n.locales');
  }

  async getMessages<T extends { [key: string]: unknown }>(locale: string): Promise<T> {
    if (isServer()) {
      // using default messages from default.json as a fallback
      const defaultLocale = this.getDefaultLocale();
      let defaultMessages = localMessages as unknown as T;
      try {
        // load default messages from default locale (that will override those that were loaded from default.json)
        const defaultLocaleMessages = await this.localizationDataAdapter.getMessages<T>(defaultLocale);
        // merge default messages with default locale messages (default locale on top of default)
        defaultMessages = merge(
          defaultMessages,
          defaultLocaleMessages ?? {},
        ) as T;
      } catch (error) {
        await this.logger.error(`Error loading locale messages for default locale ${defaultLocale}`, error);
      }
      try {
        // load messages for the specific locale
        const localeMessages = await this.localizationDataAdapter.getMessages<T>(locale);
        // merge default messages with locale messages (locale on top of default)
        const mergedMessages = merge(
          defaultMessages,
          localeMessages ?? {},
        ) as T;
        return mergedMessages;
      } catch (error) {
        await this.logger.error(`Error loading locale messages on server side for ${locale}`, error);
        // return default messages if locale messages are not available/failed
        return defaultMessages;
      }
    }
    else {
      try {
        const messages = await this.localizationDataAdapter.getMessages<T>(locale);
        return messages ?? {} as T;
      } catch (error) {
        await this.logger.error(`Error fetching remote messages on client side for locale ${locale}`, error);
        return {} as T;
      }
    }
  }

  static inject = [DI.LoggerService, DI.ConfigService, DI.LocalizationDataAdapter] as const;
}
