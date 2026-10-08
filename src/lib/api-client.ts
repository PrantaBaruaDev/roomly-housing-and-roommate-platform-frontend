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
    const message = (response._data && (response._data.message || response._data.error)) ||
      "Something went wrong. Please try again.";

    if (response.status === 401) {
      useAuthStore.getState().clearSession();

      if (typeof window !== "undefined") {
        const current = window.location.pathname + window.location.search;
        const loginUrl = `/login?redirect=${encodeURIComponent(current)}`;
        window.location.href = loginUrl;
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