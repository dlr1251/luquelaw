"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function loginPath(error?: string) {
  if (!error) return "/login";
  return `/login?error=${encodeURIComponent(error)}`;
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(loginPath("Authentication is not configured on this environment."));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(loginPath(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(loginPath("Authentication is not configured on this environment."));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(loginPath(error.message));
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/account");
  }

  redirect(
    "/login?message=" +
      encodeURIComponent("Check your email to confirm your account."),
  );
}
