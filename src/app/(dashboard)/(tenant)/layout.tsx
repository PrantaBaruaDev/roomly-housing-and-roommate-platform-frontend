import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function TenantLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="tenant">{children}</DashboardShell>;
}
