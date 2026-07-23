import { createServerClient } from "@supabase/ssr";
import { eveChannel } from "eve/channels/eve";
import { localDev, type AuthFn } from "eve/channels/auth";

function parseCookies(header: string | null): { name: string; value: string }[] {
  if (!header) return [];
  return header.split(";").flatMap((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return [];
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!name) return [];
    return [{ name, value }];
  });
}

/** Resolve the logged-in Supabase user from browser cookies (same-origin portal). */
function supabaseSessionAuth(): AuthFn<Request> {
  return async (request) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
      "";
    if (!url || !key) return null;

    const cookieHeader = request.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    if (!cookies.length) return null;

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookies;
        },
        setAll() {
          /* read-only at the Eve boundary */
        },
      },
    });

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const localeHeader = request.headers.get("x-torny-locale");
    const chatId = request.headers.get("x-torny-chat-id");

    return {
      authenticator: "supabase",
      principalId: data.user.id,
      principalType: "user" as const,
      subject: data.user.id,
      attributes: {
        email: data.user.email ?? "",
        ...(localeHeader === "es" || localeHeader === "en"
          ? { locale: localeHeader }
          : {}),
        ...(chatId ? { chatId } : {}),
      },
    };
  };
}

export default eveChannel({
  auth: [supabaseSessionAuth(), localDev()],
});
