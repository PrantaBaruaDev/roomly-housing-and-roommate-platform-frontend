import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types";
import type { AuthSession, LoginPayload, RegisterPayload, User } from "@/types/auth";

// export const authApi = {
//   login: (payload: LoginPayload) => apiClient<AuthSession>("/auth/login", { method: "POST", body: payload }),
//   register: (payload: RegisterPayload) => apiClient<AuthSession>("/auth/register", { method: "POST", body: payload }),
//   me: () => apiClient<User>("/auth/me"),
//   logout: () => apiClient<void>("/auth/logout", { method: "POST" }),
// };


export const authApi = {
  login: (payload: LoginPayload) => apiClient<ApiResponse<AuthSession>>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: RegisterPayload) => apiClient<ApiResponse<AuthSession>>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => apiClient<ApiResponse<User>>("/auth/me"),
  logout: () => apiClient<ApiResponse<void>>("/auth/logout", { method: "POST" }),
};