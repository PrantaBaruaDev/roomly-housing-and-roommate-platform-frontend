import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoicesApi } from "@/features/invoices/api";
import { queryKeys } from "./query-keys";
import type { InvoiceFormValues } from "@/schemas/invoice.schema";

export function useInvoices(params?: { tenantId?: string; ownerId?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params),
    queryFn: () => invoicesApi.list(params),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceFormValues) => invoicesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all }),
  });
}

export function useIssueInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoicesApi.issue(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all }),
  });
}
