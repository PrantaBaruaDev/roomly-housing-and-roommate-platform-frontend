import type {
  ApiApplication,
  ApplicationCardVM,
  BackendApplicationStatus,
} from "@/types/application";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<
  BackendApplicationStatus,
  ApplicationCardVM["status"]
> = {
  PENDING: "PENDING",
  APPROVED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "REJECTED",
};

export function toApplicationCardVM(app: ApiApplication): ApplicationCardVM {
  const payments = app.payments ?? [];
  const successful = payments.find((p) => p.status === "COMPLETED");
  const latest = payments[payments.length - 1] ?? null;

  return {
    id: app.id,

    status: STATUS_MAP[app.status] ?? "pending",
    statusRaw: app.status,

    tenantName: app.tenant?.name ?? "Unknown tenant",
    tenantEmail: app.tenant?.email ?? "",

    propertyTitle: app.room?.property?.title ?? "Unknown property",
    propertyLocation: [
      app.room?.property?.address,
      app.room?.property?.city,
    ]
      .filter(Boolean)
      .join(", "),

    roomNumber: app.room?.roomNumber ?? "—",
    bookingMode: app.room?.bookingMode ?? "BOOK_BY_ROOM",

    agreedRent: Number(app.agreedRentAmount),
    moveInDate: formatDate(app.moveInDate),
    isPrivateLease: app.isPrivateLease,
    ownerFeedback: app.ownerFeedback,

    isPaid: Boolean(successful),
    paidAmount: successful ? Number(successful.amount) : null,
    paidAt: successful?.paidAt ?? null,
    paymentProvider: successful?.paymentProvider ?? null,
    lastPaymentStatus: latest?.status ?? null,
  };
}