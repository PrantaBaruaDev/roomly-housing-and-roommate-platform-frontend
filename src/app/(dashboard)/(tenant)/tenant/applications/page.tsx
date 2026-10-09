"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ApplicationCard } from "@/components/shared/application-card";
import { DataPagination } from "@/components/shared/data-pagination";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/hooks/use-applications";
import { toApplicationCardVM } from "@/lib/adapters/application";

export default function TenantApplicationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useApplications({ page });
  const applications = (data?.data ?? []).map(toApplicationCardVM);

  return (
    <div>
      <PageHeader
        title="My applications"
        description="Track every room you've applied for."
      />

      {isLoading && !data && (
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
          action={
            <Button asChild size="sm">
              <Link href="/browse">
                <Search className="mr-1 h-4 w-4" /> Browse rooms
              </Link>
            </Button>
          }
        />
      )}

      {applications.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                actions={
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/tenant/applications/${app.id}`}>
                      View details
                    </Link>
                  </Button>
                }
              />
            ))}
          </div>

          <DataPagination
            meta={data?.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}