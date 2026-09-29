import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ROLE } from "@/lib/constants";

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role={ROLE.OWNER}>{children}</DashboardShell>;
}
