import type {
  ApiInvoice,
  BackendBillStatus,
  BackendInvoiceType,
  InvoiceCardVM,
} from "@/types/invoice";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<BackendBillStatus, InvoiceCardVM["status"]> = {
  UNPAID: "issued",
  PAID: "paid",
  OVERDUE: "overdue",
};

const TYPE_LABEL: Record<BackendInvoiceType, string> = {
  COMBINED_RENT_UTILITY: "Rent + utilities",
  MAINTENANCE_FEE: "Maintenance fee",
};

function formatBillMonth(ym: string): string {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function extractPayerAccount(
  gatewayResponse: Record<string, unknown> | null | undefined,
): string | null {
  if (!gatewayResponse) return null;
  const acct = gatewayResponse.payerAccount ?? gatewayResponse.customerMsisdn;
  return typeof acct === "string" ? acct : null;
}

export function toInvoiceCardVM(inv: ApiInvoice): InvoiceCardVM {
  const utilityDetails = inv.utilityDetails ?? [];
  const rent = Number(inv.rentAmount);

  const lineItems = [
    { label: "Room rent", amount: rent },
    ...utilityDetails.map((u) => ({ label: u.name, amount: u.amount })),
  ];

  const payment = inv.payment;
  const isPaid = inv.status === "PAID" && Boolean(payment);

  return {
    id: inv.id,

    status: STATUS_MAP[inv.status] ?? "issued",
    statusRaw: inv.status,

    type: inv.type,
    typeLabel: TYPE_LABEL[inv.type] ?? inv.type,

    billMonth: formatBillMonth(inv.billMonth),
    dueDate: formatDate(inv.dueDate),
    createdAt: formatDate(inv.createdAt),

    tenantName: inv.tenant?.name ?? "Unknown tenant",
    tenantEmail: inv.tenant?.email ?? "",

    propertyTitle: inv.property?.title ?? "Unknown property",
    roomNumber: inv.roomOccupant?.room?.roomNumber ?? "—",
    bookingMode: "BOOK_BY_ROOM",
    movedInAt: inv.roomOccupant?.movedInAt
      ? formatDate(inv.roomOccupant.movedInAt)
      : null,

    lineItems,
    rentAmount: rent,
    utilityAmount: Number(inv.utilityAmount),
    totalAmount: Number(inv.totalAmount),

    isPaid,
    paidAt: isPaid && payment ? formatDate(payment.paidAt) : null,
    paymentProvider: payment?.paymentProvider ?? null,

    payment: payment
      ? {
          status: payment.status,
          provider: payment.paymentProvider,
          amount: Number(payment.amount),
          paidAt: formatDate(payment.paidAt),
          gatewayPaymentId: payment.gatewayPaymentId,
          gatewayTransactionId: payment.gatewayTransactionId,
          payerReference: payment.payerReference,
          payerAccount: extractPayerAccount(payment.gatewayResponse),
          isRefunded: Boolean(payment.refundedAt),
          refundAmount: payment.refundAmount
            ? Number(payment.refundAmount)
            : null,
          refundReason: payment.refundReason,
        }
      : null,
  };
}