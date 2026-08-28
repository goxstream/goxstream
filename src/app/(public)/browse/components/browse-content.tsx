"use client";

import { BrowseFilters } from "./browse-filters";
import { BrowseGrid } from "./browse-grid";
import { BrowsePagination } from "./browse-pagination";
import { useBrowseFilters } from "../hooks/use-browse-filters";

export function BrowseContent() {
  const { filtersProps, gridProps, paginationProps, isLoading } = useBrowseFilters();

  return (
    <div className="space-y-8">
      <BrowseFilters {...filtersProps} isLoading={isLoading} />
      <BrowseGrid {...gridProps} isLoading={isLoading} />
      <BrowsePagination {...paginationProps} />
    </div>
  );
}
