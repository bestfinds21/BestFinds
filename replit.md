# BestFinds

A private product showroom app. Browse and manage a catalog of products organized by category. Supports editor mode (PIN: 139238), dark/light themes, drag-to-reorder, image uploads, and PWA install on Android.

## Run & Operate

- `pnpm --filter @workspace/mulesupplier run dev` — run the app (port 25881)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite, Tailwind v4, framer-motion, wouter, sonner
- All data stored in localStorage (key: `ms.store.v2`)
- PWA: manifest + service worker in `public/`

## Where things live

- `artifacts/mulesupplier/src/` — all source code
- `artifacts/mulesupplier/src/store.ts` — data layer (localStorage)
- `artifacts/mulesupplier/src/types.ts` — TypeScript types
- `artifacts/mulesupplier/src/theme.ts` — theme switching logic
- `artifacts/mulesupplier/public/` — manifest, service worker, icons

## Product

- Homepage: category grid with cover images
- Category page: product grid with drag-to-reorder (editor mode)
- Product page: image gallery, QC photos tab, price, notes
- Editor mode: PIN `139238` — add/edit/delete/reorder categories & products
- Themes: Dark Purple, Dark White, Light (top-left swatches)
- PWA installable on Android

## User preferences

- Site name: BestFinds
- Editor PIN: 139238

## Gotchas

- The store name shown in the UI is stored in localStorage. Changing `getDefaultData()` only affects fresh installs (no existing localStorage data).
- PWA install button only appears on HTTPS (deployed version), not in Replit preview.
