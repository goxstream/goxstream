"use client";

import { BrowseHeader } from "./components/browse-header";
import { BrowseFilters } from "./components/browse-filters";
import { BrowseGrid } from "./components/browse-grid";
import { BrowsePagination } from "./components/browse-pagination";
import { useBrowseFilters } from "./hooks/use-browse-filters";

export default function BrowsePage() {
  const { filtersProps, gridProps, paginationProps, isLoading } = useBrowseFilters();

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Header Section */}
      <BrowseHeader />

      {/* 2. Filter Controls Section */}
      <BrowseFilters {...filtersProps} isLoading={isLoading} />

      {/* 3. Anime Library Grid Section */}
      <BrowseGrid {...gridProps} isLoading={isLoading} />

      {/* 4. Pagination Navigation */}
      <BrowsePagination {...paginationProps} />
    </div>
  );
}
