"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RoomRowsInput,
  DEFAULT_ROOM_ROW,
  type RoomRow,
} from "@/components/shared/room-rows-input";
import { addRoomsSchema, type AddRoomsValues } from "@/schemas/property.schema";
import type { FlatSectionVM } from "@/types/room";

export function AddRoomsDialog({
  flat,
  open,
  onOpenChange,
  onSubmit,
  isPending,
  trigger,
}: {
  flat: FlatSectionVM | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddRoomsValues) => void;
  isPending?: boolean;
  trigger?: React.ReactNode;
}) {
  const [rooms, setRooms] = useState<RoomRow[]>([{ ...DEFAULT_ROOM_ROW }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset whenever the dialog opens for a different flat
  useEffect(() => {
    if (open) {
      setRooms([{ ...DEFAULT_ROOM_ROW }]);
      setErrors({});
    }
  }, [open, flat?.id]);

  function submit() {
    if (!flat) return;

    const result = addRoomsSchema.safeParse({
      flatId: flat.id,
      rooms,
    });

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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add rooms to {flat?.flatName ?? "flat"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          <RoomRowsInput rooms={rooms} onChange={setRooms} errors={errors} />
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
            {isPending ? "Adding…" : "Add rooms"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}