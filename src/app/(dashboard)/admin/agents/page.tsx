import Link from "next/link";

import { deleteAgent, saveAgent } from "@/app/(dashboard)/admin/agents/actions";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllAgentsForAdmin } from "@/lib/agents/get-agents";

export default async function AdminAgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const sp = await searchParams;
  const agents = await getAllAgentsForAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">CLKR Agents</h1>
          <p className="text-sm text-muted-foreground">
            Curated agents for the LegalAI hub. Public at{" "}
            <Link href="/clkr/agents" className="underline">
              /clkr/agents
            </Link>
          </p>
        </div>
      </div>

      {sp.error ? <p className="text-sm text-red-700">{sp.error}</p> : null}
      {sp.saved ? <p className="text-sm text-green-700">Saved.</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New / update agent</CardTitle>
          <CardDescription>Leave id empty to create. Set id to update.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAgent} className="grid gap-3 sm:grid-cols-2">
            <input name="id" placeholder="id (optional for create)" className="rounded border px-3 py-2 text-sm" />
            <input name="slug_key" required placeholder="slug_key" className="rounded border px-3 py-2 text-sm" />
            <select name="locale" className="rounded border px-3 py-2 text-sm" defaultValue="en">
              <option value="en">en</option>
              <option value="es">es</option>
            </select>
            <select name="access_tier" className="rounded border px-3 py-2 text-sm" defaultValue="professional">
              <option value="professional">professional</option>
            </select>
            <input name="title" required placeholder="title" className="rounded border px-3 py-2 text-sm sm:col-span-2" />
            <textarea name="description" required placeholder="description" className="rounded border px-3 py-2 text-sm sm:col-span-2" rows={2} />
            <textarea name="instructions" placeholder="instructions" className="rounded border px-3 py-2 text-sm sm:col-span-2" rows={3} />
            <textarea name="system_prompt" placeholder="system_prompt" className="rounded border px-3 py-2 text-sm sm:col-span-2" rows={5} />
            <input name="category" placeholder="category" defaultValue="general" className="rounded border px-3 py-2 text-sm" />
            <select name="status" className="rounded border px-3 py-2 text-sm" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <input name="sort_order" type="number" defaultValue={0} className="rounded border px-3 py-2 text-sm" />
            <button type="submit" className="btn-primary sm:col-span-2">
              Save agent
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No agents yet.</p>
          ) : (
            agents.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2 text-sm">
                <div>
                  <p className="font-medium">
                    {a.title}{" "}
                    <span className="text-muted-foreground">
                      ({a.locale} · {a.status})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.id}</p>
                </div>
                <form action={deleteAgent}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="text-red-700 underline">
                    Delete
                  </button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ButtonLink href="/admin/clkr" variant="outline">
        Back to guides admin
      </ButtonLink>
    </div>
  );
}
