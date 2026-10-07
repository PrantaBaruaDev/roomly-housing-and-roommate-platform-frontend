"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ApplicationCard } from "@/components/shared/application-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useApplications } from "@/hooks/use-applications";
import { toApplicationCardVM } from "@/lib/adapters/application";
import type { BackendApplicationStatus } from "@/types/application";

const TABS: { value: "ALL" | BackendApplicationStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminApplicationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("ALL");
  const { data, isLoading } = useApplications(
    tab === "ALL" ? undefined : { status: tab }
  );
  const applications = (data?.data ?? []).map(toApplicationCardVM);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Every application across the platform, for oversight."
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab}>
          {isLoading && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Loading applications…
            </p>
          )}
          {!isLoading && (
            <div className="flex flex-col gap-4">
              {applications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
              {applications.length === 0 && (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No applications match this filter.
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}