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
  | "credit-card";

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
export const portalNavItems = (isAdmin: boolean): DashboardNavItem[] =>
  portalNavGroups(isAdmin).flatMap((g) => g.items);

export const portalNavGroups = (isAdmin: boolean): DashboardNavGroup[] => {
  const groups: DashboardNavGroup[] = [
    {
      label: "Workspace",
      items: [
        { href: "/portal/lucy", label: "Lucy", icon: "sparkles" },
        { href: "/portal/tickets", label: "Tickets", icon: "ticket" },
        { href: "/portal", label: "Home", icon: "layout-dashboard" },
      ],
    },
    {
      label: "CLKR",
      items: [
        { href: "/clkr", label: "Hub", icon: "book-open", external: true },
        { href: "/clkr/guides", label: "Guides", icon: "file-text", external: true },
        { href: "/clkr/norms", label: "Norms", icon: "scale", external: true },
        { href: "/clkr/agents", label: "Agents", icon: "bot", external: true },
      ],
    },
  ];

  if (isAdmin) {
    groups.push({
      label: "Admin",
      items: [
        { href: "/admin/tickets", label: "Reviews", icon: "ticket" },
        { href: "/admin/clkr", label: "CMS", icon: "file-text" },
      ],
    });
  }

  groups.push({
    label: "Account",
    items: [
      { href: "/pricing", label: "Plans & billing", icon: "credit-card", external: true },
      { href: "/", label: "Public site", icon: "home", external: true },
    ],
  });

  return groups;
};

export const adminNavGroups: DashboardNavGroup[] = [
  {
    label: "Content",
    items: [
      { href: "/admin/clkr", label: "Guides", icon: "file-text" },
      { href: "/admin/norms", label: "Norms", icon: "scale" },
      { href: "/admin/posts", label: "Blog", icon: "book-open" },
    ],
  },
  {
    label: "LegalAI",
    items: [{ href: "/admin/agents", label: "Agents", icon: "bot" }],
  },
  {
    label: "Operations",
    items: [{ href: "/admin/tickets", label: "Tickets & reviews", icon: "ticket" }],
  },
  {
    label: "App",
    items: [
      { href: "/portal/lucy", label: "Lucy", icon: "sparkles" },
      { href: "/portal", label: "Portal", icon: "layout-dashboard" },
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
      title: "Lucy",
      description: "AI immigration consultations",
    };
  }
  if (pathname.startsWith("/portal/tickets")) {
    return {
      title: "Tickets",
      description: "Firm requests and lawyer review unlocks",
    };
  }
  if (pathname.startsWith("/portal/chat")) {
    return {
      title: "Lucy",
      description: "AI immigration consultations",
    };
  }
  return {
    title: "Home",
    description: "Your workspace for Lucy, tickets, and CLKR",
  };
}

export function resolveAdminPageMeta(pathname: string): DashboardPageMeta {
  if (pathname.startsWith("/admin/tickets")) {
    return { title: "Tickets & reviews", description: "Queue and Lucy consultation reviews" };
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
    return { title: "Guides", description: "CLKR articles CMS" };
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
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
