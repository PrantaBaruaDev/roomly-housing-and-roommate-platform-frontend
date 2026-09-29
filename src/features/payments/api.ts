import { apiClient, type PaginatedResponse } from "@/lib/api-client";
import type { Payment } from "@/types/payment";

export const paymentsApi = {
  list: (params?: { tenantId?: string; roomId?: string; status?: string; page?: number }) =>
    apiClient<PaginatedResponse<Payment>>("/payments", { params }),
  get: (id: string) => apiClient<Payment>(`/payments/${id}`),
  initiate: (payload: { applicationId: string; method: Payment["method"] }) =>
    apiClient<{ redirectUrl: string; paymentId: string }>("/payments/initiate", { method: "POST", body: payload }),
  payInvoice: (payload: { invoiceId: string; method: Payment["method"] }) =>
    apiClient<{ redirectUrl: string; paymentId: string }>("/payments/invoice", { method: "POST", body: payload }),
};
