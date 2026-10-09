"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  RotateCcw,
  ArrowLeft,
  Home,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

function dashboardHome(role: string | undefined): string {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/owner";
  return "/tenant";
}

function CancelContent() {
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);

  const status = searchParams.get("status") ?? "failure";
  const invoiceId = searchParams.get("invoiceId");
  const applicationId = searchParams.get("applicationId");
  const paymentId = searchParams.get("paymentId");
  const message =
    searchParams.get("message") ??
    searchParams.get("reason") ??
    searchParams.get("error");

  const isCancelled = status === "cancel" || status === "cancelled";
  const isFailure = !isCancelled;

  const title = isCancelled ? "Payment cancelled" : "Payment failed";

  const description = isCancelled
    ? "You closed the bKash checkout before completing the payment. No charge was made."
    : message ||
      "The payment did not go through. No charge was made to your account.";

  const retryHref = invoiceId
    ? `/tenant/invoices/${invoiceId}`
    : applicationId
      ? `/tenant/applications`
      : null;

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-6 w-6" />
          </div>

          {/* Headline */}
          <h1 className="mt-4 font-display text-2xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>

          {/* Payment reference (for support) */}
          {(paymentId || invoiceId || applicationId) && (
            <div className="mt-4 rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-xs">
              {invoiceId && (
                <p className="font-mono-plan text-[10px] text-muted-foreground">
                  Invoice: {invoiceId.slice(0, 8)}…{invoiceId.slice(-4)}
                </p>
              )}
              {applicationId && (
                <p className="font-mono-plan text-[10px] text-muted-foreground">
                  Application: {applicationId.slice(0, 8)}…
                  {applicationId.slice(-4)}
                </p>
              )}
              {paymentId && (
                <p className="font-mono-plan text-[10px] text-muted-foreground">
                  Payment: {paymentId.slice(0, 8)}…{paymentId.slice(-4)}
                </p>
              )}
            </div>
          )}

          {isFailure && (
            <div className="mt-4 rounded-md border border-amber/30 bg-amber/5 p-3 text-left text-xs">
              <p className="font-medium text-amber">Common causes</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-muted-foreground">
                <li>Insufficient balance in your bKash account</li>
                <li>Incorrect PIN entered at checkout</li>
                <li>Session expired or the page was left idle too long</li>
                <li>Network issue between bKash and the payment gateway</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            {retryHref && (
              <Button asChild size="sm">
                <Link href={retryHref}>
                  <RotateCcw className="mr-1 h-4 w-4" /> Try payment again
                </Link>
              </Button>
            )}
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/tenant/payments">
                  <Receipt className="mr-1 h-3 w-3" /> Payments
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href={dashboardHome(user?.role)}>
                  <Home className="mr-1 h-3 w-3" /> Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Help */}
          <p className="mt-6 text-[11px] text-muted-foreground">
            If money left your account but the payment shows as failed, contact
            support with the reference above — do not retry until the refund
            clears.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}