export interface RoomOccupant {
  id: string;
  roomId: string;
  roomNumber: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  tenantAvatarUrl?: string;
  tenantPhone?: string;
  moveInDate: string;
  isCurrentUser?: boolean;
}
