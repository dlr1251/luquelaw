"use server";

import { revalidatePath } from "next/cache";

import {
  sendCommentReplyEmail,
  sendCommentReportEmail,
} from "@/lib/comments/email";
import {
  getAuthorDisplayName,
  resolveCommentSectionPath,
} from "@/lib/comments/queries";
import {
  MAX_COMMENT_LENGTH,
  MAX_REPORT_REASON_LENGTH,
  type ReactionKind,
} from "@/lib/comments/types";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createServiceClient, isServiceRoleConfigured } from "@/lib/supabase/service";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireUser(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, error: "auth" };
  return { ok: true, userId };
}

async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const auth = await requireUser();
  if (!auth.ok) return auth;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!isAppAdmin(data?.claims)) return { ok: false, error: "forbidden" };
  return auth;
}

async function revalidateNormPaths(sectionId: string) {
  const [en, es] = await Promise.all([
    resolveCommentSectionPath({ sectionId, locale: "en" }),
    resolveCommentSectionPath({ sectionId, locale: "es" }),
  ]);
  // Paths are absolute URLs — convert to pathname for revalidatePath
  for (const absolute of [en, es]) {
    if (!absolute) continue;
    try {
      const pathname = new URL(absolute).pathname;
      revalidatePath(pathname);
    } catch {
      // ignore
    }
  }
  revalidatePath("/clkr/norms");
  revalidatePath("/es/clkr/norms");
  revalidatePath("/admin/comments");
}

export async function createComment(input: {
  normId: string;
  sectionId: string;
  body: string;
  parentId?: string | null;
}): Promise<ActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const body = input.body.trim();
  if (!body) return { ok: false, error: "empty" };
  if (body.length > MAX_COMMENT_LENGTH) return { ok: false, error: "too_long" };

  const supabase = await createClient();
  const authorDisplayName = await getAuthorDisplayName(auth.userId);

  if (input.parentId) {
    const { data: parent } = await supabase
      .from("norm_comments")
      .select("id, parent_id, section_id, user_id, deleted_at")
      .eq("id", input.parentId)
      .maybeSingle();
    if (!parent || parent.deleted_at) return { ok: false, error: "parent_missing" };
    if (parent.section_id !== input.sectionId) return { ok: false, error: "parent_section" };
    if (parent.parent_id) return { ok: false, error: "too_deep" };
  }

  const { error } = await supabase
    .from("norm_comments")
    .insert({
      norm_id: input.normId,
      section_id: input.sectionId,
      user_id: auth.userId,
      parent_id: input.parentId ?? null,
      body,
      author_display_name: authorDisplayName,
    });

  if (error) return { ok: false, error: error.message };

  if (input.parentId) {
    void notifyParentReply({
      parentId: input.parentId,
      replierUserId: auth.userId,
      replierName: authorDisplayName,
      body,
      sectionId: input.sectionId,
    });
  }

  await revalidateNormPaths(input.sectionId);
  return { ok: true };
}

async function notifyParentReply(input: {
  parentId: string;
  replierUserId: string;
  replierName: string;
  body: string;
  sectionId: string;
}) {
  try {
    if (!isServiceRoleConfigured()) return;
    const service = createServiceClient();
    const { data: parent } = await service
      .from("norm_comments")
      .select("user_id")
      .eq("id", input.parentId)
      .maybeSingle();
    if (!parent || parent.user_id === input.replierUserId) return;

    const { data: userData } = await service.auth.admin.getUserById(parent.user_id);
    const email = userData.user?.email;
    if (!email) return;

    const sectionUrl =
      (await resolveCommentSectionPath({ sectionId: input.sectionId, locale: "en" })) ??
      (await resolveCommentSectionPath({ sectionId: input.sectionId, locale: "es" }));
    if (!sectionUrl) return;

    await sendCommentReplyEmail({
      toEmail: email,
      replierName: input.replierName,
      excerpt: input.body,
      sectionUrl,
    });
  } catch {
    // Email failures must not block comment creation.
  }
}

export async function updateOwnComment(input: {
  commentId: string;
  body: string;
}): Promise<ActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const body = input.body.trim();
  if (!body) return { ok: false, error: "empty" };
  if (body.length > MAX_COMMENT_LENGTH) return { ok: false, error: "too_long" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("norm_comments")
    .select("id, user_id, section_id, deleted_at")
    .eq("id", input.commentId)
    .maybeSingle();

  if (!existing || existing.deleted_at) return { ok: false, error: "missing" };
  if (existing.user_id !== auth.userId) return { ok: false, error: "forbidden" };

  const { error } = await supabase
    .from("norm_comments")
    .update({ body })
    .eq("id", input.commentId);

  if (error) return { ok: false, error: error.message };
  await revalidateNormPaths(existing.section_id);
  return { ok: true };
}

