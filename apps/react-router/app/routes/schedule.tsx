import { ScheduleContent } from "@/components/schedule/schedule-content";

export function meta() {
  return [
    { title: "Anime Release Schedule - ShionStream" },
    {
      name: "description",
      content:
        "Track weekly simulcast anime episode release times in real-time. Never miss an episode drop on ShionStream.",
    },
  ];
}

export default function SchedulePage() {
  return <ScheduleContent />;
}
