import Link from "next/link";

import { deleteSkill, saveSkill } from "@/app/(dashboard)/admin/skills/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllSkillsForAdmin } from "@/lib/agents/get-agents";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const skills = await getAllSkillsForAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Skills library</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Published skills appear on{" "}
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
          <CardTitle className="text-base">New / update skill</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveSkill} className="grid gap-3 sm:grid-cols-2">
            <input name="id" placeholder="id (optional)" className="rounded border px-3 py-2 text-sm" />
            <input name="slug_key" required placeholder="slug_key" className="rounded border px-3 py-2 text-sm" />
            <select name="locale" className="rounded border px-3 py-2 text-sm" defaultValue="en">
              <option value="en">en</option>
              <option value="es">es</option>
            </select>
            <input name="category" placeholder="category" defaultValue="Immigration" className="rounded border px-3 py-2 text-sm" />
            <input name="article_slug_key" placeholder="article_slug_key" className="rounded border px-3 py-2 text-sm sm:col-span-2" />
            <input name="title" required placeholder="title" className="rounded border px-3 py-2 text-sm sm:col-span-2" />
            <textarea name="description" required placeholder="description" className="rounded border px-3 py-2 text-sm sm:col-span-2" rows={2} />
            <textarea name="body" required placeholder="body (multi-step skill)" className="rounded border px-3 py-2 text-sm sm:col-span-2" rows={8} />
            <select name="status" className="rounded border px-3 py-2 text-sm" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <input name="sort_order" type="number" defaultValue={0} className="rounded border px-3 py-2 text-sm" />
            <button type="submit" className="btn-primary sm:col-span-2">
              Save skill
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing skills ({skills.length})</CardTitle>
          <CardDescription>en + es rows</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {skills.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-2">
                <span>
                  [{s.locale}] {s.title}{" "}
                  <span className="text-muted-foreground">({s.status})</span>
                </span>
                <form action={deleteSkill}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="text-red-700 hover:underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
