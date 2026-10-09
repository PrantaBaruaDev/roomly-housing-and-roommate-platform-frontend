"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DoorOpen, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataPagination } from "@/components/shared/data-pagination";
import { PublicRoomCard } from "@/components/shared/public-room-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePropertyInventory } from "@/hooks/use-rooms";
import { toRoomBrowseVMs } from "@/lib/adapters/room";
import { useRequireTenant } from "@/hooks/use-require-tenant";
import { formatCurrency, cn } from "@/lib/utils";

const ROOMS_PER_PAGE = 9;

type SortKey = "rent-asc" | "rent-desc";

export default function PublicBrowsePage() {
  const router = useRouter();
  const requireTenant = useRequireTenant();

  const { data, isLoading, isError, error } = usePropertyInventory();

  const availableRooms = useMemo(() => {
    const props = data?.data ?? [];

    if (typeof window !== "undefined") {
      console.log("[browse] properties returned:", props.length);
      console.log("[browse] first property:", props[0]);
    }

    return toRoomBrowseVMs(props).filter(
      (r) => r.isAvailable && r.availableCapacity > 0,
    );
  }, [data]);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState<SortKey>("rent-asc");
  const [page, setPage] = useState(1);

  const cities = useMemo(() => {
    const set = new Set(availableRooms.map((r) => r.propertyCity));
    return ["all", ...Array.from(set).sort()];
  }, [availableRooms]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const result = availableRooms.filter((r) => {
      if (city !== "all" && r.propertyCity !== city) return false;
      if (q && !r.searchBlob.includes(q)) return false;
      return true;
    });

    return result.slice().sort((a, b) =>
      sort === "rent-asc" ? a.rent - b.rent : b.rent - a.rent,
    );
  }, [availableRooms, search, city, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ROOMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * ROOMS_PER_PAGE,
    safePage * ROOMS_PER_PAGE,
  );

  const meta = {
    page: safePage,
    limit: ROOMS_PER_PAGE,
    total,
    totalPages,
  };

  function handleApply(roomId: string) {
    const returnTo = `/tenant/applications/new?roomId=${roomId}`;
    const gate = requireTenant(returnTo);
    if (!gate.ok) {
      if (gate.reason === "wrong-role") {
        alert(
          "Only tenants can apply for rooms. Please sign in with a tenant account.",
        );
      }
      return;
    }
    router.push(returnTo);
  }

  function handleRequestView(roomId: string) {
    const returnTo = `/tenant/view-requests/new?roomId=${roomId}`;
    const gate = requireTenant(returnTo);
    if (!gate.ok) {
      if (gate.reason === "wrong-role") {
        alert(
          "Only tenants can request viewings. Please sign in with a tenant account.",
        );
      }
      return;
    }
    router.push(returnTo);
  }

  const minRent =
    availableRooms.length > 0
      ? Math.min(...availableRooms.map((r) => r.rent))
      : 0;

  return (
    <div>
      <PageHeader
        title="Find your next room"
        description="Browse available rooms — apply directly or request a viewing."
      />

      {availableRooms.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
            <Home className="h-3 w-3" /> {availableRooms.length} rooms available
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
            <DoorOpen className="h-3 w-3" /> from {formatCurrency(minRent)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
            <MapPin className="h-3 w-3" /> {cities.length - 1}{" "}
            {cities.length - 1 === 1 ? "city" : "cities"}
          </span>
        </div>
      )}

      {/* Search / filter row */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by city, property, room number, or amenity"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All cities" : c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="rent-asc">Rent: low to high</option>
          <option value="rent-desc">Rent: high to low</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading available rooms…
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load rooms."}
        </p>
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={Home}
          title="No rooms available right now"
          description="Check back later, or try clearing your search."
          action={
            search || city !== "all" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCity("all");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Results */}
      {paged.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((room) => (
              <PublicRoomCard
                key={room.id}
                room={room}
                onApply={handleApply}
                onRequestView={handleRequestView}
              />
            ))}
          </div>

          <DataPagination
            meta={meta}
            currentPage={safePage}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}