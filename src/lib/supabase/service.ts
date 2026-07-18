import { createClient } from "@supabase/supabase-js";

import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

/** Service-role client for webhooks / trusted server jobs (bypasses RLS). */
export function createServiceClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
