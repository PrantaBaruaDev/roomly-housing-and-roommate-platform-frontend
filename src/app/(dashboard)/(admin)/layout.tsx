import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ROLE } from "@/lib/constants";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role={ROLE.ADMIN}>{children}</DashboardShell>;
}
