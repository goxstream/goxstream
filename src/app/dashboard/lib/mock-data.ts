import type { WorkspaceItem, ActivityLogItem } from "../types";

export const WORKSPACES_DATA: WorkspaceItem[] = [
  {
    id: "prod",
    name: "GoxStream Production",
    plan: "Enterprise",
    role: "Owner",
  },
  {
    id: "staging",
    name: "Staging Edge Cluster",
    plan: "Developer",
    role: "Admin",
  },
  {
    id: "cdn",
    name: "Global CDN Hub",
    plan: "Infrastructure",
    role: "Maintainer",
  },
];

export const CURRENT_USER = {
  name: "Alexander Vance",
  email: "alexander@goxstream.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  role: "Lead Administrator",
};

export const TRAFFIC_DATA = [
  { time: "00:00", activeStreams: 1420, bandwidthGbps: 4.2 },
  { time: "03:00", activeStreams: 850, bandwidthGbps: 2.5 },
  { time: "06:00", activeStreams: 1100, bandwidthGbps: 3.1 },
  { time: "09:00", activeStreams: 2400, bandwidthGbps: 7.4 },
  { time: "12:00", activeStreams: 4800, bandwidthGbps: 14.8 },
  { time: "15:00", activeStreams: 6200, bandwidthGbps: 19.2 },
  { time: "18:00", activeStreams: 9800, bandwidthGbps: 29.5 },
  { time: "21:00", activeStreams: 12500, bandwidthGbps: 38.6 },
];

export const RECENT_ACTIVITIES: ActivityLogItem[] = [
  {
    id: "act-1",
    user: {
      name: "Daisuke Sato",
      email: "daisuke@encoder.gox",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    action: "Published Episode 14",
    target: "Jujutsu Kaisen Season 2",
    timestamp: "2 mins ago",
    status: "completed",
  },
  {
    id: "act-2",
    user: {
      name: "Elena Rostova",
      email: "elena@mod.gox",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    action: "Resolved Flagged Comment",
    target: "Chainsaw Man Ep 08",
    timestamp: "15 mins ago",
    status: "completed",
  },
  {
    id: "act-3",
    user: {
      name: "System Worker",
      email: "cron@cloudflare.worker",
      avatar: "",
    },
    action: "Auto-synced MAL Ratings",
    target: "128 Anime Titles",
    timestamp: "45 mins ago",
    status: "completed",
  },
  {
    id: "act-4",
    user: {
      name: "Kenji Takahashi",
      email: "kenji@goxstream.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    action: "Updated Player Source Node",
    target: "Server Node JP-TOK-02",
    timestamp: "1 hour ago",
    status: "pending",
  },
];

export const NOTIFICATIONS_DATA = [
  {
    id: "1",
    title: "New Episode Uploaded",
    description: "Jujutsu Kaisen S2 Ep 14 encoded successfully.",
    time: "5 mins ago",
    type: "success",
  },
  {
    id: "2",
    title: "CDN Traffic Spike Alert",
    description: "Edge node SG-01 reached 88% bandwidth threshold.",
    time: "20 mins ago",
    type: "alert",
  },
  {
    id: "3",
    title: "User Moderation Report",
    description: "3 new flagged comments awaiting review.",
    time: "1 hour ago",
    type: "info",
  },
];
