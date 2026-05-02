import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { createClient } from "@/lib/supabase/server";

import { login, signup } from "./actions";

type Props = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect("/account");
  }

  const { error, message } = await searchParams;

  return (
    <div className="flex-1 bg-[color:var(--background)]">
      <section className="border-b-2 border-[color:var(--caramel)] bg-[color:var(--forest)] text-[color:var(--cream)]">
        <Container className="py-10 sm:py-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--caramel)]">
            Client portal
          </p>
          <h1 className="mt-2 font-display text-[1.65rem] font-normal leading-tight tracking-tight sm:text-[1.9rem]">
            Sign in
          </h1>
          <p className="mt-2 max-w-xl text-sm font-medium text-[color:var(--hero-muted)]">
            Access your client portal with the email and password for your account.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="mx-auto max-w-md border border-[color:var(--caramel)]/40 bg-[color:var(--card)] p-8">
          {error ? (
            <p
              className="mb-4 border border-red-300/50 bg-red-50 px-3 py-2 text-sm text-red-900 dark:bg-red-950/30 dark:text-red-100"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {message ? (
            <p
              className="mb-4 border border-[color:var(--caramel)]/40 bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--ink)]"
              role="status"
            >
              {message}
            </p>
          ) : null}

          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-bold text-[color:var(--ink)]">
              Email
              <input
                className="h-11 border border-[color:var(--caramel)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--caramel)]/35 focus:ring-2"
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-bold text-[color:var(--ink)]">
              Password
              <input
                className="h-11 border border-[color:var(--caramel)]/40 bg-[color:var(--background)] px-3 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--caramel)]/35 focus:ring-2"
                type="password"
                name="password"
                autoComplete="current-password"
                minLength={6}
                required
              />
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button
                className="btn-primary btn-primary-sm flex-1 justify-center"
                formAction={login}
                type="submit"
              >
                Log in
              </button>
              <button
                className="btn-secondary btn-secondary-sm flex-1 justify-center"
                formAction={signup}
                type="submit"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-sm text-[color:var(--muted)]">
          <Link href="/" className="font-bold text-[color:var(--caramel)] hover:underline">
            Back to home
          </Link>
        </p>
      </Container>
    </div>
  );
}
