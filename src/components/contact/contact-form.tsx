"use client";

import { useMemo, useState } from "react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/cn";

const matterTypesEn = ["Immigration", "Real Estate", "Corporate", "Legal Advisory", "Other"] as const;
const matterTypesEs = ["Migratorio", "Inmobiliario", "Corporativo", "Asesoría legal", "Otro"] as const;

type Props = {
  locale?: "en" | "es";
  variant?: "default" | "hero";
  whatsappHref?: string;
  className?: string;
};

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm({
  locale = "en",
  variant = "default",
  whatsappHref,
  className,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matterType, setMatterType] = useState<string>(
    locale === "es" ? matterTypesEs[0] : matterTypesEn[0],
  );
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const matterTypes = locale === "es" ? matterTypesEs : matterTypesEn;
  const isHero = variant === "hero";

  const useApiRoute = Boolean(
    process.env.NEXT_PUBLIC_CONTACT_FORM_USE_API === "true" ||
      process.env.NEXT_PUBLIC_CONTACT_FORM_USE_API === "1",
  );
  const formEndpoint = useApiRoute
    ? "/api/contact"
    : process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

  const mailto = useMemo(() => {
    const subject =
      locale === "es"
        ? `Nueva consulta (${matterType}) — Daniel Luque Restrepo`
        : `New inquiry (${matterType}) — Daniel Luque Restrepo`;
    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Matter type: ${matterType}`,
      "",
      message || "-",
    ].join("\n");

    return `mailto:daniel@luquelaw.co?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [email, locale, matterType, message, name]);

  const copy =
    locale === "es"
      ? {
          name: "Nombre",
          email: "Correo electrónico",
          matterType: "Tipo de asunto",
          message: "Mensaje",
          placeholder:
            "Cuéntame qué necesitas, dónde estás y qué plazo manejas.",
          submit: "Enviar mensaje",
          submitting: "Enviando…",
          success: "Mensaje enviado. Te responderé pronto.",
          error: "No se pudo enviar. Intenta por correo o WhatsApp.",
          mailtoFallback: "Enviar por correo",
          whatsapp: "WhatsApp",
        }
      : {
          name: "Name",
          email: "Email",
          matterType: "Matter type",
          message: "Message",
          placeholder:
            "Tell me what you need, where you're based, and your timeline.",
          submit: "Send message",
          submitting: "Sending…",
          success: "Message sent. I'll get back to you soon.",
          error: "Could not send. Try email or WhatsApp instead.",
          mailtoFallback: "Send via email",
          whatsapp: "WhatsApp",
        };

  const labelClass = cn(
    "block text-sm font-bold",
    isHero ? "text-[color:var(--forest)]" : "text-[color:var(--ink)]",
  );

  const fieldClass = cn(
    "mt-1.5 w-full border text-sm outline-none ring-[color:var(--moss)]/35 focus:ring-2",
    isHero
      ? "h-10 border-[color:var(--moss)]/35 bg-white px-3 text-[color:var(--ink)]"
      : "h-11 border-[color:var(--moss)]/40 bg-[color:var(--card)] px-4 text-[color:var(--ink)]",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            matterType,
            message,
            _subject:
              locale === "es"
                ? `Consulta web (${matterType})`
                : `Website inquiry (${matterType})`,
          }),
        });
        if (res.ok) {
          setStatus("success");
          setName("");
          setEmail("");
          setMessage("");
          return;
        }
        setStatus("error");
      } catch {
        setStatus("error");
      }
      return;
    }

    window.location.href = mailto;
  }

  return (
    <form className={cn("space-y-3.5", className)} onSubmit={handleSubmit}>
      <div className={cn("grid gap-3.5", isHero ? "sm:grid-cols-1" : "sm:grid-cols-2")}>
        <label className={labelClass}>
          {copy.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            autoComplete="name"
            required
          />
        </label>
        <label className={labelClass}>
          {copy.email}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            type="email"
            autoComplete="email"
            required
          />
        </label>
      </div>

      <label className={labelClass}>
        {copy.matterType}
        <select
          value={matterType}
          onChange={(e) => setMatterType(e.target.value)}
          className={fieldClass}
        >
          {matterTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        {copy.message}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(
            fieldClass,
            "mt-1.5 min-h-28 resize-y py-2.5",
            isHero && "min-h-24",
          )}
          placeholder={copy.placeholder}
          required
        />
      </label>

      {status === "success" ? (
        <p className="text-sm font-medium text-[color:var(--moss)]" role="status">
          {copy.success}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {copy.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            isHero ? "btn-primary btn-primary-sm w-full sm:w-auto" : "btn-primary btn-primary-lg",
          )}
        >
          {status === "sending" ? copy.submitting : copy.submit}
        </button>
        {!formEndpoint ? (
          <a
            className="text-sm font-bold text-[color:var(--moss)] hover:underline"
            href={mailto}
          >
            {copy.mailtoFallback}
          </a>
        ) : null}
        {whatsappHref ? (
          <a
            className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--moss)] hover:underline"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsappIcon className="h-3.5 w-3.5" />
            {copy.whatsapp}
          </a>
        ) : null}
      </div>
    </form>
  );
}
