import {
  apiClient,
  type PaginatedResponse,
  type SingleResponse,
} from "@/lib/api-client";
import type { ApiInvoice, BackendBillStatus } from "@/types/invoice";
import type { InvoiceFormValues } from "@/schemas/invoice.schema";

const BASE = "/invoice";

export const invoicesApi = {
  list: (params?: {
    status?: BackendBillStatus;
    page?: number;
    limit?: number;
  }) =>
    apiClient<PaginatedResponse<ApiInvoice>>(BASE, { params }),

  get: (id: string) =>
    apiClient<SingleResponse<ApiInvoice>>(`${BASE}/${id}`).then((r) => r.data),

  create: (payload: InvoiceFormValues) =>
    apiClient<SingleResponse<ApiInvoice>>(BASE, {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  update: (id: string, payload: Partial<InvoiceFormValues>) =>
    apiClient<SingleResponse<ApiInvoice>>(`${BASE}/${id}`, {
      method: "PATCH",
      body: payload,
    }).then((r) => r.data),

  remove: (id: string) =>
    apiClient<void>(`${BASE}/${id}`, { method: "DELETE" }),
};