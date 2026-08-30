import type { Metadata } from "next";

import { AuthFooterLink, AuthShell } from "@/components/auth/auth-shell";
import { NOINDEX_NOFOLLOW_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_NOFOLLOW_METADATA;

export default function AuthCodeErrorPage() {
  return (
    <AuthShell
      title="Link invalid or expired"
      lead="This reset link was already used, expired, or opened by a mail scanner. Request a fresh one — and open it once, in the same browser."
      footer={<AuthFooterLink href="/login">Back to sign in</AuthFooterLink>}
    >
      <a href="/login/forgot" className="btn-primary inline-flex w-full">
        Request new reset link
      </a>
    </AuthShell>
  );
}
