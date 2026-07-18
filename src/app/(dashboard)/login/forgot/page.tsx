import Link from "next/link";

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
import { isSupabaseConfigured } from "@/lib/supabase/server";

import { requestPasswordReset } from "../actions";

type Props = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            We will email you a link to choose a new password.
          </p>
        </div>

        {!isSupabaseConfigured() ? (
          <Alert variant="destructive">
            <AlertDescription>Authentication is not configured.</AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Forgot password</CardTitle>
              <CardDescription>Enter the email for your account.</CardDescription>
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
              <form action={requestPasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" autoComplete="email" required />
                </div>
                <Button type="submit" className="w-full">
                  Send reset link
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
