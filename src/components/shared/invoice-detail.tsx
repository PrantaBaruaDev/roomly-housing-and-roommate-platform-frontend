"use client";

import type { ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  DoorOpen,
  Receipt,
  User,
  Wallet,
  Hash,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceCardVM } from "@/types/invoice";

export function InvoiceDetail({
  invoice,
  viewerRole = "tenant",
  actions,
}: {
  invoice: InvoiceCardVM;
  viewerRole?: "owner" | "tenant" | "admin";
  actions?: ReactNode;
}) {
  const showTenant = viewerRole !== "tenant";

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Charges</CardTitle>
            <StatusBadge status={invoice.status} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-border text-sm">
              {invoice.lineItems.map((li) => (
                <div
                  key={li.label}
                  className="flex justify-between py-3 first:pt-0"
                >
                  <span className="text-muted-foreground">{li.label}</span>
                  <span className="tabular-nums">
                    {formatCurrency(li.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 text-base font-medium">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>
            </div>

            {actions && <div className="mt-4 flex justify-end">{actions}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {showTenant && (
              <MetaRow
                icon={User}
                label="Tenant"
                value={invoice.tenantName}
                sub={invoice.tenantEmail}
              />
            )}
            <MetaRow
              icon={Building2}
              label="Property"
              value={invoice.propertyTitle}
            />
            <MetaRow
              icon={DoorOpen}
              label="Room"
              value={invoice.roomNumber}
            />
            {invoice.movedInAt && (
              <MetaRow
                icon={CalendarDays}
                label="Move-in"
                value={invoice.movedInAt}
              />
            )}
            <MetaRow
              icon={CalendarDays}
              label="Due date"
              value={invoice.dueDate}
            />
            <MetaRow
              icon={CalendarDays}
              label="Issued"
              value={invoice.createdAt}
            />
          </CardContent>
        </Card>
      </div>

      {invoice.payment && invoice.payment?.gatewayTransactionId && invoice.payment?.status === "COMPLETED" && invoice.status === "paid" && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-moss" />
              Payment receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetaRow
                icon={Wallet}
                label="Amount"
                value={formatCurrency(invoice.payment.amount)}
              />
              <MetaRow
                icon={CalendarDays}
                label="Paid on"
                value={invoice.payment.paidAt}
                sub={`via ${
                  invoice.payment.provider === "BKASH" ? "bKash" : "Card"
                }`}
              />
              {invoice.payment.gatewayTransactionId && (
                <MetaRow
                  icon={Hash}
                  label="Transaction ID"
                  value={invoice.payment.gatewayTransactionId}
                  mono
                />
              )}
              {invoice.payment.payerAccount && (
                <MetaRow
                  icon={Phone}
                  label="Payer account"
                  value={invoice.payment.payerAccount}
                  sub={invoice.payment.payerReference ?? undefined}
                  mono
                />
              )}
            </div>

            {invoice.payment.isRefunded && invoice.payment.refundAmount && (
              <div className="mt-4 rounded-md border border-amber/30 bg-amber/5 p-3 text-sm">
                <p className="font-medium text-amber">
                  Refunded {formatCurrency(invoice.payment.refundAmount)}
                </p>
                {invoice.payment.refundReason && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {invoice.payment.refundReason}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
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