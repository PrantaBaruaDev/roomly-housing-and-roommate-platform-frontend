"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceDetail } from "@/components/shared/invoice-detail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInvoice } from "@/hooks/use-invoices";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";

export default function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useInvoice(id);
  const invoice = data ? toInvoiceCardVM(data) : null;

  const err = error as { status?: number; message?: string } | null;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/admin/invoices">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading invoice…
        </p>
      )}

      {isError && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium">
              {err?.status === 404 ? "Invoice not found" : "Couldn't load invoice"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {err?.message ?? "Please try again."}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/admin/invoices">Back to invoices</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {invoice && (
        <>
          <PageHeader
            title={`${invoice.billMonth} invoice`}
            description={invoice.typeLabel}
          />
          <InvoiceDetail invoice={invoice} viewerRole="admin" />
        </>
      )}
    </div>
  );
}