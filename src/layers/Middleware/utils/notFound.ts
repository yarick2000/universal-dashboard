import { NextRequest, NextResponse } from 'next/server';

export function notFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/not-found';
  return NextResponse.rewrite(url, { status: 404 });
}
