import { Users, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials, formatDate } from "@/lib/utils";

const roommates = [
  { id: "1", name: "Jade Kim", roomNumber: "R-203", moveInDate: "2026-03-01", phone: "+1 555-0192" },
  { id: "2", name: "Marco Silva", roomNumber: "R-205", moveInDate: "2026-06-15", phone: "+1 555-0143" },
];

export default function TenantRoommatesPage() {
  return (
    <div>
      <PageHeader title="Roommates" description="Others living in Birchwood House alongside you." />

      {roommates.length === 0 ? (
        <EmptyState icon={Users} title="No roommates yet" description="Once other rooms are occupied, you'll see them here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roommates.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center gap-4 p-5">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{initials(r.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Room {r.roomNumber} · Since {formatDate(r.moveInDate)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" aria-label={`Call ${r.name}`}>
                  <Phone className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
