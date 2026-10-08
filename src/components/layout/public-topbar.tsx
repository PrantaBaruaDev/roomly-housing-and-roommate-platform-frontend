"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

function dashboardHome(role: string) {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/owner";
  return "/tenant";
}

export function PublicTopbar() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Create account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-muted-foreground sm:inline">
        {user.email}
      </span>
      <Button asChild size="sm" variant="outline">
        <Link href={dashboardHome(user.role)}>Dashboard</Link>
      </Button>
    </div>
  );
}