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
  const props = { "aria-hidden": true, className: "h-6 w-6", strokeWidth: 1.8 } as const;
  if (name === "chat") return <MessageSquareText {...props} />;
  if (name === "doc") return <FileText {...props} />;
  return <ClipboardList {...props} />;
}

export function EngagementModel({ label, steps, footer, className }: Props) {
  return (
    <div
      className={cn(
        "space-y-4 border border-[color:var(--moss)]/50 bg-[color:var(--parchment)] p-6 text-[color:var(--ink)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">{label}</div>
        <div className="engagement-flow hidden sm:block" aria-hidden="true">
          <div className="engagement-flow__rail" />
          <div className="engagement-flow__node engagement-flow__node--1" />
          <div className="engagement-flow__node engagement-flow__node--2" />
          <div className="engagement-flow__node engagement-flow__node--3" />
          <div className="engagement-flow__pulse engagement-flow__pulse--1" />
          <div className="engagement-flow__pulse engagement-flow__pulse--2" />
          <div className="engagement-flow__pulse engagement-flow__pulse--3" />
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((s, idx) => (
          <li key={s.title} className="flex gap-3">
            <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--moss)]/35 bg-white/40 text-[color:var(--forest)]">
              <Icon name={s.icon} />
            </div>
            <div>
              <div className="text-sm font-bold text-[color:var(--ink)]">
                <span className="text-[color:var(--forest)]">{idx + 1}.</span> {s.title}
              </div>
              <div className="mt-0.5 text-sm leading-6 text-[color:var(--muted)]">{s.body}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="text-xs leading-5 text-[color:var(--muted)]">{footer}</div>
    </div>
  );
}

