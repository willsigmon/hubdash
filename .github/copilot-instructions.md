# Copilot Instructions for HubDash

This repo powers HTI’s HubDash dashboards (Next.js 16 + App Router, TypeScript, Tailwind 4). Data is fetched from Knack via API routes with light server-side caching, then rendered by client components with TanStack Query.

## Architecture at a glance
- Pages live under `src/app/**` (App Router). Example: `src/app/board/page.tsx` and `src/app/ops/page.tsx`.
- API routes in `src/app/api/**/route.ts` call Knack using `getKnackClient()` and cache via `getCached()` (`src/lib/knack/*`).
- Client components fetch from those API routes (often with React Query). See `components/board/ImpactMetrics.tsx` (GET `/api/metrics`) and `components/board/CountyMap.tsx` (GET `/api/partners`).
- Shared React Query config and keys live in `src/lib/query-client.ts`; the provider is wired in `src/components/providers/QueryProvider.tsx` and wrapped in `src/app/layout.tsx`.
- Tailwind 4 theme customizations (HTI palette) live in `tailwind.config.ts`; globals in `src/app/globals.css`.

## Environment and data sources
- Primary data source: Knack (HTI’s operational DB).
- Required env vars (create `.env.local`):
  - `KNACK_APP_ID`, `KNACK_API_KEY`
  - Optional overrides: `KNACK_DEVICES_OBJECT` (default `object_7`), `KNACK_ORGANIZATIONS_OBJECT` (default `object_22`)
- API routes expect these envs server-side and set cache headers (CDN-friendly) per route. Example: `src/app/api/metrics/route.ts` and `partners/route.ts`.

## Conventions and patterns
- API route shape:
  - Use `getKnackClient()`; validate Knack payloads; transform to flat JSON.
  - Wrap expensive calls with `getCached(cacheKeys.*)` from `src/lib/knack/cache-manager.ts` and set explicit TTLs.
  - Return `NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=XXX' } })`.
- Client data fetching:
  - Prefer `/api/*` endpoints + React Query with keys from `queryKeys` in `src/lib/query-client.ts`.
  - Tune cache using `queryConfig` presets (e.g., metrics = 2m stale, activity = 30s).
- Status/date fields from Knack can be objects/arrays; always normalize defensively (see `devices/route.ts` for date parsing and connection fields handling).
- Styling uses Tailwind 4: `@import "tailwindcss"` in `globals.css`; avoid `@apply`. Use HTI colors under `theme.extend.colors.hti.*` (e.g., `text-hti-plum`).
- Optimize imports via `next.config.js` `experimental.optimizePackageImports` for `recharts` and `lucide-react`.

## Developer workflows
- Run locally:
  - `npm install`
  - Ensure `.env.local` has Knack credentials
  - `npm run dev` (Next.js on http://localhost:3000)
- Build/serve:
  - `npm run build` → `npm start`
- Common endpoints/components to test:
  - Metrics: `GET /api/metrics` → `components/board/ImpactMetrics.tsx`
  - Partners: `GET /api/partners` → `components/board/CountyMap.tsx`
  - Devices (paginated, cached): `GET /api/devices?page=1&limit=50&status=Ready`

## Adding features safely
- New API route: place under `src/app/api/<resource>/route.ts`; use `getKnackClient`, validate arrays/objects, normalize fields, cache with `getCached` + `cacheKeys`.
- New client component: add under `src/components/<area>/`; if interactive, add `"use client"`; fetch via React Query using `queryKeys` and `/api/*`.
- Follow brand palette from `tailwind.config.ts` (`hti.plum`, `hti.ember`, `hti.gold`, etc.).

## Examples from this repo
- Pagination + caching pattern: `src/app/api/devices/route.ts` using `getCached(cacheKeys.devicesPaginated(page, limit, status))`.
- Grant metrics with hybrid Knack calls: `src/app/api/metrics/route.ts` (direct REST + client wrapper) consumed by `components/board/ImpactMetrics.tsx` with animated counters.
- County aggregation: `src/app/api/partners/route.ts` flattens connection/email/address fields for `components/board/CountyMap.tsx`.

If any part of this guide seems off (e.g., different object keys, missing envs, or new data sources), point to the relevant file and propose an update in this document.
