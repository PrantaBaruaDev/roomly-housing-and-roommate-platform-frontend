"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roomsApi } from "@/features/rooms/api";
import { queryKeys } from "./query-keys";
import type {
  AddRoomsValues,
  EditRoomValues,
  FlatWithRoomsValues,
} from "@/schemas/property.schema";

const INVENTORY_KEY = ["rooms", "inventory"] as const;

export function usePropertyInventory() {
  return useQuery({
    queryKey: INVENTORY_KEY,
    queryFn: () => roomsApi.listInventory(),
  });
}

export function useCreateFlatWithRooms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FlatWithRoomsValues) => roomsApi.createFlat(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEY });
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useAddRooms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddRoomsValues) => roomsApi.addRooms(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: INVENTORY_KEY }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & EditRoomValues) =>
      roomsApi.updateRoom(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: INVENTORY_KEY }),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => roomsApi.deleteRoom(roomId),
    onSuccess: () => qc.invalidateQueries({ queryKey: INVENTORY_KEY }),
  });
}

export function useFlat(flatId: string) {
  return useQuery({
    queryKey: ["rooms", "flat", flatId],
    queryFn: () => roomsApi.getFlat(flatId),
    enabled: Boolean(flatId),
  });
}

export function useUpdateFlat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & { flatName?: string; floorNumber?: number }) =>
      roomsApi.updateFlat(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVENTORY_KEY });
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}