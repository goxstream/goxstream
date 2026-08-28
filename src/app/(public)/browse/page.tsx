import { Suspense } from "react";
import type { Metadata } from "next";
import { BrowseHeader } from "./components/browse-header";
import { BrowseContent } from "./components/browse-content";

export const metadata: Metadata = {
  title: "Browse Anime - GoxStream",
  description:
    "Explore and filter thousands of anime series, movies, and OVAs. Filter by genre, format, release status, audio, and year.",
};

export default function BrowsePage() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      <BrowseHeader />
      <Suspense fallback={<BrowseContent isLoading={true} />}>
        <BrowseContent />
      </Suspense>
    </div>
  );
}
