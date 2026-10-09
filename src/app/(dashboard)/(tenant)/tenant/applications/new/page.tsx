"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, DoorOpen, Building2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePropertyInventory } from "@/hooks/use-rooms";
import { useSubmitApplication } from "@/hooks/use-applications";
import { toRoomBrowseVMs } from "@/lib/adapters/room";
import {
  applicationCreateSchema,
  type ApplicationCreateValues,
} from "@/schemas/application.schema";
import { formatCurrency } from "@/lib/utils";

function NewApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") ?? "";

  const { data, isLoading } = usePropertyInventory();
  const submit = useSubmitApplication();

  const allRooms = useMemo(
    () => (data ? toRoomBrowseVMs(data.data ?? []) : []),
    [data],
  );
  const room = useMemo(
    () => allRooms.find((r) => r.id === roomId),
    [allRooms, roomId],
  );

  const roomIdValue = room?.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicationCreateValues>({
    resolver: zodResolver(applicationCreateSchema) as any,
    defaultValues: {
      roomId,
      moveInDate: "",
      isPrivateLease: false,
      agreedRentAmount: 0,
    },
  });

  useEffect(() => {
    if (room) {
      setValue("agreedRentAmount", room.rent, { shouldValidate: false });
      setValue("roomId", room.id, { shouldValidate: true });
    }
  }, [roomIdValue, setValue]);

  const onSubmit = (values: ApplicationCreateValues) => {
    submit.mutate(values, {
      onSuccess: (created) => {
        router.push(`/tenant/applications/${created.id}`);
      },
    });
  };

  if (!isLoading && !room) {
    return (
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4" /> Back to browse
          </Link>
        </Button>
        <PageHeader title="Apply for a room" />
        <Card>
          <CardContent className="py-16 text-center">
            <DoorOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">Room not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This room may have been removed or is no longer available.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/browse">Browse other rooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/browse">
          <ArrowLeft className="h-4 w-4" /> Back to browse
        </Link>
      </Button>

      <PageHeader
        title="Apply for a room"
        description="Submit a rental application. The owner will review it and respond."
      />

      {/* Room summary */}
      {room && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              You&apos;re applying for
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="font-medium">{room.propertyTitle}</span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {room.propertyAddress}, {room.propertyCity}
              </span>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <DoorOpen className="h-4 w-4 shrink-0" />
              <span>
                Room {room.roomNumber} ·{" "}
                {formatCurrency(room.rent)}{" "}
                {room.bookingMode === "BOOK_BY_SEAT" ? "/ seat" : "/ month"}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Application details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="moveInDate">Move-in date</Label>
              <Input
                id="moveInDate"
                type="date"
                {...register("moveInDate")}
              />
              {errors.moveInDate && (
                <p className="text-xs text-destructive">
                  {errors.moveInDate.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="agreedRentAmount">Agreed rent (BDT)</Label>
              <Input
                id="agreedRentAmount"
                type="number"
                {...register("agreedRentAmount", { valueAsNumber: true })}
              />
              {errors.agreedRentAmount && (
                <p className="text-xs text-destructive">
                  {errors.agreedRentAmount.message}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Prefilled with the listed rent. Change it if you negotiated a
                different amount.
              </p>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                {...register("isPrivateLease")}
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <span>
                <span className="font-medium">
                  Request a private lease
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Only applies if this is a whole-room booking. The owner may
                  accept or decline this request.
                </span>
              </span>
            </label>

            {submit.isError && (
              <p className="text-sm text-destructive">
                {(submit.error as Error)?.message ??
                  "Failed to submit application."}
              </p>
            )}

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submit.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submit.isPending || !room}
              >
                {submit.isPending ? "Submitting…" : "Submit application"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense
      fallback={
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      }
    >
      <NewApplicationContent />
    </Suspense>
  );
}