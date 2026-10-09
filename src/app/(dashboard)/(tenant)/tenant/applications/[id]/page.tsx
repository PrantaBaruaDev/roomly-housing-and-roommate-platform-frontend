"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DoorOpen,
  CalendarDays,
  User,
  Wallet,
  MessageSquare,
  CreditCard,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useApplication, useUpdateApplication } from "@/hooks/use-applications";
import { toApplicationDetailVM } from "@/lib/adapters/application";
import { formatCurrency } from "@/lib/utils";
import { CopyableId } from "@/components/shared/copyable-id";

export default function TenantApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useApplication(id);
  const withdraw = useUpdateApplication();
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  const err = error as { status?: number; message?: string } | null;
  const app = data ? toApplicationDetailVM(data) : null;

  function handleWithdraw() {
    withdraw.mutate(
      { id, status: "CANCELLED" },
      { onSuccess: () => setConfirmWithdraw(false) },
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/tenant/applications">
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading application…
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-destructive">
          {err?.status === 403
            ? "You don't have access to this application."
            : err?.status === 404
              ? "Application not found."
              : err?.message ?? "Failed to load application."}
        </p>
      )}

      {app && (
        <>
          <PageHeader
            title={app.propertyTitle}
            description={`Applied ${app.createdAt}`}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left: primary info */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Status banner */}
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                      <CopyableId id={app.id} label="Application" />
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={app.statusKey} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Agreed rent
                    </p>
                    <p className="mt-1 font-display text-2xl leading-none tabular-nums">
                      {formatCurrency(app.agreedRent)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      per {app.bookingMode === "BOOK_BY_SEAT" ? "seat" : "month"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Room + property */}
              <Card>
                <CardHeader>
                  <CardTitle>Room &amp; property</CardTitle>
                  <div className="mt-2 flex gap-6 flex-col border-t border-border pt-4">
                    <CopyableId id={app.roomId} label="Room" />
                    {app.propertyId && (
                      <CopyableId id={app.propertyId} label="Property" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={Building2}
                    label="Property"
                    value={app.propertyTitle}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={app.propertyLocation}
                  />
                  <InfoRow
                    icon={DoorOpen}
                    label="Room"
                    value={app.roomNumber}
                    sub={`Max capacity ${app.maxCapacity}`}
                  />
                  <InfoRow
                    icon={Wallet}
                    label="Listed rent"
                    value={formatCurrency(app.roomRent)}
                  />
                </CardContent>
              </Card>

              {/* Application terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Application terms</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={CalendarDays}
                    label="Requested move-in"
                    value={app.moveInDate}
                  />
                  <InfoRow
                    icon={Wallet}
                    label="Agreed rent"
                    value={formatCurrency(app.agreedRent)}
                  />
                  <InfoRow
                    icon={User}
                    label="Lease type"
                    value={app.isPrivateLease ? "Private lease" : "Standard"}
                  />
                </CardContent>
              </Card>

              {/* Owner feedback */}
              {app.ownerFeedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Owner feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">
                      {app.ownerFeedback}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Payments */}
              {app.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payments</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-sm">
                    {app.payments.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(p.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            via {p.provider === "BKASH" ? "bKash" : "Card"}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusBadge
                            status={
                              p.status === "COMPLETED"
                                ? "paid"
                                : p.status.toLowerCase()
                            }
                          />
                          {p.paidAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {p.paidAt}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: owner + actions */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Owner</CardTitle>
                  <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                    {app.ownerId && (
                      <CopyableId id={app.ownerId} label="Owner" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={User}
                    label="Name"
                    value={app.ownerName}
                    sub={app.ownerEmail}
                  />
                </CardContent>
              </Card>

              {/* Tenant actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {app.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setConfirmWithdraw(true)}
                      disabled={withdraw.isPending}
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Withdraw application
                    </Button>
                  )}

                  {app.status === "APPROVED" && !app.hasCompletedPayment && (
                    <Button asChild size="sm" className="justify-start">
                      <Link href={`/tenant/payments`}>
                        <CreditCard className="mr-2 h-4 w-4" /> Pay & confirm
                      </Link>
                    </Button>
                  )}

                  {app.status === "APPROVED" && app.hasCompletedPayment && (
                    <p className="rounded-md border border-moss/30 bg-moss/5 px-3 py-2 text-xs text-moss">
                      Payment complete. You&apos;re all set.
                    </p>
                  )}

                  {app.status === "REJECTED" && (
                    <p className="text-xs text-muted-foreground">
                      The owner declined this application.
                    </p>
                  )}

                  {app.status === "CANCELLED" && (
                    <p className="text-xs text-muted-foreground">
                      You withdrew this application.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <ConfirmDialog
            open={confirmWithdraw}
            onOpenChange={setConfirmWithdraw}
            title="Withdraw this application?"
            description="The owner will no longer see this application. You can apply again later, but you'll start the review process from the beginning."
            confirmLabel="Withdraw"
            variant="destructive"
            isPending={withdraw.isPending}
            onConfirm={handleWithdraw}
          />
        </>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof User;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}