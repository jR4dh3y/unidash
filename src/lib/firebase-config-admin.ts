import * as admin from 'firebase-admin';

let auth: admin.auth.Auth | null = null;
let db: admin.firestore.Firestore | null = null;

try {
  const hasAllCredentials =
    process.env.NEXT_PUBLIC_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

  if (admin.apps.length === 0 && hasAllCredentials) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    auth = admin.auth();
    db = admin.firestore();
  } else if (!hasAllCredentials) {
    console.warn(
      'Firebase Admin credentials are not fully set in environment variables. Admin features will be disabled.'
    );
  } else if (admin.apps.length > 0 && admin.app()) {
    auth = admin.auth();
    db = admin.firestore();
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

export { auth, db };
