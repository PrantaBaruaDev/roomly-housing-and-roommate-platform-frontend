import { apiClient, type PaginatedResponse } from "@/lib/api-client";
import type { ViewRequestCounterValues, ViewRequestFormValues } from "@/schemas/application.schema";
import type { ViewRequest } from "@/types/view-request";

export const viewRequestsApi = {
  list: (params?: { tenantId?: string; ownerId?: string; status?: string; page?: number }) =>
    apiClient<PaginatedResponse<ViewRequest>>("/room-view-requests", { params }),
  create: (payload: ViewRequestFormValues) =>
    apiClient<ViewRequest>("/room-view-requests", { method: "POST", body: payload }),
  counter: ({ viewRequestId, ...payload }: ViewRequestCounterValues) =>
    apiClient<ViewRequest>(`/room-view-requests/${viewRequestId}/counter`, { method: "POST", body: payload }),
  confirm: (id: string) => apiClient<ViewRequest>(`/room-view-requests/${id}/confirm`, { method: "POST" }),
  decline: (id: string) => apiClient<ViewRequest>(`/room-view-requests/${id}/decline`, { method: "POST" }),
};
