"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DoorOpen,
  CalendarDays,
  Wallet,
  User,
  Home,
  Receipt,
  UserMinus,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyableId } from "@/components/shared/copyable-id";
import {
  useRoomOccupants,
  useMoveOutOccupant,
  useUndoMoveOut,
} from "@/hooks/use-room-occupants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toRoomOccupantCardVM } from "@/lib/adapters/room-occupant";
import { formatCurrency } from "@/lib/utils";

export default function OwnerRoomOccupantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError, error } = useRoomOccupants({
    page: 1,
    limit: 100,
  });

  const moveOut = useMoveOutOccupant();
  const undoMoveOut = useUndoMoveOut();

    const [moveOutDate, setMoveOutDate] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    });

  const occupant = useMemo(() => {
    const raw = data?.data ?? [];
    const found = raw.find((o) => o.id === id);
    return found ? toRoomOccupantCardVM(found) : null;
  }, [data, id]);

  const err = error as { status?: number; message?: string } | null;

  const [confirmMoveOut, setConfirmMoveOut] = useState(false);
  const [confirmUndo, setConfirmUndo] = useState(false);

    function handleMoveOut() {
    if (!occupant) return;
    moveOut.mutate(
        {
            id: occupant.id,
            movedOutAt: new Date(moveOutDate).toISOString(),
        },
        { onSuccess: () => setConfirmMoveOut(false) },
    );
    }

  function handleUndo() {
    if (!occupant) return;
    undoMoveOut.mutate(occupant.id, {
      onSuccess: () => setConfirmUndo(false),
    });
  }

  const isMutating = moveOut.isPending || undoMoveOut.isPending;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/owner/room-occupants">
          <ArrowLeft className="h-4 w-4" /> Back to occupants
        </Link>
      </Button>

      {isLoading && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading occupancy…
        </p>
      )}

      {isError && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-medium">
              {err?.status === 403
                ? "You don't have access to this occupancy"
                : err?.status === 404
                  ? "Occupancy not found"
                  : "Couldn't load this occupancy"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {err?.message ?? "Please try again."}
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/owner/room-occupants">
                Back to room occupants
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && !occupant && (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <DoorOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm font-medium">Occupant not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This occupancy record doesn&apos;t exist or has been removed.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/owner/room-occupants">
                Back to room occupants
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {occupant && (
        <>
          <PageHeader
            title={occupant.tenantName}
            description={`${occupant.propertyTitle} · Room ${occupant.roomNumber}`}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left column */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Status hero */}
              <Card>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
                        occupant.isActive
                          ? "bg-moss/10 text-moss"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Status
                      </p>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={
                            occupant.isActive
                              ? "border-moss/30 bg-moss/10 text-moss"
                              : "border-border text-muted-foreground"
                          }
                        >
                          {occupant.isActive ? "Active tenant" : "Moved out"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Monthly rent
                    </p>
                    <p className="mt-1 font-display text-2xl leading-none tabular-nums">
                      {formatCurrency(occupant.rent)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      per{" "}
                      {occupant.bookingMode === "BOOK_BY_SEAT"
                        ? "seat"
                        : "month"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Occupancy details */}
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={CalendarDays}
                    label="Moved in"
                    value={occupant.moveInDate}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label="Moved out"
                    value={occupant.movedOutDate ?? "—"}
                  />
                  <InfoRow
                    icon={Home}
                    label="Property"
                    value={occupant.propertyTitle}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={occupant.propertyLocation}
                  />
                  <InfoRow
                    icon={DoorOpen}
                    label="Room"
                    value={occupant.roomNumber}
                  />
                </CardContent>
              </Card>

              {/* Payment / receipt */}
              {occupant.paymentStatusRaw && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 text-sm">
                    <InfoRow
                      icon={Wallet}
                      label="Amount paid"
                      value={formatCurrency(occupant.rent)}
                    />
                    {occupant.paidAt && (
                      <InfoRow
                        icon={CalendarDays}
                        label="Paid at"
                        value={occupant.paidAt}
                        sub={
                          occupant.paymentProvider
                            ? `via ${
                                occupant.paymentProvider === "BKASH"
                                  ? "bKash"
                                  : "Card"
                              }`
                            : undefined
                        }
                      />
                    )}
                    {occupant.gatewayTransactionId && (
                      <InfoRow
                        icon={Receipt}
                        label="Transaction ID"
                        value={occupant.gatewayTransactionId}
                        mono
                      />
                    )}
                    <div className="pt-2">
                      <StatusBadge status={occupant.paymentStatus} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Tenant */}
              <Card>
                <CardHeader>
                  <CardTitle>Tenant</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <InfoRow
                    icon={User}
                    label="Name"
                    value={occupant.tenantName}
                    sub={occupant.tenantEmail}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {occupant.isActive ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        This marks the tenant as having left. The room will
                        reserve a free slot for new applicants.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setConfirmMoveOut(true)}
                        disabled={isMutating}
                      >
                        <UserMinus className="mr-2 h-4 w-4" /> Mark moved out
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">
                        This tenant has been moved out. You can undo the
                        move-out if it was a mistake.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="justify-start"
                        onClick={() => setConfirmUndo(true)}
                        disabled={isMutating}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Undo move-out
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* References */}
              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 text-xs">
                  <CopyableId id={occupant.id} label="Occupant" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Move-out confirmation */}
          <Dialog open={confirmMoveOut} onOpenChange={setConfirmMoveOut}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                <DialogTitle>Mark tenant as moved out?</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                    {occupant.tenantName} will be recorded as having left Room{" "}
                    {occupant.roomNumber}. The room will become available for new occupants.
                </p>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="moveOutDate">Move-out date &amp; time</Label>
                    <Input
                    id="moveOutDate"
                    type="datetime-local"
                    value={moveOutDate}
                    onChange={(e) => setMoveOutDate(e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground">
                    Defaults to now. Change it if the tenant left on an earlier date.
                    </p>
                </div>

                {moveOut.isError && (
                    <p className="text-xs text-destructive">
                    {(moveOut.error as Error)?.message ?? "Failed to mark move-out."}
                    </p>
                )}
                </div>

                <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setConfirmMoveOut(false)}
                    disabled={moveOut.isPending}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleMoveOut}
                    disabled={moveOut.isPending || !moveOutDate}
                >
                    {moveOut.isPending ? "Saving…" : "Confirm move-out"}
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

          {/* Undo confirmation */}
          <ConfirmDialog
            open={confirmUndo}
            onOpenChange={setConfirmUndo}
            title="Undo move-out?"
            description={`${occupant.tenantName} will be reinstated as an active tenant in Room ${occupant.roomNumber}. The room will reserve a slot for them again.`}
            confirmLabel="Undo move-out"
            variant="default"
            isPending={undoMoveOut.isPending}
            onConfirm={handleUndo}
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
  mono = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`truncate font-medium ${mono ? "font-mono-plan text-xs" : ""}`}
        >
          {value}
        </p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}