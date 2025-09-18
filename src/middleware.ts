import { chainMiddleware, withI18n } from '@/middleware/index.ts';

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|robots.txt|favicon.ico|.*\\.[^/]+$).*)',
  ],
  runtime: 'nodejs',
};

export default chainMiddleware([ withI18n]);

export { auth as middleware } from '@/auth';

