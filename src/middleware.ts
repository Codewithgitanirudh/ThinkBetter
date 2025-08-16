// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // Protected paths
  if (path.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Auth paths
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};