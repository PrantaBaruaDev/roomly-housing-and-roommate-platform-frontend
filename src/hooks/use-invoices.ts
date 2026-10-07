import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoicesApi } from "@/features/invoices/api";
import { queryKeys } from "./query-keys";
import type { BackendBillStatus } from "@/types/invoice";
import type { InvoiceFormValues } from "@/schemas/invoice.schema";

export function useInvoices(params?: {
  status?: BackendBillStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params),
    queryFn: () => invoicesApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => invoicesApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceFormValues) => invoicesApi.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all }),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: string } & Partial<InvoiceFormValues>) =>
      invoicesApi.update(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all }),
  });
}