import { SITE_URL } from "@/lib/seo/config";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { normPublicPath } from "@/lib/norms/types";
import type { NormCommentView, ReactionKind } from "@/lib/comments/types";

type RawComment = {
  id: string;
  norm_id: string;
  section_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  author_display_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type RawReaction = {
  comment_id: string;
  user_id: string;
  kind: ReactionKind;
};

export async function listCommentsForSection(
  sectionId: string,
  viewerUserId?: string | null,
): Promise<NormCommentView[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("norm_comments")
    .select(
      "id, norm_id, section_id, user_id, parent_id, body, author_display_name, created_at, updated_at, deleted_at",
    )
    .eq("section_id", sectionId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error || !rows?.length) return [];

  const comments = rows as RawComment[];
  const ids = comments.map((c) => c.id);

  const { data: reactions } = await supabase
    .from("norm_comment_reactions")
    .select("comment_id, user_id, kind")
    .in("comment_id", ids);

  const reactionRows = (reactions ?? []) as RawReaction[];

  const counts = new Map<string, { like: number; insightful: number }>();
  const viewer = new Map<string, ReactionKind>();

  for (const id of ids) {
    counts.set(id, { like: 0, insightful: 0 });
  }
  for (const r of reactionRows) {
    const c = counts.get(r.comment_id);
    if (c && (r.kind === "like" || r.kind === "insightful")) {
      c[r.kind] += 1;
    }
    if (viewerUserId && r.user_id === viewerUserId) {
      viewer.set(r.comment_id, r.kind);
    }
  }

  const byId = new Map<string, NormCommentView>();
  for (const row of comments) {
    byId.set(row.id, {
      id: row.id,
      body: row.body,
      authorDisplayName: row.author_display_name,
      userId: row.user_id,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isDeleted: Boolean(row.deleted_at),
      reactions: counts.get(row.id) ?? { like: 0, insightful: 0 },
      viewerReaction: viewer.get(row.id) ?? null,
      replies: [],
    });
  }

  const roots: NormCommentView[] = [];
  for (const view of byId.values()) {
    if (view.parentId && byId.has(view.parentId)) {
      byId.get(view.parentId)!.replies.push(view);
    } else if (!view.parentId) {
      roots.push(view);
    }
  }

  return roots;
}

export async function resolveCommentSectionPath(input: {
  sectionId: string;
  locale: "en" | "es";
}): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();

  const { data: section } = await supabase
    .from("norm_sections")
    .select("id, parent_id, section_key, norm_id")
    .eq("id", input.sectionId)
    .maybeSingle();

  if (!section) return null;

  const { data: norm } = await supabase
    .from("norms")
    .select("slug_key, locale")
    .eq("id", section.norm_id)
    .maybeSingle();

  if (!norm) return null;

  const keys: string[] = [section.section_key];
  let parentId = section.parent_id as string | null;
  for (let i = 0; i < 32 && parentId; i += 1) {
    const { data: parent } = await supabase
      .from("norm_sections")
      .select("id, parent_id, section_key")
      .eq("id", parentId)
      .maybeSingle();
    if (!parent) break;
    keys.unshift(parent.section_key);
    parentId = parent.parent_id;
  }

  const locale = (norm.locale === "es" ? "es" : "en") as "en" | "es";
  return `${SITE_URL}${normPublicPath(String(norm.slug_key), locale, keys)}`;
}

export async function getAuthorDisplayName(userId: string): Promise<string> {
  if (!isSupabaseConfigured()) return "User";
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  const name = profile?.display_name?.trim();
  if (name) return name;

  const { data: claimsData } = await supabase.auth.getClaims();
  const email = claimsData?.claims?.email;
  if (typeof email === "string" && email.includes("@")) {
    return email.split("@")[0] || "User";
  }
  return "User";
}
