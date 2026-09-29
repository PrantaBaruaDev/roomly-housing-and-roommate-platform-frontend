import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/features/properties/api";
import { roomsApi } from "@/features/rooms/api";
import { queryKeys } from "./query-keys";
import type { PropertyFormValues, RoomFormValues } from "@/schemas/property.schema";

export function useProperties(params?: { page?: number; ownerId?: string; search?: string }) {
  return useQuery({
    queryKey: queryKeys.properties.list(params),
    queryFn: () => propertiesApi.list(params),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => propertiesApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PropertyFormValues) => propertiesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
  });
}

export function useFlats(propertyId: string) {
  return useQuery({
    queryKey: queryKeys.flats.list(propertyId),
    queryFn: () => roomsApi.listFlats(propertyId),
    enabled: Boolean(propertyId),
  });
}

export function useRooms(params?: { propertyId?: string; flatId?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.rooms.list(params),
    queryFn: () => roomsApi.listRooms(params),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoomFormValues) => roomsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all }),
  });
}
