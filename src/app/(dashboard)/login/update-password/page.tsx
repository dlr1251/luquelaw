import Link from "next/link";
import { redirect } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginHref } from "@/lib/auth/safe-next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { updatePassword } from "../actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function UpdatePasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;

  if (!isSupabaseConfigured()) {
    redirect(loginHref());
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect(loginHref("/login/update-password"));
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">New password</h1>
          <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Update password</CardTitle>
            <CardDescription>Minimum 6 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <form action={updatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save password
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/portal"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Cancel — go to portal
          </Link>
        </p>
      </div>
    </div>
  );
}
