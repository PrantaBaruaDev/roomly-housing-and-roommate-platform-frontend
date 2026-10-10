"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ApplicationCard } from "@/components/shared/application-card";
import { DataPagination } from "@/components/shared/data-pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApplications } from "@/hooks/use-applications";
import { toApplicationCardVM } from "@/lib/adapters/application";
import type { BackendApplicationStatus } from "@/types/application";

type Filter = "ALL" | BackendApplicationStatus;

const TABS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminApplicationsPage() {
  const [tab, setTab] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useApplications(
    tab === "ALL" ? { page } : { status: tab, page },
  );
  const applications = (data?.data ?? []).map(toApplicationCardVM);

  function changeTab(next: Filter) {
    setTab(next);
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Every application across the platform, for oversight."
      />

      <Tabs value={tab} onValueChange={(v) => changeTab(v as Filter)}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
          title="No applications"
          description={
            tab === "ALL"
              ? "Applications from tenants will appear here."
              : "Nothing matches this filter."
          }
        />
      )}

      {applications.length > 0 && (
        <>
          <div className="mt-4 flex flex-col gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                actions={
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/applications/${app.id}`}>
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