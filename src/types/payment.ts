export type BackendPaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCEL"
  | "FAILED";

export type BackendPaymentProvider = "CARD" | "BKASH";

export interface ApiPaymentTenant {
  id: string;
  name: string;
  email: string;
}

export interface ApiPaymentProperty {
  id: string;
  title: string;
}

export interface ApiPaymentRoom {
  id: string;
  roomNumber: string;
  property: ApiPaymentProperty;
}

export interface ApiPaymentApplication {
  id: string;
  room: ApiPaymentRoom;
}

export interface ApiPaymentInvoice {
  id: string;
  billMonth: string;
  totalAmount: string;
}

export interface ApiPayment {
  id: string;
  tenantId: string;
  applicationId: string | null;
  invoiceId: string | null;
  amount: string;
  paidAt: string | null;
  status: BackendPaymentStatus;
  paymentProvider: BackendPaymentProvider;

  merchantInvoiceNumber: string | null;
  gatewayPaymentId: string | null;
  gatewayTransactionId: string | null;
  payerReference: string | null;
  stripeCustomerId: string | null;

  refundTrxID: string | null;
  refundAmount: string | null;
  refundReason: string | null;
  refundedAt: string | null;

  createdAt: string;
  updatedAt: string;

  tenant?: ApiPaymentTenant;
  application?: ApiPaymentApplication | null;
  invoice?: ApiPaymentInvoice | null;
}

export interface CreateBkashResponse {
  paymentUrl: string;
  payment: ApiPayment;
  message: string;
}

export interface NestedPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage?: number;
      totalPages?: number;
    };
  };
}

export interface PaymentRowVM {
  id: string;

  amount: number;
  status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  statusRaw: BackendPaymentStatus;
  provider: BackendPaymentProvider;
  providerLabel: string;

  purpose: "invoice" | "application" | "unknown";
  referenceId: string | null;

  referenceLabel: string | null;
  propertyTitle: string | null;

  createdAt: string;
  paidAt: string | null;

  gatewayPaymentId: string | null;
  gatewayTransactionId: string | null;
  payerReference: string | null;

  isRefunded: boolean;
  refundAmount: number | null;
  refundReason: string | null;

  tenantName: string | null;
  tenantEmail: string | null;
}