import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/constants";

const invoices: {
  id: string;
  invoiceNumber: string;
  period: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: { label: string; amount: number }[];
}[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-0091",
    period: "September 2026",
    dueDate: "2026-10-01",
    status: "issued",
    lineItems: [
      { label: "Room rent", amount: 1300 },
      { label: "Electricity", amount: 90 },
      { label: "Water", amount: 60 },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-0078",
    period: "August 2026",
    dueDate: "2026-09-01",
    status: "paid",
    lineItems: [
      { label: "Room rent", amount: 1300 },
      { label: "Electricity", amount: 75 },
      { label: "Water", amount: 55 },
    ],
  },
];

export default function TenantInvoicesPage() {
  return (
    <div>
      <PageHeader title="Invoices" description="Your monthly rent, utility, and maintenance charges." />

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices yet" description="Your owner will issue an invoice each billing period." />
      ) : (
        <div className="flex flex-col gap-4">
          {invoices.map((inv) => {
            const total = inv.lineItems.reduce((sum, li) => sum + li.amount, 0);
            return (
              <Card key={inv.id}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="font-mono-plan text-sm font-medium">{inv.invoiceNumber}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {inv.period} · due {formatDate(inv.dueDate)}
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col divide-y divide-border text-sm">
                    {inv.lineItems.map((li) => (
                      <div key={li.label} className="flex justify-between py-2 first:pt-0">
                        <span className="text-muted-foreground">{li.label}</span>
                        <span>{formatCurrency(li.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  {inv.status === "issued" && (
                    <Button size="sm" className="mt-4">
                      Pay {formatCurrency(total)}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
