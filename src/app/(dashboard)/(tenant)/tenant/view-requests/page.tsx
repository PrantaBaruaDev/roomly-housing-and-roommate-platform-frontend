import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ViewRequestStatus } from "@/lib/constants";

const requests: {
  id: string;
  property: string;
  roomNumber: string;
  proposedDate: string;
  counterDate?: string;
  status: ViewRequestStatus;
}[] = [
  { id: "1", property: "Riverside Cottages", roomNumber: "R-110", proposedDate: "2026-09-22T15:00:00", status: "requested" },
  {
    id: "2",
    property: "Birchwood House",
    roomNumber: "R-204",
    proposedDate: "2026-09-20T10:00:00",
    counterDate: "2026-09-24T11:00:00",
    status: "countered",
  },
];

export default function TenantViewRequestsPage() {
  return (
    <div>
      <PageHeader title="View requests" description="Track requests to see a room in person." />

      {requests.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No view requests" description="Request a viewing from any room's listing." />
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{r.property}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Room {r.roomNumber} ·{" "}
                    {r.status === "countered" && r.counterDate
                      ? `Owner proposed ${new Date(r.counterDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`
                      : `You proposed ${new Date(r.proposedDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`}
                  </p>
                </div>
                {r.status === "countered" && (
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                    <Button size="sm">Accept new time</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
