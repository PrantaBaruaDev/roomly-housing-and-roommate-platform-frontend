"use client";

import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ViewRequestCard } from "@/components/shared/view-request-card";
import { Button } from "@/components/ui/button";
import {
  useViewRequests,
  useUpdateViewRequest,
} from "@/hooks/use-view-requests";
import { toViewRequestCardVM } from "@/lib/adapters/view-request";

export default function TenantViewRequestsPage() {
  const { data, isLoading, isError, error } = useViewRequests();
  const update = useUpdateViewRequest();
  const requests = (data?.data ?? []).map(toViewRequestCardVM);

  return (
    <div>
      <PageHeader
        title="View requests"
        description="Track the viewings you've asked for."
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
          description="Request a viewing from any room listing to see it in person."
        />
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((r) => (
            <ViewRequestCard
              key={r.id}
              request={r}
              viewerRole="tenant"
              actions={
                r.status === "countered" ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: r.id, status: "REJECTED" })
                      }
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: r.id, status: "APPROVED" })
                      }
                    >
                      Accept new time
                    </Button>
                  </>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}