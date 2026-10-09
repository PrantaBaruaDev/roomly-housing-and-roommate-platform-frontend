"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  DoorOpen,
  Users,
  BedDouble,
  ShieldCheck,
  Building2,
  CalendarClock,
  Home,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePropertyInventory } from "@/hooks/use-rooms";
import { toRoomBrowseVMs } from "@/lib/adapters/room";
import { useRequireTenant } from "@/hooks/use-require-tenant";
import { formatCurrency } from "@/lib/utils";

export default function PublicRoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const requireTenant = useRequireTenant();

  const { data, isLoading, isError, error } = usePropertyInventory();

  const room = useMemo(() => {
    const rooms = toRoomBrowseVMs(data?.data ?? []);
    return rooms.find((r) => r.id === id) ?? null;
  }, [data, id]);

  function handleApply() {
    const returnTo = `/tenant/applications/new?roomId=${id}`;
    const gate = requireTenant(returnTo);
    if (!gate.ok) {
      if (gate.reason === "wrong-role") {
        alert("Only tenants can apply for rooms.");
      }
      return;
    }
    router.push(returnTo);
  }

  function handleRequestView() {
    const returnTo = `/tenant/view-requests/new?roomId=${id}`;
    const gate = requireTenant(returnTo);
    if (!gate.ok) {
      if (gate.reason === "wrong-role") {
        alert("Only tenants can request viewings.");
      }
      return;
    }
    router.push(returnTo);
  }

  const isSeat = room?.bookingMode === "BOOK_BY_SEAT";

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/browse">
          <ArrowLeft className="h-4 w-4" /> Back to browse
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading room…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load room."}
        </p>
      )}

      {!isLoading && !isError && !room && (
        <Card>
          <CardContent className="py-16 text-center">
            <Home className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">Room not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This room may have been removed or is no longer available.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/browse">Browse other rooms</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {room && (
        <>
          <PageHeader
            title={room.propertyTitle}
            description={`Room ${room.roomNumber}`}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left — hero + description */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Card>
                <div className="relative flex aspect-[16/9] items-center justify-center bg-blueprint/5 blueprint-grid">
                  {room.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={room.imageUrl}
                      alt={room.propertyTitle}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <span className="rounded-md border border-blueprint/20 bg-background px-3 py-1.5 font-mono-plan text-sm text-blueprint">
                      {room.roomNumber}
                    </span>
                  )}
                  {room.isVerified && (
                    <Badge
                      variant="outline"
                      className="absolute right-3 top-3 border-moss/30 bg-background/90 text-moss backdrop-blur"
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verified property
                    </Badge>
                  )}
                </div>

                <CardContent className="pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="font-normal capitalize">
                      {room.propertyType.toLowerCase()}
                    </Badge>
                    {isSeat ? (
                      <Badge variant="secondary" className="gap-1 font-normal">
                        <Users className="h-3 w-3" />
                        {room.availableCapacity} of {room.maxCapacity} seats free
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 font-normal">
                        <Users className="h-3 w-3" /> Whole room
                      </Badge>
                    )}
                    <Badge variant="secondary" className="gap-1 font-normal">
                      <BedDouble className="h-3 w-3" /> cap {room.maxCapacity}
                    </Badge>
                  </div>

                  {room.amenities.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Amenities
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {room.amenities.map((a) => (
                          <Badge
                            key={a}
                            variant="outline"
                            className="font-normal"
                          >
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right — pricing + actions */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Rent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-3xl leading-none tabular-nums">
                    {formatCurrency(room.rent)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isSeat ? "per seat / month" : "per month"}
                  </p>

                  <div className="mt-5 flex flex-col gap-2">
                    <Button
                      onClick={handleRequestView}
                      variant="outline"
                      className="justify-start"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" /> Request a
                      viewing
                    </Button>
                    <Button onClick={handleApply} className="justify-start">
                      <DoorOpen className="mr-2 h-4 w-4" /> Apply for this room
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Property</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="truncate font-medium">
                        {room.propertyTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="truncate font-medium">
                        {room.propertyAddress}, {room.propertyCity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                      <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Room</p>
                      <p className="truncate font-medium">{room.roomNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}