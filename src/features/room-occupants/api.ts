import {
  apiClient,
  type PaginatedResponse,
  type SingleResponse,
} from "@/lib/api-client";
import type { ApiRoomOccupant } from "@/types/room-occupant";

const BASE = "/room_occupant";

export const roomOccupantsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient<PaginatedResponse<ApiRoomOccupant>>(BASE, { params }),

  moveOut: (id: string, movedOutAt: string) =>
    apiClient<SingleResponse<ApiRoomOccupant>>(`${BASE}/${id}/move-out`, {
      method: "PATCH",
      body: { movedOutAt },
    }).then((r) => r.data),

  undoMoveOut: (id: string) =>
    apiClient<SingleResponse<ApiRoomOccupant>>(`${BASE}/${id}/cancel-move-out`, {
      method: "PATCH",
    }).then((r) => r.data),
};