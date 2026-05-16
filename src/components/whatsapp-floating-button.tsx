"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");

  const href = useMemo(() => {
    const text = isSpanish
      ? "Hola Daniel, acabo de visitar tu sitio web y quiero preguntarte algo..."
      : "Hi Daniel, I was just visiting your website and want to ask you something...";
    return `https://wa.me/573006791123?text=${encodeURIComponent(text)}`;
  }, [isSpanish]);

  const label = isSpanish ? "Abrir WhatsApp para enviar un mensaje" : "Open WhatsApp to send a message";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title="WhatsApp"
      className="fixed bottom-5 right-5 z-[65] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--moss)] bg-[#25D366] text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]"
    >
      <WhatsappIcon className="h-6 w-6" />
    </a>
  );
}
