import { hasEntitlement, getSessionUserId } from "@/lib/billing/entitlements";
import { ACTIVE_SUB_STATUSES } from "@/lib/billing/types";
import { getLucyBalance } from "@/lib/lucy/wallet";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ checkout?: string; password?: string }>;
};

export default async function PortalPage({ searchParams }: Props) {
  const { checkout, password } = await searchParams;
  const userId = await getSessionUserId();

  const [agents, tickets, balanceCents, subscriptions] = await Promise.all([
    hasEntitlement("agents"),
    hasEntitlement("portal_tickets"),
    userId ? getLucyBalance(userId) : Promise.resolve(0),
    (async () => {
      if (!userId || !isSupabaseConfigured()) return [];
      const supabase = await createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("status, current_period_end, plans(slug, name_en)")
        .eq("user_id", userId);
      return data ?? [];
    })(),
  ]);

  const activePlans = subscriptions
    .filter((s) => ACTIVE_SUB_STATUSES.has(s.status))
    .map((s) => {
      const plan = s.plans as
        | { slug: string; name_en: string }
        | { slug: string; name_en: string }[]
        | null;
      const row = Array.isArray(plan) ? plan[0] : plan;
      return row?.name_en ?? row?.slug ?? "Plan";
    });

  const balanceUsd = (balanceCents / 100).toFixed(2);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {checkout === "success" ? (
        <p className="border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground">
          Subscription updated. Entitlements refresh within a few seconds after the webhook lands.
        </p>
      ) : null}

      {password === "updated" ? (
        <p className="border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground">
          Your new password is saved.
        </p>
      ) : null}

      <section className="border border-border bg-card p-6 sm:p-8">
        <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
          Access
        </p>
        <h2 className="mt-2 font-display text-2xl font-normal tracking-tight text-[color:var(--forest)]">
          Your access
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Subscriptions unlock CLKR modules. Lucy AI uses a prepaid wallet (separate from plans).
          New accounts start with USD 10.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 text-sm leading-6">
            <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--forest)]">
              Plans
            </p>
            <p className="text-muted-foreground">
              {activePlans.length ? activePlans.join(", ") : "No active subscription"}
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>Agents: {agents ? "unlocked" : "locked"}</li>
              <li>Client tickets: {tickets ? "unlocked" : "locked"}</li>
            </ul>
            <a href="/pricing" className="btn-secondary btn-secondary-sm mt-3 inline-flex">
              {activePlans.length ? "Manage / upgrade plans" : "View plans"}
            </a>
          </div>
          <div className="space-y-2 text-sm leading-6">
            <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--forest)]">
              Lucy AI wallet
            </p>
            <p className="text-muted-foreground">${balanceUsd} USD available</p>
            <a href="/portal/lucy" className="btn-primary btn-primary-sm mt-3 inline-flex">
              Open Lucy AI
            </a>
          </div>
        </div>
      </section>

      <section className="border border-border bg-card p-6 sm:p-8">
        <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
          Portal
        </p>
        <h2 className="mt-2 font-display text-2xl font-normal tracking-tight text-[color:var(--forest)]">
          Welcome
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Your account: Lucy AI, tickets to the firm, and saved guides or norms. CLKR stays on the
          public site.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/portal/lucy" className="btn-secondary btn-secondary-sm">
            Lucy AI
          </a>
          <a href="/portal/tickets" className="btn-secondary btn-secondary-sm">
            Tickets {tickets ? "" : "(Lucy AI reviews + client)"}
          </a>
          <a href="/portal/saved" className="btn-secondary btn-secondary-sm">
            Saved
          </a>
          <a href="/portal/settings" className="btn-secondary btn-secondary-sm">
            Settings
          </a>
          <a href="/pricing" className="btn-secondary btn-secondary-sm">
            Plans & billing
          </a>
        </div>
      </section>

      <p className="text-sm leading-6 text-muted-foreground">
        Need help? Email{" "}
        <a
          className="font-medium text-[color:var(--forest)] underline-offset-4 hover:underline"
          href="mailto:daniel@luquelaw.co"
        >
          daniel@luquelaw.co
        </a>{" "}
        or open a ticket if your plan includes portal support.
      </p>
    </div>
  );
}
