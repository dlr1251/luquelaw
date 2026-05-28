import { type NextRequest, NextResponse } from "next/server";

import { LOCALE_COOKIE, type SiteLocale } from "@/lib/locale/constants";
import { prefersSpanish } from "@/lib/locale/detect";
import {
  localeFromPathname,
  localizedPath,
  shouldLocalizePath,
} from "@/lib/locale/paths";

const LOCALE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
};

function setLocaleCookie(response: NextResponse, locale: SiteLocale) {
  response.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTIONS);
}

/** Redirect when saved locale or browser preference differs from the URL. */
export function handleLocaleRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!shouldLocalizePath(pathname)) {
    return null;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const pathLocale = localeFromPathname(pathname);

  if (cookieLocale === "en" || cookieLocale === "es") {
    if (cookieLocale === pathLocale) return null;

    const url = request.nextUrl.clone();
    url.pathname = localizedPath(pathname, cookieLocale);
    return NextResponse.redirect(url);
  }

  if (pathLocale === "en" && prefersSpanish(request.headers.get("accept-language"))) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(pathname, "es");
    const response = NextResponse.redirect(url);
    setLocaleCookie(response, "es");
    return response;
  }

  return null;
}

/** Remember English preference on first visit so we do not re-detect every request. */
export function applyLocaleCookie(request: NextRequest, response: NextResponse): NextResponse {
  const { pathname } = request.nextUrl;

  if (!shouldLocalizePath(pathname)) {
    return response;
  }

  if (request.cookies.get(LOCALE_COOKIE)?.value) {
    return response;
  }

  const pathLocale = localeFromPathname(pathname);
  if (pathLocale === "en" && !prefersSpanish(request.headers.get("accept-language"))) {
    setLocaleCookie(response, "en");
  }

  return response;
}
