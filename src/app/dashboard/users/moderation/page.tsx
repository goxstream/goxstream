"use client";

import { useState } from "react";
import { ModerationHeader } from "./components/moderation-header";
import { ModerationStats } from "./components/moderation-stats";
import { ModerationTable } from "./components/moderation-table";
import { ModerationActionModal } from "./components/moderation-action-modal";
import { MOCK_MODERATION_QUEUE } from "./constants";
import type { ReportedComment } from "./types";

export default function ModerationQueuePage() {
  const [reports, setReports] = useState<ReportedComment[]>(MOCK_MODERATION_QUEUE);
  const [selectedReport, setSelectedReport] = useState<ReportedComment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearDismissed = () => {
    setReports((prev) => prev.filter((r) => r.status !== "dismissed"));
  };

  const handleOpenActionModal = (report: ReportedComment) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleApproveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "dismissed" } : r))
    );
  };

  const handleConfirmAction = (
    reportId: string,
    actionType: "delete" | "mute" | "dismiss",
    _duration?: string
  ) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: actionType === "dismiss" ? "dismissed" : "resolved",
            }
          : r
      )
    );
  };

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
