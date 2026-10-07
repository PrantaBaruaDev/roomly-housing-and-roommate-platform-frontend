import { apiClient, type PaginatedResponse, type SingleResponse } from "@/lib/api-client";
import type {
  ApiApplication,
  BackendApplicationStatus,
} from "@/types/application";
import type {
  ApplicationFormValues,
  ApplicationReviewValues,
} from "@/schemas/application.schema";

export const applicationsApi = {
  list: (params?: {
    status?: BackendApplicationStatus;
    propertyId?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient<PaginatedResponse<ApiApplication>>("/applications", { params }),

  get: (id: string) =>
    apiClient<SingleResponse<ApiApplication>>(`/applications/${id}`).then(
      (r) => r.data,
    ),

  submit: (payload: ApplicationFormValues) =>
    apiClient<SingleResponse<ApiApplication>>("/applications", {
      method: "POST",
      body: payload,
    }).then((r) => r.data),

  update: (id: string, payload: Partial<ApplicationReviewValues>) =>
    apiClient<SingleResponse<ApiApplication>>(`/applications/${id}`, {
      method: "PATCH",
      body: payload,
    }).then((r) => r.data),

  remove: (id: string) =>
    apiClient<void>(`/applications/${id}`, { method: "DELETE" }),
};