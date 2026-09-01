import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  setCmsAllowlist,
  updateAdminUserProfile,
} from "@/app/(dashboard)/admin/users/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCmsAdminSession, serviceRoleReady } from "@/lib/admin/session";
import { getAdminUser } from "@/lib/admin/users";
import { formatUsdCents } from "@/lib/lucy/pricing";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await getCmsAdminSession();
  if (!session) redirect("/portal");
  if (!serviceRoleReady()) redirect("/admin/users");

  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const user = await getAdminUser(id);
  if (!user) notFound();

  const sp = await searchParams;
  const isSelf = user.email === session.email;
  const canRevokeAllowlist = user.isAllowlistAdmin && !isSelf;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ButtonLink href="/admin/users" variant="ghost" size="sm" className="-ml-2 w-fit">
        ← All users
      </ButtonLink>

      <div>
        <h2 className="text-lg font-semibold">{user.displayName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{user.email || "No email"}</p>
      </div>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      {sp.saved ? (
        <Alert>
          <AlertDescription>Saved.</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>
            Client flag unlocks portal tickets (beta). Subscriber is display-only; paid access still
            comes from Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAdminUserProfile} className="space-y-4">
            <input type="hidden" name="id" value={user.id} />
            <div className="space-y-1.5">
              <Label htmlFor="display_name">Display name</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={user.displayName}
                required
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locale">Locale</Label>
              <select
                id="locale"
                name="locale"
                defaultValue={user.locale}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_client"
                defaultChecked={user.isClient}
                className="size-4 rounded border-input"
              />
              Client (portal tickets)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_subscriber"
                defaultChecked={user.isSubscriber}
                className="size-4 rounded border-input"
              />
              Subscriber (label only)
            </label>
            <Button type="submit" size="sm">
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">CMS access</CardTitle>
          <CardDescription>
            Allowlist grants <code className="font-mono">is_clkr_admin()</code> in the database. JWT
            role and <code className="font-mono">ADMIN_EMAILS</code> are set outside this screen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {user.isAllowlistAdmin ? <Badge>Allowlist</Badge> : null}
            {user.isJwtAdmin ? <Badge variant="secondary">JWT admin</Badge> : null}
            {user.isEnvAdmin ? <Badge variant="outline">ADMIN_EMAILS</Badge> : null}
            {!user.cmsAdmin ? (
              <span className="text-sm text-muted-foreground">No CMS access</span>
            ) : null}
          </div>
          {user.isAllowlistAdmin ? (
            canRevokeAllowlist ? (
              <form action={setCmsAllowlist}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="grant" value="0" />
                <Button type="submit" size="sm" variant="outline">
                  Remove from allowlist
                </Button>
              </form>
            ) : (
              <p className="text-xs text-muted-foreground">You cannot remove your own CMS access.</p>
            )
          ) : (
            <form action={setCmsAllowlist}>
              <input type="hidden" name="id" value={user.id} />
              <input type="hidden" name="grant" value="1" />
              <Button type="submit" size="sm">
                Grant CMS allowlist
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Lucy wallet: {user.walletCents == null ? "—" : formatUsdCents(user.walletCents)}</p>
          <p>
            Stripe plans:{" "}
            {user.planSlugs.length ? user.planSlugs.join(", ") : "none active"}
          </p>
          <p>Joined: {formatWhen(user.createdAt)}</p>
          <p>Last sign-in: {formatWhen(user.lastSignInAt)}</p>
          <p>
            <Link href={`/admin/tickets`} className="underline-offset-4 hover:underline">
              Tickets queue
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
