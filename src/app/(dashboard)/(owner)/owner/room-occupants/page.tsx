"use client";

import { useState } from "react";
import { DoorOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { DataPagination } from "@/components/shared/data-pagination";
import { RoomOccupantCard } from "@/components/shared/room-occupant-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoomOccupants } from "@/hooks/use-room-occupants";
import { toRoomOccupantCardVM } from "@/lib/adapters/room-occupant";

type Filter = "all" | "active" | "past";

export default function OwnerRoomOccupantsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");

  const { data, isLoading, isError, error } = useRoomOccupants({ page });
  const occupants = (data?.data ?? []).map(toRoomOccupantCardVM);

  const filtered = occupants.filter((o) =>
    filter === "all" ? true : filter === "active" ? o.isActive : !o.isActive,
  );

  const activeCount = occupants.filter((o) => o.isActive).length;
  const pastCount = occupants.length - activeCount;

  return (
    <div>
      <PageHeader
        title="Room occupants"
        description="Who is currently living in each of your rooms."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total records"
          value={data?.meta?.total ?? occupants.length}
          icon={DoorOpen}
          accent="blueprint"
        />
        <StatCard
          label="Active tenants"
          value={activeCount}
          icon={DoorOpen}
          accent="moss"
        />
        <StatCard
          label="Moved out"
          value={pastCount}
          icon={DoorOpen}
          accent="destructive"
        />
      </div>

      {/* Filter tabs */}
      <div className="mt-6">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Moved out</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading occupants…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load occupants."}
        </p>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={DoorOpen}
          title={
            filter === "all"
              ? "No room occupants yet"
              : filter === "active"
                ? "No active tenants"
                : "No past occupants"
          }
          description={
            filter === "all"
              ? "Once a tenant's payment completes, their occupancy record will appear here."
              : "Nothing matches this filter."
          }
        />
      )}

      {filtered.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((occ) => (
              <RoomOccupantCard
                key={occ.id}
                occupant={occ}
                viewerRole="owner"
              />
            ))}
          </div>

          <DataPagination
            meta={data?.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}