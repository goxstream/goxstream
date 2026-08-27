import type { Metadata } from "next";
import { BrowseClientPage } from "./components/browse-client-page";

export const metadata: Metadata = {
  title: "Browse Anime - GoxStream",
  description:
    "Explore and filter thousands of anime series, movies, and OVAs. Filter by genre, format, release status, audio, and year.",
};

export default function BrowsePage() {
  return <BrowseClientPage />;
}
