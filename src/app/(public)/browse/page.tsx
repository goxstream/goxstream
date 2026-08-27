import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrowseClientPage } from "./components/browse-client-page";

export const metadata: Metadata = {
  title: "Browse Anime - GoxStream",
  description:
    "Explore and filter thousands of anime series, movies, and OVAs. Filter by genre, format, release status, audio, and year.",
};

export default function BrowsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <BrowseClientPage />
      <SiteFooter />
    </div>
  );
}
