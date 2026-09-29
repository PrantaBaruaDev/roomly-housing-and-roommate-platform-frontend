export const ROLES = ["ADMIN", "OWNER", "TENANT"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  TENANT: "TENANT",
} as const;

export const APPLICATION_STATUS = ["pending", "accepted", "rejected", "withdrawn"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUS)[number];

export const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const INVOICE_STATUS = ["draft", "issued", "paid", "overdue"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUS)[number];

export const VIEW_REQUEST_STATUS = ["requested", "countered", "confirmed", "declined", "completed"] as const;
export type ViewRequestStatus = (typeof VIEW_REQUEST_STATUS)[number];

export const ROOM_STATUS = ["available", "reserved", "occupied", "maintenance"] as const;
export type RoomStatus = (typeof ROOM_STATUS)[number];

/** Single source of truth for status -> label/color so badges stay consistent everywhere. */
export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber/10 text-amber border-amber/30" },
  requested: { label: "Requested", className: "bg-amber/10 text-amber border-amber/30" },
  countered: { label: "Countered", className: "bg-brass/10 text-brass border-brass/30" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  accepted: { label: "Accepted", className: "bg-moss/10 text-moss border-moss/30" },
  confirmed: { label: "Confirmed", className: "bg-moss/10 text-moss border-moss/30" },
  paid: { label: "Paid", className: "bg-moss/10 text-moss border-moss/30" },
  issued: { label: "Issued", className: "bg-blueprint/10 text-blueprint border-blueprint/30" },
  completed: { label: "Completed", className: "bg-blueprint/10 text-blueprint border-blueprint/30" },
  available: { label: "Available", className: "bg-moss/10 text-moss border-moss/30" },
  occupied: { label: "Occupied", className: "bg-blueprint/10 text-blueprint border-blueprint/30" },
  reserved: { label: "Reserved", className: "bg-amber/10 text-amber border-amber/30" },
  maintenance: { label: "Maintenance", className: "bg-destructive/10 text-destructive border-destructive/30" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/30" },
  declined: { label: "Declined", className: "bg-destructive/10 text-destructive border-destructive/30" },
  withdrawn: { label: "Withdrawn", className: "bg-muted text-muted-foreground border-border" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/30" },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/30" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground border-border" },
};

