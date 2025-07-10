import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (idToken) {
    const response = NextResponse.next();
    response.cookies.set('token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
