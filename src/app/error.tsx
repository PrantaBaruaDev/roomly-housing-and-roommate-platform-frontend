"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root error boundary]", error);
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message ||
            "An unexpected error occurred. Try refreshing the page."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset} size="sm">
            <RotateCcw className="mr-1 h-4 w-4" /> Try again
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/">
              <Home className="mr-1 h-4 w-4" /> Go home
            </Link>
          </Button>
        </div>
        {error.digest && (
          <p className="mt-6 font-mono-plan text-[10px] text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}