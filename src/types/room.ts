import type { ApiProperty } from "@/types/property";

export type BackendBookingMode = "BOOK_BY_ROOM" | "BOOK_BY_SEAT";

export interface ApiFlat {
  id: string;
  propertyId: string;
  flatName: string;
  floorNumber: number;
  totalRooms: number | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiRoom {
  id: string;
  propertyId: string;
  flatId: string;
  roomNumber: string;
  rentAmount: string;
  bookingMode: BackendBookingMode;
  maxCapacity: number;
  availableCapacity: number;
  isAvailable: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPropertyWithInventory extends ApiProperty {
  flats: ApiFlat[];
  rooms: ApiRoom[];
}

export interface RoomCardVM {
  id: string;
  flatId: string;
  roomNumber: string;
  rent: number;
  bookingMode: BackendBookingMode;
  maxCapacity: number;
  availableCapacity: number;
  occupied: number;
  isAvailable: boolean;
  occupancyPct: number;
}

export interface FlatSectionVM {
  id: string;
  flatName: string;
  floorNumber: number;
  rooms: RoomCardVM[];
  roomCount: number;
  availableRoomCount: number;
}