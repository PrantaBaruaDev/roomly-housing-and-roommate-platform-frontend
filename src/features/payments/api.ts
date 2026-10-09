import {
  apiClient,
  type SingleResponse,
} from "@/lib/api-client";
import type {
  ApiPayment,
  CreateBkashResponse,
  NestedPaginatedResponse,
} from "@/types/payment";

const BASE = "/payments";

export interface PaymentListResponse {
  success: boolean;
  message: string;
  data: ApiPayment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const paymentsApi = {

  list: async (params?: { page?: number; limit?: number }): Promise<PaymentListResponse> => {
    const res = await apiClient<NestedPaginatedResponse<ApiPayment>>(BASE, {
      params,
    });

    return {
      success: res.success,
      message: res.message,
      data: res.data?.data ?? [],
      meta: {
        page: res.data?.meta?.page ?? 1,
        limit: res.data?.meta?.limit ?? 10,
        total: res.data?.meta?.total ?? 0,
        totalPages:
          res.data?.meta?.totalPages ??
          res.data?.meta?.totalPage ??
          1,
      },
    };
  },

  get: (id: string) => apiClient<SingleResponse<ApiPayment>>(`${BASE}/${id}`).then((r) => r.data),

  createBkash: (payload: { applicationId: string } | { invoiceId: string }) =>
    apiClient<SingleResponse<CreateBkashResponse>>(`${BASE}/create/bkash`, {
      method: "POST",
      body: payload,
    }).then((r) => r.data),
};