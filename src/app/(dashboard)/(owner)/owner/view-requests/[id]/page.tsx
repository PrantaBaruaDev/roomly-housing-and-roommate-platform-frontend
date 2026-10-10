"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DoorOpen,
  CalendarClock,
  Clock,
  Check,
  X,
  Repeat,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyableId } from "@/components/shared/copyable-id";
import {
  useViewRequest,
  useUpdateViewRequest,
} from "@/hooks/use-view-requests";
import { toViewRequestDetailVM } from "@/lib/adapters/view-request";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ActionKind = "APPROVED" | "REJECTED" | "OWNER_RESCHEDULED";

export default function OwnerViewRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useViewRequest(id);
  const update = useUpdateViewRequest();

  const err = error as { status?: number; message?: string } | null;
  const request = data ? toViewRequestDetailVM(data) : null;

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ActionKind>("APPROVED");
  const [counterDate, setCounterDate] = useState("");
  const [note, setNote] = useState("");

  function openAction(kind: ActionKind) {
    setAction(kind);
    setCounterDate("");
    setNote("");
    setOpen(true);
  }

  function submit() {
    if (!request) return;

    const payload: Record<string, unknown> = { status: action };
    if (note.trim()) payload.ownerFeedback = note.trim();
    if (action === "OWNER_RESCHEDULED") {
      if (!counterDate) return;
      payload.counterDate = new Date(counterDate).toISOString();
    }

    update.mutate(
      { id, ...payload } as any,
      { onSuccess: () => setOpen(false) },
    );
  }

  const actionTitle: Record<ActionKind, string> = {
    APPROVED: "Confirm viewing",
    REJECTED: "Decline viewing request",
    OWNER_RESCHEDULED: "Propose a new time",
  };

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/owner/view-requests">
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
                ? "You don't have access to this request"
                : err?.status === 404
                  ? "Request not found"
                  : "Couldn't load this request"}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/owner/view-requests">Back to view requests</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {request && (
        <>
          <PageHeader
            title={request.tenantName}
            description={`Requested ${request.createdAt}`}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={request.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                        Tenant proposed
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
                          You proposed a new time
                        </p>
                        <p className="font-medium">{request.counterDate}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Room &amp; property</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={Building2}
                    label="Property"
                    value={request.propertyTitle}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={`${request.propertyAddress}, ${request.propertyCity}`}
                  />
                  <InfoRow
                    icon={DoorOpen}
                    label="Room"
                    value={request.roomNumber}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={Clock}
                    label="Name"
                    value={request.tenantName}
                    sub={request.tenantEmail}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {request.status === "requested" ? (
                    <>
                      <Button
                        size="sm"
                        className="justify-start"
                        onClick={() => openAction("APPROVED")}
                        disabled={update.isPending}
                      >
                        <Check className="mr-2 h-4 w-4" /> Confirm viewing
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start"
                        onClick={() => openAction("OWNER_RESCHEDULED")}
                        disabled={update.isPending}
                      >
                        <Repeat className="mr-2 h-4 w-4" /> Propose new time
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => openAction("REJECTED")}
                        disabled={update.isPending}
                      >
                        <X className="mr-2 h-4 w-4" /> Decline
                      </Button>
                    </>
                  ) : request.status === "countered" ? (
                    <div className="rounded-md border border-brass/30 bg-brass/5 p-3 text-xs text-brass">
                      Waiting for the tenant to accept or decline your proposed
                      time.
                    </div>
                  ) : request.status === "confirmed" ? (
                    <div className="rounded-md border border-moss/30 bg-moss/5 p-3 text-xs text-moss">
                      Confirmed for {request.counterDate ?? request.proposedDate}
                    </div>
                  ) : (
                    <div className="rounded-md border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
                      This request is closed. No further actions available.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 text-xs">
                  <CopyableId id={request.id} label="Request" />
                  {request.roomId && (
                    <CopyableId id={request.roomId} label="Room" />
                  )}
                  {request.propertyId && (
                    <CopyableId id={request.propertyId} label="Property" />
                  )}
                  {request.tenantId && (
                    <CopyableId id={request.tenantId} label="Tenant" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action dialog */}
          <Dialog open={open} onOpenChange={(v) => !update.isPending && setOpen(v)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{actionTitle[action]}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                {action === "OWNER_RESCHEDULED" && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="counterDate">New date &amp; time</Label>
                    <Input
                      id="counterDate"
                      type="datetime-local"
                      value={counterDate}
                      onChange={(e) => setCounterDate(e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      The tenant will be notified and can accept or decline.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="note">
                    Note{" "}
                    {action === "REJECTED" ? "(recommended)" : "(optional)"}
                  </Label>
                  <textarea
                    id="note"
                    rows={3}
                    placeholder={
                      action === "APPROVED"
                        ? "See you then!"
                        : action === "OWNER_RESCHEDULED"
                          ? "This time doesn't work — can we do..."
                          : "Sorry, I'm not available."
                    }
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {update.isError && (
                  <p className="text-xs text-destructive">
                    {(update.error as Error)?.message ??
                      "Failed to update view request."}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={update.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant={action === "REJECTED" ? "destructive" : "default"}
                  onClick={submit}
                  disabled={
                    update.isPending ||
                    (action === "OWNER_RESCHEDULED" && !counterDate)
                  }
                >
                  {update.isPending ? "Saving…" : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
  icon: typeof Clock;
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