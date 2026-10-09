"use client";

import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { InvoiceCardList } from "@/components/shared/invoice-card";
import { Button } from "@/components/ui/button";
import { useInvoices } from "@/hooks/use-invoices";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function TenantInvoicesPage() {
  const { data, isLoading, isError, error } = useInvoices();
  const invoices = (data?.data ?? []).map(toInvoiceCardVM);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Your monthly rent, utility, and maintenance charges."
      />

      {isLoading && (
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
          title="No invoices yet"
          description="Your owner will issue an invoice each billing period."
        />
      )}

      {!isLoading && !isError && invoices.length > 0 && (
        <InvoiceCardList
          invoices={invoices}
          viewerRole="tenant"
          renderActions={(inv) => (
            <Button asChild size="sm">
              <Link href={`/tenant/invoices/${inv.id}`}>
                {inv.status === "issued"
                  ? `View & Pay ${formatCurrency(inv.totalAmount)}`
                  : "View invoice"}
              </Link>
            </Button>
          )}
        />
      )}
    </div>
  );
}