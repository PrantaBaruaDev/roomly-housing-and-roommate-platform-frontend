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
import Link from "next/link";

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
                <Button asChild size="sm" variant="outline">
                  <Link href={`/owner/view-requests/${r.id}`}>Review</Link>
                </Button>
              }
            />
          ))}
        </div>
      )}
      <DataPagination meta={data?.meta} onPageChange={setPage} />
    </div>
  );
}