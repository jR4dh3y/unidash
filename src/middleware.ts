
import { NextResponse, type NextRequest } from 'next/server';

// This middleware function is empty and just passes the request through.
// The session logic is now handled by the API route.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  /*
    Match all request paths except for the ones starting with:
      api (API routes)
      _next/static (static files)
      _next/image (image optimization files)
      favicon.ico (favicon file)
   */
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
