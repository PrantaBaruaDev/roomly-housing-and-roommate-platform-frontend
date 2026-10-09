import Link from "next/link";
import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicTopbar } from "@/components/layout/public-topbar";
import { Navbar } from "@/components/layout/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
       <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}