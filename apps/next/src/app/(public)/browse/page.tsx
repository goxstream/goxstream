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
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <BrowseHeader />
      <BrowseContent />
    </div>
  );
}
