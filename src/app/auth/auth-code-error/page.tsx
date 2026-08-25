import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NOINDEX_NOFOLLOW_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_NOFOLLOW_METADATA;

export default function AuthCodeErrorPage() {
  return (
    <div className="dashboard-theme flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Link invalid or expired</CardTitle>
          <CardDescription>
            This reset link was already used, expired, or opened by a mail scanner. Request a fresh
            one — and open it once, in the same browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <ButtonLink href="/login/forgot">Request new reset link</ButtonLink>
          <ButtonLink href="/login" variant="outline">
            Back to sign in
          </ButtonLink>
        </CardContent>
      </Card>
    </div>
  );
}
