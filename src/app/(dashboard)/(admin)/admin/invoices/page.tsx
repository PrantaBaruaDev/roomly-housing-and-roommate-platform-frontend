"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
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
import { useInvoices } from "@/hooks/use-invoices";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { formatCurrency } from "@/lib/utils";
import type { BackendBillStatus } from "@/types/invoice";

type Filter = "ALL" | BackendBillStatus;

const TABS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
];

export default function AdminInvoicesPage() {
  const [tab, setTab] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useInvoices(
    tab === "ALL" ? { page } : { status: tab, page },
  );
  const invoices = (data?.data ?? []).map(toInvoiceCardVM);

  function changeTab(next: Filter) {
    setTab(next);
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Every invoice across the platform, for oversight."
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
          Loading invoices…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load invoices."}
        </p>
      )}

      {!isLoading && !isError && invoices.length === 0 && (
        <EmptyState
          icon={Receipt}
          title="No invoices"
          description={
            tab === "ALL"
              ? "Invoices created by owners will appear here."
              : "Nothing matches this filter."
          }
        />
      )}

      {invoices.length > 0 && (
        <>
          <Card className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill month</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property · Room</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono-plan text-xs">
                      {inv.billMonth}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {inv.typeLabel}
                    </TableCell>
                    <TableCell>
                      <span className="block truncate font-medium">
                        {inv.tenantName}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {inv.tenantEmail}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="block truncate">
                        {inv.propertyTitle}
                      </span>
                      <span className="block truncate text-xs">
                        {inv.roomNumber}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(inv.totalAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {inv.dueDate}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/invoices/${inv.id}`}>View</Link>
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