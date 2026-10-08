export type BackendApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type BackendPaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCEL"
  | "FAILED";

export type BackendPaymentProvider = "CARD" | "BKASH";
export type BackendBookingMode = "BOOK_BY_ROOM" | "BOOK_BY_SEAT";

export interface ApiRoomOccupantApplication {
  id: string;
  status: BackendApplicationStatus;
  agreedRentAmount: string;
  moveInDate: string;
}

export interface ApiRoomOccupantPayment {
  id: string;
  amount: string;
  status: BackendPaymentStatus;
  paidAt: string;
  gatewayTransactionId: string | null;
  paymentProvider: BackendPaymentProvider;
}

export interface ApiRoomOccupantRoom {
  id: string;
  propertyId: string;
  flatId: string;
  roomNumber: string;
  rentAmount: string;
  bookingMode: BackendBookingMode;
}

export interface ApiRoomOccupantProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  ownerId: string;
  propertyImage: string | null;
}

export interface ApiRoomOccupantUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiRoomOccupant {
  id: string;
  roomId: string;
  applicationId: string;
  paymentId: string;
  tenantId: string;
  movedInAt: string;
  movedOutAt: string | null;
  createdAt: string;
  updatedAt: string;

  application: ApiRoomOccupantApplication;
  payment: ApiRoomOccupantPayment | null;
  room: ApiRoomOccupantRoom;
  property: ApiRoomOccupantProperty;
  tenant: ApiRoomOccupantUser;
  owner: ApiRoomOccupantUser;
}

export interface RoomOccupantCardVM {
  id: string;

  tenantName: string;
  tenantEmail: string;

  roomNumber: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string | null;
  bookingMode: BackendBookingMode;

  rent: number;
  moveInDate: string;
  movedOutDate: string | null;
  isActive: boolean;

  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentStatusRaw: BackendPaymentStatus | null;
  paymentProvider: BackendPaymentProvider | null;
  gatewayTransactionId: string | null;
  paidAt: string | null;
}