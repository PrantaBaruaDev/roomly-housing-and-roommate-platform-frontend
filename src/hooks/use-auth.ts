import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/store/auth-store";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";
import { ROLE } from "@/lib/constants";

function normalizeUser(user: User): User {
  return {
    ...user,
    role: user.role.toLowerCase() as User["role"],
  };
}

export function roleHome(role: string) {
  if (role === ROLE.ADMIN) return "/admin";
  if (role === ROLE.OWNER) return "/owner";
  return "/tenant";
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (session) => {     
      setSession(normalizeUser(session.user), session.accessToken);
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (session) => {
      setSession(normalizeUser(session.user), session.accessToken);
      router.push(roleHome(session.user.role));
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const router = useRouter();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearSession();
      router.push("/login");
    },
  });
}
