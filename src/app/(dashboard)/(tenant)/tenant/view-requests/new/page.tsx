"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarClock,
  Building2,
  MapPin,
  DoorOpen,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePropertyInventory } from "@/hooks/use-rooms";
import { useCreateViewRequest } from "@/hooks/use-view-requests";
import { toRoomBrowseVMs } from "@/lib/adapters/room";
import {
  viewRequestSchema,
  type ViewRequestFormValues,
} from "@/schemas/application.schema";
import { formatCurrency } from "@/lib/utils";

function NewViewRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") ?? "";

  const { data, isLoading } = usePropertyInventory();
  const create = useCreateViewRequest();

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
  } = useForm<ViewRequestFormValues>({
    resolver: zodResolver(viewRequestSchema) as any,
    defaultValues: {
      roomId,
      proposedDate: "",
    },
  });

  useEffect(() => {
    if (room) {
      setValue("roomId", room.id, { shouldValidate: true });
    }
  }, [roomIdValue, setValue]);

  const onSubmit = (values: ViewRequestFormValues) => {
    const payload = {
      roomId: values.roomId,
      proposedDate: new Date(values.proposedDate).toISOString(),
    };
    create.mutate(payload, {
      onSuccess: (created) => {
        router.push(`/tenant/view-requests/${created.id}`);
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
        <PageHeader title="Request a viewing" />
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
        <Link href={`/browse/${roomId}`}>
          <ArrowLeft className="h-4 w-4" /> Back to room
        </Link>
      </Button>

      <PageHeader
        title="Request a viewing"
        description="Propose a time to see the room in person. The owner will confirm or counter-propose."
      />

      {room && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              You&apos;re requesting a viewing for
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
                Room {room.roomNumber} · {formatCurrency(room.rent)}{" "}
                {room.bookingMode === "BOOK_BY_SEAT" ? "/ seat" : "/ month"}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Proposed date &amp; time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="proposedDate">When would you like to visit?</Label>
              <Input
                id="proposedDate"
                type="datetime-local"
                {...register("proposedDate")}
              />
              {errors.proposedDate && (
                <p className="text-xs text-destructive">
                  {errors.proposedDate.message}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Pick a time at least a few hours ahead. The owner can accept it
                or propose an alternative.
              </p>
            </div>

            {create.isError && (
              <p className="text-sm text-destructive">
                {(create.error as Error)?.message ??
                  "Failed to submit view request."}
              </p>
            )}

            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={create.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending || !room}>
                {create.isPending ? "Sending…" : "Send request"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default function NewViewRequestPage() {
  return (
    <Suspense
      fallback={
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      }
    >
      <NewViewRequestContent />
    </Suspense>
  );
}