import Link from "next/link";

import { PostCategoryIcon } from "@/components/posts/post-category-icon";
import { cn } from "@/lib/cn";
import type { Post } from "@/lib/posts/types";

type Props = {
  post: Post;
  readLabel: string;
  featured?: boolean;
  className?: string;
};

function formatDate(iso: string | null | undefined, locale: "en" | "es"): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(locale === "es" ? "es-CO" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export function PostCard({ post, readLabel, featured = false, className }: Props) {
  const locale = post.slug.startsWith("/es/") ? "es" : "en";
  const dateLabel = formatDate(post.publishedAt, locale);

  return (
    <Link
      href={post.slug}
      className={cn(
        "group flex h-full flex-col border border-[color:var(--moss)]/30 bg-[color:var(--card)] transition hover:border-[color:var(--moss)]/55 hover:shadow-[0_8px_30px_rgba(26,58,31,0.08)]",
        featured ? "p-8 sm:p-10" : "p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
          <span className="inline-flex h-8 w-8 items-center justify-center border border-[color:var(--moss)]/35 bg-[color:var(--surface)] text-[color:var(--moss)]">
            <PostCategoryIcon category={post.category} />
          </span>
          {post.category}
        </span>
        <span className="shrink-0 font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
          {dateLabel ?? post.readingTime}
        </span>
      </div>

      <h3
        className={cn(
          "mt-4 font-display font-normal leading-tight tracking-tight text-[color:var(--forest)] group-hover:text-[color:var(--moss)]",
          featured ? "text-2xl sm:text-[1.75rem]" : "text-xl",
        )}
      >
        {post.title}
      </h3>
      <p
        className={cn(
          "mt-3 leading-6 text-muted-foreground",
          featured ? "max-w-2xl text-base" : "text-sm",
        )}
      >
        {post.description}
      </p>
      <span className="mt-auto pt-5 text-sm font-bold text-[color:var(--forest)] group-hover:underline">
        {readLabel} →
      </span>
    </Link>
  );
}
