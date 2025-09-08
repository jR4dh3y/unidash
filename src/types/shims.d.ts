declare module 'convex/react' {
  export const useQuery: any;
  export const useMutation: any;
  export class ConvexReactClient {
    constructor(address?: any, options?: any);
  }
}

declare module 'convex/react-clerk' {
  export const ConvexProviderWithClerk: any;
}

declare module 'convex/server' {
  export const query: any;
  export const mutation: any;
}

declare module 'convex/values' {
  export const v: any;
}

declare module 'convex/_generated/dataModel' {
  export type Doc<T extends string = string> = any;
}

declare module '@clerk/nextjs' {
  export const ClerkProvider: any;
  export const useAuth: any;
  export const useUser: any;
  export const useClerk: any;
  export const SignIn: any;
}
