"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { editRoomSchema, type EditRoomValues } from "@/schemas/property.schema";
import type { RoomCardVM } from "@/types/room";

export function EditRoomDialog({
  room,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  room: RoomCardVM | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EditRoomValues) => void;
  isPending?: boolean;
}) {
  const [values, setValues] = useState({
    roomNumber: "",
    rentAmount: "",
    bookingMode: "BOOK_BY_ROOM" as RoomCardVM["bookingMode"],
    maxCapacity: "1",
    isAvailable: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (room && open) {
      setValues({
        roomNumber: room.roomNumber,
        rentAmount: String(room.rent),
        bookingMode: room.bookingMode,
        maxCapacity: String(room.maxCapacity),
        isAvailable: room.isAvailable,
      });
      setErrors({});
    }
  }, [room, open]);

  function submit() {
    const result = editRoomSchema.safeParse({
      roomNumber: values.roomNumber.trim(),
      rentAmount: values.rentAmount,
      bookingMode: values.bookingMode,
      maxCapacity: values.maxCapacity,
      isAvailable: values.isAvailable,
    });

    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit room</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roomNumber">Room number</Label>
            <Input
              id="roomNumber"
              value={values.roomNumber}
              onChange={(e) =>
                setValues((v) => ({ ...v, roomNumber: e.target.value }))
              }
            />
            {errors.roomNumber && (
              <p className="text-xs text-destructive">{errors.roomNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rentAmount">Rent (BDT)</Label>
              <Input
                id="rentAmount"
                type="number"
                value={values.rentAmount}
                onChange={(e) =>
                  setValues((v) => ({ ...v, rentAmount: e.target.value }))
                }
              />
              {errors.rentAmount && (
                <p className="text-xs text-destructive">{errors.rentAmount}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maxCapacity">Max capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                min={1}
                value={values.maxCapacity}
                onChange={(e) =>
                  setValues((v) => ({ ...v, maxCapacity: e.target.value }))
                }
              />
              {errors.maxCapacity && (
                <p className="text-xs text-destructive">{errors.maxCapacity}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bookingMode">Booking mode</Label>
            <select
              id="bookingMode"
              value={values.bookingMode}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  bookingMode: e.target.value as RoomCardVM["bookingMode"],
                }))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="BOOK_BY_ROOM">Whole room</option>
              <option value="BOOK_BY_SEAT">Per seat</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isAvailable}
              onChange={(e) =>
                setValues((v) => ({ ...v, isAvailable: e.target.checked }))
              }
              className="h-4 w-4 rounded border-input"
            />
            Room is available for booking
          </label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}