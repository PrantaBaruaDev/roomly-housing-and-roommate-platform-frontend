import type { ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";
import type { Role } from "@/lib/constants";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";

export function DashboardShell({ role, children }: { role: Role; children: ReactNode }) {
  return (
    <TooltipProvider>
    <SidebarProvider>
      <SidebarNav role={role} />

      <section className="">
      {/* <SidebarTrigger/> */}
        <Topbar role={role} />
        <main className="mx-auto w-dvw px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]
          md:w-[90vw] md:ml-6
          lg:w-[80vw] lg:px-8
        ">
          {children}
          <Toaster position="top-right" richColors />
        </main>
      </section>
    </SidebarProvider>
    </TooltipProvider>
  );
}
