"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBrowseFilters } from "../hooks/use-browse-filters";
import { BrowseFilters } from "./browse-filters";
import { BrowseGrid } from "./browse-grid";
import { BrowsePagination } from "./browse-pagination";

export function BrowseClientPage() {
  const { filtersProps, gridProps, paginationProps, isLoading } =
    useBrowseFilters();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <BrowseFilters {...filtersProps} />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <BrowseGrid {...gridProps} />
        )}

        <BrowsePagination {...paginationProps} />
      </main>
    </div>
  );
}
