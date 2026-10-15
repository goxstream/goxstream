"use client";

import { MediaPlayer, MediaOutlet, MediaPoster } from "@vidstack/react";

interface VideoPlayerClientProps {
  title: string;
  src: string;
  poster: string;
}

export default function VideoPlayerClient({ title, src, poster }: VideoPlayerClientProps) {
  return (
    <MediaPlayer
      title={title}
      src={src}
      controls
      aspectRatio={16 / 9}
      className="h-full w-full overflow-hidden font-sans text-white"
    >
      <MediaOutlet>
        <MediaPoster
          src={poster}
          alt={title}
          className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
      </MediaOutlet>
    </MediaPlayer>
  );
}
