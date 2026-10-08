"use client";

import {
  MapPin,
  DoorOpen,
  CalendarDays,
  Wallet,
  User,
  Home,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, initials } from "@/lib/utils";
import type { RoomOccupantCardVM } from "@/types/room-occupant";
import { CopyableId } from "./copyable-id";

export function RoomOccupantCard({
  occupant,
  viewerRole = "owner",
}: {
  occupant: RoomOccupantCardVM;
  viewerRole?: "owner" | "admin";
}) {
  const isSeat = occupant.bookingMode === "BOOK_BY_SEAT";

  return (
    <Card>
      <CardHeader className="flex-row items-start space-y-0 pb-3">
        <div className="flex items-center justify-between border-b border-border py-3 mb-2">
          <CopyableId id={occupant.id} label="ID" />
        </div>
        <div className="mt-3 flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={undefined} alt={occupant.tenantName} />
              <AvatarFallback>{initials(occupant.tenantName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{occupant.tenantName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {occupant.tenantEmail}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Badge
              variant="outline"
              className={
                occupant.isActive
                  ? "border-moss/30 bg-moss/10 text-moss"
                  : "border-border text-muted-foreground"
              }
            >
              {occupant.isActive ? "Active" : "Moved out"}
            </Badge>
            {occupant.paymentStatus === "paid" && <StatusBadge status="paid" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">


        {/* Room + property */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <Home className="h-3 w-3 shrink-0" />
            <span className="truncate">{occupant.propertyTitle}</span>
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{occupant.propertyLocation}</span>
          </p>
          <p className="flex items-center gap-1">
            <DoorOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">
              Room {occupant.roomNumber}
              {isSeat ? " · per seat" : ""}
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col gap-1 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wallet className="h-3 w-3" />
              <span className="font-medium text-foreground">
                {formatCurrency(occupant.rent)}
              </span>
              <span>/ month</span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              Moved in {occupant.moveInDate}
              {occupant.movedOutDate && ` · out ${occupant.movedOutDate}`}
            </span>
          </div>

          {occupant.paidAt && occupant.paymentProvider && (
            <div className="flex flex-col items-end gap-0.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Receipt className="h-3 w-3" />
                Paid {occupant.paidAt}
              </span>
              <span>
                via {occupant.paymentProvider === "BKASH" ? "bKash" : "Card"}
              </span>
              {occupant.gatewayTransactionId && (
                <span className="font-mono-plan text-[10px]">
                  {occupant.gatewayTransactionId}
                </span>
              )}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}