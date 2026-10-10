"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  DoorOpen,
  Key,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePropertyInventory } from "@/hooks/use-rooms";
import { toRoomBrowseVMs } from "@/lib/adapters/room";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";


const ROLES = [
  {
    key: "tenant",
    label: "For tenants",
    icon: DoorOpen,
    accent: "text-moss",
    accentBg: "bg-moss/10",
    tagline: "Find your next home",
    points: [
      "Browse available rooms with real photos and amenities",
      "Request a viewing and negotiate the date directly",
      "Apply once, pay securely via bKash when approved",
    ],
  },
  {
    key: "owner",
    label: "For owners",
    icon: Building2,
    accent: "text-brass",
    accentBg: "bg-brass/10",
    tagline: "Manage your properties",
    points: [
      "List buildings, flats, and rooms in one place",
      "Review applications, confirm viewings, track occupancy",
      "Issue monthly invoices and collect rent automatically",
    ],
  },
  {
    key: "admin",
    label: "For admins",
    icon: ShieldCheck,
    accent: "text-blueprint",
    accentBg: "bg-blueprint/10",
    tagline: "Oversee the platform",
    points: [
      "Verify property listings before they go live",
      "See every application, invoice, and payment",
      "Manage user accounts and resolve disputes",
    ],
  },
];

const STEPS = [
  {
    icon: Search,
    title: "Browse rooms",
    body: "Filter by city, rent, and availability. Every listing is verified before it appears.",
  },
  {
    icon: ClipboardList,
    title: "Request or apply",
    body: "Request a viewing to see the room in person, or apply directly with your move-in date.",
  },
  {
    icon: Key,
    title: "Move in",
    body: "Pay the first month via bKash. Your occupancy and roommates appear in your dashboard.",
  },
];

export default function PublicHomePage() {
  const { data, isLoading } = usePropertyInventory();
  const user = useAuthStore((s) => s.user);

  const allRooms = useMemo(
    () => toRoomBrowseVMs(data?.data ?? []),
    [data],
  );

  const availableRooms = useMemo(
    () => allRooms.filter((r) => r.isAvailable && r.availableCapacity > 0),
    [allRooms],
  );

  const stats = useMemo(() => {
    const cities = new Set(allRooms.map((r) => r.propertyCity));
    const minRent =
      availableRooms.length > 0
        ? Math.min(...availableRooms.map((r) => r.rent))
        : 0;
    return {
      rooms: availableRooms.length,
      cities: cities.size,
      minRent,
    };
  }, [allRooms, availableRooms]);

  const featured = useMemo(
    () => availableRooms.slice().sort((a, b) => a.rent - b.rent).slice(0, 6),
    [availableRooms],
  );

  const dashboardHref = user
    ? user.role === "ADMIN"
      ? "/admin"
      : user.role === "OWNER"
        ? "/owner"
        : "/tenant"
    : null;

  return (
    <div className="flex flex-col gap-20 pb-20">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.35]" />

        <div className="relative px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-5 gap-1 border-blueprint/30 bg-blueprint/5 text-blueprint"
            >
              <Sparkles className="h-3 w-3" />
              Every room has a number. Every tenant, a key.
            </Badge>

            <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              Find your room.
              <br />
              <span className="text-muted-foreground">Know your roommates.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Roomly connects property owners, tenants, and admins on one
              shared floor plan — from the first viewing request to the monthly
              invoice.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/browse">
                  Browse rooms <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              {dashboardHref ? (
                <Button asChild size="lg" variant="outline">
                  <Link href={dashboardHref}>Go to dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/register">Create an account</Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Live stats */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <Stat
                value={isLoading ? "—" : String(stats.rooms)}
                label="Rooms available"
              />
              <Stat
                value={isLoading ? "—" : String(stats.cities)}
                label="Cities"
              />
              <Stat
                value={
                  isLoading ? "—" : formatCurrency(stats.minRent)
                }
                label="Starting from"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          kicker="How it works"
          title="From search to signed lease, in three steps"
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-base font-medium">{step.title}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          kicker="One platform, three dashboards"
          title="Built for everyone in the building"
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.key} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-md ${role.accentBg} ${role.accent}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
                      {role.label}
                    </p>
                  </div>

                  <p className="mt-4 text-lg font-medium">{role.tagline}</p>

                  <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
                    {role.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span
                          className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${role.accent.replace("text-", "bg-")}`}
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              kicker="Live listings"
              title="Featured rooms right now"
              description="The most affordable rooms currently available on the platform."
            />
            <Button asChild variant="outline" size="sm">
              <Link href="/browse">
                View all {stats.rooms} rooms
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <Link href={`/browse/${room.id}`} className="block">
                  <div className="relative flex aspect-[4/3] items-center justify-center bg-blueprint/5 blueprint-grid">
                    {room.imageUrl ? (
                      <Image
                        src={room.imageUrl}
                        alt={room.propertyTitle}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span className="rounded-md border border-blueprint/20 bg-background px-2 py-1 font-mono-plan text-xs text-blueprint">
                        {room.roomNumber}
                      </span>
                    )}
                  </div>
                </Link>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {room.propertyTitle}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{room.propertyCity}</span>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-base leading-none">
                        {formatCurrency(room.rent)}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {room.bookingMode === "BOOK_BY_SEAT"
                          ? "per seat"
                          : "per month"}
                      </p>
                    </div>
                  </div>

                  {room.amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 2).map((a) => (
                        <Badge
                          key={a}
                          variant="secondary"
                          className="font-normal"
                        >
                          {a}
                        </Badge>
                      ))}
                      {room.amenities.length > 2 && (
                        <Badge variant="secondary" className="font-normal">
                          +{room.amenities.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-[0.15]" />

        <div className="relative flex flex-col items-start gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div className="max-w-xl">
            <p className="font-mono-plan text-[10px] uppercase tracking-wide opacity-70">
              Ready when you are
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              Your next room is one click away.
            </h2>
            <p className="mt-3 text-sm opacity-80 sm:text-base">
              Browse verified listings, request a viewing, and apply — all from
              a single dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link href="/browse">
                Browse rooms <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            {!user && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/register">Create an account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}