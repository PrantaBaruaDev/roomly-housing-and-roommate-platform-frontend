import { Building2, ClipboardList, Receipt, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

const pendingApplications = [
  { id: "1", tenantName: "Maya Torres", roomNumber: "R-204", moveInDate: "2026-10-01" },
  { id: "2", tenantName: "Priya Nair", roomNumber: "R-301", moveInDate: "2026-10-05" },
];

const upcomingViewings = [
  { id: "1", tenantName: "Owen Carter", roomNumber: "R-110", date: "2026-09-22T15:00:00" },
  { id: "2", tenantName: "Lucia Alvarez", roomNumber: "R-204", date: "2026-09-24T11:00:00" },
];

const recentInvoices = [
  { id: "1", roomNumber: "R-102", tenantName: "Daniel Cho", totalAmount: 1450, status: "issued" },
  { id: "2", roomNumber: "R-301", tenantName: "Priya Nair", totalAmount: 1320, status: "paid" },
];

export default function OwnerOverviewPage() {
  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your properties at a glance."
        actions={<Button size="sm">Add property</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Properties" value={3} hint="21 total rooms" icon={Building2} accent="blueprint" />
        <StatCard label="Pending applications" value={pendingApplications.length} icon={ClipboardList} accent="brass" />
        <StatCard label="Upcoming viewings" value={upcomingViewings.length} icon={CalendarClock} accent="moss" />
        <StatCard label="Unpaid invoices" value={1} hint={formatCurrency(1450)} icon={Receipt} accent="destructive" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending applications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {pendingApplications.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{a.tenantName}</p>
                  <p className="text-xs text-muted-foreground">Room {a.roomNumber} · Wants {formatDate(a.moveInDate)}</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming viewings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {upcomingViewings.map((v) => (
              <div key={v.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-sm font-medium">{v.tenantName}</p>
                <p className="text-xs text-muted-foreground">
                  Room {v.roomNumber} ·{" "}
                  {new Date(v.date).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{inv.tenantName}</p>
                  <p className="text-xs text-muted-foreground">
                    Room {inv.roomNumber} · {formatCurrency(inv.totalAmount)}
                  </p>
                </div>
                <StatusBadge status={inv.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
