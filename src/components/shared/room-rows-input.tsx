"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type RoomRow = {
  roomNumber: string;
  rentAmount: string;
  bookingMode: "BOOK_BY_ROOM" | "BOOK_BY_SEAT";
  maxCapacity: string;
};

export const DEFAULT_ROOM_ROW: RoomRow = {
  roomNumber: "",
  rentAmount: "",
  bookingMode: "BOOK_BY_ROOM",
  maxCapacity: "1",
};

export function RoomRowsInput({
  rooms,
  onChange,
  errors,
}: {
  rooms: RoomRow[];
  onChange: (rooms: RoomRow[]) => void;
  errors?: Record<string, string>;
}) {
  function addRoom() {
    onChange([...rooms, { ...DEFAULT_ROOM_ROW }]);
  }

  function removeRoom(index: number) {
    onChange(rooms.filter((_, i) => i !== index));
  }

  function updateRoom<K extends keyof RoomRow>(
    index: number,
    key: K,
    value: RoomRow[K],
  ) {
    onChange(
      rooms.map((r, i) => (i === index ? { ...r, [key]: value } : r)),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Rooms</Label>
        <span className="text-[11px] text-muted-foreground">
          {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
        </span>
      </div>

      {errors?.rooms && (
        <p className="text-xs text-destructive">{errors.rooms}</p>
      )}

      {rooms.map((room, i) => (
        <div
          key={i}
          className={cn("rounded-lg border border-border bg-secondary/20 p-3")}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
              Room #{i + 1}
            </span>
            {rooms.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeRoom(i)}
                aria-label="Remove room"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Room number
              </Label>
              <Input
                placeholder="e.g. F-A2-1"
                value={room.roomNumber}
                onChange={(e) => updateRoom(i, "roomNumber", e.target.value)}
              />
              {errors?.[`rooms.${i}.roomNumber`] && (
                <p className="text-xs text-destructive">
                  {errors[`rooms.${i}.roomNumber`]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Rent amount (BDT)
              </Label>
              <Input
                type="number"
                placeholder="7000"
                value={room.rentAmount}
                onChange={(e) => updateRoom(i, "rentAmount", e.target.value)}
              />
              {errors?.[`rooms.${i}.rentAmount`] && (
                <p className="text-xs text-destructive">
                  {errors[`rooms.${i}.rentAmount`]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Booking mode
              </Label>
              <select
                value={room.bookingMode}
                onChange={(e) =>
                  updateRoom(
                    i,
                    "bookingMode",
                    e.target.value as RoomRow["bookingMode"],
                  )
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="BOOK_BY_ROOM">Whole room</option>
                <option value="BOOK_BY_SEAT">Per seat</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                Max capacity
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="1"
                value={room.maxCapacity}
                onChange={(e) => updateRoom(i, "maxCapacity", e.target.value)}
              />
              {errors?.[`rooms.${i}.maxCapacity`] && (
                <p className="text-xs text-destructive">
                  {errors[`rooms.${i}.maxCapacity`]}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={addRoom}
      >
        <Plus className="h-4 w-4" /> Add another room
      </Button>
    </div>
  );
}