"use client";

import { Check, X, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ApplicationCard } from "@/components/shared/application-card";
import { Button } from "@/components/ui/button";
import { useApplications, useUpdateApplication } from "@/hooks/use-applications";
import { toApplicationCardVM } from "@/lib/adapters/application";
import { DataPagination } from "@/components/shared/data-pagination";
import { useState } from "react";


export default function OwnerApplicationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useApplications({ page });
  const update = useUpdateApplication();
  const applications = (data?.data ?? []).map(toApplicationCardVM);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Review requests to rent a room in your properties."
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading applications…
        </p>
      )}

      {!isLoading && applications.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Applications from tenants will appear here for review."
        />
      )}

      {!isLoading && applications.length > 0 && (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              actions={
                app.status === "PENDING" ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: app.id, decision: "REJECTED" } as any)
                      }
                    >
                      <X className="h-4 w-4" /> Decline
                    </Button>
                    <Button
                      size="sm"
                      disabled={update.isPending}
                      onClick={() =>
                        update.mutate({ id: app.id, decision: "APPROVED" } as any)
                      }
                    >
                      <Check className="h-4 w-4" /> Accept
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