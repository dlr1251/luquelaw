"use client";

import { CheckCircle2, Mail } from "lucide-react";

import { cn } from "@/lib/cn";

type Props = {
  locale?: "en" | "es";
  email?: string;
  className?: string;
  onSendAnother?: () => void;
};

export function ContactSuccess({ locale = "en", email, className, onSendAnother }: Props) {
  const copy =
    locale === "es"
      ? {
          title: "¡Mensaje enviado!",
          body: "Hemos recibido tu consulta y te enviamos un correo de confirmación",
          hint: "Revisa tu bandeja de entrada (y spam). Te responderemos lo antes posible.",
          another: "Enviar otro mensaje",
        }
      : {
          title: "Message sent!",
          body: "We received your inquiry and sent you a confirmation email",
          hint: "Check your inbox (and spam). We'll respond as soon as possible.",
          another: "Send another message",
        };

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-[color:var(--moss)]/25 bg-[color:var(--parchment)]/60 px-6 py-10 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-5">
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[color:var(--moss)]/20"
          aria-hidden
        />
        <CheckCircle2
          className="relative h-14 w-14 text-[color:var(--moss)] animate-in zoom-in-50 duration-500"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>

      <h3 className="font-display text-xl font-normal text-[color:var(--forest)]">
        {copy.title}
      </h3>

      <p className="mt-2 flex max-w-sm items-center justify-center gap-2 text-sm text-[color:var(--ink)]">
        <Mail className="h-4 w-4 shrink-0 text-[color:var(--moss)]" aria-hidden />
        <span>
          {copy.body}
          {email ? (
            <>
              {" "}
              a <strong className="font-semibold">{email}</strong>
            </>
          ) : null}
          .
        </span>
      </p>

      <p className="mt-3 max-w-sm text-xs leading-5 text-[color:var(--muted)]">{copy.hint}</p>

      {onSendAnother ? (
        <button
          type="button"
          onClick={onSendAnother}
          className="mt-6 text-sm font-bold text-[color:var(--moss)] hover:underline"
        >
          {copy.another}
        </button>
      ) : null}
    </div>
  );
}
