"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { z } from "zod";
type FlatFormOutput = z.output<typeof flatWithRoomsSchema>;

const DEFAULT_ROOM = {
  roomNumber: "",
  rentAmount: "" as unknown as number,
  bookingMode: "BOOK_BY_ROOM" as const,
  maxCapacity: 1,
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

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlatFormOutput>({
    resolver: zodResolver(flatWithRoomsSchema) as any,
    defaultValues: {
      propertyId,
      flatName: "",
      floorNumber: 0,
      rooms: [
        { roomNumber: "", rentAmount: 0, bookingMode: "BOOK_BY_ROOM", maxCapacity: 1 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const submit = (values: FlatWithRoomsValues) => {
    onSubmit(values);
    setOpen(false);
    reset();
  };

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

        <form onSubmit={handleSubmit(submit)}>
          <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="flatName">Flat name</Label>
                <Input
                  id="flatName"
                  placeholder="e.g. Sun Rise"
                  {...register("flatName")}
                />
                {errors.flatName && (
                  <p className="text-xs text-destructive">
                    {errors.flatName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="floorNumber">Floor</Label>
                <Input
                  id="floorNumber"
                  type="number"
                  min={0}
                  {...register("floorNumber")}
                />
                {errors.floorNumber && (
                  <p className="text-xs text-destructive">
                    {errors.floorNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Rooms</Label>
              <span className="text-[11px] text-muted-foreground">
                {fields.length} {fields.length === 1 ? "room" : "rooms"}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {fields.map((field, i) => {
                const roomErrors = errors.rooms?.[i];
                return (
                  <div
                    key={field.id}
                    className="rounded-lg border border-border bg-secondary/20 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
                        Room #{i + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => remove(i)}
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
                          {...register(`rooms.${i}.roomNumber` as const)}
                        />
                        {roomErrors?.roomNumber && (
                          <p className="text-xs text-destructive">
                            {roomErrors.roomNumber.message}
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
                          {...register(`rooms.${i}.rentAmount` as const)}
                        />
                        {roomErrors?.rentAmount && (
                          <p className="text-xs text-destructive">
                            {roomErrors.rentAmount.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">
                          Booking mode
                        </Label>
                        <select
                          {...register(`rooms.${i}.bookingMode` as const)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                          {...register(`rooms.${i}.maxCapacity` as const)}
                        />
                        {roomErrors?.maxCapacity && (
                          <p className="text-xs text-destructive">
                            {roomErrors.maxCapacity.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => append(DEFAULT_ROOM)}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create flat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}