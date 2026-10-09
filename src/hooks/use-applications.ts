"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { applicationsApi } from "@/features/applications/api";
import { queryKeys } from "./query-keys";
import type {
  ApiApplication,
  BackendApplicationStatus,
} from "@/types/application";
import type {
  ApplicationCreateValues,
  ApplicationUpdateValues,
} from "@/schemas/application.schema";

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

export function useSubmitApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApplicationCreateValues) =>
      applicationsApi.submit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ApplicationUpdateValues) =>
      applicationsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.all });
      qc.invalidateQueries({
        queryKey: queryKeys.applications.detail(variables.id),
      });
    },
  });
}

export function useWithdrawApplication() {
  return useUpdateApplication();
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}