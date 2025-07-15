
import { NextResponse, type NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Try to get token from Authorization header first
  let token = request.headers.get('Authorization')?.split('Bearer ')[1];

  // If not in header, try to get it from cookies
  if (!token) {
    token = request.cookies.get('token')?.value;
  }

  const response = NextResponse.next({
    request: {
      // New headers for the onward request
      headers: request.headers,
    },
  });

  // If a token was found (from either source), set it in a secure, http-only cookie
  // This is the primary way our server-side components will access it
  if (token) {
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
  }

  return response;
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
