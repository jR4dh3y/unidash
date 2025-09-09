declare module 'convex/server' {
  export const query: any;
  export const mutation: any;
  export const defineSchema: any;
  export const defineTable: any;
}

declare module 'convex/values' {
  export const v: any;
}

declare module '@convex-dev/auth/server' {
  export const defineAuth: any;
}

declare module '@convex-dev/auth/clerk' {
  export const clerk: any;
}
