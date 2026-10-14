# Deploying DIWAN to Cloudflare Workers

The site runs on Cloudflare Workers through **vinext** (Cloudflare's Vite-based
implementation of the Next.js API). Nothing about the Next.js setup changed:
`npm run dev`, `npm run build` and `npm run start` still use Next.js. The
Cloudflare build is separate:

| Command | What it does |
| --- | --- |
| `npm run build:vinext` | Builds the Worker into `dist/` (uses `.env.local` locally) |
| `npm run start:vinext` | Runs that build locally in the Cloudflare runtime (workerd) |
| `npm run dev:vinext` | vinext dev server on port 3001 (optional) |
| `npm run deploy:vinext` | Builds and deploys from your own machine (needs `wrangler login`) |

Configuration: `wrangler.jsonc` (Worker name `diwan`, Node.js compatibility,
static assets, Workers Cache, Cloudflare Images binding) and `vite.config.ts`.

## 1. Before the first deploy

The production Supabase project must already have **both** migrations applied
(`supabase/migrations/`), the content seeded or backfilled, and an admin user
created — see README → Commands. The Cloudflare setup does not touch the
database.

## 2. Connect the GitHub repository (Workers Builds)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**.
2. Connect GitHub if asked, and pick **yfamm/LawMounir**.
3. Project settings:
   - **Project name:** `diwan` (must match `"name"` in `wrangler.jsonc`)
   - **Production branch:** the branch you deploy from (e.g. `main`, once this work is merged)
   - **Build command:** `npm run build:vinext`
   - **Deploy command:** `npx wrangler deploy` (the default)
   - **Root directory:** leave empty
4. Open **Advanced settings → Build variables** and add the four
   *build variables* below, then **Deploy**.
5. After the first deploy: Worker → **Settings → Variables and Secrets** → add
   the *runtime* variables below (choose **Secret** for the secret ones), then
   **Deployments → Retry/redeploy** so they take effect.
6. Optional: Worker → **Settings → Domains & Routes** → add your custom domain,
   then update `NEXT_PUBLIC_SITE_URL` and redeploy.

Every push to the production branch then builds and deploys automatically.

## 3. Environment variables

**Build variables** (Settings → Build → Variables and secrets). `NEXT_PUBLIC_*`
values are compiled into the build, so they must be present when it runs:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` public key |
| `NEXT_PUBLIC_SITE_URL` | The public address, e.g. `https://diwan.<your-subdomain>.workers.dev` or your domain. **Required** — without it canonical links point to localhost. |
| `NEXT_PUBLIC_SITE_INDEXABLE` | Leave **unset** (or `false`) until launch; `true` allows search indexing. |

**Runtime variables** (Worker → Settings → Variables and Secrets):

| Name | Type | Value |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Supabase → Project Settings → API → `service_role` key. Server only — never in a build variable or any `NEXT_PUBLIC_` name. |
| `RATE_LIMIT_SALT` | **Secret** | Any long random string (e.g. `openssl rand -hex 32`) |
| `RESEND_API_KEY` | Secret (optional) | Only for e-mail notices of new enquiries |
| `CONTACT_NOTIFICATION_EMAIL` | Text (optional) | Address(es) to notify |
| `CONTACT_FROM_EMAIL` | Text (optional) | Verified sender for Resend |

Never set `IMAGES_ALLOW_LOCAL_IP` in Cloudflare (local development only).

## 4. Cloudflare services used

- **Workers Cache** — public pages are cached at the edge for up to 5 minutes;
  every admin save purges them, so edits appear immediately (same behaviour as
  Next.js ISR).
- **Cloudflare Images** (binding `IMAGES`) — resizes and converts images to
  AVIF/WebP per screen. The site needs a few hundred unique transformations a
  month, inside the free monthly allowance; Cloudflare bills beyond it.
- **Plan:** server-rendering a page uses more CPU time than the Workers Free
  plan's per-request limit allows on cache misses and in the admin, so the
  **Workers Paid** plan is recommended. Check Cloudflare's current limits.

## 5. Known differences from the Next.js build

Checked page by page against the Next.js build (screenshots, desktop and
mobile, Arabic and English) — layout, RTL/LTR, fonts and animations match.

- Images show the dark background while loading instead of a blurred preview
  (vinext does not generate blur placeholders).
- Fonts have no metric-adjusted fallback while loading (brief layout shift on
  very slow connections only).
- Link-preview bots (WhatsApp, Facebook, X, Bing) receive the title, canonical,
  `hreflang` and Open Graph tags in `<head>`; browsers and Googlebot receive
  them streamed, as with Next.js 16 streaming metadata.
- `vite.config.ts` patches vinext's image shim so full-width images get a
  responsive `srcset` (vinext 1.1 omits it for `fill` images). The build stops
  with a clear message if a vinext upgrade changes that code — review the
  patch then.
- `npm run typecheck` runs `next typegen` first, because the vinext build
  rewrites `.next/types/routes.d.ts`.

## Rolling back

Worker → **Deployments** → pick an earlier version → **Rollback**. The Next.js
workflow is untouched, so the site can still be hosted elsewhere with
`npm run build`.
