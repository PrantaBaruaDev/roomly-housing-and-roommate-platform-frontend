import { Search, MapPin, BedDouble } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const rooms = [
  { id: "1", roomNumber: "R-204", property: "Birchwood House", city: "Austin, TX", rent: 1450, size: 180, amenities: ["Furnished", "En-suite bath"] },
  { id: "2", roomNumber: "R-102", property: "Elm Street Flats", city: "Austin, TX", rent: 1180, size: 150, amenities: ["Shared kitchen"] },
  { id: "3", roomNumber: "R-301", property: "Maple Court", city: "Denver, CO", rent: 1320, size: 165, amenities: ["Balcony", "Furnished"] },
  { id: "4", roomNumber: "R-110", property: "Riverside Cottages", city: "Denver, CO", rent: 990, size: 140, amenities: ["Pet friendly"] },
];

export default function TenantBrowsePage() {
  return (
    <div>
      <PageHeader title="Browse rooms" description="Find a room that fits — then request a viewing or apply directly." />

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by city or property" className="pl-9" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="flex aspect-[4/3] items-center justify-center bg-blueprint/5 blueprint-grid">
              <span className="rounded-md border border-blueprint/20 bg-background px-2 py-1 font-mono-plan text-xs text-blueprint">
                {room.roomNumber}
              </span>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{room.property}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {room.city}
                  </p>
                </div>
                <p className="font-display text-lg">{formatCurrency(room.rent)}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="gap-1 font-normal">
                  <BedDouble className="h-3 w-3" /> {room.size} sqft
                </Badge>
                {room.amenities.map((a) => (
                  <Badge key={a} variant="secondary" className="font-normal">
                    {a}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Request viewing
                </Button>
                <Button size="sm" className="flex-1">
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
