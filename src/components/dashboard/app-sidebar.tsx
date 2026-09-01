"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  BookmarkIcon,
  BotIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareIcon,
  ScaleIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldIcon,
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
} from "@/components/ui/sidebar";
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
  "scroll-text": ScrollTextIcon,
  shield: ShieldIcon,
};

type Props = {
  email: string | null;
  productName: string;
  productTagline: string;
  groups: DashboardNavGroup[];
  compact?: boolean;
};

const itemClass =
  "rounded-none font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] hover:bg-surface hover:text-[color:var(--forest)] data-active:bg-surface data-active:font-medium data-active:text-[color:var(--forest)] data-active:shadow-[inset_2px_0_0_var(--moss)]";

export function AppSidebar({ email, productName, groups, compact = false }: Props) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {compact ? null : (
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <p className="px-2 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.16em] text-[color:var(--moss)] group-data-[collapsible=icon]:hidden">
            {productName}
          </p>
        </SidebarHeader>
      )}

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label} className={compact ? "p-1.5" : undefined}>
            <SidebarGroupLabel className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavItemActive(pathname, item);
                  const Icon = navIcons[item.icon];

                  return (
                    <SidebarMenuItem key={`${group.label}:${item.href}:${item.label}`}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.label}
                        className={itemClass}
                      >
                        <Icon />
                        <span>{item.label}</span>
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
        <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-xs leading-5 text-muted-foreground">{email ?? "Signed in"}</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton type="submit" tooltip="Sign out" className={itemClass}>
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
