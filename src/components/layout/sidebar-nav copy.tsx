"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CONFIG, ROLE_LABEL, type NavItem } from "./nav-config";
import type { Role } from "@/lib/constants";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href + "/"));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "" : "text-muted-foreground group-hover:text-foreground")} />
      {item.label}
    </Link>
  );
}

export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href={`/${role}`} className="flex items-center gap-2 px-2 pb-6 pt-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <DoorOpen className="h-4 w-4" />
        </span>
        <div className="leading-none">
          <p className="font-display text-lg">Roomly</p>
          <p className="text-[11px] text-muted-foreground">{ROLE_LABEL[role]}</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_CONFIG[role].map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="rule mt-4 pt-4">
        <p className="px-2 text-[11px] text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{ROLE_LABEL[role]}</span>
        </p>
      </div>
    </div>
  );
}
