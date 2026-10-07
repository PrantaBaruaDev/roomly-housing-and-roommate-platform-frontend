"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  flatWithRoomsSchema,
  type FlatWithRoomsValues,
} from "@/schemas/property.schema";
import { cn } from "@/lib/utils";

type RoomRow = {
  roomNumber: string;
  rentAmount: string;
  bookingMode: "BOOK_BY_ROOM" | "BOOK_BY_SEAT";
  maxCapacity: string;
};

const DEFAULT_ROOM: RoomRow = {
  roomNumber: "",
  rentAmount: "",
  bookingMode: "BOOK_BY_ROOM",
  maxCapacity: "1",
};

export function CreateFlatDialog({
  propertyId,
  onSubmit,
  isPending,
  trigger,
}: {
  propertyId: string;
  onSubmit: (values: FlatWithRoomsValues) => void;
  isPending?: boolean;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const [flatName, setFlatName] = useState("");
  const [floorNumber, setFloorNumber] = useState("0");
  const [rooms, setRooms] = useState<RoomRow[]>([{ ...DEFAULT_ROOM }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setFlatName("");
    setFloorNumber("0");
    setRooms([{ ...DEFAULT_ROOM }]);
    setErrors({});
  }

  function addRoom() {
    setRooms((prev) => [...prev, { ...DEFAULT_ROOM }]);
  }

  function removeRoom(index: number) {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRoom<K extends keyof RoomRow>(
    index: number,
    key: K,
    value: RoomRow[K],
  ) {
    setRooms((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)),
    );
  }

  function submit() {
    // Compose the payload in the exact shape the backend expects
    const candidate = {
      propertyId,
      flatName: flatName.trim(),
      floorNumber,
      rooms,
    };

    const result = flatWithRoomsSchema.safeParse(candidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
    setOpen(false);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add flat
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a flat with rooms</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          {/* Flat header */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="flatName">Flat name</Label>
              <Input
                id="flatName"
                placeholder="e.g. Sun Rise"
                value={flatName}
                onChange={(e) => setFlatName(e.target.value)}
              />
              {errors["flatName"] && (
                <p className="text-xs text-destructive">{errors["flatName"]}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="floorNumber">Floor</Label>
              <Input
                id="floorNumber"
                type="number"
                min={0}
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
              />
              {errors["floorNumber"] && (
                <p className="text-xs text-destructive">
                  {errors["floorNumber"]}
                </p>
              )}
            </div>
          </div>

          {/* Rooms header */}
          <div className="flex items-center justify-between">
            <Label>Rooms</Label>
            <span className="text-[11px] text-muted-foreground">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </span>
          </div>

          {errors["rooms"] && (
            <p className="text-xs text-destructive">{errors["rooms"]}</p>
          )}

          {/* Room rows */}
          <div className="flex flex-col gap-3">
            {rooms.map((room, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border border-border bg-secondary/20 p-3",
                )}
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
                      onChange={(e) =>
                        updateRoom(i, "roomNumber", e.target.value)
                      }
                    />
                    {errors[`rooms.${i}.roomNumber`] && (
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
                      onChange={(e) =>
                        updateRoom(i, "rentAmount", e.target.value)
                      }
                    />
                    {errors[`rooms.${i}.rentAmount`] && (
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
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="BOOK_BY_ROOM">
                        Whole room (BOOK_BY_ROOM)
                      </option>
                      <option value="BOOK_BY_SEAT">
                        Per seat (BOOK_BY_SEAT)
                      </option>
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
                      onChange={(e) =>
                        updateRoom(i, "maxCapacity", e.target.value)
                      }
                    />
                    {errors[`rooms.${i}.maxCapacity`] && (
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
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "Creating…" : "Create flat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}