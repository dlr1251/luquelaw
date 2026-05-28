"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Paperclip, X } from "lucide-react";

import { ContactSuccess } from "@/components/contact/contact-success";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { MAX_CONTACT_FILES } from "@/lib/contact/constants";
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

function envFlag(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "true" || normalized === "1";
}

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
  const [dataConsent, setDataConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const matterTypes = locale === "es" ? matterTypesEs : matterTypesEn;
  const isHero = variant === "hero";

  const useApiRoute =
    envFlag(process.env.NEXT_PUBLIC_CONTACT_FORM_USE_API) ||
    envFlag(process.env.NEXT_PUBLIC_CONTACT_FORM_USE_RESEND);
  const formEndpoint = useApiRoute
    ? "/api/contact"
    : process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim();

  const privacyHref = locale === "es" ? "/privacidad" : "/privacy";

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
          attachments: "Adjuntar archivos",
          attachmentsHint: `Hasta ${MAX_CONTACT_FILES} archivos (PDF, Word, Excel, imágenes). Máx. 10 MB c/u.`,
          placeholder:
            "Cuéntame qué necesitas, dónde estás y qué plazo manejas.",
          submit: "Enviar mensaje",
          submitting: "Enviando…",
          error: "No se pudo enviar. Intenta por correo o WhatsApp.",
          mailtoFallback: "Enviar por correo",
          whatsapp: "WhatsApp",
          consentBefore: "Autorizo el ",
          consentLink: "tratamiento de mis datos personales",
          consentAfter:
            " conforme a la Ley 1581 de 2012 y demás normas aplicables en Colombia, para atender mi consulta.",
          consentRequired: "Debes aceptar la política de datos personales.",
          removeFile: "Quitar",
        }
      : {
          name: "Name",
          email: "Email",
          matterType: "Matter type",
          message: "Message",
          attachments: "Attach files",
          attachmentsHint: `Up to ${MAX_CONTACT_FILES} files (PDF, Word, Excel, images). Max 10 MB each.`,
          placeholder:
            "Tell me what you need, where you're based, and your timeline.",
          submit: "Send message",
          submitting: "Sending…",
          error: "Could not send. Try email or WhatsApp instead.",
          mailtoFallback: "Send via email",
          whatsapp: "WhatsApp",
          consentBefore: "I authorize the ",
          consentLink: "processing of my personal data",
          consentAfter:
            " in accordance with Colombian Law 1581 of 2012 and applicable regulations, to handle my inquiry.",
          consentRequired: "You must accept the personal data policy.",
          removeFile: "Remove",
        };

  const labelClass = "block text-sm font-bold text-foreground";

  const fieldClass = cn(
    "mt-1.5 w-full border border-border bg-background text-foreground text-base outline-none ring-ring/35 focus:ring-2 sm:text-sm",
    isHero ? "h-10 px-3" : "h-11 px-4",
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    setFiles((prev) => {
      const merged = [...prev, ...selected].slice(0, MAX_CONTACT_FILES);
      return merged;
    });
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setName("");
    setEmail("");
    setMessage("");
    setDataConsent(false);
    setFiles([]);
    setStatus("idle");
    setErrorMessage(null);
    setSubmittedEmail("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!dataConsent) {
      setErrorMessage(null);
      setStatus("error");
      return;
    }

    if (formEndpoint) {
      setErrorMessage(null);
      setStatus("sending");
      try {
        const body = new FormData();
        body.set("name", name);
        body.set("email", email);
        body.set("matterType", matterType);
        body.set("message", message);
        body.set("locale", locale);
        body.set("dataConsent", "true");
        for (const file of files) {
          body.append("files", file);
        }

        const res = await fetch(formEndpoint, {
          method: "POST",
          body,
        });

        const data = (await res.json().catch(() => ({}))) as { error?: string };

        if (res.ok) {
          setSubmittedEmail(email);
          setStatus("success");
          return;
        }
        setErrorMessage(data.error ?? copy.error);
        setStatus("error");
        if (data.error) console.error("[contact]", data.error);
      } catch {
        setErrorMessage(copy.error);
        setStatus("error");
      }
      return;
    }

    window.location.href = mailto;
  }

  if (status === "success") {
    return (
      <ContactSuccess
        locale={locale}
        email={submittedEmail}
        className={className}
        onSendAnother={resetForm}
      />
    );
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

      <div>
        <span className={labelClass}>{copy.attachments}</span>
        <p className="mt-0.5 text-xs text-[color:var(--muted)]">{copy.attachmentsHint}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            id="contact-files"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.gif,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            onChange={handleFileChange}
            disabled={files.length >= MAX_CONTACT_FILES}
          />
          <label
            htmlFor="contact-files"
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-sm font-bold transition-colors",
              files.length >= MAX_CONTACT_FILES
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-muted",
              "border-border bg-background text-foreground",
            )}
          >
            <Paperclip className="h-4 w-4" aria-hidden />
            {copy.attachments}
            {files.length > 0 ? ` (${files.length}/${MAX_CONTACT_FILES})` : ""}
          </label>
        </div>
        {files.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded border border-border bg-muted/50 px-2 py-1 text-xs"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="inline-flex shrink-0 items-center gap-1 font-bold text-foreground hover:underline"
                  aria-label={`${copy.removeFile} ${file.name}`}
                >
                  <X className="h-3 w-3" aria-hidden />
                  {copy.removeFile}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <label className="flex items-start gap-2.5 text-sm leading-snug text-[color:var(--ink)]">
        <input
          type="checkbox"
          checked={dataConsent}
          onChange={(e) => setDataConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-foreground"
          required
        />
        <span>
          {copy.consentBefore}
          <Link href={privacyHref} className="font-bold text-foreground underline">
            {copy.consentLink}
          </Link>
          {copy.consentAfter}
        </span>
      </label>

      {status === "error" ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {!dataConsent ? copy.consentRequired : (errorMessage ?? copy.error)}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "sending" || !dataConsent}
          className={cn(
            isHero ? "btn-primary btn-primary-sm w-full sm:w-auto" : "btn-primary btn-primary-lg",
          )}
        >
          {status === "sending" ? copy.submitting : copy.submit}
        </button>
        {!formEndpoint ? (
          <a
            className="text-sm font-bold text-foreground hover:underline"
            href={mailto}
          >
            {copy.mailtoFallback}
          </a>
        ) : null}
        {whatsappHref ? (
          <a
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:underline"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsappIcon className="h-4 w-4 shrink-0" />
            {copy.whatsapp}
          </a>
        ) : null}
      </div>
    </form>
  );
}
