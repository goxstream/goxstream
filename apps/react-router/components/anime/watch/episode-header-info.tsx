import type { AnimeItem, EpisodeItem, StreamSource } from "@/types/anime";
import { EpisodeTitleNav } from "./header-info/episode-title-nav";
import { StreamServerBar } from "./header-info/stream-server-bar";
import { EpisodeActionBar } from "./header-info/episode-action-bar";
import { EpisodeSynopsisBox } from "./header-info/episode-synopsis-box";

interface EpisodeHeaderInfoProps {
  anime: AnimeItem;
  episode: EpisodeItem;
  sources: StreamSource[];
  activeSourceId: string;
  onSelectSource: (sourceId: string) => void;
  prevEpisode?: EpisodeItem;
  nextEpisode?: EpisodeItem;
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
}

export function EpisodeHeaderInfo({
  anime,
  episode,
  sources,
  activeSourceId,
  onSelectSource,
  prevEpisode,
  nextEpisode,
  isCinemaMode,
  onToggleCinemaMode,
}: EpisodeHeaderInfoProps) {
  return (
    <div className="border-border/60 flex flex-col gap-5 border-b py-4">
      <EpisodeTitleNav
        anime={anime}
        episode={episode}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
      />

      <StreamServerBar
        sources={sources}
        activeSourceId={activeSourceId}
        onSelectSource={onSelectSource}
      />

      <EpisodeActionBar
        anime={anime}
        isCinemaMode={isCinemaMode}
        onToggleCinemaMode={onToggleCinemaMode}
      />

      <EpisodeSynopsisBox synopsis={anime.synopsis} />
    </div>
  );
}
