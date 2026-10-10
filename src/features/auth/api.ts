import { apiClient, type SingleResponse } from "@/lib/api-client";
import type { AuthSession, LoginPayload, RegisterPayload, User } from "@/types/auth";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient<SingleResponse<AuthSession>>("/auth/login", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient<SingleResponse<AuthSession>>("/auth/register", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  me: () =>
    apiClient<SingleResponse<User>>("/auth/me").then((r) => r.data),

  logout: () =>
    apiClient<void>("/auth/logout", { method: "POST" }),
};