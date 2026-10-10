"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  User,
  DoorOpen,
  CalendarDays,
  Home,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyableId } from "@/components/shared/copyable-id";
import { useProperty, useVerifyProperty } from "@/hooks/use-properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";
import { toPropertyCardVM } from "@/lib/adapters/property";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EditPropertyDialog } from "@/components/shared/edit-property-dialog";
import { Pencil } from "lucide-react";

export default function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useProperty(id);
  const verify = useVerifyProperty();

  const [editOpen, setEditOpen] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{
    hard: boolean;
  } | null>(null);

  const softDelete = useMutation({
    mutationFn: () =>
      apiClient(`/properties/${id}/delete`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      router.push("/admin/properties");
    },
  });

  const hardDelete = useMutation({
    mutationFn: () => apiClient(`/properties/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      router.push("/admin/properties");
    },
  });

  const err = error as { status?: number; message?: string } | null;
  const property = data ? toPropertyCardVM(data) : null;

  const raw = data as any;

  function handleConfirmDelete() {
    if (!confirmDelete) return;
    const m = confirmDelete.hard ? hardDelete : softDelete;
    m.mutate(undefined, {
      onSuccess: () => setConfirmDelete(null),
    });
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading property…
        </p>
      )}

      {isError && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium">
              {err?.status === 404
                ? "Property not found"
                : "Couldn't load property"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {err?.message ?? "Please try again."}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/admin/properties">Back to properties</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {property && (
        <>
          <PageHeader
            title={property.title}
            description={property.location}
            actions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="mr-1 h-3 w-3" /> Edit
                </Button>

                {!property.isVerified && (
                  <Button
                    size="sm"
                    onClick={() => verify.mutate(id)}
                    disabled={verify.isPending}
                  >
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verify
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmDelete({ hard: false })}
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Verification
                    </p>
                    <div className="mt-1">
                      {property.isVerified ? (
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
                          <ShieldAlert className="mr-1 h-3 w-3" /> Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Property type
                    </p>
                    <p className="mt-1 text-sm font-medium capitalize">
                      {property.propertyType.toLowerCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={MapPin}
                    label="Address"
                    value={property.location}
                  />
                  <InfoRow
                    icon={Building2}
                    label="City"
                    value={property.location.split(",").pop()?.trim() ?? "—"}
                  />
                </CardContent>
              </Card>

              {property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {property.amenities.map((a) => (
                        <Badge
                          key={a}
                          variant="secondary"
                          className="font-normal"
                        >
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Stat
                      label="Flats"
                      value={property.flatCount}
                      icon={Layers}
                    />
                    <Stat
                      label="Total rooms"
                      value={property.roomCount}
                      icon={DoorOpen}
                    />
                    <Stat
                      label="Available"
                      value={property.availableRoomCount}
                      icon={Home}
                    />
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/properties/${id}/rooms`}>
                        <DoorOpen className="mr-1 h-3 w-3" /> View rooms
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Owner</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={User}
                    label="Name"
                    value={property.ownerName}
                    sub={property.ownerEmail}
                  />
                  {raw?.owner?.phone && (
                    <InfoRow
                      icon={User}
                      label="Phone"
                      value={raw.owner.phone}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={CalendarDays}
                    label="Created"
                    value={formatDate(raw?.createdAt)}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label="Updated"
                    value={formatDate(raw?.updatedAt)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 text-xs">
                  <CopyableId id={id} label="Property" />
                  {property.ownerId && (
                    <CopyableId id={property.ownerId} label="Owner" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <ConfirmDialog
            open={Boolean(confirmDelete)}
            onOpenChange={(v) => !v && setConfirmDelete(null)}
            title="Delete this property?"
            description={
              confirmDelete?.hard
                ? `This will permanently remove "${property.title}" and all its flats, rooms, and related records. This cannot be undone.`
                : `"${property.title}" will be marked as deleted. Owners will no longer see it, but the data stays in the database.`
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={softDelete.isPending || hardDelete.isPending}
            onConfirm={handleConfirmDelete}
          />

          <EditPropertyDialog
            property={
              property && data
                ? {
                    id,
                    title: property.title,
                    description: property.description,
                    address: raw.address ?? "",
                    city: raw.city ?? "",
                    propertyType: property.propertyType,
                    amenities: property.amenities,
                  }
                : null
            }
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof User;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof User;
}) {
  return (
    <div className="rounded-md border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 font-display text-xl tabular-nums">{value}</p>
    </div>
  );
}