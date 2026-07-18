"use client";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactLinks } from "@/components/home/contact-links";
import { cn } from "@/lib/cn";
import type { HomeLocale } from "@/lib/home/content";

type Props = {
  locale: HomeLocale;
  whatsappHref: string;
  contactTitle: string;
  contactSubtitle: string;
  className?: string;
};

export function HeroEngagementPanel({
  locale,
  whatsappHref,
  contactTitle,
  contactSubtitle,
  className,
}: Props) {
  return (
    <div
      id="contact"
      className={cn(
        "scroll-mt-28 border border-border bg-card text-card-foreground shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-normal tracking-tight text-foreground">
            {contactTitle}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{contactSubtitle}</p>
        </div>

        <ContactForm locale={locale} variant="hero" whatsappHref={whatsappHref} />

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
