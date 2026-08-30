import { updatePassword } from "@/app/(dashboard)/login/actions";
import {
  AuthFooterLink,
  AuthNotice,
  AuthShell,
  authFieldClass,
  authLabelClass,
} from "@/components/auth/auth-shell";
import { updatePasswordCopy } from "@/lib/auth/copy";
import type { AuthLocale } from "@/lib/auth/safe-next";

type Props = {
  locale: AuthLocale;
  error?: string;
};

export function UpdatePasswordView({ locale, error }: Props) {
  const c = updatePasswordCopy(locale);

  return (
    <AuthShell
      title={c.title}
      lead={c.lead}
      homeHref={c.homeHref}
      footer={<AuthFooterLink href="/portal">{c.cancel}</AuthFooterLink>}
    >
      <div className="space-y-6">
        {error ? <AuthNotice tone="error">{error}</AuthNotice> : null}
        <form action={updatePassword} className="space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label htmlFor="password" className={authLabelClass}>
              {c.password}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={6}
              required
              className={authFieldClass}
            />
          </div>
          <div>
            <label htmlFor="confirm" className={authLabelClass}>
              {c.confirm}
            </label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              autoComplete="new-password"
              minLength={6}
              required
              className={authFieldClass}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            {c.submit}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}