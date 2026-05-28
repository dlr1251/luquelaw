This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project documentation

See **[docs/PROJECT.md](./docs/PROJECT.md)** for product vision, phased roadmap, and agent checklist.  
Agents: read **[AGENTS.md](./AGENTS.md)** first.

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill in values.

**Supabase** (login, client portal, CLKR admin):

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings** → **API**.
2. Set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` `public` key (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` if shown)
3. Run migrations in `supabase/migrations/` (SQL editor or `supabase db push`).
4. On **Vercel**, add the same `NEXT_PUBLIC_*` variables for Production and redeploy.

The marketing site (home, CLKR articles) works without Supabase; auth and admin need these keys.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
