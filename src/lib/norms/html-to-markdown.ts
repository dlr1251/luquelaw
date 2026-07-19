/** Lightweight HTML → Markdown for norm article bodies (mostly `<p>`). */

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

function inlineMarkdown(html: string): string {
  let out = html;
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<\/?(?:strong|b)>/gi, "**");
  out = out.replace(/<\/?(?:em|i)>/gi, "_");
  out = out.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  out = out.replace(/<[^>]+>/g, "");
  return decodeEntities(out).replace(/[ \t]+\n/g, "\n").trim();
}

export function htmlToMarkdown(html: string): string {
  const blocks: string[] = [];
  const normalized = html
    .replace(/\r\n?/g, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "</$1>\n")
    .replace(/<(ul|ol)[^>]*>/gi, "\n")
    .replace(/<\/(ul|ol)>/gi, "\n");

  const parts = normalized.split(/\n+/).map((part) => part.trim()).filter(Boolean);

  for (const part of parts) {
    const heading = part.match(/^<h([1-6])[^>]*>([\s\S]*)<\/h\1>$/i);
    if (heading) {
      const level = Number(heading[1]);
      blocks.push(`${"#".repeat(level)} ${inlineMarkdown(heading[2] ?? "")}`);
      continue;
    }

    const li = part.match(/^<li[^>]*>([\s\S]*)<\/li>$/i);
    if (li) {
      blocks.push(`- ${inlineMarkdown(li[1] ?? "")}`);
      continue;
    }

    const p = part.match(/^<(?:p|div|blockquote)[^>]*>([\s\S]*)<\/(?:p|div|blockquote)>$/i);
    if (p) {
      const text = inlineMarkdown(p[1] ?? "");
      if (text) blocks.push(text);
      continue;
    }

    const text = inlineMarkdown(part);
    if (text) blocks.push(text);
  }

  return blocks.join("\n\n").trim();
}

export function sectionToMarkdown(input: {
  numberLabel: string | null;
  title: string;
  html: string | null;
}): string {
  const heading = input.numberLabel
    ? `# ${input.numberLabel} — ${input.title}`
    : `# ${input.title}`;

  if (!input.html?.trim()) return `${heading}\n`;

  const body = htmlToMarkdown(input.html);
  return body ? `${heading}\n\n${body}\n` : `${heading}\n`;
}
