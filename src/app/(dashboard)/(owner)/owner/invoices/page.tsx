"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvoices, useCreateInvoice } from "@/hooks/use-invoices";
import { toInvoiceCardVM } from "@/lib/adapters/invoice";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceFormValues } from "@/schemas/invoice.schema";
import { DataPagination } from "@/components/shared/data-pagination";

type UtilityRow = { name: string; amount: string };

export default function OwnerInvoicesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useInvoices({ page });
  const invoices = (data?.data ?? []).map(toInvoiceCardVM);

  const create = useCreateInvoice();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    roomOccupantId: "",
    billMonth: "",
    dueDate: "",
    rentAmount: "",
  });
  const [utilities, setUtilities] = useState<UtilityRow[]>([
    { name: "Electricity", amount: "" },
  ]);

  function reset() {
    setForm({ roomOccupantId: "", billMonth: "", dueDate: "", rentAmount: "" });
    setUtilities([{ name: "Electricity", amount: "" }]);
  }

  function submit() {
    const payload: InvoiceFormValues = {
      roomOccupantId: form.roomOccupantId.trim(),
      billMonth: form.billMonth.trim(),
      type: "COMBINED_RENT_UTILITY",
      rentAmount: Number(form.rentAmount),
      dueDate: form.dueDate,
      utilityDetails: utilities
        .filter((u) => u.name.trim() && u.amount.trim())
        .map((u) => ({ name: u.name.trim(), amount: Number(u.amount) })),
    };
    create.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Bill tenants for monthly rent plus utilities or maintenance."
        actions={
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) reset();
            }}
          >
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
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="roomOccupantId">Room occupant ID</Label>
                  <Input
                    id="roomOccupantId"
                    placeholder="Paste the occupant UUID"
                    value={form.roomOccupantId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, roomOccupantId: e.target.value }))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Will become a dropdown once the occupants list is wired.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="billMonth">Bill month</Label>
                    <Input
                      id="billMonth"
                      placeholder="2026-09"
                      value={form.billMonth}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, billMonth: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dueDate">Due date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, dueDate: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rentAmount">Rent amount</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    placeholder="5000"
                    value={form.rentAmount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, rentAmount: e.target.value }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Utility line items</Label>
                  {utilities.map((u, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder="Electricity"
                        value={u.name}
                        onChange={(e) =>
                          setUtilities((prev) =>
                            prev.map((x, idx) =>
                              idx === i ? { ...x, name: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <Input
                        placeholder="1200"
                        type="number"
                        className="w-28"
                        value={u.amount}
                        onChange={(e) =>
                          setUtilities((prev) =>
                            prev.map((x, idx) =>
                              idx === i ? { ...x, amount: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setUtilities((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() =>
                      setUtilities((prev) => [...prev, { name: "", amount: "" }])
                    }
                  >
                    <Plus className="h-4 w-4" /> Add utility
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={submit} disabled={create.isPending}>
                  {create.isPending ? "Creating…" : "Create invoice"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading invoices…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load invoices."}
        </p>
      )}

      {!isLoading && !isError && invoices.length === 0 && (
        <EmptyState
          icon={Receipt}
          title="No invoices yet"
          description="Create your first invoice to bill a tenant."
        />
      )}

      {!isLoading && !isError && invoices.length > 0 && (
        <>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill month</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Property · Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono-plan text-xs">
                    {inv.billMonth}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.typeLabel}
                  </TableCell>
                  <TableCell className="font-medium">
                    {inv.tenantName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="block truncate">{inv.propertyTitle}</span>
                    <span className="block truncate text-xs">
                      {inv.roomNumber}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(inv.totalAmount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.dueDate}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/owner/invoices/${inv.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <DataPagination meta={data?.meta} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}