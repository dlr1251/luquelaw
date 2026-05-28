# SEO setup (Search Console & GA4)

After deploying SEO changes to production:

## Environment variables (Vercel → Production)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://luquelaw.co` | Canonical URLs, sitemap, Open Graph |
| `GOOGLE_SITE_VERIFICATION` | token from GSC HTML tag | Verifies site ownership in Search Console |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 pageviews |

Redeploy after adding or changing these values.

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) and add property `https://luquelaw.co`.
2. Choose **HTML tag** verification and copy the `content` value (not the full meta tag).
3. Set `GOOGLE_SITE_VERIFICATION` in Vercel to that token and redeploy.
4. Click **Verify** in Search Console.
5. Go to **Sitemaps** → submit `https://luquelaw.co/sitemap.xml`.
6. Use **URL Inspection** on `/` and one CLKR article (e.g. `/clkr/investor-visa`) to confirm indexing.

## Google Analytics 4

1. Create or open a GA4 property for Luque Law.
2. Admin → **Data streams** → Web → copy **Measurement ID** (`G-...`).
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel and redeploy.
4. Open GA4 **Reports → Realtime** and visit the live site to confirm pageviews.

## Link Search Console and GA4

In GA4: **Admin → Product links → Search Console links** → link the verified property.

In Search Console: **Settings → Associations** → confirm the GA4 property is linked.

## Quick checks

- `https://luquelaw.co/robots.txt` — references sitemap, blocks `/admin`, `/login`, etc.
- `https://luquelaw.co/sitemap.xml` — lists home, CLKR hub, privacy, and published articles
- [Rich Results Test](https://search.google.com/test/rich-results) — home + one CLKR article
- Social preview — [opengraph.xyz](https://www.opengraph.xyz/) on home and an article URL
