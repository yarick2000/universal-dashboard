import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

import { MiddlewareFactory } from '../types';

export const withDomains: MiddlewareFactory = (next) => {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const hostname = req.headers.get('host');
    const [domain] = (hostname ?? '').split(':');
    // If running locally, allow all domains
    if (domain === 'localhost' || domain === '127.0.0.1') {
      return await next(req, event);
    }

    // Define allowed domains
    const hostedDomain = process.env.NEXT_PUBLIC_BASE_URL!.replace(/http:\/\/|https:\/\//, '');
    const hostedDomains = [hostedDomain, `www.${hostedDomain}`];
    // do not allow if domain is not in the list of hosted domains
    if (!domain || !hostedDomains.includes(domain)) {
      return NextResponse.rewrite(new URL('/domain-not-found', req.url));
    }
    return await next(req, event);
  };
};
