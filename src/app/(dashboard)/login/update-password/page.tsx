import { redirect } from "next/navigation";

import { UpdatePasswordView } from "@/components/auth/update-password-view";
import { loginHref } from "@/lib/auth/safe-next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function UpdatePasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;

  if (!isSupabaseConfigured()) {
    redirect(loginHref(undefined, "en"));
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect(loginHref("/login/update-password", "en"));
  }

  return <UpdatePasswordView locale="en" error={error} />;
}
