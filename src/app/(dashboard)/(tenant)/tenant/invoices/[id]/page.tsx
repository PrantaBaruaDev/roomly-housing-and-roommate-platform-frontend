"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceDetail } from "@/components/shared/invoice-detail";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/hooks/use-invoices";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { formatCurrency } from "@/lib/utils";

export default function TenantInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useInvoice(id);
  const invoice = data ? toInvoiceCardVM(data) : null;

  const err = error as { status?: number; message?: string } | null;

  // TODO: wire this to POST /payments/create/bkash next
  function handlePay() {
    if (!invoice) return;
    console.log("Pay invoice", invoice.id, invoice.totalAmount);
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/tenant/invoices">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading invoice…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {err?.status === 403
            ? "You don't have access to this invoice."
            : err?.status === 404
              ? "Invoice not found."
              : err?.message ?? "Failed to load invoice."}
        </p>
      )}

      {invoice && (
        <>
          <PageHeader
            title={`${invoice.billMonth} invoice`}
            description={invoice.typeLabel}
          />
          <InvoiceDetail
            invoice={invoice}
            viewerRole="tenant"
            actions={
              invoice.status === "issued" ? (
                <Button onClick={handlePay}>
                  Pay {formatCurrency(invoice.totalAmount)} via bKash
                </Button>
              ) : null
            }
          />
        </>
      )}
    </div>
  );
}