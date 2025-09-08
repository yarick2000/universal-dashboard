import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { i18nService } from '@/index';
import { replaceFirst } from '@/utils';

export const config = {
  matcher: ['/((?!api|_next|_vercel|robots.txt|favicon.ico).*)'],
  runtime: 'nodejs',
};

function processLocale(
  request: NextRequest,
  supportedLocales: string[],
  locale: string,
) {
  if (!locale) {
    // if there is no locale in the path, redirect to the default locale
    const defaultLocale = i18nService.getDefaultLocale();
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${request.nextUrl.pathname}`, request.url),
      302,
    );
  }
  if (!supportedLocales.includes(locale)) {
    // try to redirect to the same page with the lowercase locale
    if (supportedLocales.includes(locale.toLowerCase())) {
      const path = replaceFirst(
        request.nextUrl.pathname,
        `/${locale}`,
        `/${locale.toLowerCase()}`,
      );
      return NextResponse.redirect(new URL(path, request.url), 301);
    } else {
      // otherwise, if the locale wasn't found at all in the list of supported locales, redirect to 404 page
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }
}

export default function middleware(request: NextRequest) {
  const supportedLocales = i18nService.getSupportedLocales();
  const locale = request.nextUrl.pathname.split('/')[1];
  const response = processLocale(request, supportedLocales, locale);
  if (response) return response;

  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: supportedLocales,
    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: i18nService.getDefaultLocale(),
    localeDetection: false,
  });
  return handleI18nRouting(request);
}
