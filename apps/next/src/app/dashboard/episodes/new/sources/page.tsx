"use client";

import { useEpisodeForm } from "../context/episode-form-context";
import { VideoSourcesStep } from "../components/video-sources-step";
import { StudioFooterNav } from "../components/studio-footer-nav";

export default function VideoSourcesPage() {
  const { servers, handleAddServer, handleRemoveServer, handleUpdateServer } = useEpisodeForm();

  return (
    <>
      <VideoSourcesStep
        servers={servers}
        onAddServer={handleAddServer}
        onRemoveServer={handleRemoveServer}
        onUpdateServer={handleUpdateServer}
      />
      <StudioFooterNav />
    </>
  );
}
