import type { Metadata } from "next";

import { NOINDEX_NOFOLLOW_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_NOFOLLOW_METADATA;

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="main" className="dashboard-theme flex min-h-svh flex-col">
      {children}
    </div>
  );
}
