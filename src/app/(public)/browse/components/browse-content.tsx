"use client";

import { Suspense } from "react";
import { BrowseFilters } from "./browse-filters";
import { BrowseGrid } from "./browse-grid";
import { BrowsePagination } from "./browse-pagination";
import { useBrowseFilters } from "../hooks/use-browse-filters";

const dummyFn = () => {};

function BrowseContentSkeleton() {
  return (
    <div className="space-y-8">
      <BrowseFilters
        isLoading={true}
        query=""
        onQueryChange={dummyFn}
        genre="All"
        onGenreChange={dummyFn}
        status="All"
        onStatusChange={dummyFn}
        format="All"
        onFormatChange={dummyFn}
        audio="All"
        onAudioChange={dummyFn}
        season="All"
        onSeasonChange={dummyFn}
        year="All"
        onYearChange={dummyFn}
        sort="rating-desc"
        onSortChange={dummyFn}
        onResetFilters={dummyFn}
        activeFiltersCount={0}
      />
      <BrowseGrid
        isLoading={true}
        items={[]}
        totalResults={0}
        totalAnimeCount={0}
        viewMode="grid"
        onViewModeChange={dummyFn}
        onResetFilters={dummyFn}
      />
    </div>
  );
}

function BrowseContentInner() {
  const { filtersProps, gridProps, paginationProps, isLoading } = useBrowseFilters();

  return (
    <div className="space-y-8">
      <BrowseFilters {...filtersProps} isLoading={isLoading} />
      <BrowseGrid {...gridProps} isLoading={isLoading} />
      <BrowsePagination {...paginationProps} />
    </div>
  );
}

export function BrowseContent() {
  return (
    <Suspense fallback={<BrowseContentSkeleton />}>
      <BrowseContentInner />
    </Suspense>
  );
}
