# next-wp-woo-headless-starter

Template repository for building a **Next.js (App Router)** frontend with **WordPress Headless via REST API** and optional **WooCommerce REST API**.

![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)

## Use this template

1. Click **Use this template** on GitHub and create your new repository.
2. Clone your generated repository.

Or clone this repo directly:

```bash
git clone https://github.com/YOUR_ORG/next-wp-woo-headless-starter.git
cd next-wp-woo-headless-starter
```

## Quickstart

1. Install dependencies:

```bash
npm install
```

2. Run setup wizard:

```bash
npm run setup
```

3. Start dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

If you skip the wizard, copy `.env.example` to `.env.local` and fill values manually.

## Stack

- Next.js App Router
- TypeScript
- ESLint
- Minimal CSS (no UI framework)

## Environment variables

See `.env.example`:

- `WP_URL` (required)
- `WC_CONSUMER_KEY` (optional)
- `WC_CONSUMER_SECRET` (optional)
- `REVALIDATE_SECONDS` (default `60`)
- `WP_REVALIDATE_SECRET` (optional)
- `NEXT_PUBLIC_SITE_URL` (optional, used for sitemap/metadata)

## WordPress setup

1. In WordPress admin, go to **Settings > Permalinks**.
2. Set permalink structure to **Post name**.
3. Confirm REST API is reachable:

```bash
curl https://YOUR_WP_SITE/wp-json/wp/v2/posts
```

4. Ensure your hosting/firewall does not block REST API requests.

## WooCommerce setup (optional)

1. In WooCommerce, create API keys with **Read** permission:
   - WooCommerce > Settings > Advanced > REST API
2. Put keys in `.env.local`:
   - `WC_CONSUMER_KEY`
   - `WC_CONSUMER_SECRET`
3. Start app and open `/shop`.

If keys are not configured, `/shop` shows a friendly setup notice.

## Routes

- `/` Home (latest posts + featured products if Woo enabled)
- `/blog`
- `/blog/[slug]`
- `/page/[slug]`
- `/shop` (Woo optional)
- `/product/[slug]` (Woo optional)
- `/api/revalidate` (on-demand ISR)

## CPT auto-detection

The app reads `GET /wp-json/wp/v2/types` and filters public/viewable types from `wp/v2`.

Helpers:

- `getTypes()`
- `getEntries(typeSlug)`
- `getEntryBySlug(typeSlug, slug)`

By default, it does not create dynamic routes for all CPTs.

See [examples/cpt-route-example.md](examples/cpt-route-example.md) for an explicit route example.

## ACF support

If REST responses include `acf`, data is preserved in type definitions (`acf?: Record<string, any>`).

Included mapper example:

- `src/lib/mappers/hero.ts` (`mapHeroFromAcf`)
- `src/components/blocks/Hero.tsx`

In `/page/[slug]`, hero renders automatically when fields like `hero_title` exist.

No ACF plugin is required by this template; if `acf` is missing, nothing breaks.

## Revalidation

`/api/revalidate` supports:

- Secret via header: `x-revalidate-secret`
- Secret via query: `?secret=...`
- JSON body: `{ "tag": "...", "path": "..." }`

If `WP_REVALIDATE_SECRET` is empty, endpoint returns `404` with a clear message.

### Supported tags

- `wp:posts`
- `wp:pages`
- `wp:types`
- `wp:cpt:<type>`
- `woo:products`
- `woo:categories`

### curl examples

Revalidate by tag:

```bash
curl -X POST "http://localhost:3000/api/revalidate" \
  -H "content-type: application/json" \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -d '{"tag":"wp:posts"}'
```

Revalidate by path:

```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "content-type: application/json" \
  -d '{"path":"/blog"}'
```

Combined:

```bash
curl -X POST "http://localhost:3000/api/revalidate" \
  -H "content-type: application/json" \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -d '{"tag":"woo:products","path":"/shop"}'
```

Webhook sample: [examples/webhook-revalidate-example.md](examples/webhook-revalidate-example.md)

## Deploy on Vercel

1. Import repo in Vercel.
2. Set environment variables from `.env.example`.
3. Redeploy after saving env vars.

Recommended production vars:

- `WP_URL`
- `REVALIDATE_SECONDS`
- `WP_REVALIDATE_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- Woo vars if needed

## DX scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run setup
```

## Troubleshooting

### 401/403 from WordPress or WooCommerce

- Verify API keys and permissions.
- Check reverse proxy/firewall/CDN rules.
- Ensure application passwords/plugins are not overriding auth behavior.

### CORS or hosting restrictions

- Server-to-server fetches in Next.js usually avoid browser CORS issues.
- If WordPress blocks unknown user agents or origins, whitelist your Vercel/server IP ranges.

### Woo Basic Auth headers not accepted

- Some hosts strip `Authorization` headers.
- Test with `curl` directly against `/wp-json/wc/v3/products`.
- If header stripping happens, configure server to pass auth headers through.

### Missing menus/navigation from WordPress

This starter does not include WP menu ingestion by default.

Use a custom endpoint or plugin and add a small `src/lib/menu.ts` client as needed.

## License

MIT
