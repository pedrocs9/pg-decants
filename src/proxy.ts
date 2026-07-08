import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (req.auth.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: ['/mi-cuenta/:path*', '/admin/:path*'],
};