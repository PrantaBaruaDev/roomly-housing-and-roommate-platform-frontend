import type {
  ApiRoomOccupant,
  BackendPaymentStatus,
  RoomOccupantCardVM,
} from "@/types/room-occupant";
import { formatDate } from "@/lib/utils";

const PAYMENT_STATUS_MAP: Record<
  BackendPaymentStatus,
  RoomOccupantCardVM["paymentStatus"]
> = {
  COMPLETED: "paid",
  PENDING: "pending",
  FAILED: "failed",
  CANCEL: "refunded",
};

export function toRoomOccupantCardVM(
  occ: ApiRoomOccupant,
): RoomOccupantCardVM {
  const payment = occ.payment;

  return {
    id: occ.id,

    tenantName: occ.tenant?.name ?? "Unknown tenant",
    tenantEmail: occ.tenant?.email ?? "",

    roomNumber: occ.room?.roomNumber ?? "—",
    propertyTitle: occ.property?.title ?? "Unknown property",
    propertyLocation: [occ.property?.address, occ.property?.city]
      .filter(Boolean)
      .join(", "),
    propertyImage: occ.property?.propertyImage ?? null,
    bookingMode: occ.room?.bookingMode ?? "BOOK_BY_ROOM",

    rent: Number(occ.room?.rentAmount ?? 0),
    moveInDate: formatDate(occ.movedInAt),
    movedOutDate: occ.movedOutAt ? formatDate(occ.movedOutAt) : null,
    isActive: !occ.movedOutAt,

    paymentStatus: payment ? PAYMENT_STATUS_MAP[payment.status] : "pending",
    paymentStatusRaw: payment?.status ?? null,
    paymentProvider: payment?.paymentProvider ?? null,
    gatewayTransactionId: payment?.gatewayTransactionId ?? null,
    paidAt: payment?.paidAt ? formatDate(payment.paidAt) : null,
  };
}