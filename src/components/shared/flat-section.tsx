"use client";

import { Building2, Layers, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoomCard } from "@/components/shared/room-card";
import type { FlatSectionVM, RoomCardVM } from "@/types/room";

export function FlatSection({
  flat,
  onEditRoom,
  onDeleteRoom,
  onAddRooms,
  onEditFlat,
  isMutating,
}: {
  flat: FlatSectionVM;
  onEditRoom?: (room: RoomCardVM) => void;
  onDeleteRoom?: (room: RoomCardVM) => void;
  onAddRooms?: (flat: FlatSectionVM) => void;
  onEditFlat?: (flat: FlatSectionVM) => void;
  isMutating?: boolean;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="truncate text-sm font-medium">{flat.flatName}</p>
            <Badge variant="outline" className="font-normal">
              <Layers className="mr-1 h-3 w-3" /> Floor {flat.floorNumber}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {flat.roomCount} {flat.roomCount === 1 ? "room" : "rooms"} ·{" "}
            {flat.availableRoomCount} available
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          {onEditFlat && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditFlat(flat)}
              disabled={isMutating}
              aria-label="Edit flat"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onAddRooms && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddRooms(flat)}
              disabled={isMutating}
            >
              Add rooms
            </Button>
          )}
        </div>
      </header>

      {/* Rooms grid */}
      <div className="p-4">
        {flat.rooms.length === 0 ? (
          <div className="rounded-md border border-dashed border-border py-10 text-center">
            <p className="text-xs text-muted-foreground">
              No rooms in this flat yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {flat.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={onEditRoom}
                onDelete={onDeleteRoom}
                isMutating={isMutating}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}