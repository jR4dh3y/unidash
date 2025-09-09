/// <reference types="next" />
/// <reference types="next/image" />

namespace NodeJS {
  interface ProcessEnv {
    readonly CONVEX_DEPLOYMENT: string;
    readonly CONVEX_URL: string;
  readonly NEXT_PUBLIC_CLERK_JWT_TEMPLATE?: string;
  }
}
