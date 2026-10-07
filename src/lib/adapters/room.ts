import type {
  ApiPropertyWithInventory,
  ApiRoom,
  FlatSectionVM,
  RoomCardVM,
} from "@/types/room";

function toRoomCardVM(r: ApiRoom): RoomCardVM {
  const max = Math.max(0, r.maxCapacity);
  const avail = Math.max(0, Math.min(r.availableCapacity, max));
  const occupied = Math.max(0, max - avail);
  const pct = max > 0 ? (occupied / max) * 100 : 0;

  return {
    id: r.id,
    flatId: r.flatId,
    roomNumber: r.roomNumber,
    rent: Number(r.rentAmount),
    bookingMode: r.bookingMode,
    maxCapacity: max,
    availableCapacity: avail,
    occupied,
    isAvailable: r.isAvailable,
    occupancyPct: pct,
  };
}

export function toFlatSectionVMs(
  property: ApiPropertyWithInventory,
): FlatSectionVM[] {
  const flats = (property.flats ?? []).filter((f) => !f.isDeleted);
  const rooms = (property.rooms ?? []).filter((r) => !r.isDeleted);

  return flats
    .map((flat) => {
      const flatRooms = rooms
        .filter((r) => r.flatId === flat.id)
        .slice()
        .sort((a, b) =>
          a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }),
        )
        .map(toRoomCardVM);

      return {
        id: flat.id,
        flatName: flat.flatName,
        floorNumber: flat.floorNumber,
        rooms: flatRooms,
        roomCount: flatRooms.length,
        availableRoomCount: flatRooms.filter((r) => r.isAvailable).length,
      };
    })
    .sort((a, b) => a.floorNumber - b.floorNumber);
}