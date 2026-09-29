"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CONFIG, ROLE_LABEL, type NavItem } from "./nav-config";
import type { Role } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

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
  const pathname = usePathname();
  const navItems = NAV_CONFIG[role] ?? [];
  
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
                  R
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Roomly App</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {role} Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}
                      className="
                        data-[active=true]:bg-black data-[active=true]:text-white
                        hover:bg-gray-200
                      "
                    >
                      <Link 
                        href={item.href} 
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
