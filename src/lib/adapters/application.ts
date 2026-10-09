import type {
  ApiApplication,
  ApplicationCardVM,
  ApplicationDetailVM,
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


export function toApplicationDetailVM(app: ApiApplication): ApplicationDetailVM {
  const payments = (app.payments ?? []).map((p) => ({
    id: p.id,
    amount: Number(p.amount),
    status: p.status,
    paidAt: p.paidAt ? formatDate(p.paidAt) : null,
    provider: p.paymentProvider,
  }));

  const completed = app.payments?.find((p) => p.status === "COMPLETED");

  return {
    id: app.id,
    status: app.status,
    statusKey: STATUS_MAP[app.status] ?? "PENDING",

    tenantId: app.tenant?.id ?? "",
    tenantName: app.tenant?.name ?? "Unknown tenant",
    tenantEmail: app.tenant?.email ?? "",

    ownerId: app.room?.property?.owner?.id ?? "",
    ownerName: app.room?.property?.owner?.name ?? "Unknown owner",
    ownerEmail: app.room?.property?.owner?.email ?? "",

    propertyId: app.room?.property?.id ?? "",
    propertyTitle: app.room?.property?.title ?? "Unknown property",
    propertyLocation: [
      app.room?.property?.address,
      app.room?.property?.city,
    ]
      .filter(Boolean)
      .join(", "),
    roomId: app.roomId,
    roomNumber: app.room?.roomNumber ?? "—",
    roomRent: Number(app.room?.rentAmount ?? 0),
    bookingMode: app.room?.bookingMode ?? "BOOK_BY_ROOM",
    maxCapacity: app.room?.maxCapacity ?? 1,

    moveInDate: formatDate(app.moveInDate),
    isPrivateLease: app.isPrivateLease,
    agreedRent: Number(app.agreedRentAmount),
    ownerFeedback: app.ownerFeedback,
    createdAt: formatDate(app.createdAt),
    updatedAt: formatDate(app.updatedAt),

    payments,
    hasCompletedPayment: Boolean(completed),
    completedPaymentId: completed?.id ?? null,
  };
}