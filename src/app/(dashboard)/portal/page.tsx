import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const [agents, quizzes, tickets, balanceCents, subscriptions] = await Promise.all([
    hasEntitlement("agents"),
    hasEntitlement("quizzes"),
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
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {checkout === "success" ? (
        <Card className="border-green-700/30 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subscription updated</CardTitle>
            <CardDescription>
              Stripe checkout completed. Your entitlements refresh within a few seconds after the
              webhook lands.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {password === "updated" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Password updated</CardTitle>
            <CardDescription>Your new password is saved.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Your access</CardTitle>
          <CardDescription>
            Subscriptions unlock CLKR modules. Lucy uses a prepaid wallet (separate from plans).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">Plans</p>
            <p className="text-muted-foreground">
              {activePlans.length ? activePlans.join(", ") : "No active subscription"}
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>Agents: {agents ? "unlocked" : "locked"}</li>
              <li>Quizzes: {quizzes ? "unlocked" : "locked"}</li>
              <li>Client tickets: {tickets ? "unlocked" : "locked"}</li>
            </ul>
            <ButtonLink href="/pricing" variant="outline" className="mt-3 justify-start">
              {activePlans.length ? "Manage / upgrade plans" : "View plans"}
            </ButtonLink>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">Lucy wallet</p>
            <p className="text-muted-foreground">${balanceUsd} USD available</p>
            <ButtonLink href="/portal/lucy" variant="outline" className="mt-3 justify-start">
              Open Lucy consultations
            </ButtonLink>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Use CLKR modules for study and practice. Client tickets stay separate from case files.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <ButtonLink href="/clkr" variant="outline" className="justify-start">
            CLKR LegalAI hub
          </ButtonLink>
          <ButtonLink href="/clkr/guides" variant="outline" className="justify-start">
            Guides
          </ButtonLink>
          <ButtonLink href="/clkr/norms" variant="outline" className="justify-start">
            Norms
          </ButtonLink>
          <ButtonLink
            href={agents ? "/clkr/agents" : "/pricing"}
            variant="outline"
            className="justify-start"
          >
            Agents {agents ? "" : "(upgrade)"}
          </ButtonLink>
          <ButtonLink
            href={quizzes ? "/clkr/quizzes" : "/pricing"}
            variant="outline"
            className="justify-start"
          >
            Quizzes {quizzes ? "" : "(upgrade)"}
          </ButtonLink>
          <ButtonLink href="/portal/lucy" variant="outline" className="justify-start">
            Lucy consultations
          </ButtonLink>
          <ButtonLink href="/portal/tickets" variant="outline" className="justify-start">
            Tickets {tickets ? "" : "(Lucy reviews + client)"}
          </ButtonLink>
          <ButtonLink href="/pricing" variant="outline" className="justify-start">
            Plans & billing
          </ButtonLink>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email{" "}
            <a className="font-medium text-foreground underline" href="mailto:daniel@luquelaw.co">
              daniel@luquelaw.co
            </a>{" "}
            or open a ticket if your plan includes portal support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
