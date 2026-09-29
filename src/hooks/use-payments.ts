import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/features/payments/api";
import { queryKeys } from "./query-keys";
import type { Payment } from "@/types/payment";

export function usePayments(params?: { tenantId?: string; roomId?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => paymentsApi.list(params),
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { applicationId: string; method: Payment["method"] }) => paymentsApi.initiate(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.payments.all }),
  });
}
