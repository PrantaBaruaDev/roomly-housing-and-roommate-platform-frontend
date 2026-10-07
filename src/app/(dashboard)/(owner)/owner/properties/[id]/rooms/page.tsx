"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, DoorOpen, Layers } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { FlatSection } from "@/components/shared/flat-section";
import { CreateFlatDialog } from "@/components/shared/create-flat-dialog";
import { EditRoomDialog } from "@/components/shared/edit-room-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toFlatSectionVMs } from "@/lib/adapters/room";
import type { FlatSectionVM, RoomCardVM } from "@/types/room";
import type { AddRoomsValues, EditFlatValues, EditRoomValues } from "@/schemas/property.schema";
import { useCreateFlatWithRooms, useDeleteRoom, usePropertyInventory, useUpdateRoom, 
  useUpdateFlat, 
  useAddRooms} from "@/hooks/use-rooms";
import { EditFlatDialog } from "@/components/shared/edit-flat-dialog";
import { AddRoomsDialog } from "@/components/shared/add-rooms-dialog";


export default function PropertyRoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: propertyId } = use(params);

  const { data, isLoading, isError, error } = usePropertyInventory();
  const create = useCreateFlatWithRooms();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const updateFlat = useUpdateFlat();
  const addRooms = useAddRooms();

  const property = data?.data?.find((p) => p.id === propertyId);
  const sections = property ? toFlatSectionVMs(property) : [];

  const totalRooms = sections.reduce((n, s) => n + s.roomCount, 0);
  const availableRooms = sections.reduce(
    (n, s) => n + s.availableRoomCount,
    0,
  );

  const [editingRoom, setEditingRoom] = useState<RoomCardVM | null>(null);

  const [deletingRoom, setDeletingRoom] = useState<RoomCardVM | null>(null);
  const [editingFlat, setEditingFlat] = useState<FlatSectionVM | null>(null);
  const [addingRoomsTo, setAddingRoomsTo] = useState<FlatSectionVM | null>(null);

  function handleEditSubmit(values: EditRoomValues) {
    if (!editingRoom) return;
    updateRoom.mutate(
      { id: editingRoom.id, ...values },
      {
        onSuccess: () => setEditingRoom(null),
      },
    );
  }

  function handleDeleteConfirm() {
    if (!deletingRoom) return;
    deleteRoom.mutate(deletingRoom.id, {
      onSuccess: () => setDeletingRoom(null),
    });
  }

  function handleEditFlatSubmit(values: EditFlatValues) {
    if (!editingFlat) return;
    updateFlat.mutate(
      { id: editingFlat.id, ...values },
      { onSuccess: () => setEditingFlat(null) },
    );
  }

  function handleAddRoomsSubmit(values: AddRoomsValues) {
    addRooms.mutate(values, {
      onSuccess: () => setAddingRoomsTo(null),
    });
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/owner/properties">
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
      </Button>

      <PageHeader
        title={property?.title ?? "Manage rooms"}
        description={
          property
            ? `${property.address}, ${property.city}`
            : "Loading property…"
        }
        actions={
          <CreateFlatDialog
            propertyId={propertyId}
            isPending={create.isPending}
            onSubmit={(values) => create.mutate(values)}
          />
        }
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading inventory…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load rooms."}
        </p>
      )}

      {!isLoading && !isError && !property && (
        <p className="py-16 text-center text-sm text-destructive">
          Property not found or you don&apos;t have access to it.
        </p>
      )}

      {property && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Flats"
              value={sections.length}
              icon={Layers}
              accent="blueprint"
            />
            <StatCard
              label="Total rooms"
              value={totalRooms}
              icon={DoorOpen}
              accent="brass"
            />
            <StatCard
              label="Available"
              value={availableRooms}
              hint={`${totalRooms - availableRooms} occupied`}
              icon={DoorOpen}
              accent="moss"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {sections.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No flats yet"
                description="Create a flat and add rooms to start listing this property."
                action={
                  <CreateFlatDialog
                    propertyId={propertyId}
                    isPending={create.isPending}
                    onSubmit={(values) => create.mutate(values)}
                  />
                }
              />
            ) : (
              sections.map((flat) => (
                <FlatSection
                  key={flat.id}
                  flat={flat}
                  isMutating={
                    updateRoom.isPending ||
                    deleteRoom.isPending ||
                    updateFlat.isPending
                  }
                  onEditRoom={(room) => setEditingRoom(room)}
                  onDeleteRoom={(room) => setDeletingRoom(room)}
                  onEditFlat={(f) => setEditingFlat(f)}
                  onAddRooms={(f) => setAddingRoomsTo(f)}
                />
              ))
            )}
          </div>
        </>
      )}

      <EditRoomDialog
        room={editingRoom}
        open={Boolean(editingRoom)}
        onOpenChange={(open) => {
          if (!open) setEditingRoom(null);
        }}
        onSubmit={handleEditSubmit}
        isPending={updateRoom.isPending}
      />

      <ConfirmDialog
        open={Boolean(deletingRoom)}
        onOpenChange={(open) => {
          if (!open) setDeletingRoom(null);
        }}
        title="Delete this room?"
        description={
          deletingRoom
            ? `Room ${deletingRoom.roomNumber} will be removed permanently. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete room"
        variant="destructive"
        isPending={deleteRoom.isPending}
        onConfirm={handleDeleteConfirm}
      />

      <EditFlatDialog
        flat={editingFlat}
        open={Boolean(editingFlat)}
        onOpenChange={(open) => {
          if (!open) setEditingFlat(null);
        }}
        onSubmit={handleEditFlatSubmit}
        isPending={updateFlat.isPending}
      />

      <AddRoomsDialog
        flat={addingRoomsTo}
        open={Boolean(addingRoomsTo)}
        onOpenChange={(open) => {
          if (!open) setAddingRoomsTo(null);
        }}
        onSubmit={handleAddRoomsSubmit}
        isPending={addRooms.isPending}
      />
    </div>
  );
}