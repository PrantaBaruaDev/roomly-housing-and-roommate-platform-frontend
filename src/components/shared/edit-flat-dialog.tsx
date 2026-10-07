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
import { editFlatSchema, type EditFlatValues } from "@/schemas/property.schema";
import type { FlatSectionVM } from "@/types/room";

export function EditFlatDialog({
  flat,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  flat: FlatSectionVM | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EditFlatValues) => void;
  isPending?: boolean;
}) {
  const [values, setValues] = useState({
    flatName: "",
    floorNumber: "0",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (flat && open) {
      setValues({
        flatName: flat.flatName,
        floorNumber: String(flat.floorNumber),
      });
      setErrors({});
    }
  }, [flat, open]);

  function submit() {
    const result = editFlatSchema.safeParse({
      flatName: values.flatName.trim(),
      floorNumber: values.floorNumber,
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
          <DialogTitle>Edit flat</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flatName">Flat name</Label>
            <Input
              id="flatName"
              placeholder="e.g. Sun Rise"
              value={values.flatName}
              onChange={(e) =>
                setValues((v) => ({ ...v, flatName: e.target.value }))
              }
            />
            {errors.flatName && (
              <p className="text-xs text-destructive">{errors.flatName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="floorNumber">Floor</Label>
            <Input
              id="floorNumber"
              type="number"
              min={0}
              value={values.floorNumber}
              onChange={(e) =>
                setValues((v) => ({ ...v, floorNumber: e.target.value }))
              }
            />
            {errors.floorNumber && (
              <p className="text-xs text-destructive">{errors.floorNumber}</p>
            )}
          </div>
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