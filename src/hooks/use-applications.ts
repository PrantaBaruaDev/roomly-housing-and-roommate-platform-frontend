import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/features/applications/api";
import { queryKeys } from "./query-keys";
import type { ApiApplication, BackendApplicationStatus } from "@/types/application";
import type { ApplicationReviewValues } from "@/schemas/application.schema";

export function useApplications(params?: {
  status?: BackendApplicationStatus;
  propertyId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.applications.list(params),
    queryFn: () => applicationsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => applicationsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & Partial<ApplicationReviewValues>) =>
      applicationsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}
