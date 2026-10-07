export type BackendBillStatus = "UNPAID" | "PAID" | "OVERDUE";

export type BackendInvoiceType =
  | "COMBINED_RENT_UTILITY"
  | "MAINTENANCE_FEE";

export type BackendPaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCEL"
  | "FAILED";

export type BackendPaymentProvider = "CARD" | "BKASH";

export interface ApiUtilityDetail {
  name: string;
  amount: number;
}

export interface ApiInvoiceTenant {
  id: string;
  name: string;
  email: string;
}

export interface ApiInvoiceProperty {
  id: string;
  title: string;
}

export interface ApiInvoiceRoom {
  id: string;
  roomNumber: string;
}

export interface ApiInvoiceRoomOccupant {
  id: string;
  roomId: string;
  applicationId: string;
  paymentId: string;
  tenantId: string;
  movedInAt: string;
  movedOutAt: string | null;
  createdAt: string;
  updatedAt: string;
  room: ApiInvoiceRoom;
}

export interface ApiInvoicePayment {
  id: string;
  tenantId: string;
  applicationId: string | null;
  invoiceId: string;
  amount: string;
  paidAt: string;
  status: BackendPaymentStatus;
  paymentProvider: BackendPaymentProvider;
  merchantInvoiceNumber: string | null;
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

export interface ApiInvoice {
  id: string;
  roomOccupantId: string;
  tenantId: string;
  propertyId: string;
  billMonth: string;            // "2026-09"
  type: BackendInvoiceType;
  rentAmount: string;           // Decimal
  utilityAmount: string;        // Decimal
  totalAmount: string;          // Decimal
  utilityDetails: ApiUtilityDetail[];
  dueDate: string;
  status: BackendBillStatus;
  createdAt: string;
  updatedAt: string;

  tenant: ApiInvoiceTenant;
  property: ApiInvoiceProperty;
  roomOccupant: ApiInvoiceRoomOccupant;
  payment: ApiInvoicePayment | null;  // present only when paid
}

export interface InvoiceLineItemVM {
  label: string;
  amount: number;
}

export interface InvoiceCardVM {
  id: string;

  status: "issued" | "paid" | "overdue";
  statusRaw: BackendBillStatus;

  type: BackendInvoiceType;
  typeLabel: string;            // "Rent + utilities" | "Maintenance fee"

  billMonth: string;            // "Sep 2026"
  dueDate: string;              // formatted
  createdAt: string;            // formatted

  tenantName: string;
  tenantEmail: string;

  propertyTitle: string;
  roomNumber: string;

  lineItems: InvoiceLineItemVM[];
  rentAmount: number;
  utilityAmount: number;
  totalAmount: number;

  isPaid: boolean;
  paidAt: string | null;
  paymentProvider: BackendPaymentProvider | null;
}