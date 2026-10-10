import type { ApiProperty, PropertyCardVM } from "@/types/property";
import { formatDate } from "@/lib/utils";

export function toPropertyCardVM(p: ApiProperty): PropertyCardVM {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    location: [p.address, p.city].filter(Boolean).join(", "),
    ownerId: p.ownerId,
    ownerName: p.owner?.name ?? "Unknown owner",
    ownerEmail: p.owner?.email ?? "",
    imageUrl: p.propertyImage,
    createdAt: formatDate(p.createdAt),

    roomCount: p.roomCount,
    availableRoomCount: p.availableRoomCount,
    occupiedRoomCount: p.occupiedRoomCount,
    occupancyPct:
      p.roomCount > 0 ? (p.occupiedRoomCount / p.roomCount) * 100 : 0,
    flatCount: p.flatCount,

    amenities: p.amenities ?? [],
    isVerified: p.isVerified,
    propertyType: p.propertyType,
  };
}