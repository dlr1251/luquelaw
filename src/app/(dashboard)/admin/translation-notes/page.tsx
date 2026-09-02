import { Badge } from "@/components/ui/badge";
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
import { getTranslationNotesForAdmin } from "@/lib/norms/get-apparatus";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminTranslationNotesPage() {
  const rows = isSupabaseConfigured() ? await getTranslationNotesForAdmin() : [];
  const high = rows.filter((r) => r.risk === "high");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Translator notes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          High-risk notes on the unofficial U.S. English desk translation. Spot-check before
          publishing.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Queue</CardTitle>
          <CardDescription>
            {high.length} high-risk · {rows.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No translator notes yet. Run{" "}
              <code className="text-xs">npm run et:translate -- --apply</code>.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Spanish</TableHead>
                  <TableHead>U.S. rendering</TableHead>
                  <TableHead>U.K./OECD</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm">
                      {row.number_label || row.section_title || row.section_id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="max-w-[14rem] text-sm italic">
                      {row.span_es}
                    </TableCell>
                    <TableCell className="max-w-[14rem] text-sm">{row.rendering_us}</TableCell>
                    <TableCell className="max-w-[12rem] text-xs text-muted-foreground">
                      {row.variant_uk || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.risk === "high" ? "default" : "secondary"}>
                        {row.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{row.status}</TableCell>
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
