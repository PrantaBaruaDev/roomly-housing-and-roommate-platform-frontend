import { apiClient, type PaginatedResponse, type SingleResponse } from "@/lib/api-client";
import { FlatWithRoomsValues, PropertyFormValues } from "@/schemas/property.schema";
import type { ApiProperty } from "@/types/property";
import { ApiFlat } from "@/types/room";

export const propertiesApi = {
  list: (params?: { page?: number; ownerId?: string; search?: string }) =>
    apiClient<PaginatedResponse<ApiProperty>>("/properties", { params }),

  listOwnerOwn: (params?: { page?: number; search?: string }) =>
    apiClient<PaginatedResponse<ApiProperty>>("/properties/owner", { params }),

  get: (id: string) =>
    apiClient<SingleResponse<ApiProperty>>(`/properties/${id}`).then((r) => r.data),

  create: (payload: PropertyFormValues) =>
    apiClient<SingleResponse<ApiProperty>>("/properties", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  update: (id: string, payload: Partial<PropertyFormValues>) =>
    apiClient<SingleResponse<ApiProperty>>(`/properties/${id}`, {
      method: "PATCH",
      body: payload,
    }).then((r) => r.data),

  remove: (id: string) =>
    apiClient<void>(`/properties/${id}`, { method: "DELETE" }),

  verify: (id: string) =>
    apiClient<SingleResponse<ApiProperty>>(`/properties/${id}/verify`, {
      method: "PATCH",
    }).then((r) => r.data),

  
};