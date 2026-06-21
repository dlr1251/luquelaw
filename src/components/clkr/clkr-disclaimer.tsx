import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
};

export function ClkrDisclaimer({ text, className }: Props) {
  return (
    <p
      className={cn(
        "border-l-2 border-[color:var(--moss)]/50 bg-[color:var(--surface)] px-4 py-3 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {text}
    </p>
  );
}
