import Link from "next/link";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { PostsBrowser } from "@/components/posts/posts-browser";
import { Container } from "@/components/container";
import { postsHubContent, type PostsHubLocale } from "@/lib/posts/hub-content";
import type { Post } from "@/lib/posts/types";

type Props = {
  posts: Post[];
  locale?: PostsHubLocale;
};

export function PostsHub({ posts, locale = "en" }: Props) {
  const copy = postsHubContent[locale];
  const contactHref = locale === "es" ? "/es#contact" : "/#contact";

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-14 sm:py-16 lg:py-20">
          <p className="marketing-eyebrow">{copy.eyebrow}</p>
          <h1 className="marketing-display mt-3 max-w-3xl text-[color:var(--forest)] sm:text-[clamp(2.25rem,4vw,2.75rem)]">
            {copy.title}
          </h1>
          <p className="marketing-body mt-4 max-w-3xl text-base sm:text-lg">{copy.subtitle}</p>
          <p className="mt-6">
            <Link
              href={contactHref}
              className="text-sm font-bold text-[color:var(--forest)] underline-offset-2 hover:text-[color:var(--moss)] hover:underline"
            >
              {copy.contactCta} {copy.contactLink} →
            </Link>
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2 className="marketing-title text-[color:var(--forest)]">{copy.browseTitle}</h2>
          <p className="marketing-body text-sm">{copy.browseSubtitle}</p>
        </div>

        <PostsBrowser posts={posts} locale={locale} />

        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}
