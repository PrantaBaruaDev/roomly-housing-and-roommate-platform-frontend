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

export interface ViewRequestDetailVM {
  id: string;

  status: ViewRequestCardVM["status"];
  statusRaw: string;

  /* Property */
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;

  /* Room */
  roomId: string;
  roomNumber: string;
  rent: number;

  /* People */
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;

  /* Dates */
  proposedDate: string;
  counterDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toViewRequestDetailVM(
  r: ApiViewRequest,
): ViewRequestDetailVM {
  return {
    id: r.id,

    status: STATUS_MAP[r.status] ?? "requested",
    statusRaw: r.status,

    propertyId: r.property?.id ?? "",
    propertyTitle: r.property?.title ?? "Unknown property",
    propertyAddress: r.property?.address ?? "",
    propertyCity: r.property?.city ?? "",

    roomId: r.room?.id ?? "",
    roomNumber: r.room?.roomNumber ?? "—",
    rent: Number(r.room?.rentAmount ?? 0),

    tenantId: r.tenant?.id ?? "",
    tenantName: r.tenant?.name ?? "Unknown tenant",
    tenantEmail: r.tenant?.email ?? "",
    ownerId: r.owner?.id ?? "",
    ownerName: r.owner?.name ?? "Unknown owner",
    ownerEmail: r.owner?.email ?? "",

    proposedDate: formatDate(r.proposedDate),
    counterDate: r.counterDate ? formatDate(r.counterDate) : null,
    createdAt: formatDate(r.createdAt),
    updatedAt: formatDate(r.updatedAt),
  };
}