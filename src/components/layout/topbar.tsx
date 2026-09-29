"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { initials } from "@/lib/utils";
import type { Role } from "@/lib/constants";
import { SidebarTrigger } from "../ui/sidebar";

export function Topbar({ role }: { role: Role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur pt-[env(safe-area-inset-top,0px)] lg:px-6">
      <SidebarTrigger/>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">{user?.name ?? "Guest"}</p>
          <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
        </div>
        <Avatar>
          <AvatarImage src={user?.avatarUrl} alt={user?.name} />
          <AvatarFallback>{user?.name ? initials(user.name) : "?"}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" onClick={() => logout.mutate()} aria-label="Log out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
