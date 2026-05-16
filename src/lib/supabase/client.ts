import { createBrowserClient } from "@supabase/ssr";

import {
  SUPABASE_CONFIG_ERROR,
  getSupabaseKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export { isSupabaseConfigured } from "@/lib/supabase/config";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }
  return createBrowserClient(getSupabaseUrl(), getSupabaseKey());
}
