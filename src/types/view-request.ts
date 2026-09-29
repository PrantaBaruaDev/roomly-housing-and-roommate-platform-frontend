import type { ViewRequestStatus } from "@/lib/constants";

export interface ViewRequest {
  id: string;
  roomId: string;
  roomNumber: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  status: ViewRequestStatus;
  proposedDate: string;
  counterDate?: string;
  counterNote?: string;
  confirmedDate?: string;
  createdAt: string;
}
