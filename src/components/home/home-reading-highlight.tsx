import Link from "next/link";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { PostCard } from "@/components/posts/post-card";
import type { ClkrArticle } from "@/lib/clkr/types";
import type { HomeContent } from "@/lib/home/content";
import type { Post } from "@/lib/posts/types";

type Props = {
  articles: ClkrArticle[];
  posts: Post[];
  copy: HomeContent["reading"];
  clkrHref: string;
  postsHref: string;
};

export function HomeReadingHighlight({ articles, posts, copy, clkrHref, postsHref }: Props) {
  if (articles.length === 0 && posts.length === 0) return null;

  return (
    <div>
      <p className="marketing-eyebrow">{copy.eyebrow}</p>
      <h2 className="marketing-title mt-3 text-[color:var(--forest)]">{copy.title}</h2>
      <p className="marketing-body mt-3 max-w-2xl">{copy.body}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {articles.length > 0 ? (
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h3 className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {copy.clkrLabel}
              </h3>
              <Link
                href={clkrHref}
                className="text-sm font-bold text-[color:var(--forest)] underline-offset-2 hover:text-[color:var(--moss)] hover:underline"
              >
                {copy.clkrAll} →
              </Link>
            </div>
            <ul className="grid gap-4">
              {articles.map((article) => (
                <li key={article.slug}>
                  <ClkrArticleCard article={article} readLabel={copy.readLabel} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {posts.length > 0 ? (
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h3 className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {copy.blogLabel}
              </h3>
              <Link
                href={postsHref}
                className="text-sm font-bold text-[color:var(--forest)] underline-offset-2 hover:text-[color:var(--moss)] hover:underline"
              >
                {copy.blogAll} →
              </Link>
            </div>
            <ul className="grid gap-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} readLabel={copy.readLabel} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
