import {
  apiClient,
  type PaginatedResponse,
  type SingleResponse,
} from "@/lib/api-client";
import type {
  ApiViewRequest,
  BackendViewRequestStatus,
} from "@/types/view-request";
import type { ViewRequestFormValues } from "@/schemas/application.schema";

const BASE = "/room_view_request";

export interface UpdateViewRequestPayload {
  status?: BackendViewRequestStatus;
  counterDate?: string;
  ownerFeedback?: string;
}

export const viewRequestsApi = {
  list: (params?: {
    status?: BackendViewRequestStatus;
    roomId?: string;
    page?: number;
    limit?: number;
  }) => apiClient<PaginatedResponse<ApiViewRequest>>(BASE, { params }),

  get: (id: string) => apiClient<SingleResponse<ApiViewRequest>>(`${BASE}/${id}`).then((r) => r.data),

  create: (payload: ViewRequestFormValues) =>
    apiClient<SingleResponse<ApiViewRequest>>(BASE, {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  update: (id: string, payload: UpdateViewRequestPayload) =>
    apiClient<SingleResponse<ApiViewRequest>>(`${BASE}/${id}`, {
      method: "PATCH",
      body: payload,
    }).then((r) => r.data),

  remove: (id: string) =>
    apiClient<void>(`${BASE}/${id}`, { method: "DELETE" }),
};