import Link from "next/link";

type Props = {
  title: string;
  body: string;
  backHref?: string;
  backLabel?: string;
};

export function SupabaseSetupNotice({
  title,
  body,
  backHref = "/",
  backLabel = "Back to home",
}: Props) {
  return (
    <div className="mx-auto max-w-lg border border-amber-400/50 bg-amber-50 p-6 text-[color:var(--ink)] dark:bg-amber-950/30">
      <h2 className="font-display text-lg font-normal tracking-tight text-[color:var(--forest)]">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{body}</p>
      <p className="mt-4 font-mono text-xs leading-relaxed text-[color:var(--ink)]/80">
        Copy <span className="font-sans font-bold">.env.example</span> to{" "}
        <span className="font-sans font-bold">.env.local</span> and set:
      </p>
      <ul className="mt-2 list-inside list-disc font-mono text-xs leading-relaxed text-[color:var(--ink)]/80">
        <li>NEXT_PUBLIC_SUPABASE_URL</li>
        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
      </ul>
      <p className="mt-4 text-xs leading-5 text-[color:var(--muted)]">
        In production (Vercel), add the same variables under Project → Settings → Environment
        Variables, then redeploy.
      </p>
      <Link
        href={backHref}
        className="mt-6 inline-block text-sm font-bold text-[color:var(--forest)] hover:underline"
      >
        {backLabel} →
      </Link>
    </div>
  );
}
