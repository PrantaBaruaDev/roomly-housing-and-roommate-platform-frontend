import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { viewRequestsApi } from "@/features/view-requests/api";
import { queryKeys } from "./query-keys";
import type { ViewRequestCounterValues, ViewRequestFormValues } from "@/schemas/application.schema";

export function useViewRequests(params?: { tenantId?: string; ownerId?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.viewRequests.list(params),
    queryFn: () => viewRequestsApi.list(params),
  });
}

export function useCreateViewRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ViewRequestFormValues) => viewRequestsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.viewRequests.all }),
  });
}

export function useCounterViewRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ViewRequestCounterValues) => viewRequestsApi.counter(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.viewRequests.all }),
  });
}

export function useConfirmViewRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => viewRequestsApi.confirm(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.viewRequests.all }),
  });
}
