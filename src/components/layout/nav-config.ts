import {
  LayoutGrid,
  Building2,
  ClipboardList,
  Users,
  ShoppingBag,
  Receipt,
  CalendarClock,
  Search,
  CreditCard,
  DoorOpen,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import type { Role } from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
}

export const PUBLIC_NAVBAR = [
  { label: "Home", href: "/" },
  { label: "Browse rooms", href: "/browse" },
];

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Overview", href: "/admin", icon: LayoutGrid },
    { label: "Properties", href: "/admin/properties", icon: Building2 },
    { label: "Applications", href: "/admin/applications", icon: ClipboardList },
    { label: "Users", href: "/admin/users", icon: Users },
  ],
  OWNER: [
    { label: "Overview", href: "/owner", icon: LayoutGrid },
    { label: "Properties", href: "/owner/properties", icon: Building2 },
    { label: "Applications", href: "/owner/applications", icon: ClipboardList },
    { label: "View requests", href: "/owner/view-requests", icon: CalendarClock },
    { label: "Room occupants", href: "/owner/room-occupants", icon: KeyRound },
    { label: "Invoices", href: "/owner/invoices", icon: Receipt },
  ],
  TENANT: [
    { label: "Overview", href: "/tenant", icon: LayoutGrid },
    { label: "My applications", href: "/tenant/applications", icon: ShoppingBag },
    { label: "View requests", href: "/tenant/view-requests", icon: CalendarClock },
    { label: "Payments", href: "/tenant/payments", icon: CreditCard },
    { label: "Invoices", href: "/tenant/invoices", icon: Receipt },
    { label: "Roommates", href: "/tenant/roommates", icon: DoorOpen },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  OWNER: "Property owner",
  TENANT: "Tenant",
};

export const ROLE_ICON: Record<Role, typeof LayoutGrid> = {
  ADMIN: ShieldCheck,
  OWNER: Building2,
  TENANT: DoorOpen,
};
