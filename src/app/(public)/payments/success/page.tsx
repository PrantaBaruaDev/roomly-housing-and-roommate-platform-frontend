"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Receipt,
  Home,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { queryKeys } from "@/hooks/query-keys";
import { formatCurrency } from "@/lib/utils";

function dashboardHome(role: string | undefined): string {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/owner";
  return "/tenant";
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — user copies manually */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3 w-3 text-moss" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const invoiceId = searchParams.get("invoiceId");
  const applicationId = searchParams.get("applicationId");
  const paymentId = searchParams.get("paymentId");
  const transactionId = searchParams.get("transactionId");
  const amountRaw = searchParams.get("amount");
  const amount = amountRaw ? Number(amountRaw) : null;
  const provider = searchParams.get("provider") ?? "BKASH";
  const message = searchParams.get("message");

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
    queryClient.invalidateQueries({ queryKey: ["payments"] });

    if (invoiceId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(invoiceId),
      });
    }
  }, [queryClient, invoiceId]);

  const providerLabel = provider === "BKASH" ? "bKash" : "Card";
  const dashboardHref = dashboardHome(user?.role);

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss/10 text-moss">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="mt-4 font-display text-2xl">Payment successful</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {message ||
              `Your payment has been received and the invoice is now marked as paid.`}
          </p>

          {amount !== null && !Number.isNaN(amount) && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Amount paid
              </p>
              <p className="mt-1 font-display text-3xl leading-none">
                {formatCurrency(amount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                via {providerLabel}
              </p>
            </div>
          )}

          {(transactionId || paymentId || invoiceId || applicationId) && (
            <div className="mt-6 flex flex-col gap-1.5 rounded-md border border-border bg-secondary/30 p-3 text-left text-xs">
              {transactionId && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="flex items-center gap-1">
                    <span className="font-mono-plan text-[11px]">
                      {transactionId}
                    </span>
                    <CopyButton value={transactionId} label="transaction ID" />
                  </span>
                </div>
              )}
              {paymentId && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="flex items-center gap-1">
                    <span className="font-mono-plan text-[11px]">
                      {paymentId.slice(0, 8)}…{paymentId.slice(-4)}
                    </span>
                    <CopyButton value={paymentId} label="payment ID" />
                  </span>
                </div>
              )}
              {invoiceId && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Invoice</span>
                  <span className="flex items-center gap-1">
                    <span className="font-mono-plan text-[11px]">
                      {invoiceId.slice(0, 8)}…{invoiceId.slice(-4)}
                    </span>
                    <CopyButton value={invoiceId} label="invoice ID" />
                  </span>
                </div>
              )}
              {applicationId && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Application</span>
                  <span className="flex items-center gap-1">
                    <span className="font-mono-plan text-[11px]">
                      {applicationId.slice(0, 8)}…{applicationId.slice(-4)}
                    </span>
                    <CopyButton value={applicationId} label="application ID" />
                  </span>
                </div>
              )}
            </div>
          )}

          {invoiceId && (
            <Button asChild size="sm" className="mt-6 w-full">
              <Link href={`/tenant/invoices/${invoiceId}`}>
                <Receipt className="mr-1 h-4 w-4" /> View invoice &amp; receipt
              </Link>
            </Button>
          )}

          <div className="mt-3 flex gap-2">
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href="/tenant/payments">
                <Receipt className="mr-1 h-3 w-3" /> Payments
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href={dashboardHref}>
                <Home className="mr-1 h-3 w-3" /> Dashboard
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-[11px] text-muted-foreground">
            A record of this payment is saved in your Payments history. Keep the
            transaction ID for your records.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}