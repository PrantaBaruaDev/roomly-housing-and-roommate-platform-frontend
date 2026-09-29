import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentStatus } from "@/lib/constants";

const payments: { id: string; roomNumber: string; amount: number; method: string; status: PaymentStatus; paidAt: string }[] = [
  { id: "1", roomNumber: "R-204", amount: 1450, method: "Card", status: "paid", paidAt: "2026-09-01" },
  { id: "2", roomNumber: "R-204", amount: 1450, method: "Card", status: "paid", paidAt: "2026-08-01" },
  { id: "3", roomNumber: "R-204", amount: 1450, method: "Bank transfer", status: "pending", paidAt: "" },
];

export default function TenantPaymentsPage() {
  return (
    <div>
      <PageHeader title="Payments" description="Every payment you've made toward your room." />

      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments yet" description="Payments appear once an application is accepted and you check out." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono-plan text-xs">{p.roomNumber}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.method}</TableCell>
                  <TableCell className="text-muted-foreground">{p.paidAt ? formatDate(p.paidAt) : "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
