"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/features/auth/api";
import type { Role } from "@/lib/constants";
import type { User } from "@/types/auth";


function readAccessCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function RoleShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist exposes these helpers on the store.
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsubscribe;
  }, []);

  const { data, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: hydrated && !user,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    
    const token = readAccessCookie();
    setSession(data, token ?? "");
    
  }, [data, setSession]);

  useEffect(() => {
    if (!hydrated || user) return;
    if (isError) {
      clearSession();
      router.replace("/login");
    }
  }, [isError, hydrated, user, clearSession, router]);

  return <DashboardShell role={role}>{children}</DashboardShell>;
}