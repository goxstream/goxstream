import type { WorkspaceItem, ActivityLogItem } from "@/app/dashboard/types";

/**
 * Maps raw database serverNode record into WorkspaceItem format
 */
export function mapToWorkspaceItem(sn: any): WorkspaceItem {
  return {
    id: sn.id,
    name: sn.name || "GoxStream Hub",
    plan: sn.provider || "Standard",
    role: sn.region || "Region",
  };
}

/**
 * Helper to get a relative "time ago" string from a date
 */
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/**
 * Maps latest episodes and comments into a unified ActivityLogItem format
 */
export function mapToActivityLogItem(raw: { type: "episode" | "comment"; data: any }): ActivityLogItem {
  if (raw.type === "episode") {
    const ep = raw.data;
    return {
      id: `act-ep-${ep.id}`,
      user: {
        name: "System Worker",
        email: "cron@cloudflare.worker",
        avatar: "",
      },
      action: "Published Episode",
      target: `${ep.anime?.titleEnglish || ep.anime?.titleRomaji || "Anime"} Ep ${ep.number}`,
      timestamp: ep.createdAt ? timeAgo(new Date(ep.createdAt)) : "Recently",
      status: "completed",
    };
  } else {
    const c = raw.data;
    return {
      id: `act-comm-${c.id}`,
      user: {
        name: c.guestName || "Guest Otaku",
        email: c.userId ? "user@goxstream.com" : "guest@goxstream.com",
        avatar: "",
      },
      action: "Resolved Flagged Comment",
      target: c.content ? (c.content.length > 30 ? c.content.slice(0, 30) + "..." : c.content) : "Comment",
      timestamp: c.createdAt ? timeAgo(new Date(c.createdAt)) : "Recently",
      status: "completed",
    };
  }
}

/**
 * Aggregates 24 hours of watch history data into 3-hour traffic blocks
 */
export function mapToTrafficData(watchHistories: any[]): Array<{ time: string; activeStreams: number; bandwidthGbps: number }> {
  const intervals = [
    { time: "00:00", hourStart: 0, hourEnd: 3, activeStreams: 0, bandwidthGbps: 0 },
    { time: "03:00", hourStart: 3, hourEnd: 6, activeStreams: 0, bandwidthGbps: 0 },
    { time: "06:00", hourStart: 6, hourEnd: 9, activeStreams: 0, bandwidthGbps: 0 },
    { time: "09:00", hourStart: 9, hourEnd: 12, activeStreams: 0, bandwidthGbps: 0 },
    { time: "12:00", hourStart: 12, hourEnd: 15, activeStreams: 0, bandwidthGbps: 0 },
    { time: "15:00", hourStart: 15, hourEnd: 18, activeStreams: 0, bandwidthGbps: 0 },
    { time: "18:00", hourStart: 18, hourEnd: 21, activeStreams: 0, bandwidthGbps: 0 },
    { time: "21:00", hourStart: 21, hourEnd: 24, activeStreams: 0, bandwidthGbps: 0 },
  ];

  watchHistories.forEach((h) => {
    if (!h.lastWatchedAt) return;
    const date = new Date(h.lastWatchedAt);
    const hour = date.getHours();

    const interval = intervals.find((i) => hour >= i.hourStart && hour < i.hourEnd);
    if (interval) {
      interval.activeStreams += 1;
    }
  });

  return intervals.map((i) => {
    const streams = i.activeStreams;
    const bandwidth = Number((streams * 0.003).toFixed(2));
    return {
      time: i.time,
      activeStreams: streams,
      bandwidthGbps: bandwidth,
    };
  });
}

/**
 * Generates dynamic notifications using real stats and latest content uploads
 */
export function generateDynamicNotifications(
  latestEpisode: any,
  commentsCount: number,
  nodesCount: number
): Array<{ id: string; title: string; description: string; time: string; type: "success" | "alert" | "info" }> {
  const notifications: any[] = [];

  if (latestEpisode) {
    notifications.push({
      id: "notif-1",
      title: "New Episode Uploaded",
      description: `${latestEpisode.anime?.titleEnglish || latestEpisode.anime?.titleRomaji || "Anime"} Ep ${latestEpisode.number} successfully added.`,
      time: latestEpisode.createdAt ? timeAgo(new Date(latestEpisode.createdAt)) : "Recently",
      type: "success",
    });
  }

  notifications.push({
    id: "notif-2",
    title: "CDN Node Status",
    description: `Global Edge Network is active with ${nodesCount} online CDN nodes.`,
    time: "Just now",
    type: "info",
  });

  notifications.push({
    id: "notif-3",
    title: "User Moderation Reports",
    description: `${commentsCount} total comments in comments moderation database.`,
    time: "Just now",
    type: "alert",
  });

  return notifications;
}
