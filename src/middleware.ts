import { MiddlewareConfig, NextResponse } from 'next/server';

export const config: MiddlewareConfig = {
  matcher:['/((?!api|_next_|_vercel).*)'],
};

export function middleware() {
  return NextResponse.next();
  // Your middleware logic here
}
