import Link from "next/link";
import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicTopbar } from "@/components/layout/public-topbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
        <Link href="/browse" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <DoorOpen className="h-4 w-4" />
          </span>
          <span className="font-display text-lg">Roomly</span>
        </Link>

        <div className="flex-1" />

        <PublicTopbar />
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}