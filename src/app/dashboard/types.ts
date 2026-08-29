import type { LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  badge?: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
  items?: NavSubItem[];
}

export interface DashboardStatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  icon: LucideIcon;
}

export interface ActivityLogItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}
