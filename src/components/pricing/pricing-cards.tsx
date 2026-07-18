"use client";

import { useState } from "react";

import { loginHref } from "@/lib/auth/safe-next";
import type { PlanRow } from "@/lib/billing/plans";

type Props = {
  plans: PlanRow[];
  locale: "en" | "es";
  signedIn: boolean;
};

export function PricingCards({ plans, locale, signedIn }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copy =
    locale === "es"
      ? {
          features: "Incluye",
          cta: "Suscribirse",
          signIn: "Inicia sesión para suscribirte",
          manage: "Gestionar facturación",
          noPrice: "Precio Stripe pendiente de configurar",
          error: "No se pudo iniciar el checkout",
        }
      : {
          features: "Includes",
          cta: "Subscribe",
          signIn: "Sign in to subscribe",
          manage: "Manage billing",
          noPrice: "Stripe price not configured yet",
          error: "Could not start checkout",
        };

  async function startCheckout(planId: string) {
    setError(null);
    setLoadingId(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? copy.error);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(copy.error);
    } finally {
      setLoadingId(null);
    }
  }

  async function openPortal() {
    setError(null);
    setLoadingId("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? copy.error);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(copy.error);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const name = locale === "es" ? plan.name_es : plan.name_en;
          const description = locale === "es" ? plan.description_es : plan.description_en;
          return (
            <div
              key={plan.id}
              className="flex flex-col border border-[color:var(--moss)]/25 bg-[color:var(--card)] p-6"
            >
              <h2 className="font-display text-2xl text-[color:var(--forest)]">{name}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <p className="mt-4 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {copy.features}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f}>· {f.replaceAll("_", " ")}</li>
                ))}
              </ul>
              <div className="mt-6">
                {!signedIn ? (
                  <a
                    href={loginHref(locale === "es" ? "/es/pricing" : "/pricing")}
                    className="btn-primary inline-flex w-full justify-center"
                  >
                    {copy.signIn}
                  </a>
                ) : plan.stripe_price_id ? (
                  <button
                    type="button"
                    className="btn-primary w-full"
                    disabled={loadingId === plan.id}
                    onClick={() => startCheckout(plan.id)}
                  >
                    {loadingId === plan.id ? "…" : copy.cta}
                  </button>
                ) : (
                  <p className="text-xs text-muted-foreground">{copy.noPrice}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {signedIn ? (
        <button
          type="button"
          className="btn-secondary"
          disabled={loadingId === "portal"}
          onClick={openPortal}
        >
          {copy.manage}
        </button>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
