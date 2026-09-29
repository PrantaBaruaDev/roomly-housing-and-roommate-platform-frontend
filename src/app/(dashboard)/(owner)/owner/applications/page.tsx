"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/constants";

const initialApplications: {
  id: string;
  tenantName: string;
  roomNumber: string;
  moveInDate: string;
  message: string;
  status: ApplicationStatus;
}[] = [
  { id: "1", tenantName: "Maya Torres", roomNumber: "R-204", moveInDate: "2026-10-01", message: "Quiet grad student, would love to move in early October.", status: "pending" },
  { id: "2", tenantName: "Priya Nair", roomNumber: "R-301", moveInDate: "2026-10-05", message: "Relocating for work, flexible on the exact date.", status: "pending" },
];

export default function OwnerApplicationsPage() {
  const [applications, setApplications] = useState(initialApplications);

  function decide(id: string, status: "accepted" | "rejected") {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <div>
      <PageHeader title="Applications" description="Review requests to rent a room in your properties." />

      <div className="flex flex-col gap-4">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>{initials(app.tenantName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{app.tenantName}</p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Room {app.roomNumber} · Wants to move in {formatDate(app.moveInDate)}
                  </p>
                  <p className="mt-2 max-w-md text-sm text-foreground/80">{app.message}</p>
                </div>
              </div>

              {app.status === "pending" && (
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => decide(app.id, "rejected")}>
                    <X className="h-4 w-4" /> Decline
                  </Button>
                  <Button size="sm" onClick={() => decide(app.id, "accepted")}>
                    <Check className="h-4 w-4" /> Accept
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
