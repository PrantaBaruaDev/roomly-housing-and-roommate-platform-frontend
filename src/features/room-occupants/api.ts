import { apiClient } from "@/lib/api-client";
import type { RoomOccupant } from "@/types/room-occupant";

export const roomOccupantsApi = {
  listByRoom: (roomId: string) => apiClient<RoomOccupant[]>(`/rooms/${roomId}/occupants`),
  listMine: () => apiClient<RoomOccupant[]>("/room-occupants/me"),
  listRoommates: (roomId: string) => apiClient<RoomOccupant[]>(`/rooms/${roomId}/occupants/roommates`),
};
