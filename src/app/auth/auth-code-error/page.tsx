import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Link invalid or expired
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        The confirmation link could not be used. Request a new one from the login
        page or check your Supabase Auth email template settings.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Back to sign in
      </Link>
    </div>
  );
}
