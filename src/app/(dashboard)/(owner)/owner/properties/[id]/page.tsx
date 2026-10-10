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
  Pencil,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyableId } from "@/components/shared/copyable-id";
import { EditPropertyDialog } from "@/components/shared/edit-property-dialog";
import { useProperty } from "@/hooks/use-properties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/hooks/query-keys";
import { toPropertyCardVM } from "@/lib/adapters/property";
import { formatDate } from "@/lib/utils";

export default function OwnerPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useProperty(id);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  /* Owner-scoped soft delete: mark the property as deleted */
  const softDelete = useMutation({
    mutationFn: () =>
      apiClient(`/properties/${id}/delete`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      router.push("/owner/properties");
    },
  });

  const err = error as { status?: number; message?: string } | null;
  const property = data ? toPropertyCardVM(data) : null;
  const raw = data as any;

  function handleConfirmDelete() {
    softDelete.mutate(undefined, {
      onSuccess: () => setConfirmDelete(false),
    });
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/owner/properties">
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
              {err?.status === 403
                ? "You don't have access to this property"
                : err?.status === 404
                  ? "Property not found"
                  : "Couldn't load this property"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {err?.message ?? "Please try again."}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/owner/properties">Back to properties</Link>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left column */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Verification + type */}
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
                          <ShieldAlert className="mr-1 h-3 w-3" /> Awaiting
                          verification
                        </Badge>
                      )}
                    </div>
                    {!property.isVerified && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        An admin will review and verify this listing.
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Type
                    </p>
                    <p className="mt-1 text-sm font-medium capitalize">
                      {property.propertyType.toLowerCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
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

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={MapPin}
                    label="Address"
                    value={raw?.address ?? property.location}
                  />
                  <InfoRow
                    icon={Building2}
                    label="City"
                    value={raw?.city ?? "—"}
                  />
                </CardContent>
              </Card>

              {/* Amenities */}
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

              {/* Inventory */}
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
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/owner/properties/${id}/rooms`}>
                        <DoorOpen className="mr-1 h-3 w-3" /> Manage rooms
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Owner */}
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

              {/* Metadata */}
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

              {/* References */}
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

          {/* Edit dialog */}
          <EditPropertyDialog
            property={
              property && data
                ? {
                    id,
                    title: property.title,
                    description: property.description,
                    address: raw?.address ?? "",
                    city: raw?.city ?? "",
                    propertyType: property.propertyType,
                    amenities: property.amenities,
                  }
                : null
            }
            open={editOpen}
            onOpenChange={setEditOpen}
          />

          {/* Delete confirmation */}
          <ConfirmDialog
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Delete this property?"
            description={`"${property.title}" will be marked as deleted. It will no longer appear in your listings or in tenant searches, but the data stays in the database.`}
            confirmLabel="Delete"
            variant="destructive"
            isPending={softDelete.isPending}
            onConfirm={handleConfirmDelete}
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