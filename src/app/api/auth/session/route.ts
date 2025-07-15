
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-config-admin';

// This route is responsible for creating a session cookie for the authenticated user.
// It receives the ID token from the client, verifies it, and sets a secure, http-only cookie.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    if (!auth) {
      throw new Error("Admin auth is not initialized.");
    }
    
    // Set session expiration to 1 hour.
    const expiresIn = 60 * 60 * 1000;
    
    // Create the session cookie. This will also verify the ID token.
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const options = {
      name: 'token',
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set(options);

    return response;

  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}

// This route handles session logout.
// It clears the session cookie.
export async function DELETE(request: NextRequest) {
  const options = {
    name: 'token',
    value: '',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  };
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set(options);
  return response;
}
