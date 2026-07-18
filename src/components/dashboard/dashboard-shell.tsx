import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

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
  children,
}: Props) {
  return (
    <SidebarProvider>
      <AppSidebar
        email={email}
        productName={productName}
        productTagline={productTagline}
        groups={groups}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold tracking-tight">{pageTitle}</h1>
            {pageDescription ? (
              <p className="truncate text-xs text-muted-foreground">{pageDescription}</p>
            ) : null}
          </div>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
