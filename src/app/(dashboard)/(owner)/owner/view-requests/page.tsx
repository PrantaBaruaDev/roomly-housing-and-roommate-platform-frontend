"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ViewRequestCard } from "@/components/shared/view-request-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useViewRequests,
  useUpdateViewRequest,
} from "@/hooks/use-view-requests";
import { toViewRequestCardVM } from "@/lib/adapters/view-request";
import { DataPagination } from "@/components/shared/data-pagination";

export default function OwnerViewRequestsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useViewRequests({ page });
  const update = useUpdateViewRequest();
  const requests = (data?.data ?? []).map(toViewRequestCardVM);

  const [counterFor, setCounterFor] = useState<string | null>(null);
  const [counterDate, setCounterDate] = useState("");
  const [counterNote, setCounterNote] = useState("");

  function submitCounter(id: string) {
    if (!counterDate) return;
    update.mutate(
      {
        id,
        status: "OWNER_RESCHEDULED",
        counterDate: new Date(counterDate).toISOString(),
        ownerFeedback: counterNote || undefined,
      },
      {
        onSuccess: () => {
          setCounterFor(null);
          setCounterDate("");
          setCounterNote("");
        },
      },
    );
  }

  return (
    <div>
      <PageHeader
        title="View requests"
        description="Confirm or reschedule room viewings tenants have asked for."
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading requests…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load view requests."}
        </p>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <EmptyState
          icon={CalendarClock}
          title="No view requests"
          description="Tenant requests to see a room will show up here."
        />
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((r) => (
            <ViewRequestCard
              key={r.id}
              request={r}
              viewerRole="owner"
              actions={
                r.status === "requested" ? (
                  <>
                    <Dialog
                      open={counterFor === r.id}
                      onOpenChange={(open) =>
                        setCounterFor(open ? r.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" disabled={update.isPending}>
                          Reschedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Propose a new time</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="counterDate">New date & time</Label>
                            <Input
                              id="counterDate"
                              type="datetime-local"
                              value={counterDate}
                              onChange={(e) => setCounterDate(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="counterNote">Note (optional)</Label>
                            <Input
                              id="counterNote"
                              value={counterNote}
                              onChange={(e) => setCounterNote(e.target.value)}
                              placeholder="Why are you rescheduling?"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            disabled={!counterDate || update.isPending}
                            onClick={() => submitCounter(r.id)}
                          >
                            Send counter-offer
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: r.id, status: "APPROVED" })
                      }
                    >
                      Confirm
                    </Button>
                  </>
                ) : null
              }
            />
          ))}
        </div>
      )}
      <DataPagination meta={data?.meta} onPageChange={setPage} />
    </div>
  );
}