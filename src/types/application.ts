export type BackendApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type BackendPaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCEL"
  | "FAILED";

export type BackendPaymentProvider = "CARD" | "BKASH";

export interface ApiApplicationTenant {
  id: string;
  name: string;
  email: string;
}

export interface ApiApplicationOwner {
  id: string;
  name: string;
  email: string;
}

export interface ApiApplicationProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  owner: ApiApplicationOwner;
}

export interface ApiApplicationRoom {
  id: string;
  propertyId: string;
  flatId: string;
  roomNumber: string;
  rentAmount: string;
  bookingMode: "BOOK_BY_ROOM" | "BOOK_BY_SEAT";
  maxCapacity: number;
  property: ApiApplicationProperty;
}

export interface ApiApplicationPayment {
  id: string;
  tenantId: string;
  applicationId: string;
  invoiceId: string | null;
  amount: string;
  paidAt: string;
  status: BackendPaymentStatus;
  paymentProvider: BackendPaymentProvider;
  gatewayPaymentId: string | null;
  gatewayTransactionId: string | null;
  payerReference: string | null;
  gatewayResponse: Record<string, unknown> | null;
  refundTrxID: string | null;
  refundAmount: string | null;
  refundReason: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiApplication {
  id: string;
  roomId: string;
  status: BackendApplicationStatus;
  moveInDate: string;
  isPrivateLease: boolean;
  agreedRentAmount: string;
  ownerFeedback: string | null;
  tenant: ApiApplicationTenant;
  room: ApiApplicationRoom;
  payments: ApiApplicationPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationCardVM {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  statusRaw: BackendApplicationStatus;

  tenantName: string;
  tenantEmail: string;

  propertyTitle: string;
  propertyLocation: string;

  roomNumber: string;
  bookingMode: "BOOK_BY_ROOM" | "BOOK_BY_SEAT";

  agreedRent: number;
  moveInDate: string;
  isPrivateLease: boolean;
  ownerFeedback: string | null;
  isPaid: boolean;
  paidAmount: number | null;
  paidAt: string | null;
  paymentProvider: BackendPaymentProvider | null;
  lastPaymentStatus: BackendPaymentStatus | null;
}

export interface ApplicationDetailVM {
  id: string;
  status: BackendApplicationStatus;
  statusKey: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

  /* Tenant */
  tenantId: string;
  tenantName: string;
  tenantEmail: string;

  /* Owner */
  ownerId: string;
  ownerName: string;
  ownerEmail: string;

  /* Property + room */
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  roomId: string;
  roomNumber: string;
  roomRent: number;
  bookingMode: "BOOK_BY_ROOM" | "BOOK_BY_SEAT";
  maxCapacity: number;

  /* Application */
  moveInDate: string;
  isPrivateLease: boolean;
  agreedRent: number;
  ownerFeedback: string | null;
  createdAt: string;
  updatedAt: string;

  /* Payments */
  payments: {
    id: string;
    amount: number;
    status: string;
    paidAt: string | null;
    provider: string;
  }[];
  hasCompletedPayment: boolean;
  completedPaymentId: string | null;
}