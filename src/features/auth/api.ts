import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import type { AuthSession, LoginPayload, RegisterPayload, User } from "@/types/auth";

export const authApi = {
  login: (payload: LoginPayload) => apiClient<ApiResponse<AuthSession>>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: RegisterPayload) => apiClient<ApiResponse<AuthSession>>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  // me: () => apiClient<ApiResponse<User>>("/auth/me"),
  me: () => apiClient<{ data: User }>("/auth/me").then((r) => r.data),
  logout: () => apiClient<ApiResponse<void>>("/auth/logout", { method: "POST" }),
};