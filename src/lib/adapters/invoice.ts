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
  // "2026-09" → "Sep 2026"
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function toInvoiceCardVM(inv: ApiInvoice): InvoiceCardVM {
  const utilityDetails = inv.utilityDetails ?? [];
  const rent = Number(inv.rentAmount);
  const utility = Number(inv.utilityAmount);

  const lineItems = [
    { label: "Room rent", amount: rent },
    ...utilityDetails.map((u) => ({ label: u.name, amount: u.amount })),
  ];

  const payment = inv.payment;

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

    lineItems,
    rentAmount: rent,
    utilityAmount: utility,
    totalAmount: Number(inv.totalAmount),

    isPaid: inv.status === "PAID" && Boolean(payment),
    paidAt: payment?.paidAt ? formatDate(payment.paidAt) : null,
    paymentProvider: payment?.paymentProvider ?? null,
  };
}