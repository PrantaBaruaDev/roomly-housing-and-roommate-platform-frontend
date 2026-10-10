"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Home, Store, X } from "lucide-react";
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
import { useUpdateProperty } from "@/hooks/use-properties";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/schemas/property.schema";
import { cn } from "@/lib/utils";

type PropertyType = PropertyFormValues["propertyType"];

const TYPE_OPTIONS: {
  value: PropertyType;
  label: string;
  hint: string;
  icon: typeof Home;
}[] = [
  {
    value: "RESIDENTIAL",
    label: "Residential",
    hint: "Homes, flats, apartments",
    icon: Home,
  },
  {
    value: "COMMERCIAL",
    label: "Commercial",
    hint: "Offices, shops, workspaces",
    icon: Store,
  },
  {
    value: "MIXED",
    label: "Mixed use",
    hint: "Residential + commercial",
    icon: Building2,
  },
];

export interface EditableProperty {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  propertyType?: PropertyType;
  amenities?: string[];
}

export function EditPropertyDialog({
  property,
  open,
  onOpenChange,
}: {
  property: EditableProperty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useUpdateProperty();
  const [amenityInput, setAmenityInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      propertyType: "RESIDENTIAL",
      amenities: [],
    },
  });

  // Prefill when the dialog opens for a property
  useEffect(() => {
    if (property && open) {
      reset({
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        propertyType: property.propertyType ?? "RESIDENTIAL",
        amenities: property.amenities ?? [],
      });
      setAmenityInput("");
    }
  }, [property, open, reset]);

  const amenities = watch("amenities") ?? [];

  function addAmenity() {
    const next = amenityInput.trim();
    if (!next || amenities.includes(next)) {
      setAmenityInput("");
      return;
    }
    setValue("amenities", [...amenities, next], { shouldValidate: true });
    setAmenityInput("");
  }

  function removeAmenity(name: string) {
    setValue(
      "amenities",
      amenities.filter((a) => a !== name),
      { shouldValidate: true },
    );
  }

  const onSubmit = (values: PropertyFormValues) => {
    if (!property) return;
    update.mutate(
      { id: property.id, ...values },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!update.isPending) onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title">Property name</Label>
            <Input id="edit-title" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <textarea
              id="edit-description"
              rows={3}
              {...register("description")}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-address">Street address</Label>
              <Input id="edit-address" {...register("address")} />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-city">City</Label>
              <Input id="edit-city" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Property type</Label>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = field.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={cn(
                          "flex flex-col items-start gap-1.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                          active
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-secondary",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span className="text-xs font-medium">{opt.label}</span>
                        <span className="text-[10px] leading-tight text-muted-foreground">
                          {opt.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-amenity">Amenities</Label>
            <div className="flex gap-2">
              <Input
                id="edit-amenity"
                placeholder="e.g. Balcony, Furnished"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAmenity}
                disabled={!amenityInput.trim()}
              >
                Add
              </Button>
            </div>

            {amenities.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeAmenity(a)}
                      aria-label={`Remove ${a}`}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {update.isError && (
            <p className="text-sm text-destructive">
              {(update.error as Error)?.message ?? "Failed to update property."}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={update.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}