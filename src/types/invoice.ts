import type { InvoiceStatus } from "@/lib/constants";

export interface InvoiceLineItem {
  id: string;
  label: string; // "Room rent", "Electricity", "Water", "Maintenance", ...
  amount: number;
  kind: "rent" | "utility" | "maintenance" | "other";
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  roomId: string;
  roomNumber: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  period: string; // "2026-09"
  lineItems: InvoiceLineItem[];
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt?: string;
  paidAt?: string;
}
