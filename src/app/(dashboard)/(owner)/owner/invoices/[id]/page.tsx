"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceDetail } from "@/components/shared/invoice-detail";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/hooks/use-invoices";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";

export default function OwnerInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useInvoice(id);
  const invoice = data ? toInvoiceCardVM(data) : null;

  const err = error as { status?: number; message?: string } | null;
  const isForbidden = err?.status === 403;
  const isNotFound = err?.status === 404;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/owner/invoices">
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
          {isForbidden
            ? "You don't have access to this invoice."
            : isNotFound
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
          <InvoiceDetail invoice={invoice} viewerRole="owner" />
        </>
      )}
    </div>
  );
}