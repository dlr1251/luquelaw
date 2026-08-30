import { redirect } from "next/navigation";

import { LoginView } from "@/components/auth/login-view";
import { safeNextPath } from "@/lib/auth/safe-next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, message, next: nextRaw } = await searchParams;
  const next = safeNextPath(nextRaw);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect(next);
    }
  }

  return (
    <LoginView
      locale="en"
      next={next}
      error={error}
      message={message}
      configured={isSupabaseConfigured()}
    />
  );
}
