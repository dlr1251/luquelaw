import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { DashboardNavGroup } from "@/components/dashboard/dashboard-nav";

import { AppSidebar } from "./app-sidebar";

type Props = {
  email: string | null;
  productName: string;
  productTagline: string;
  pageTitle: string;
  pageDescription?: string;
  groups: DashboardNavGroup[];
  headerAction?: React.ReactNode;
  contentClassName?: string;
  compactSidebar?: boolean;
  children: React.ReactNode;
};

export function DashboardShell({
  email,
  productName,
  productTagline,
  pageTitle,
  pageDescription,
  groups,
  headerAction,
  contentClassName,
  compactSidebar = false,
  children,
}: Props) {
  return (
    <SidebarProvider className="min-h-0 flex-1">
      <AppSidebar
        email={email}
        productName={productName}
        productTagline={productTagline}
        groups={groups}
        compact={compactSidebar}
      />
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-normal tracking-tight text-[color:var(--forest)]">
              {pageTitle}
            </h1>
            {pageDescription ? (
              <p className="truncate text-xs leading-5 text-muted-foreground">{pageDescription}</p>
            ) : null}
          </div>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </header>
        <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6", contentClassName)}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
