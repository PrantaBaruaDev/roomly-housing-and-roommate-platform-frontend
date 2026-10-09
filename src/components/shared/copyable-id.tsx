"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyableId({
  id,
  label,
  className,
}: {
  id: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API blocked 
      // user copies manually.
    }
  }

  const short = id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
    >
      {label && <span className="shrink-0">{label}</span>}
      <span
        className="truncate font-mono-plan text-[11px]"
        title={id}
      >
        {short}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label ?? "ID"}`}
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3 w-3 text-moss" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}