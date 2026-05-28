"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";

import { signOut } from "@/app/(dashboard)/account/actions";
import type {
  DashboardNavIcon,
  DashboardNavItem,
} from "@/components/dashboard/dashboard-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navIcons: Record<
  DashboardNavIcon,
  React.ComponentType<{ className?: string }>
> = {
  "layout-dashboard": LayoutDashboardIcon,
  "book-open": BookOpenIcon,
  home: HomeIcon,
  "file-text": FileTextIcon,
};

type Props = {
  email: string | null;
  title: string;
  subtitle: string;
  items: DashboardNavItem[];
};

export function AppSidebar({ email, title, subtitle, items }: Props) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link href="/" className="flex flex-col gap-0.5 px-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Luque Law
          </span>
          <span className="text-sm font-semibold leading-tight">{title}</span>
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  !item.external &&
                  (pathname === item.href ||
                    (item.href !== "/account" && pathname.startsWith(`${item.href}/`)));
                const Icon = navIcons[item.icon];

                return (
                  <SidebarMenuItem key={item.href + item.label}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                        />
                      }
                      isActive={active}
                      tooltip={item.label}
                    >
                        <Icon />
                        <span>{item.label}</span>
                        {item.external ? (
                          <ExternalLinkIcon className="ml-auto size-3.5 opacity-50" />
                        ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className={cn("px-2 py-2 text-xs text-muted-foreground")}>
          <p className="truncate font-medium text-foreground">{email ?? "Signed in"}</p>
        </div>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton type="submit" tooltip="Sign out">
                <LogOutIcon />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
