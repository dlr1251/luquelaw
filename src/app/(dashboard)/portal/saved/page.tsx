import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { listUserSaves } from "@/lib/saves/actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

function hrefFor(save: {
  target_type: string;
  target_slug: string;
  locale: string;
}): string {
  const es = save.locale === "es";
  if (save.target_type === "guide") {
    return es ? `/es/clkr/guides/${save.target_slug}` : `/clkr/guides/${save.target_slug}`;
  }
  if (save.target_type === "norm") {
    return es ? `/es/clkr/norms/${save.target_slug}` : `/clkr/norms/${save.target_slug}`;
  }
  return es ? `/es/posts/${save.target_slug}` : `/posts/${save.target_slug}`;
}

export default async function PortalSavedPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/portal/saved");
  if (!isSupabaseConfigured()) redirect("/login");

  const saves = await listUserSaves();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Saved</CardTitle>
          <CardDescription>
            Guides and norms you bookmarked for later. Torny usage still comes from your prepaid
            wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {saves.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing saved yet. Use Save on a guide or norm page.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {saves.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-3 border-b pb-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {s.target_type}
                    </p>
                    <Link href={hrefFor(s)} className="font-medium underline">
                      {s.title || s.target_slug}
                    </Link>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.locale}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
