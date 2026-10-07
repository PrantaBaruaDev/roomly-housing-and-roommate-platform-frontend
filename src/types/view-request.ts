export type BackendViewRequestStatus =
  | "PENDING"
  | "OWNER_RESCHEDULED"
  | "APPROVED"
  | "REJECTED";

export interface ApiViewRequestProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  ownerId: string;
}

export interface ApiViewRequestRoom {
  id: string;
  roomNumber: string;
  rentAmount: string;
}

export interface ApiViewRequestUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiViewRequest {
  id: string;
  roomId: string;
  propertyId: string;
  tenantId: string;
  proposedDate: string;
  counterDate: string | null;
  status: BackendViewRequestStatus;
  createdAt: string;
  updatedAt: string;

  property: ApiViewRequestProperty;
  room: ApiViewRequestRoom;
  tenant: ApiViewRequestUser;
  owner: ApiViewRequestUser;
}

export interface ViewRequestCardVM {
  id: string;

  status: "requested" | "countered" | "confirmed" | "declined";
  statusRaw: BackendViewRequestStatus;

  propertyTitle: string;
  propertyLocation: string;

  roomNumber: string;
  rent: number;

  tenantName: string;
  tenantEmail: string;
  ownerName: string;
  ownerEmail: string;

  proposedDate: string;
  counterDate: string | null;
  requestedAt: string;
}