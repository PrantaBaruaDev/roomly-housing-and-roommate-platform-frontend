import {
  apiClient,
  type PaginatedResponse,
  type SingleResponse,
} from "@/lib/api-client";
import type {
  ApiFlat,
  ApiPropertyWithInventory,
  ApiRoom,
} from "@/types/room";
import type {
  AddRoomsValues,
  EditRoomValues,
  FlatWithRoomsValues,
} from "@/schemas/property.schema";

export const roomsApi = {
  listInventory: (params?: { page?: number; limit?: number }) =>
    apiClient<PaginatedResponse<ApiPropertyWithInventory>>("/properties/flat", {
      params,
    }),

  getFlat: (flatId: string) =>
    apiClient<SingleResponse<ApiFlat & { rooms: ApiRoom[] }>>(
      `/properties/flat/${flatId}`,
    ).then((r) => r.data),

  createFlat: (payload: FlatWithRoomsValues) =>
    apiClient<SingleResponse<ApiFlat>>("/properties/flat", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  addRooms: (payload: AddRoomsValues) =>
    apiClient<SingleResponse<ApiFlat>>("/properties/flat/add-rooms", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  updateRoom: (roomId: string, payload: EditRoomValues) =>
    apiClient<SingleResponse<ApiRoom>>(
      `/properties/flat/room/edit/${roomId}`,
      { method: "PATCH", body: payload },
    ).then((r) => r.data),

  deleteRoom: (roomId: string) =>
    apiClient<void>(`/properties/flat/room/delete/${roomId}`, {
      method: "DELETE",
    }),

  updateFlat: (
    flatId: string,
    payload: { flatName?: string; floorNumber?: number },
  ) =>
    apiClient<SingleResponse<ApiFlat>>(`/properties/flat/edit/${flatId}`, {
      method: "PATCH",
      body: payload,
    }).then((r) => r.data),
};