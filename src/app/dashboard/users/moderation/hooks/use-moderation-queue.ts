import { useState, useEffect } from "react";
import { useDashboardModeration } from "@/hooks/use-dashboard-moderation";
import type { ReportedComment } from "../types";

export function useModerationQueue() {
  const { reports: fetchedReports } = useDashboardModeration();
  const [reports, setReports] = useState<ReportedComment[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportedComment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (fetchedReports) {
      setReports(fetchedReports);
    }
  }, [fetchedReports]);


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
    _duration?: string,
    _moderatorNote?: string
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

  return {
    reports,
    selectedReport,
    isModalOpen,
    setIsModalOpen,
    handleClearDismissed,
    handleOpenActionModal,
    handleApproveReport,
    handleConfirmAction,
  };
}
