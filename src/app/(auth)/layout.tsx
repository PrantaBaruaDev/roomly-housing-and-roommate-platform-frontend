import type { ReactNode } from "react";
import { DoorOpen } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
        <Navbar />
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 md:h-[80vh]">
        {/* Left Side: Hero Section (Visible on Mobile & Desktop) */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-blueprint px-3 py-10 md:px-6 md:py-12 text-center text-blueprint-foreground sm:px-10 lg:px-12">
          {/* Grid background overlay */}
          <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-40" />

          {/* Centered Content Wrapper */}
          <div className="relative z-10 max-w-md space-y-4">
            <p className="font-display text-3xl sm:text-4xl leading-[1.15] text-balance">
              Every room has a number. Every tenant, a key.
            </p>
            <p className="text-sm text-black/70 text-balance">
              Roomly keeps property owners, tenants, and admins working from the
              same floor plan — from the first viewing request to the monthly
              invoice.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex items-center justify-center px-3 py-5 mb-15 md:mb-0 md:px-6 md:py-12 lg:py-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

function RoomPlanMark() {
  return (
    <svg viewBox="0 0 320 140" className="relative h-28 w-full text-white/25" fill="none">
      <rect x="1" y="1" width="98" height="78" stroke="currentColor" />
      <rect x="99" y="1" width="70" height="78" stroke="currentColor" />
      <rect x="169" y="1" width="150" height="45" stroke="currentColor" />
      <rect x="169" y="46" width="150" height="33" stroke="currentColor" />
      <rect x="1" y="79" width="150" height="60" stroke="currentColor" />
      <rect x="151" y="79" width="168" height="60" stroke="currentColor" />
      <text x="14" y="20" fill="currentColor" fontSize="10" fontFamily="var(--font-mono-plan)">R-101</text>
      <text x="112" y="20" fill="currentColor" fontSize="10" fontFamily="var(--font-mono-plan)">R-102</text>
      <text x="182" y="20" fill="currentColor" fontSize="10" fontFamily="var(--font-mono-plan)">R-103</text>
      <text x="14" y="98" fill="currentColor" fontSize="10" fontFamily="var(--font-mono-plan)">R-104</text>
      <text x="163" y="98" fill="currentColor" fontSize="10" fontFamily="var(--font-mono-plan)">R-105</text>
    </svg>
  );
}
