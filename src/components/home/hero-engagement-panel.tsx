"use client";

import { useState } from "react";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactLinks } from "@/components/home/contact-links";
import { getBookingUrl } from "@/lib/booking/url";
import { cn } from "@/lib/cn";
import type { HomeLocale } from "@/lib/home/content";

type Tab = "book" | "message";

type Props = {
  locale: HomeLocale;
  whatsappHref: string;
  contactTitle: string;
  contactSubtitle: string;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  className?: string;
};

const copy = {
  en: {
    book: "Book consultation",
    message: "Send message",
    bookHint: "Pick a time on Google Calendar. Initial consultations are 1 hour.",
    calendarTitle: "Book a consultation",
  },
  es: {
    book: "Agendar consulta",
    message: "Enviar mensaje",
    bookHint: "Elige un horario en Google Calendar. La consulta inicial es de 1 hora.",
    calendarTitle: "Agendar consulta",
  },
} as const;

export function HeroEngagementPanel({
  locale,
  whatsappHref,
  contactTitle,
  contactSubtitle,
  activeTab: controlledTab,
  onTabChange,
  className,
}: Props) {
  const [internalTab, setInternalTab] = useState<Tab>("book");
  const tab = controlledTab ?? internalTab;
  const setTab = (next: Tab) => {
    if (controlledTab === undefined) setInternalTab(next);
    onTabChange?.(next);
  };

  const t = copy[locale];
  const bookingUrl = getBookingUrl();

  const tabButtonClass = (isActive: boolean) =>
    cn(
      "flex-1 px-3 py-2.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.1em] transition",
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:bg-background hover:text-foreground",
    );

  return (
    <div
      id="contact"
      className={cn(
        "scroll-mt-28 border border-border bg-card text-card-foreground shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div role="tablist" aria-label={locale === "es" ? "Contacto" : "Contact"} className="grid grid-cols-2 border-b border-border">
        <button
          type="button"
          role="tab"
          id="hero-tab-book"
          aria-selected={tab === "book"}
          aria-controls="hero-panel-book"
          onClick={() => setTab("book")}
          className={tabButtonClass(tab === "book")}
        >
          {t.book}
        </button>
        <button
          type="button"
          role="tab"
          id="hero-tab-message"
          aria-selected={tab === "message"}
          aria-controls="hero-panel-message"
          onClick={() => setTab("message")}
          className={tabButtonClass(tab === "message")}
        >
          {t.message}
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {tab === "book" ? (
          <div
            role="tabpanel"
            id="hero-panel-book"
            aria-labelledby="hero-tab-book"
            className="space-y-4"
          >
            <div>
              <h2 className="font-display text-lg font-normal tracking-tight text-foreground">
                {t.calendarTitle}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.bookHint}</p>
            </div>

            <div className="overflow-hidden border border-border bg-background">
              <iframe
                title={t.calendarTitle}
                src={bookingUrl}
                className="h-[min(420px,58vh)] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        ) : (
          <div
            role="tabpanel"
            id="hero-panel-message"
            aria-labelledby="hero-tab-message"
            className="space-y-4"
          >
            <div>
              <h2 className="font-display text-lg font-normal tracking-tight text-foreground">
                {contactTitle}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{contactSubtitle}</p>
            </div>

            <div className="max-h-[min(420px,58vh)] overflow-y-auto pr-1">
              <ContactForm locale={locale} variant="hero" whatsappHref={whatsappHref} />
            </div>
          </div>
        )}

        <ContactLinks
          whatsappHref={whatsappHref}
          className="mt-5 border-t border-border pt-5"
          align="center"
          variant="light"
        />
      </div>
    </div>
  );
}

export type HeroEngagementTab = Tab;
