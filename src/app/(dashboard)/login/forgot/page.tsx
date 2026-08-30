import { ForgotPasswordView } from "@/components/auth/forgot-password-view";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

  return (
    <ForgotPasswordView
      locale="en"
      error={error}
      message={message}
      configured={isSupabaseConfigured()}
    />
  );
}
