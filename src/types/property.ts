import type { RoomStatus } from "@/lib/constants";

export type BackendPropertyType = "RESIDENTIAL" | "COMMERCIAL" | "MIXED";

export interface ApiOwnerSummary {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ApiProperty {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  ownerId: string;
  owner: ApiOwnerSummary;
  propertyImage: string | null;
  imagePublicID: string | null;
  propertyType: BackendPropertyType;
  amenities: string[];
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  roomCount: number;
  availableRoomCount: number;
  occupiedRoomCount: number;
  flatCount: number;
}

export interface PropertyCardVM {
  id: string;
  title: string;
  description: string;
  location: string;
  ownerName: string;
  ownerEmail: string;
  imageUrl: string | null;
  createdAt: string;

  roomCount: number;
  availableRoomCount: number;
  occupiedRoomCount: number;
  occupancyPct: number;
  flatCount: number;

  amenities: string[];
  isVerified: boolean;
  propertyType: BackendPropertyType;
}

export interface Flat {
  id: string;
  propertyId: string;
  label: string;
  floor: number;
  roomCount: number;
}

export interface Room {
  id: string;
  propertyId: string;
  flatId: string;
  flatLabel: string;
  roomNumber: string;
  monthlyRent: number;
  sizeSqft?: number;
  status: RoomStatus;
  photos: string[];
  description?: string;
}