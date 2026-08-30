import { requestPasswordReset } from "@/app/(dashboard)/login/actions";
import {
  AuthFooterLink,
  AuthNotice,
  AuthShell,
  authFieldClass,
  authLabelClass,
} from "@/components/auth/auth-shell";
import { forgotCopy } from "@/lib/auth/copy";
import type { AuthLocale } from "@/lib/auth/safe-next";

type Props = {
  locale: AuthLocale;
  error?: string;
  message?: string;
  configured: boolean;
};

export function ForgotPasswordView({ locale, error, message, configured }: Props) {
  const c = forgotCopy(locale);

  return (
    <AuthShell
      title={c.title}
      lead={c.lead}
      homeHref={c.homeHref}
      footer={<AuthFooterLink href={c.loginHref}>{c.back}</AuthFooterLink>}
    >
      {!configured ? (
        <AuthNotice tone="error">{c.notConfigured}</AuthNotice>
      ) : (
        <div className="space-y-6">
          {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}
          {message ? <AuthNotice>{message}</AuthNotice> : null}
          <form action={requestPasswordReset} className="space-y-5">
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
            <button type="submit" className="btn-primary w-full">
              {c.submit}
            </button>
          </form>
        </div>
      )}
    </AuthShell>
  );
}
