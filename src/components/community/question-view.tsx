"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  acceptAnswer,
  castVote,
  createAnswer,
  createComment,
  reportContent,
} from "@/lib/community/actions";

type Answer = {
  id: string;
  body: string;
  score: number;
  is_accepted: boolean;
  author_id: string;
  author_display_name: string;
  created_at: string;
};

type Comment = {
  id: string;
  body: string;
  author_display_name: string;
  answer_id?: string | null;
  question_id?: string | null;
};

export function CommunityQuestionView({
  locale,
  question,
  answers,
  questionComments,
  answerComments,
  viewerUserId,
  signedIn,
}: {
  locale: "en" | "es";
  question: {
    id: string;
    title: string;
    body: string;
    score: number;
    author_id: string;
    author_display_name: string;
    status: string;
    tags: string[];
  };
  answers: Answer[];
  questionComments: Comment[];
  answerComments: Comment[];
  viewerUserId: string | null;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [answerBody, setAnswerBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginHref =
    locale === "es"
      ? `/login?next=/es/comunidad`
      : `/login?next=/community`;

  function refresh() {
    router.refresh();
  }

  function vote(targetType: "question" | "answer", targetId: string, value: 1 | -1) {
    if (!signedIn) {
      window.location.href = loginHref;
      return;
    }
    startTransition(async () => {
      const r = await castVote({ targetType, targetId, value });
      if (!r.ok) setError(r.error);
      else refresh();
    });
  }

  return (
    <div className="space-y-8">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <article className="space-y-3">
        <div className="flex gap-4">
          <div className="flex w-12 flex-col items-center gap-1 text-sm">
            <button type="button" disabled={pending} onClick={() => vote("question", question.id, 1)}>
              ▲
            </button>
            <span className="font-semibold">{question.score}</span>
            <button type="button" disabled={pending} onClick={() => vote("question", question.id, -1)}>
              ▼
            </button>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="marketing-title">{question.title}</h1>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {question.body}
            </p>
            <p className="text-xs text-muted-foreground">
              {question.author_display_name}
              {question.tags?.length ? ` · ${question.tags.join(", ")}` : ""}
              {question.status !== "open" ? ` · ${question.status}` : ""}
            </p>
            {signedIn ? (
              <button
                type="button"
                className="text-xs underline"
                onClick={() =>
                  startTransition(async () => {
                    await reportContent({
                      targetType: "question",
                      targetId: question.id,
                      reason: "reported from UI",
                    });
                  })
                }
              >
                Report
              </button>
            ) : null}
          </div>
        </div>

        <ul className="ml-16 space-y-2 border-l pl-4 text-sm text-muted-foreground">
          {questionComments.map((c) => (
            <li key={c.id}>
              <strong className="text-foreground">{c.author_display_name}</strong>: {c.body}
            </li>
          ))}
        </ul>

        {signedIn ? (
          <form
            className="ml-16 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const body = String(fd.get("body") ?? "");
              startTransition(async () => {
                await createComment({ questionId: question.id, body });
                e.currentTarget.reset();
                refresh();
              });
            }}
          >
            <input
              name="body"
              placeholder="Add a comment…"
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </form>
        ) : null}
      </article>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{answers.length} answers</h2>
        {answers.map((a) => (
          <div key={a.id} className="flex gap-4 border-t pt-4">
            <div className="flex w-12 flex-col items-center gap-1 text-sm">
              <button type="button" disabled={pending} onClick={() => vote("answer", a.id, 1)}>
                ▲
              </button>
              <span className="font-semibold">{a.score}</span>
              <button type="button" disabled={pending} onClick={() => vote("answer", a.id, -1)}>
                ▼
              </button>
              {a.is_accepted ? (
                <span className="text-xs text-[var(--forest)]">✓</span>
              ) : viewerUserId === question.author_id ? (
                <button
                  type="button"
                  className="text-xs underline"
                  onClick={() =>
                    startTransition(async () => {
                      await acceptAnswer(a.id);
                      refresh();
                    })
                  }
                >
                  Accept
                </button>
              ) : null}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{a.body}</p>
              <p className="text-xs text-muted-foreground">{a.author_display_name}</p>
              <ul className="space-y-1 border-l pl-3 text-sm text-muted-foreground">
                {answerComments
                  .filter((c) => c.answer_id === a.id)
                  .map((c) => (
                    <li key={c.id}>
                      <strong className="text-foreground">{c.author_display_name}</strong>: {c.body}
                    </li>
                  ))}
              </ul>
              {signedIn ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const body = String(fd.get("body") ?? "");
                    startTransition(async () => {
                      await createComment({ answerId: a.id, body });
                      e.currentTarget.reset();
                      refresh();
                    });
                  }}
                >
                  <input
                    name="body"
                    placeholder="Comment on this answer…"
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      {signedIn ? (
        <form
          className="space-y-2 border-t pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(async () => {
              const r = await createAnswer({ questionId: question.id, body: answerBody });
              if (!r.ok) setError(r.error);
              else {
                setAnswerBody("");
                refresh();
              }
            });
          }}
        >
          <h2 className="text-lg font-semibold">Your answer</h2>
          <textarea
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            rows={6}
            className="w-full rounded border px-3 py-2 text-sm"
            required
            minLength={8}
          />
          <button type="submit" className="btn-primary" disabled={pending}>
            Post answer
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href={loginHref} className="underline">
            Sign in
          </a>{" "}
          to answer.
        </p>
      )}
    </div>
  );
}
