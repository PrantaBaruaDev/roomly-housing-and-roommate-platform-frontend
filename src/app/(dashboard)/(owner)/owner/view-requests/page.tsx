"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import type { ViewRequestStatus } from "@/lib/constants";

const requests: {
  id: string;
  tenantName: string;
  roomNumber: string;
  proposedDate: string;
  status: ViewRequestStatus;
}[] = [
  { id: "1", tenantName: "Owen Carter", roomNumber: "R-110", proposedDate: "2026-09-22T15:00:00", status: "requested" },
  { id: "2", tenantName: "Lucia Alvarez", roomNumber: "R-204", proposedDate: "2026-09-24T11:00:00", status: "confirmed" },
];

export default function OwnerViewRequestsPage() {
  const [counterDate, setCounterDate] = useState("");

  return (
    <div>
      <PageHeader title="View requests" description="Confirm or reschedule room viewings tenants have asked for." />

      {requests.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No view requests" description="Tenant requests to see a room will show up here." />
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{r.tenantName}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Room {r.roomNumber} · Proposed{" "}
                    {new Date(r.proposedDate).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                {r.status === "requested" && (
                  <div className="flex shrink-0 gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          Propose new time
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Counter-propose a time</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="counter">New date & time</Label>
                          <Input
                            id="counter"
                            type="datetime-local"
                            value={counterDate}
                            onChange={(e) => setCounterDate(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button>Send counter-offer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm">Confirm</Button>
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
