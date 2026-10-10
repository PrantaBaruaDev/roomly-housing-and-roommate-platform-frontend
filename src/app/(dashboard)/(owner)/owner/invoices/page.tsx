"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataPagination } from "@/components/shared/data-pagination";
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
import { invoiceSchema, type InvoiceFormValues } from "@/schemas/invoice.schema";
import { z } from "zod";

type InvoiceFormOutput = z.output<typeof invoiceSchema>;

const DEFAULT_UTILITY = { name: "", amount: 0 };

export default function OwnerInvoicesPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = useInvoices({ page });
  const invoices = (data?.data ?? []).map(toInvoiceCardVM);

  const create = useCreateInvoice();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormOutput>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      roomOccupantId: "",
      billMonth: "",
      dueDate: "",
      type: "COMBINED_RENT_UTILITY",
      rentAmount: Number(0),
      utilityDetails: [DEFAULT_UTILITY],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "utilityDetails",
  });

  const onSubmit = (values: InvoiceFormValues) => {
    create.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

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

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="roomOccupantId">Room occupant ID</Label>
                  <Input
                    id="roomOccupantId"
                    placeholder="Paste the occupant UUID"
                    {...register("roomOccupantId")}
                  />
                  {errors.roomOccupantId && (
                    <p className="text-xs text-destructive">
                      {errors.roomOccupantId.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="billMonth">Bill month</Label>
                    <Input
                      id="billMonth"
                      placeholder="2026-09"
                      {...register("billMonth")}
                    />
                    {errors.billMonth && (
                      <p className="text-xs text-destructive">
                        {errors.billMonth.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dueDate">Due date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      {...register("dueDate")}
                    />
                    {errors.dueDate && (
                      <p className="text-xs text-destructive">
                        {errors.dueDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rentAmount">Rent amount</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    placeholder="5000"
                    {...register("rentAmount")}
                  />
                  {errors.rentAmount && (
                    <p className="text-xs text-destructive">
                      {errors.rentAmount.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Utility line items</Label>
                  {fields.map((field, i) => {
                    const itemErrors = errors.utilityDetails?.[i];
                    return (
                      <div key={field.id} className="flex gap-2">
                        <Input
                          placeholder="Electricity"
                          {...register(`utilityDetails.${i}.name` as const)}
                        />
                        <Input
                          placeholder="1200"
                          type="number"
                          className="w-28"
                          {...register(`utilityDetails.${i}.amount` as const)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {(itemErrors?.name || itemErrors?.amount) && (
                          <p className="text-xs text-destructive">
                            {itemErrors.name?.message ?? itemErrors.amount?.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => append(DEFAULT_UTILITY)}
                  >
                    <Plus className="h-4 w-4" /> Add utility
                  </Button>
                </div>

                {create.isError && (
                  <p className="text-sm text-destructive">
                    {(create.error as Error).message}
                  </p>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={create.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={create.isPending}>
                    {create.isPending ? "Creating…" : "Create invoice"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading && !data && (
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

      {invoices.length > 0 && (
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

          <DataPagination meta={data?.meta} currentPage={page} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}