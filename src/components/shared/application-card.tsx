import type { ReactNode } from "react";
import { MapPin, DoorOpen, CalendarDays, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, initials } from "@/lib/utils";
import type { ApplicationCardVM } from "@/types/application";

export function ApplicationCard({
  app,
  actions,
}: {
  app: ApplicationCardVM;
  actions?: ReactNode;
}) {
  const isPrivate = app.isPrivateLease;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <Avatar>
            <AvatarFallback>{initials(app.tenantName)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            {/* Row 1 — tenant + status */}
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{app.tenantName}</p>
              <StatusBadge status={app.status} />
              {app.isPaid && (
                <StatusBadge status="paid" />
              )}
              {isPrivate && (
                <Badge variant="outline" className="font-normal">
                  Private lease
                </Badge>
              )}
            </div>

            {/* Row 2 — property + room */}
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <DoorOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {app.propertyTitle} · Room {app.roomNumber}
              </span>
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{app.propertyLocation}</span>
            </p>

            {/* Row 3 — numbers */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Wallet className="h-3 w-3" />
                <span className="font-medium text-foreground">
                  {formatCurrency(app.agreedRent)}
                </span>
                <span>/ month</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                Move-in {app.moveInDate}
              </span>
              {app.bookingMode === "BOOK_BY_SEAT" && (
                <span className="text-muted-foreground">Seat booking</span>
              )}
            </div>

            {/* Owner feedback — only if present */}
            {app.ownerFeedback && (
              <p className="mt-3 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Owner note:</span>{" "}
                {app.ownerFeedback}
              </p>
            )}

            {/* Payment summary when paid */}
            {app.isPaid && app.paidAmount && app.paidAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Paid {formatCurrency(app.paidAmount)} via{" "}
                {app.paymentProvider === "BKASH" ? "bKash" : "Card"} on{" "}
                {app.paidAt.slice(0, 10)}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}