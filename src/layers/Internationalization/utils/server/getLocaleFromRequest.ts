import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';

import { i18nService } from '@/index';

import { localeFromPath } from '..';

/**
 * Current detection strategy is 1) cookie, 2) user agent, 3) default (from path or config)
 * @param request Next.js request object
 * @param cookieName string name of the cookie to check
 * @returns string locale
 */
export function getLocaleFromRequest(request: NextRequest): string {
  let locale = null;
  const defaultLocale = i18nService.getDefaultLocale();
  const cookieName = i18nService.getCookieName();
  const locales = i18nService.getSupportedLocales();
  // Cookie detection first
  if (request.cookies.has(cookieName)) {
    locale = request?.cookies?.get(cookieName)?.value;
    // Double check that the cookie value is actually a valid
    // locale (it may have been 'fiddled' with)
    if (locale != null && !locales.includes(locale)) {
      locale = null;
    }
  }

  // Path detection second
  if (!locale) {
    const pathname = request.nextUrl.pathname;
    locale = localeFromPath(pathname);
  }

  // Browser / user agent locales 3rd
  if (!locale) {
    // NOTE: @formatjs/intl-localematcher will fail with RangeError: Incorrect locale information provided
    // of there is no locale information in the request (for example when benchmarking the application)
    try {
      // Negotiator expects plain object so we need to transform headers
      const negotiatorHeaders: Record<string, string> = {};
      request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

      const negotiator = new Negotiator({ headers: negotiatorHeaders });

      const browserLanguages = negotiator.languages();
      locale = match(browserLanguages, locales, defaultLocale);
    } catch {
      locale = defaultLocale;
    }
  }

  if (!locale) {
    locale = defaultLocale;
  }

  return locale;
}
