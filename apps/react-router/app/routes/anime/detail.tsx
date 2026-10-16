import { AnimeDetailsContent } from "@/components/anime/detail/anime-details-content";

export function meta() {
  return [
    { title: "Anime Details - ShionStream" },
    {
      name: "description",
      content:
        "Watch anime series and movies with high quality streaming and full episode catalog on ShionStream.",
    },
  ];
}

export default function AnimeDetailPage() {
  return <AnimeDetailsContent />;
}
