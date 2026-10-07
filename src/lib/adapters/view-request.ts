import type {
  ApiViewRequest,
  ViewRequestCardVM,
  BackendViewRequestStatus,
} from "@/types/view-request";
import { formatDate } from "@/lib/utils";

const STATUS_MAP: Record<
  BackendViewRequestStatus,
  ViewRequestCardVM["status"]
> = {
  PENDING: "requested",
  OWNER_RESCHEDULED: "countered",
  APPROVED: "confirmed",
  REJECTED: "declined",
};

export function toViewRequestCardVM(r: ApiViewRequest): ViewRequestCardVM {
  return {
    id: r.id,

    status: STATUS_MAP[r.status] ?? "requested",
    statusRaw: r.status,

    propertyTitle: r.property?.title ?? "Unknown property",
    propertyLocation: [r.property?.address, r.property?.city]
      .filter(Boolean)
      .join(", "),

    roomNumber: r.room?.roomNumber ?? "—",
    rent: Number(r.room?.rentAmount ?? 0),

    tenantName: r.tenant?.name ?? "Unknown tenant",
    tenantEmail: r.tenant?.email ?? "",
    ownerName: r.owner?.name ?? "Unknown owner",
    ownerEmail: r.owner?.email ?? "",

    proposedDate: formatDate(r.proposedDate),
    counterDate: r.counterDate,
    requestedAt: formatDate(r.createdAt),
  };
}