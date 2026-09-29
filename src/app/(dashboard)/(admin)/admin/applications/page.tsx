"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initials, formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/constants";

const applications: {
  id: string;
  tenantName: string;
  propertyTitle: string;
  roomNumber: string;
  status: ApplicationStatus;
  moveInDate: string;
  createdAt: string;
}[] = [
  { id: "1", tenantName: "Maya Torres", propertyTitle: "Birchwood House", roomNumber: "R-204", status: "pending", moveInDate: "2026-10-01", createdAt: "2026-09-18" },
  { id: "2", tenantName: "Daniel Cho", propertyTitle: "Elm Street Flats", roomNumber: "R-102", status: "accepted", moveInDate: "2026-09-25", createdAt: "2026-09-16" },
  { id: "3", tenantName: "Priya Nair", propertyTitle: "Birchwood House", roomNumber: "R-301", status: "pending", moveInDate: "2026-10-05", createdAt: "2026-09-15" },
  { id: "4", tenantName: "Owen Carter", propertyTitle: "Maple Court", roomNumber: "R-110", status: "rejected", moveInDate: "2026-09-20", createdAt: "2026-09-10" },
];

const TABS = ["all", "pending", "accepted", "rejected"] as const;

export default function AdminApplicationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const filtered = tab === "all" ? applications : applications.filter((a) => a.status === tab);

  return (
    <div>
      <PageHeader title="Applications" description="Applications across every property, for oversight and disputes." />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab}>
          {filtered.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No applications" description="Nothing matches this filter right now." />
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Move-in</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px]">{initials(app.tenantName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{app.tenantName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{app.propertyTitle}</TableCell>
                      <TableCell className="font-mono-plan text-xs">{app.roomNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(app.moveInDate)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(app.createdAt)}</TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
