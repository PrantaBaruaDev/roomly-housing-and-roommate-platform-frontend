import type { ApplicationStatus } from "@/lib/constants";

export interface RentalApplication {
  id: string;
  roomId: string;
  roomNumber: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  tenantAvatarUrl?: string;
  status: ApplicationStatus;
  moveInDate: string;
  message?: string;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}
