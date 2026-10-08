import {
  apiClient,
  type PaginatedResponse,
} from "@/lib/api-client";
import type { ApiRoomOccupant } from "@/types/room-occupant";

const BASE = "/room_occupant";

export const roomOccupantsApi = {
  list: (params?: { page?: number; limit?: number }) => apiClient<PaginatedResponse<ApiRoomOccupant>>(BASE, { params }),
};