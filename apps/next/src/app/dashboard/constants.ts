import {
  LayoutDashboard,
  Film,
  PlaySquare,
  Users,
  BarChart3,
  Settings,
  ShieldAlert,
} from "lucide-react";
import type { NavItem } from "./types";
import type { ChartConfig } from "@/components/ui/chart";

export const NAV_MAIN_DATA: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Anime Catalog",
    url: "/dashboard/anime",
    icon: Film,
    badge: "1,248",
    items: [
      { title: "All Anime List", url: "/dashboard/anime" },
      { title: "Categories & Genres", url: "/dashboard/anime/categories" },
      { title: "Season Schedule", url: "/dashboard/anime/seasons" },
    ],
  },
  {
    title: "Episodes",
    url: "/dashboard/episodes",
    icon: PlaySquare,
    badge: "8,920",
  },
  {
    title: "User Management",
    url: "/dashboard/users",
    icon: Users,
    badge: "45k",
    items: [
      { title: "User Directory", url: "/dashboard/users" },
      { title: "Moderation Queue", url: "/dashboard/users/moderation", badge: "12" },
      { title: "Roles & Access", url: "/dashboard/users/roles" },
    ],
  },
];

export const NAV_SECONDARY_DATA: NavItem[] = [
  {
    title: "Analytics & CDN",
    url: "/dashboard/analytics",
    icon: BarChart3,
    badge: "Live",
  },
  {
    title: "Platform Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Security Logs",
    url: "/dashboard/logs",
    icon: ShieldAlert,
    badge: "Audit",
  },
];

export const TRAFFIC_CHART_CONFIG = {
  activeStreams: {
    label: "Active Viewers",
    color: "var(--brand, #34d094)",
  },
  bandwidthGbps: {
    label: "Bandwidth (Gbps)",
    color: "#31ffe7",
  },
} satisfies ChartConfig;
