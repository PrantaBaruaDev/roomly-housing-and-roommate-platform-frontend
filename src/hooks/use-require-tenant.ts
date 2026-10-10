"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROLE } from '@/lib/constants';

export type AuthGateResult =
  | { ok: true }
  | { ok: false; reason: "login" | "wrong-role" };

export function useRequireTenant() {
  const router = useRouter();

  return function gate(returnTo: string): AuthGateResult {
    const user = useAuthStore.getState().user;

    if (!user) {
      const url = `/login?redirect=${encodeURIComponent(returnTo)}`;
      router.push(url);
      return { ok: false, reason: "login" };
    }

    if (user.role !== ROLE.TENANT) {
      return { ok: false, reason: "wrong-role" };
    }

    return { ok: true };
  };
}