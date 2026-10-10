import { ofetch } from "ofetch";
import { useAuthStore } from "@/store/auth-store";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const apiClient = ofetch.create({
  baseURL: API_BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${token}`);
    }
  },

  onResponseError({ response }) {
    const message =
      (response._data && (response._data.message || response._data.error)) ||
      "Something went wrong. Please try again.";

    if (response.status === 401) {
      const hadToken = Boolean(useAuthStore.getState().accessToken);

      if (hadToken) {
        useAuthStore.getState().clearSession();

        fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        })
          .catch(() => {
            /* ignore — the redirect below still runs */
          })
          .finally(() => {
            if (typeof window === "undefined") return;
            const onAuthPage =
              window.location.pathname.startsWith("/login") ||
              window.location.pathname.startsWith("/register");
            if (onAuthPage) return;
            window.location.href = "/login";
          });
      }
    }

    throw new ApiError(message, response.status, response._data);
  },
});

export interface ApiEnvelope {
  success: boolean;
  message: string;
}

export interface PaginatedResponse<T> extends ApiEnvelope {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface SingleResponse<T> extends ApiEnvelope {
  data: T;
}