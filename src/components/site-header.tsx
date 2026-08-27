import { isAppAdmin } from "@/lib/auth/is-admin";
import { getFxRates } from "@/lib/markets/fx";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import {
  SiteHeaderChrome,
  type SiteHeaderChromeProps,
} from "@/components/site-header-chrome";

export type { SiteHeaderChromeProps };

export async function getSiteHeaderProps(): Promise<SiteHeaderChromeProps> {
  let signedIn = false;
  let isAdmin = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getClaims();
      signedIn = Boolean(data?.claims);
      isAdmin = isAppAdmin(data?.claims);
    } catch {
      signedIn = false;
      isAdmin = false;
    }
  }

  const rates = await getFxRates();
  return { rates, signedIn, isAdmin };
}

/** Prefer `getSiteHeaderProps` + `SiteHeaderChrome` under `BookingProvider`. */
export async function SiteHeader() {
  const props = await getSiteHeaderProps();
  return <SiteHeaderChrome {...props} />;
}
