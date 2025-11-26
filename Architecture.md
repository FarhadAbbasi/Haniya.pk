# Haniya.pk Architecture

- App framework: Next.js (App Router)
- Hosting: Netlify (build + serverless functions)
- DB/Auth/Storage: Supabase (Postgres)
- Styling/UI: Tailwind + shadcn/ui + Lucide icons
- Push: Web Push with VAPID; Service Worker `/public/sw.js`

## Rendering model
- Server Components by default (App Router). Pages can render as:
  - Static (SSG) with ISR: `export const revalidate = 60` (rebuild at most once per 60s)
  - Dynamic SSR: when using request-time data or `export const dynamic = "force-dynamic"`
  - Client Components: interactive UI and browser-only APIs
- Current setup:
  - Home, Category, Printed, Embroidery, New, Sale, PDP use ISR revalidate=60 for speed + freshness.
  - Admin pages stay dynamic (auth-gated, real-time edits).

## Data access
- Supabase server client in server components and API routes.
- Typical flow:
  - Page fetches lists (products, categories), often combined and parallelized.
  - Secondary fetch for first images (joined by product_id sorted by `sort`).
- Optimizations in place:
  - ISR added to public pages to avoid cold SSR on every request.
  - Service worker caches static assets (icons, manifest) and navigations with a cache-first strategy.

## API routes (serverless)
- Next.js API routes under `src/app/api/**` are serverless functions on Netlify.
  - Notifications: `/api/notifications/*` (vapid-public, subscribe, broadcast)
  - Marketing: `/api/marketing/subscribe`
  - Admin category CRUD: `/api/admin/categories/*`
- These run on demand; expect a small cold start the first time after idle.

## Push notifications
- Uses Web Push (VAPID). Backend sends via `web-push`.
- SW handles `push` and `notificationclick`.
- Subscriptions stored in `push_subscriptions` with optional `user_id`.

## PWA
- Manifest `/public/manifest.webmanifest` linked in `<head>`.
- Icons `/public/icon-192.png`, `/public/icon-512.png` (maskable optional).
- SW provides basic offline caching (shell + static assets; cache-first for navigations/static).

## CSR vs SSR vs ISR
- CSR (client-side React fetch) feels instant after hydration but moves work to the browser and can be worse for SEO and first load.
- SSR ensures SEO and consistent data but can introduce latency per request.
- ISR is the middle ground we use: static output served from CDN, quietly revalidated in background.
- You can still build client components that fetch on the client when needed (filters, infinite scroll, etc.).

## What runs where?
- Frontend HTML for ISR pages is built on the server and cached at the CDN.
- API routes and admin-only server logic run as serverless functions.
- Database is Supabase (managed Postgres) over HTTPS.

## Future performance work
- Add DB indexes: `categories(slug)`, `products(category_id, created_at)`, `product_images(product_id, sort)`.
- Consider denormalizing lead image URL onto `products` to avoid extra join.
- Expand SW caching strategy (e.g., stale-while-revalidate for HTML) if acceptable for UX.
