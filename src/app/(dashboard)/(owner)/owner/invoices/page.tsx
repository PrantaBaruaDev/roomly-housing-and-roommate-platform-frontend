"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/constants";

const invoices: {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  roomNumber: string;
  totalAmount: number;
  dueDate: string;
  status: InvoiceStatus;
}[] = [
  { id: "1", invoiceNumber: "INV-2026-0091", tenantName: "Daniel Cho", roomNumber: "R-102", totalAmount: 1450, dueDate: "2026-10-01", status: "issued" },
  { id: "2", invoiceNumber: "INV-2026-0090", tenantName: "Priya Nair", roomNumber: "R-301", totalAmount: 1320, dueDate: "2026-09-25", status: "paid" },
  { id: "3", invoiceNumber: "INV-2026-0084", tenantName: "Owen Carter", roomNumber: "R-110", totalAmount: 1180, dueDate: "2026-09-01", status: "overdue" },
];

type LineItem = { label: string; amount: string };

export default function OwnerInvoicesPage() {
  const [lineItems, setLineItems] = useState<LineItem[]>([{ label: "Room rent", amount: "" }]);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Bill tenants for monthly rent plus utilities or maintenance."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" /> New invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create invoice</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label>Room</Label>
                    <Input placeholder="R-204" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Due date</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Line items</Label>
                  {lineItems.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="e.g. Electricity"
                        value={item.label}
                        onChange={(e) =>
                          setLineItems((prev) => prev.map((li, idx) => (idx === i ? { ...li, label: e.target.value } : li)))
                        }
                      />
                      <Input
                        placeholder="Amount"
                        type="number"
                        className="w-28"
                        value={item.amount}
                        onChange={(e) =>
                          setLineItems((prev) => prev.map((li, idx) => (idx === i ? { ...li, amount: e.target.value } : li)))
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setLineItems((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => setLineItems((prev) => [...prev, { label: "", amount: "" }])}
                  >
                    <Plus className="h-4 w-4" /> Add line item
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button>Create invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono-plan text-xs">{inv.invoiceNumber}</TableCell>
                <TableCell className="font-medium">{inv.tenantName}</TableCell>
                <TableCell className="text-muted-foreground">{inv.roomNumber}</TableCell>
                <TableCell>{formatCurrency(inv.totalAmount)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
