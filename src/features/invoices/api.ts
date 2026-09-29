import { apiClient, type PaginatedResponse } from "@/lib/api-client";
import type { InvoiceFormValues } from "@/schemas/invoice.schema";
import type { Invoice } from "@/types/invoice";

export const invoicesApi = {
  list: (params?: { tenantId?: string; ownerId?: string; status?: string; page?: number }) =>
    apiClient<PaginatedResponse<Invoice>>("/invoices", { params }),
  get: (id: string) => apiClient<Invoice>(`/invoices/${id}`),
  create: (payload: InvoiceFormValues) => apiClient<Invoice>("/invoices", { method: "POST", body: payload }),
  issue: (id: string) => apiClient<Invoice>(`/invoices/${id}/issue`, { method: "POST" }),
};
