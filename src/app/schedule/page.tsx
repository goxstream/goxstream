import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScheduleContent } from "./components/schedule-content";

export const metadata: Metadata = {
  title: "Anime Release Schedule | GoxStream",
  description:
    "Track weekly simulcast anime episode release times in real-time with WIB (UTC+7) timezone. Never miss an episode drop on GoxStream.",
  openGraph: {
    title: "Anime Release Schedule | GoxStream",
    description: "Track weekly simulcast anime episode release times in real-time.",
  },
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">
        <ScheduleContent />
      </main>
      <SiteFooter />
    </div>
  );
}
