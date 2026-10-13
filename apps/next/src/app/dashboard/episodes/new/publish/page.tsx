"use client";

import { useEpisodeForm } from "../context/episode-form-context";
import { PublishScheduleStep } from "../components/publish-schedule-step";
import { StudioFooterNav } from "../components/studio-footer-nav";

export default function PublishPage() {
  const { status, setStatus, notifySubscribers, setNotifySubscribers } = useEpisodeForm();

  return (
    <>
      <PublishScheduleStep
        status={status}
        notifySubscribers={notifySubscribers}
        onStatusChange={setStatus}
        onNotifyChange={setNotifySubscribers}
      />
      <StudioFooterNav />
    </>
  );
}
