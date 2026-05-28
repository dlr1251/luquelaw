import { marked } from "marked";

import type { ClkrSection } from "@/lib/clkr/types";
import { slugKeyFromInput } from "@/lib/clkr/types";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const DEFAULT_SECTION_TEMPLATE = `## Introduction {#introduction}

Write your opening paragraph here.

## Key points {#key-points}

Use **bold**, bullet lists, and ### subtitles within each section.

- First point
- Second point

### Subtitle example

More detail under a subsection.
`;

export function defaultArticleMarkdown(): string {
  return DEFAULT_SECTION_TEMPLATE;
}

/** Convert stored sections (HTML bodies) into a single markdown document for editing. */
export function sectionsToMarkdown(sections: ClkrSection[]): string {
  if (!sections.length) return DEFAULT_SECTION_TEMPLATE;

  return sections
    .map((section) => {
      const anchor = section.id ? ` {#${section.id}}` : "";
      const body = htmlToMarkdown(section.html);
      return `## ${section.title}${anchor}\n\n${body}`.trim();
    })
    .join("\n\n");
}

/** Parse markdown into CLKR sections. `## Title {#anchor}` starts a TOC section; `###` stays in body. */
export function markdownToSections(markdown: string): ClkrSection[] {
  const text = markdown.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const chunks: { title: string; id?: string; body: string }[] = [];
  const headingRe = /^##\s+(.+?)(?:\s+\{#([a-z0-9-]+)\})?\s*$/;

  let current: { title: string; id?: string; lines: string[] } | null = null;

  for (const line of text.split("\n")) {
    const match = line.match(headingRe);
    if (match) {
      if (current) {
        chunks.push({
          title: current.title,
          id: current.id,
          body: current.lines.join("\n").trim(),
        });
      }
      current = {
        title: match[1].trim(),
        id: match[2]?.trim(),
        lines: [],
      };
      continue;
    }

    if (!current) {
      current = { title: "Content", id: "content", lines: [line] };
    } else {
      current.lines.push(line);
    }
  }

  if (current) {
    chunks.push({
      title: current.title,
      id: current.id,
      body: current.lines.join("\n").trim(),
    });
  }

  return chunks
    .map((chunk) => {
      const title = chunk.title.trim();
      const id = chunk.id?.trim() || slugKeyFromInput(title) || "section";
      if (!title) return null;
      return {
        id,
        title,
        html: markdownToHtml(chunk.body),
      };
    })
    .filter((s): s is ClkrSection => s !== null);
}

export function markdownToHtml(markdown: string): string {
  const trimmed = markdown.trim();
  if (!trimmed) return "";
  const result = marked.parse(trimmed, { async: false });
  return typeof result === "string" ? result.trim() : "";
}

function htmlToMarkdown(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  let text = trimmed
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h3>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<\/?ul[^>]*>/gi, "\n")
    .replace(/<\/?ol[^>]*>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<[^>]+>/g, "");

  text = decodeHtmlEntities(text);
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
