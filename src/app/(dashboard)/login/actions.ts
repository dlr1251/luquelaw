"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authActionCopy } from "@/lib/auth/copy";
import {
  loginBasePath,
  safeNextPath,
  type AuthLocale,
} from "@/lib/auth/safe-next";
import { getSiteUrl } from "@/lib/billing/stripe";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

function localeFromForm(formData: FormData): AuthLocale {
  return formData.get("locale") === "es" ? "es" : "en";
}

function loginPath(
  locale: AuthLocale,
  opts?: { error?: string; message?: string; next?: string },
) {
  const params = new URLSearchParams();
  if (opts?.error) params.set("error", opts.error);
  if (opts?.message) params.set("message", opts.message);
  const next = opts?.next ? safeNextPath(opts.next) : null;
  if (next && next !== "/portal/lucy") params.set("next", next);
  const qs = params.toString();
  const base = loginBasePath(locale);
  return qs ? `${base}?${qs}` : base;
}

function forgotPath(locale: AuthLocale, opts: { error?: string; message?: string }) {
  const params = new URLSearchParams();
  if (opts.error) params.set("error", opts.error);
  if (opts.message) params.set("message", opts.message);
  const qs = params.toString();
  const base = `${loginBasePath(locale)}/forgot`;
  return qs ? `${base}?${qs}` : base;
}

function updatePath(locale: AuthLocale, error?: string) {
  const base = `${loginBasePath(locale)}/update-password`;
  return error ? `${base}?error=${encodeURIComponent(error)}` : base;
}

function nextFromForm(formData: FormData): string {
  return safeNextPath(String(formData.get("next") ?? ""));
}

export async function login(formData: FormData) {
  const locale = localeFromForm(formData);
  const copy = authActionCopy(locale);

  if (!isSupabaseConfigured()) {
    redirect(loginPath(locale, { error: copy.notConfigured }));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = nextFromForm(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(loginPath(locale, { error: error.message, next }));
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signup(formData: FormData) {
  const locale = localeFromForm(formData);
  const copy = authActionCopy(locale);

  if (!isSupabaseConfigured()) {
    redirect(loginPath(locale, { error: copy.notConfigured }));
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
    redirect(loginPath(locale, { error: error.message, next }));
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect(next);
  }

  redirect(
    loginPath(locale, {
      message: copy.confirmEmail,
      next,
    }),
  );
}

export async function requestPasswordReset(formData: FormData) {
  const locale = localeFromForm(formData);
  const copy = authActionCopy(locale);

  if (!isSupabaseConfigured()) {
    redirect(loginPath(locale, { error: copy.notConfigured }));
  }
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect(forgotPath(locale, { error: copy.emailRequired }));
  }

  const updateHref = `${loginBasePath(locale)}/update-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/confirm?next=${encodeURIComponent(updateHref)}`,
  });

  if (error) {
    redirect(forgotPath(locale, { error: error.message }));
  }

  redirect(forgotPath(locale, { message: copy.resetSent }));
}

export async function updatePassword(formData: FormData) {
  const locale = localeFromForm(formData);
  const copy = authActionCopy(locale);

  if (!isSupabaseConfigured()) {
    redirect(loginPath(locale, { error: copy.notConfigured }));
  }
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    redirect(updatePath(locale, copy.passwordShort));
  }
  if (password !== confirm) {
    redirect(updatePath(locale, copy.passwordMismatch));
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(updatePath(locale, error.message));
  }

  revalidatePath("/", "layout");
  redirect("/portal?password=updated");
}
