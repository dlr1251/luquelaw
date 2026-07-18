import Link from "next/link";
import { redirect } from "next/navigation";

import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
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
import { safeNextPath } from "@/lib/auth/safe-next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { login, signup } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, message, next: nextRaw } = await searchParams;
  const next = safeNextPath(nextRaw);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect(next);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Luque Law
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Access your client portal or admin dashboard.
          </p>
        </div>

        {!isSupabaseConfigured() ? (
          <SupabaseSetupNotice
            title="Client portal not configured"
            body="Authentication requires a Supabase project. The public site works without it; add your keys to enable sign-in."
          />
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Account</CardTitle>
              <CardDescription>Use your email and password to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {message ? (
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ) : null}

              <form className="space-y-4">
                <input type="hidden" name="next" value={next} />
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    minLength={6}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Button formAction={login} type="submit" className="w-full">
                    Log in
                  </Button>
                  <Button formAction={signup} type="submit" variant="outline" className="w-full">
                    Create account
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                <Link
                  href="/login/forgot"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </p>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-foreground underline-offset-4 hover:underline">
            Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}
