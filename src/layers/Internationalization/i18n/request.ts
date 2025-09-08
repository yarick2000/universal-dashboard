import { getRequestConfig } from 'next-intl/server';

import { i18nService } from '@/index';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  // Ensure that the incoming locale is valid
  if (!locale || !i18nService.getSupportedLocales().includes(locale)) {
    locale = i18nService.getDefaultLocale();
  }
  return {
    locale,
    messages: await i18nService.getMessages<IntlMessages>(locale),
  };
});
