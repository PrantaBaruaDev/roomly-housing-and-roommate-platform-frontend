"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Trash2,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataPagination } from "@/components/shared/data-pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useProperties,
  useVerifyProperty,
} from "@/hooks/use-properties";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";
import { toPropertyCardVM } from "@/lib/adapters/property";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

type Tab = "all" | "verified" | "unverified";

export default function AdminPropertiesPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useProperties({ page });
  const verify = useVerifyProperty();
  const queryClient = useQueryClient();

  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    title: string;
    hard: boolean;
  } | null>(null);

  const softDelete = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/properties/${id}/delete`, { method: "PATCH" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
  });

  const hardDelete = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/properties/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
  });

  const properties = (data?.data ?? []).map(toPropertyCardVM);
  const filtered =
    tab === "all"
      ? properties
      : properties.filter((p) =>
          tab === "verified" ? p.isVerified : !p.isVerified,
        );

  function handleConfirmDelete() {
    if (!confirmDelete) return;
    const m = confirmDelete.hard ? hardDelete : softDelete;
    m.mutate(confirmDelete.id, {
      onSuccess: () => setConfirmDelete(null),
    });
  }

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Every listing across all owners."
      />

      <Tabs value={tab} onValueChange={(v) => { setTab(v as Tab); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading properties…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          Failed to load properties.
        </p>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No properties"
          description="Nothing matches this filter."
        />
      )}

      {filtered.length > 0 && (
        <>
          <Card className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/properties/${p.id}`}
                        className="hover:underline"
                      >
                        {p.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.ownerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.location.split(",").pop()?.trim() ?? "—"}
                    </TableCell>
                    <TableCell>{p.roomCount}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.createdAt}
                    </TableCell>
                    <TableCell>
                      {p.isVerified ? (
                        <Badge
                          variant="outline"
                          className="border-moss/30 bg-moss/10 text-moss"
                        >
                          <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber/30 bg-amber/10 text-amber"
                        >
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {!p.isVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verify.mutate(p.id)}
                            disabled={verify.isPending}
                          >
                            <ShieldCheck className="mr-1 h-3 w-3" /> Verify
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setConfirmDelete({
                              id: p.id,
                              title: p.title,
                              hard: false,
                            })
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <DataPagination
            meta={data?.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
        title="Delete property?"
        description={`"${confirmDelete?.title}" will be marked as deleted. Owners will no longer see it in their dashboard, but the data remains in the database.`}
        confirmLabel="Delete"
        variant="destructive"
        isPending={softDelete.isPending || hardDelete.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}