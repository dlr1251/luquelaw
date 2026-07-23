"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/cn";

/** Mobile NormReaderBar is fixed on article pages only (`lg:hidden`). */
function hasMobileNormReaderBar(pathname: string): boolean {
  return (
    /^\/clkr\/norms\/[^/]+/.test(pathname) ||
    /^\/es\/clkr\/norms\/[^/]+/.test(pathname)
  );
}

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const liftAboveReaderBar = hasMobileNormReaderBar(pathname);

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
      className={cn(
        "fixed right-4 z-[65] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-[#0f7a6e] hover:shadow-[0_10px_28px_rgba(0,0,0,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)] sm:right-5 sm:h-14 sm:w-14",
        // Match NormLayout mobile bottom padding (4.5rem bar) + small gap; reset at lg where the bar hides.
        liftAboveReaderBar
          ? "bottom-[calc(4.5rem+0.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
          : "bottom-[max(1.25rem,env(safe-area-inset-bottom))]",
      )}
    >
      <WhatsappIcon className="h-[1.35rem] w-[1.35rem] sm:h-6 sm:w-6" />
    </a>
  );
}
