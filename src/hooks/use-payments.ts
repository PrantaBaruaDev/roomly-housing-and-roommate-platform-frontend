"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { paymentsApi } from "@/features/payments/api";
import { queryKeys } from "./query-keys";

export function usePayments(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["payments", "list", params],
    queryFn: () => paymentsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", "detail", id],
    queryFn: () => paymentsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateBkashPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { applicationId: string } | { invoiceId: string }) =>
      paymentsApi.createBkash(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}