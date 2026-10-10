import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  viewRequestsApi,
  type UpdateViewRequestPayload,
} from "@/features/view-requests/api";
import { queryKeys } from "./query-keys";
import type { BackendViewRequestStatus } from "@/types/view-request";
import type { ViewRequestFormValues } from "@/schemas/application.schema";

export function useViewRequests(params?: {
  status?: BackendViewRequestStatus;
  roomId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.viewRequests.list(params),
    queryFn: () => viewRequestsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useViewRequest(id: string) {
  return useQuery({
    queryKey: ["view-requests", "detail", id],
    queryFn: () => viewRequestsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateViewRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ViewRequestFormValues) => viewRequestsApi.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.viewRequests.all }),
  });
}

export function useUpdateViewRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & UpdateViewRequestPayload) =>
      viewRequestsApi.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.viewRequests.all });
      qc.invalidateQueries({
        queryKey: ["view-requests", "detail", vars.id],
      });
    },
  });
}