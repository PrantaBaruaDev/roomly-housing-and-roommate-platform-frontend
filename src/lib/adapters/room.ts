import type {
  ApiPropertyWithInventory,
  ApiRoom,
  FlatSectionVM,
  RoomCardVM,
  RoomBrowseVM
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

export function toRoomBrowseVMs(
  properties: ApiPropertyWithInventory[],
): RoomBrowseVM[] {
  const out: RoomBrowseVM[] = [];

  for (const property of properties) {
    const rooms = (property.rooms ?? []).filter((r) => !r.isDeleted);
    const flatsById = new Map(
      (property.flats ?? []).filter((f) => !f.isDeleted).map((f) => [f.id, f]),
    );

    for (const room of rooms) {
      if (!flatsById.has(room.flatId)) continue;

      out.push({
        id: room.id,
        propertyId: property.id,
        flatId: room.flatId,

        roomNumber: room.roomNumber,
        rent: Number(room.rentAmount),
        bookingMode: room.bookingMode,
        maxCapacity: room.maxCapacity,
        availableCapacity: room.availableCapacity,
        isAvailable: room.isAvailable,

        propertyTitle: property.title,
        propertyAddress: property.address,
        propertyCity: property.city,
        propertyType: property.propertyType,
        amenities: property.amenities ?? [],
        isVerified: property.isVerified,
        imageUrl: property.propertyImage,

        searchBlob: [
          room.roomNumber,
          property.title,
          property.address,
          property.city,
          ...(property.amenities ?? []),
        ]
          .join(" ")
          .toLowerCase(),
      });
    }
  }

  return out.sort((a, b) => a.rent - b.rent);
}