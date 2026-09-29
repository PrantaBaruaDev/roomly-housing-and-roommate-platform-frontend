import { Plus, DoorOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const properties = [
  { id: "1", title: "Birchwood House", city: "Austin, TX", roomCount: 12, availableRoomCount: 3, occupiedRoomCount: 9 },
  { id: "2", title: "Maple Court", city: "Denver, CO", roomCount: 9, availableRoomCount: 0, occupiedRoomCount: 9 },
];

export default function OwnerPropertiesPage() {
  return (
    <div>
      <PageHeader
        title="Properties"
        description="Manage buildings, flats, and rooms."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Add property
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {properties.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{p.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{p.city}</p>
              </div>
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-blueprint"
                    style={{ width: `${(p.occupiedRoomCount / p.roomCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {p.occupiedRoomCount}/{p.roomCount} occupied
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className={p.availableRoomCount > 0 ? "border-moss/30 bg-moss/10 text-moss" : "border-border text-muted-foreground"}>
                  {p.availableRoomCount > 0 ? `${p.availableRoomCount} rooms available` : "Fully occupied"}
                </Badge>
                <Button size="sm" variant="outline">
                  Manage rooms
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
