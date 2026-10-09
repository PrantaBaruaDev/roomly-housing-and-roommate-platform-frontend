"use client";

import Link from "next/link";
import { MapPin, DoorOpen, Users, BedDouble, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { RoomBrowseVM } from "@/types/room";
import Image from "next/image";

export function PublicRoomCard({
  room,
  onApply,
  onRequestView,
}: {
  room: RoomBrowseVM;
  onApply: (roomId: string) => void;
  onRequestView: (roomId: string) => void;
}) {
  const isSeat = room.bookingMode === "BOOK_BY_SEAT";
  const seatsLeft = room.availableCapacity;

  return (
    <Card className="overflow-hidden">
      <Link href={`/browse/${room.id}`} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-blueprint/5 blueprint-grid">
          {room.imageUrl ? (
            <Image
              src={room.imageUrl}
              alt={room.propertyTitle}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="rounded-md border border-blueprint/20 bg-background px-2 py-1 font-mono-plan text-xs text-blueprint">
              {room.roomNumber}
            </span>
          )}
          {room.isVerified && (
            <Badge
              variant="outline"
              className="absolute right-2 top-2 border-moss/30 bg-background/90 text-moss backdrop-blur"
            >
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/browse/${room.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{room.propertyTitle}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {room.propertyAddress}, {room.propertyCity}
                </span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <DoorOpen className="h-3 w-3 shrink-0" />
                <span className="truncate">Room {room.roomNumber}</span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-lg leading-none">
                {formatCurrency(room.rent)}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {isSeat ? "per seat" : "per month"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {isSeat ? (
              <Badge variant="secondary" className="gap-1 font-normal">
                <Users className="h-3 w-3" /> {seatsLeft} seat
                {seatsLeft === 1 ? "" : "s"} free
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 font-normal">
                <Users className="h-3 w-3" /> Whole room
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1 font-normal">
              <BedDouble className="h-3 w-3" /> cap {room.maxCapacity}
            </Badge>
          </div>
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/browse/${room.id}`}>View details</Link>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRequestView(room.id)}
            >
              Request view
            </Button>
            <Button size="sm" onClick={() => onApply(room.id)}>
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}