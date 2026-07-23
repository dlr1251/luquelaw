"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createComment,
  reportComment,
  softDeleteOwnComment,
  toggleReaction,
  updateOwnComment,
} from "@/lib/comments/actions";
import type { NormCommentView, ReactionKind } from "@/lib/comments/types";
import { loginHref } from "@/lib/auth/safe-next";
import { cn } from "@/lib/cn";

type Props = {
  normId: string;
  sectionId: string;
  locale: "en" | "es";
  signedIn: boolean;
  viewerUserId: string | null;
  initialComments: NormCommentView[];
  currentPath: string;
};

function relativeTime(iso: string, locale: "en" | "es"): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.round((then - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === "es" ? "es" : "en", {
    numeric: "auto",
  });
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, "second");
  const mins = Math.round(diffSec / 60);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 48) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

function countAll(comments: NormCommentView[]): number {
  return comments.reduce((n, c) => n + 1 + c.replies.length, 0);
}

export function NormComments({
  normId,
  sectionId,
  locale,
  signedIn,
  viewerUserId,
  initialComments,
  currentPath,
}: Props) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const copy = useMemo(
    () =>
      locale === "es"
        ? {
            title: "Comentarios",
            empty: "Sé el primero en comentar esta sección.",
            placeholder: "Comparte una observación o pregunta…",
            replyPlaceholder: "Escribe tu respuesta…",
            publish: "Publicar",
            reply: "Responder",
            cancel: "Cancelar",
            edit: "Editar",
            save: "Guardar",
            remove: "Eliminar",
            like: "Útil",
            insightful: "Clave",
            report: "Reportar",
            reportSubmit: "Enviar reporte",
            reportPlaceholder: "¿Por qué reportas este comentario?",
            signIn: "Inicia sesión para comentar",
            signInCta: "Entrar",
            error: "No se pudo completar la acción.",
            reported: "Reporte enviado. Gracias.",
          }
        : {
            title: "Comments",
            empty: "Be the first to comment on this section.",
            placeholder: "Share an observation or question…",
            replyPlaceholder: "Write your reply…",
            publish: "Post",
            reply: "Reply",
            cancel: "Cancel",
            edit: "Edit",
            save: "Save",
            remove: "Delete",
            like: "Helpful",
            insightful: "Insightful",
            report: "Report",
            reportSubmit: "Submit report",
            reportPlaceholder: "Why are you reporting this comment?",
            signIn: "Sign in to join the discussion",
            signInCta: "Sign in",
            error: "Something went wrong.",
            reported: "Report submitted. Thank you.",
          },
    [locale],
  );

  const total = countAll(comments);

  const run = (
    fn: () => Promise<{ ok: true } | { ok: false; error: string }>,
    okMsg?: string,
  ) => {
    setStatus(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) {
        setStatus(copy.error);
        return;
      }
      if (okMsg) setStatus(okMsg);
      router.refresh();
    });
  };

  const onPublish = () => {
    const body = draft.trim();
    if (!body) return;
    run(async () => {
      const res = await createComment({
        normId,
        sectionId,
        body,
        parentId: null,
      });
      if (res.ok) setDraft("");
      return res;
    });
  };

  const onReply = (parentId: string) => {
    const body = replyDraft.trim();
    if (!body) return;
    run(async () => {
      const res = await createComment({
        normId,
        sectionId,
        body,
        parentId,
      });
      if (res.ok) {
        setReplyDraft("");
        setReplyTo(null);
      }
      return res;
    });
  };

  const onToggle = (commentId: string, kind: ReactionKind) => {
    if (!signedIn) return;
    run(async () => toggleReaction({ commentId, kind }));
  };

  const onSaveEdit = (commentId: string) => {
    const body = editDraft.trim();
    if (!body) return;
    run(async () => {
      const res = await updateOwnComment({ commentId, body });
      if (res.ok) setEditingId(null);
      return res;
    });
  };

  const onDelete = (commentId: string) => {
    run(async () => softDeleteOwnComment(commentId));
  };

  const onReport = (commentId: string) => {
    const reason = reportReason.trim();
    if (!reason) return;
    run(async () => {
      const res = await reportComment({ commentId, reason });
      if (res.ok) {
        setReportingId(null);
        setReportReason("");
      }
      return res;
    }, copy.reported);
  };

  const renderComment = (comment: NormCommentView, isReply = false) => {
    const isOwn = Boolean(viewerUserId && comment.userId === viewerUserId);
    const editing = editingId === comment.id;

    return (
      <li
        key={comment.id}
        className={cn(
          "border-t border-[color:var(--moss)]/15 pt-4",
          isReply && "ml-4 border-l-2 border-[color:var(--moss)]/20 pl-4 sm:ml-6",
        )}
      >
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-[color:var(--forest)]">
            {comment.authorDisplayName}
          </span>
          <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-muted-foreground">
            {relativeTime(comment.createdAt, locale)}
          </span>
        </div>

        {editing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-[color:var(--moss)]/30 bg-[color:var(--parchment)] px-3 py-2 text-sm text-[color:var(--forest)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary"
                disabled={pending}
                onClick={() => onSaveEdit(comment.id)}
              >
                {copy.save}
              </button>
              <button
                type="button"
                className="text-sm text-muted-foreground underline"
                onClick={() => setEditingId(null)}
              >
                {copy.cancel}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--forest)]/90">
            {comment.body}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[color:var(--moss)]">
          <button
            type="button"
            disabled={!signedIn || pending}
            onClick={() => onToggle(comment.id, "like")}
            className={cn(
              "transition hover:text-[color:var(--forest)]",
              comment.viewerReaction === "like" && "text-[color:var(--forest)]",
            )}
          >
            {copy.like}
            {comment.reactions.like ? ` · ${comment.reactions.like}` : ""}
          </button>
          <button
            type="button"
            disabled={!signedIn || pending}
            onClick={() => onToggle(comment.id, "insightful")}
            className={cn(
              "transition hover:text-[color:var(--forest)]",
              comment.viewerReaction === "insightful" && "text-[color:var(--forest)]",
            )}
          >
            {copy.insightful}
            {comment.reactions.insightful ? ` · ${comment.reactions.insightful}` : ""}
          </button>
          {!isReply && signedIn ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setReplyTo(comment.id);
                setReplyDraft("");
              }}
              className="transition hover:text-[color:var(--forest)]"
            >
              {copy.reply}
            </button>
          ) : null}
          {isOwn ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditingId(comment.id);
                  setEditDraft(comment.body);
                }}
                className="transition hover:text-[color:var(--forest)]"
              >
                {copy.edit}
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="transition hover:text-[color:var(--forest)]"
              >
                {copy.remove}
              </button>
            </>
          ) : signedIn ? (
            <button
              type="button"
              onClick={() => {
                setReportingId(comment.id);
                setReportReason("");
              }}
              className="transition hover:text-[color:var(--forest)]"
            >
              {copy.report}
            </button>
          ) : null}
        </div>

        {replyTo === comment.id ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={replyDraft}
              onChange={(e) => setReplyDraft(e.target.value)}
              rows={3}
              placeholder={copy.replyPlaceholder}
              className="w-full rounded-md border border-[color:var(--moss)]/30 bg-[color:var(--parchment)] px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary"
                disabled={pending || !replyDraft.trim()}
                onClick={() => onReply(comment.id)}
              >
                {copy.reply}
              </button>
              <button
                type="button"
                className="text-sm text-muted-foreground underline"
                onClick={() => setReplyTo(null)}
              >
                {copy.cancel}
              </button>
            </div>
          </div>
        ) : null}

        {reportingId === comment.id ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={2}
              placeholder={copy.reportPlaceholder}
              className="w-full rounded-md border border-[color:var(--moss)]/30 bg-[color:var(--parchment)] px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary"
                disabled={pending || !reportReason.trim()}
                onClick={() => onReport(comment.id)}
              >
                {copy.reportSubmit}
              </button>
              <button
                type="button"
                className="text-sm text-muted-foreground underline"
                onClick={() => setReportingId(null)}
              >
                {copy.cancel}
              </button>
            </div>
          </div>
        ) : null}

        {comment.replies.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <section className="mt-10 border-t border-[color:var(--moss)]/20 pt-6">
      <h3 className="font-display text-lg text-[color:var(--forest)]">
        {copy.title}
        <span className="ml-2 font-[family-name:var(--font-ui)] text-sm font-medium text-[color:var(--moss)]">
          ({total})
        </span>
      </h3>

      {signedIn ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder={copy.placeholder}
            className="w-full rounded-md border border-[color:var(--moss)]/30 bg-[color:var(--parchment)] px-3 py-2 text-sm text-[color:var(--forest)]"
          />
          <button
            type="button"
            className="btn-secondary"
            disabled={pending || !draft.trim()}
            onClick={onPublish}
          >
            {copy.publish}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {copy.signIn}{" "}
          <Link
            href={loginHref(currentPath)}
            className="font-semibold text-[color:var(--forest)] underline underline-offset-2"
          >
            {copy.signInCta}
          </Link>
        </p>
      )}

      {status ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}

      {comments.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="mt-6 space-y-4">{comments.map((c) => renderComment(c))}</ul>
      )}
    </section>
  );
}
