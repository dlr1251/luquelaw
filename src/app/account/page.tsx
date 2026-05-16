import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-6 sm:p-8">
        <h2 className="font-display text-[1.5rem] font-normal leading-tight text-[color:var(--forest)]">
          Your matters
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          After your initial consultation, a written legal concept and quotation are delivered
          within three business days. Active engagements and deliverables will be listed here as
          the portal grows—until then, use{" "}
          <Link className="font-bold text-[color:var(--moss)] underline" href="/#contact">
            Contact
          </Link>{" "}
          for updates on your file.
        </p>
        <div className="mt-6 border border-[color:var(--moss)]/30 bg-[color:var(--surface)] p-4 text-sm text-[color:var(--muted)]">
          <span className="font-bold text-[color:var(--ink)]">No active matter summary yet.</span>{" "}
          This space will show the matter reference, stage, and next milestone once an engagement
          is opened.
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Next steps
          </h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-[color:var(--muted)]">
            <li>
              <span className="font-bold text-[color:var(--ink)]">Book</span> a one-hour
              consultation if you have not yet.
            </li>
            <li>
              Gather documents and a short timeline for the first call (
              <Link href="/#contact" className="font-bold text-[color:var(--moss)] underline">
                contact form
              </Link>
              ).
            </li>
            <li>
              Read relevant{" "}
              <Link href="/clkr" className="font-bold text-[color:var(--moss)] underline">
                CLKR
              </Link>{" "}
              articles before the meeting when possible.
            </li>
          </ol>
        </div>

        <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Resources
          </h3>
          <ul className="mt-4 space-y-3 text-sm font-bold">
            <li>
              <Link className="text-[color:var(--moss)] hover:underline" href="/#contact">
                Book / send a message →
              </Link>
            </li>
            <li>
              <Link className="text-[color:var(--moss)] hover:underline" href="/#practice-areas">
                Practice areas →
              </Link>
            </li>
            <li>
              <Link className="text-[color:var(--moss)] hover:underline" href="/clkr">
                CLKR legal library →
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-5 text-[color:var(--muted)]">
            Initial consultations are billed separately; scope and fees follow the written
            quotation.
          </p>
        </div>
      </div>

      <div className="border border-[color:var(--moss)]/40 bg-[color:var(--ink)] p-6 text-[color:var(--parchment)]">
        <h3 className="font-display text-lg font-normal text-[color:var(--parchment)]">Need help?</h3>
        <p className="mt-2 text-sm text-[color:var(--footer-fg)]">
          For scheduling and case questions, email{" "}
          <a className="font-bold text-[color:var(--moss)] hover:underline" href="mailto:daniel@luquelaw.co">
            daniel@luquelaw.co
          </a>{" "}
          or use the contact form. Include your matter type and timeline.
        </p>
      </div>
    </div>
  );
}
