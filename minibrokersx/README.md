# MINI BROKERS

A collector-terminal demo dashboard for a fictional token/NFT ecosystem — minting, buy/sell swap views, staking, and a collection browser. Entirely front-end; state is kept in `localStorage`, no backend or wallet connection required.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (defaults to http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui (Radix primitives) — components live in `src/components/ui`
- wouter for routing
