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
  Check,
  X,
  Ban,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyableId } from "@/components/shared/copyable-id";
import {
  useApplication,
  useUpdateApplication,
} from "@/hooks/use-applications";
import { toApplicationDetailVM } from "@/lib/adapters/application";
import { formatCurrency } from "@/lib/utils";
import type { ApplicationUpdateValues } from "@/schemas/application.schema";

type Decision = ApplicationUpdateValues["status"];

const DECISION_META: Record<
  Decision,
  {
    title: string;
    confirmLabel: string;
    hint: string;
    variant: "default" | "destructive";
  }
> = {
  APPROVED: {
    title: "Approve application",
    confirmLabel: "Approve",
    hint: "The tenant will be able to pay and confirm.",
    variant: "default",
  },
  REJECTED: {
    title: "Reject application",
    confirmLabel: "Reject",
    hint: "The tenant will be notified.",
    variant: "destructive",
  },
  CANCELLED: {
    title: "Cancel application",
    confirmLabel: "Cancel",
    hint: "Use this to close the application without a decision.",
    variant: "destructive",
  },
};

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useApplication(id);
  const update = useUpdateApplication();

  const err = error as { status?: number; message?: string } | null;
  const app = data ? toApplicationDetailVM(data) : null;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState("");

  const decisionMeta = decision ? DECISION_META[decision] : null;

  function openDecision(next: Decision) {
    setDecision(next);
    setFeedback("");
  }

  function submitDecision() {
    if (!decision) return;
    update.mutate(
      {
        id,
        status: decision,
        ownerFeedback: feedback.trim() || undefined,
      },
      {
        onSuccess: () => {
          setDecision(null);
          setFeedback("");
        },
      },
    );
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/admin/applications">
          <ArrowLeft className="h-4 w-4" /> Back to applications
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading application…
        </p>
      )}

      {isError && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium">
              {err?.status === 404
                ? "Application not found"
                : "Couldn't load this application"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {err?.message ?? "Please try again."}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/admin/applications">Back to applications</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {app && (
        <>
          <PageHeader
            title={app.tenantName}
            description={`Applied ${app.createdAt}`}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left column */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
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
                      per{" "}
                      {app.bookingMode === "BOOK_BY_SEAT" ? "seat" : "month"}
                    </p>
                  </div>
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
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={User}
                    label="Name"
                    value={app.tenantName}
                    sub={app.tenantEmail}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Owner</CardTitle>
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

              {/* Admin override actions — always available */}
              <Card>
                <CardHeader>
                  <CardTitle>Override</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground">
                    Admins can override any application status for oversight.
                  </p>

                  {app.status !== "APPROVED" && (
                    <Button
                      size="sm"
                      className="justify-start"
                      onClick={() => openDecision("APPROVED")}
                      disabled={update.isPending}
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  )}
                  {app.status !== "REJECTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => openDecision("REJECTED")}
                      disabled={update.isPending}
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  )}
                  {app.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start"
                      onClick={() => openDecision("CANCELLED")}
                      disabled={update.isPending}
                    >
                      <Ban className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 text-xs">
                  <CopyableId id={app.id} label="Application" />
                  {app.roomId && <CopyableId id={app.roomId} label="Room" />}
                  {app.propertyId && (
                    <CopyableId id={app.propertyId} label="Property" />
                  )}
                  {app.tenantId && (
                    <CopyableId id={app.tenantId} label="Tenant" />
                  )}
                  {app.ownerId && (
                    <CopyableId id={app.ownerId} label="Owner" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Decision dialog */}
          <Dialog
            open={Boolean(decision)}
            onOpenChange={(open) => {
              if (!open && !update.isPending) setDecision(null);
            }}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{decisionMeta?.title}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  {decisionMeta?.hint}
                </p>
                <p className="text-sm">
                  Tenant{" "}
                  <strong className="text-foreground">{app.tenantName}</strong>{" "}
                  applied to{" "}
                  <strong className="text-foreground">{app.roomNumber}</strong>{" "}
                  in{" "}
                  <strong className="text-foreground">
                    {app.propertyTitle}
                  </strong>
                  .
                </p>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback">
                    Feedback (optional)
                  </Label>
                  <textarea
                    id="feedback"
                    rows={3}
                    placeholder={
                      decision === "APPROVED"
                        ? "Approved by admin oversight."
                        : decision === "REJECTED"
                          ? "Reason for rejection…"
                          : "Reason for cancellation…"
                    }
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {update.isError && (
                  <p className="text-xs text-destructive">
                    {(update.error as Error)?.message ??
                      "Failed to update application."}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDecision(null)}
                  disabled={update.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant={decisionMeta?.variant}
                  onClick={submitDecision}
                  disabled={update.isPending}
                >
                  {update.isPending
                    ? "Saving…"
                    : decisionMeta?.confirmLabel}
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