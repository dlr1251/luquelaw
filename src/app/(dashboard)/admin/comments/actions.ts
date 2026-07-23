"use server";

import { revalidatePath } from "next/cache";

import {
  adminModerateComment,
  adminResolveReport,
} from "@/lib/comments/actions";

export async function hideCommentAction(formData: FormData) {
  const commentId = String(formData.get("commentId") ?? "");
  if (!commentId) return;
  await adminModerateComment({ commentId, action: "hide" });
  revalidatePath("/admin/comments");
}

export async function restoreCommentAction(formData: FormData) {
  const commentId = String(formData.get("commentId") ?? "");
  if (!commentId) return;
  await adminModerateComment({ commentId, action: "restore" });
  revalidatePath("/admin/comments");
}

export async function resolveReportAction(formData: FormData) {
  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "resolved") as
    | "resolved"
    | "dismissed";
  const hide = formData.get("hide") === "1";
  if (!reportId) return;
  await adminResolveReport({
    reportId,
    status: status === "dismissed" ? "dismissed" : "resolved",
    hideComment: hide,
  });
  revalidatePath("/admin/comments");
}
