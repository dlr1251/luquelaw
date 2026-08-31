import Link from "next/link";

import { deletePrompt, savePrompt } from "@/app/(dashboard)/admin/prompts/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPromptsForAdmin } from "@/lib/agents/get-agents";

export default async function AdminPromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const prompts = await getAllPromptsForAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Prompts Arena</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create and edit prompts stored in Supabase. Published prompts appear on{" "}
          <Link href="/clkr/library" className="font-medium text-foreground underline-offset-4 hover:underline">
            /clkr/library
          </Link>
          .
        </p>
      </div>

      {sp.error ? <p className="text-sm text-red-700">{sp.error}</p> : null}
      {sp.saved ? <p className="text-sm text-green-700">Saved.</p> : null}
      {sp.deleted ? <p className="text-sm text-green-700">Deleted.</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New / update prompt</CardTitle>
          <CardDescription>Leave id empty to create. Set id to update.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={savePrompt} className="grid gap-3 sm:grid-cols-2">
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
            <textarea
              name="description"
              required
              placeholder="description"
              className="rounded border px-3 py-2 text-sm sm:col-span-2"
              rows={2}
            />
            <textarea
              name="prompt_text"
              required
              placeholder="prompt_text"
              className="rounded border px-3 py-2 text-sm sm:col-span-2"
              rows={6}
            />
            <input name="category" placeholder="category" defaultValue="Immigration" className="rounded border px-3 py-2 text-sm" />
            <input name="article_slug_key" placeholder="article_slug_key" className="rounded border px-3 py-2 text-sm" />
            <input name="use_case" placeholder="use_case (draft|review|checklist)" className="rounded border px-3 py-2 text-sm" />
            <select name="status" className="rounded border px-3 py-2 text-sm" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <input name="sort_order" type="number" defaultValue={0} className="rounded border px-3 py-2 text-sm" />
            <button type="submit" className="btn-primary sm:col-span-2">
              Save prompt
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prompts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prompts yet.</p>
          ) : (
            prompts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2 text-sm">
                <div>
                  <p className="font-medium">
                    {p.title}{" "}
                    <span className="text-muted-foreground">
                      ({p.locale} · {p.status})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{p.slug_key}</p>
                </div>
                <form action={deletePrompt}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="text-red-700 underline">
                    Delete
                  </button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
