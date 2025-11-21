import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization');

  const isAuth = !!token;
  const isLogin = request.nextUrl.pathname.startsWith('/auth/login');

  if (!isAuth && !isLogin) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuth && isLogin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
