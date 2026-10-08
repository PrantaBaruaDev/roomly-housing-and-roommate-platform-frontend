"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

export function DataPagination({
  meta,
  onPageChange,
  currentPage,
  className,
}: {
  meta: PaginationMeta | undefined;
  onPageChange: (page: number) => void;
  currentPage?: number;
  className?: string;
}) {
  if (!meta) return null;

  const { limit, total, totalPages } = meta;
  const activePage = currentPage ?? meta.page;
  const from = (activePage - 1) * limit + 1;
  const to = Math.min(activePage * limit, total);
  const range = getPageRange(activePage, totalPages);

  return (
    <div className={cn("mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2"
          disabled={activePage <= 1}
          onClick={() => onPageChange(activePage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {range.map((item, i) =>
          item === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-xs text-muted-foreground" aria-hidden>…</span>
          ) : (
            <Button
              key={item}
              variant={item === activePage ? "default" : "outline"}
              size="sm"
              className="h-8 min-w-8 px-2"
              onClick={() => onPageChange(item)}
              aria-current={item === activePage ? "page" : undefined}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2"
          disabled={activePage >= totalPages}
          onClick={() => onPageChange(activePage + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}