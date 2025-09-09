"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useEnsureStudent } from "@/hooks/use-ensure-student";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // jwt templet messing for clerk 
  const useAuth = () => {
    const auth = useClerkAuth();
    return {
      ...auth,
      getToken: async (options?: Parameters<typeof auth.getToken>[0]) => {
        try {
          return await auth.getToken({ template: "convex", ...(options || {}) });
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              "Clerk JWT template 'convex' not found. Proceeding without auth token. Configure it in Clerk → JWT Templates."
            );
          }
          return null;
        }
      },
    } as typeof auth;
  };
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* Ensure student provisioning runs inside both providers */}
        <EnsureStudent>{children}</EnsureStudent>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function EnsureStudent({ children }: { children: React.ReactNode }) {
  useEnsureStudent();
  return <>{children}</>;
}
