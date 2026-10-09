"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Hash,
  Phone,
  CalendarDays,
  Wallet,
  Receipt,
  Building2,
  DoorOpen,
  User,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyableId } from "@/components/shared/copyable-id";
import { usePayment } from "@/hooks/use-payments";
import { toPaymentRowVM } from "@/lib/adapters/payment";
import { formatCurrency } from "@/lib/utils";

export default function TenantPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = usePayment(id);

  const err = error as { status?: number; message?: string } | null;
  const payment = data ? toPaymentRowVM(data) : null;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/tenant/payments">
          <ArrowLeft className="h-4 w-4" /> Back to payments
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading payment…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {err?.status === 403
            ? "You don't have access to this payment."
            : err?.status === 404
              ? "Payment not found."
              : err?.message ?? "Failed to load payment."}
        </p>
      )}

      {payment && (
        <>
          <PageHeader
            title="Payment details"
            description={`${payment.providerLabel} · ${payment.createdAt}`}
          />

          <Card className="mb-4">
            <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    payment.status === "paid"
                      ? "bg-moss/10 text-moss"
                      : payment.status === "pending"
                        ? "bg-amber/10 text-amber"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Amount
                  </p>
                  <p className="mt-0.5 font-display text-3xl leading-none tabular-nums">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    via {payment.providerLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-1 sm:items-end">
                <StatusBadge status={payment.status} />
                {payment.paidAt && (
                  <p className="text-xs text-muted-foreground">
                    Paid {payment.paidAt}
                  </p>
                )}
                {!payment.paidAt && payment.status === "pending" && (
                  <p className="text-xs text-muted-foreground">
                    Started {payment.createdAt}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment for</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                {payment.purpose === "invoice" && (
                  <MetaRow
                    icon={Receipt}
                    label="Invoice"
                    value={payment.referenceLabel ?? "Invoice"}
                    sub={
                      payment.referenceId
                        ? `ID: ${payment.referenceId.slice(0, 8)}…${payment.referenceId.slice(-4)}`
                        : undefined
                    }
                  />
                )}

                {payment.purpose === "application" && (
                  <MetaRow
                    icon={DoorOpen}
                    label="Application"
                    value={payment.referenceLabel ?? "Room application"}
                    sub={payment.propertyTitle ?? undefined}
                  />
                )}

                {payment.purpose === "unknown" && (
                  <p className="text-muted-foreground">
                    This payment isn&apos;t linked to an invoice or application.
                  </p>
                )}

                {payment.referenceId && (
                  <div className="flex flex-col gap-3 border-t border-border pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        Reference ID
                      </span>
                      <CopyableId id={payment.referenceId} />
                    </div>
                  </div>
                )}

                {payment.purpose === "invoice" && payment.referenceId && (
                  <div className="pt-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/tenant/invoices/${payment.referenceId}`}>
                        <Receipt className="mr-1 h-3 w-3" /> View invoice
                      </Link>
                    </Button>
                  </div>
                )}
                {payment.purpose === "application" && (
                  <div className="pt-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/tenant/applications`}>
                        <DoorOpen className="mr-1 h-3 w-3" /> View application
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <MetaRow
                  icon={Wallet}
                  label="Amount"
                  value={formatCurrency(payment.amount)}
                />
                <MetaRow
                  icon={CreditCard}
                  label="Provider"
                  value={payment.providerLabel}
                />
                <MetaRow
                  icon={CalendarDays}
                  label="Created"
                  value={payment.createdAt}
                />
                {payment.paidAt && (
                  <MetaRow
                    icon={CalendarDays}
                    label="Paid at"
                    value={payment.paidAt}
                  />
                )}
                {payment.tenantName && (
                  <MetaRow
                    icon={User}
                    label="Tenant"
                    value={payment.tenantName}
                    sub={payment.tenantEmail ?? undefined}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {(payment.gatewayPaymentId ||
            payment.gatewayTransactionId ||
            payment.payerReference) && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Gateway reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {payment.gatewayTransactionId && (
                    <MetaRow
                      icon={Hash}
                      label="Transaction ID"
                      value={payment.gatewayTransactionId}
                      mono
                    />
                  )}
                  {payment.gatewayPaymentId && (
                    <MetaRow
                      icon={Hash}
                      label="Gateway payment ID"
                      value={payment.gatewayPaymentId}
                      mono
                    />
                  )}
                  {payment.payerReference && (
                    <MetaRow
                      icon={Phone}
                      label="Payer reference"
                      value={payment.payerReference}
                      mono
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {payment.isRefunded && payment.refundAmount && (
            <Card className="mt-4 border-amber/30 bg-amber/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber" />
                  Refund issued
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium text-amber">
                  {formatCurrency(payment.refundAmount)} refunded
                </p>
                {payment.refundReason && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {payment.refundReason}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {(payment.status === "failed" || payment.status === "cancelled") && (
            <Card className="mt-4 border-destructive/30 bg-destructive/5">
              <CardContent className="flex items-start gap-3 p-4 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="font-medium">
                    {payment.status === "failed"
                      ? "Payment failed"
                      : "Payment cancelled"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    No charge was made. You can try again from the invoice or
                    application page.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
  sub,
  mono = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`truncate font-medium ${mono ? "font-mono-plan text-xs" : ""}`}
        >
          {value}
        </p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}