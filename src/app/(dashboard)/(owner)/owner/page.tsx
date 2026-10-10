"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Building2,
  ClipboardList,
  Receipt,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreatePropertyDialog } from "@/components/shared/create-property-dialog";
import { useOwnerProperties } from "@/hooks/use-properties";
import { useApplications } from "@/hooks/use-applications";
import { useViewRequests } from "@/hooks/use-view-requests";
import { useInvoices } from "@/hooks/use-invoices";
import { toPropertyCardVM } from "@/lib/adapters/property";
import { toApplicationCardVM } from "@/lib/adapters/application";
import { toViewRequestCardVM } from "@/lib/adapters/view-request";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { formatCurrency } from "@/lib/utils";

const FETCH_LIMIT = 50;
const PREVIEW_LIMIT = 3;

export default function OwnerOverviewPage() {
  const propertiesQuery = useOwnerProperties({ page: 1, limit: FETCH_LIMIT });
  const applicationsQuery = useApplications({ page: 1, limit: FETCH_LIMIT });
  const viewRequestsQuery = useViewRequests({ page: 1, limit: FETCH_LIMIT });
  const invoicesQuery = useInvoices({ page: 1, limit: FETCH_LIMIT });

  const isLoading =
    propertiesQuery.isLoading ||
    applicationsQuery.isLoading ||
    viewRequestsQuery.isLoading ||
    invoicesQuery.isLoading;

  const properties = useMemo(
    () => (propertiesQuery.data?.data ?? []).map(toPropertyCardVM),
    [propertiesQuery.data],
  );
  const totalRooms = properties.reduce((n, p) => n + p.roomCount, 0);

  const pendingApplications = useMemo(
    () =>
      (applicationsQuery.data?.data ?? [])
        .filter((a) => a.status === "PENDING")
        .map(toApplicationCardVM),
    [applicationsQuery.data],
  );

  const upcomingViewings = useMemo(() => {
    const now = Date.now();
    const raw = viewRequestsQuery.data?.data ?? [];

    const active = raw.filter((r) => {
      if (
        r.status !== "PENDING" &&
        r.status !== "OWNER_RESCHEDULED" &&
        r.status !== "APPROVED"
      ) {
        return false;
      }
      const dateStr = r.counterDate ?? r.proposedDate;
      const ts = new Date(dateStr).getTime();
      return !Number.isNaN(ts) && ts >= now;
    });

    active.sort((a, b) => {
      const aTs = new Date(a.counterDate ?? a.proposedDate).getTime();
      const bTs = new Date(b.counterDate ?? b.proposedDate).getTime();
      return aTs - bTs;
    });

    return active.map(toViewRequestCardVM);
  }, [viewRequestsQuery.data]);

  const recentInvoices = useMemo(
    () => (invoicesQuery.data?.data ?? []).map(toInvoiceCardVM),
    [invoicesQuery.data],
  );

  const unpaidInvoices = useMemo(
    () => recentInvoices.filter((i) => i.status === "issued"),
    [recentInvoices],
  );

  const unpaidTotal = unpaidInvoices.reduce(
    (sum, i) => sum + i.totalAmount,
    0,
  );

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your properties at a glance."
        actions={<CreatePropertyDialog />}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Properties"
          value={isLoading ? "—" : properties.length}
          hint={
            !isLoading && totalRooms > 0
              ? `${totalRooms} total rooms`
              : undefined
          }
          icon={Building2}
          accent="blueprint"
        />
        <StatCard
          label="Pending applications"
          value={isLoading ? "—" : pendingApplications.length}
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
          label="Unpaid invoices"
          value={isLoading ? "—" : unpaidInvoices.length}
          hint={unpaidTotal > 0 ? formatCurrency(unpaidTotal) : undefined}
          icon={Receipt}
          accent="destructive"
        />
      </div>

      {/* Previews */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pending applications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Pending applications</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/owner/applications">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && <SkeletonRows />}
            {!isLoading && pendingApplications.length === 0 && (
              <EmptyRow text="No pending applications." />
            )}
            {pendingApplications.slice(0, PREVIEW_LIMIT).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {app.tenantName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Room {app.roomNumber} · wants {app.moveInDate}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  <Link href={`/owner/applications/${app.id}`}>Review</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming viewings */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming viewings</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/owner/view-requests">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && <SkeletonRows />}
            {!isLoading && upcomingViewings.length === 0 && (
              <EmptyRow text="No upcoming viewings." />
            )}
            {upcomingViewings.slice(0, PREVIEW_LIMIT).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{v.tenantName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Room {v.roomNumber} · {v.counterDate ?? v.proposedDate}
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent invoices</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/owner/invoices">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && <SkeletonRows />}
            {!isLoading && recentInvoices.length === 0 && (
              <EmptyRow text="No invoices yet." />
            )}
            {recentInvoices.slice(0, PREVIEW_LIMIT).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {inv.tenantName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inv.billMonth} · {formatCurrency(inv.totalAmount)}
                  </p>
                </div>
                <StatusBadge status={inv.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <p className="py-6 text-center text-xs text-muted-foreground">{text}</p>
  );
}