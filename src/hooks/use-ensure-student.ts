'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';

/**
 * useEnsureStudent
 * Calls the Convex students.ensureStudent mutation once per sign-in to
 * create/sync the student record in the database.
 */
export function useEnsureStudent() {
  const { isSignedIn, isLoaded, user } = useUser();
  const ensureStudent = useMutation(api.students.ensureStudent);
  const lastEnsuredForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const id = user?.id ?? null;

    if (isSignedIn && id && lastEnsuredForUser.current !== id) {
      ensureStudent({
        userId: id,
        name: user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User',
        avatar: user?.imageUrl || undefined,
      }).catch(() => {
        // silent: UI doesn't block on provisioning
      });
      lastEnsuredForUser.current = id;
    }

    if (!isSignedIn) {
      lastEnsuredForUser.current = null;
    }
  }, [isLoaded, isSignedIn, user?.id, ensureStudent]);
}
