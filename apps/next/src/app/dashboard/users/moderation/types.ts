export type ReportReason = "spoiler" | "hate_speech" | "spam_link" | "harassment" | "other";

export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface ReportedComment {
  id: string;
  commentId: string;
  commentText: string;
  animeTitle: string;
  episodeNumber: number;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  reporter: {
    id: string;
    name: string;
    username: string;
  };
  reason: ReportReason;
  status: ReportStatus;
  reportedAt: string;
  flaggedBySystem: boolean;
}

export interface ModerationStats {
  pendingCount: number;
  resolvedTodayCount: number;
  autoFlaggedCount: number;
  avgResolutionMinutes: number;
}
