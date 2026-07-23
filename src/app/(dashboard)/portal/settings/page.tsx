import { redirect } from "next/navigation";

import { updateOwnProfile } from "@/app/(dashboard)/portal/settings/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function PortalSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/portal/settings");
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, locale, about_short, reputation")
    .eq("id", userId)
    .maybeSingle();

  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email ?? "";

  async function saveAction(formData: FormData) {
    "use server";
    const result = await updateOwnProfile(formData);
    if (!result.ok) {
      redirect(`/portal/settings?error=${encodeURIComponent(result.error)}`);
    }
    redirect("/portal/settings?saved=1");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Display name and locale for Torny, saves, and the community forum. Email is managed via
            login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sp.saved ? (
            <p className="mb-3 text-sm text-[var(--forest)]">Profile saved.</p>
          ) : null}
          {sp.error ? <p className="mb-3 text-sm text-red-700">{sp.error}</p> : null}

          <form action={saveAction} className="space-y-4 text-sm">
            <label className="block space-y-1">
              Email
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded border bg-muted/40 px-3 py-2"
              />
            </label>
            <label className="block space-y-1">
              Display name
              <input
                name="display_name"
                required
                maxLength={80}
                defaultValue={profile?.display_name ?? ""}
                className="w-full rounded border px-3 py-2"
              />
            </label>
            <label className="block space-y-1">
              Locale
              <select
                name="locale"
                defaultValue={profile?.locale === "es" ? "es" : "en"}
                className="w-full rounded border px-3 py-2"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            <label className="block space-y-1">
              Short bio (community)
              <textarea
                name="about_short"
                rows={3}
                maxLength={280}
                defaultValue={profile?.about_short ?? ""}
                className="w-full rounded border px-3 py-2"
                placeholder="Optional — shown with your forum posts"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Forum reputation: {profile?.reputation ?? 0}
            </p>
            <button type="submit" className="btn-primary">
              Save profile
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
