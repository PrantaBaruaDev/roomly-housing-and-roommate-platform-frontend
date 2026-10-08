"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OwnerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Owner error boundary]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-display text-xl">Owner portal hit an error</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Failed to load this page. Try again."}
      </p>
      <Button onClick={reset} size="sm" className="mt-6">
        <RotateCcw className="mr-1 h-4 w-4" /> Try again
      </Button>
      {error.digest && (
        <p className="mt-6 font-mono-plan text-[10px] text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}