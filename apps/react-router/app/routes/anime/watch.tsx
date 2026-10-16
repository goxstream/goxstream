import { WatchContent } from "@/components/anime/watch/watch-content";

export function meta() {
  return [
    { title: "Watch Episode - ShionStream" },
    {
      name: "description",
      content:
        "Watch anime episodes with high quality streaming, multiple server options, and a full episode catalog on ShionStream.",
    },
  ];
}

export default function WatchEpisodePage() {
  return <WatchContent />;
}
