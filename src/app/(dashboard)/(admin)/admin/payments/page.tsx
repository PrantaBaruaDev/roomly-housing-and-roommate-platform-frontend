"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataPagination } from "@/components/shared/data-pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePayments } from "@/hooks/use-payments";
import { toPaymentRowVM } from "@/lib/adapters/payment";
import { formatCurrency } from "@/lib/utils";
import type { BackendPaymentStatus } from "@/types/payment";

type Filter = "ALL" | BackendPaymentStatus;

const TABS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCEL", label: "Cancelled" },
];

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = usePayments({
    page,
    ...(tab === "ALL" ? {} : { status: tab }),
  });

  const payments = (data?.data ?? []).map(toPaymentRowVM);

  function changeTab(next: Filter) {
    setTab(next);
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Every payment processed through the platform."
      />

      <Tabs value={tab} onValueChange={(v) => changeTab(v as Filter)}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading payments…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load payments."}
        </p>
      )}

      {!isLoading && !isError && payments.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No payments"
          description={
            tab === "ALL"
              ? "Payments made by tenants will appear here."
              : "Nothing matches this filter."
          }
        />
      )}

      {payments.length > 0 && (
        <>
          <Card className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>For</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="block font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
                        {p.purpose === "invoice"
                          ? "Invoice"
                          : p.purpose === "application"
                            ? "Application"
                            : "Payment"}
                      </span>
                      {p.referenceLabel && (
                        <span className="mt-0.5 block text-xs font-medium text-foreground">
                          {p.referenceLabel}
                        </span>
                      )}
                      {p.propertyTitle && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {p.propertyTitle}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.tenantName ? (
                        <>
                          <span className="block truncate font-medium">
                            {p.tenantName}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {p.tenantEmail}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(p.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.providerLabel}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.paidAt ?? p.createdAt}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/payments/${p.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <DataPagination
            meta={data?.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}