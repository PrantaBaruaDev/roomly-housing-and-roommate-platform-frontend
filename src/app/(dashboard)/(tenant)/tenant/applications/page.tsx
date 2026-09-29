import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/constants";

const applications: { id: string; property: string; roomNumber: string; moveInDate: string; status: ApplicationStatus }[] = [
  { id: "1", property: "Birchwood House", roomNumber: "R-204", moveInDate: "2026-10-01", status: "pending" },
  { id: "2", property: "Elm Street Flats", roomNumber: "R-102", moveInDate: "2026-09-25", status: "accepted" },
];

export default function TenantApplicationsPage() {
  return (
    <div>
      <PageHeader title="My applications" description="Track the rooms you've applied for." />

      {applications.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Browse rooms and apply to start tracking them here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{app.property}</p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Room {app.roomNumber} · Requested move-in {formatDate(app.moveInDate)}
                  </p>
                </div>
                {app.status === "accepted" && <Button size="sm">Pay & confirm</Button>}
                {app.status === "pending" && (
                  <Button size="sm" variant="outline">
                    Withdraw
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
