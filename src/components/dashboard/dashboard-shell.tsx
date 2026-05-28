import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import type { DashboardNavItem } from "@/components/dashboard/dashboard-nav";

import { AppSidebar } from "./app-sidebar";

type Props = {
  email: string | null;
  title: string;
  subtitle: string;
  pageTitle: string;
  pageDescription?: string;
  items: DashboardNavItem[];
  children: React.ReactNode;
};

export function DashboardShell({
  email,
  title,
  subtitle,
  pageTitle,
  pageDescription,
  items,
  children,
}: Props) {
  return (
    <SidebarProvider>
      <AppSidebar email={email} title={title} subtitle={subtitle} items={items} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold">{pageTitle}</h1>
            {pageDescription ? (
              <p className="truncate text-xs text-muted-foreground">{pageDescription}</p>
            ) : null}
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
