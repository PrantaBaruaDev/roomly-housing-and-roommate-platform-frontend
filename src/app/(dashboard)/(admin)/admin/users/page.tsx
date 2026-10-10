"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataPagination } from "@/components/shared/data-pagination";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api-client";
import { initials, formatDate } from "@/lib/utils";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER" | "TENANT" | string;
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
  createdAt: string;
  profiles?: { phone?: string; address?: string } | null;
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: ApiUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "border-blueprint/30 bg-blueprint/10 text-blueprint",
  OWNER: "border-brass/30 bg-brass/10 text-brass",
  TENANT: "border-moss/30 bg-moss/10 text-moss",
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "border-moss/30 bg-moss/10 text-moss",
  BLOCKED: "border-destructive/30 bg-destructive/10 text-destructive",
  DELETED: "border-border bg-muted text-muted-foreground",
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () =>
      apiClient<UsersResponse>("/auth/users-list", {
        params: { page, limit: 10 },
      }),
  });

  const users = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Everyone with an account on the platform."
      />

      {isLoading && !data && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading users…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load users."}
        </p>
      )}

      {!isLoading && !isError && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="New sign-ups will appear here."
        />
      )}

      {users.length > 0 && (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px]">
                            {initials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          ROLE_BADGE[u.role.toUpperCase()] ??
                          "border-border text-muted-foreground"
                        }
                      >
                        {u.role.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.status ? (
                        <Badge
                          variant="outline"
                          className={
                            STATUS_BADGE[u.status.toUpperCase()] ??
                            "border-border text-muted-foreground"
                          }
                        >
                          {u.status.toLowerCase()}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

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