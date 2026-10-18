# Token Launchpad

A small React + Vite app for creating Token-2022 tokens on Solana devnet, with
name, symbol, image and metadata URI stored on-chain via the metadata pointer
and token-metadata extensions.

## Features

- Connect a Solana wallet (Phantom, Solflare, and other Wallet Standard wallets).
- Create a new mint with 6 decimals; you become the mint and freeze authority.
- Name (≤ 32 chars) and symbol (≤ 10 chars) are required.
- Optional image URL and metadata URI (both must be http(s) URLs).
- Light / dark theme toggle.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run lint     # run ESLint
npm run preview  # serve the production build locally
```

## Deployment

The site is published with [Vercel](https://vercel.com). Import this GitHub repo
as a Vercel project with these settings (Vercel detects most of them for Vite):

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main` (or the branch you deploy from)

Vercel rebuilds on every push. The GitHub Actions workflow in `.github/workflows/ci.yml`
runs lint and build checks on each push.
