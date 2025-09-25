import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { i18nService } from '@/index';
import { getLocaleFromRequest } from '@/layers/Internationalization/utils/server';
import { replaceFirst } from '@/utils/string';

import type { MiddlewareFactory } from '../types';

export const withI18n: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    const supportedLocales = i18nService.getSupportedLocales();
    const locale = getLocaleFromRequest(request);
    const defaultLocale = i18nService.getDefaultLocale();
    const localeInPath = supportedLocales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);

    if (!localeInPath) {
      const trailingSlash = pathname === '/' ? '' : '/';
      let path = `/${locale}${trailingSlash}${pathname}`;
      if (request.nextUrl.search) {
        path += request.nextUrl.search;
      }
      if (locale === defaultLocale) {
        return Promise.resolve(NextResponse.redirect(new URL(path, request.url), 302));
      } else {
        return Promise.resolve(NextResponse.redirect(new URL(path, request.url), 302));
      }
    } else {
      // We have a locale in the URL, so check to see it matches
      // the detected locale from getLocale above.
      if (localeInPath !== locale) {
        let path: string = pathname;
        if (locale === defaultLocale) {
          path = pathname.startsWith(`/${localeInPath}/`)
            ? replaceFirst(pathname, `/${localeInPath}`, '')
            : replaceFirst(pathname, `/${localeInPath}`, '/');
          if (request.nextUrl?.search != null) {
            path += request.nextUrl.search;
          }
        } else {
          path = pathname.startsWith(`/${localeInPath}/`)
            ? replaceFirst(pathname, `/${localeInPath}`, locale)
            : replaceFirst(pathname, `/${localeInPath}`, `/${locale}`);
          if (request.nextUrl?.search != null) {
            path += request.nextUrl.search;
          }
        }
        return Promise.resolve(NextResponse.redirect(new URL(path, request.url), 302));
      } else {
        return await next(request, event);
      }
    };
  };
};

