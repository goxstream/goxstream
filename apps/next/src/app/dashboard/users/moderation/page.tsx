"use client";

import { useModerationQueue } from "./hooks/use-moderation-queue";
import { ModerationHeader } from "./components/moderation-header";
import { ModerationStats } from "./components/moderation-stats";
import { ModerationTable } from "./components/moderation-table";
import { ModerationActionModal } from "./components/moderation-action-modal";

export default function ModerationQueuePage() {
  const {
    reports,
    selectedReport,
    isModalOpen,
    setIsModalOpen,
    handleClearDismissed,
    handleOpenActionModal,
    handleApproveReport,
    handleConfirmAction,
  } = useModerationQueue();

  return (
    <div className="flex flex-col gap-6 p-6">
      <ModerationHeader onClearDismissed={handleClearDismissed} />
      <ModerationStats reports={reports} />
      <ModerationTable
        reports={reports}
        onOpenActionModal={handleOpenActionModal}
        onApproveReport={handleApproveReport}
      />
      <ModerationActionModal
        report={selectedReport}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirmAction={handleConfirmAction}
      />
    </div>
  );
}
