import type { PaymentStatus } from "@/lib/constants";

export interface Payment {
  id: string;
  applicationId: string;
  invoiceId?: string;
  roomId: string;
  roomNumber: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  method: "card" | "bank_transfer" | "mobile_wallet";
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}
