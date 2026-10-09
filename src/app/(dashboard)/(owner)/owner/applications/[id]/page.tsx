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
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApplication, useUpdateApplication } from "@/hooks/use-applications";
import { toApplicationDetailVM } from "@/lib/adapters/application";
import { formatCurrency } from "@/lib/utils";
import type { ApplicationUpdateValues } from "@/schemas/application.schema";

type Decision = ApplicationUpdateValues["status"];

const DECISION_META: Record<
  Decision,
  { title: string; confirmLabel: string; requiresFeedback: boolean }
> = {
  APPROVED: {
    title: "Approve application",
    confirmLabel: "Approve",
    requiresFeedback: false,
  },
  REJECTED: {
    title: "Reject application",
    confirmLabel: "Reject",
    requiresFeedback: true,
  },
  CANCELLED: {
    title: "Cancel application",
    confirmLabel: "Cancel application",
    requiresFeedback: false,
  },
};

export default function OwnerApplicationDetailPage({
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
        <Link href="/owner/applications">
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
            title={app.tenantName}
            description={`Applied ${app.createdAt}`}
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
            </div>

            {/* Right */}
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

              {/* Owner decisions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {app.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        className="justify-start"
                        onClick={() => openDecision("APPROVED")}
                        disabled={update.isPending}
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => openDecision("REJECTED")}
                        disabled={update.isPending}
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start"
                        onClick={() => openDecision("CANCELLED")}
                        disabled={update.isPending}
                      >
                        <Ban className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      This application is already{" "}
                      <span className="font-medium text-foreground">
                        {app.statusKey}
                      </span>
                      . No further actions are available.
                    </p>
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
                  Applying to <strong className="text-foreground">{app.roomNumber}</strong>{" "}
                  in <strong className="text-foreground">{app.propertyTitle}</strong> by{" "}
                  <strong className="text-foreground">{app.tenantName}</strong>.
                </p>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback">
                    Feedback{" "}
                    {decisionMeta?.requiresFeedback
                      ? "(recommended)"
                      : "(optional)"}
                  </Label>
                  <textarea
                    id="feedback"
                    rows={3}
                    placeholder={
                      decision === "APPROVED"
                        ? "Welcome aboard! Move-in details to follow…"
                        : decision === "REJECTED"
                          ? "Sorry, but this room has been booked."
                          : "Reason for cancelling…"
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
                  variant={
                    decision === "REJECTED" || decision === "CANCELLED"
                      ? "destructive"
                      : "default"
                  }
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