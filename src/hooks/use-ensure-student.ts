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
  const retryTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const id = user?.id ?? null;

    const attempt = () => {
      if (!id) return;
      ensureStudent({
        userId: id,
        name: user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User',
        avatar: user?.imageUrl || undefined,
      })
        .then(() => {
          lastEnsuredForUser.current = id;
        })
        .catch(() => {
          // Best-effort: if auth propagation lag occurs, retry once shortly
          if (!retryTimer.current) {
            retryTimer.current = setTimeout(() => {
              retryTimer.current = null;
              ensureStudent({
                userId: id,
                name: user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User',
                avatar: user?.imageUrl || undefined,
              }).catch(() => {
                /* swallow */
              });
            }, 500);
          }
        });
    };

    if (isSignedIn && id && lastEnsuredForUser.current !== id) {
      attempt();
    }

    if (!isSignedIn) {
      lastEnsuredForUser.current = null;
    }
  }, [isLoaded, isSignedIn, user?.id, ensureStudent]);
}
