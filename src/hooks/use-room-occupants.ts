"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { roomOccupantsApi } from "@/features/room-occupants/api";

const OCCUPANTS_KEY = ["room-occupants", "list"] as const;

export function useRoomOccupants(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...OCCUPANTS_KEY, params],
    queryFn: () => roomOccupantsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useActiveOccupants(params?: { page?: number }) {
  const query = useRoomOccupants(params);
  const active = (query.data?.data ?? []).filter((o) => !o.movedOutAt);
  return { ...query, activeCount: active.length };
}
