"use client";

import { useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Home, Store, Plus, X } from "lucide-react";
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
import { useCreateProperty } from "@/hooks/use-properties";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/schemas/property.schema";
import { cn } from "@/lib/utils";
import { z } from "zod";

type PropertyFormOutput = z.output<typeof propertySchema>;
type PropertyType = PropertyFormValues["propertyType"];

const TYPE_OPTIONS: {
  value: PropertyType;
  label: string;
  hint: string;
  icon: typeof Home;
}[] = [
  { value: "RESIDENTIAL", label: "Residential", hint: "Homes, flats, apartments", icon: Home },
  { value: "COMMERCIAL", label: "Commercial", hint: "Offices, shops, workspaces", icon: Store },
  { value: "MIXED", label: "Mixed use", hint: "Combined residential + commercial", icon: Building2 },
];

export function CreatePropertyDialog({ trigger }: { trigger?: ReactNode }) {
  const create = useCreateProperty();
  const [open, setOpen] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFormOutput>({
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
    create.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          reset();
          setAmenityInput("");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add property
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a new property</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Property name</Label>
            <Input
              id="title"
              placeholder="e.g. Riverside 2BR Flat in Khulna"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="What makes this place a good fit?"
              {...register("description")}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Street address</Label>
              <Input
                id="address"
                placeholder="72 KDA Avenue, Mojgunni"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Khulna" {...register("city")} />
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
            <Label htmlFor="amenity">Amenities</Label>
            <div className="flex gap-2">
              <Input
                id="amenity"
                placeholder="e.g. Balcony, Furnished, Wi-Fi"
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

          {create.isError && (
            <p className="text-sm text-destructive">
              {(create.error as Error).message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}