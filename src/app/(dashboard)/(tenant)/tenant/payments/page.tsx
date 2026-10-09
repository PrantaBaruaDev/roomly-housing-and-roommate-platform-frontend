"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, ExternalLink, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataPagination } from "@/components/shared/data-pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useAuthStore } from "@/store/auth-store";


export default function TenantPaymentsPage() {
  // const currentUserId = useAuthStore((s) => s.user?.id);
  
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = usePayments({
    page,
  });

  const payments = (data?.data ?? []).map(toPaymentRowVM);
  const meta = data?.meta;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Every payment you've made through the platform."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-1 h-3 w-3 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      {/* Loading */}
      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading payments…
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load payment history."}
        </p>
      )}

      {/* Empty */}
      {!isLoading && !isError && payments.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Once you complete a checkout on an invoice or application, your payments will appear here."
        />
      )}

      {/* List */}
      {payments.length > 0 && (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>For</TableHead>
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
                    {/* Purpose + reference */}
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

                    {/* Amount */}
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(p.amount)}
                    </TableCell>

                    {/* Provider */}
                    <TableCell className="text-muted-foreground">
                      {p.providerLabel}
                    </TableCell>

                    {/* Date — paidAt when paid, createdAt otherwise */}
                    <TableCell className="text-muted-foreground">
                      {p.paidAt ?? p.createdAt}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/tenant/payments/${p.id}`}>Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <DataPagination
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}