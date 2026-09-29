import { apiClient, type PaginatedResponse } from "@/lib/api-client";
import type { ApplicationFormValues, ApplicationReviewValues } from "@/schemas/application.schema";
import type { RentalApplication } from "@/types/application";

export const applicationsApi = {
  list: (params?: { status?: string; propertyId?: string; tenantId?: string; page?: number }) =>
    apiClient<PaginatedResponse<RentalApplication>>("/applications", { params }),
  get: (id: string) => apiClient<RentalApplication>(`/applications/${id}`),
  submit: (payload: ApplicationFormValues) =>
    apiClient<RentalApplication>("/applications", { method: "POST", body: payload }),
  review: ({ applicationId, ...payload }: ApplicationReviewValues) =>
    apiClient<RentalApplication>(`/applications/${applicationId}/review`, { method: "POST", body: payload }),
  withdraw: (id: string) => apiClient<RentalApplication>(`/applications/${id}/withdraw`, { method: "POST" }),
};
