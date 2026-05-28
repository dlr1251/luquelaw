import type { Metadata } from "next";

import { normPublicPath } from "@/lib/norms/types";

import {
  DEFAULT_SEO,
  GOOGLE_SITE_VERIFICATION,
  OG_LOCALE,
  SITE_NAME,
  SITE_URL,
} from "./config";
import {
  absoluteUrl,
  buildClkrLanguageAlternates,
  buildNormLanguageAlternates,
  buildPostLanguageAlternates,
  buildStaticLanguageAlternates,
  type SeoLocale,
} from "./routes";

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale: SeoLocale;
  languageAlternates?: Record<string, string>;
  ogType?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  noIndex?: boolean;
};

export function getRootMetadata(): Metadata {
  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_SEO.en.title,
      template: `%s · ${SITE_NAME}`,
    },
    description: DEFAULT_SEO.en.description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE.en,
      alternateLocale: [OG_LOCALE.es],
    },
    twitter: {
      card: "summary_large_image",
    },
  };

  if (GOOGLE_SITE_VERIFICATION) {
    metadata.verification = { google: GOOGLE_SITE_VERIFICATION };
  }

  return metadata;
}

export function getEsLayoutMetadata(): Metadata {
  return {
    title: {
      default: DEFAULT_SEO.es.title,
      template: `%s · ${SITE_NAME}`,
    },
    description: DEFAULT_SEO.es.description,
    openGraph: {
      locale: OG_LOCALE.es,
      alternateLocale: [OG_LOCALE.en],
    },
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  languageAlternates,
  ogType = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const alternateLocale = locale === "en" ? OG_LOCALE.es : OG_LOCALE.en;
  const languages =
    languageAlternates ?? buildStaticLanguageAlternates(path, locale);

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: [alternateLocale],
      type: ogType,
      ...(ogType === "article" && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (noIndex) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export function buildClkrArticleMetadata(
  article: {
    title: string;
    description: string;
    slug_key: string;
    locale: SeoLocale;
    published_at: string | null;
    updated_at: string;
  },
  translationSlugKey?: string | null,
): Metadata {
  const path =
    article.locale === "es"
      ? `/es/clkr/${article.slug_key}`
      : `/clkr/${article.slug_key}`;

  return buildPageMetadata({
    title: article.title,
    description: article.description,
    path,
    locale: article.locale,
    languageAlternates: buildClkrLanguageAlternates(
      article.slug_key,
      article.locale,
      translationSlugKey,
    ),
    ogType: "article",
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
  });
}

export function buildPostMetadata(
  post: {
    title: string;
    description: string;
    slug_key: string;
    locale: SeoLocale;
    published_at: string | null;
    updated_at: string;
  },
  translationSlugKey?: string | null,
): Metadata {
  const path =
    post.locale === "es" ? `/es/posts/${post.slug_key}` : `/posts/${post.slug_key}`;

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path,
    locale: post.locale,
    languageAlternates: buildPostLanguageAlternates(
      post.slug_key,
      post.locale,
      translationSlugKey,
    ),
    ogType: "article",
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
  });
}

export function buildNormMetadata(
  norm: {
    title: string;
    description: string;
    slug_key: string;
    locale: SeoLocale;
    published_at: string | null;
    updated_at: string;
  },
  sectionPath: string[],
  sectionTitle?: string,
  translationSlugKey?: string | null,
): Metadata {
  const path = normPublicPath(norm.slug_key, norm.locale, sectionPath);
  const title = sectionTitle ? `${sectionTitle} · ${norm.title}` : norm.title;

  return buildPageMetadata({
    title,
    description: norm.description,
    path,
    locale: norm.locale,
    languageAlternates: buildNormLanguageAlternates(
      norm.slug_key,
      norm.locale,
      sectionPath,
      translationSlugKey,
    ),
    ogType: "article",
    publishedTime: norm.published_at,
    modifiedTime: norm.updated_at,
  });
}

export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: true },
};

export const NOINDEX_NOFOLLOW_METADATA: Metadata = {
  robots: { index: false, follow: false },
};
