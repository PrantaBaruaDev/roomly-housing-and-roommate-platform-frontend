"use client";

import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ApplicationCard } from "@/components/shared/application-card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/use-applications";
import { toApplicationCardVM } from "@/lib/adapters/application";

export default function TenantApplicationsPage() {
  const { data, isLoading, isError, error } = useApplications();
  const applications = (data?.data ?? []).map(toApplicationCardVM);

  return (
    <div>
      <PageHeader
        title="My applications"
        description="Track every room you've applied for."
      />

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading applications…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load applications."}
        </p>
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Browse rooms and apply — your applications will show up here."
          action={<Button size="sm">Browse rooms</Button>}
        />
      )}

      {!isLoading && !isError && applications.length > 0 && (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              actions={
                <>
                  {app.status === "PENDING" && (
                    <Button size="sm" variant="outline">
                      Withdraw
                    </Button>
                  )}
                  {app.status === "ACCEPTED" && !app.isPaid && (
                    <Button size="sm">Pay & confirm</Button>
                  )}
                  {app.status === "ACCEPTED" && app.isPaid && (
                    <Button size="sm" variant="outline">
                      View receipt
                    </Button>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}