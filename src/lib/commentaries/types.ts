export type DoctrinalCommentaryStatus = "draft" | "published" | "archived";

export type DoctrinalCommentaryRecord = {
  id: string;
  norm_id: string;
  section_id: string;
  locale: "en" | "es";
  title: string;
  body_markdown: string;
  status: DoctrinalCommentaryStatus;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Admin list row with joined norm/section labels */
export type DoctrinalCommentaryAdminRow = DoctrinalCommentaryRecord & {
  norm_title: string | null;
  norm_slug_key: string | null;
  section_title: string | null;
  section_key: string | null;
  section_number_label: string | null;
};

export function mapDoctrinalCommentaryRow(
  row: Record<string, unknown>,
): DoctrinalCommentaryRecord {
  return {
    id: String(row.id),
    norm_id: String(row.norm_id),
    section_id: String(row.section_id),
    locale: row.locale as "en" | "es",
    title: String(row.title),
    body_markdown: String(row.body_markdown ?? ""),
    status: row.status as DoctrinalCommentaryStatus,
    sort_order: Number(row.sort_order) || 0,
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}
