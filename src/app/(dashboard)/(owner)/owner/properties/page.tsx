"use client";

import { DoorOpen, MapPin, ShieldCheck, User } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CreatePropertyDialog } from "@/components/shared/create-property-dialog";
import { useOwnerProperties } from "@/hooks/use-properties";
import { toPropertyCardVM } from "@/lib/adapters/property";
import Link from "next/link";
import { DataPagination } from "@/components/shared/data-pagination";
import { useState } from "react";

export default function OwnerPropertiesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useOwnerProperties({ page });
  const properties = (data?.data ?? []).map(toPropertyCardVM);

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Manage your buildings, flats, and rooms."
        actions={<CreatePropertyDialog />}
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading properties…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load properties."}
        </p>
      )}

      {!isLoading && !isError && properties.length === 0 && (
        <EmptyState
          icon={DoorOpen}
          title="No properties yet"
          description="Create your first property to start listing rooms."
          action={<CreatePropertyDialog />}
        />
      )}

      {!isLoading && !isError && properties.length > 0 && (
        <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {properties.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="truncate">
                      {p.title}
                    </CardTitle>
                    {p.isVerified && (
                      <Badge
                        variant="outline"
                        className="border-moss/30 bg-moss/10 text-moss"
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </p>
                </div>
                <DoorOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {p.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-blueprint transition-all"
                      style={{ width: `${p.occupancyPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {p.occupiedRoomCount}/{p.roomCount} occupied
                  </span>
                </div>

                {p.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.amenities.slice(0, 3).map((a) => (
                      <Badge
                        key={a}
                        variant="secondary"
                        className="font-normal"
                      >
                        {a}
                      </Badge>
                    ))}
                    {p.amenities.length > 3 && (
                      <Badge variant="secondary" className="font-normal">
                        +{p.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{p.ownerName}</span>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/owner/properties/${p.id}`}>
                      View Property & Manage rooms
                    </Link>
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      p.availableRoomCount > 0
                        ? "border-moss/30 bg-moss/10 text-moss"
                        : "border-border text-muted-foreground"
                    }
                  >
                    {p.availableRoomCount > 0
                      ? `${p.availableRoomCount} rooms available`
                      : "Fully occupied"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {p.flatCount} {p.flatCount === 1 ? "flat" : "flats"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DataPagination meta={data?.meta} currentPage={page} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}