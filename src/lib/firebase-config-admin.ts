import * as admin from 'firebase-admin';

// Check if all required environment variables are present
const hasAllCredentials = 
  process.env.NEXT_PUBLIC_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length && hasAllCredentials) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else if (!hasAllCredentials) {
    console.warn('Firebase Admin credentials are not fully set in environment variables. Admin features will be disabled.');
}

export const auth = admin.auth();
export const db = admin.firestore();
