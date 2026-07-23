import { Container } from "@/components/container";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { getActivePlans } from "@/lib/billing/plans";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.pricing.en.title,
  description: PAGE_SEO.pricing.en.description,
  path: "/pricing",
  locale: "en",
});

export default async function PricingPage() {
  const plans = await getActivePlans();
  let signedIn = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims?.sub);
  }

  return (
    <main className="flex-1">
      <Container className="py-14 sm:py-16">
        <p className="marketing-eyebrow">CLKR · Plans</p>
        <h1 className="marketing-display mt-3 max-w-3xl text-[color:var(--forest)]">
          Professional & Client
        </h1>
        <p className="marketing-body mt-4 max-w-2xl">
          Plans for CLKR modules and portal tickets. Tools for study and orientation — not legal
          advice.
        </p>
        <div className="mt-12">
          <PricingCards plans={plans} locale="en" signedIn={signedIn} />
        </div>
      </Container>
    </main>
  );
}
