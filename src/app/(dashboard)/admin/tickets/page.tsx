import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { formatUsdCents } from "@/lib/lucy/pricing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminTicketsPage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims || !isAppAdmin(claimsData.claims)) {
    redirect("/portal");
  }

  const { data: tickets } = await supabase
    .from("tickets")
    .select(
      "id, subject, category, status, kind, review_status, review_fee_cents, created_at, user_id",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tickets queue</CardTitle>
          <CardDescription>
            General portal tickets and Lucy consultation reviews (pay-to-unlock).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!tickets?.length ? (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          ) : (
            tickets.map((t) => (
              <Link
                key={t.id}
                href={`/admin/tickets/${t.id}`}
                className="block border-b py-3 text-sm hover:bg-muted/20"
              >
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {t.kind === "consultation" ? "Lucy · " : ""}
                  {t.status}
                  {t.review_status ? ` · ${t.review_status}` : ""} · {t.category} ·{" "}
                  {new Date(t.created_at).toLocaleString()}
                  {t.review_fee_cents
                    ? ` · fee ${formatUsdCents(t.review_fee_cents)}`
                    : ""}{" "}
                  · user {t.user_id.slice(0, 8)}…
                </p>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
      <Link href="/admin/clkr" className="text-sm underline">
        ← Admin home
      </Link>
    </div>
  );
}