export async function softDeleteOwnComment(commentId: string): Promise<ActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("norm_comments")
    .select("id, user_id, section_id, deleted_at")
    .eq("id", commentId)
    .maybeSingle();

  if (!existing || existing.deleted_at) return { ok: false, error: "missing" };
  if (existing.user_id !== auth.userId) return { ok: false, error: "forbidden" };

  const { error } = await supabase
    .from("norm_comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId);

  if (error) return { ok: false, error: error.message };
  await revalidateNormPaths(existing.section_id);
  return { ok: true };
}

export async function toggleReaction(input: {
  commentId: string;
  kind: ReactionKind;
}): Promise<ActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth;
  if (input.kind !== "like" && input.kind !== "insightful") {
    return { ok: false, error: "invalid_kind" };
  }

  const supabase = await createClient();
  const { data: comment } = await supabase
    .from("norm_comments")
    .select("id, section_id, deleted_at")
    .eq("id", input.commentId)
    .maybeSingle();
  if (!comment || comment.deleted_at) return { ok: false, error: "missing" };

  const { data: existing } = await supabase
    .from("norm_comment_reactions")
    .select("kind")
    .eq("comment_id", input.commentId)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (existing?.kind === input.kind) {
    const { error } = await supabase
      .from("norm_comment_reactions")
      .delete()
      .eq("comment_id", input.commentId)
      .eq("user_id", auth.userId);
    if (error) return { ok: false, error: error.message };
  } else if (existing) {
    const { error } = await supabase
      .from("norm_comment_reactions")
      .update({ kind: input.kind })
      .eq("comment_id", input.commentId)
      .eq("user_id", auth.userId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("norm_comment_reactions").insert({
      comment_id: input.commentId,
      user_id: auth.userId,
      kind: input.kind,
    });
    if (error) return { ok: false, error: error.message };
  }

  await revalidateNormPaths(comment.section_id);
  return { ok: true };
}

export async function reportComment(input: {
  commentId: string;
  reason: string;
}): Promise<ActionResult> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const reason = input.reason.trim();
  if (!reason) return { ok: false, error: "empty" };
  if (reason.length > MAX_REPORT_REASON_LENGTH) return { ok: false, error: "too_long" };

  const supabase = await createClient();
  const { data: comment } = await supabase
    .from("norm_comments")
    .select("id, section_id, body, deleted_at")
    .eq("id", input.commentId)
    .maybeSingle();
  if (!comment || comment.deleted_at) return { ok: false, error: "missing" };

  const { error } = await supabase.from("norm_comment_reports").insert({
    comment_id: input.commentId,
    reporter_id: auth.userId,
    reason,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "already_reported" };
    return { ok: false, error: error.message };
  }

  try {
    const { data: claimsData } = await supabase.auth.getClaims();
    const reporterEmail =
      typeof claimsData?.claims?.email === "string"
        ? claimsData.claims.email
        : "unknown";
    const sectionUrl = await resolveCommentSectionPath({
      sectionId: comment.section_id,
      locale: "en",
    });
    await sendCommentReportEmail({
      reporterEmail,
      reason,
      commentBody: comment.body,
      sectionUrl,
      commentId: comment.id,
    });
  } catch {
    // ignore email errors
  }

  revalidatePath("/admin/comments");
  return { ok: true };
}

export async function adminModerateComment(input: {
  commentId: string;
  action: "hide" | "restore";
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("norm_comments")
    .select("id, section_id")
    .eq("id", input.commentId)
    .maybeSingle();
  if (!existing) return { ok: false, error: "missing" };

  const { error } = await supabase
    .from("norm_comments")
    .update({
      deleted_at: input.action === "hide" ? new Date().toISOString() : null,
    })
    .eq("id", input.commentId);

  if (error) return { ok: false, error: error.message };
  await revalidateNormPaths(existing.section_id);
  return { ok: true };
}

export async function adminResolveReport(input: {
  reportId: string;
  status: "resolved" | "dismissed";
  hideComment?: boolean;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { data: report } = await supabase
    .from("norm_comment_reports")
    .select("id, comment_id, status")
    .eq("id", input.reportId)
    .maybeSingle();
  if (!report) return { ok: false, error: "missing" };

  const { error } = await supabase
    .from("norm_comment_reports")
    .update({ status: input.status })
    .eq("id", input.reportId);
  if (error) return { ok: false, error: error.message };

  if (input.hideComment) {
    await adminModerateComment({ commentId: report.comment_id, action: "hide" });
  }

  revalidatePath("/admin/comments");
  return { ok: true };
}
