import { BrowseHeader } from "@/components/browse/browse-header";
import { BrowseContent } from "@/components/browse/browse-content";

export function meta() {
  return [
    { title: "Browse Anime Catalog - GoxStream" },
    {
      name: "description",
      content:
        "Explore and filter thousands of anime series, movies, and OVAs. Filter by genre, format, release status, audio, and year.",
    },
  ];
}

export default function BrowsePage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <BrowseHeader />
      <BrowseContent />
    </div>
  );
}
