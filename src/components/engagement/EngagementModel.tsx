"use client";

import { cn } from "@/lib/cn";
import { ClipboardList, FileText, MessageSquareText } from "lucide-react";

type Step = {
  title: string;
  body: string;
  icon: "chat" | "doc" | "plan";
};

type Props = {
  label: string;
  steps: [Step, Step, Step];
  footer: string;
  className?: string;
};

function Icon({ name }: { name: Step["icon"] }) {
  const props = { "aria-hidden": true, className: "h-5 w-5", strokeWidth: 1.8 } as const;
  if (name === "chat") return <MessageSquareText {...props} />;
  if (name === "doc") return <FileText {...props} />;
  return <ClipboardList {...props} />;
}

export function EngagementModel({ label, steps, footer, className }: Props) {
  return (
    <div
      className={cn(
        "space-y-5 border border-[color:var(--moss)]/35 bg-[color:var(--parchment)] p-5 sm:p-6 text-[color:var(--ink)]",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="marketing-eyebrow text-[0.625rem] tracking-[0.2em]">{label}</div>
        <div className="engagement-flow shrink-0 self-end sm:self-auto" aria-hidden="true">
          <div className="engagement-flow__rail" />
          <div className="engagement-flow__node engagement-flow__node--1" />
          <div className="engagement-flow__node engagement-flow__node--2" />
          <div className="engagement-flow__node engagement-flow__node--3" />
          <div className="engagement-flow__pulse engagement-flow__pulse--1" />
          <div className="engagement-flow__pulse engagement-flow__pulse--2" />
          <div className="engagement-flow__pulse engagement-flow__pulse--3" />
        </div>
      </div>

      <ol className="space-y-4">
        {steps.map((s, idx) => (
          <li key={s.title} className="flex gap-3.5">
            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--moss)]/30 bg-white/50 text-[color:var(--forest)]">
              <Icon name={s.icon} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[color:var(--ink)]">
                <span className="text-[color:var(--forest)]">{idx + 1}.</span> {s.title}
              </div>
              <div className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">{s.body}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="text-sm leading-relaxed text-[color:var(--muted)]">{footer}</div>
    </div>
  );
}
