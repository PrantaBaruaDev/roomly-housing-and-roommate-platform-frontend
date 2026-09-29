import { apiClient, type PaginatedResponse } from "@/lib/api-client";
import type { RoomFormValues } from "@/schemas/property.schema";
import type { Flat, Room } from "@/types/property";

export const roomsApi = {
  listFlats: (propertyId: string) => apiClient<Flat[]>(`/properties/${propertyId}/flats`),
  createFlat: (propertyId: string, payload: { label: string; floor: number }) =>
    apiClient<Flat>(`/properties/${propertyId}/flats`, { method: "POST", body: payload }),

  listRooms: (params?: { propertyId?: string; flatId?: string; status?: string; page?: number }) =>
    apiClient<PaginatedResponse<Room>>("/rooms", { params }),
  get: (id: string) => apiClient<Room>(`/rooms/${id}`),
  create: (payload: RoomFormValues) => apiClient<Room>("/rooms", { method: "POST", body: payload }),
  update: (id: string, payload: Partial<RoomFormValues>) =>
    apiClient<Room>(`/rooms/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) => apiClient<void>(`/rooms/${id}`, { method: "DELETE" }),
};
