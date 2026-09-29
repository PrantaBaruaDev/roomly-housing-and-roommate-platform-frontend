import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/features/applications/api";
import { queryKeys } from "./query-keys";
import type { ApplicationFormValues, ApplicationReviewValues } from "@/schemas/application.schema";

export function useApplications(params?: { status?: string; propertyId?: string; tenantId?: string }) {
  return useQuery({
    queryKey: queryKeys.applications.list(params),
    queryFn: () => applicationsApi.list(params),
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApplicationFormValues) => applicationsApi.submit(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  });
}

export function useReviewApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApplicationReviewValues) => applicationsApi.review(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.withdraw(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications.all }),
  });
}
