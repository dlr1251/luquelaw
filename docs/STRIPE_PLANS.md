# Stripe plan price IDs

Checkout resolves prices in this order:

1. `plans.stripe_price_id` in Supabase
2. Env fallback: `STRIPE_PRICE_STUDENT`, `STRIPE_PRICE_PROFESSIONAL`, `STRIPE_PRICE_CLIENT`

## Seed DB (optional)

```sql
update public.plans set stripe_price_id = 'price_xxx' where slug = 'student';
update public.plans set stripe_price_id = 'price_xxx' where slug = 'professional';
update public.plans set stripe_price_id = 'price_xxx' where slug = 'client';

select slug, stripe_price_id, active from public.plans order by sort_order;
```

## Production cutover

1. Create Products/Prices in Stripe (live mode).
2. Set price IDs in DB or Vercel env (`STRIPE_PRICE_*`).
3. Set `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to live keys.
4. Point Stripe webhook to `https://luquelaw.co/api/stripe/webhook` with `checkout.session.completed` + `customer.subscription.*`.
5. Ensure `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are set (webhook returns 503 without service role).
