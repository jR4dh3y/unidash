# Unidash

A small student leaderboard and events dashboard built with Next.js, Convex, and Clerk.

## Stack
- Next.js 15 + React 18 + TypeScript
- Convex (data + serverless functions)
- Clerk (authentication)
- Tailwind CSS + shadcn/ui
- Recharts (charts)

## Environment variables
Create `.env.local` with:

- NEXT_PUBLIC_CONVEX_URL=
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
- CLERK_SECRET_KEY=
- NEXT_PUBLIC_ADMIN_UID=  # Clerk userId allowed to access /admin

Optional: In Clerk, add a JWT template named "convex" for Convex auth. The app has a safe fallback for local dev.

## Quick start
1) Install deps

```bash
npm install
```

2) Run dev server

```bash
npm run dev
```

3) Seed sample data (optional)
- Sign in, open `/admin`, click "Seed Database".

## Deploy
- Host the Next.js app on Vercel.
- Use Convex Hosted for the backend (copy the Convex URL to env).
- Use Clerk for auth (set publishable/secret keys and admin UID).

---
Troubleshooting: If profiles show but achievements are empty, seed data in `/admin` or award points to generate history and achievements.
---
note :  this started as a firebase project but switched to convex as its just easier to work with and i dont have to give my card info.
ps :  if u find random firebase references create issues for them. 
