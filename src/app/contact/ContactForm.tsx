"use client";

import { useMemo, useState } from "react";

const matterTypes = ["Immigration", "Real Estate", "Corporate", "Other"] as const;

export function ContactForm({ locale = "en" }: { locale?: "en" | "es" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matterType, setMatterType] =
    useState<(typeof matterTypes)[number]>("Immigration");
  const [message, setMessage] = useState("");

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
            "Cuéntame qué estás tratando de hacer, dónde estás ubicado y qué plazo manejas.",
          submit: "Enviar (abre correo)",
          whatsapp: "O escribe por WhatsApp",
        }
      : {
          name: "Name",
          email: "Email",
          matterType: "Matter type",
          message: "Message",
          placeholder:
            "Tell me what you’re trying to do, where you’re based, and what timeline you’re working with.",
          submit: "Send (opens email)",
          whatsapp: "Or message on WhatsApp",
        };

  const fieldClass =
    "mt-2 h-11 w-full border border-[color:var(--caramel)]/40 bg-[color:var(--card)] px-4 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--caramel)]/35 focus:ring-2";

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-[color:var(--ink)]">
          {copy.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            autoComplete="name"
            required
          />
        </label>
        <label className="block text-sm font-bold text-[color:var(--ink)]">
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

      <label className="block text-sm font-bold text-[color:var(--ink)]">
        {copy.matterType}
        <select
          value={matterType}
          onChange={(e) =>
            setMatterType(e.target.value as (typeof matterTypes)[number])
          }
          className={fieldClass}
        >
          {matterTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-bold text-[color:var(--ink)]">
        {copy.message}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 min-h-40 w-full resize-y border border-[color:var(--caramel)]/40 bg-[color:var(--card)] px-4 py-3 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--caramel)]/35 focus:ring-2"
          placeholder={copy.placeholder}
          required
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary btn-primary-lg">
          {copy.submit}
        </button>
        <a
          className="text-sm font-bold text-[color:var(--caramel)] hover:underline"
          href="https://wa.me/573006791123"
          target="_blank"
          rel="noreferrer"
        >
          {copy.whatsapp}
        </a>
      </div>
    </form>
  );
}
