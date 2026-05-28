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
            The confirmation link could not be used. Request a new one from the login page or check
            your Supabase Auth email template settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonLink href="/login">Back to sign in</ButtonLink>
        </CardContent>
      </Card>
    </div>
  );
}
