import type {
  ApiPayment,
  BackendPaymentProvider,
  BackendPaymentStatus,
  PaymentRowVM,
} from "@/types/payment";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<BackendPaymentStatus, PaymentRowVM["status"]> = {
  PENDING: "pending",
  COMPLETED: "paid",
  CANCEL: "cancelled",
  FAILED: "failed",
};

const PROVIDER_LABEL: Record<BackendPaymentProvider, string> = {
  BKASH: "bKash",
  CARD: "Card",
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

export function toPaymentRowVM(p: ApiPayment): PaymentRowVM {
  const hasInvoice = Boolean(p.invoice || p.invoiceId);
  const hasApplication = Boolean(p.application || p.applicationId);

  const purpose: PaymentRowVM["purpose"] = hasInvoice
    ? "invoice"
    : hasApplication
      ? "application"
      : "unknown";

  const referenceId = p.invoiceId ?? p.applicationId ?? null;

  let referenceLabel: string | null = null;
  let propertyTitle: string | null = null;

  if (p.invoice) {
    referenceLabel = formatBillMonth(p.invoice.billMonth);
  } else if (p.application?.room) {
    referenceLabel = `Room ${p.application.room.roomNumber}`;
    propertyTitle = p.application.room.property.title;
  }

  return {
    id: p.id,

    amount: Number(p.amount),
    status: STATUS_MAP[p.status] ?? "pending",
    statusRaw: p.status,
    provider: p.paymentProvider,
    providerLabel: PROVIDER_LABEL[p.paymentProvider] ?? p.paymentProvider,

    purpose,
    referenceId,
    referenceLabel,
    propertyTitle,

    createdAt: formatDate(p.createdAt),
    paidAt: p.paidAt ? formatDate(p.paidAt) : null,

    gatewayPaymentId: p.gatewayPaymentId,
    gatewayTransactionId: p.gatewayTransactionId,
    payerReference: p.payerReference,

    isRefunded: Boolean(p.refundedAt),
    refundAmount: p.refundAmount ? Number(p.refundAmount) : null,
    refundReason: p.refundReason,

    tenantName: p.tenant?.name ?? null,
    tenantEmail: p.tenant?.email ?? null,
  };
}