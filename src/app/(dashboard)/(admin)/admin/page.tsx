"use client";

import Link from "next/link";
import {
  Building2,
  ClipboardList,
  Users,
  Receipt,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/use-properties";
import { useApplications } from "@/hooks/use-applications";
import { useInvoices } from "@/hooks/use-invoices";
import { usePayments } from "@/hooks/use-payments";
import { toPropertyCardVM } from "@/lib/adapters/property";
import { toApplicationCardVM } from "@/lib/adapters/application";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverviewPage() {
  const properties = useProperties({ page: 1 });
  const applications = useApplications({ page: 1 });
  const invoices = useInvoices({ page: 1 });
  const payments = usePayments({ page: 1 });

  const propertyVMs = (properties.data?.data ?? []).map(toPropertyCardVM);
  const applicationVMs = (applications.data?.data ?? []).map(
    toApplicationCardVM,
  );
  const invoiceVMs = (invoices.data?.data ?? []).map(toInvoiceCardVM);

  const pendingApps = applicationVMs.filter((a) => a.status === "PENDING");
  const unverifiedProps = propertyVMs.filter((p) => !p.isVerified);
  const unpaidInvoices = invoiceVMs.filter((i) => i.status === "issued");

  const totalRevenue = (payments.data?.data ?? [])
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const isLoading =
    properties.isLoading ||
    applications.isLoading ||
    invoices.isLoading ||
    payments.isLoading;

  return (
    <div>
      <PageHeader
        title="Platform overview"
        description="Everything happening across Roomly."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Properties"
          value={properties.data?.meta?.total ?? propertyVMs.length}
          hint={`${unverifiedProps.length} unverified`}
          icon={Building2}
          accent="blueprint"
        />
        <StatCard
          label="Applications"
          value={applications.data?.meta?.total ?? applicationVMs.length}
          hint={`${pendingApps.length} pending`}
          icon={ClipboardList}
          accent="brass"
        />
        <StatCard
          label="Invoices"
          value={invoices.data?.meta?.total ?? invoiceVMs.length}
          hint={`${unpaidInvoices.length} unpaid`}
          icon={Receipt}
          accent="moss"
        />
        <StatCard
          label="Platform revenue"
          value={formatCurrency(totalRevenue)}
          hint="Completed payments"
          icon={CreditCard}
          accent="moss"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Pending applications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Pending applications</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/applications">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            )}
            {!isLoading && pendingApps.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No pending applications.
              </p>
            )}
            {pendingApps.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {app.tenantName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {app.propertyTitle} · Room {app.roomNumber}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Unverified properties */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Awaiting verification</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/properties">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            )}
            {!isLoading && unverifiedProps.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                All properties verified.
              </p>
            )}
            {unverifiedProps.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.ownerName} · {p.location}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/properties`}>Review</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}