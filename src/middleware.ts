import { chainMiddleware, withDomains, withI18n } from '@/layers/Middleware';

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|robots.txt|favicon.ico|not-found|.*\\.[^/]+$).*)',
  ],
  runtime: 'nodejs',
};

export default chainMiddleware([withDomains, withI18n]);

export { auth as middleware } from '@/auth';

