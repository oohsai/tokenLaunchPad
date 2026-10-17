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

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml`. The
workflow lints and builds the app, then publishes `dist/` on every push to the
deployment branch (or on demand via "Run workflow"). Point the `branches` filter
at `main` once the work is merged. The Vite `base` is relative, so the same
build works from any sub-path.
