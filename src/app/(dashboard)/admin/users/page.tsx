import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminUserFilters } from "@/components/admin/admin-user-filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCmsAdminSession, serviceRoleReady } from "@/lib/admin/session";
import { listAdminUsers, type AdminUserRoleFilter } from "@/lib/admin/users";
import { formatUsdCents } from "@/lib/lucy/pricing";

type Search = {
  q?: string;
  role?: string;
  error?: string;
};

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await getCmsAdminSession();
  if (!session) redirect("/portal");

  const sp = await searchParams;
  const q = sp.q ?? "";
  const role: AdminUserRoleFilter =
    sp.role === "admin" || sp.role === "client" ? sp.role : "all";

  if (!serviceRoleReady()) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h2 className="text-lg font-semibold">Users</h2>
        <Alert variant="destructive">
          <AlertDescription>
            Set <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to list Auth emails. The
            key stays on the server.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  let users: Awaited<ReturnType<typeof listAdminUsers>> = [];
  let listError: string | null = null;
  try {
    users = await listAdminUsers({ q, role });
  } catch (err) {
    listError = err instanceof Error ? err.message : "Could not load users";
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Users</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Portal accounts: profile flags, CMS access, and Lucy wallet. Client flag grants portal
          tickets without a Stripe subscription.
        </p>
      </div>

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      {listError ? (
        <Alert variant="destructive">
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      ) : null}

      <AdminUserFilters q={q} role={role} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Directory</CardTitle>
          <CardDescription>
            {users.length} account{users.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users match.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Lucy</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-xs text-muted-foreground">{user.email || "No email"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.cmsAdmin ? <Badge>CMS</Badge> : null}
                        {user.isClient ? <Badge variant="secondary">Client</Badge> : null}
                        {user.isSubscriber ? <Badge variant="outline">Subscriber</Badge> : null}
                        {user.planSlugs.map((slug) => (
                          <Badge key={slug} variant="outline">
                            {slug}
                          </Badge>
                        ))}
                        {!user.cmsAdmin &&
                        !user.isClient &&
                        !user.isSubscriber &&
                        user.planSlugs.length === 0 ? (
                          <span className="text-xs text-muted-foreground">Registered</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.walletCents == null ? "—" : formatUsdCents(user.walletCents)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatWhen(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ButtonLink href={`/admin/users/${user.id}`} size="sm" variant="ghost">
                        Open
                      </ButtonLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
