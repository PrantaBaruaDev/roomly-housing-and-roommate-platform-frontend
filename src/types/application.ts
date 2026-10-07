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