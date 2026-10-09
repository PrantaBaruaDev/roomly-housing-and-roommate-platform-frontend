"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceDetail } from "@/components/shared/invoice-detail";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/hooks/use-invoices";
import { useCreateBkashPayment } from "@/hooks/use-payments";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { formatCurrency } from "@/lib/utils";
import { queryKeys } from "@/hooks/query-keys";

export default function TenantInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useInvoice(id);
  const invoice = data ? toInvoiceCardVM(data) : null;

  const payBkash = useCreateBkashPayment();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [awaitingPayment, setAwaitingPayment] = useState(false);

  const err = error as { status?: number; message?: string } | null;

  function openConfirm() {
    if (!invoice) return;
    setErrorMessage("");
    setConfirmOpen(true);
  }

  function handleConfirmPay() {
    if (!invoice) return;

    payBkash.mutate(
      { invoiceId: invoice.id },
      {
        onSuccess: (data) => {
          setConfirmOpen(false);

          const w =
            typeof window !== "undefined"
              ? window.open(data.paymentUrl, "_blank")
              : null;

          if (!w) {
            window.location.href = data.paymentUrl;
            return;
          }

          setAwaitingPayment(true);
        },
        onError: (err) => {
          setConfirmOpen(false);
          const msg =
            (err as Error)?.message ??
            "Could not start the bKash payment. Please try again.";
          setErrorMessage(msg);
          setErrorOpen(true);
        },
      },
    );
  }

  function handleRetry() {
    setErrorOpen(false);
    setTimeout(() => setConfirmOpen(true), 150);
  }

  useEffect(() => {
    if (!awaitingPayment) return;

    function handleFocus() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(id),
      });
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [awaitingPayment, id, queryClient]);

  useEffect(() => {
    if (invoice?.status === "paid") setAwaitingPayment(false);
  }, [invoice?.status]);

  function checkStatus() {
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
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

          {awaitingPayment && invoice.status !== "paid" && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber/30 bg-amber/5 p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  Waiting for payment confirmation
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Complete the checkout in the bKash tab. Once done, switch
                  back to this tab — the page will refresh automatically, or
                  click &ldquo;Check status&rdquo;.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={checkStatus}
                className="shrink-0"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Check status
              </Button>
            </div>
          )}

          
          <InvoiceDetail
          invoice={invoice}
            viewerRole="tenant"
            actions={
              invoice.status === "issued" ? (
                <Button onClick={openConfirm} disabled={payBkash.isPending}>
                  {payBkash.isPending ? (
                    "Starting…"
                  ) : (
                    <>
                      Pay {formatCurrency(invoice.totalAmount)} via bKash
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              ) : null
            }
            />

          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={(open) => {
              if (!payBkash.isPending) setConfirmOpen(open);
            }}
            title="Confirm payment"
            description={
              <>
                <p>
                  You&apos;re about to pay{" "}
                  <strong className="text-foreground">
                    {formatCurrency(invoice.totalAmount)}
                  </strong>{" "}
                  for the {invoice.billMonth} invoice through bKash.
                </p>
                <p className="mt-2">
                  A new tab will open on bKash&apos;s secure checkout page.
                  Complete the payment there, then come back to this tab.
                </p>
              </>
            }
            confirmLabel={`Pay ${formatCurrency(invoice.totalAmount)}`}
            cancelLabel="Cancel"
            variant="default"
            mode="confirm"
            isPending={payBkash.isPending}
            onConfirm={handleConfirmPay}
          />

          <ConfirmDialog
            open={errorOpen}
            onOpenChange={(open) => {
              if (!open) setErrorOpen(false);
            }}
            title="Payment could not start"
            description={
              <>
                <p className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{errorMessage}</span>
                </p>
                <p className="mt-3 text-xs">
                  Common causes: your session may have expired, the invoice is
                  already paid, or the payment gateway is unreachable. Try
                  again, or reload the page if the problem persists.
                </p>
              </>
            }
            variant="destructive"
            mode="alert"
            onConfirm={handleRetry}
          />

          {!errorOpen && errorMessage && invoice.status === "issued" && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={payBkash.isPending}
              >
                <RotateCcw className="mr-1 h-3 w-3" /> Retry payment
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}