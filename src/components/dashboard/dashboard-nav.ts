export type DashboardNavIcon =
  | "layout-dashboard"
  | "book-open"
  | "home"
  | "file-text";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: DashboardNavIcon;
  external?: boolean;
};

export const portalNavItems = (isAdmin: boolean): DashboardNavItem[] => {
  const items: DashboardNavItem[] = [
    { href: "/account", label: "Overview", icon: "layout-dashboard" },
    { href: "/clkr", label: "CLKR library", icon: "book-open", external: true },
    { href: "/", label: "Public site", icon: "home", external: true },
  ];

  if (isAdmin) {
    items.splice(1, 0, {
      href: "/admin/clkr",
      label: "CLKR admin",
      icon: "file-text",
    });
  }

  return items;
};

export const adminNavItems: DashboardNavItem[] = [
  { href: "/admin/clkr", label: "Legal Articles", icon: "file-text" },
  { href: "/admin/norms", label: "Norms", icon: "book-open" },
  { href: "/admin/posts", label: "Blog posts", icon: "file-text" },
  { href: "/account", label: "Portal", icon: "layout-dashboard" },
  { href: "/", label: "Public site", icon: "home", external: true },
];
