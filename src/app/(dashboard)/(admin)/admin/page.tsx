import { Building2, ClipboardList, Users, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatDate } from "@/lib/utils";

// Sample data — swap for useProperties()/useApplications() once the API is live.
const recentApplications = [
  { id: "1", tenantName: "Maya Torres", propertyTitle: "Birchwood House", roomNumber: "R-204", status: "pending", createdAt: "2026-09-18" },
  { id: "2", tenantName: "Daniel Cho", propertyTitle: "Elm Street Flats", roomNumber: "R-102", status: "accepted", createdAt: "2026-09-16" },
  { id: "3", tenantName: "Priya Nair", propertyTitle: "Birchwood House", roomNumber: "R-301", status: "pending", createdAt: "2026-09-15" },
];

const unverifiedProperties = [
  { id: "1", title: "Elm Street Flats", ownerName: "Jonas Reyes", roomCount: 8 },
  { id: "2", title: "Riverside Cottages", ownerName: "Sana Malik", roomCount: 5 },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader title="Overview" description="Everything happening across the platform today." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Properties" value={24} hint="+3 this month" icon={Building2} accent="blueprint" />
        <StatCard label="Open applications" value={12} hint="4 need review" icon={ClipboardList} accent="brass" />
        <StatCard label="Active tenants" value={87} hint="Across 24 properties" icon={Users} accent="moss" />
        <StatCard label="Pending verification" value={2} hint="Awaiting admin sign-off" icon={ShieldAlert} accent="destructive" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent applications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(app.tenantName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{app.tenantName}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.propertyTitle} · Room {app.roomNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={app.status} />
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(app.createdAt)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Awaiting verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {unverifiedProperties.map((property) => (
              <div key={property.id} className="py-4 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{property.title}</p>
                <p className="text-xs text-muted-foreground">
                  {property.ownerName} · {property.roomCount} rooms
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
