"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { roomOccupantsApi } from "@/features/room-occupants/api";

const OCCUPANTS_KEY = ["room-occupants", "list"] as const;

export function useRoomOccupants(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...OCCUPANTS_KEY, params],
    queryFn: () => roomOccupantsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useMoveOutOccupant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, movedOutAt }: { id: string; movedOutAt: string }) =>
      roomOccupantsApi.moveOut(id, movedOutAt),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["room-occupants"] });
      qc.invalidateQueries({ queryKey: ["rooms", "inventory"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useUndoMoveOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roomOccupantsApi.undoMoveOut(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["room-occupants"] });
      qc.invalidateQueries({ queryKey: ["rooms", "inventory"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

/** Convenience — filtered client-side. */
export function useActiveOccupants(params?: { page?: number }) {
  const query = useRoomOccupants(params);
  const active = (query.data?.data ?? []).filter((o) => !o.movedOutAt);
  return { ...query, activeCount: active.length };
}