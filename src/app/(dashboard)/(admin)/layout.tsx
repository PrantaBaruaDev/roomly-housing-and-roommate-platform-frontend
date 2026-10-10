import { redirect } from "next/navigation";
import { getServerUser, ROLE_HOME } from "@/lib/server-auth";
import { RoleShell } from "@/components/layout/role-shell";
import { ROLE } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect(ROLE_HOME[user.role]);
  }

  return <RoleShell role={ROLE.ADMIN}>{children}</RoleShell>;
}