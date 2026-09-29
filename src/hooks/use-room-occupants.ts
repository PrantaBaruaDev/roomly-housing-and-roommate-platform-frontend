import { useQuery } from "@tanstack/react-query";
import { roomOccupantsApi } from "@/features/room-occupants/api";
import { queryKeys } from "./query-keys";

export function useMyRoommates() {
  return useQuery({
    queryKey: queryKeys.roomOccupants.mine,
    queryFn: () => roomOccupantsApi.listMine(),
  });
}

export function useRoomOccupants(roomId: string) {
  return useQuery({
    queryKey: queryKeys.roomOccupants.byRoom(roomId),
    queryFn: () => roomOccupantsApi.listByRoom(roomId),
    enabled: Boolean(roomId),
  });
}
