"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ChevronRight, Search, X } from "lucide-react";

import type { TocNode } from "@/lib/norms/tree";
import { cn } from "@/lib/utils";

type Copy = {
  contents: string;
  searchPlaceholder: string;
  empty: string;
  expandAll: string;
  collapseAll: string;
  sections: string;
};

type Props = {
  tree: TocNode[];
  copy: Copy;
  className?: string;
};

function collectAncestorKeys(nodes: TocNode[], activeId: string | null): Set<string> {
  const open = new Set<string>();
  if (!activeId) return open;

  const walk = (list: TocNode[], ancestors: string[]): boolean => {
    for (const node of list) {
      if (node.id === activeId) {
        ancestors.forEach((k) => open.add(k));
        return true;
      }
      if (walk(node.children, [...ancestors, node.pathKey])) {
        open.add(node.pathKey);
        return true;
      }
    }
    return false;
  };

  walk(nodes, []);
  return open;
}

function filterTree(nodes: TocNode[], query: string): TocNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;

  const walk = (list: TocNode[]): TocNode[] => {
    const out: TocNode[] = [];
    for (const node of list) {
      const selfMatch =
        node.title.toLowerCase().includes(q) ||
        (node.numberLabel?.toLowerCase().includes(q) ?? false);
      const kids = walk(node.children);
      if (selfMatch || kids.length) {
        out.push({
          ...node,
          // If the parent matches, keep full children so the branch stays usable.
          children: selfMatch ? node.children : kids,
        });
      }
    }
    return out;
  };

  return walk(nodes);
}

function countNodes(nodes: TocNode[]): number {
  return nodes.reduce((n, node) => n + 1 + countNodes(node.children), 0);
}

export function NormToc({ tree, copy, className }: Props) {
  const activeId = useMemo(() => {
    const find = (list: TocNode[]): string | null => {
      for (const node of list) {
        if (node.isActive) return node.id;
        const child = find(node.children);
        if (child) return child;
      }
      return null;
    };
    return find(tree);
  }, [tree]);

  const ancestorKeys = useMemo(
    () => collectAncestorKeys(tree, activeId),
    [tree, activeId],
  );

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(ancestorKeys));
  const [lastActiveId, setLastActiveId] = useState(activeId);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  // Keep active branch open when navigating sections (adjust state during render)
  if (activeId !== lastActiveId) {
    setLastActiveId(activeId);
    setExpanded((prev) => {
      const next = new Set(prev);
      ancestorKeys.forEach((k) => next.add(k));
      return next;
    });
  }

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  const filtered = useMemo(() => filterTree(tree, query), [tree, query]);
  const isFiltering = query.trim().length > 0;
  const total = countNodes(tree);
  const visible = countNodes(filtered);

  const toggle = (pathKey: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(pathKey)) next.delete(pathKey);
      else next.add(pathKey);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<string>();
    const walk = (list: TocNode[]) => {
      for (const node of list) {
        if (node.hasChildren) all.add(node.pathKey);
        walk(node.children);
      }
    };
    walk(tree);
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded(new Set(ancestorKeys));
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--moss)]">
            {copy.contents}
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-ui)] text-[0.6875rem] text-muted-foreground">
            {isFiltering ? `${visible} / ${total}` : `${total}`} {copy.sections}
          </p>
        </div>
        {!isFiltering ? (
          <div className="flex gap-2 text-[0.6875rem]">
            <button
              type="button"
              onClick={expandAll}
              className="text-[color:var(--moss)] underline-offset-2 hover:text-[color:var(--forest)] hover:underline"
            >
              {copy.expandAll}
            </button>
            <span className="text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[color:var(--moss)] underline-offset-2 hover:text-[color:var(--forest)] hover:underline"
            >
              {copy.collapseAll}
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="h-9 w-full border border-[color:var(--moss)]/30 bg-[color:var(--card)] py-1.5 pl-8 pr-8 text-sm text-[color:var(--ink)] outline-none transition placeholder:text-muted-foreground/70 focus:border-[color:var(--moss)]/55 focus:ring-2 focus:ring-[color:var(--moss)]/20"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[color:var(--forest)]"
            aria-label="Clear"
          >
            <X className="size-3.5" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <nav
        className="mt-3 max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]"
        aria-label={copy.contents}
      >
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">{copy.empty}</p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((node) => (
              <TocBranch
                key={node.id}
                node={node}
                depth={0}
                expanded={expanded}
                forceOpen={isFiltering}
                toggle={toggle}
                activeRef={activeRef}
              />
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
}

function TocBranch({
  node,
  depth,
  expanded,
  forceOpen,
  toggle,
  activeRef,
}: {
  node: TocNode;
  depth: number;
  expanded: Set<string>;
  forceOpen: boolean;
  toggle: (pathKey: string) => void;
  activeRef: RefObject<HTMLAnchorElement | null>;
}) {
  const isOpen = forceOpen || expanded.has(node.pathKey);
  const hasKids = node.children.length > 0;

  return (
    <li>
      <div
        className={cn(
          "group flex items-stretch gap-0.5 rounded-sm transition",
          node.isActive && "bg-[color:var(--forest)] text-[color:var(--parchment)]",
        )}
      >
        {hasKids ? (
          <button
            type="button"
            onClick={() => toggle(node.pathKey)}
            className={cn(
              "flex w-7 shrink-0 items-center justify-center transition",
              node.isActive
                ? "text-[color:var(--parchment)]/80 hover:text-[color:var(--parchment)]"
                : "text-muted-foreground hover:text-[color:var(--forest)]",
            )}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-90")}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        ) : (
          <span className="w-7 shrink-0" aria-hidden />
        )}

        <Link
          ref={node.isActive ? activeRef : undefined}
          href={node.href}
          className={cn(
            "min-w-0 flex-1 py-1.5 pr-2 text-left text-[0.8125rem] leading-snug transition",
            node.isActive
              ? "font-medium text-[color:var(--parchment)]"
              : "text-muted-foreground hover:text-[color:var(--ink)]",
          )}
          style={{ paddingLeft: depth > 0 ? undefined : undefined }}
        >
          {node.numberLabel ? (
            <span
              className={cn(
                "mr-1.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.06em]",
                node.isActive ? "text-[color:var(--parchment)]/70" : "text-[color:var(--moss)]",
              )}
            >
              {node.numberLabel}
            </span>
          ) : null}
          <span className="line-clamp-2">{node.title}</span>
        </Link>
      </div>

      {hasKids && isOpen ? (
        <ul
          className={cn(
            "ml-3.5 border-l border-[color:var(--moss)]/20 pl-0.5",
            depth === 0 && "mt-0.5",
          )}
        >
          {node.children.map((child) => (
            <TocBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              forceOpen={forceOpen}
              toggle={toggle}
              activeRef={activeRef}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
