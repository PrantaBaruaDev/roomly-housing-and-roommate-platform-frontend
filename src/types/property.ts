import type { RoomStatus } from "@/lib/constants";

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coverImageUrl?: string;
  amenities: string[];
  flatCount: number;
  roomCount: number;
  availableRoomCount: number;
  createdAt: string;
  isVerified: boolean;
}

export interface Flat {
  id: string;
  propertyId: string;
  label: string; // e.g. "2B" — a literal floor label, not a decorative index
  floor: number;
  roomCount: number;
}

export interface Room {
  id: string;
  propertyId: string;
  flatId: string;
  flatLabel: string;
  roomNumber: string; // e.g. "R-204"
  monthlyRent: number;
  sizeSqft?: number;
  status: RoomStatus;
  photos: string[];
  description?: string;
}
