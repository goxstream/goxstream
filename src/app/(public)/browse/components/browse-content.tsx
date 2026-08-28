"use client";

import { BrowseFilters } from "./browse-filters";
import { BrowseGrid } from "./browse-grid";
import { BrowsePagination } from "./browse-pagination";
import { useBrowseFilters } from "../hooks/use-browse-filters";

interface BrowseContentProps {
  isLoading?: boolean;
}

export function BrowseContent({ isLoading: forcedLoading }: BrowseContentProps = {}) {
  const { filtersProps, gridProps, paginationProps, isLoading: hookLoading } = useBrowseFilters();
  const loading = forcedLoading || hookLoading;

  return (
    <div className="space-y-8">
      <BrowseFilters {...filtersProps} isLoading={loading} />
      <BrowseGrid {...gridProps} isLoading={loading} />
      <BrowsePagination {...paginationProps} />
    </div>
  );
}
