import { NextRequest } from 'next/server';

import { i18nService, loggerService } from '@/index';
import { createLogger } from '@/layers/Logging/utils';

export async function GET(_request: NextRequest,{ params }: { params: Promise<{ locale: string }> }) {
  const logger = createLogger(loggerService, import.meta.url);
  const { locale } = await params;
  const supportedLocales = i18nService.getSupportedLocales();
  if (!supportedLocales.includes(locale)) {
    return new Response('Locale not supported', { status: 404 });
  }
  try {
    const messages = await i18nService.getMessages(locale);
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    await logger.error('Failed to retrieve messages', error);
    return new Response('Failed to retrieve messages', { status: 500 });
  }
}
