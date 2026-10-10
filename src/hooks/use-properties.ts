import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/features/properties/api";
import { queryKeys } from "./query-keys";
import type { PropertyFormValues } from "@/schemas/property.schema";

export function useProperties(params?: {
  page?: number;
  ownerId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: queryKeys.properties.list(params),
    queryFn: () => propertiesApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useOwnerProperties(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [...queryKeys.properties.all, "owner", params],
    queryFn: () => propertiesApi.listOwnerOwn(params),
    placeholderData: keepPreviousData,
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
  });
}

export function useVerifyProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.verify(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & Partial<PropertyFormValues>) =>
      propertiesApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });
    },
  });
}