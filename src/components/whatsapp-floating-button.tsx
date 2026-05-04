"use client";

import { useMemo } from "react";

import { usePathname } from "next/navigation";

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
      title={isSpanish ? "WhatsApp" : "WhatsApp"}
      className="fixed bottom-5 right-5 z-[65] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--moss)] bg-[color:var(--forest)] text-[color:var(--parchment)] shadow-lg transition hover:bg-[color:var(--parchment)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor">
        <path d="M19.11 17.53c-.3-.16-1.76-.87-2.03-.97-.27-.1-.47-.16-.67.16-.2.3-.77.97-.95 1.17-.17.2-.35.23-.65.08-.3-.16-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.54-.08-.16-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.54.08-.82.38-.27.3-1.08 1.05-1.08 2.57 0 1.5 1.1 2.96 1.25 3.17.16.2 2.16 3.3 5.23 4.63.73.31 1.3.5 1.74.64.73.23 1.4.2 1.93.12.59-.1 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Zm-3.03 10.1h-.01a13.06 13.06 0 0 1-6.25-1.6l-.45-.27-4.65 1.22 1.24-4.52-.3-.47a13.03 13.03 0 1 1 10.41 5.64Zm11.1-13.03A11.8 11.8 0 0 0 16.07 2.8C9.58 2.8 4.3 8.08 4.3 14.58c0 2.07.55 4.1 1.6 5.9L4.2 26.7l6.37-1.67a11.76 11.76 0 0 0 5.5 1.4h.01c6.5 0 11.78-5.28 11.78-11.78 0-3.14-1.22-6.1-3.44-8.35Z" />
      </svg>
    </a>
  );
}

