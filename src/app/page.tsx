import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-20">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Next.js + Supabase
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Authentication is wired up
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        Add your project URL and publishable (or legacy anon) key to{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
          .env.local
        </code>
        , then use sign up and sign in. Email confirmation uses{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
          /auth/confirm
        </code>
        .
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in
        </Link>
        <Link
          href="/account"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-white dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Account (protected)
        </Link>
      </div>
    </main>
  );
}
