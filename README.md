# Unidash

A small student leaderboard and events dashboard.

## Stack
- Next.js 15 + React 18 + TypeScript
- Convex (data + serverless functions)
- Clerk (authentication)
- Tailwind CSS + shadcn/ui
- Recharts (charts)

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
- you need to set admin uid in env

## Deploy
- Host the Next.js app on Vercel.
- Use Convex Hosted for the backend (copy the Convex URL to env).
- Use Clerk for auth (set publishable/secret keys and admin UID).

---
- Troubleshooting: If profiles show but achievements are empty, seed data in `/admin` or award points to generate history and achievements.
---
- note :  this started as a firebase project but switched to convex as its just easier to work with and i dont have to give my card info.
- ps :  if u find random firebase references create issues for them. 
