import type { Metadata } from "next";
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
  return <ScheduleContent />;
}
