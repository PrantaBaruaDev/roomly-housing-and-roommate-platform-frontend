"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DoorOpen,
  CalendarClock,
  Wallet,
  User,
  Check,
  X,
  Clock,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useViewRequest, useUpdateViewRequest } from "@/hooks/use-view-requests";
import { toViewRequestDetailVM } from "@/lib/adapters/view-request";
import { formatCurrency } from "@/lib/utils";
import { CopyableId } from "@/components/shared/copyable-id";

export default function TenantViewRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError, error } = useViewRequest(id);
  const update = useUpdateViewRequest();

  const request = data ? toViewRequestDetailVM(data) : null;
  const err = error as { status?: number; message?: string } | null;

  const [confirmAction, setConfirmAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);

  function submitAction() {
    if (!confirmAction) return;
    update.mutate(
      { id, status: confirmAction },
      { onSuccess: () => setConfirmAction(null) },
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/tenant/view-requests">
          <ArrowLeft className="h-4 w-4" /> Back to view requests
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading request…
        </p>
      )}

      {isError && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium">
              {err?.status === 403
                ? "This request isn't yours"
                : err?.status === 404
                  ? "Request not found"
                  : "Couldn't load this request"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {err?.status === 403
                ? "You can only view requests you made yourself."
                : err?.status === 404
                  ? "This view request doesn't exist or may have been removed."
                  : err?.message ?? "Something went wrong. Please try again."}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/tenant/view-requests">Back to view requests</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {request && (
        <>
          <PageHeader
            title="View request"
            description={`Requested ${request.createdAt}`}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left — main content */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Status hero */}
              <Card>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
                        request.status === "confirmed"
                          ? "bg-moss/10 text-moss"
                          : request.status === "countered"
                            ? "bg-brass/10 text-brass"
                            : request.status === "declined"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-amber/10 text-amber"
                      }`}
                    >
                      <CalendarClock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.status === "requested" &&
                          "Waiting for the owner to confirm or propose a new time."}
                        {request.status === "countered" &&
                          "The owner proposed a different time. Accept or decline."}
                        {request.status === "confirmed" &&
                          "The viewing is confirmed. See you there!"}
                        {request.status === "declined" &&
                          "This request was declined."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proposed vs counter date */}
              <Card>
                <CardHeader>
                  <CardTitle>Proposed times</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        You proposed
                      </p>
                      <p className="font-medium">{request.proposedDate}</p>
                    </div>
                  </div>

                  {request.counterDate && (
                    <div className="flex items-start gap-3 rounded-md border border-brass/30 bg-brass/5 p-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brass/15">
                        <CalendarClock className="h-3.5 w-3.5 text-brass" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-brass">
                          Owner proposed a new time
                        </p>
                        <p className="font-medium">{request.counterDate}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Room + property */}
              <Card>
                <CardHeader>
                  <CardTitle>Room &amp; property</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <DetailRow
                    icon={Building2}
                    label="Property"
                    value={request.propertyTitle}
                  />
                  <DetailRow
                    icon={MapPin}
                    label="Location"
                    value={`${request.propertyAddress}, ${request.propertyCity}`}
                  />
                  <DetailRow
                    icon={DoorOpen}
                    label="Room"
                    value={request.roomNumber}
                  />
                  <DetailRow
                    icon={Wallet}
                    label="Listed rent"
                    value={formatCurrency(request.rent)}
                  />
                </CardContent>
              </Card>

              {/* Owner feedback — if backend ever adds it */}
              {/* Uncomment when the field exists on ApiViewRequest */}
              {/* {request.ownerFeedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Owner feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">
                      {request.ownerFeedback}
                    </p>
                  </CardContent>
                </Card>
              )} */}

            </div>

            {/* Right — owner info + actions */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailRow
                    icon={User}
                    label="Name"
                    value={request.ownerName}
                    sub={request.ownerEmail}
                  />

                  <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                    <CopyableId id={request.id} label="Request" />
                    <CopyableId id={request.roomId} label="Room" />
                    {request.propertyId && (
                      <CopyableId id={request.propertyId} label="Property" />
                    )}
                    {request.ownerId && (
                      <CopyableId id={request.ownerId} label="Owner" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {request.status === "countered" ? (
                    <>
                      <Button
                        size="sm"
                        className="justify-start"
                        onClick={() => setConfirmAction("APPROVED")}
                        disabled={update.isPending}
                      >
                        <Check className="mr-2 h-4 w-4" /> Accept new time
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setConfirmAction("REJECTED")}
                        disabled={update.isPending}
                      >
                        <X className="mr-2 h-4 w-4" /> Decline
                      </Button>
                    </>
                  ) : request.status === "requested" ? (
                    <p className="text-xs text-muted-foreground">
                      Waiting on the owner. You&apos;ll see a counter-proposal
                      here if they need to reschedule.
                    </p>
                  ) : request.status === "confirmed" ? (
                    <p className="rounded-md border border-moss/30 bg-moss/5 px-3 py-2 text-xs text-moss">
                      Confirmed for {request.counterDate ?? request.proposedDate}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      This request is closed. No actions available.
                    </p>
                  )}

                  {/* Quick link to apply for the same room */}
                  {request.roomId && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-2 justify-start"
                    >
                      <Link
                        href={`/tenant/applications/new?roomId=${request.roomId}`}
                      >
                        <DoorOpen className="mr-2 h-4 w-4" /> Apply for this room
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Confirmation dialog */}
          <ConfirmDialog
            open={confirmAction !== null}
            onOpenChange={(open) => {
              if (!open && !update.isPending) setConfirmAction(null);
            }}
            title={
              confirmAction === "APPROVED"
                ? "Accept the new time?"
                : "Decline this viewing request?"
            }
            description={
              confirmAction === "APPROVED"
                ? `You'll confirm the viewing for ${request.counterDate}. Make sure you can attend.`
                : "The owner will be notified. You can always request a viewing again later."
            }
            confirmLabel={
              confirmAction === "APPROVED" ? "Accept" : "Decline"
            }
            variant={
              confirmAction === "REJECTED" ? "destructive" : "default"
            }
            isPending={update.isPending}
            onConfirm={submitAction}
          />
        </>
      )}
    </div>
  );
}

function DetailRow({
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