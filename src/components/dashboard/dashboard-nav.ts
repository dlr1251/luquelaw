export type DashboardNavIcon =
  | "layout-dashboard"
  | "book-open"
  | "home"
  | "file-text"
  | "bot"
  | "message-square"
  | "ticket"
  | "sparkles"
  | "scale"
  | "credit-card"
  | "settings"
  | "bookmark"
  | "users";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: DashboardNavIcon;
  external?: boolean;
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItem[];
};

/** @deprecated Prefer portalNavGroups — kept for any leftover flat consumers */
export const portalNavItems = (): DashboardNavItem[] =>
  portalNavGroups().flatMap((g) => g.items);

export const portalNavGroups = (): DashboardNavGroup[] => [
  {
    label: "Workspace",
    items: [
      { href: "/portal/lucy", label: "Lucy AI", icon: "sparkles" },
      { href: "/portal/tickets", label: "Tickets", icon: "ticket" },
      { href: "/portal/saved", label: "Saved", icon: "bookmark" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/portal/settings", label: "Settings", icon: "settings" },
      { href: "/pricing", label: "Plans & billing", icon: "credit-card", external: true },
    ],
  },
];

export const adminNavGroups: DashboardNavGroup[] = [
  {
    label: "Content",
    items: [
      { href: "/admin/clkr", label: "CLKR", icon: "file-text" },
      { href: "/admin/norms", label: "Norms", icon: "scale" },
      { href: "/admin/posts", label: "Blog", icon: "book-open" },
      { href: "/admin/community", label: "Forum", icon: "users" },
      { href: "/admin/commentaries", label: "Commentaries", icon: "message-square" },
    ],
  },
  {
    label: "LegalAI",
    items: [{ href: "/admin/agents", label: "Agents", icon: "bot" }],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/tickets", label: "Tickets & reviews", icon: "ticket" },
      { href: "/admin/comments", label: "Moderation", icon: "message-square" },
    ],
  },
  {
    label: "App",
    items: [
      { href: "/portal/lucy", label: "Lucy AI", icon: "sparkles" },
      { href: "/portal", label: "Portal", icon: "layout-dashboard" },
      { href: "/community", label: "Public forum", icon: "users", external: true },
      { href: "/", label: "Public site", icon: "home", external: true },
    ],
  },
];

/** @deprecated Prefer adminNavGroups */
export const adminNavItems: DashboardNavItem[] = adminNavGroups.flatMap((g) => g.items);

export type DashboardPageMeta = {
  title: string;
  description?: string;
};

export function resolvePortalPageMeta(pathname: string): DashboardPageMeta {
  if (pathname.startsWith("/portal/lucy")) {
    return {
      title: "Lucy AI",
      description: "AI immigration consultations · USD 10 to start",
    };
  }
  if (pathname.startsWith("/portal/tickets")) {
    return {
      title: "Tickets",
      description: "Firm requests and lawyer review unlocks",
    };
  }
  if (pathname.startsWith("/portal/settings")) {
    return { title: "Settings", description: "Your profile" };
  }
  if (pathname.startsWith("/portal/saved")) {
    return { title: "Saved", description: "Bookmarked guides and norms" };
  }
  if (pathname.startsWith("/portal/chat")) {
    return {
      title: "Lucy AI",
      description: "AI immigration consultations · USD 10 to start",
    };
  }
  return {
    title: "Home",
    description: "Your workspace for Lucy AI, tickets, and CLKR",
  };
}

export function resolveAdminPageMeta(pathname: string): DashboardPageMeta {
  if (pathname.startsWith("/admin/tickets")) {
    return { title: "Tickets & reviews", description: "Queue and Lucy AI consultation reviews" };
  }
  if (pathname.startsWith("/admin/comments")) {
    return { title: "Moderation", description: "Norm discussion moderation" };
  }
  if (pathname.startsWith("/admin/community")) {
    return { title: "Forum", description: "Community questions and reports" };
  }
  if (pathname.startsWith("/admin/commentaries")) {
    return { title: "Commentaries", description: "Firm doctrinal notes on norm sections" };
  }
  if (pathname.startsWith("/admin/norms")) {
    return { title: "Norms", description: "Statute catalog CMS" };
  }
  if (pathname.startsWith("/admin/agents")) {
    return { title: "Agents", description: "LegalAI agents CMS" };
  }
  if (pathname.startsWith("/admin/posts")) {
    return { title: "Blog", description: "Posts CMS" };
  }
  if (pathname.startsWith("/admin/clkr")) {
    return { title: "CLKR", description: "CLKR articles CMS" };
  }
  return { title: "Administration", description: "Site & content CMS" };
}

export function isNavItemActive(pathname: string, item: DashboardNavItem): boolean {
  if (item.external) return false;
  if (item.href === "/portal") {
    return pathname === "/portal" || pathname === "/portal/";
  }
  if (item.href === "/admin/clkr") {
    return (
      pathname === "/admin/clkr" ||
      pathname.startsWith("/admin/clkr/") ||
      pathname === "/admin" ||
      pathname === "/admin/"
    );
  }
  if (item.href === "/admin/comments") {
    return pathname === "/admin/comments" || pathname.startsWith("/admin/comments/");
  }
  if (item.href === "/admin/commentaries") {
    return (
      pathname === "/admin/commentaries" ||
      pathname.startsWith("/admin/commentaries/")
    );
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
