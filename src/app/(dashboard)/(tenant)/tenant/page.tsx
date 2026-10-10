"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ClipboardList,
  Receipt,
  Users,
  CalendarClock,
  ArrowRight,
  Wallet,
  DoorOpen,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApplications } from "@/hooks/use-applications";
import { useInvoices } from "@/hooks/use-invoices";
import { useViewRequests } from "@/hooks/use-view-requests";
import { useRoomOccupants } from "@/hooks/use-room-occupants";
import { toApplicationCardVM } from "@/lib/adapters/application";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { toViewRequestCardVM } from "@/lib/adapters/view-request";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

const FETCH_LIMIT = 50;

export default function TenantOverviewPage() {
  const applicationsQuery = useApplications({ page: 1, limit: FETCH_LIMIT });
  const invoicesQuery = useInvoices({ page: 1, limit: FETCH_LIMIT });
  const viewRequestsQuery = useViewRequests({ page: 1, limit: FETCH_LIMIT });
  const occupantsQuery = useRoomOccupants({ page: 1, limit: FETCH_LIMIT });

  const isLoading =
    applicationsQuery.isLoading ||
    invoicesQuery.isLoading ||
    viewRequestsQuery.isLoading ||
    occupantsQuery.isLoading;

  const applications = useMemo(
    () => (applicationsQuery.data?.data ?? []).map(toApplicationCardVM),
    [applicationsQuery.data],
  );

  const activeApplications = useMemo(
    () => applications.filter((a) => a.status === "PENDING"),
    [applications],
  );

  const invoices = useMemo(
    () => (invoicesQuery.data?.data ?? []).map(toInvoiceCardVM),
    [invoicesQuery.data],
  );

  const unpaidInvoices = useMemo(
    () => invoices.filter((i) => i.status === "issued"),
    [invoices],
  );

  const latestUnpaidInvoice = unpaidInvoices[0] ?? null;
  const latestPaidInvoice = invoices.find((i) => i.status === "paid") ?? null;
  const latestInvoice = latestUnpaidInvoice ?? latestPaidInvoice ?? null;

  const upcomingViewings = useMemo(() => {
    const now = Date.now();
    const raw = viewRequestsQuery.data?.data ?? [];

    return raw
      .filter((r) => {
        if (r.status !== "PENDING" && r.status !== "OWNER_RESCHEDULED") {
          return false;
        }
        const ts = new Date(r.counterDate ?? r.proposedDate).getTime();
        return !Number.isNaN(ts) && ts >= now;
      })
      .sort((a, b) => {
        const aTs = new Date(a.counterDate ?? a.proposedDate).getTime();
        const bTs = new Date(b.counterDate ?? b.proposedDate).getTime();
        return aTs - bTs;
      })
      .map(toViewRequestCardVM);
  }, [viewRequestsQuery.data]);

  const roommates = useMemo(() => {
    const raw = occupantsQuery.data?.data ?? [];
    return raw.map((o) => ({
      id: o.id,
      name: o.tenant?.name ?? "Unknown",
      email: o.tenant?.email ?? "",
      roomNumber: o.room?.roomNumber ?? "—",
      propertyTitle: o.property?.title ?? "",
    }));
  }, [occupantsQuery.data]);

  const activeOccupant = useMemo(() => {
    const raw = occupantsQuery.data?.data ?? [];
    return raw.find((o) => !o.movedOutAt) ?? raw[0] ?? null;
  }, [occupantsQuery.data]);

  const currentRent = useMemo(() => {
    if (!activeOccupant) return null;
    if (activeOccupant.application?.status !== "APPROVED") return null;
    const amount = Number(activeOccupant.application.agreedRentAmount);
    return Number.isNaN(amount) ? null : amount;
  }, [activeOccupant]);

  const moveInDate = useMemo(() => {
    const iso = activeOccupant?.application?.moveInDate;
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : formatDate(d);
  }, [activeOccupant]);

  const currentRoom = roommates[0] ?? null;

  return (
    <div>
      <PageHeader
        title="Overview"
        description={
          currentRoom
            ? `Room ${currentRoom.roomNumber} · ${currentRoom.propertyTitle}`
            : "Your dashboard"
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current rent"
          value={
            isLoading
              ? "—"
              : currentRent !== null
                ? formatCurrency(currentRent)
                : "—"
          }
          hint={
            currentRent !== null
              ? moveInDate
                ? `Since ${moveInDate}`
                : "Active lease"
              : activeOccupant
                ? "Awaiting approval"
                : "No active room"
          }
          icon={Receipt}
          accent={currentRent !== null ? "blueprint" : "moss"}
        />
        <StatCard
          label="Active applications"
          value={isLoading ? "—" : activeApplications.length}
          hint={
            activeApplications.length > 0
              ? "Awaiting owner review"
              : "No pending apps"
          }
          icon={ClipboardList}
          accent="brass"
        />
        <StatCard
          label="Upcoming viewings"
          value={isLoading ? "—" : upcomingViewings.length}
          icon={CalendarClock}
          accent="moss"
        />
        <StatCard
          label="Roommates"
          value={isLoading ? "—" : Math.max(0, roommates.length - 1)}
          icon={Users}
          accent="blueprint"
        />
      </div>

      {/* Middle row: invoice + roommates */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Latest invoice */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Latest invoice</CardTitle>
            {latestInvoice && <StatusBadge status={latestInvoice.status} />}
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-3">
                <div className="h-7 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                <div className="h-9 w-28 animate-pulse rounded bg-muted" />
              </div>
            )}

            {!isLoading && !latestInvoice && (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No invoices yet.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your owner will issue an invoice once you move in.
                </p>
              </div>
            )}

            {latestInvoice && (
              <>
                <p className="font-display text-3xl tabular-nums">
                  {formatCurrency(latestInvoice.totalAmount)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {latestInvoice.billMonth} · {latestInvoice.typeLabel} · due{" "}
                  {latestInvoice.dueDate}
                </p>

                {latestInvoice.status === "issued" ? (
                  <Button asChild size="sm" className="mt-4">
                    <Link href={`/tenant/invoices/${latestInvoice.id}`}>
                      <Wallet className="mr-1 h-3 w-3" /> Pay now
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-4"
                  >
                    <Link href={`/tenant/invoices/${latestInvoice.id}`}>
                      View receipt
                    </Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Roommates */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Your room</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/tenant/roommates">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && (
              <>
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {!isLoading && roommates.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No active occupancy.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Once you&apos;re approved and paid, your room details will
                  appear here.
                </p>
              </div>
            )}

            {!isLoading &&
              roommates.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <Avatar>
                    <AvatarFallback>{initials(r.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      Room {r.roomNumber}
                      {r.propertyTitle && ` · ${r.propertyTitle}`}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: applications + viewings */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Active applications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Active applications</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/tenant/applications">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && <PreviewSkeleton />}
            {!isLoading && activeApplications.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No active applications.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href="/browse">
                    <DoorOpen className="mr-1 h-3 w-3" /> Browse rooms
                  </Link>
                </Button>
              </div>
            )}
            {activeApplications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {app.propertyTitle}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Room {app.roomNumber} · move-in {app.moveInDate}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming viewings */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming viewings</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/tenant/view-requests">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && <PreviewSkeleton />}
            {!isLoading && upcomingViewings.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No upcoming viewings.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href="/browse">
                    <CalendarClock className="mr-1 h-3 w-3" /> Request a viewing
                  </Link>
                </Button>
              </div>
            )}
            {upcomingViewings.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {v.propertyTitle}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Room {v.roomNumber} · {v.counterDate ?? v.proposedDate}
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-5 w-14 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </>
  );
}