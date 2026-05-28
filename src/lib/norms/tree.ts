import type { NormSectionNode, NormSectionRecord } from "./types";
import { normPublicPath } from "./types";

export function buildSectionTree(sections: NormSectionRecord[]): NormSectionNode[] {
  const nodes = new Map<string, NormSectionNode>();
  const roots: NormSectionNode[] = [];

  for (const section of sections) {
    nodes.set(section.id, { ...section, children: [] });
  }

  for (const section of sections) {
    const node = nodes.get(section.id);
    if (!node) continue;

    if (section.parent_id && nodes.has(section.parent_id)) {
      nodes.get(section.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (list: NormSectionNode[]) => {
    list.sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
    for (const node of list) {
      sortNodes(node.children);
    }
  };

  sortNodes(roots);
  return roots;
}

export function flattenSectionTree(
  tree: NormSectionNode[],
  ancestors: string[] = [],
): Array<{ node: NormSectionNode; path: string[] }> {
  const result: Array<{ node: NormSectionNode; path: string[] }> = [];

  for (const node of tree) {
    const path = [...ancestors, node.section_key];
    result.push({ node, path });
    if (node.children.length) {
      result.push(...flattenSectionTree(node.children, path));
    }
  }

  return result;
}

export function findSectionByPath(
  tree: NormSectionNode[],
  pathKeys: string[],
): NormSectionNode | null {
  if (!pathKeys.length) return null;

  let level = tree;
  let found: NormSectionNode | null = null;

  for (const key of pathKeys) {
    found = level.find((node) => node.section_key === key) ?? null;
    if (!found) return null;
    level = found.children;
  }

  return found;
}

export function findPathToSectionKey(
  tree: NormSectionNode[],
  sectionKey: string,
  ancestors: string[] = [],
): string[] | null {
  for (const node of tree) {
    const path = [...ancestors, node.section_key];
    if (node.section_key === sectionKey) return path;
    const childPath = findPathToSectionKey(node.children, sectionKey, path);
    if (childPath) return childPath;
  }
  return null;
}

export function resolveSectionRequest(
  tree: NormSectionNode[],
  pathKeys: string[],
): { node: NormSectionNode; canonicalPath: string[] } | null {
  if (!pathKeys.length) return null;

  const direct = findSectionByPath(tree, pathKeys);
  if (direct) {
    return { node: direct, canonicalPath: pathKeys };
  }

  if (pathKeys.length === 1) {
    const canonicalPath = findPathToSectionKey(tree, pathKeys[0]!);
    if (canonicalPath) {
      const node = findSectionByPath(tree, canonicalPath);
      if (node) return { node, canonicalPath };
    }
  }

  const flat = flattenSectionTree(tree);
  for (const { node, path } of flat) {
    if (path.length < pathKeys.length) continue;
    const suffix = path.slice(-pathKeys.length);
    if (suffix.every((key, index) => key === pathKeys[index])) {
      return { node, canonicalPath: path };
    }
  }

  return null;
}

export function sectionHref(
  slugKey: string,
  locale: "en" | "es",
  path: string[],
): string {
  return normPublicPath(slugKey, locale, path);
}

export type TocEntry = {
  id: string;
  title: string;
  numberLabel: string | null;
  href: string;
  depth: number;
  isActive: boolean;
  hasChildren: boolean;
};

export function buildTocEntries(
  tree: NormSectionNode[],
  slugKey: string,
  locale: "en" | "es",
  activePath: string[],
): TocEntry[] {
  const flat = flattenSectionTree(tree);
  const activeKey = activePath.join("/");

  return flat.map(({ node, path }) => {
    const pathKey = path.join("/");
    return {
      id: node.id,
      title: node.title,
      numberLabel: node.number_label,
      href: sectionHref(slugKey, locale, path),
      depth: node.depth,
      isActive: pathKey === activeKey,
      hasChildren: node.children.length > 0,
    };
  });
}

export function defaultSectionPath(tree: NormSectionNode[]): string[] {
  if (!tree.length) return [];
  return [tree[0].section_key];
}
