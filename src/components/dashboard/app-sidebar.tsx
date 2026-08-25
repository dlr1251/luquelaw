"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  BookmarkIcon,
  BotIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareIcon,
  ScaleIcon,
  SettingsIcon,
  SparklesIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";

import { signOut } from "@/app/(dashboard)/portal/actions";
import type {
  DashboardNavGroup,
  DashboardNavIcon,
} from "@/components/dashboard/dashboard-nav";
import { isNavItemActive } from "@/components/dashboard/dashboard-nav";
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
  bot: BotIcon,
  "message-square": MessageSquareIcon,
  ticket: TicketIcon,
  sparkles: SparklesIcon,
  scale: ScaleIcon,
  "credit-card": CreditCardIcon,
  settings: SettingsIcon,
  bookmark: BookmarkIcon,
  users: UsersIcon,
};

type Props = {
  email: string | null;
  productName: string;
  productTagline: string;
  groups: DashboardNavGroup[];
};

export function AppSidebar({ email, productName, productTagline, groups }: Props) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link
          href="/portal"
          className="flex items-start gap-2.5 rounded-md px-1 outline-none ring-sidebar-ring focus-visible:ring-2"
        >
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--forest)] text-xs font-semibold text-[var(--parchment)]">
            LL
          </span>
          <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Luque Law
            </span>
            <span className="block truncate text-sm font-semibold leading-tight text-foreground">
              {productName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{productTagline}</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavItemActive(pathname, item);
                  const Icon = navIcons[item.icon];

                  return (
                    <SidebarMenuItem key={`${group.label}:${item.href}:${item.label}`}>
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
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className={cn("px-2 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden")}>
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
