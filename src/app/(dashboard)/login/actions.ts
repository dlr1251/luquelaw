"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { safeNextPath } from "@/lib/auth/safe-next";
import { getSiteUrl } from "@/lib/billing/stripe";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function loginPath(opts?: { error?: string; message?: string; next?: string }) {
  const params = new URLSearchParams();
  if (opts?.error) params.set("error", opts.error);
  if (opts?.message) params.set("message", opts.message);
  const next = opts?.next ? safeNextPath(opts.next) : null;
  if (next && next !== "/portal") params.set("next", next);
  const qs = params.toString();
  return qs ? `/login?${qs}` : "/login";
}

function nextFromForm(formData: FormData): string {
  return safeNextPath(String(formData.get("next") ?? ""));
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(loginPath({ error: "Authentication is not configured on this environment." }));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = nextFromForm(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(loginPath({ error: error.message, next }));
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(loginPath({ error: "Authentication is not configured on this environment." }));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = nextFromForm(formData);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(loginPath({ error: error.message, next }));
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect(next);
  }

  redirect(
    loginPath({
      message: "Check your email to confirm your account.",
      next,
    }),
  );
}

export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(loginPath({ error: "Authentication is not configured on this environment." }));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect("/login/forgot?error=" + encodeURIComponent("Email is required."));
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/confirm?next=${encodeURIComponent("/login/update-password")}`,
  });

  if (error) {
    redirect("/login/forgot?error=" + encodeURIComponent(error.message));
  }

  redirect(
    "/login/forgot?message=" +
      encodeURIComponent("Check your email for a password reset link."),
  );
}

export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(loginPath({ error: "Authentication is not configured on this environment." }));
  }
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    redirect(
      "/login/update-password?error=" +
        encodeURIComponent("Password must be at least 6 characters."),
    );
  }
  if (password !== confirm) {
    redirect("/login/update-password?error=" + encodeURIComponent("Passwords do not match."));
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/login/update-password?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/portal?password=updated");
}
