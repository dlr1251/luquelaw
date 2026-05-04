import Link from "next/link";

import { signOut } from "@/app/account/actions";
import { Container } from "@/components/container";

type NavItem = { href: string; label: string; description?: string };

type Props = {
  email: string | null;
  isAdmin: boolean;
  children: React.ReactNode;
};

export function AccountPortalShell({ email, isAdmin, children }: Props) {
  const nav: NavItem[] = [
    { href: "/account", label: "Overview", description: "Status and quick actions" },
    { href: "/services", label: "Services", description: "What we cover in Colombia" },
    {
      href: "/contact#consultation",
      label: "Consultations",
      description: "Book and pricing on one page",
    },
    { href: "/contact#contact", label: "Send a message", description: "Inquiry form" },
    { href: "/clkr", label: "CLKR library", description: "Legal explainers (English)" },
  ];

  if (isAdmin) {
    nav.push({
      href: "/admin/clkr",
      label: "Admin · CLKR",
      description: "Order and visibility for hub posts",
    });
  }

  return (
    <div className="flex-1 bg-[color:var(--background)]">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-8 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Client portal
          </p>
          <h1 className="mt-2 font-display text-[1.65rem] font-normal leading-tight tracking-tight sm:text-[1.9rem]">
            Welcome back
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[color:var(--hero-muted)]">
            Your hub for consultations, updates, and published legal resources. For urgent
            matters, use WhatsApp or email from the contact page.
          </p>
        </Container>
      </section>

      <Container className="flex flex-col gap-10 py-10 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:max-w-xs">
          <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
              Signed in as
            </div>
            <p className="mt-2 break-all text-sm font-bold text-[color:var(--ink)]">{email ?? "—"}</p>
            <nav className="mt-6 space-y-1 border-t border-[color:var(--moss)]/25 pt-5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-l-2 border-transparent py-2 pl-3 text-sm font-bold text-[color:var(--muted)] transition hover:border-[color:var(--moss)] hover:text-[color:var(--ink)]"
                >
                  <span className="block text-[color:var(--ink)]">{item.label}</span>
                  {item.description ? (
                    <span className="mt-0.5 block text-xs font-normal text-[color:var(--muted)]">
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>
            <form className="mt-6 border-t border-[color:var(--moss)]/25 pt-5" action={signOut}>
              <button type="submit" className="btn-secondary btn-secondary-sm w-full justify-center">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </Container>
    </div>
  );
}
