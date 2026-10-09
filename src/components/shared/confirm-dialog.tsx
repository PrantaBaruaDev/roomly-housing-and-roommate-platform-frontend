"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  mode = "confirm",
  isPending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  mode?: "confirm" | "alert";
  isPending?: boolean;
  onConfirm?: () => void;
}) {
  const isAlert = mode === "alert";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                variant === "destructive"
                  ? "bg-destructive/10 text-destructive"
                  : variant === "default"
                    ? "bg-amber/10 text-amber"
                    : "bg-primary/10 text-primary",
              )}
            >
              <AlertTriangle className="h-4 w-4" />
            </span>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">{description}</div>

        <DialogFooter>
          {isAlert ? (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              <X className="mr-1 h-3 w-3" /> Close
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant === "destructive" ? "destructive" : "default"}
                onClick={onConfirm}
                disabled={isPending}
              >
                {isPending ? "Working…" : confirmLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}