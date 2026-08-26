"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BrowsePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BrowsePagination({
  currentPage,
  totalPages,
  onPageChange,
}: BrowsePaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8 pb-4">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="size-9 rounded-xl border-border/80"
        aria-label="Previous Page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p) => {
          const isSelected = p === currentPage;
          return (
            <Button
              key={p}
              variant={isSelected ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(p)}
              className={`size-9 rounded-xl font-medium text-xs ${
                isSelected
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="size-9 rounded-xl border-border/80"
        aria-label="Next Page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
