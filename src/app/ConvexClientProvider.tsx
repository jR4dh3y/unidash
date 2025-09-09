"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useEnsureStudent } from "@/hooks/use-ensure-student";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const CLERK_JWT_TEMPLATE = process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE || "convex";

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
      return await auth.getToken({ template: CLERK_JWT_TEMPLATE, ...(options || {}) });
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
        `Clerk JWT template '${CLERK_JWT_TEMPLATE}' not found. Proceeding without auth token. Configure it in Clerk → JWT Templates.`
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
