"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignIn
        appearance={{ variables: { colorPrimary: "hsl(25, 95%, 53%)" } }}
        forceRedirectUrl="/"
      />
    </div>
  );
}
