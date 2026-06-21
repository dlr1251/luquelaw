import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Prose({ children, className }: Props) {
  return (
    <div
      className={cn(
        "text-[15px] leading-7 text-[color:var(--ink)]/90 sm:text-[16px]",
        "[&_a]:break-words [&_a]:font-medium [&_a]:text-[color:var(--moss)] hover:[&_a]:underline",
        "[&_pre]:overflow-x-auto [&_pre]:text-[13px]",
        "[&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto",
        "[&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-[1.65rem] [&_h2]:font-normal [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-[color:var(--forest)] sm:[&_h2]:text-[1.8rem]",
        "[&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:font-[family-name:var(--font-heading),ui-serif,Georgia,serif] [&_h3]:text-xl [&_h3]:font-normal [&_h3]:italic [&_h3]:leading-snug [&_h3]:text-[color:var(--ink)]",
        "[&_p]:mt-4 [&_p]:max-w-none",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
        "[&_li]:max-w-none",
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[color:var(--moss)] [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
        "[&_code]:bg-[color:var(--surface)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]",
        "[&_hr]:my-10 [&_hr]:border-[color:var(--moss)]/35",
        className,
      )}
    >
      {children}
    </div>
  );
}
