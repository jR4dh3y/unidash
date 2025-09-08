/// <reference types="next" />
/// <reference types="next/image" />

namespace NodeJS {
  interface ProcessEnv {
    readonly CONVEX_DEPLOYMENT: string;
    readonly CONVEX_URL: string;
  }
}
