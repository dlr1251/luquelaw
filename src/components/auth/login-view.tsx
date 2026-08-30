import {
  AuthFooterLink,
  AuthNotice,
  AuthShell,
  authFieldClass,
  authLabelClass,
} from "@/components/auth/auth-shell";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { login, signup } from "@/app/(dashboard)/login/actions";
import { loginCopy } from "@/lib/auth/copy";
import type { AuthLocale } from "@/lib/auth/safe-next";

type Props = {
  locale: AuthLocale;
  next: string;
  error?: string;
  message?: string;
  configured: boolean;
};

export function LoginView({ locale, next, error, message, configured }: Props) {
  const c = loginCopy(locale);

  return (
    <AuthShell
      title={c.title}
      lead={c.lead}
      homeHref={c.homeHref}
      footer={<AuthFooterLink href={c.homeHref}>{c.backSite}</AuthFooterLink>}
    >
      {!configured ? (
        <SupabaseSetupNotice
          title={c.setupTitle}
          body={c.setupBody}
          backHref={c.homeHref}
          backLabel={c.setupBack}
        />
      ) : (
        <div className="space-y-6">
          {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}
          {message ? <AuthNotice>{message}</AuthNotice> : null}

          <form className="space-y-5">
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="locale" value={locale} />
            <div>
              <label htmlFor="email" className={authLabelClass}>
                {c.email}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className={authFieldClass}
              />
            </div>
            <div>
              <label htmlFor="password" className={authLabelClass}>
                {c.password}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                minLength={6}
                required
                className={authFieldClass}
              />
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <button formAction={login} type="submit" className="btn-primary w-full">
                {c.submit}
              </button>
              <button formAction={signup} type="submit" className="btn-secondary w-full">
                {c.signup}
              </button>
            </div>
          </form>

          <AuthFooterLink href={c.forgotHref}>{c.forgot}</AuthFooterLink>
        </div>
      )}
    </AuthShell>
  );
}
