"use client";

import { useEpisodeForm } from "../context/episode-form-context";
import { SubtitlesAudioStep } from "../components/subtitles-audio-step";
import { StudioFooterNav } from "../components/studio-footer-nav";

export default function SubtitlesAudioPage() {
  const {
    subtitles,
    audioTracks,
    handleAddSubtitle,
    handleRemoveSubtitle,
    handleUpdateSubtitle,
    handleAddAudio,
    handleRemoveAudio,
    handleUpdateAudio,
  } = useEpisodeForm();

  return (
    <>
      <SubtitlesAudioStep
        subtitles={subtitles}
        audioTracks={audioTracks}
        onAddSubtitle={handleAddSubtitle}
        onRemoveSubtitle={handleRemoveSubtitle}
        onUpdateSubtitle={handleUpdateSubtitle}
        onAddAudio={handleAddAudio}
        onRemoveAudio={handleRemoveAudio}
        onUpdateAudio={handleUpdateAudio}
      />
      <StudioFooterNav />
    </>
  );
}
