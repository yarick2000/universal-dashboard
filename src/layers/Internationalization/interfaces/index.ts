export interface LocalizationService {
  getDefaultLocale(): string;
  getMessages<T extends { [key: string]: unknown }>(
    locale: string
  ): Promise<T>;
  getDefaultMessages<T extends { [key: string]: unknown }>(): T;
  getSupportedLocales(): string[];
  getCookieName(): string;
}

export interface LocalizationDataAdapter {
  getMessages<T>(
    locale: string
  ): Promise<T | null>;
}
