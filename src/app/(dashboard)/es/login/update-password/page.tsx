import { redirect } from "next/navigation";

import { UpdatePasswordView } from "@/components/auth/update-password-view";
import { loginHref } from "@/lib/auth/safe-next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function UpdatePasswordEsPage({ searchParams }: Props) {
  const { error } = await searchParams;

  if (!isSupabaseConfigured()) {
    redirect(loginHref(undefined, "es"));
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect(loginHref("/es/login/update-password", "es"));
  }

  return <UpdatePasswordView locale="es" error={error} />;
}
