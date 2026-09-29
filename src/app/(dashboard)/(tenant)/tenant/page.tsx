import { Search, ClipboardList, Receipt, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

export default function TenantOverviewPage() {
  return (
    <div>
      <PageHeader title="Overview" description="Room 204, Birchwood House." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current rent" value={formatCurrency(1450)} hint="Due Oct 1" icon={Receipt} accent="blueprint" />
        <StatCard label="Active application" value={1} hint="Awaiting owner review" icon={ClipboardList} accent="brass" />
        <StatCard label="Roommates" value={2} icon={Users} accent="moss" />
        <StatCard label="Saved rooms" value={4} icon={Search} accent="blueprint" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Latest invoice</CardTitle>
            <StatusBadge status="issued" />
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl">{formatCurrency(1450)}</p>
            <p className="mt-1 text-sm text-muted-foreground">September rent + utilities · due {formatDate("2026-10-01")}</p>
            <Button size="sm" className="mt-4">
              Pay now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your roommates</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {[
              { name: "Jade Kim", room: "R-203" },
              { name: "Marco Silva", room: "R-205" },
            ].map((r) => (
              <div key={r.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar>
                  <AvatarFallback>{initials(r.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">Room {r.room}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
