
import { auth } from '@/lib/firebase-config-admin';
import { cookies } from 'next/headers';

export async function getAuthenticatedUser() {
    if (!auth) return null;
    try {
        const token = cookies().get('token')?.value;
        if (!token) return null;
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        // This can happen if the token is expired or invalid.
        // It's a normal part of the auth flow.
        console.log('Token verification failed:', (error as Error).message);
        return null;
    }
}
