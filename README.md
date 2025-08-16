
# Farcaster Flappy – Mini App

A simple Flappy Bird–style game packaged as a Farcaster Mini App.
- Sign in with Farcaster via `@farcaster/miniapp-sdk`
- Submit score and show a leaderboard
- Two deployment modes: **Node server** or **Vercel serverless**

## 1) Local Dev (Node)
```bash
npm install
npm run dev
# open http://localhost:3000
```

## 2) Deploy to Render/Railway/Any Node host
- Deploy this repo as a Node app (entry: `server.js`).
- Persistence uses a local `db.json` (simple demo). For production, swap to Postgres/Upstash Redis.

## 3) Deploy to Vercel (Serverless) – Demo
- The `api/` directory contains serverless functions:
  - `api/score.js` (POST: { fid:number, score:number })
  - `api/leaderboard.js` (GET)
- **Note:** Leaderboard is in-memory per serverless instance and may reset.
- Put this repo on Vercel. Set your base URL (see below).

## Farcaster Manifest
Update both places with your public base URL (https://yourdomain.com):
- `public/index.html` → replace `__REPLACE_BASE_URL__`
- `public/.well-known/farcaster.json` → replace `__REPLACE_BASE_URL__`

Then generate `accountAssociation` via Farcaster Mini App tools and replace the placeholders in
`public/.well-known/farcaster.json`.

## How it works
- Frontend imports `@farcaster/miniapp-sdk` from ESM and calls `sdk.actions.signIn()` to get the user's `fid`.
- Game calls `/api/score` on game over and refreshes `/api/leaderboard`.

## Security notes
- This is a demo. For production: verify signatures, store user sessions, rate-limit score posts,
  and use a durable database. You can also add a signed server-side validation of score payloads.
