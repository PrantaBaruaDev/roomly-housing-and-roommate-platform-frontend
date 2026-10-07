import type { ReactNode } from "react";
import { MapPin, DoorOpen, CalendarClock, Wallet, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { ViewRequestCardVM } from "@/types/view-request";

export function ViewRequestCard({
  request,
  viewerRole = "tenant",
  actions,
}: {
  request: ViewRequestCardVM;
  viewerRole?: "tenant" | "owner" | "admin";
  actions?: ReactNode;
}) {
  const showCounter =
    request.status === "countered" && request.counterDate;

  const counterparty =
    viewerRole === "tenant"
      ? { label: "Owner", name: request.ownerName }
      : { label: "Tenant", name: request.tenantName };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {/* Row 1 — property + status */}
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{request.propertyTitle}</p>
            <StatusBadge status={request.status} />
          </div>

          {/* Row 2 — location */}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{request.propertyLocation}</span>
          </p>

          {/* Row 3 — room + rent */}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <DoorOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">Room {request.roomNumber}</span>
            <span>·</span>
            <Wallet className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">
              {formatCurrency(request.rent)}
            </span>
          </p>

          {/* Row 4 — counterparty */}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3 shrink-0" />
            <span>
              {counterparty.label}: {counterparty.name}
            </span>
          </p>

          {/* Proposed / counter dates */}
          <div className="mt-3 flex flex-col gap-1 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CalendarClock className="h-3 w-3" />
              {showCounter
                ? `You proposed ${request.proposedDate}`
                : `Proposed ${request.proposedDate}`}
            </span>
            {showCounter && (
              <span className="flex items-center gap-1 text-brass">
                <CalendarClock className="h-3 w-3" />
                Owner proposed {request.counterDate}
              </span>
            )}
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            Requested {request.requestedAt}
          </p>
        </div>

        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}