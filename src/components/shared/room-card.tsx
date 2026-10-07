"use client";

import { DoorOpen, Trash2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { RoomCardVM } from "@/types/room";

export function RoomCard({
  room,
  onEdit,
  onDelete,
  isMutating,
}: {
  room: RoomCardVM;
  onEdit?: (room: RoomCardVM) => void;
  onDelete?: (room: RoomCardVM) => void;
  isMutating?: boolean;
}) {
  const isSeat = room.bookingMode === "BOOK_BY_SEAT";

  return (
    <Card
      className={cn(
        "transition-colors",
        !room.isAvailable && "border-border/60 bg-secondary/20",
      )}
    >
      <CardContent className="p-4">
        {/* Header — room number + availability */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-mono-plan text-sm text-foreground">
              {room.roomNumber}
            </p>
            <p className="mt-1 font-display text-lg leading-none">
              {formatCurrency(room.rent)}
              <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                {isSeat ? "/ seat" : "/ month"}
              </span>
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              room.isAvailable
                ? "border-moss/30 bg-moss/10 text-moss"
                : "border-border text-muted-foreground"
            }
          >
            {room.isAvailable ? "Available" : "Full"}
          </Badge>
        </div>

        {/* Booking mode */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            <DoorOpen className="mr-1 h-3 w-3" />
            {isSeat ? "Per seat" : "Whole room"}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {room.maxCapacity} {room.maxCapacity === 1 ? "seat" : "seats"}
          </Badge>
        </div>

        {/* Occupancy */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                room.occupancyPct >= 100
                  ? "bg-destructive"
                  : room.occupancyPct > 0
                    ? "bg-blueprint"
                    : "bg-transparent",
              )}
              style={{ width: `${room.occupancyPct}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {room.occupied}/{room.maxCapacity}
          </span>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="mt-3 flex justify-end gap-1 border-t border-border pt-3">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => onEdit(room)}
                disabled={isMutating}
              >
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(room)}
                disabled={isMutating}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}