"use client";

import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initials, formatDate } from "@/lib/utils";

const users = [
  { id: "1", name: "Elena Fischer", email: "elena@birchwoodhouse.com", role: "OWNER", createdAt: "2026-02-11" },
  { id: "2", name: "Maya Torres", email: "maya.torres@mail.com", role: "TENANT", createdAt: "2026-06-02" },
  { id: "3", name: "Jonas Reyes", email: "jonas@elmstreetflats.com", role: "OWNER", createdAt: "2026-04-19" },
  { id: "4", name: "Priya Nair", email: "priya.nair@mail.com", role: "TENANT", createdAt: "2026-08-30" },
];

const ROLE_BADGE: Record<string, string> = {
  admin: "border-blueprint/30 bg-blueprint/10 text-blueprint",
  owner: "border-brass/30 bg-brass/10 text-brass",
  tenant: "border-moss/30 bg-moss/10 text-moss",
};

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader title="Users" description="Everyone with an account on the platform." />

      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="New sign-ups will appear here." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px]">{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${ROLE_BADGE[u.role]}`}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
