import type { ReactNode } from "react";
import { Building2, DoorOpen, CalendarDays, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceCardVM } from "@/types/invoice";

export function InvoiceCard({
  invoice,
  viewerRole = "tenant",
  actions,
}: {
  invoice: InvoiceCardVM;
  viewerRole?: "tenant" | "owner" | "admin";
  actions?: ReactNode;
}) {
  const showTenant = viewerRole !== "tenant";

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="min-w-0">
          <CardTitle className="font-mono-plan text-sm font-medium">
            {invoice.billMonth}
            <span className="ml-2 font-sans font-normal text-muted-foreground">
              · {invoice.typeLabel}
            </span>
          </CardTitle>

          <div className="mt-2 flex flex-col gap-0.5 text-xs text-muted-foreground">
            <p className="flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{invoice.propertyTitle}</span>
            </p>
            <p className="flex items-center gap-1">
              <DoorOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">Room {invoice.roomNumber}</span>
            </p>
            {showTenant && (
              <p className="flex items-center gap-1">
                <User className="h-3 w-3 shrink-0" />
                <span className="truncate">{invoice.tenantName}</span>
              </p>
            )}
            <p className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 shrink-0" />
              <span>
                Due {invoice.dueDate}
                {invoice.isPaid && invoice.paidAt
                  ? ` · Paid ${invoice.paidAt}`
                  : ""}
              </span>
            </p>
          </div>
        </div>
        <StatusBadge status={invoice.status} />
      </CardHeader>

      <CardContent>
        {/* Line items */}
        <div className="flex flex-col divide-y divide-border text-sm">
          {invoice.lineItems.map((li) => (
            <div
              key={li.label}
              className="flex justify-between py-2 first:pt-0"
            >
              <span className="text-muted-foreground">{li.label}</span>
              <span>{formatCurrency(li.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-medium">
            <span>Total</span>
            <span>{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {invoice.isPaid && invoice.paymentProvider
              ? `Paid via ${
                  invoice.paymentProvider === "BKASH" ? "bKash" : "Card"
                }`
              : `Issued ${invoice.createdAt}`}
          </span>
          {actions}
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceCardList({
  invoices,
  viewerRole,
  renderActions,
}: {
  invoices: InvoiceCardVM[];
  viewerRole?: "tenant" | "owner" | "admin";
  renderActions?: (invoice: InvoiceCardVM) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {invoices.map((inv) => (
        <InvoiceCard
          key={inv.id}
          invoice={inv}
          viewerRole={viewerRole}
          actions={renderActions?.(inv)}
        />
      ))}
    </div>
  );
}