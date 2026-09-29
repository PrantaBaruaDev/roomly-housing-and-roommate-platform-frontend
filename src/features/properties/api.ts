import { apiClient, type PaginatedResponse } from "@/lib/api-client";
import type { PropertyFormValues } from "@/schemas/property.schema";
import type { Property } from "@/types/property";

export const propertiesApi = {
  list: (params?: { page?: number; ownerId?: string; search?: string }) =>
    apiClient<PaginatedResponse<Property>>("/properties", { params }),
  get: (id: string) => apiClient<Property>(`/properties/${id}`),
  create: (payload: PropertyFormValues) => apiClient<Property>("/properties", { method: "POST", body: payload }),
  update: (id: string, payload: Partial<PropertyFormValues>) =>
    apiClient<Property>(`/properties/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) => apiClient<void>(`/properties/${id}`, { method: "DELETE" }),
  verify: (id: string) => apiClient<Property>(`/properties/${id}/verify`, { method: "POST" }),
};
